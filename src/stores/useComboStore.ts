import { create } from "zustand";
import { getJSON, setJSON, nextId } from "../db/storage";
import { computeComboStats } from "../lib/combo-utils";
import { BEGINNER_COMBOS } from "../data/combos-beginner";
import { INTERMEDIATE_COMBOS } from "../data/combos-intermediate";
import { ADVANCED_COMBOS } from "../data/combos-advanced";
import type { Combo, ComboElement } from "../types";

const ALL_SYSTEM_COMBOS = [
  ...BEGINNER_COMBOS,
  ...INTERMEDIATE_COMBOS,
  ...ADVANCED_COMBOS,
];

type ComboState = {
  combos: Combo[];
  favorites: string[];
  drillQueue: string[];
  lastDrilledComboIds: string[];

  // Load / persist
  loadFromMMKV: () => void;
  persistToMMKV: () => void;

  // Getters
  getAllCombos: () => Combo[];
  getCombo: (id: string) => Combo | undefined;
  searchCombos: (query: string) => Combo[];
  filterByDifficulty: (difficulty: Combo["difficulty"]) => Combo[];
  getCombosBySource: (scope: Combo["scope"]) => Combo[];
  getFavorites: () => Combo[];

  // Custom combo management
  addCustomCombo: (name: string, sequence: ComboElement[]) => Combo;
  deleteCustomCombo: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Drill queue
  getDrillQueue: () => Combo[];
  addToDrillQueue: (id: string) => void;
  removeFromDrillQueue: (id: string) => void;
  reorderDrillQueue: (ids: string[]) => void;
  clearDrillQueue: () => void;

  // Callout tracking
  recordComboCallout: (id: string) => void;
};

export const useComboStore = create<ComboState>((set, get) => ({
  combos: [...ALL_SYSTEM_COMBOS],
  favorites: [],
  drillQueue: [],
  lastDrilledComboIds: [],

  // ── Load / Persist ─────────────────────────────────────────────────────────

  loadFromMMKV: () => {
    const customCombos = getJSON<Combo[]>("custom_combos", []);
    const favorites = getJSON<string[]>("combo_favorites", []);
    const drillQueue = getJSON<string[]>("drill_queue", []);

    // Merge: system combos + custom combos, apply favorite flags
    const allCombos = [...ALL_SYSTEM_COMBOS, ...customCombos].map((c) => ({
      ...c,
      isFavorite: favorites.includes(c.id),
    }));

    set({ combos: allCombos, favorites, drillQueue });
  },

  persistToMMKV: () => {
    const { combos, favorites, drillQueue } = get();
    const customCombos = combos.filter((c) => c.scope === "personal");
    setJSON("custom_combos", customCombos);
    setJSON("combo_favorites", favorites);
    setJSON("drill_queue", drillQueue);
  },

  // ── Getters ────────────────────────────────────────────────────────────────

  getAllCombos: () => get().combos,

  getCombo: (id) => get().combos.find((c) => c.id === id),

  searchCombos: (query) => {
    const q = query.toLowerCase();
    return get().combos.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.sequence.join(" ").toLowerCase().includes(q)
    );
  },

  filterByDifficulty: (difficulty) =>
    get().combos.filter((c) => c.difficulty === difficulty),

  getCombosBySource: (scope) =>
    get().combos.filter((c) => c.scope === scope),

  getFavorites: () => get().combos.filter((c) => c.isFavorite),

  // ── Custom Combo Management ────────────────────────────────────────────────

  addCustomCombo: (name, sequence) => {
    const stats = computeComboStats(sequence);
    const combo: Combo = {
      id: `custom_${nextId()}`,
      name,
      sequence,
      difficulty: sequence.length <= 3 ? "beginner" : sequence.length <= 5 ? "intermediate" : "advanced",
      scope: "personal",
      isFavorite: false,
      ...stats,
      createdAt: Date.now(),
    };
    set((s) => ({ combos: [...s.combos, combo] }));
    get().persistToMMKV();
    return combo;
  },

  deleteCustomCombo: (id) => {
    set((s) => ({
      combos: s.combos.filter((c) => c.id !== id || c.scope !== "personal"),
      favorites: s.favorites.filter((f) => f !== id),
      drillQueue: s.drillQueue.filter((d) => d !== id),
    }));
    get().persistToMMKV();
  },

  toggleFavorite: (id) => {
    set((s) => {
      const isFav = s.favorites.includes(id);
      const favorites = isFav
        ? s.favorites.filter((f) => f !== id)
        : [...s.favorites, id];
      const combos = s.combos.map((c) =>
        c.id === id ? { ...c, isFavorite: !isFav } : c
      );
      return { favorites, combos };
    });
    get().persistToMMKV();
  },

  // ── Drill Queue ────────────────────────────────────────────────────────────

  getDrillQueue: () => {
    const { combos, drillQueue } = get();
    return drillQueue
      .map((id) => combos.find((c) => c.id === id))
      .filter((c): c is Combo => c !== undefined);
  },

  addToDrillQueue: (id) => {
    set((s) => {
      if (s.drillQueue.includes(id)) return s;
      return { drillQueue: [...s.drillQueue, id] };
    });
    get().persistToMMKV();
  },

  removeFromDrillQueue: (id) => {
    set((s) => ({
      drillQueue: s.drillQueue.filter((d) => d !== id),
    }));
    get().persistToMMKV();
  },

  reorderDrillQueue: (ids) => {
    set({ drillQueue: ids });
    get().persistToMMKV();
  },

  clearDrillQueue: () => {
    set({ drillQueue: [] });
    get().persistToMMKV();
  },

  // ── Callout Tracking ───────────────────────────────────────────────────────

  recordComboCallout: (id) => {
    set((s) => ({
      lastDrilledComboIds: [id, ...s.lastDrilledComboIds].slice(0, 3),
    }));
  },
}));
