import { create } from "zustand";
import { getJSON, setJSON, nextId } from "../db/storage";
import { daysUntil } from "../lib/date";
import type { FightCamp, WeightClass } from "../types";

type CampState = {
  camps: FightCamp[];
  activeCamp: FightCamp | null;

  createCamp: (
    fightDate: string,
    opponentName: string | null,
    weightClass: WeightClass,
    targetWeight: number,
    currentWeight: number,
    startDate: string,
    notes: string
  ) => void;
  updateCamp: (id: number, updates: Partial<FightCamp>) => void;
  deleteCamp: (id: number) => void;
  getCampById: (id: number) => FightCamp | undefined;
  setActiveCamp: (id: number | null) => void;
  getActiveCamp: () => FightCamp | null;
  getCampByFightDate: (date: string) => FightCamp | undefined;
  completeWeightCut: (campId: number, finalWeight: number) => void;
  getCampsInProgress: () => FightCamp[];
  getCampHistory: () => FightCamp[];
  calculateWeightCutStatus: (
    campId: number
  ) => { remaining: number; percentComplete: number; daysRemaining: number } | null;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const useCampStore = create<CampState>((set, get) => ({
  camps: [],
  activeCamp: null,

  createCamp: (
    fightDate,
    opponentName,
    weightClass,
    targetWeight,
    currentWeight,
    startDate,
    notes
  ) => {
    const camp: FightCamp = {
      id: nextId(),
      fightDate,
      opponentName,
      weightClass,
      targetWeight,
      currentWeight,
      startDate,
      isActive: true,
      notes,
      createdAt: Date.now(),
    };
    set((s) => ({
      camps: [camp, ...s.camps],
      activeCamp: camp,
    }));
    get().persistToMMKV();
  },
  updateCamp: (id, updates) => {
    set((s) => {
      const camps = s.camps.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      const activeCamp =
        s.activeCamp?.id === id
          ? { ...s.activeCamp, ...updates }
          : s.activeCamp;
      return { camps, activeCamp };
    });
    get().persistToMMKV();
  },
  deleteCamp: (id) => {
    set((s) => ({
      camps: s.camps.filter((c) => c.id !== id),
      activeCamp: s.activeCamp?.id === id ? null : s.activeCamp,
    }));
    get().persistToMMKV();
  },
  getCampById: (id) => get().camps.find((c) => c.id === id),
  setActiveCamp: (id) => {
    if (id === null) {
      set({ activeCamp: null });
    } else {
      const camp = get().camps.find((c) => c.id === id);
      set({ activeCamp: camp ?? null });
    }
    get().persistToMMKV();
  },
  getActiveCamp: () => get().activeCamp,
  getCampByFightDate: (date) => get().camps.find((c) => c.fightDate === date),
  completeWeightCut: (campId, finalWeight) => {
    get().updateCamp(campId, { currentWeight: finalWeight, isActive: false });
  },
  getCampsInProgress: () => get().camps.filter((c) => c.isActive),
  getCampHistory: () => get().camps.filter((c) => !c.isActive),
  calculateWeightCutStatus: (campId) => {
    const camp = get().getCampById(campId);
    if (!camp) return null;
    const remaining = camp.currentWeight - camp.targetWeight;
    const totalToCut = camp.currentWeight - camp.targetWeight;
    const percentComplete =
      totalToCut > 0
        ? Math.round(((totalToCut - remaining) / totalToCut) * 100)
        : 100;
    const daysRemaining = daysUntil(camp.fightDate);
    return { remaining, percentComplete, daysRemaining };
  },

  loadFromMMKV: () => {
    const camps = getJSON<FightCamp[]>("fight_camps", []);
    const activeCamp = camps.find((c) => c.isActive) ?? null;
    set({ camps, activeCamp });
  },
  persistToMMKV: () => {
    setJSON("fight_camps", get().camps);
  },
}));
