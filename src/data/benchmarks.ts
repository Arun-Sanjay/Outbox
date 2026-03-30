import type { BenchmarkType } from "../types";

export type BenchmarkInfo = {
  type: BenchmarkType;
  name: string;
  unit: string;
  description: string;
  higherIsBetter: boolean;
  icon: string;
};

export const BENCHMARK_INFO: BenchmarkInfo[] = [
  {
    type: "3min_punch_count",
    name: "3-Min Punch Count",
    unit: "punches",
    description: "Maximum punches thrown in 3 minutes on the heavy bag. Measures speed, endurance, and output.",
    higherIsBetter: true,
    icon: "fitness",
  },
  {
    type: "shadow_3rounds",
    name: "Shadow Boxing (3 Rounds)",
    unit: "rating",
    description: "Self-rated technical quality across 3 rounds of shadow boxing (1-10 scale). Measures technique under fatigue.",
    higherIsBetter: true,
    icon: "person",
  },
  {
    type: "skip_rope_3min",
    name: "Skip Rope (3 Min)",
    unit: "skips",
    description: "Maximum skip rope count in 3 minutes without stopping. Measures coordination and cardio.",
    higherIsBetter: true,
    icon: "heart",
  },
  {
    type: "5k_roadwork",
    name: "5K Roadwork",
    unit: "seconds",
    description: "Time to complete a 5K run. The gold standard of boxing conditioning.",
    higherIsBetter: false,
    icon: "walk",
  },
  {
    type: "3k_roadwork",
    name: "3K Roadwork",
    unit: "seconds",
    description: "Time to complete a 3K run. A shorter conditioning benchmark for tracking speed improvements.",
    higherIsBetter: false,
    icon: "walk",
  },
  {
    type: "push_ups_max",
    name: "Max Push-Ups",
    unit: "reps",
    description: "Maximum push-ups in a single set without rest. Measures upper body muscular endurance.",
    higherIsBetter: true,
    icon: "barbell",
  },
  {
    type: "burpees_3min",
    name: "Burpees (3 Min)",
    unit: "reps",
    description: "Maximum burpees completed in 3 minutes. The ultimate full-body conditioning test.",
    higherIsBetter: true,
    icon: "flash",
  },
  {
    type: "plank_hold",
    name: "Plank Hold",
    unit: "seconds",
    description: "Maximum time holding a plank position. Measures core strength and mental toughness.",
    higherIsBetter: true,
    icon: "timer",
  },
];

export function getBenchmarkInfo(type: BenchmarkType): BenchmarkInfo | undefined {
  return BENCHMARK_INFO.find((b) => b.type === type);
}

export function formatBenchmarkValue(type: BenchmarkType, value: number): string {
  const info = getBenchmarkInfo(type);
  if (!info) return String(value);

  if (info.unit === "seconds") {
    const min = Math.floor(value / 60);
    const sec = value % 60;
    return min > 0 ? `${min}:${String(sec).padStart(2, "0")}` : `${sec}s`;
  }
  return `${value} ${info.unit}`;
}
