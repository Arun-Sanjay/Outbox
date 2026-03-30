/**
 * Phases 69-73 — Weight & Camp Tests
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

// ═══════════════════════════════════════════════════════════════════════════════
// P69: WeightChart
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P69: WEIGHT CHART ===");
testTrue("WeightChart exists", fileEx("components/weight/WeightChart.tsx"));
const wc = readSrc("components/weight/WeightChart.tsx");
testInc("wc: exports WeightChart", wc, "export function WeightChart");
testInc("wc: entries prop", wc, "entries: WeightEntry[]");
testInc("wc: targetWeight prop", wc, "targetWeight?:");
testInc("wc: SVG Path line", wc, "Path");
testInc("wc: gold gradient", wc, "colors.accent");
testInc("wc: LinearGradient", wc, "LinearGradient");
testInc("wc: data points (Circle)", wc, "Circle");
testInc("wc: target dashed line", wc, "strokeDasharray");
testInc("wc: date labels", wc, "sorted[0].date");
testInc("wc: empty state", wc, "Log at least 2");

console.log("\n=== P69: WEIGHT ENTRY MODAL ===");
testTrue("WeightEntryModal exists", fileEx("components/weight/WeightEntryModal.tsx"));
const wem = readSrc("components/weight/WeightEntryModal.tsx");
testInc("wem: exports WeightEntryModal", wem, "export function WeightEntryModal");
testInc("wem: visible prop", wem, "visible: boolean");
testInc("wem: onClose prop", wem, "onClose: () => void");
testInc("wem: fightCampId prop", wem, "fightCampId?:");
testInc("wem: Modal component", wem, "Modal");
testInc("wem: weight NumberInput", wem, "decimal-pad");
testInc("wem: KG/LB toggle", wem, "KG");
testInc("wem: LB option", wem, "LB");
testInc("wem: date from today", wem, "toLocalDateKey");
testInc("wem: SAVE button", wem, "SAVE");
testInc("wem: CANCEL button", wem, "CANCEL");
testInc("wem: addWeightEntry", wem, "addEntry");
testInc("wem: successNotification", wem, "successNotification");
testInc("wem: notes input", wem, "NOTES");

// ═══════════════════════════════════════════════════════════════════════════════
// P70: WeightClassIndicator
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P70: WEIGHT CLASS INDICATOR ===");
testTrue("WeightClassIndicator exists", fileEx("components/weight/WeightClassIndicator.tsx"));
const wci = readSrc("components/weight/WeightClassIndicator.tsx");
testInc("wci: exports WeightClassIndicator", wci, "export function WeightClassIndicator");
testInc("wci: currentWeight prop", wci, "currentWeight: number");
testInc("wci: unit prop", wci, 'unit: "kg" | "lb"');
testInc("wci: horizontal bar", wci, "bar");
testInc("wci: segment active", wci, "segmentActive");
testInc("wci: gold indicator", wci, "colors.accent");
testInc("wci: class labels", wci, "classLabel");
testInc("wci: getWeightClass", wci, "getWeightClass");
testInc("wci: getWeightClassLabel", wci, "getWeightClassLabel");
testInc("wci: DISPLAY_CLASSES", wci, "DISPLAY_CLASSES");
testInc("wci: auto-update class", wci, "currentClass");

// Barrel
const wi = readSrc("components/weight/index.ts");
testInc("barrel: WeightChart", wi, "WeightChart");
testInc("barrel: WeightEntryModal", wi, "WeightEntryModal");
testInc("barrel: WeightClassIndicator", wi, "WeightClassIndicator");

// ═══════════════════════════════════════════════════════════════════════════════
// P71: Camp Setup
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P71: CAMP SETUP ===");
const cs = readApp("camp/setup.tsx");
testInc("cs: fight date input", cs, "FIGHT DATE");
testInc("cs: opponent input", cs, "OPPONENT");
testInc("cs: weight class scroll", cs, "WEIGHT_CLASSES");
testInc("cs: target weight input", cs, "TARGET WEIGHT");
testInc("cs: current weight auto-filled", cs, "currentWeight");
testInc("cs: START CAMP button", cs, "START CAMP");
testInc("cs: createCamp call", cs, "createCamp");
testInc("cs: setActiveFightCamp", cs, "setActiveFightCamp");
testInc("cs: successNotification", cs, "successNotification");
testInc("cs: goToCampDashboard", cs, "goToCampDashboard");
testInc("cs: notes input", cs, "NOTES");
testInc("cs: getWeightClassLabel", cs, "getWeightClassLabel");

// ═══════════════════════════════════════════════════════════════════════════════
// P72: Camp Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P72: CAMP DASHBOARD ===");
const cd = readApp("camp/dashboard.tsx");
testInc("cd: DAYS TO FIGHT NIGHT hero", cd, "DAYS TO FIGHT NIGHT");
testInc("cd: countdown gold", cd, "colors.accent");
testInc("cd: countdown monospace 72px", cd, "fontSize: 72");
testInc("cd: weight progress bar", cd, "progressFill");
testInc("cd: current → target display", cd, "CURRENT");
testInc("cd: target label", cd, "TARGET");
testInc("cd: camp training stats", cd, "CAMP TRAINING");
testInc("cd: MetricValue components", cd, "MetricValue");
testInc("cd: LOG WEIGHT button", cd, "LOG WEIGHT");
testInc("cd: WeightEntryModal", cd, "WeightEntryModal");
testInc("cd: WEIGHT CUT link", cd, "WEIGHT CUT");
testInc("cd: goToWeightCut", cd, "goToWeightCut");
testInc("cd: END CAMP button", cd, "END CAMP");
testInc("cd: daysUntil", cd, "daysUntil");
testInc("cd: empty state (no camp)", cd, "No Active Camp");
testInc("cd: opponent display", cd, "opponentName");
testInc("cd: calculateWeightCutStatus", cd, "calculateWeightCutStatus");

// ═══════════════════════════════════════════════════════════════════════════════
// P73: Weight Cut Tracker
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P73: WEIGHT CUT TRACKER ===");
const wct = readApp("camp/weight-cut.tsx");
testInc("wct: WeightChart filtered to camp", wct, "campEntries");
testInc("wct: target line (dashed)", wct, "targetWeight");
testInc("wct: WEIGHT TREND section", wct, "WEIGHT TREND");
testInc("wct: CUT STATUS section", wct, "CUT STATUS");
testInc("wct: current weight stat", wct, "CURRENT");
testInc("wct: target weight stat", wct, "TARGET");
testInc("wct: remaining stat", wct, "REMAINING");
testInc("wct: days left stat", wct, "DAYS LEFT");
testInc("wct: daily weigh-in log", wct, "WEIGH-IN LOG");
testInc("wct: projected fight day weight", wct, "PROJECTED FIGHT DAY WEIGHT");
testInc("wct: rate warning if too fast", wct, "CUTTING TOO FAST");
testInc("wct: rate per week calculation", wct, "ratePerWeek");
testInc("wct: 3 lb/week threshold", wct, "> 3");
testInc("wct: LOG WEIGH-IN button", wct, "LOG WEIGH-IN");
testInc("wct: WeightEntryModal", wct, "WeightEntryModal");
testInc("wct: WeightChart component", wct, "WeightChart");
testInc("wct: empty state", wct, "No active fight camp");
testInc("wct: daysUntil", wct, "daysUntil");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("weight store intact", readSrc("stores/useWeightStore.ts").includes("addWeightEntry"));
testTrue("camp store intact", readSrc("stores/useCampStore.ts").includes("createCamp"));
testTrue("weight-class lib intact", readSrc("lib/weight-class.ts").includes("getWeightClass"));

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
