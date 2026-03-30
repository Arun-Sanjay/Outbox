import type { Rank, SessionType } from "../types";

// ── XP per session type ──────────────────────────────────────────────────────

const SESSION_XP: Record<SessionType, number> = {
  heavy_bag: 40,
  speed_bag: 40,
  double_end_bag: 40,
  shadow_boxing: 40,
  mitt_work: 40,
  sparring: 50,
  conditioning: 40,
  strength: 40,
  roadwork: 40,
};

const COMBO_SESSION_XP = 60;

export function calculateSessionXP(
  sessionType: SessionType,
  comboModeUsed: boolean
): number {
  if (comboModeUsed) return COMBO_SESSION_XP;
  return SESSION_XP[sessionType] ?? 40;
}

// ── Fight XP ─────────────────────────────────────────────────────────────────

export function calculateFightXP(won: boolean): number {
  return won ? 125 : 75;
}

// ── Streak XP ────────────────────────────────────────────────────────────────

export function calculateStreakXP(streakDays: number, multiplier: number): number {
  return Math.round(10 * multiplier);
}

export function getStreakMultiplier(days: number): number {
  if (days >= 30) return 4.0;
  if (days >= 21) return 3.0;
  if (days >= 14) return 2.5;
  if (days >= 7) return 2.0;
  if (days >= 3) return 1.5;
  return 1.0;
}

// ── Rank thresholds ──────────────────────────────────────────────────────────

const RANK_THRESHOLDS: { rank: Rank; xp: number }[] = [
  { rank: "undisputed", xp: 15000 },
  { rank: "champion", xp: 7000 },
  { rank: "challenger", xp: 3500 },
  { rank: "contender", xp: 1500 },
  { rank: "prospect", xp: 500 },
  { rank: "rookie", xp: 0 },
];

export function getRankFromXP(xp: number): Rank {
  for (const t of RANK_THRESHOLDS) {
    if (xp >= t.xp) return t.rank;
  }
  return "rookie";
}

export function getXPForNextRank(currentXP: number): number {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (currentXP < RANK_THRESHOLDS[i].xp) {
      return RANK_THRESHOLDS[i].xp;
    }
  }
  return RANK_THRESHOLDS[0].xp; // Already at max
}

export function getRankProgress(currentXP: number): number {
  const currentRank = getRankFromXP(currentXP);
  const currentThreshold = RANK_THRESHOLDS.find((t) => t.rank === currentRank)?.xp ?? 0;
  const nextThreshold = getXPForNextRank(currentXP);

  if (nextThreshold <= currentThreshold) return 1; // Max rank
  const range = nextThreshold - currentThreshold;
  const progress = currentXP - currentThreshold;
  return Math.min(1, Math.max(0, progress / range));
}

export function checkRankUp(oldXP: number, newXP: number): Rank | null {
  const oldRank = getRankFromXP(oldXP);
  const newRank = getRankFromXP(newXP);
  return oldRank !== newRank ? newRank : null;
}
