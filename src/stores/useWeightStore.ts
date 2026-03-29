import { create } from "zustand";
import { getJSON, setJSON, nextId } from "../db/storage";
import type { WeightEntry } from "../types";

type WeightState = {
  entries: WeightEntry[];
  currentWeight: number | null;
  unit: "kg" | "lb";

  addWeightEntry: (
    weight: number,
    unit: "kg" | "lb",
    date: string,
    fightCampId: number | null,
    notes: string
  ) => void;
  updateWeightEntry: (id: number, updates: Partial<WeightEntry>) => void;
  deleteWeightEntry: (id: number) => void;
  getWeightEntries: (fightCampId?: number | null) => WeightEntry[];
  getWeightTrend: (days: number) => WeightEntry[];
  getCurrentWeight: () => number | null;
  setPreferredUnit: (unit: "kg" | "lb") => void;
  convertWeight: (value: number, from: "kg" | "lb", to: "kg" | "lb") => number;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const useWeightStore = create<WeightState>((set, get) => ({
  entries: [],
  currentWeight: null,
  unit: "kg",

  addWeightEntry: (weight, unit, date, fightCampId, notes) => {
    const entry: WeightEntry = {
      id: nextId(),
      weight,
      unit,
      date,
      fightCampId,
      notes,
    };
    set((s) => ({
      entries: [entry, ...s.entries],
      currentWeight: weight,
    }));
    get().persistToMMKV();
  },
  updateWeightEntry: (id, updates) => {
    set((s) => ({
      entries: s.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    get().persistToMMKV();
  },
  deleteWeightEntry: (id) => {
    set((s) => {
      const filtered = s.entries.filter((e) => e.id !== id);
      return {
        entries: filtered,
        currentWeight: filtered.length > 0 ? filtered[0].weight : null,
      };
    });
    get().persistToMMKV();
  },
  getWeightEntries: (fightCampId) => {
    const { entries } = get();
    if (fightCampId === undefined || fightCampId === null) return entries;
    return entries.filter((e) => e.fightCampId === fightCampId);
  },
  getWeightTrend: (days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return get().entries.filter((e) => e.date >= cutoffStr);
  },
  getCurrentWeight: () => get().currentWeight,
  setPreferredUnit: (unit) => {
    set({ unit });
    get().persistToMMKV();
  },
  convertWeight: (value, from, to) => {
    if (from === to) return value;
    if (from === "kg" && to === "lb") return Math.round(value * 2.20462 * 10) / 10;
    return Math.round((value / 2.20462) * 10) / 10;
  },

  loadFromMMKV: () => {
    const entries = getJSON<WeightEntry[]>("weight_entries", []);
    set({
      entries,
      currentWeight: entries.length > 0 ? entries[0].weight : null,
    });
  },
  persistToMMKV: () => {
    const { entries } = get();
    setJSON("weight_entries", entries);
  },
}));
