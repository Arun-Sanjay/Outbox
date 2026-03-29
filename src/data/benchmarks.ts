// Benchmark type definitions — populated in Phase 85
import type { BenchmarkType } from "../types";

export type BenchmarkInfo = {
  type: BenchmarkType;
  name: string;
  unit: string;
  description: string;
  higherIsBetter: boolean;
};

export const BENCHMARK_INFO: BenchmarkInfo[] = [];
