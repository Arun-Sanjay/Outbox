import type { Combo, ComboElement } from "../types";
import { computeComboStats } from "../lib/combo-utils";

function makeCombo(id: string, name: string, sequence: ComboElement[]): Combo {
  const stats = computeComboStats(sequence);
  return {
    id,
    name,
    sequence,
    difficulty: "beginner",
    scope: "system",
    isFavorite: false,
    ...stats,
    createdAt: 0,
  };
}

export const BEGINNER_COMBOS: Combo[] = [
  makeCombo("sys_b_01", "Jab", ["1"]),
  makeCombo("sys_b_02", "Double Jab", ["1", "1"]),
  makeCombo("sys_b_03", "Jab-Cross", ["1", "2"]),
  makeCombo("sys_b_04", "Triple Jab", ["1", "1", "1"]),
  makeCombo("sys_b_05", "Jab-Jab-Cross", ["1", "1", "2"]),
  makeCombo("sys_b_06", "Jab-Cross-Hook", ["1", "2", "3"]),
  makeCombo("sys_b_07", "Jab-Cross-Jab", ["1", "2", "1"]),
  makeCombo("sys_b_08", "Double Jab-Cross", ["1", "1", "2"]),
  makeCombo("sys_b_09", "Cross-Hook", ["2", "3"]),
  makeCombo("sys_b_10", "Hook-Cross", ["3", "2"]),
  makeCombo("sys_b_11", "Jab-Cross-Jab-Cross", ["1", "2", "1", "2"]),
  makeCombo("sys_b_12", "Jab-Hook", ["1", "3"]),
  makeCombo("sys_b_13", "Jab-Cross-Hook-Cross", ["1", "2", "3", "2"]),
  makeCombo("sys_b_14", "Jab-Jab-Hook", ["1", "1", "3"]),
  makeCombo("sys_b_15", "Cross-Hook-Cross", ["2", "3", "2"]),
  makeCombo("sys_b_16", "Jab-Rear Uppercut", ["1", "6"]),
  makeCombo("sys_b_17", "Jab-Cross-Lead Uppercut", ["1", "2", "5"]),
  makeCombo("sys_b_18", "Lead Uppercut-Cross", ["5", "2"]),
  makeCombo("sys_b_19", "Jab-Lead Uppercut-Cross", ["1", "5", "2"]),
  makeCombo("sys_b_20", "Hook-Hook", ["3", "4"]),
];
