import { create } from "zustand";
import { getJSON, setJSON, nextId } from "../db/storage";
import { DEFAULT_TIMER_PRESETS } from "../data/presets";
import type { TimerPreset } from "../types";

type ActiveTimer = {
  presetId: number;
  currentRound: number;
  isResting: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
};

type TimerState = {
  presets: TimerPreset[];
  activeTimer: ActiveTimer | null;
  defaultPresets: TimerPreset[];

  createCustomPreset: (
    name: string,
    roundSeconds: number,
    restSeconds: number,
    numRounds: number,
    warmupSeconds: number,
    tenSecondWarning: boolean,
    bellSound: TimerPreset["bellSound"],
    warningSound: TimerPreset["warningSound"]
  ) => void;
  updatePreset: (id: number, updates: Partial<TimerPreset>) => void;
  deletePreset: (id: number) => void;
  getPreset: (id: number) => TimerPreset | undefined;
  setDefaultPreset: (id: number) => void;
  startTimer: (presetId: number) => void;
  updateTimerRound: (roundNumber: number) => void;
  updateTimerResting: (isResting: boolean) => void;
  updateTimerPaused: (isPaused: boolean) => void;
  updateTimerElapsed: (seconds: number) => void;
  stopTimer: () => void;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const useTimerStore = create<TimerState>((set, get) => ({
  presets: [...DEFAULT_TIMER_PRESETS],
  activeTimer: null,
  defaultPresets: DEFAULT_TIMER_PRESETS,

  createCustomPreset: (
    name,
    roundSeconds,
    restSeconds,
    numRounds,
    warmupSeconds,
    tenSecondWarning,
    bellSound,
    warningSound
  ) => {
    const preset: TimerPreset = {
      id: nextId(),
      name,
      roundSeconds,
      restSeconds,
      numRounds,
      warmupSeconds,
      tenSecondWarning,
      bellSound,
      warningSound,
      isDefault: false,
      isCustom: true,
      createdAt: Date.now(),
    };
    set((s) => ({ presets: [...s.presets, preset] }));
    get().persistToMMKV();
  },
  updatePreset: (id, updates) => {
    set((s) => ({
      presets: s.presets.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
    get().persistToMMKV();
  },
  deletePreset: (id) => {
    set((s) => ({
      presets: s.presets.filter((p) => p.id !== id || !p.isCustom),
    }));
    get().persistToMMKV();
  },
  getPreset: (id) => get().presets.find((p) => p.id === id),
  setDefaultPreset: (id) => {
    set((s) => ({
      presets: s.presets.map((p) => ({ ...p, isDefault: p.id === id })),
    }));
    get().persistToMMKV();
  },
  startTimer: (presetId) => {
    set({
      activeTimer: {
        presetId,
        currentRound: 1,
        isResting: false,
        isPaused: false,
        elapsedSeconds: 0,
      },
    });
  },
  updateTimerRound: (roundNumber) => {
    set((s) => {
      if (!s.activeTimer) return s;
      return { activeTimer: { ...s.activeTimer, currentRound: roundNumber } };
    });
  },
  updateTimerResting: (isResting) => {
    set((s) => {
      if (!s.activeTimer) return s;
      return { activeTimer: { ...s.activeTimer, isResting } };
    });
  },
  updateTimerPaused: (isPaused) => {
    set((s) => {
      if (!s.activeTimer) return s;
      return { activeTimer: { ...s.activeTimer, isPaused } };
    });
  },
  updateTimerElapsed: (seconds) => {
    set((s) => {
      if (!s.activeTimer) return s;
      return { activeTimer: { ...s.activeTimer, elapsedSeconds: seconds } };
    });
  },
  stopTimer: () => {
    set({ activeTimer: null });
  },

  loadFromMMKV: () => {
    const saved = getJSON<TimerPreset[]>("timer_presets", []);
    const presets =
      saved.length > 0
        ? [...DEFAULT_TIMER_PRESETS, ...saved.filter((p) => p.isCustom)]
        : [...DEFAULT_TIMER_PRESETS];
    set({ presets });
  },
  persistToMMKV: () => {
    const custom = get().presets.filter((p) => p.isCustom);
    setJSON("timer_presets", custom);
  },
}));
