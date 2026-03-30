/**
 * Phase 6 — Zustand Stores Test Script
 * Validates all 10 stores: exports, state fields, action methods, MMKV patterns, types
 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");

let passed = 0;
let failed = 0;
const results = [];

function testTrue(name, actual) {
  results.push({ name, expected: "true", actual: String(actual), pass: !!actual });
  if (actual) passed++; else failed++;
}
function testInc(name, src, pattern) {
  const found = src.includes(pattern);
  results.push({ name, expected: "contains", actual: found ? "found" : "NOT FOUND", pass: found });
  if (found) passed++; else failed++;
}
function test(name, expected, actual) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, expected: JSON.stringify(expected), actual: JSON.stringify(actual), pass });
  if (pass) passed++; else failed++;
}

// Read all store files
const stores = {
  combo: readSrc("stores/useComboStore.ts"),
  session: readSrc("stores/useSessionStore.ts"),
  fight: readSrc("stores/useFightStore.ts"),
  profile: readSrc("stores/useProfileStore.ts"),
  weight: readSrc("stores/useWeightStore.ts"),
  timer: readSrc("stores/useTimerStore.ts"),
  program: readSrc("stores/useProgramStore.ts"),
  benchmark: readSrc("stores/useBenchmarkStore.ts"),
  camp: readSrc("stores/useCampStore.ts"),
  knowledge: readSrc("stores/useKnowledgeStore.ts"),
};
const indexSrc = readSrc("stores/index.ts");

// ═══════════════════════════════════════════════════════════════════════════════
// BARREL EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== BARREL EXPORTS ===");
const storeNames = [
  "useComboStore", "useSessionStore", "useFightStore", "useProfileStore",
  "useWeightStore", "useTimerStore", "useProgramStore", "useBenchmarkStore",
  "useCampStore", "useKnowledgeStore"
];
for (const name of storeNames) {
  testInc(`index exports ${name}`, indexSrc, `export { ${name} }`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALL STORES: COMMON PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== COMMON PATTERNS (all stores) ===");
const storeEntries = Object.entries(stores);
for (const [key, src] of storeEntries) {
  testInc(`${key}: imports from zustand`, src, 'from "zustand"');
  testInc(`${key}: uses create<`, src, "create<");
  testInc(`${key}: has loadFromMMKV`, src, "loadFromMMKV");
  testInc(`${key}: has persistToMMKV`, src, "persistToMMKV");
  testInc(`${key}: imports getJSON`, src, "getJSON");
  testInc(`${key}: imports setJSON`, src, "setJSON");
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBO STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== COMBO STORE ===");
const cs = stores.combo;
// State fields (updated in Phase 22)
testInc("combo: combos state", cs, "combos: Combo[]");
testInc("combo: favorites state", cs, "favorites: string[]");
testInc("combo: drillQueue state", cs, "drillQueue: string[]");
testInc("combo: lastDrilledComboIds state", cs, "lastDrilledComboIds: string[]");
// Actions (Phase 22 API)
for (const action of ["addCustomCombo", "deleteCustomCombo", "toggleFavorite", "addToDrillQueue", "removeFromDrillQueue", "reorderDrillQueue", "clearDrillQueue", "recordComboCallout", "searchCombos", "filterByDifficulty", "getAllCombos", "getCombo", "getDrillQueue", "getFavorites", "getCombosBySource"]) {
  testInc(`combo: ${action} action`, cs, `${action}:`);
}
// MMKV keys
testInc("combo: MMKV key custom_combos", cs, '"custom_combos"');
testInc("combo: MMKV key drill_queue", cs, '"drill_queue"');
// Default values
testInc("combo: default favorites []", cs, "favorites: []");
testInc("combo: default drillQueue []", cs, "drillQueue: []");
// Imports
testInc("combo: imports Combo type", cs, "Combo");

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== SESSION STORE ===");
const ss = stores.session;
testInc("session: activeSession state", ss, "activeSession: ActiveComboSession | null");
testInc("session: trainingHistory state", ss, "trainingHistory: TrainingSession[]");
testInc("session: isSessionActive state", ss, "isSessionActive: boolean");
for (const action of ["startComboSession", "calloutCombo", "updateSessionRound", "updateSessionResting", "updateSessionPaused", "updateSessionStats", "completeComboSession", "abandonComboSession", "addTrainingSession", "updateTrainingSession", "deleteTrainingSession", "getTrainingHistory", "getSessionsByType", "getSessionsByDateRange"]) {
  testInc(`session: ${action} action`, ss, `${action}:`);
}
testInc("session: MMKV key active_session", ss, '"active_session"');
testInc("session: MMKV key training_history", ss, '"training_history"');
testInc("session: uses nextId", ss, "nextId()");
testInc("session: default activeSession null", ss, "activeSession: null");
testInc("session: default trainingHistory []", ss, "trainingHistory: []");
testInc("session: imports ComboSessionConfig", ss, "ComboSessionConfig");
testInc("session: imports ActiveComboSession", ss, "ActiveComboSession");

// ═══════════════════════════════════════════════════════════════════════════════
// FIGHT STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== FIGHT STORE ===");
const fs = stores.fight;
testInc("fight: fights state", fs, "fights: Fight[]");
testInc("fight: sparringEntries state", fs, "sparringEntries: SparringEntry[]");
testInc("fight: sparringPartners state", fs, "sparringPartners: SparringPartner[]");
for (const action of ["addFight", "updateFight", "deleteFight", "getFightById", "getFightsByResult", "getFightsByType", "addSparringEntry", "updateSparringEntry", "deleteSparringEntry", "getSparringEntryById", "getSparringEntriesByPartner", "addOrUpdateSparringPartner", "getSparringPartner", "getAllSparringPartners", "updatePartnerStats"]) {
  testInc(`fight: ${action} action`, fs, `${action}:`);
}
testInc("fight: MMKV key fights", fs, '"fights"');
testInc("fight: MMKV key sparring", fs, '"sparring"');
testInc("fight: MMKV key sparring_partners", fs, '"sparring_partners"');

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== PROFILE STORE ===");
const ps = stores.profile;
testInc("profile: profile state", ps, "profile: UserProfile | null");
testInc("profile: xpHistory state", ps, "xpHistory: XPEntry[]");
testInc("profile: achievements state", ps, "achievements: Achievement[]");
testInc("profile: currentRank state", ps, "currentRank: Rank");
for (const action of ["initializeProfile", "updateProfile", "updateName", "updateFightName", "updateStance", "updateExperienceLevel", "updatePhysicalStats", "addXP", "updateStreak", "getStreakMultiplier", "getRankFromXP", "unlockAchievement", "updateCalloutPreferences", "updateAudioSettings", "updateHapticsEnabled", "setTrainingReminder", "updateLastTrainingDate", "setActiveFightCamp", "setActiveProgram", "setBoxerType"]) {
  testInc(`profile: ${action} action`, ps, `${action}:`);
}
testInc("profile: MMKV key user_profile", ps, '"user_profile"');
testInc("profile: default profile null", ps, "profile: null");
testInc("profile: default currentRank rookie", ps, 'currentRank: "rookie"');
// Rank thresholds
testInc("profile: rank thresholds defined", ps, "RANK_THRESHOLDS");
testInc("profile: undisputed 15000", ps, "15000");
testInc("profile: champion 7000", ps, "7000");
testInc("profile: challenger 3500", ps, "3500");
testInc("profile: contender 1500", ps, "1500");
testInc("profile: prospect 500", ps, "500");
// Streak multipliers
testInc("profile: streak 30 = 4.0", ps, "return 4.0");
testInc("profile: streak 21 = 3.0", ps, "return 3.0");
testInc("profile: streak 14 = 2.5", ps, "return 2.5");
testInc("profile: streak 7 = 2.0", ps, "return 2.0");
testInc("profile: streak 3 = 1.5", ps, "return 1.5");
testInc("profile: streak default 1.0", ps, "return 1.0");
testInc("profile: uses nextId for XP entries", ps, "nextId()");

// ═══════════════════════════════════════════════════════════════════════════════
// WEIGHT STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== WEIGHT STORE ===");
const ws = stores.weight;
testInc("weight: entries state", ws, "entries: WeightEntry[]");
testInc("weight: currentWeight state", ws, "currentWeight: number | null");
testInc("weight: unit state", ws, 'unit: "kg" | "lb"');
for (const action of ["addWeightEntry", "updateWeightEntry", "deleteWeightEntry", "getWeightEntries", "getWeightTrend", "getCurrentWeight", "setPreferredUnit", "convertWeight"]) {
  testInc(`weight: ${action} action`, ws, `${action}:`);
}
testInc("weight: MMKV key weight_entries", ws, '"weight_entries"');
testInc("weight: default entries []", ws, "entries: []");
testInc("weight: default currentWeight null", ws, "currentWeight: null");
testInc("weight: kg to lb conversion", ws, "2.20462");

// ═══════════════════════════════════════════════════════════════════════════════
// TIMER STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== TIMER STORE ===");
const ts = stores.timer;
testInc("timer: presets state", ts, "presets: TimerPreset[]");
testInc("timer: activeTimer state", ts, "activeTimer: ActiveTimer | null");
testInc("timer: defaultPresets state", ts, "defaultPresets: TimerPreset[]");
for (const action of ["createCustomPreset", "updatePreset", "deletePreset", "getPreset", "setDefaultPreset", "startTimer", "updateTimerRound", "updateTimerResting", "updateTimerPaused", "updateTimerElapsed", "stopTimer"]) {
  testInc(`timer: ${action} action`, ts, `${action}:`);
}
testInc("timer: MMKV key timer_presets", ts, '"timer_presets"');
// Presets now in data/presets.ts — check store imports them
testInc("timer: imports DEFAULT_TIMER_PRESETS", ts, "DEFAULT_TIMER_PRESETS");
testInc("timer: imports from data/presets", ts, "../data/presets");
testInc("timer: default activeTimer null", ts, "activeTimer: null");
// Check presets exist in data file
const presetData = readSrc("data/presets.ts");
testInc("timer: Standard Boxing in data", presetData, '"Standard Boxing"');
testInc("timer: Tabata in data", presetData, '"Tabata"');
testInc("timer: Heavy Bag Blitz in data", presetData, '"Heavy Bag Blitz"');
testInc("timer: 180s rounds in data", presetData, "roundSeconds: 180");
testInc("timer: 20s rounds in data", presetData, "roundSeconds: 20");

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRAM STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== PROGRAM STORE ===");
const pgs = stores.program;
testInc("program: programs state", pgs, "programs: TrainingProgram[]");
testInc("program: activeProgramData state", pgs, "activeProgramData:");
testInc("program: boxerType state", pgs, "boxerType: BoxerType | null");
testInc("program: quizCompleted state", pgs, "quizCompleted: boolean");
for (const action of ["setBoxerType", "getAllPrograms", "getProgramById", "getProgramsByBoxerType", "getProgramsByFocus", "startProgram", "completeDay", "stopProgram", "getActiveProgram", "setQuizCompleted"]) {
  testInc(`program: ${action} action`, pgs, `${action}:`);
}
testInc("program: MMKV key active_program_data", pgs, '"active_program_data"');
testInc("program: MMKV key boxer_type", pgs, '"boxer_type"');
testInc("program: default activeProgramData null", pgs, "activeProgramData: null");
testInc("program: default quizCompleted false", pgs, "quizCompleted: false");

// ═══════════════════════════════════════════════════════════════════════════════
// BENCHMARK STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== BENCHMARK STORE ===");
const bs = stores.benchmark;
testInc("benchmark: entries state", bs, "entries: BenchmarkEntry[]");
testInc("benchmark: currentBenchmarks state", bs, "currentBenchmarks: CurrentBenchmarks");
for (const action of ["logBenchmark", "updateBenchmarkEntry", "deleteBenchmarkEntry", "getBenchmarksByType", "getLatestBenchmark", "getBenchmarkProgress", "getAllLatestBenchmarks", "calculateProgress"]) {
  testInc(`benchmark: ${action} action`, bs, `${action}:`);
}
testInc("benchmark: MMKV key benchmarks", bs, '"benchmarks"');
testInc("benchmark: default entries []", bs, "entries: []");
// All 8 benchmark types in EMPTY_BENCHMARKS
for (const bt of ["3min_punch_count", "shadow_3rounds", "skip_rope_3min", "5k_roadwork", "3k_roadwork", "push_ups_max", "burpees_3min", "plank_hold"]) {
  testInc(`benchmark: EMPTY has ${bt}`, bs, bt);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMP STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== CAMP STORE ===");
const cps = stores.camp;
testInc("camp: camps state", cps, "camps: FightCamp[]");
testInc("camp: activeCamp state", cps, "activeCamp: FightCamp | null");
for (const action of ["createCamp", "updateCamp", "deleteCamp", "getCampById", "setActiveCamp", "getActiveCamp", "getCampByFightDate", "completeWeightCut", "getCampsInProgress", "getCampHistory", "calculateWeightCutStatus"]) {
  testInc(`camp: ${action} action`, cps, `${action}:`);
}
testInc("camp: MMKV key fight_camps", cps, '"fight_camps"');
testInc("camp: default camps []", cps, "camps: []");
testInc("camp: default activeCamp null", cps, "activeCamp: null");
testInc("camp: uses daysUntil", cps, "daysUntil");
testInc("camp: imports from date lib", cps, 'from "../lib/date"');

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== KNOWLEDGE STORE ===");
const ks = stores.knowledge;
testInc("knowledge: dailyTips state", ks, "dailyTips: BoxingTip[]");
testInc("knowledge: glossaryTerms state", ks, "glossaryTerms: GlossaryEntry[]");
testInc("knowledge: punchReference state", ks, "punchReference: PunchReference[]");
testInc("knowledge: bookmarkedTerms state", ks, "bookmarkedTerms: string[]");
testInc("knowledge: lastDailyTipDate state", ks, "lastDailyTipDate: string | null");
testInc("knowledge: currentDailyTipId state", ks, "currentDailyTipId: string | null");
for (const action of ["getDailyTip", "getTipsByCategory", "getGlossaryTerm", "searchGlossary", "toggleBookmark", "getBookmarkedTerms", "getPunchReference", "getAllPunchReferences", "getDefenseReference", "setLastDailyTipDate"]) {
  testInc(`knowledge: ${action} action`, ks, `${action}:`);
}
testInc("knowledge: default bookmarkedTerms []", ks, "bookmarkedTerms: []");
testInc("knowledge: default lastDailyTipDate null", ks, "lastDailyTipDate: null");
testInc("knowledge: imports PunchCode type", ks, "PunchCode");
testInc("knowledge: imports DefenseCode type", ks, "DefenseCode");
testInc("knowledge: imports BoxingTip type", ks, "BoxingTip");
testInc("knowledge: imports GlossaryEntry type", ks, "GlossaryEntry");

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE SAFETY: ALL STORES IMPORT CORRECT TYPES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== TYPE IMPORTS ===");
testInc("combo imports from types", cs, 'from "../types"');
testInc("session imports from types", ss, 'from "../types"');
testInc("fight imports from types", fs, 'from "../types"');
testInc("profile imports from types", ps, 'from "../types"');
testInc("weight imports from types", ws, 'from "../types"');
testInc("timer imports from types", ts, 'from "../types"');
testInc("program imports from types", pgs, 'from "../types"');
testInc("benchmark imports from types", bs, 'from "../types"');
testInc("camp imports from types", cps, 'from "../types"');
testInc("knowledge imports from types", ks, 'from "../types"');

// ═══════════════════════════════════════════════════════════════════════════════
// NO ASYNCSTORAGE IN ANY STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== NO ASYNCSTORAGE ===");
for (const [key, src] of storeEntries) {
  testTrue(`${key}: no AsyncStorage`, !src.includes("AsyncStorage"));
}

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme.ts intact", readSrc("theme.ts").length > 1000);
testTrue("components/index.ts intact", readSrc("components/index.ts").includes("Panel"));
testTrue("db/storage.ts intact", readSrc("db/storage.ts").includes("outbox-storage"));
testTrue("lib/date.ts intact", readSrc("lib/date.ts").includes("toLocalDateKey"));
testTrue("types/index.ts intact", readSrc("types/index.ts").includes("PunchCode"));

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT RESULTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n");
console.log("=".repeat(80));
console.log("STAGE 3 — FULL TEST RESULTS");
console.log("=".repeat(80));
for (const r of results) {
  const icon = r.pass ? "PASS" : "FAIL";
  console.log(`${icon} | ${r.name}`);
  if (!r.pass) {
    console.log(`       Expected: ${r.expected}`);
    console.log(`       Actual:   ${r.actual}`);
  }
}

console.log("\n" + "=".repeat(80));
console.log(`TOTAL: ${passed + failed} tests | ${passed} PASSED | ${failed} FAILED`);
console.log("=".repeat(80));

if (failed > 0) {
  console.log("\nFAILURES DETECTED");
  process.exit(1);
} else {
  console.log("\nALL TESTS PASSED");
  process.exit(0);
}
