/**
 * Phases 16-18 — Navigation Tests
 * Tab bar, stack screens, navigation helpers
 */

import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const appEx = (f) => existsSync(path.join(__dirname, "../app", f));

let passed = 0;
let failed = 0;
const results = [];

function testTrue(name, actual) {
  results.push({ name, expected: "true", actual: String(actual), pass: !!actual });
  if (actual) passed++; else failed++;
}
function testInc(name, src, pat) {
  const found = src.includes(pat);
  results.push({ name, expected: "contains", actual: found ? "found" : "NOT FOUND", pass: found });
  if (found) passed++; else failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 16: TAB BAR
// ═══════════════════════════════════════════════════════════════════════════════
const tabLayout = readApp("(tabs)/_layout.tsx");
console.log("\n=== P16: TAB BAR LAYOUT ===");
testInc("tab: 5 tabs via Tabs.Screen", tabLayout, "Tabs.Screen");
testInc("tab: HQ tab", tabLayout, 'title: "HQ"');
testInc("tab: TRAIN tab", tabLayout, 'title: "TRAIN"');
testInc("tab: LOG tab", tabLayout, 'title: "LOG"');
testInc("tab: STATS tab", tabLayout, 'title: "STATS"');
testInc("tab: PROFILE tab", tabLayout, 'title: "PROFILE"');

// Icons
testInc("tab: home icon", tabLayout, '"home"');
testInc("tab: fitness icon", tabLayout, '"fitness"');
testInc("tab: book icon", tabLayout, '"book"');
testInc("tab: stats-chart icon", tabLayout, '"stats-chart"');
testInc("tab: person icon", tabLayout, '"person"');
testInc("tab: uses Ionicons", tabLayout, "Ionicons");

// Gold indicator
testInc("tab: gold indicator", tabLayout, "colors.accent");
testInc("tab: indicator width 24", tabLayout, "width: 24");
testInc("tab: indicator height 2", tabLayout, "height: 2");

// Spring animation
testInc("tab: spring animation", tabLayout, "Animated.spring");
testInc("tab: scale to 1.2", tabLayout, "1.2");

// Tab bar styling
testInc("tab: bg #050607", tabLayout, '"#050607"');
testInc("tab: height 64", tabLayout, "64");
testInc("tab: safe area insets", tabLayout, "useSafeAreaInsets");
testInc("tab: label fontSize 9", tabLayout, "fontSize: 9");
testInc("tab: label fontWeight 700", tabLayout, '"700"');
testInc("tab: gold active tint", tabLayout, "colors.accent");
testInc("tab: muted inactive tint", tabLayout, "colors.textMuted");
testInc("tab: headerShown false", tabLayout, "headerShown: false");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 16: TAB SCREENS EXIST
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P16: TAB SCREENS ===");
const tabFiles = ["(tabs)/index.tsx", "(tabs)/train.tsx", "(tabs)/log.tsx", "(tabs)/stats.tsx", "(tabs)/profile.tsx"];
for (const f of tabFiles) {
  testTrue(`tab screen exists: ${f}`, appEx(f));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 17: ALL STACK SCREENS EXIST
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P17: TRAINING SCREENS ===");
const trainingFiles = ["training/_layout.tsx", "training/combo-session.tsx", "training/round-timer.tsx", "training/skip-rope.tsx", "training/roadwork.tsx", "training/session-summary.tsx", "training/log-session.tsx"];
for (const f of trainingFiles) testTrue(`exists: ${f}`, appEx(f));

console.log("\n=== P17: COMBO SCREENS ===");
const comboFiles = ["combo/_layout.tsx", "combo/library.tsx", "combo/builder.tsx", "combo/[id].tsx", "combo/drill-queue.tsx", "combo/config.tsx"];
for (const f of comboFiles) testTrue(`exists: ${f}`, appEx(f));

console.log("\n=== P17: FIGHT SCREENS ===");
const fightFiles = ["fight/_layout.tsx", "fight/log-fight.tsx", "fight/[id].tsx", "fight/record.tsx", "fight/sparring/log.tsx", "fight/sparring/partner-history.tsx"];
for (const f of fightFiles) testTrue(`exists: ${f}`, appEx(f));

console.log("\n=== P17: CAMP SCREENS ===");
const campFiles = ["camp/_layout.tsx", "camp/setup.tsx", "camp/dashboard.tsx", "camp/weight-cut.tsx"];
for (const f of campFiles) testTrue(`exists: ${f}`, appEx(f));

console.log("\n=== P17: PROGRAMS SCREENS ===");
const programFiles = ["programs/_layout.tsx", "programs/quiz.tsx", "programs/browse.tsx", "programs/[id].tsx"];
for (const f of programFiles) testTrue(`exists: ${f}`, appEx(f));

console.log("\n=== P17: KNOWLEDGE SCREENS ===");
const knowledgeFiles = ["knowledge/_layout.tsx", "knowledge/glossary.tsx", "knowledge/technique.tsx", "knowledge/tip-of-day.tsx"];
for (const f of knowledgeFiles) testTrue(`exists: ${f}`, appEx(f));

console.log("\n=== P17: BENCHMARKS SCREENS ===");
const benchmarkFiles = ["benchmarks/_layout.tsx", "benchmarks/index.tsx", "benchmarks/log.tsx", "benchmarks/[id].tsx"];
for (const f of benchmarkFiles) testTrue(`exists: ${f}`, appEx(f));

console.log("\n=== P17: SETTINGS SCREENS ===");
const settingsFiles = ["settings/_layout.tsx", "settings/index.tsx", "settings/profile-edit.tsx"];
for (const f of settingsFiles) testTrue(`exists: ${f}`, appEx(f));

// Check layouts use Stack
console.log("\n=== P17: LAYOUTS USE STACK ===");
const layoutFiles = ["training/_layout.tsx", "combo/_layout.tsx", "fight/_layout.tsx", "camp/_layout.tsx", "programs/_layout.tsx", "knowledge/_layout.tsx", "benchmarks/_layout.tsx", "settings/_layout.tsx"];
for (const f of layoutFiles) {
  const src = readApp(f);
  testInc(`${f}: uses Stack`, src, "Stack");
  testInc(`${f}: headerShown false`, src, "headerShown: false");
  testInc(`${f}: black bg`, src, "#000000");
  testInc(`${f}: slide animation`, src, "slide_from_right");
}

// Check placeholder screens render with SafeAreaView and PageHeader
console.log("\n=== P17: PLACEHOLDERS RENDER CORRECTLY ===");
// combo-session is now a full Fight HUD (no SafeAreaView/PageHeader)
const sampleScreens = [
  "combo/library.tsx", "fight/record.tsx",
  "camp/setup.tsx", "programs/browse.tsx", "knowledge/glossary.tsx",
  "benchmarks/log.tsx", "settings/profile-edit.tsx"
];
for (const f of sampleScreens) {
  const src = readApp(f);
  testInc(`${f}: uses SafeAreaView`, src, "SafeAreaView");
  testInc(`${f}: uses PageHeader`, src, "PageHeader");
  testInc(`${f}: default export`, src, "export default function");
  testInc(`${f}: imports colors`, src, "colors");
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 18: NAVIGATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
const navSrc = readSrc("lib/navigation.ts");
console.log("\n=== P18: NAVIGATION HELPERS ===");
testInc("nav: imports router", navSrc, 'from "expo-router"');

// Tab routes
const tabNavs = ["goToHQ", "goToTrain", "goToLog", "goToStats", "goToProfile"];
for (const fn of tabNavs) testInc(`nav: ${fn}`, navSrc, `export function ${fn}`);

// Training routes
const trainNavs = ["goToComboSession", "goToRoundTimer", "goToSkipRope", "goToRoadwork", "goToSessionSummary", "goToLogSession"];
for (const fn of trainNavs) testInc(`nav: ${fn}`, navSrc, `export function ${fn}`);

// Combo routes
const comboNavs = ["goToComboLibrary", "goToComboBuilder", "goToComboDetail", "goToDrillQueue", "goToComboConfig"];
for (const fn of comboNavs) testInc(`nav: ${fn}`, navSrc, `export function ${fn}`);

// Fight routes
const fightNavs = ["goToLogFight", "goToFightDetail", "goToFightRecord", "goToLogSparring", "goToPartnerHistory"];
for (const fn of fightNavs) testInc(`nav: ${fn}`, navSrc, `export function ${fn}`);

// Camp routes
const campNavs = ["goToCampSetup", "goToCampDashboard", "goToWeightCut"];
for (const fn of campNavs) testInc(`nav: ${fn}`, navSrc, `export function ${fn}`);

// Program routes
const progNavs = ["goToBoxerQuiz", "goToBrowsePrograms", "goToProgramDetail"];
for (const fn of progNavs) testInc(`nav: ${fn}`, navSrc, `export function ${fn}`);

// Knowledge routes
const knowNavs = ["goToGlossary", "goToTechniqueReference", "goToTipOfDay"];
for (const fn of knowNavs) testInc(`nav: ${fn}`, navSrc, `export function ${fn}`);

// Benchmark routes
const benchNavs = ["goToBenchmarks", "goToLogBenchmark", "goToBenchmarkDetail"];
for (const fn of benchNavs) testInc(`nav: ${fn}`, navSrc, `export function ${fn}`);

// Settings routes
const settNavs = ["goToSettings", "goToProfileEdit"];
for (const fn of settNavs) testInc(`nav: ${fn}`, navSrc, `export function ${fn}`);

// General
testInc("nav: goBack", navSrc, "export function goBack");
testInc("nav: goBack checks canGoBack", navSrc, "router.canGoBack()");
testInc("nav: goToOnboarding", navSrc, "export function goToOnboarding");
testInc("nav: goToOnboarding uses replace", navSrc, "router.replace");

// Dynamic params
testInc("nav: goToComboDetail takes id: string", navSrc, "goToComboDetail(id: string)");
testInc("nav: goToFightDetail takes id: number", navSrc, "goToFightDetail(id: number)");
testInc("nav: goToProgramDetail takes id: string", navSrc, "goToProgramDetail(id: string)");
testInc("nav: goToBenchmarkDetail takes id: number", navSrc, "goToBenchmarkDetail(id: number)");

// Count total exported functions
const fnCount = (navSrc.match(/export function/g) || []).length;
testTrue("nav: 30+ helper functions", fnCount >= 30);

// ═══════════════════════════════════════════════════════════════════════════════
// TOTAL FILE COUNT
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== FILE COUNTS ===");
const allScreenFiles = [...trainingFiles, ...comboFiles, ...fightFiles, ...campFiles, ...programFiles, ...knowledgeFiles, ...benchmarkFiles, ...settingsFiles, ...tabFiles];
let screenCount = 0;
for (const f of allScreenFiles) { if (appEx(f)) screenCount++; }
testTrue("Total app screens >= 40", screenCount >= 40);

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("onboarding screen intact", appEx("onboarding.tsx"));
testTrue("stores intact", readSrc("stores/index.ts").includes("useOnboardingStore"));

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n" + "=".repeat(80));
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
if (failed > 0) { console.log("\nFAILURES DETECTED"); process.exit(1); }
else { console.log("\nALL TESTS PASSED"); process.exit(0); }
