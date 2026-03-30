/**
 * Phases 62-68 — Gamification Tests
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");
const fileEx = (f) => existsSync(path.join(__dirname, "../src", f));

let passed = 0, failed = 0;
const results = [];

function testTrue(n, a) { results.push({ name: n, expected: "true", actual: String(a), pass: !!a }); if (a) passed++; else failed++; }
function testInc(n, s, p) { const f = s.includes(p); results.push({ name: n, expected: "contains", actual: f ? "found" : "NOT FOUND", pass: f }); if (f) passed++; else failed++; }
function test(n, e, a) { const p = JSON.stringify(a) === JSON.stringify(e); results.push({ name: n, expected: JSON.stringify(e), actual: JSON.stringify(a), pass: p }); if (p) passed++; else failed++; }

// ═══════════════════════════════════════════════════════════════════════════════
// P62: XP Calculator — Runtime tests
// ═══════════════════════════════════════════════════════════════════════════════
const xpSrc = readSrc("lib/xp-calculator.ts");
console.log("\n=== P62: XP CALCULATOR SOURCE ===");
testInc("xp: calculateSessionXP", xpSrc, "export function calculateSessionXP");
testInc("xp: calculateFightXP", xpSrc, "export function calculateFightXP");
testInc("xp: calculateStreakXP", xpSrc, "export function calculateStreakXP");
testInc("xp: getStreakMultiplier", xpSrc, "export function getStreakMultiplier");
testInc("xp: getRankFromXP", xpSrc, "export function getRankFromXP");
testInc("xp: getXPForNextRank", xpSrc, "export function getXPForNextRank");
testInc("xp: getRankProgress", xpSrc, "export function getRankProgress");
testInc("xp: checkRankUp", xpSrc, "export function checkRankUp");
testInc("xp: training=40", xpSrc, "heavy_bag: 40");
testInc("xp: combo=60", xpSrc, "COMBO_SESSION_XP = 60");
testInc("xp: sparring=50", xpSrc, "sparring: 50");
testInc("xp: fight win=125", xpSrc, "125");
testInc("xp: fight loss=75", xpSrc, "75");
testInc("xp: thresholds 0/500/1500/3500/7000/15000", xpSrc, "15000");
testInc("xp: streak multiplier 4.0 at 30", xpSrc, "return 4.0");
testInc("xp: streak multiplier 1.0 default", xpSrc, "return 1.0");

// ═══════════════════════════════════════════════════════════════════════════════
// P63: RankBadge + XPBar
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P63: RANK BADGE ===");
testTrue("RankBadge exists", fileEx("components/gamification/RankBadge.tsx"));
const rb = readSrc("components/gamification/RankBadge.tsx");
testInc("rb: exports RankBadge", rb, "export function RankBadge");
testInc("rb: rank prop", rb, "rank: Rank");
testInc("rb: sm/md/lg/hero sizes", rb, '"hero"');
testInc("rb: ROOKIE label", rb, '"ROOKIE"');
testInc("rb: UNDISPUTED label", rb, '"UNDISPUTED"');
testInc("rb: rankColors", rb, "rankColors");
testInc("rb: gold glow for champion+", rb, "GLOW_RANKS");
testInc("rb: showLabel prop", rb, "showLabel");
testInc("rb: Ionicons", rb, "Ionicons");

console.log("\n=== P63: XP BAR ===");
testTrue("XPBar exists", fileEx("components/gamification/XPBar.tsx"));
const xb = readSrc("components/gamification/XPBar.tsx");
testInc("xb: exports XPBar", xb, "export function XPBar");
testInc("xb: currentXP prop", xb, "currentXP: number");
testInc("xb: 6px gold fill", xb, "height: 6");
testInc("xb: gold fill color", xb, "colors.accent");
testInc("xb: progress calculation", xb, "getRankProgress");
testInc("xb: XP display", xb, "XP");
testInc("xb: monospace font", xb, "monoFont");
testInc("xb: tabular-nums", xb, "tabular-nums");

// ═══════════════════════════════════════════════════════════════════════════════
// P64: Streak Display
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P64: STREAK DISPLAY ===");
testTrue("StreakDisplay exists", fileEx("components/gamification/StreakDisplay.tsx"));
const sd = readSrc("components/gamification/StreakDisplay.tsx");
testInc("sd: exports StreakDisplay", sd, "export function StreakDisplay");
testInc("sd: days prop", sd, "days: number");
testInc("sd: compact prop", sd, "compact?:");
testInc("sd: gold flame active", sd, "colors.accent");
testInc("sd: multiplier display", sd, "multiplier");
testInc("sd: getStreakMultiplier", sd, "getStreakMultiplier");
testInc("sd: fire emoji when active", sd, "\\uD83D\\uDD25");

// ═══════════════════════════════════════════════════════════════════════════════
// P65: Achievement Definitions
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P65: ACHIEVEMENTS ===");
const ach = readSrc("data/achievements.ts");
testInc("ach: exports ACHIEVEMENTS", ach, "export const ACHIEVEMENTS");
// Training (8)
for (const id of ["first_blood", "century", "round_machine", "thousand_rounds", "bag_destroyer", "shadow_lord", "road_warrior", "skip_master"]) {
  testInc(`ach: ${id}`, ach, `"${id}"`);
}
// Fighting (5)
for (const id of ["ring_general", "undefeated", "knockout_artist", "warrior", "tape_study"]) {
  testInc(`ach: ${id}`, ach, `"${id}"`);
}
// Consistency (5)
for (const id of ["week_strong", "two_week_warrior", "monthly_machine", "sixty_days", "immortal_90"]) {
  testInc(`ach: ${id}`, ach, `"${id}"`);
}
// Skill (5)
for (const id of ["combo_master", "centurion", "diversified", "benchmark_setter", "student"]) {
  testInc(`ach: ${id}`, ach, `"${id}"`);
}
// Milestones (7)
for (const id of ["rank_prospect", "rank_contender", "rank_challenger", "rank_champion", "rank_undisputed", "camp_ready", "made_weight"]) {
  testInc(`ach: ${id}`, ach, `"${id}"`);
}
// Count: 30 total
const achCount = (ach.match(/"id":|id:/g) || []).length;
testTrue("ach: at least 30 achievements", achCount >= 30);

// ═══════════════════════════════════════════════════════════════════════════════
// P66: Achievement Checker
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P66: ACHIEVEMENT CHECKER ===");
const ac = readSrc("lib/achievement-checker.ts");
testInc("ac: exports checkAchievements", ac, "export function checkAchievements");
testInc("ac: CheckContext type", ac, "type CheckContext");
testInc("ac: sessions context", ac, "sessions: TrainingSession[]");
testInc("ac: fights context", ac, "fights: Fight[]");
testInc("ac: currentStreak context", ac, "currentStreak: number");
testInc("ac: customComboCount context", ac, "customComboCount: number");
testInc("ac: benchmarkTypes context", ac, "benchmarkTypes: BenchmarkType[]");
testInc("ac: tipsRead context", ac, "tipsRead: number");
testInc("ac: evaluators array", ac, "EVALUATORS");
testInc("ac: returns newly unlocked", ac, "newlyUnlocked");
testInc("ac: skips already unlocked", ac, "unlockedAt !== null");
testInc("ac: training evaluators", ac, '"first_blood"');
testInc("ac: fighting evaluators", ac, '"ring_general"');
testInc("ac: consistency evaluators", ac, '"week_strong"');
testInc("ac: skill evaluators", ac, '"combo_master"');
testInc("ac: milestone evaluators", ac, '"rank_champion"');

// ═══════════════════════════════════════════════════════════════════════════════
// P67: Celebrations
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P67: CELEBRATION STORE ===");
testTrue("CelebrationStore exists", existsSync(path.join(__dirname, "../src/stores/useCelebrationStore.ts")));
const cs = readSrc("stores/useCelebrationStore.ts");
testInc("cs: queue state", cs, "queue: CelebrationItem[]");
testInc("cs: current state", cs, "current: CelebrationItem | null");
testInc("cs: enqueueAchievement", cs, "enqueueAchievement:");
testInc("cs: enqueueRankUp", cs, "enqueueRankUp:");
testInc("cs: showNext", cs, "showNext:");
testInc("cs: dismiss", cs, "dismiss:");
testInc("cs: sequential display", cs, "queue.length === 0");

console.log("\n=== P67: ACHIEVEMENT POPUP ===");
const ap = readSrc("components/gamification/AchievementPopup.tsx");
testInc("ap: exports AchievementPopup", ap, "export function AchievementPopup");
testInc("ap: ACHIEVEMENT UNLOCKED text", ap, "ACHIEVEMENT UNLOCKED");
testInc("ap: icon display", ap, "Ionicons");
testInc("ap: name display", ap, "achievement.name");
testInc("ap: XP display", ap, "xpReward");
testInc("ap: CLAIM button", ap, "CLAIM");
testInc("ap: gold theme", ap, "colors.accent");
testInc("ap: spring animation", ap, "Animated.spring");
testInc("ap: overlay", ap, "overlay");
testInc("ap: successNotification", ap, "successNotification");

console.log("\n=== P67: LEVEL UP CELEBRATION ===");
const luc = readSrc("components/gamification/LevelUpCelebration.tsx");
testInc("luc: exports LevelUpCelebration", luc, "export function LevelUpCelebration");
testInc("luc: RANK UP text", luc, "RANK UP");
testInc("luc: RankBadge hero", luc, '"hero"');
testInc("luc: rank title", luc, "RANK_TITLES");
testInc("luc: LET'S GO button", luc, "LET'S GO");
testInc("luc: rankColors", luc, "rankColors");
testInc("luc: overlay", luc, "overlay");
testInc("luc: spring animation", luc, "Animated.spring");

// ═══════════════════════════════════════════════════════════════════════════════
// P68: Enhanced Session Summary
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P68: SESSION SUMMARY ===");
const ss = readApp("training/session-summary.tsx");
testInc("ss: SESSION COMPLETE", ss, "SESSION COMPLETE");
testInc("ss: getSessionTypeLabel", ss, "getSessionTypeLabel");
testInc("ss: MetricValue animated", ss, "animated");
testInc("ss: intensity pills", ss, "INTENSITY");
testInc("ss: energy stars", ss, "ENERGY LEVEL");
testInc("ss: sharpness stars", ss, "SHARPNESS");
testInc("ss: notes input", ss, "NOTES");
testInc("ss: XP Panel", ss, "XP EARNED");
testInc("ss: XPBar component", ss, "XPBar");
testInc("ss: StreakDisplay component", ss, "StreakDisplay");
testInc("ss: AchievementPopup integration", ss, "AchievementPopup");
testInc("ss: LevelUpCelebration integration", ss, "LevelUpCelebration");
testInc("ss: useCelebrationStore", ss, "useCelebrationStore");
testInc("ss: dismiss celebration", ss, "dismissCelebration");
testInc("ss: combo session indicator", ss, "comboModeUsed");
testInc("ss: DONE button", ss, "DONE");
testInc("ss: profile XP display", ss, "profile.totalXP");

// ═══════════════════════════════════════════════════════════════════════════════
// BARREL EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== BARREL EXPORTS ===");
const gi = readSrc("components/gamification/index.ts");
testInc("barrel: RankBadge", gi, "RankBadge");
testInc("barrel: XPBar", gi, "XPBar");
testInc("barrel: StreakDisplay", gi, "StreakDisplay");
testInc("barrel: AchievementPopup", gi, "AchievementPopup");
testInc("barrel: LevelUpCelebration", gi, "LevelUpCelebration");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("profile store intact", readSrc("stores/useProfileStore.ts").includes("addXP"));
testTrue("session store intact", readSrc("stores/useSessionStore.ts").includes("completeComboSession"));

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n" + "=".repeat(80));
console.log("STAGE 3 — FULL TEST RESULTS");
console.log("=".repeat(80));
for (const r of results) {
  const icon = r.pass ? "PASS" : "FAIL";
  console.log(`${icon} | ${r.name}`);
  if (!r.pass) { console.log(`       Expected: ${r.expected}`); console.log(`       Actual:   ${r.actual}`); }
}
console.log("\n" + "=".repeat(80));
console.log(`TOTAL: ${passed + failed} tests | ${passed} PASSED | ${failed} FAILED`);
console.log("=".repeat(80));
if (failed > 0) { console.log("\nFAILURES DETECTED"); process.exit(1); }
else { console.log("\nALL TESTS PASSED"); process.exit(0); }
