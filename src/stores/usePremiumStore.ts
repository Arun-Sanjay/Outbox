import { create } from "zustand";
import { getJSON, setJSON } from "../db/storage";

type PremiumState = {
  isPremium: boolean;

  togglePremium: () => void;
  setPremium: (value: boolean) => void;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const usePremiumStore = create<PremiumState>((set, get) => ({
  isPremium: false,

  togglePremium: () => {
    set((s) => ({ isPremium: !s.isPremium }));
    get().persistToMMKV();
  },

  setPremium: (value) => {
    set({ isPremium: value });
    get().persistToMMKV();
  },

  loadFromMMKV: () => {
    const isPremium = getJSON<boolean>("is_premium", false);
    set({ isPremium });
  },

  persistToMMKV: () => {
    setJSON("is_premium", get().isPremium);
  },
}));
