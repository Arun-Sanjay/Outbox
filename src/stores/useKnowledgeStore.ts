import { create } from "zustand";
import { getJSON, setJSON } from "../db/storage";
import type { BoxingTip, GlossaryEntry, PunchCode, DefenseCode } from "../types";

type PunchReference = {
  code: PunchCode;
  name: string;
  formCues: string[];
  mistakes: string[];
  whenToUse: string;
  bestCombos: string[];
};

type DefenseReference = {
  code: DefenseCode;
  name: string;
  formCues: string[];
  mistakes: string[];
  whenToUse: string;
  bestCombos: string[];
};

type KnowledgeState = {
  dailyTips: BoxingTip[];
  glossaryTerms: GlossaryEntry[];
  punchReference: PunchReference[];
  defenseReference: DefenseReference[];
  bookmarkedTerms: string[];
  lastDailyTipDate: string | null;
  currentDailyTipId: string | null;

  getDailyTip: (date: string) => BoxingTip | null;
  getTipsByCategory: (category: BoxingTip["category"]) => BoxingTip[];
  getGlossaryTerm: (term: string) => GlossaryEntry | null;
  searchGlossary: (query: string) => GlossaryEntry[];
  toggleBookmark: (termId: string) => void;
  getBookmarkedTerms: () => GlossaryEntry[];
  getPunchReference: (code: PunchCode) => PunchReference | null;
  getAllPunchReferences: () => PunchReference[];
  getDefenseReference: (code: DefenseCode) => DefenseReference | null;
  setLastDailyTipDate: (date: string) => void;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  dailyTips: [],
  glossaryTerms: [],
  punchReference: [],
  defenseReference: [],
  bookmarkedTerms: [],
  lastDailyTipDate: null,
  currentDailyTipId: null,

  getDailyTip: (date) => {
    const { dailyTips, lastDailyTipDate, currentDailyTipId } = get();
    if (dailyTips.length === 0) return null;
    if (lastDailyTipDate === date && currentDailyTipId) {
      return dailyTips.find((t) => t.id === currentDailyTipId) ?? null;
    }
    // Rotate through tips based on day number
    const dayNumber = Math.floor(
      (new Date(date + "T00:00:00").getTime() / (1000 * 60 * 60 * 24)) %
        dailyTips.length
    );
    const tip = dailyTips[dayNumber] ?? dailyTips[0];
    set({ lastDailyTipDate: date, currentDailyTipId: tip.id });
    get().persistToMMKV();
    return tip;
  },
  getTipsByCategory: (category) =>
    get().dailyTips.filter((t) => t.category === category),
  getGlossaryTerm: (term) => {
    const lower = term.toLowerCase();
    return (
      get().glossaryTerms.find((g) => g.term.toLowerCase() === lower) ?? null
    );
  },
  searchGlossary: (query) => {
    const q = query.toLowerCase();
    return get().glossaryTerms.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q)
    );
  },
  toggleBookmark: (termId) => {
    set((s) => ({
      bookmarkedTerms: s.bookmarkedTerms.includes(termId)
        ? s.bookmarkedTerms.filter((t) => t !== termId)
        : [...s.bookmarkedTerms, termId],
    }));
    get().persistToMMKV();
  },
  getBookmarkedTerms: () => {
    const { glossaryTerms, bookmarkedTerms } = get();
    return glossaryTerms.filter((g) => bookmarkedTerms.includes(g.id));
  },
  getPunchReference: (code) =>
    get().punchReference.find((p) => p.code === code) ?? null,
  getAllPunchReferences: () => get().punchReference,
  getDefenseReference: (code) =>
    get().defenseReference.find((d) => d.code === code) ?? null,
  setLastDailyTipDate: (date) => {
    set({ lastDailyTipDate: date });
    get().persistToMMKV();
  },

  loadFromMMKV: () => {
    const bookmarkedTerms = getJSON<string[]>("knowledge_bookmarks", []);
    const lastDailyTipDate = getJSON<string | null>(
      "knowledge_last_tip_date",
      null
    );
    const currentDailyTipId = getJSON<string | null>(
      "knowledge_current_tip_id",
      null
    );
    set({ bookmarkedTerms, lastDailyTipDate, currentDailyTipId });
  },
  persistToMMKV: () => {
    const { bookmarkedTerms, lastDailyTipDate, currentDailyTipId } = get();
    setJSON("knowledge_bookmarks", bookmarkedTerms);
    setJSON("knowledge_last_tip_date", lastDailyTipDate);
    setJSON("knowledge_current_tip_id", currentDailyTipId);
  },
}));
