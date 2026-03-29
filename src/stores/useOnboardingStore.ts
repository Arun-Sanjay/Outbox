import { create } from "zustand";
import { getJSON, setJSON } from "../db/storage";

type OnboardingState = {
  completed: boolean;
  currentStep: number;

  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  completeOnboarding: () => void;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

const TOTAL_STEPS = 6;

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  completed: false,
  currentStep: 0,

  nextStep: () => {
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS - 1),
    }));
  },
  previousStep: () => {
    set((s) => ({
      currentStep: Math.max(s.currentStep - 1, 0),
    }));
  },
  goToStep: (step) => {
    set({ currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) });
  },
  completeOnboarding: () => {
    set({ completed: true });
    get().persistToMMKV();
  },
  loadFromMMKV: () => {
    const completed = getJSON<boolean>("onboarding_completed", false);
    set({ completed, currentStep: 0 });
  },
  persistToMMKV: () => {
    setJSON("onboarding_completed", get().completed);
  },
}));
