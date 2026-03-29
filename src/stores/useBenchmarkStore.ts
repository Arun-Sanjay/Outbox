import { create } from "zustand";
import { getJSON, setJSON, nextId } from "../db/storage";
import type { BenchmarkEntry, BenchmarkType } from "../types";

type CurrentBenchmarks = { [K in BenchmarkType]: BenchmarkEntry | null };

const EMPTY_BENCHMARKS: CurrentBenchmarks = {
  "3min_punch_count": null,
  shadow_3rounds: null,
  skip_rope_3min: null,
  "5k_roadwork": null,
  "3k_roadwork": null,
  push_ups_max: null,
  burpees_3min: null,
  plank_hold: null,
};

type BenchmarkState = {
  entries: BenchmarkEntry[];
  currentBenchmarks: CurrentBenchmarks;

  logBenchmark: (
    type: BenchmarkType,
    value: number,
    date: string,
    notes: string
  ) => void;
  updateBenchmarkEntry: (
    id: number,
    updates: Partial<BenchmarkEntry>
  ) => void;
  deleteBenchmarkEntry: (id: number) => void;
  getBenchmarksByType: (type: BenchmarkType) => BenchmarkEntry[];
  getLatestBenchmark: (type: BenchmarkType) => BenchmarkEntry | null;
  getBenchmarkProgress: (
    type: BenchmarkType,
    days: number
  ) => BenchmarkEntry[];
  getAllLatestBenchmarks: () => BenchmarkEntry[];
  calculateProgress: (type: BenchmarkType) => number | null;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const useBenchmarkStore = create<BenchmarkState>((set, get) => ({
  entries: [],
  currentBenchmarks: { ...EMPTY_BENCHMARKS },

  logBenchmark: (type, value, date, notes) => {
    const entry: BenchmarkEntry = {
      id: nextId(),
      type,
      value,
      date,
      notes,
      createdAt: Date.now(),
    };
    set((s) => ({
      entries: [entry, ...s.entries],
      currentBenchmarks: { ...s.currentBenchmarks, [type]: entry },
    }));
    get().persistToMMKV();
  },
  updateBenchmarkEntry: (id, updates) => {
    set((s) => ({
      entries: s.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    get().persistToMMKV();
  },
  deleteBenchmarkEntry: (id) => {
    set((s) => ({
      entries: s.entries.filter((e) => e.id !== id),
    }));
    // Recalculate currentBenchmarks after deletion
    const { entries } = get();
    const updated = { ...EMPTY_BENCHMARKS };
    for (const entry of entries) {
      if (!updated[entry.type] || entry.date > updated[entry.type]!.date) {
        updated[entry.type] = entry;
      }
    }
    set({ currentBenchmarks: updated });
    get().persistToMMKV();
  },
  getBenchmarksByType: (type) =>
    get().entries.filter((e) => e.type === type),
  getLatestBenchmark: (type) => get().currentBenchmarks[type],
  getBenchmarkProgress: (type, days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return get()
      .entries.filter((e) => e.type === type && e.date >= cutoffStr)
      .sort((a, b) => a.date.localeCompare(b.date));
  },
  getAllLatestBenchmarks: () =>
    Object.values(get().currentBenchmarks).filter(
      (e): e is BenchmarkEntry => e !== null
    ),
  calculateProgress: (type) => {
    const entries = get()
      .entries.filter((e) => e.type === type)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (entries.length < 2) return null;
    const first = entries[0].value;
    const last = entries[entries.length - 1].value;
    if (first === 0) return null;
    return Math.round(((last - first) / first) * 100);
  },

  loadFromMMKV: () => {
    const entries = getJSON<BenchmarkEntry[]>("benchmarks", []);
    const currentBenchmarks = { ...EMPTY_BENCHMARKS };
    for (const entry of entries) {
      if (
        !currentBenchmarks[entry.type] ||
        entry.date > currentBenchmarks[entry.type]!.date
      ) {
        currentBenchmarks[entry.type] = entry;
      }
    }
    set({ entries, currentBenchmarks });
  },
  persistToMMKV: () => {
    setJSON("benchmarks", get().entries);
  },
}));
