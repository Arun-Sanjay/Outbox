import { create } from "zustand";
import { getJSON, setJSON } from "../db/storage";
import type {
  Fight,
  FightResult,
  FightType,
  Intensity,
  SparringEntry,
  SparringPartner,
} from "../types";

type FightState = {
  fights: Fight[];
  sparringEntries: SparringEntry[];
  sparringPartners: SparringPartner[];

  addFight: (fight: Fight) => void;
  updateFight: (id: number, updates: Partial<Fight>) => void;
  deleteFight: (id: number) => void;
  getFightById: (id: number) => Fight | undefined;
  getFightsByResult: (result: FightResult) => Fight[];
  getFightsByType: (type: FightType) => Fight[];
  addSparringEntry: (entry: SparringEntry) => void;
  updateSparringEntry: (id: number, updates: Partial<SparringEntry>) => void;
  deleteSparringEntry: (id: number) => void;
  getSparringEntryById: (id: number) => SparringEntry | undefined;
  getSparringEntriesByPartner: (partnerName: string) => SparringEntry[];
  addOrUpdateSparringPartner: (partner: SparringPartner) => void;
  getSparringPartner: (name: string) => SparringPartner | undefined;
  getAllSparringPartners: () => SparringPartner[];
  updatePartnerStats: (
    partnerName: string,
    sessions: number,
    lastDate: string,
    avgIntensity: Intensity
  ) => void;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const useFightStore = create<FightState>((set, get) => ({
  fights: [],
  sparringEntries: [],
  sparringPartners: [],

  addFight: (fight) => {
    set((s) => ({ fights: [fight, ...s.fights] }));
    get().persistToMMKV();
  },
  updateFight: (id, updates) => {
    set((s) => ({
      fights: s.fights.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
    get().persistToMMKV();
  },
  deleteFight: (id) => {
    set((s) => ({ fights: s.fights.filter((f) => f.id !== id) }));
    get().persistToMMKV();
  },
  getFightById: (id) => get().fights.find((f) => f.id === id),
  getFightsByResult: (result) =>
    get().fights.filter((f) => f.result === result),
  getFightsByType: (type) =>
    get().fights.filter((f) => f.fightType === type),

  addSparringEntry: (entry) => {
    set((s) => ({ sparringEntries: [entry, ...s.sparringEntries] }));
    get().persistToMMKV();
  },
  updateSparringEntry: (id, updates) => {
    set((s) => ({
      sparringEntries: s.sparringEntries.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
    get().persistToMMKV();
  },
  deleteSparringEntry: (id) => {
    set((s) => ({
      sparringEntries: s.sparringEntries.filter((e) => e.id !== id),
    }));
    get().persistToMMKV();
  },
  getSparringEntryById: (id) =>
    get().sparringEntries.find((e) => e.id === id),
  getSparringEntriesByPartner: (partnerName) =>
    get().sparringEntries.filter((e) => e.partnerName === partnerName),

  addOrUpdateSparringPartner: (partner) => {
    set((s) => {
      const existing = s.sparringPartners.findIndex(
        (p) => p.name === partner.name
      );
      if (existing >= 0) {
        const updated = [...s.sparringPartners];
        updated[existing] = partner;
        return { sparringPartners: updated };
      }
      return { sparringPartners: [...s.sparringPartners, partner] };
    });
    get().persistToMMKV();
  },
  getSparringPartner: (name) =>
    get().sparringPartners.find((p) => p.name === name),
  getAllSparringPartners: () => get().sparringPartners,
  updatePartnerStats: (partnerName, sessions, lastDate, avgIntensity) => {
    set((s) => ({
      sparringPartners: s.sparringPartners.map((p) =>
        p.name === partnerName
          ? {
              ...p,
              totalSessions: sessions,
              lastSparred: lastDate,
              averageIntensity: avgIntensity,
            }
          : p
      ),
    }));
    get().persistToMMKV();
  },

  loadFromMMKV: () => {
    const fights = getJSON<Fight[]>("fights", []);
    const sparringEntries = getJSON<SparringEntry[]>("sparring", []);
    const sparringPartners = getJSON<SparringPartner[]>(
      "sparring_partners",
      []
    );
    set({ fights, sparringEntries, sparringPartners });
  },
  persistToMMKV: () => {
    const { fights, sparringEntries, sparringPartners } = get();
    setJSON("fights", fights);
    setJSON("sparring", sparringEntries);
    setJSON("sparring_partners", sparringPartners);
  },
}));
