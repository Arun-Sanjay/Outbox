import type { Combo, ComboElement } from "../types";
import { computeComboStats } from "../lib/combo-utils";

function makeCombo(id: string, name: string, sequence: ComboElement[]): Combo {
  const stats = computeComboStats(sequence);
  return {
    id, name, sequence, difficulty: "intermediate", scope: "system",
    isFavorite: false, ...stats, createdAt: 0,
  };
}

export const INTERMEDIATE_COMBOS: Combo[] = [
  // Defense + counter combos
  makeCombo("sys_i_01", "Jab-Cross-Slip-Cross", ["1", "2", "slip", "2"]),
  makeCombo("sys_i_02", "Jab-Slip-Cross-Hook", ["1", "slip", "2", "3"]),
  makeCombo("sys_i_03", "Jab-Cross-Roll-Hook", ["1", "2", "roll", "3"]),
  makeCombo("sys_i_04", "Jab-Cross-Pull-Cross", ["1", "2", "pull", "2"]),
  makeCombo("sys_i_05", "Slip-Cross-Hook-Cross", ["slip", "2", "3", "2"]),

  // Body shot combos
  makeCombo("sys_i_06", "Jab-Body Cross", ["1", "2b"]),
  makeCombo("sys_i_07", "Jab-Cross-Body Hook", ["1", "2", "3b"]),
  makeCombo("sys_i_08", "Jab-Body Hook-Hook", ["1", "3b", "3"]),
  makeCombo("sys_i_09", "Body Jab-Cross-Hook", ["1b", "2", "3"]),
  makeCombo("sys_i_10", "Jab-Cross-Body Hook-Hook", ["1", "2", "3b", "3"]),

  // Head-body combos
  makeCombo("sys_i_11", "Jab-Cross-Body Cross-Hook", ["1", "2", "2b", "3"]),
  makeCombo("sys_i_12", "Hook-Body Hook", ["3", "3b"]),
  makeCombo("sys_i_13", "Body Hook-Hook-Cross", ["3b", "3", "2"]),
  makeCombo("sys_i_14", "Jab-Body Jab-Cross", ["1", "1b", "2"]),
  makeCombo("sys_i_15", "Cross-Body Hook-Hook-Cross", ["2", "3b", "3", "2"]),

  // Uppercut combos
  makeCombo("sys_i_16", "Jab-Cross-Lead Uppercut-Cross", ["1", "2", "5", "2"]),
  makeCombo("sys_i_17", "Jab-Rear Uppercut-Hook", ["1", "6", "3"]),
  makeCombo("sys_i_18", "Lead Uppercut-Cross-Hook", ["5", "2", "3"]),
  makeCombo("sys_i_19", "Jab-Cross-Rear Uppercut-Hook", ["1", "2", "6", "3"]),
  makeCombo("sys_i_20", "Body Cross-Lead Uppercut-Cross", ["2b", "5", "2"]),

  // Defense integrated
  makeCombo("sys_i_21", "Roll-Hook-Cross", ["roll", "3", "2"]),
  makeCombo("sys_i_22", "Slip-Lead Uppercut-Cross", ["slip", "5", "2"]),
  makeCombo("sys_i_23", "Block-Cross-Hook-Cross", ["block", "2", "3", "2"]),
  makeCombo("sys_i_24", "Jab-Slip-Cross-Body Hook", ["1", "slip", "2", "3b"]),
  makeCombo("sys_i_25", "Pull-Jab-Cross-Hook", ["pull", "1", "2", "3"]),

  // 5-element combos
  makeCombo("sys_i_26", "Jab-Cross-Hook-Body Hook-Cross", ["1", "2", "3", "3b", "2"]),
  makeCombo("sys_i_27", "Jab-Body Jab-Cross-Hook-Cross", ["1", "1b", "2", "3", "2"]),
  makeCombo("sys_i_28", "Jab-Cross-Slip-Cross-Hook", ["1", "2", "slip", "2", "3"]),
  makeCombo("sys_i_29", "Body Hook-Hook-Cross-Body Cross", ["3b", "3", "2", "2b"]),
  makeCombo("sys_i_30", "Jab-Cross-Body Hook-Hook-Cross", ["1", "2", "3b", "3", "2"]),
];
