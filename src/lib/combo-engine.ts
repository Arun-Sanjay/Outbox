import type { Combo, ComboElement, ComboSessionConfig, DefenseCode, FootworkCode, PunchCode } from "../types";

// ── Tempo ranges (ms) ────────────────────────────────────────────────────────

const TEMPO_RANGES: Record<string, [number, number]> = {
  slow: [6000, 8000],
  medium: [4000, 6000],
  fast: [2000, 4000],
};

export function getTempoDelay(tempo: ComboSessionConfig["tempo"]): number {
  if (tempo === "random") {
    const tempos = ["slow", "medium", "fast"];
    const picked = tempos[Math.floor(Math.random() * tempos.length)];
    const [min, max] = TEMPO_RANGES[picked];
    return min + Math.random() * (max - min);
  }
  const [min, max] = TEMPO_RANGES[tempo] ?? TEMPO_RANGES.medium;
  return min + Math.random() * (max - min);
}

// ── Weighted random combo selection ──────────────────────────────────────────

export function getNextCombo(
  config: ComboSessionConfig,
  recentIds: string[],
  allCombos: Combo[]
): Combo | null {
  // If drill queue is active, iterate in order
  if (config.drillQueueIds && config.drillQueueIds.length > 0) {
    return getNextFromDrillQueue(config.drillQueueIds, recentIds, allCombos);
  }

  // Filter by sources
  let pool = allCombos.filter((c) => {
    if (config.includeFavorites && c.isFavorite) return true;
    return config.comboSources.includes(c.difficulty);
  });

  if (pool.length === 0) return null;

  // Weighted random: avoid last 3 drilled combos
  const recentSet = new Set(recentIds.slice(0, 3));
  const preferred = pool.filter((c) => !recentSet.has(c.id));

  // If all combos are in recent, just pick from full pool
  const selection = preferred.length > 0 ? preferred : pool;

  return selection[Math.floor(Math.random() * selection.length)];
}

function getNextFromDrillQueue(
  queueIds: string[],
  recentIds: string[],
  allCombos: Combo[]
): Combo | null {
  if (queueIds.length === 0) return null;

  // Find next combo in queue that wasn't just called
  const lastId = recentIds[0];
  const lastIndex = lastId ? queueIds.indexOf(lastId) : -1;
  const nextIndex = (lastIndex + 1) % queueIds.length;
  const nextId = queueIds[nextIndex];
  return allCombos.find((c) => c.id === nextId) ?? null;
}

// ── Footwork callouts ────────────────────────────────────────────────────────

const FOOTWORK_CODES: FootworkCode[] = [
  "pivot_left", "pivot_right", "angle_left", "angle_right",
  "circle_left", "circle_right", "step_in", "step_out",
];

export function getNextFootworkCall(recentCalls: string[]): FootworkCode {
  const recentSet = new Set(recentCalls.slice(0, 2));
  const preferred = FOOTWORK_CODES.filter((c) => !recentSet.has(c));
  const pool = preferred.length > 0 ? preferred : FOOTWORK_CODES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Defense callouts ─────────────────────────────────────────────────────────

const DEFENSE_CODES: DefenseCode[] = ["slip", "roll", "pull", "step_back", "block"];
const PREAMBLE_PUNCHES: PunchCode[] = ["1", "2", "1", "1", "2", "3"];

export function getNextDefenseCall(
  recentCalls: string[],
  addPreamble: boolean
): ComboElement[] {
  const recentSet = new Set(recentCalls.slice(0, 2));
  const preferred = DEFENSE_CODES.filter((c) => !recentSet.has(c));
  const pool = preferred.length > 0 ? preferred : DEFENSE_CODES;
  const defense = pool[Math.floor(Math.random() * pool.length)];

  if (!addPreamble) return [defense];

  // Add 1-2 random punches before the defense
  const punchCount = Math.random() < 0.5 ? 1 : 2;
  const punches: ComboElement[] = [];
  for (let i = 0; i < punchCount; i++) {
    punches.push(PREAMBLE_PUNCHES[Math.floor(Math.random() * PREAMBLE_PUNCHES.length)]);
  }
  return [...punches, defense];
}

// ── Punch count estimation ───────────────────────────────────────────────────

export function estimatePunchCount(
  calledCombos: { comboId: string }[],
  allCombos: Combo[]
): number {
  let total = 0;
  for (const record of calledCombos) {
    const combo = allCombos.find((c) => c.id === record.comboId);
    if (combo) total += combo.totalPunches;
  }
  return total;
}
