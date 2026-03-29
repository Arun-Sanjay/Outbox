// ─────────────────────────────────────────────
// PUNCH / DEFENSE / FOOTWORK CODES
// ─────────────────────────────────────────────

export type PunchCode =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "1b"
  | "2b"
  | "3b"
  | "4b";

export type DefenseCode =
  | "slip"
  | "roll"
  | "pull"
  | "step_back"
  | "block";

export type FootworkCode =
  | "pivot_left"
  | "pivot_right"
  | "angle_left"
  | "angle_right"
  | "circle_left"
  | "circle_right"
  | "step_in"
  | "step_out";

export type ComboElement = PunchCode | DefenseCode | FootworkCode;

// ─────────────────────────────────────────────
// PUNCH INFO
// ─────────────────────────────────────────────

export type PunchInfo = {
  code: PunchCode;
  name: string;
  orthodoxHand: "left" | "right";
  southpawHand: "left" | "right";
  target: "head" | "body";
  type: "speed" | "power";
  formCues: string[];
  commonMistakes: string[];
};

// ─────────────────────────────────────────────
// COMBO
// ─────────────────────────────────────────────

export type Combo = {
  id: string;
  name: string;
  sequence: ComboElement[];
  difficulty: "beginner" | "intermediate" | "advanced";
  scope: "system" | "personal";
  isFavorite: boolean;
  headShotCount: number;
  bodyShotCount: number;
  powerPunchCount: number;
  speedPunchCount: number;
  defensiveCount: number;
  footworkCount: number;
  totalPunches: number;
  createdAt: number;
};

// ─────────────────────────────────────────────
// COMBO SESSION CONFIG
// ─────────────────────────────────────────────

export type ComboSessionConfig = {
  drillMode: "combo" | "footwork" | "defense";
  comboSources: ("beginner" | "intermediate" | "advanced")[];
  includeFavorites: boolean;
  drillQueueIds: string[] | null;
  roundLength: number;
  restLength: number;
  numRounds: number;
  tempo: "slow" | "medium" | "fast" | "random";
  calloutStyle: "numbers" | "names" | "both";
  stance: "orthodox" | "southpaw" | "switch";
  warmupRound: boolean;
  warmupLength: number;
  tenSecondWarning: boolean;
  bellSound: "classic" | "buzzer" | "horn";
};

// ─────────────────────────────────────────────
// COMBO CALLOUT RECORD
// ─────────────────────────────────────────────

export type ComboCalloutRecord = {
  comboId: string;
  calledAt: number;
  round: number;
};

// ─────────────────────────────────────────────
// ACTIVE COMBO SESSION
// ─────────────────────────────────────────────

export type ActiveComboSession = {
  id: number;
  config: ComboSessionConfig;
  startedAt: number;
  currentRound: number;
  isResting: boolean;
  isPaused: boolean;
  combosCalledOut: ComboCalloutRecord[];
  totalPunchesEstimated: number;
  headShotsEstimated: number;
  bodyShotsEstimated: number;
  powerPunchesEstimated: number;
  speedPunchesEstimated: number;
  status: "active" | "completed" | "abandoned";
};

// ─────────────────────────────────────────────
// SESSION TYPE & INTENSITY
// ─────────────────────────────────────────────

export type SessionType =
  | "heavy_bag"
  | "speed_bag"
  | "double_end_bag"
  | "shadow_boxing"
  | "mitt_work"
  | "sparring"
  | "conditioning"
  | "strength"
  | "roadwork";

export type Intensity = "light" | "moderate" | "hard" | "war";

// ─────────────────────────────────────────────
// TRAINING SESSION
// ─────────────────────────────────────────────

export type TrainingSession = {
  id: number;
  sessionType: SessionType;
  date: string;
  startedAt: number;
  durationSeconds: number;
  rounds: number | null;
  intensity: Intensity;
  energyRating: number;
  sharpnessRating: number;
  notes: string;
  comboSessionId: number | null;
  timerPresetId: number | null;
  comboModeUsed: boolean;
  partnerName: string | null;
  coachName: string | null;
  distanceMeters: number | null;
  routeDescription: string | null;
  conditioningType: string | null;
  xpEarned: number;
  createdAt: number;
};

// ─────────────────────────────────────────────
// FIGHT TYPES
// ─────────────────────────────────────────────

export type FightType = "amateur" | "professional" | "exhibition" | "sparring";

export type FightResult = "win" | "loss" | "draw" | "no_contest";

export type FightMethod =
  | "ko"
  | "tko"
  | "unanimous_decision"
  | "split_decision"
  | "majority_decision"
  | "corner_stoppage"
  | "dq"
  | "points";

export type WeightClass =
  | "strawweight"
  | "flyweight"
  | "bantamweight"
  | "featherweight"
  | "lightweight"
  | "super_lightweight"
  | "welterweight"
  | "super_welterweight"
  | "middleweight"
  | "super_middleweight"
  | "light_heavyweight"
  | "cruiserweight"
  | "heavyweight";

// ─────────────────────────────────────────────
// FIGHT
// ─────────────────────────────────────────────

export type Fight = {
  id: number;
  fightType: FightType;
  date: string;
  location: string;
  opponentName: string;
  opponentRecord: string | null;
  weightClass: WeightClass;
  weighInWeight: number | null;
  scheduledRounds: number;
  result: FightResult;
  method: FightMethod | null;
  endedRound: number | null;
  endedTime: string | null;
  cornerCoach: string | null;
  notesWorked: string;
  notesImprove: string;
  generalNotes: string;
  physicalRating: number;
  mentalRating: number;
  xpEarned: number;
  createdAt: number;
};

// ─────────────────────────────────────────────
// SPARRING
// ─────────────────────────────────────────────

export type SparringRoundNote = {
  roundNumber: number;
  notes: string;
  dominance: "me" | "them" | "even";
};

export type SparringEntry = {
  id: number;
  sessionId: number;
  partnerName: string;
  partnerExperience: "beginner" | "intermediate" | "advanced" | "pro";
  rounds: number;
  roundNotes: SparringRoundNote[];
  overallNotes: string;
  whatWorked: string;
  whatToImprove: string;
  intensity: Intensity;
  date: string;
  createdAt: number;
};

export type SparringPartner = {
  name: string;
  totalSessions: number;
  lastSparred: string;
  averageIntensity: Intensity;
  notes: string;
};

// ─────────────────────────────────────────────
// TIMER PRESET
// ─────────────────────────────────────────────

export type TimerPreset = {
  id: number;
  name: string;
  roundSeconds: number;
  restSeconds: number;
  numRounds: number;
  warmupSeconds: number;
  tenSecondWarning: boolean;
  bellSound: "classic" | "buzzer" | "horn";
  warningSound: "clap" | "beep" | "stick";
  isDefault: boolean;
  isCustom: boolean;
  createdAt: number;
};

// ─────────────────────────────────────────────
// FIGHT CAMP & WEIGHT
// ─────────────────────────────────────────────

export type FightCamp = {
  id: number;
  fightDate: string;
  opponentName: string | null;
  weightClass: WeightClass;
  targetWeight: number;
  currentWeight: number;
  startDate: string;
  isActive: boolean;
  notes: string;
  createdAt: number;
};

export type WeightEntry = {
  id: number;
  weight: number;
  unit: "kg" | "lb";
  date: string;
  fightCampId: number | null;
  notes: string;
};

// ─────────────────────────────────────────────
// BENCHMARKS
// ─────────────────────────────────────────────

export type BenchmarkType =
  | "3min_punch_count"
  | "shadow_3rounds"
  | "skip_rope_3min"
  | "5k_roadwork"
  | "3k_roadwork"
  | "push_ups_max"
  | "burpees_3min"
  | "plank_hold";

export type BenchmarkEntry = {
  id: number;
  type: BenchmarkType;
  value: number;
  date: string;
  notes: string;
  createdAt: number;
};

// ─────────────────────────────────────────────
// PROGRAMS
// ─────────────────────────────────────────────

export type BoxerType =
  | "complete_beginner"
  | "gym_background"
  | "cardio_background"
  | "returning_boxer"
  | "intermediate_boxer"
  | "competition_prep";

export type ProgramFocus =
  | "power"
  | "cardio"
  | "mobility"
  | "footwork"
  | "technique"
  | "fight_camp"
  | "general";

export type ProgramDay = {
  dayNumber: number;
  title: string;
  description: string;
  sessionType: SessionType;
  suggestedDuration: number;
  suggestedRounds: number | null;
  suggestedIntensity: Intensity;
  comboSetIds: string[] | null;
  exercises: string[] | null;
  notes: string;
  isRestDay: boolean;
};

export type TrainingProgram = {
  id: string;
  name: string;
  description: string;
  focus: ProgramFocus;
  targetBoxerType: BoxerType[];
  durationWeeks: number;
  daysPerWeek: number;
  days: ProgramDay[];
  isPremium: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  createdAt: number;
};

// ─────────────────────────────────────────────
// GAMIFICATION
// ─────────────────────────────────────────────

export type Rank =
  | "rookie"
  | "prospect"
  | "contender"
  | "challenger"
  | "champion"
  | "undisputed";

export type XPSource =
  | "training"
  | "combo_drill"
  | "sparring"
  | "fight"
  | "streak"
  | "achievement"
  | "benchmark"
  | "program";

export type XPEntry = {
  id: number;
  amount: number;
  source: XPSource;
  description: string;
  earnedAt: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt: number | null;
  category: "training" | "fighting" | "consistency" | "skill" | "milestone";
};

// ─────────────────────────────────────────────
// USER PROFILE
// ─────────────────────────────────────────────

export type UserProfile = {
  name: string;
  fightName: string | null;
  stance: "orthodox" | "southpaw" | "switch";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  trainingGoals: string[];
  weight: number | null;
  weightUnit: "kg" | "lb";
  height: number | null;
  heightUnit: "cm" | "in";
  reach: number | null;
  reachUnit: "cm" | "in";
  activeWeightClass: WeightClass | null;
  totalXP: number;
  rank: Rank;
  xpHistory: XPEntry[];
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
  lastTrainingDate: string;
  streakMultiplier: number;
  activeFightCampId: number | null;
  boxerType: BoxerType | null;
  activeProgramId: string | null;
  ttsRate: number;
  ttsPitch: number;
  calloutStyle: "numbers" | "names" | "both";
  bellSound: "classic" | "buzzer" | "horn";
  warningSound: "clap" | "beep" | "stick";
  masterVolume: number;
  bellVolume: number;
  calloutVolume: number;
  notifications: boolean;
  trainingReminder: string | null;
  hapticsEnabled: boolean;
  createdAt: number;
};

// ─────────────────────────────────────────────
// KNOWLEDGE
// ─────────────────────────────────────────────

export type BoxingTip = {
  id: string;
  title: string;
  content: string;
  category: "offense" | "defense" | "footwork" | "conditioning" | "mindset" | "nutrition" | "recovery";
};

export type GlossaryEntry = {
  id: string;
  term: string;
  definition: string;
  category: "technique" | "equipment" | "rules" | "slang" | "training";
};
