import type { Combo, ComboElement } from "../types";
import { computeComboStats } from "../lib/combo-utils";

function makeCombo(id: string, name: string, sequence: ComboElement[]): Combo {
  const stats = computeComboStats(sequence);
  return {
    id, name, sequence, difficulty: "advanced", scope: "system",
    isFavorite: false, ...stats, createdAt: 0,
  };
}

export const ADVANCED_COMBOS: Combo[] = [
  // Complex defense + counter (5-6 elements)
  makeCombo("sys_a_01", "Jab-Cross-Slip-Cross-Hook-Cross", ["1", "2", "slip", "2", "3", "2"]),
  makeCombo("sys_a_02", "Jab-Cross-Roll-Hook-Cross-Body Hook", ["1", "2", "roll", "3", "2", "3b"]),
  makeCombo("sys_a_03", "Slip-Cross-Slip-Lead Uppercut-Cross", ["slip", "2", "slip", "5", "2"]),
  makeCombo("sys_a_04", "Jab-Pull-Cross-Hook-Roll-Hook", ["1", "pull", "2", "3", "roll", "3"]),
  makeCombo("sys_a_05", "Roll-Lead Uppercut-Cross-Hook-Body Hook", ["roll", "5", "2", "3", "3b"]),

  // Footwork + punches (5-7 elements)
  makeCombo("sys_a_06", "Step In-Jab-Cross-Pivot Left-Hook", ["step_in", "1", "2", "pivot_left", "3"]),
  makeCombo("sys_a_07", "Jab-Cross-Angle Right-Cross-Hook", ["1", "2", "angle_right", "2", "3"]),
  makeCombo("sys_a_08", "Jab-Pivot Right-Cross-Hook-Step Out", ["1", "pivot_right", "2", "3", "step_out"]),
  makeCombo("sys_a_09", "Step In-Jab-Cross-Body Hook-Step Out", ["step_in", "1", "2", "3b", "step_out"]),
  makeCombo("sys_a_10", "Angle Left-Hook-Cross-Pivot Right", ["angle_left", "3", "2", "pivot_right"]),

  // Full arsenal combos (6-8 elements)
  makeCombo("sys_a_11", "Jab-Cross-Hook-Rear Uppercut-Hook-Cross", ["1", "2", "3", "6", "3", "2"]),
  makeCombo("sys_a_12", "Jab-Body Jab-Cross-Hook-Body Hook-Cross", ["1", "1b", "2", "3", "3b", "2"]),
  makeCombo("sys_a_13", "Jab-Cross-Lead Uppercut-Cross-Body Hook-Hook", ["1", "2", "5", "2", "3b", "3"]),
  makeCombo("sys_a_14", "Lead Uppercut-Cross-Hook-Body Cross-Hook-Cross", ["5", "2", "3", "2b", "3", "2"]),
  makeCombo("sys_a_15", "Jab-Cross-Slip-Cross-Lead Uppercut-Hook", ["1", "2", "slip", "2", "5", "3"]),

  // Defense + footwork (7-8 elements)
  makeCombo("sys_a_16", "Step In-Jab-Cross-Slip-Cross-Hook-Step Out", ["step_in", "1", "2", "slip", "2", "3", "step_out"]),
  makeCombo("sys_a_17", "Jab-Cross-Roll-Hook-Cross-Pivot Left-Hook", ["1", "2", "roll", "3", "2", "pivot_left", "3"]),
  makeCombo("sys_a_18", "Slip-Cross-Hook-Body Hook-Angle Right-Cross", ["slip", "2", "3", "3b", "angle_right", "2"]),
  makeCombo("sys_a_19", "Jab-Pull-Cross-Hook-Roll-Lead Uppercut-Cross", ["1", "pull", "2", "3", "roll", "5", "2"]),
  makeCombo("sys_a_20", "Angle Left-Hook-Body Hook-Cross-Pivot Right-Jab", ["angle_left", "3", "3b", "2", "pivot_right", "1"]),

  // Body attack specialists (5-7 elements)
  makeCombo("sys_a_21", "Jab-Cross-Body Hook-Lead Uppercut-Cross-Body Cross", ["1", "2", "3b", "5", "2", "2b"]),
  makeCombo("sys_a_22", "Body Jab-Body Cross-Lead Body Hook-Hook-Cross", ["1b", "2b", "3b", "3", "2"]),
  makeCombo("sys_a_23", "Jab-Body Cross-Lead Uppercut-Cross-Body Hook", ["1", "2b", "5", "2", "3b"]),
  makeCombo("sys_a_24", "Step In-Body Jab-Cross-Body Hook-Hook-Step Out", ["step_in", "1b", "2", "3b", "3", "step_out"]),
  makeCombo("sys_a_25", "Jab-Cross-Body Hook-Hook-Rear Uppercut-Body Cross", ["1", "2", "3b", "3", "6", "2b"]),

  // Counter-fighter combos (5-7 elements)
  makeCombo("sys_a_26", "Slip-Cross-Hook-Slip-Lead Uppercut-Cross", ["slip", "2", "3", "slip", "5", "2"]),
  makeCombo("sys_a_27", "Roll-Hook-Roll-Hook-Cross-Body Hook", ["roll", "3", "roll", "3", "2", "3b"]),
  makeCombo("sys_a_28", "Block-Cross-Hook-Block-Rear Uppercut-Hook", ["block", "2", "3", "block", "6", "3"]),
  makeCombo("sys_a_29", "Pull-Jab-Cross-Slip-Cross-Hook-Cross", ["pull", "1", "2", "slip", "2", "3", "2"]),
  makeCombo("sys_a_30", "Slip-Lead Uppercut-Cross-Roll-Hook-Cross", ["slip", "5", "2", "roll", "3", "2"]),

  // Pressure-fighter combos (6-8 elements)
  makeCombo("sys_a_31", "Step In-Jab-Jab-Cross-Hook-Body Hook-Cross", ["step_in", "1", "1", "2", "3", "3b", "2"]),
  makeCombo("sys_a_32", "Jab-Cross-Hook-Cross-Lead Uppercut-Rear Uppercut-Cross", ["1", "2", "3", "2", "5", "6", "2"]),
  makeCombo("sys_a_33", "Jab-Jab-Cross-Body Hook-Hook-Cross-Body Cross", ["1", "1", "2", "3b", "3", "2", "2b"]),
  makeCombo("sys_a_34", "Step In-Jab-Body Cross-Lead Uppercut-Hook-Cross", ["step_in", "1", "2b", "5", "3", "2"]),
  makeCombo("sys_a_35", "Jab-Cross-Hook-Rear Uppercut-Body Hook-Hook-Cross", ["1", "2", "3", "6", "3b", "3", "2"]),

  // Movement specialists (6-8 elements)
  makeCombo("sys_a_36", "Circle Left-Jab-Cross-Hook-Circle Right-Cross", ["circle_left", "1", "2", "3", "circle_right", "2"]),
  makeCombo("sys_a_37", "Step In-Jab-Cross-Pivot Left-Hook-Body Hook-Step Out", ["step_in", "1", "2", "pivot_left", "3", "3b", "step_out"]),
  makeCombo("sys_a_38", "Angle Right-Cross-Hook-Angle Left-Hook-Cross", ["angle_right", "2", "3", "angle_left", "3", "2"]),
  makeCombo("sys_a_39", "Jab-Angle Left-Lead Uppercut-Cross-Pivot Right-Jab-Cross", ["1", "angle_left", "5", "2", "pivot_right", "1", "2"]),
  makeCombo("sys_a_40", "Step In-Jab-Cross-Roll-Hook-Rear Body Hook-Pivot Left-Jab", ["step_in", "1", "2", "roll", "3", "4b", "pivot_left", "1"]),
];
