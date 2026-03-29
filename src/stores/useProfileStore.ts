import { create } from "zustand";
import { getJSON, setJSON, nextId } from "../db/storage";
import type {
  Achievement,
  BoxerType,
  Rank,
  UserProfile,
  WeightClass,
  XPEntry,
  XPSource,
} from "../types";

const RANK_THRESHOLDS: { rank: Rank; xp: number }[] = [
  { rank: "undisputed", xp: 15000 },
  { rank: "champion", xp: 7000 },
  { rank: "challenger", xp: 3500 },
  { rank: "contender", xp: 1500 },
  { rank: "prospect", xp: 500 },
  { rank: "rookie", xp: 0 },
];

type ProfileState = {
  profile: UserProfile | null;
  xpHistory: XPEntry[];
  achievements: Achievement[];
  currentRank: Rank;

  initializeProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateName: (name: string) => void;
  updateFightName: (fightName: string | null) => void;
  updateStance: (stance: UserProfile["stance"]) => void;
  updateExperienceLevel: (level: UserProfile["experienceLevel"]) => void;
  updatePhysicalStats: (
    weight: number | null,
    height: number | null,
    reach: number | null,
    weightClass: WeightClass | null
  ) => void;
  addXP: (amount: number, source: XPSource, description: string) => void;
  updateStreak: (days: number, multiplier: number) => void;
  getStreakMultiplier: (days: number) => number;
  getRankFromXP: (xp: number) => Rank;
  unlockAchievement: (achievementId: string) => void;
  updateCalloutPreferences: (
    calloutStyle: UserProfile["calloutStyle"],
    bellSound: UserProfile["bellSound"],
    warningSound: UserProfile["warningSound"]
  ) => void;
  updateAudioSettings: (
    ttsRate: number,
    ttsPitch: number,
    masterVolume: number,
    bellVolume: number,
    calloutVolume: number
  ) => void;
  updateHapticsEnabled: (enabled: boolean) => void;
  setTrainingReminder: (time: string | null) => void;
  updateLastTrainingDate: (date: string) => void;
  setActiveFightCamp: (campId: number | null) => void;
  setActiveProgram: (programId: string | null) => void;
  setBoxerType: (boxerType: BoxerType | null) => void;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  xpHistory: [],
  achievements: [],
  currentRank: "rookie",

  initializeProfile: (profile) => {
    set({
      profile,
      xpHistory: profile.xpHistory,
      achievements: profile.achievements,
      currentRank: get().getRankFromXP(profile.totalXP),
    });
    get().persistToMMKV();
  },
  updateProfile: (updates) => {
    set((s) => {
      if (!s.profile) return s;
      const updated = { ...s.profile, ...updates };
      return { profile: updated, currentRank: get().getRankFromXP(updated.totalXP) };
    });
    get().persistToMMKV();
  },
  updateName: (name) => get().updateProfile({ name }),
  updateFightName: (fightName) => get().updateProfile({ fightName }),
  updateStance: (stance) => get().updateProfile({ stance }),
  updateExperienceLevel: (experienceLevel) =>
    get().updateProfile({ experienceLevel }),
  updatePhysicalStats: (weight, height, reach, activeWeightClass) => {
    get().updateProfile({ weight, height, reach, activeWeightClass });
  },
  addXP: (amount, source, description) => {
    const entry: XPEntry = {
      id: nextId(),
      amount,
      source,
      description,
      earnedAt: Date.now(),
    };
    set((s) => {
      if (!s.profile) return s;
      const totalXP = s.profile.totalXP + amount;
      const xpHistory = [...s.xpHistory, entry];
      return {
        profile: { ...s.profile, totalXP, xpHistory },
        xpHistory,
        currentRank: get().getRankFromXP(totalXP),
      };
    });
    get().persistToMMKV();
  },
  updateStreak: (days, multiplier) => {
    set((s) => {
      if (!s.profile) return s;
      return {
        profile: {
          ...s.profile,
          currentStreak: days,
          longestStreak: Math.max(s.profile.longestStreak, days),
          streakMultiplier: multiplier,
        },
      };
    });
    get().persistToMMKV();
  },
  getStreakMultiplier: (days) => {
    if (days >= 30) return 4.0;
    if (days >= 21) return 3.0;
    if (days >= 14) return 2.5;
    if (days >= 7) return 2.0;
    if (days >= 3) return 1.5;
    return 1.0;
  },
  getRankFromXP: (xp) => {
    for (const t of RANK_THRESHOLDS) {
      if (xp >= t.xp) return t.rank;
    }
    return "rookie";
  },
  unlockAchievement: (achievementId) => {
    set((s) => {
      if (!s.profile) return s;
      const achievements = s.profile.achievements.map((a) =>
        a.id === achievementId ? { ...a, unlockedAt: Date.now() } : a
      );
      return { profile: { ...s.profile, achievements }, achievements };
    });
    get().persistToMMKV();
  },
  updateCalloutPreferences: (calloutStyle, bellSound, warningSound) => {
    get().updateProfile({ calloutStyle, bellSound, warningSound });
  },
  updateAudioSettings: (
    ttsRate,
    ttsPitch,
    masterVolume,
    bellVolume,
    calloutVolume
  ) => {
    get().updateProfile({
      ttsRate,
      ttsPitch,
      masterVolume,
      bellVolume,
      calloutVolume,
    });
  },
  updateHapticsEnabled: (hapticsEnabled) =>
    get().updateProfile({ hapticsEnabled }),
  setTrainingReminder: (trainingReminder) =>
    get().updateProfile({ trainingReminder }),
  updateLastTrainingDate: (lastTrainingDate) =>
    get().updateProfile({ lastTrainingDate }),
  setActiveFightCamp: (activeFightCampId) =>
    get().updateProfile({ activeFightCampId }),
  setActiveProgram: (activeProgramId) =>
    get().updateProfile({ activeProgramId }),
  setBoxerType: (boxerType) => get().updateProfile({ boxerType }),

  loadFromMMKV: () => {
    const profile = getJSON<UserProfile | null>("user_profile", null);
    if (profile) {
      set({
        profile,
        xpHistory: profile.xpHistory,
        achievements: profile.achievements,
        currentRank: get().getRankFromXP(profile.totalXP),
      });
    }
  },
  persistToMMKV: () => {
    const { profile } = get();
    setJSON("user_profile", profile);
  },
}));
