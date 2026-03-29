import { create } from "zustand";
import { getJSON, setJSON, nextId } from "../db/storage";
import { toLocalDateKey } from "../lib/date";
import { estimatePunchCount } from "../lib/combo-engine";
import type {
  ActiveComboSession,
  Combo,
  ComboSessionConfig,
  TrainingSession,
  SessionType,
} from "../types";

type SessionState = {
  activeSession: ActiveComboSession | null;
  trainingHistory: TrainingSession[];
  isSessionActive: boolean;

  startComboSession: (config: ComboSessionConfig) => void;
  calloutCombo: (comboId: string, roundNumber: number) => void;
  updateSessionRound: (roundNumber: number) => void;
  updateSessionResting: (isResting: boolean) => void;
  updateSessionPaused: (isPaused: boolean) => void;
  updateSessionStats: (
    totalPunches: number,
    headShots: number,
    bodyShots: number,
    powerPunches: number,
    speedPunches: number
  ) => void;
  completeComboSession: (allCombos: Combo[]) => TrainingSession | null;
  abandonComboSession: () => void;
  addTrainingSession: (session: TrainingSession) => void;
  updateTrainingSession: (id: number, updates: Partial<TrainingSession>) => void;
  deleteTrainingSession: (id: number) => void;
  getTrainingHistory: () => TrainingSession[];
  getSessionsByType: (type: SessionType) => TrainingSession[];
  getSessionsByDateRange: (startDate: string, endDate: string) => TrainingSession[];
  getHistoryGrouped: () => { month: string; sessions: TrainingSession[] }[];
  getTotalStats: () => {
    totalSessions: number;
    totalRounds: number;
    totalHours: number;
    avgPerWeek: number;
  };
  getRecentSessions: (limit: number) => TrainingSession[];
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  activeSession: null,
  trainingHistory: [],
  isSessionActive: false,

  startComboSession: (config) => {
    const session: ActiveComboSession = {
      id: nextId(),
      config,
      startedAt: Date.now(),
      currentRound: 0,
      isResting: false,
      isPaused: false,
      combosCalledOut: [],
      totalPunchesEstimated: 0,
      headShotsEstimated: 0,
      bodyShotsEstimated: 0,
      powerPunchesEstimated: 0,
      speedPunchesEstimated: 0,
      status: "active",
    };
    set({ activeSession: session, isSessionActive: true });
    setJSON("active_session", session);
  },

  calloutCombo: (comboId, roundNumber) => {
    set((s) => {
      if (!s.activeSession) return s;
      return {
        activeSession: {
          ...s.activeSession,
          combosCalledOut: [
            ...s.activeSession.combosCalledOut,
            { comboId, calledAt: Date.now(), round: roundNumber },
          ],
        },
      };
    });
  },

  updateSessionRound: (roundNumber) => {
    set((s) => {
      if (!s.activeSession) return s;
      return {
        activeSession: { ...s.activeSession, currentRound: roundNumber },
      };
    });
  },

  updateSessionResting: (isResting) => {
    set((s) => {
      if (!s.activeSession) return s;
      return { activeSession: { ...s.activeSession, isResting } };
    });
  },

  updateSessionPaused: (isPaused) => {
    set((s) => {
      if (!s.activeSession) return s;
      return { activeSession: { ...s.activeSession, isPaused } };
    });
  },

  updateSessionStats: (totalPunches, headShots, bodyShots, powerPunches, speedPunches) => {
    set((s) => {
      if (!s.activeSession) return s;
      return {
        activeSession: {
          ...s.activeSession,
          totalPunchesEstimated: totalPunches,
          headShotsEstimated: headShots,
          bodyShotsEstimated: bodyShots,
          powerPunchesEstimated: powerPunches,
          speedPunchesEstimated: speedPunches,
        },
      };
    });
  },

  completeComboSession: (allCombos) => {
    const { activeSession } = get();
    if (!activeSession) return null;

    const now = Date.now();
    const durationSeconds = Math.round((now - activeSession.startedAt) / 1000);
    const punchEstimate = estimatePunchCount(activeSession.combosCalledOut, allCombos);

    const trainingSession: TrainingSession = {
      id: nextId(),
      sessionType: "heavy_bag",
      date: toLocalDateKey(new Date()),
      startedAt: activeSession.startedAt,
      durationSeconds,
      rounds: activeSession.config.numRounds,
      intensity: "moderate",
      energyRating: 0,
      sharpnessRating: 0,
      notes: "",
      comboSessionId: activeSession.id,
      timerPresetId: null,
      comboModeUsed: true,
      partnerName: null,
      coachName: null,
      distanceMeters: null,
      routeDescription: null,
      conditioningType: null,
      xpEarned: 60,
      createdAt: now,
    };

    set((s) => ({
      activeSession: null,
      isSessionActive: false,
      trainingHistory: [trainingSession, ...s.trainingHistory],
    }));
    setJSON("active_session", null);
    get().persistToMMKV();

    return trainingSession;
  },

  abandonComboSession: () => {
    set({ activeSession: null, isSessionActive: false });
    setJSON("active_session", null);
  },

  addTrainingSession: (session) => {
    set((s) => ({
      trainingHistory: [session, ...s.trainingHistory],
    }));
    get().persistToMMKV();
  },

  updateTrainingSession: (id, updates) => {
    set((s) => ({
      trainingHistory: s.trainingHistory.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
    get().persistToMMKV();
  },

  deleteTrainingSession: (id) => {
    set((s) => ({
      trainingHistory: s.trainingHistory.filter((t) => t.id !== id),
    }));
    get().persistToMMKV();
  },

  getTrainingHistory: () => get().trainingHistory,
  getSessionsByType: (type) =>
    get().trainingHistory.filter((t) => t.sessionType === type),
  getSessionsByDateRange: (startDate, endDate) =>
    get().trainingHistory.filter(
      (t) => t.date >= startDate && t.date <= endDate
    ),

  getHistoryGrouped: () => {
    const history = get().trainingHistory;
    const grouped: Map<string, TrainingSession[]> = new Map();
    for (const s of history) {
      const month = s.date.slice(0, 7); // "YYYY-MM"
      if (!grouped.has(month)) grouped.set(month, []);
      grouped.get(month)!.push(s);
    }
    return Array.from(grouped.entries()).map(([month, sessions]) => ({
      month,
      sessions,
    }));
  },

  getTotalStats: () => {
    const history = get().trainingHistory;
    const totalSessions = history.length;
    const totalRounds = history.reduce((sum, s) => sum + (s.rounds ?? 0), 0);
    const totalSeconds = history.reduce((sum, s) => sum + s.durationSeconds, 0);
    const totalHours = Math.round((totalSeconds / 3600) * 10) / 10;

    // Avg per week: sessions / weeks since first session
    let avgPerWeek = 0;
    if (history.length > 0) {
      const oldest = history[history.length - 1].date;
      const newest = history[0].date;
      const oldestMs = new Date(oldest + "T00:00:00").getTime();
      const newestMs = new Date(newest + "T00:00:00").getTime();
      const weeks = Math.max(1, (newestMs - oldestMs) / (7 * 24 * 60 * 60 * 1000));
      avgPerWeek = Math.round((totalSessions / weeks) * 10) / 10;
    }

    return { totalSessions, totalRounds, totalHours, avgPerWeek };
  },

  getRecentSessions: (limit) => get().trainingHistory.slice(0, limit),

  loadFromMMKV: () => {
    const activeSession = getJSON<ActiveComboSession | null>("active_session", null);
    const trainingHistory = getJSON<TrainingSession[]>("training_history", []);
    set({
      activeSession,
      trainingHistory,
      isSessionActive: activeSession?.status === "active",
    });
  },
  persistToMMKV: () => {
    const { activeSession, trainingHistory } = get();
    setJSON("active_session", activeSession);
    setJSON("training_history", trainingHistory);
  },
}));
