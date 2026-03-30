import type { Achievement } from "../types";

export const ACHIEVEMENTS: Achievement[] = [
  // ── Training (8) ───────────────────────────────────────────────────────────
  { id: "first_blood", name: "First Blood", description: "Complete your first training session", icon: "fitness", xpReward: 25, unlockedAt: null, category: "training" },
  { id: "century", name: "Century", description: "Complete 100 training sessions", icon: "trophy", xpReward: 200, unlockedAt: null, category: "training" },
  { id: "round_machine", name: "Round Machine", description: "Complete 500 total rounds", icon: "timer", xpReward: 150, unlockedAt: null, category: "training" },
  { id: "thousand_rounds", name: "Thousand Rounds", description: "Complete 1,000 total rounds", icon: "medal", xpReward: 300, unlockedAt: null, category: "training" },
  { id: "bag_destroyer", name: "Bag Destroyer", description: "Log 50 heavy bag sessions", icon: "fitness", xpReward: 100, unlockedAt: null, category: "training" },
  { id: "shadow_lord", name: "Shadow Lord", description: "Log 50 shadow boxing sessions", icon: "person", xpReward: 100, unlockedAt: null, category: "training" },
  { id: "road_warrior", name: "Road Warrior", description: "Log 50 roadwork sessions", icon: "walk", xpReward: 100, unlockedAt: null, category: "training" },
  { id: "skip_master", name: "Skip Master", description: "Log 50 skip rope sessions", icon: "heart", xpReward: 100, unlockedAt: null, category: "training" },

  // ── Fighting (5) ───────────────────────────────────────────────────────────
  { id: "ring_general", name: "Ring General", description: "Log your first fight", icon: "flash", xpReward: 50, unlockedAt: null, category: "fighting" },
  { id: "undefeated", name: "Undefeated", description: "Win 5 fights without a loss", icon: "shield-checkmark", xpReward: 250, unlockedAt: null, category: "fighting" },
  { id: "knockout_artist", name: "Knockout Artist", description: "Win 3 fights by KO/TKO", icon: "flash", xpReward: 200, unlockedAt: null, category: "fighting" },
  { id: "warrior", name: "Warrior", description: "Complete 20 sparring sessions", icon: "people", xpReward: 150, unlockedAt: null, category: "fighting" },
  { id: "tape_study", name: "Tape Study", description: "Log round-by-round notes in 10 sparring sessions", icon: "document-text", xpReward: 100, unlockedAt: null, category: "fighting" },

  // ── Consistency (5) ────────────────────────────────────────────────────────
  { id: "week_strong", name: "Week Strong", description: "Maintain a 7-day training streak", icon: "flame", xpReward: 50, unlockedAt: null, category: "consistency" },
  { id: "two_week_warrior", name: "Two Week Warrior", description: "Maintain a 14-day training streak", icon: "flame", xpReward: 100, unlockedAt: null, category: "consistency" },
  { id: "monthly_machine", name: "Monthly Machine", description: "Maintain a 30-day training streak", icon: "flame", xpReward: 200, unlockedAt: null, category: "consistency" },
  { id: "sixty_days", name: "Sixty Days Strong", description: "Maintain a 60-day training streak", icon: "flame", xpReward: 300, unlockedAt: null, category: "consistency" },
  { id: "immortal_90", name: "Immortal", description: "Maintain a 90-day training streak", icon: "flame", xpReward: 500, unlockedAt: null, category: "consistency" },

  // ── Skill (5) ──────────────────────────────────────────────────────────────
  { id: "combo_master", name: "Combo Master", description: "Create 10 custom combos", icon: "construct", xpReward: 100, unlockedAt: null, category: "skill" },
  { id: "centurion", name: "Centurion", description: "Drill 100 different combos", icon: "barbell", xpReward: 150, unlockedAt: null, category: "skill" },
  { id: "diversified", name: "Diversified", description: "Train all 9 session types", icon: "apps", xpReward: 100, unlockedAt: null, category: "skill" },
  { id: "benchmark_setter", name: "Benchmark Setter", description: "Log all 8 benchmark types", icon: "stats-chart", xpReward: 100, unlockedAt: null, category: "skill" },
  { id: "student", name: "Student of the Game", description: "Read 25 daily tips", icon: "book", xpReward: 75, unlockedAt: null, category: "skill" },

  // ── Milestones (7) ─────────────────────────────────────────────────────────
  { id: "rank_prospect", name: "Prospect", description: "Reach Prospect rank", icon: "trending-up", xpReward: 0, unlockedAt: null, category: "milestone" },
  { id: "rank_contender", name: "Contender", description: "Reach Contender rank", icon: "trending-up", xpReward: 0, unlockedAt: null, category: "milestone" },
  { id: "rank_challenger", name: "Challenger", description: "Reach Challenger rank", icon: "trending-up", xpReward: 0, unlockedAt: null, category: "milestone" },
  { id: "rank_champion", name: "Champion", description: "Reach Champion rank", icon: "trophy", xpReward: 0, unlockedAt: null, category: "milestone" },
  { id: "rank_undisputed", name: "Undisputed", description: "Reach Undisputed rank", icon: "ribbon", xpReward: 0, unlockedAt: null, category: "milestone" },
  { id: "camp_ready", name: "Camp Ready", description: "Set up your first fight camp", icon: "calendar", xpReward: 50, unlockedAt: null, category: "milestone" },
  { id: "made_weight", name: "Made Weight", description: "Complete a weight cut for fight camp", icon: "scale", xpReward: 75, unlockedAt: null, category: "milestone" },
];
