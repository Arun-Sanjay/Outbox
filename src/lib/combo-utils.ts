import type {
  Combo,
  ComboElement,
  DefenseCode,
  FootworkCode,
  PunchCode,
} from "../types";

// ── Punch code → name mappings ───────────────────────────────────────────────

const PUNCH_NAMES_ORTHODOX: Record<PunchCode, string> = {
  "1": "Jab",
  "2": "Cross",
  "3": "Lead Hook",
  "4": "Rear Hook",
  "5": "Lead Uppercut",
  "6": "Rear Uppercut",
  "1b": "Body Jab",
  "2b": "Body Cross",
  "3b": "Lead Body Hook",
  "4b": "Rear Body Hook",
};

const PUNCH_NAMES_SOUTHPAW: Record<PunchCode, string> = {
  "1": "Jab",
  "2": "Cross",
  "3": "Lead Hook",
  "4": "Rear Hook",
  "5": "Lead Uppercut",
  "6": "Rear Uppercut",
  "1b": "Body Jab",
  "2b": "Body Cross",
  "3b": "Lead Body Hook",
  "4b": "Rear Body Hook",
};

const DEFENSE_NAMES: Record<DefenseCode, string> = {
  slip: "Slip",
  roll: "Roll",
  pull: "Pull",
  step_back: "Step Back",
  block: "Block",
};

const FOOTWORK_NAMES: Record<FootworkCode, string> = {
  pivot_left: "Pivot Left",
  pivot_right: "Pivot Right",
  angle_left: "Angle Left",
  angle_right: "Angle Right",
  circle_left: "Circle Left",
  circle_right: "Circle Right",
  step_in: "Step In",
  step_out: "Step Out",
};

// ── Type guards ──────────────────────────────────────────────────────────────

const PUNCH_CODES = new Set<string>([
  "1", "2", "3", "4", "5", "6", "1b", "2b", "3b", "4b",
]);
const DEFENSE_CODES = new Set<string>([
  "slip", "roll", "pull", "step_back", "block",
]);
const FOOTWORK_CODES = new Set<string>([
  "pivot_left", "pivot_right", "angle_left", "angle_right",
  "circle_left", "circle_right", "step_in", "step_out",
]);

export function isPunchCode(code: string): code is PunchCode {
  return PUNCH_CODES.has(code);
}
export function isDefenseCode(code: string): code is DefenseCode {
  return DEFENSE_CODES.has(code);
}
export function isFootworkCode(code: string): code is FootworkCode {
  return FOOTWORK_CODES.has(code);
}

// ── Punch properties ─────────────────────────────────────────────────────────

const BODY_PUNCHES = new Set<string>(["1b", "2b", "3b", "4b"]);
const POWER_PUNCHES = new Set<string>(["2", "3", "4", "5", "6", "2b", "3b", "4b"]);

export function isBodyShot(code: PunchCode): boolean {
  return BODY_PUNCHES.has(code);
}

export function isPowerPunch(code: PunchCode): boolean {
  return POWER_PUNCHES.has(code);
}

// ── getPunchName ─────────────────────────────────────────────────────────────

/**
 * Returns the human-readable name for a punch code, optionally stance-aware.
 * For defense and footwork codes, returns their name directly.
 */
export function getPunchName(
  code: ComboElement,
  stance: "orthodox" | "southpaw" = "orthodox"
): string {
  if (isPunchCode(code)) {
    return stance === "southpaw"
      ? PUNCH_NAMES_SOUTHPAW[code]
      : PUNCH_NAMES_ORTHODOX[code];
  }
  if (isDefenseCode(code)) return DEFENSE_NAMES[code];
  if (isFootworkCode(code)) return FOOTWORK_NAMES[code];
  return String(code);
}

// ── getComboDisplayText ──────────────────────────────────────────────────────

/**
 * Returns a display string for a combo sequence.
 * Example: ["1", "2", "slip", "3", "2"] → "1-2-Slip-3-2"
 */
export function getComboDisplayText(
  sequence: ComboElement[],
  mode: "codes" | "names" | "both" = "codes"
): string {
  if (!sequence || sequence.length === 0) return "--";
  return sequence
    .map((el) => {
      if (mode === "codes") {
        return isPunchCode(el) ? el : getPunchName(el);
      }
      if (mode === "names") {
        return getPunchName(el);
      }
      // "both"
      if (isPunchCode(el)) return `${el} (${getPunchName(el)})`;
      return getPunchName(el);
    })
    .join("-");
}

// ── computeComboStats ────────────────────────────────────────────────────────

type ComboStats = {
  totalPunches: number;
  headShotCount: number;
  bodyShotCount: number;
  powerPunchCount: number;
  speedPunchCount: number;
  defensiveCount: number;
  footworkCount: number;
};

/**
 * Computes stats for a combo sequence.
 * Auto-calculates head/body, power/speed, defense, and footwork counts.
 */
export function computeComboStats(sequence: ComboElement[]): ComboStats {
  let totalPunches = 0;
  let headShotCount = 0;
  let bodyShotCount = 0;
  let powerPunchCount = 0;
  let speedPunchCount = 0;
  let defensiveCount = 0;
  let footworkCount = 0;

  for (const el of sequence) {
    if (isPunchCode(el)) {
      totalPunches++;
      if (isBodyShot(el)) {
        bodyShotCount++;
      } else {
        headShotCount++;
      }
      if (isPowerPunch(el)) {
        powerPunchCount++;
      } else {
        speedPunchCount++;
      }
    } else if (isDefenseCode(el)) {
      defensiveCount++;
    } else if (isFootworkCode(el)) {
      footworkCount++;
    }
  }

  return {
    totalPunches,
    headShotCount,
    bodyShotCount,
    powerPunchCount,
    speedPunchCount,
    defensiveCount,
    footworkCount,
  };
}
