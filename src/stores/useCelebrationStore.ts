import { create } from "zustand";
import type { Achievement, Rank } from "../types";

type CelebrationItem =
  | { type: "achievement"; achievement: Achievement }
  | { type: "rank_up"; rank: Rank };

type CelebrationState = {
  queue: CelebrationItem[];
  current: CelebrationItem | null;

  enqueueAchievement: (achievement: Achievement) => void;
  enqueueRankUp: (rank: Rank) => void;
  showNext: () => void;
  dismiss: () => void;
  clearAll: () => void;
};

export const useCelebrationStore = create<CelebrationState>((set, get) => ({
  queue: [],
  current: null,

  enqueueAchievement: (achievement) => {
    set((s) => {
      const item: CelebrationItem = { type: "achievement", achievement };
      if (!s.current) return { current: item };
      return { queue: [...s.queue, item] };
    });
  },

  enqueueRankUp: (rank) => {
    set((s) => {
      const item: CelebrationItem = { type: "rank_up", rank };
      if (!s.current) return { current: item };
      return { queue: [...s.queue, item] };
    });
  },

  showNext: () => {
    set((s) => {
      if (s.queue.length === 0) return { current: null };
      const [next, ...rest] = s.queue;
      return { current: next, queue: rest };
    });
  },

  dismiss: () => {
    get().showNext();
  },

  clearAll: () => {
    set({ queue: [], current: null });
  },
}));
