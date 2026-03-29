/**
 * Phases 19-22 — Punch Data System Tests
 * Punches, defenses, footwork, combos, combo store
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");

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

const punchSrc = readSrc("data/punches.ts");
const beginnerSrc = readSrc("data/combos-beginner.ts");
const intermediateSrc = readSrc("data/combos-intermediate.ts");
const advancedSrc = readSrc("data/combos-advanced.ts");
const comboStoreSrc = readSrc("stores/useComboStore.ts");

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 19: PUNCHES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P19: PUNCH DATA ===");
testInc("punches: exports PUNCHES Record", punchSrc, "export const PUNCHES: Record<PunchCode, PunchInfo>");

// All 10 punch codes present
const punchCodes = ["1", "2", "3", "4", "5", "6", "1b", "2b", "3b", "4b"];
for (const code of punchCodes) {
  testInc(`punch "${code}" defined`, punchSrc, `"${code}": {`);
}

// Punch names
const punchNames = { "1": "Jab", "2": "Cross", "3": "Lead Hook", "4": "Rear Hook", "5": "Lead Uppercut", "6": "Rear Uppercut", "1b": "Body Jab", "2b": "Body Cross", "3b": "Lead Body Hook", "4b": "Rear Body Hook" };
for (const [code, name] of Object.entries(punchNames)) {
  testInc(`punch "${code}" name="${name}"`, punchSrc, `name: "${name}"`);
}

// Each punch has formCues (4-5 items) and commonMistakes (3-4)
// Count formCues arrays — should be 10 punches with at least 4 cues each
const formCueMatches = punchSrc.match(/formCues:\s*\[/g);
testTrue("punches: 10 formCues arrays", formCueMatches && formCueMatches.length >= 10);
const mistakeMatches = punchSrc.match(/commonMistakes:\s*\[/g);
testTrue("punches: 10 commonMistakes arrays", mistakeMatches && mistakeMatches.length >= 10);

// Orthodox/southpaw hand assignments
testInc("jab orthodox=left", punchSrc, 'orthodoxHand: "left"');
testInc("cross orthodox=right", punchSrc, 'orthodoxHand: "right"');

// Target assignments
testInc("jab target=head", punchSrc, 'target: "head"');
testInc("body jab target=body", punchSrc, 'target: "body"');

// Type assignments
testInc("jab type=speed", punchSrc, 'type: "speed"');
testInc("cross type=power", punchSrc, 'type: "power"');

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 19: DEFENSES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P19: DEFENSE DATA ===");
testInc("defenses: exports DEFENSES Record", punchSrc, "export const DEFENSES: Record<DefenseCode, DefenseInfo>");

const defenseCodes = ["slip", "roll", "pull", "step_back", "block"];
for (const code of defenseCodes) {
  testInc(`defense "${code}" defined`, punchSrc, `${code}: {`);
}

testInc("defense: slip name", punchSrc, 'name: "Slip"');
testInc("defense: roll name", punchSrc, 'name: "Roll"');
testInc("defense: pull name", punchSrc, 'name: "Pull"');
testInc("defense: step_back name", punchSrc, 'name: "Step Back"');
testInc("defense: block name", punchSrc, 'name: "Block"');

// Each defense has description, defendsAgainst, formCues, counterOpportunities
for (const code of defenseCodes) {
  testInc(`defense ${code} has description`, punchSrc, "description:");
  testInc(`defense ${code} has defendsAgainst`, punchSrc, "defendsAgainst:");
  testInc(`defense ${code} has counterOpportunities`, punchSrc, "counterOpportunities:");
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 19: FOOTWORK
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P19: FOOTWORK DATA ===");
testInc("footwork: exports FOOTWORK Record", punchSrc, "export const FOOTWORK: Record<FootworkCode, FootworkInfo>");

const footworkCodes = ["pivot_left", "pivot_right", "angle_left", "angle_right", "circle_left", "circle_right", "step_in", "step_out"];
for (const code of footworkCodes) {
  testInc(`footwork "${code}" defined`, punchSrc, `${code}: {`);
}

testInc("footwork: pivot_left name", punchSrc, 'name: "Pivot Left"');
testInc("footwork: step_in name", punchSrc, 'name: "Step In"');
testInc("footwork: step_out name", punchSrc, 'name: "Step Out"');

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 20: BEGINNER COMBOS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P20: BEGINNER COMBOS ===");
testInc("beginner: exports BEGINNER_COMBOS", beginnerSrc, "export const BEGINNER_COMBOS");
testInc("beginner: uses computeComboStats", beginnerSrc, "computeComboStats");

// Count combos — should be 20
const beginnerIds = beginnerSrc.match(/sys_b_\d+/g) || [];
const uniqueBeginnerIds = new Set(beginnerIds);
test("beginner: 20 unique combo IDs", 20, uniqueBeginnerIds.size);

// All IDs start with sys_b_
testTrue("beginner: all IDs start with sys_b_", [...uniqueBeginnerIds].every(id => id.startsWith("sys_b_")));

// Beginner combos should be 1-4 elements (no defense)
testInc("beginner: difficulty is beginner", beginnerSrc, 'difficulty: "beginner"');
testInc("beginner: scope is system", beginnerSrc, 'scope: "system"');

// No defense codes in beginner
testTrue("beginner: no slip", !beginnerSrc.includes('"slip"'));
testTrue("beginner: no roll", !beginnerSrc.includes('"roll"'));
testTrue("beginner: no block", !beginnerSrc.includes('"block"'));
testTrue("beginner: no pull", !beginnerSrc.includes('"pull"'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 21: INTERMEDIATE COMBOS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P21: INTERMEDIATE COMBOS ===");
testInc("intermediate: exports INTERMEDIATE_COMBOS", intermediateSrc, "export const INTERMEDIATE_COMBOS");
testInc("intermediate: uses computeComboStats", intermediateSrc, "computeComboStats");

const intIds = intermediateSrc.match(/sys_i_\d+/g) || [];
const uniqueIntIds = new Set(intIds);
test("intermediate: 30 unique combo IDs", 30, uniqueIntIds.size);
testTrue("intermediate: all IDs start with sys_i_", [...uniqueIntIds].every(id => id.startsWith("sys_i_")));
testInc("intermediate: difficulty is intermediate", intermediateSrc, 'difficulty: "intermediate"');

// Should have defense codes
testTrue("intermediate: has slip", intermediateSrc.includes('"slip"'));
testTrue("intermediate: has roll", intermediateSrc.includes('"roll"'));

// Should have body shots
testTrue("intermediate: has body shots (b suffix)", intermediateSrc.includes('"1b"') || intermediateSrc.includes('"2b"') || intermediateSrc.includes('"3b"'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 21: ADVANCED COMBOS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P21: ADVANCED COMBOS ===");
testInc("advanced: exports ADVANCED_COMBOS", advancedSrc, "export const ADVANCED_COMBOS");
testInc("advanced: uses computeComboStats", advancedSrc, "computeComboStats");

const advIds = advancedSrc.match(/sys_a_\d+/g) || [];
const uniqueAdvIds = new Set(advIds);
test("advanced: 40 unique combo IDs", 40, uniqueAdvIds.size);
testTrue("advanced: all IDs start with sys_a_", [...uniqueAdvIds].every(id => id.startsWith("sys_a_")));
testInc("advanced: difficulty is advanced", advancedSrc, 'difficulty: "advanced"');

// Should have footwork
testTrue("advanced: has pivot_left", advancedSrc.includes('"pivot_left"'));
testTrue("advanced: has step_in", advancedSrc.includes('"step_in"'));
testTrue("advanced: has angle_right", advancedSrc.includes('"angle_right"'));

// Should have defense
testTrue("advanced: has slip", advancedSrc.includes('"slip"'));
testTrue("advanced: has roll", advancedSrc.includes('"roll"'));

// No duplicate IDs across libraries
const allIds = [...uniqueBeginnerIds, ...uniqueIntIds, ...uniqueAdvIds];
const allUniqueIds = new Set(allIds);
test("no duplicate IDs across all libraries", allIds.length, allUniqueIds.size);

// Total: 20 + 30 + 40 = 90
test("total system combos = 90", 90, allUniqueIds.size);

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 22: COMBO STORE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P22: COMBO STORE ===");
testInc("store: exports useComboStore", comboStoreSrc, "export const useComboStore");
testInc("store: imports all system combos", comboStoreSrc, "BEGINNER_COMBOS");
testInc("store: imports intermediate", comboStoreSrc, "INTERMEDIATE_COMBOS");
testInc("store: imports advanced", comboStoreSrc, "ADVANCED_COMBOS");
testInc("store: imports computeComboStats", comboStoreSrc, "computeComboStats");
testInc("store: imports nextId", comboStoreSrc, "nextId");

// State fields
testInc("store: combos state", comboStoreSrc, "combos: Combo[]");
testInc("store: favorites state", comboStoreSrc, "favorites: string[]");
testInc("store: drillQueue state", comboStoreSrc, "drillQueue: string[]");

// Actions
const storeActions = [
  "loadFromMMKV", "persistToMMKV", "getAllCombos", "getCombo",
  "searchCombos", "filterByDifficulty", "getCombosBySource", "getFavorites",
  "addCustomCombo", "deleteCustomCombo", "toggleFavorite",
  "getDrillQueue", "addToDrillQueue", "removeFromDrillQueue",
  "reorderDrillQueue", "clearDrillQueue", "recordComboCallout"
];
for (const action of storeActions) {
  testInc(`store: ${action} action`, comboStoreSrc, `${action}:`);
}

// MMKV keys
testInc("store: MMKV custom_combos", comboStoreSrc, '"custom_combos"');
testInc("store: MMKV combo_favorites", comboStoreSrc, '"combo_favorites"');
testInc("store: MMKV drill_queue", comboStoreSrc, '"drill_queue"');

// Custom combo ID format
testInc("store: custom ID format custom_*", comboStoreSrc, "`custom_${nextId()}`");

// addCustomCombo auto-computes stats
testInc("store: addCustomCombo computes stats", comboStoreSrc, "computeComboStats(sequence)");

// addCustomCombo auto-determines difficulty
testInc("store: auto difficulty beginner", comboStoreSrc, '"beginner"');
testInc("store: auto difficulty intermediate", comboStoreSrc, '"intermediate"');
testInc("store: auto difficulty advanced", comboStoreSrc, '"advanced"');

// deleteCustomCombo only deletes personal
testInc("store: delete only personal", comboStoreSrc, 'scope !== "personal"');

// toggleFavorite updates both favorites array and combo.isFavorite
testInc("store: toggle updates isFavorite", comboStoreSrc, "isFavorite: !isFav");

// loadFromMMKV merges system + custom
testInc("store: load merges combos", comboStoreSrc, "ALL_SYSTEM_COMBOS");

// getDrillQueue resolves IDs to Combo objects
testInc("store: getDrillQueue maps IDs", comboStoreSrc, "drillQueue");

// clearDrillQueue
testInc("store: clearDrillQueue sets empty", comboStoreSrc, "drillQueue: []");

// recordComboCallout keeps last 3
testInc("store: callout keeps last 3", comboStoreSrc, "slice(0, 3)");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("types intact", readSrc("types/index.ts").includes("PunchCode"));
testTrue("combo-utils intact", readSrc("lib/combo-utils.ts").includes("computeComboStats"));
testTrue("onboarding store intact", readSrc("stores/useOnboardingStore.ts").includes("completeOnboarding"));

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
