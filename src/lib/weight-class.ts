import type { WeightClass } from "../types";

type WeightClassInfo = {
  key: WeightClass;
  label: string;
  minLb: number;
  maxLb: number;
  minKg: number;
  maxKg: number;
};

// Standard professional boxing weight classes (in pounds)
const WEIGHT_CLASSES: WeightClassInfo[] = [
  { key: "strawweight", label: "Strawweight", minLb: 0, maxLb: 105, minKg: 0, maxKg: 47.6 },
  { key: "flyweight", label: "Flyweight", minLb: 105, maxLb: 112, minKg: 47.6, maxKg: 50.8 },
  { key: "bantamweight", label: "Bantamweight", minLb: 112, maxLb: 118, minKg: 50.8, maxKg: 53.5 },
  { key: "featherweight", label: "Featherweight", minLb: 118, maxLb: 126, minKg: 53.5, maxKg: 57.2 },
  { key: "lightweight", label: "Lightweight", minLb: 126, maxLb: 135, minKg: 57.2, maxKg: 61.2 },
  { key: "super_lightweight", label: "Super Lightweight", minLb: 135, maxLb: 140, minKg: 61.2, maxKg: 63.5 },
  { key: "welterweight", label: "Welterweight", minLb: 140, maxLb: 147, minKg: 63.5, maxKg: 66.7 },
  { key: "super_welterweight", label: "Super Welterweight", minLb: 147, maxLb: 154, minKg: 66.7, maxKg: 69.9 },
  { key: "middleweight", label: "Middleweight", minLb: 154, maxLb: 160, minKg: 69.9, maxKg: 72.6 },
  { key: "super_middleweight", label: "Super Middleweight", minLb: 160, maxLb: 168, minKg: 72.6, maxKg: 76.2 },
  { key: "light_heavyweight", label: "Light Heavyweight", minLb: 168, maxLb: 175, minKg: 76.2, maxKg: 79.4 },
  { key: "cruiserweight", label: "Cruiserweight", minLb: 175, maxLb: 200, minKg: 79.4, maxKg: 90.7 },
  { key: "heavyweight", label: "Heavyweight", minLb: 200, maxLb: Infinity, minKg: 90.7, maxKg: Infinity },
];

/**
 * Returns the weight class for a given weight.
 * Weight is assumed to be in the specified unit (default: lb).
 */
export function getWeightClass(
  weight: number,
  unit: "lb" | "kg" = "lb"
): WeightClass | null {
  if (!Number.isFinite(weight) || weight <= 0) return null;
  const lb = unit === "kg" ? weight * 2.20462 : weight;
  for (const wc of WEIGHT_CLASSES) {
    if (lb <= wc.maxLb) return wc.key;
  }
  return "heavyweight";
}

/**
 * Returns the human-readable label for a weight class.
 */
export function getWeightClassLabel(weightClass: WeightClass): string {
  const found = WEIGHT_CLASSES.find((wc) => wc.key === weightClass);
  return found?.label ?? weightClass;
}

/**
 * Returns the min/max limits for a weight class in both lb and kg.
 */
export function getWeightClassLimits(
  weightClass: WeightClass
): { minLb: number; maxLb: number; minKg: number; maxKg: number } | null {
  const found = WEIGHT_CLASSES.find((wc) => wc.key === weightClass);
  if (!found) return null;
  return {
    minLb: found.minLb,
    maxLb: found.maxLb,
    minKg: found.minKg,
    maxKg: found.maxKg,
  };
}

/**
 * Convert weight between kg and lb.
 */
export function convertWeight(
  value: number,
  from: "kg" | "lb",
  to: "kg" | "lb"
): number {
  if (from === to) return value;
  if (from === "kg" && to === "lb")
    return Math.round(value * 2.20462 * 10) / 10;
  return Math.round((value / 2.20462) * 10) / 10;
}
