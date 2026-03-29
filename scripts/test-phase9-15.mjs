/**
 * Phases 9-15 — Onboarding Test Script
 * Tests: useOnboardingStore, all 6 step components, onboarding screen, layout redirect
 */

import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");
const appExists = (f) => existsSync(path.join(__dirname, "../app", f));

let passed = 0;
let failed = 0;
const results = [];

function test(name, expected, actual) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, expected: JSON.stringify(expected), actual: JSON.stringify(actual), pass });
  if (pass) passed++; else failed++;
}
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
// Phase 9: useOnboardingStore
// ═══════════════════════════════════════════════════════════════════════════════
const storeSrc = readSrc("stores/useOnboardingStore.ts");
console.log("\n=== P9: ONBOARDING STORE ===");
testInc("store: exports useOnboardingStore", storeSrc, "export const useOnboardingStore");
testInc("store: completed state", storeSrc, "completed: boolean");
testInc("store: currentStep state", storeSrc, "currentStep: number");
testInc("store: nextStep action", storeSrc, "nextStep:");
testInc("store: previousStep action", storeSrc, "previousStep:");
testInc("store: goToStep action", storeSrc, "goToStep:");
testInc("store: completeOnboarding action", storeSrc, "completeOnboarding:");
testInc("store: loadFromMMKV", storeSrc, "loadFromMMKV:");
testInc("store: persistToMMKV", storeSrc, "persistToMMKV:");
testInc("store: MMKV key onboarding_completed", storeSrc, '"onboarding_completed"');
testInc("store: default completed false", storeSrc, "completed: false");
testInc("store: default currentStep 0", storeSrc, "currentStep: 0");
testInc("store: nextStep clamps to max", storeSrc, "Math.min");
testInc("store: previousStep clamps to 0", storeSrc, "Math.max");
testInc("store: TOTAL_STEPS = 6", storeSrc, "TOTAL_STEPS = 6");
testInc("store: imports from zustand", storeSrc, 'from "zustand"');
testInc("store: imports getJSON", storeSrc, "getJSON");
testInc("store: imports setJSON", storeSrc, "setJSON");

// Barrel export
testInc("stores/index exports useOnboardingStore", readSrc("stores/index.ts"), "useOnboardingStore");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 9: app/onboarding.tsx
// ═══════════════════════════════════════════════════════════════════════════════
const onboardingSrc = readApp("onboarding.tsx");
console.log("\n=== P9: ONBOARDING SCREEN ===");
testTrue("app/onboarding.tsx exists", appExists("onboarding.tsx"));
testInc("onboarding: imports useOnboardingStore", onboardingSrc, "useOnboardingStore");
testInc("onboarding: renders 6 steps", onboardingSrc, "TOTAL_STEPS = 6");
testInc("onboarding: imports StepWelcome", onboardingSrc, "StepWelcome");
testInc("onboarding: imports StepStance", onboardingSrc, "StepStance");
testInc("onboarding: imports StepExperience", onboardingSrc, "StepExperience");
testInc("onboarding: imports StepGoals", onboardingSrc, "StepGoals");
testInc("onboarding: imports StepPhysical", onboardingSrc, "StepPhysical");
testInc("onboarding: imports StepComplete", onboardingSrc, "StepComplete");
testInc("onboarding: uses SafeAreaView", onboardingSrc, "SafeAreaView");
testInc("onboarding: bg is black", onboardingSrc, "colors.bg");
testInc("onboarding: has StepDots", onboardingSrc, "StepDots");
testInc("onboarding: dot active style", onboardingSrc, "dotActive");
testInc("onboarding: dot completed style", onboardingSrc, "dotCompleted");
testInc("onboarding: dot active color is gold", onboardingSrc, "colors.accent");
testInc("onboarding: dot active width 24", onboardingSrc, "width: 24");
testInc("onboarding: dots hidden on welcome", onboardingSrc, "current === 0");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 9: app/_layout.tsx redirect
// ═══════════════════════════════════════════════════════════════════════════════
const layoutSrc = readApp("_layout.tsx");
console.log("\n=== P9: LAYOUT REDIRECT ===");
testInc("layout: imports useOnboardingStore", layoutSrc, "useOnboardingStore");
testInc("layout: reads completed state", layoutSrc, "completed");
testInc("layout: calls loadFromMMKV", layoutSrc, "loadOnboarding");
testInc("layout: redirects to /onboarding", layoutSrc, "/onboarding");
testInc("layout: checks !completed", layoutSrc, "!completed");
testInc("layout: uses StatusBar light", layoutSrc, 'style="light"');
testInc("layout: headerShown false", layoutSrc, "headerShown: false");
testInc("layout: black background", layoutSrc, "#000000");

// app/index.tsx redirect
const indexSrc = readApp("index.tsx");
testInc("index: redirects to onboarding if not completed", indexSrc, "/onboarding");
testInc("index: redirects to tabs if completed", indexSrc, "/(tabs)");
testInc("index: uses Redirect", indexSrc, "Redirect");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 10: StepWelcome
// ═══════════════════════════════════════════════════════════════════════════════
const welcomeSrc = readSrc("components/onboarding/StepWelcome.tsx");
console.log("\n=== P10: STEP WELCOME ===");
testInc("welcome: OUTBOX hero text", welcomeSrc, "OUTBOX");
testInc("welcome: hero 48px", welcomeSrc, "fontSize: 48");
testInc("welcome: tagline", welcomeSrc, "Outwork. Outthink. Outbox.");
testInc("welcome: tagline textSecondary", welcomeSrc, "colors.textSecondary");
testInc("welcome: GET STARTED button", welcomeSrc, "GET STARTED");
testInc("welcome: gold button bg", welcomeSrc, "colors.accent");
testInc("welcome: black button text", welcomeSrc, '"#000000"');
testInc("welcome: button height 56", welcomeSrc, "height: 56");
testInc("welcome: title fade 800ms", welcomeSrc, "duration: 800");
testInc("welcome: tagline 400ms delay", welcomeSrc, "400");
testInc("welcome: button 800ms delay", welcomeSrc, "800");
testInc("welcome: breathing pulse", welcomeSrc, "pulseAnim");
testInc("welcome: pulse 1.05", welcomeSrc, "1.05");
testInc("welcome: pulse 2s loop (1000ms each)", welcomeSrc, "duration: 1000");
testInc("welcome: Animated.loop", welcomeSrc, "Animated.loop");
testInc("welcome: lightTap on press", welcomeSrc, "lightTap");
testInc("welcome: calls nextStep", welcomeSrc, "nextStep()");
testInc("welcome: imports from haptics", welcomeSrc, 'from "../../lib/haptics"');
testInc("welcome: press scale 0.95", welcomeSrc, "0.95");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 11: StepStance
// ═══════════════════════════════════════════════════════════════════════════════
const stanceSrc = readSrc("components/onboarding/StepStance.tsx");
console.log("\n=== P11: STEP STANCE ===");
testInc("stance: STANCE kicker", stanceSrc, "STANCE");
testInc("stance: question text", stanceSrc, "Which stance do you fight from?");
testInc("stance: Orthodox option", stanceSrc, "Orthodox");
testInc("stance: Southpaw option", stanceSrc, "Southpaw");
testInc("stance: Switch option", stanceSrc, "Switch");
testInc("stance: Orthodox desc", stanceSrc, "Left foot forward, left hand jabs");
testInc("stance: Southpaw desc", stanceSrc, "Right foot forward, right hand jabs");
testInc("stance: Switch desc", stanceSrc, "Both stances");
testInc("stance: critical note", stanceSrc, "This determines how punches are called out");
testInc("stance: surfaceBorderStrong on selected", stanceSrc, "surfaceBorderStrong");
testInc("stance: saves to profile", stanceSrc, "updateProfile");
testInc("stance: uses Panel", stanceSrc, "Panel");
testInc("stance: uses lightTap", stanceSrc, "lightTap");
testInc("stance: calls nextStep", stanceSrc, "nextStep()");
testInc("stance: disabled when no selection", stanceSrc, "disabled={!selected}");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 12: StepExperience
// ═══════════════════════════════════════════════════════════════════════════════
const expSrc = readSrc("components/onboarding/StepExperience.tsx");
console.log("\n=== P12: STEP EXPERIENCE ===");
testInc("exp: EXPERIENCE kicker", expSrc, "EXPERIENCE");
testInc("exp: question", expSrc, "How long have you been boxing?");
testInc("exp: Beginner", expSrc, "Beginner");
testInc("exp: Intermediate", expSrc, "Intermediate");
testInc("exp: Advanced", expSrc, "Advanced");
testInc("exp: <6mo desc", expSrc, "Less than 6 months");
testInc("exp: 6mo-2yr desc", expSrc, "6 months");
testInc("exp: 2yr+ desc", expSrc, "2+ years");
testInc("exp: 2-3 punch combos", expSrc, "2-3 punch combos");
testInc("exp: defense + body shots", expSrc, "Defense + body shots");
testInc("exp: full arsenal", expSrc, "Full arsenal");
testInc("exp: saves experienceLevel", expSrc, "experienceLevel");
testInc("exp: uses Panel", expSrc, "Panel");
testInc("exp: disabled when no selection", expSrc, "disabled={!selected}");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 13: StepGoals
// ═══════════════════════════════════════════════════════════════════════════════
const goalsSrc = readSrc("components/onboarding/StepGoals.tsx");
console.log("\n=== P13: STEP GOALS ===");
testInc("goals: GOALS kicker", goalsSrc, "GOALS");
testInc("goals: question", goalsSrc, "What are you training for?");
testInc("goals: Fitness option", goalsSrc, "Fitness");
testInc("goals: Competition option", goalsSrc, "Competition");
testInc("goals: Self-Defense option", goalsSrc, "Self-Defense");
testInc("goals: Stress Relief option", goalsSrc, "Stress Relief");
testInc("goals: multi-select (array state)", goalsSrc, "string[]");
testInc("goals: toggle logic", goalsSrc, "toggleGoal");
testInc("goals: gold check on selected", goalsSrc, "colors.accent");
testInc("goals: check mark", goalsSrc, "\u2713");
testInc("goals: min 1 validation", goalsSrc, "selected.length === 0");
testInc("goals: saves trainingGoals array", goalsSrc, "trainingGoals");
testInc("goals: uses Panel", goalsSrc, "Panel");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 14: StepPhysical
// ═══════════════════════════════════════════════════════════════════════════════
const physSrc = readSrc("components/onboarding/StepPhysical.tsx");
console.log("\n=== P14: STEP PHYSICAL ===");
testInc("phys: STATS kicker", physSrc, "STATS");
testInc("phys: weight input", physSrc, "weight");
testInc("phys: KG/LB toggle", physSrc, "KG");
testInc("phys: LB toggle", physSrc, "LB");
testInc("phys: height optional", physSrc, "Height (optional)");
testInc("phys: height CM/IN", physSrc, "CM");
testInc("phys: IN toggle", physSrc, "IN");
testInc("phys: reach optional", physSrc, "Reach (optional)");
testInc("phys: weight required", physSrc, "Weight *");
testInc("phys: decimal-pad keyboard", physSrc, "decimal-pad");
testInc("phys: auto-compute weight class", physSrc, "getWeightClass");
testInc("phys: imports getWeightClass", physSrc, "getWeightClass");
testInc("phys: saves weight", physSrc, "weight:");
testInc("phys: saves weightUnit", physSrc, "weightUnit");
testInc("phys: saves height", physSrc, "height:");
testInc("phys: saves activeWeightClass", physSrc, "activeWeightClass");
testInc("phys: disabled when invalid weight", physSrc, "!isWeightValid");
testInc("phys: validates weight > 0", physSrc, "weightNum > 0");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 15: StepComplete
// ═══════════════════════════════════════════════════════════════════════════════
const completeSrc = readSrc("components/onboarding/StepComplete.tsx");
console.log("\n=== P15: STEP COMPLETE ===");
testInc("complete: ALMOST THERE kicker", completeSrc, "ALMOST THERE");
testInc("complete: name input", completeSrc, "name");
testInc("complete: name 24px", completeSrc, "fontSize: 24");
testInc("complete: name height 56", completeSrc, "height: 56");
testInc("complete: fight name optional", completeSrc, "FIGHT NAME (OPTIONAL)");
testInc("complete: The Natural placeholder", completeSrc, "The Natural");
testInc("complete: summary panel", completeSrc, "YOUR FIGHTER PROFILE");
testInc("complete: summary shows stance", completeSrc, "Stance");
testInc("complete: summary shows experience", completeSrc, "Experience");
testInc("complete: summary shows weight", completeSrc, "Weight");
testInc("complete: summary shows rank", completeSrc, "Rank");
testInc("complete: rank shows Rookie", completeSrc, "Rookie");
testInc("complete: BEGIN button", completeSrc, "BEGIN");
testInc("complete: gold button", completeSrc, "colors.accent");
testInc("complete: initializes profile", completeSrc, "initializeProfile");
testInc("complete: totalXP 0", completeSrc, "totalXP: 0");
testInc("complete: rank rookie", completeSrc, 'rank: "rookie"');
testInc("complete: streak 0", completeSrc, "currentStreak: 0");
testInc("complete: successNotification haptic", completeSrc, "successNotification");
testInc("complete: calls completeOnboarding", completeSrc, "completeOnboarding()");
testInc("complete: navigates to tabs", completeSrc, "/(tabs)");
testInc("complete: uses router", completeSrc, "router.replace");
testInc("complete: disabled when no name", completeSrc, "!isValid");
testInc("complete: imports toLocalDateKey", completeSrc, "toLocalDateKey");
testInc("complete: uses Panel for summary", completeSrc, "Panel");

// ═══════════════════════════════════════════════════════════════════════════════
// TABS LAYOUT EXISTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== TABS LAYOUT ===");
testTrue("(tabs)/_layout.tsx exists", appExists("(tabs)/_layout.tsx"));
testTrue("(tabs)/index.tsx exists", appExists("(tabs)/index.tsx"));
const tabsLayout = readApp("(tabs)/_layout.tsx");
testInc("tabs: uses Tabs from expo-router", tabsLayout, "Tabs");
testInc("tabs: gold active tint", tabsLayout, "colors.accent");
testInc("tabs: dark tab bar bg", tabsLayout, "colors.tabBar");

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING BARREL EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
const onbIndex = readSrc("components/onboarding/index.ts");
console.log("\n=== BARREL EXPORT ===");
testInc("barrel: exports StepWelcome", onbIndex, "StepWelcome");
testInc("barrel: exports StepStance", onbIndex, "StepStance");
testInc("barrel: exports StepExperience", onbIndex, "StepExperience");
testInc("barrel: exports StepGoals", onbIndex, "StepGoals");
testInc("barrel: exports StepPhysical", onbIndex, "StepPhysical");
testInc("barrel: exports StepComplete", onbIndex, "StepComplete");

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-CHECKS: NO STYLE ARRAYS ON PANEL (ViewStyle only)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== STYLE ARRAY CHECK ===");
const allStepSrcs = [stanceSrc, expSrc, goalsSrc, physSrc, completeSrc];
const stepNames = ["stance", "experience", "goals", "physical", "complete"];
for (let i = 0; i < allStepSrcs.length; i++) {
  // Check Panel component never uses style={[ — must use style={{ }}
  // Match: <Panel ... style={[ on same line or across 2 lines
  const hasStyleArray = /<Panel[^>]*style=\{\s*\[/s.test(allStepSrcs[i]);
  testTrue(`${stepNames[i]}: no style arrays on Panel`, !hasStyleArray);
}

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme.ts intact", readSrc("theme.ts").length > 1000);
testTrue("types intact", readSrc("types/index.ts").includes("PunchCode"));
testTrue("stores intact", readSrc("stores/index.ts").includes("useComboStore"));
testTrue("date.ts intact", readSrc("lib/date.ts").includes("toLocalDateKey"));
testTrue("combo-utils intact", readSrc("lib/combo-utils.ts").includes("computeComboStats"));
testTrue("weight-class intact", readSrc("lib/weight-class.ts").includes("getWeightClass"));

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT RESULTS
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
