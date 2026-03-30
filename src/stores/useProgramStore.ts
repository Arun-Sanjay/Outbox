import { create } from "zustand";
import { getJSON, setJSON } from "../db/storage";
import { SYSTEM_PROGRAMS } from "../data/programs";
import { toLocalDateKey } from "../lib/date";
import type {
  BoxerType,
  ProgramDay,
  ProgramFocus,
  TrainingProgram,
} from "../types";

type ActiveProgramData = {
  programId: string;
  startDate: string;
  completedDays: number[];
  currentDay: number;
  isPaused: boolean;
};

type ProgramState = {
  programs: TrainingProgram[];
  activeProgramData: ActiveProgramData | null;
  boxerType: BoxerType | null;
  quizCompleted: boolean;

  loadFromMMKV: () => void;
  persistToMMKV: () => void;

  getAllPrograms: () => TrainingProgram[];
  getProgramById: (id: string) => TrainingProgram | undefined;
  getProgramsByBoxerType: (boxerType: BoxerType) => TrainingProgram[];
  getProgramsByFocus: (focus: ProgramFocus) => TrainingProgram[];
  getActiveProgram: () => {
    program: TrainingProgram;
    data: ActiveProgramData;
    progress: number;
    currentProgramDay: ProgramDay | null;
  } | null;

  setBoxerType: (type: BoxerType) => void;
  setQuizCompleted: (completed: boolean) => void;
  startProgram: (programId: string) => void;
  completeDay: () => void;
  pauseProgram: () => void;
  resumeProgram: () => void;
  stopProgram: () => void;
};

export const useProgramStore = create<ProgramState>((set, get) => ({
  programs: [...SYSTEM_PROGRAMS],
  activeProgramData: null,
  boxerType: null,
  quizCompleted: false,

  loadFromMMKV: () => {
    const activeProgramData = getJSON<ActiveProgramData | null>("active_program_data", null);
    const boxerType = getJSON<BoxerType | null>("boxer_type", null);
    set({
      programs: [...SYSTEM_PROGRAMS],
      activeProgramData,
      boxerType,
      quizCompleted: boxerType !== null,
    });
  },

  persistToMMKV: () => {
    const { activeProgramData, boxerType } = get();
    setJSON("active_program_data", activeProgramData);
    setJSON("boxer_type", boxerType);
  },

  getAllPrograms: () => get().programs,
  getProgramById: (id) => get().programs.find((p) => p.id === id),
  getProgramsByBoxerType: (boxerType) =>
    get().programs.filter((p) => p.targetBoxerType.includes(boxerType)),
  getProgramsByFocus: (focus) =>
    get().programs.filter((p) => p.focus === focus),

  getActiveProgram: () => {
    const { activeProgramData, programs } = get();
    if (!activeProgramData) return null;
    const program = programs.find((p) => p.id === activeProgramData.programId);
    if (!program) return null;
    const totalDays = program.days.length;
    const progress = totalDays > 0 ? activeProgramData.completedDays.length / totalDays : 0;
    const currentProgramDay = program.days[activeProgramData.currentDay - 1] ?? null;
    return { program, data: activeProgramData, progress, currentProgramDay };
  },

  setBoxerType: (type) => {
    set({ boxerType: type });
    get().persistToMMKV();
  },

  setQuizCompleted: (completed) => {
    set({ quizCompleted: completed });
  },

  startProgram: (programId) => {
    const data: ActiveProgramData = {
      programId,
      startDate: toLocalDateKey(new Date()),
      completedDays: [],
      currentDay: 1,
      isPaused: false,
    };
    set({ activeProgramData: data });
    get().persistToMMKV();
  },

  completeDay: () => {
    set((s) => {
      if (!s.activeProgramData) return s;
      const { currentDay, completedDays } = s.activeProgramData;
      const updated = completedDays.includes(currentDay)
        ? completedDays
        : [...completedDays, currentDay];
      return {
        activeProgramData: {
          ...s.activeProgramData,
          completedDays: updated,
          currentDay: currentDay + 1,
        },
      };
    });
    get().persistToMMKV();
  },

  pauseProgram: () => {
    set((s) => {
      if (!s.activeProgramData) return s;
      return { activeProgramData: { ...s.activeProgramData, isPaused: true } };
    });
    get().persistToMMKV();
  },

  resumeProgram: () => {
    set((s) => {
      if (!s.activeProgramData) return s;
      return { activeProgramData: { ...s.activeProgramData, isPaused: false } };
    });
    get().persistToMMKV();
  },

  stopProgram: () => {
    set({ activeProgramData: null });
    get().persistToMMKV();
  },
}));
