/**
 * Phases 26-27 — Combo Session Config Tests
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");

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

const configSrc = readApp("combo/config.tsx");

// ═══════════════════════════════════════════════════════════════════════════════
// P26: CONFIG SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P26: DRILL MODE PILLS ===");
testInc("config: drill mode combo", configSrc, '"combo"');
testInc("config: drill mode footwork", configSrc, '"footwork"');
testInc("config: drill mode defense", configSrc, '"defense"');
testInc("config: COMBOS label", configSrc, '"COMBOS"');
testInc("config: FOOTWORK label", configSrc, '"FOOTWORK"');
testInc("config: DEFENSE label", configSrc, '"DEFENSE"');

console.log("\n=== P26: COMBO SOURCES ===");
testInc("config: source beginner", configSrc, '"Beginner"');
testInc("config: source intermediate", configSrc, '"Intermediate"');
testInc("config: source advanced", configSrc, '"Advanced"');
testInc("config: include favorites toggle", configSrc, "Include Favorites");
testInc("config: drill queue toggle", configSrc, "Use Drill Queue");
testInc("config: multi-select sources", configSrc, "toggleSource");

console.log("\n=== P26: ROUNDS ===");
testInc("config: rounds stepper", configSrc, "numRounds");
testInc("config: min 1 round", configSrc, "min={1}");
// Verify max rounds is 15
testInc("config: max 15 rounds", configSrc, "max={15}");

console.log("\n=== P26: ROUND LENGTH ===");
testInc("config: round length stepper", configSrc, "roundLength");
testInc("config: min 60s (1 min)", configSrc, "min={60}");
testInc("config: max 300s (5 min)", configSrc, "max={300}");
testInc("config: step 30s", configSrc, "step={30}");

console.log("\n=== P26: REST LENGTH ===");
testInc("config: rest length stepper", configSrc, "restLength");
testInc("config: min 30s rest", configSrc, "min={30}");
testInc("config: max 120s rest", configSrc, "max={120}");

console.log("\n=== P26: TEMPO ===");
testInc("config: tempo slow", configSrc, '"Slow"');
testInc("config: tempo medium", configSrc, '"Medium"');
testInc("config: tempo fast", configSrc, '"Fast"');
testInc("config: tempo random", configSrc, '"Random"');
testInc("config: slow desc", configSrc, "6-8s between calls");
testInc("config: medium desc", configSrc, "4-6s between calls");
testInc("config: fast desc", configSrc, "2-4s between calls");
testInc("config: random desc", configSrc, "Varies each call");

console.log("\n=== P26: CALLOUT STYLE ===");
testInc("config: callout numbers", configSrc, '"Numbers"');
testInc("config: callout names", configSrc, '"Names"');
testInc("config: callout both", configSrc, '"Both"');
testInc("config: numbers preview", configSrc, "1-2-3");
testInc("config: names preview", configSrc, "Jab-Cross-Hook");

console.log("\n=== P26: OPTIONS ===");
testInc("config: warmup toggle", configSrc, "Warmup Round");
testInc("config: warmup duration stepper", configSrc, "warmupLength");
testInc("config: 10-second warning", configSrc, "10-Second Warning");
testInc("config: stance override", configSrc, "Stance Override");
testInc("config: orthodox option", configSrc, '"Orthodox"');
testInc("config: southpaw option", configSrc, '"Southpaw"');
testInc("config: switch option", configSrc, '"Switch"');

console.log("\n=== P26: SESSION SUMMARY ===");
testInc("config: summary calculation", configSrc, "totalMinutes");
testInc("config: summary display rounds x min", configSrc, "rounds");
testInc("config: uses Panel for summary", configSrc, "Panel");

console.log("\n=== P26: START BUTTON ===");
testInc("config: START SESSION button", configSrc, "START SESSION");
testInc("config: button height 56", configSrc, "height: 56");
testInc("config: gold bg", configSrc, "colors.accent");
testInc("config: black text", configSrc, '"#000000"');
testInc("config: mediumHaptic", configSrc, "mediumTap");
testInc("config: navigates to session", configSrc, "goToComboSession");

// ═══════════════════════════════════════════════════════════════════════════════
// P27: DRILL MODE VARIATIONS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P27: DRILL MODE LOGIC ===");
// Combo mode shows sources
testInc("p27: combo mode shows sources", configSrc, "showComboSources");
testInc("p27: sources hidden when not combo", configSrc, 'drillMode === "combo"');

// Defense mode: add punches toggle
testInc("p27: defense add punches toggle", configSrc, "Add punches before defense");
testInc("p27: defense hint text", configSrc, "1-2 random punches");
testInc("p27: addPunchesBeforeDefense state", configSrc, "addPunchesBeforeDefense");
testInc("p27: defense section conditional", configSrc, 'drillMode === "defense"');

// drillMode stored in config
testInc("p27: drillMode in state", configSrc, "drillMode");
testInc("p27: uses SectionHeader", configSrc, "SectionHeader");

// ═══════════════════════════════════════════════════════════════════════════════
// IMPORTS & STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== STRUCTURE ===");
testInc("config: imports PageHeader", configSrc, "PageHeader");
testInc("config: imports Panel", configSrc, "Panel");
testInc("config: imports SectionHeader", configSrc, "SectionHeader");
testInc("config: imports useProfileStore", configSrc, "useProfileStore");
testInc("config: imports useComboStore", configSrc, "useComboStore");
testInc("config: uses SafeAreaView", configSrc, "SafeAreaView");
testInc("config: uses ScrollView", configSrc, "ScrollView");
testInc("config: uses Switch", configSrc, "Switch");
testInc("config: default export", configSrc, "export default function");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("combo store intact", readSrc("stores/useComboStore.ts").includes("addCustomCombo"));
testTrue("combo builder intact", readApp("combo/builder.tsx").includes("SAVE COMBO"));
testTrue("combo detail intact", readApp("combo/[id].tsx").includes("FORM CUES"));

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
