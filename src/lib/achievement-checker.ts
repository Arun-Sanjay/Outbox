import type {
  Achievement,
  BenchmarkType,
  Fight,
  Rank,
  SessionType,
  SparringEntry,
  TrainingSession,
} from "../types";

type CheckContext = {
  achievements: Achievement[];
  sessions: TrainingSession[];
  fights: Fight[];
  sparringEntries: SparringEntry[];
  currentStreak: number;
  customComboCount: number;
  uniqueComboDrilled: number;
  benchmarkTypes: BenchmarkType[];
  tipsRead: number;
  currentRank: Rank;
  hasFightCamp: boolean;
  madeWeight: boolean;
};

type Evaluator = {
  id: string;
  check: (ctx: CheckContext) => boolean;
};

function countByType(sessions: TrainingSession[], type: SessionType): number {
  return sessions.filter((s) => s.sessionType === type).length;
}

function totalRounds(sessions: TrainingSession[]): number {
  return sessions.reduce((sum, s) => sum + (s.rounds ?? 0), 0);
}

const ALL_SESSION_TYPES: SessionType[] = [
  "heavy_bag", "speed_bag", "double_end_bag", "shadow_boxing",
  "mitt_work", "sparring", "conditioning", "strength", "roadwork",
];

const ALL_BENCHMARK_TYPES: BenchmarkType[] = [
  "3min_punch_count", "shadow_3rounds", "skip_rope_3min", "5k_roadwork",
  "3k_roadwork", "push_ups_max", "burpees_3min", "plank_hold",
];

const EVALUATORS: Evaluator[] = [
  // Training
  { id: "first_blood", check: (ctx) => ctx.sessions.length >= 1 },
  { id: "century", check: (ctx) => ctx.sessions.length >= 100 },
  { id: "round_machine", check: (ctx) => totalRounds(ctx.sessions) >= 500 },
  { id: "thousand_rounds", check: (ctx) => totalRounds(ctx.sessions) >= 1000 },
  { id: "bag_destroyer", check: (ctx) => countByType(ctx.sessions, "heavy_bag") >= 50 },
  { id: "shadow_lord", check: (ctx) => countByType(ctx.sessions, "shadow_boxing") >= 50 },
  { id: "road_warrior", check: (ctx) => countByType(ctx.sessions, "roadwork") >= 50 },
  { id: "skip_master", check: (ctx) => countByType(ctx.sessions, "conditioning") >= 50 },

  // Fighting
  { id: "ring_general", check: (ctx) => ctx.fights.length >= 1 },
  {
    id: "undefeated",
    check: (ctx) => {
      const wins = ctx.fights.filter((f) => f.result === "win").length;
      const losses = ctx.fights.filter((f) => f.result === "loss").length;
      return wins >= 5 && losses === 0;
    },
  },
  {
    id: "knockout_artist",
    check: (ctx) =>
      ctx.fights.filter((f) => f.result === "win" && (f.method === "ko" || f.method === "tko")).length >= 3,
  },
  { id: "warrior", check: (ctx) => ctx.sparringEntries.length >= 20 },
  {
    id: "tape_study",
    check: (ctx) =>
      ctx.sparringEntries.filter((e) => e.roundNotes.some((r) => r.notes.length > 0)).length >= 10,
  },

  // Consistency
  { id: "week_strong", check: (ctx) => ctx.currentStreak >= 7 },
  { id: "two_week_warrior", check: (ctx) => ctx.currentStreak >= 14 },
  { id: "monthly_machine", check: (ctx) => ctx.currentStreak >= 30 },
  { id: "sixty_days", check: (ctx) => ctx.currentStreak >= 60 },
  { id: "immortal_90", check: (ctx) => ctx.currentStreak >= 90 },

  // Skill
  { id: "combo_master", check: (ctx) => ctx.customComboCount >= 10 },
  { id: "centurion", check: (ctx) => ctx.uniqueComboDrilled >= 100 },
  {
    id: "diversified",
    check: (ctx) => {
      const types = new Set(ctx.sessions.map((s) => s.sessionType));
      return ALL_SESSION_TYPES.every((t) => types.has(t));
    },
  },
  {
    id: "benchmark_setter",
    check: (ctx) => ALL_BENCHMARK_TYPES.every((t) => ctx.benchmarkTypes.includes(t)),
  },
  { id: "student", check: (ctx) => ctx.tipsRead >= 25 },

  // Milestones
  { id: "rank_prospect", check: (ctx) => ["prospect", "contender", "challenger", "champion", "undisputed"].includes(ctx.currentRank) },
  { id: "rank_contender", check: (ctx) => ["contender", "challenger", "champion", "undisputed"].includes(ctx.currentRank) },
  { id: "rank_challenger", check: (ctx) => ["challenger", "champion", "undisputed"].includes(ctx.currentRank) },
  { id: "rank_champion", check: (ctx) => ["champion", "undisputed"].includes(ctx.currentRank) },
  { id: "rank_undisputed", check: (ctx) => ctx.currentRank === "undisputed" },
  { id: "camp_ready", check: (ctx) => ctx.hasFightCamp },
  { id: "made_weight", check: (ctx) => ctx.madeWeight },
];

/**
 * Checks all achievements and returns newly unlocked ones.
 */
export function checkAchievements(ctx: CheckContext): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  for (const evaluator of EVALUATORS) {
    const achievement = ctx.achievements.find((a) => a.id === evaluator.id);
    if (!achievement) continue;
    if (achievement.unlockedAt !== null) continue; // Already unlocked

    if (evaluator.check(ctx)) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}
