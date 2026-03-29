import { create } from "zustand";
import { getJSON, setJSON } from "../db/storage";
import type {
  BoxerType,
  ProgramDay,
  ProgramFocus,
  TrainingProgram,
} from "../types";

type ProgramState = {
  programs: TrainingProgram[];
  activeProgram: TrainingProgram | null;
  activeProgramDay: number | null;
  boxerType: BoxerType | null;
  quizCompleted: boolean;

  setBoxerType: (type: BoxerType) => void;
  getAllPrograms: () => TrainingProgram[];
  getProgramById: (id: string) => TrainingProgram | undefined;
  getProgramsByBoxerType: (boxerType: BoxerType) => TrainingProgram[];
  getProgramsByFocus: (focus: ProgramFocus) => TrainingProgram[];
  activateProgram: (programId: string) => void;
  deactivateProgram: () => void;
  setActiveProgramDay: (day: number) => void;
  getCurrentProgramDay: () => ProgramDay | null;
  advanceProgramDay: () => void;
  createCustomProgram: (program: TrainingProgram) => void;
  updateProgram: (id: string, updates: Partial<TrainingProgram>) => void;
  setQuizCompleted: (completed: boolean) => void;
  loadFromMMKV: () => void;
  persistToMMKV: () => void;
};

export const useProgramStore = create<ProgramState>((set, get) => ({
  programs: [],
  activeProgram: null,
  activeProgramDay: null,
  boxerType: null,
  quizCompleted: false,

  setBoxerType: (type) => {
    set({ boxerType: type });
    get().persistToMMKV();
  },
  getAllPrograms: () => get().programs,
  getProgramById: (id) => get().programs.find((p) => p.id === id),
  getProgramsByBoxerType: (boxerType) =>
    get().programs.filter((p) => p.targetBoxerType.includes(boxerType)),
  getProgramsByFocus: (focus) =>
    get().programs.filter((p) => p.focus === focus),
  activateProgram: (programId) => {
    const program = get().programs.find((p) => p.id === programId);
    if (program) {
      set({ activeProgram: program, activeProgramDay: 1 });
      get().persistToMMKV();
    }
  },
  deactivateProgram: () => {
    set({ activeProgram: null, activeProgramDay: null });
    get().persistToMMKV();
  },
  setActiveProgramDay: (day) => {
    set({ activeProgramDay: day });
    get().persistToMMKV();
  },
  getCurrentProgramDay: () => {
    const { activeProgram, activeProgramDay } = get();
    if (!activeProgram || activeProgramDay === null) return null;
    return activeProgram.days[activeProgramDay - 1] ?? null;
  },
  advanceProgramDay: () => {
    set((s) => ({
      activeProgramDay:
        s.activeProgramDay !== null ? s.activeProgramDay + 1 : null,
    }));
    get().persistToMMKV();
  },
  createCustomProgram: (program) => {
    set((s) => ({ programs: [...s.programs, program] }));
    get().persistToMMKV();
  },
  updateProgram: (id, updates) => {
    set((s) => ({
      programs: s.programs.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
    get().persistToMMKV();
  },
  setQuizCompleted: (completed) => {
    set({ quizCompleted: completed });
    get().persistToMMKV();
  },

  loadFromMMKV: () => {
    const programs = getJSON<TrainingProgram[]>("programs", []);
    const activeProgram = getJSON<TrainingProgram | null>(
      "active_program",
      null
    );
    const boxerType = getJSON<BoxerType | null>("boxer_type", null);
    set({
      programs,
      activeProgram,
      boxerType,
      activeProgramDay: activeProgram ? 1 : null,
      quizCompleted: boxerType !== null,
    });
  },
  persistToMMKV: () => {
    const { programs, activeProgram, boxerType } = get();
    setJSON("programs", programs);
    setJSON("active_program", activeProgram);
    setJSON("boxer_type", boxerType);
  },
}));
