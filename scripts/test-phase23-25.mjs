/**
 * Phases 23-25 — Combo Builder Tests
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");

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
// Phase 23: PunchChip
// ═══════════════════════════════════════════════════════════════════════════════
const chipSrc = readSrc("components/combo/PunchChip.tsx");
console.log("\n=== P23: PUNCH CHIP ===");
testInc("chip: exports PunchChip", chipSrc, "export function PunchChip");
testInc("chip: code prop", chipSrc, "code: ComboElement");
testInc("chip: sm/md/lg sizes", chipSrc, '"sm" | "md" | "lg"');
testInc("chip: selected state", chipSrc, "selected");
testInc("chip: dragging state", chipSrc, "dragging");
testInc("chip: gold for punch", chipSrc, "colors.accent");
testInc("chip: blue for defense", chipSrc, "96, 165, 250");
testInc("chip: cyan for footwork", chipSrc, "#22d3ee");
testInc("chip: sm height 28", chipSrc, "height: 28");
testInc("chip: md height 36", chipSrc, "height: 36");
testInc("chip: lg height 44", chipSrc, "height: 44");
testInc("chip: stance prop", chipSrc, "stance");
testInc("chip: displayMode prop", chipSrc, "displayMode");
testInc("chip: uses isPunchCode", chipSrc, "isPunchCode");
testInc("chip: uses isDefenseCode", chipSrc, "isDefenseCode");
testInc("chip: uses isFootworkCode", chipSrc, "isFootworkCode");
testInc("chip: uses getPunchName", chipSrc, "getPunchName");
testInc("chip: pill shape (radius.full)", chipSrc, "radius.full");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 23: ComboSequence
// ═══════════════════════════════════════════════════════════════════════════════
const seqSrc = readSrc("components/combo/ComboSequence.tsx");
console.log("\n=== P23: COMBO SEQUENCE ===");
testInc("seq: exports ComboSequence", seqSrc, "export function ComboSequence");
testInc("seq: sequence prop", seqSrc, "sequence: ComboElement[]");
testInc("seq: size prop", seqSrc, "size?:");
testInc("seq: stance prop", seqSrc, "stance?:");
testInc("seq: displayMode prop", seqSrc, "displayMode?:");
testInc("seq: scrollable prop", seqSrc, "scrollable?:");
testInc("seq: wrap prop", seqSrc, "wrap?:");
testInc("seq: uses PunchChip", seqSrc, "PunchChip");
testInc("seq: separator", seqSrc, "separator");
testInc("seq: horizontal ScrollView", seqSrc, "horizontal");
testInc("seq: onChipPress", seqSrc, "onChipPress");
testInc("seq: empty state", seqSrc, "No elements");
testInc("seq: flexWrap", seqSrc, "flexWrap");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 23: ComboStats
// ═══════════════════════════════════════════════════════════════════════════════
const statsSrc = readSrc("components/combo/ComboStats.tsx");
console.log("\n=== P23: COMBO STATS ===");
testInc("stats: exports ComboStats", statsSrc, "export function ComboStats");
testInc("stats: headShotCount prop", statsSrc, "headShotCount: number");
testInc("stats: bodyShotCount prop", statsSrc, "bodyShotCount: number");
testInc("stats: powerPunchCount prop", statsSrc, "powerPunchCount: number");
testInc("stats: speedPunchCount prop", statsSrc, "speedPunchCount: number");
testInc("stats: defensiveCount prop", statsSrc, "defensiveCount: number");
testInc("stats: footworkCount prop", statsSrc, "footworkCount: number");
testInc("stats: totalPunches prop", statsSrc, "totalPunches: number");
testInc("stats: pills with colors", statsSrc, "color:");
testInc("stats: Head pill", statsSrc, '"Head"');
testInc("stats: Body pill", statsSrc, '"Body"');
testInc("stats: Power pill", statsSrc, '"Power"');
testInc("stats: Speed pill", statsSrc, '"Speed"');
testInc("stats: Defense pill (conditional)", statsSrc, '"Defense"');
testInc("stats: Footwork pill (conditional)", statsSrc, '"Footwork"');
testInc("stats: Total pill", statsSrc, '"Total"');

// Barrel export
const comboIndex = readSrc("components/combo/index.ts");
testInc("barrel: exports PunchChip", comboIndex, "PunchChip");
testInc("barrel: exports ComboSequence", comboIndex, "ComboSequence");
testInc("barrel: exports ComboStats", comboIndex, "ComboStats");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 24: Combo Builder Screen
// ═══════════════════════════════════════════════════════════════════════════════
const builderSrc = readApp("combo/builder.tsx");
console.log("\n=== P24: COMBO BUILDER ===");
testInc("builder: name input", builderSrc, "COMBO NAME");
testInc("builder: TextInput", builderSrc, "TextInput");
testInc("builder: sequence strip", builderSrc, "SEQUENCE");
testInc("builder: ComboSequence scrollable", builderSrc, "scrollable");
testInc("builder: punch row 1 (1-6)", builderSrc, "PUNCH_ROW_1");
testInc("builder: punch row 2 (body)", builderSrc, "PUNCH_ROW_2");
testInc("builder: defense chips", builderSrc, "DEFENSE_ROW");
testInc("builder: footwork chips", builderSrc, "FOOTWORK_ROW");
testInc("builder: tap adds element", builderSrc, "addElement");
testInc("builder: remove on tap", builderSrc, "removeElement");
testInc("builder: live ComboStats", builderSrc, "ComboStats");
testInc("builder: computeComboStats", builderSrc, "computeComboStats");
testInc("builder: TEST TTS button", builderSrc, "TEST");
testInc("builder: uses Speech.speak", builderSrc, "Speech.speak");
testInc("builder: SAVE COMBO button", builderSrc, "SAVE COMBO");
testInc("builder: validates name", builderSrc, "Name Required");
testInc("builder: validates >=2 elements", builderSrc, "at least 2");
testInc("builder: calls addCustomCombo", builderSrc, "addCustomCombo");
testInc("builder: successHaptic", builderSrc, "successNotification");
testInc("builder: goBack after save", builderSrc, "goBack");
testInc("builder: CLEAR button", builderSrc, "CLEAR");
testInc("builder: uses PunchChip", builderSrc, "PunchChip");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 25: Drill Queue
// ═══════════════════════════════════════════════════════════════════════════════
const drillSrc = readApp("combo/drill-queue.tsx");
console.log("\n=== P25: DRILL QUEUE ===");
testInc("drill: getDrillQueue", drillSrc, "getDrillQueue");
testInc("drill: removeFromDrillQueue", drillSrc, "removeFromDrillQueue");
testInc("drill: clearDrillQueue", drillSrc, "clearDrillQueue");
testInc("drill: DRILL THIS QUEUE button", drillSrc, "DRILL THIS QUEUE");
testInc("drill: navigates to combo session", drillSrc, "goToComboSession");
testInc("drill: add from library", drillSrc, "BROWSE COMBOS");
testInc("drill: goToComboLibrary", drillSrc, "goToComboLibrary");
testInc("drill: shows combo list", drillSrc, "FlatList");
testInc("drill: remove button per item", drillSrc, "close-circle");
testInc("drill: numbered items", drillSrc, "index + 1");
testInc("drill: ComboSequence per item", drillSrc, "ComboSequence");
testInc("drill: empty state", drillSrc, "Queue is empty");
testInc("drill: CLEAR ALL", drillSrc, "CLEAR ALL");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 25: Combo Detail
// ═══════════════════════════════════════════════════════════════════════════════
const detailSrc = readApp("combo/[id].tsx");
console.log("\n=== P25: COMBO DETAIL ===");
testInc("detail: useLocalSearchParams", detailSrc, "useLocalSearchParams");
testInc("detail: getCombo", detailSrc, "getCombo");
testInc("detail: ComboSequence lg", detailSrc, '"lg"');
testInc("detail: ComboStats", detailSrc, "ComboStats");
testInc("detail: form cues section", detailSrc, "FORM CUES");
testInc("detail: PUNCHES data", detailSrc, "PUNCHES");
testInc("detail: TEST TTS button", detailSrc, "TEST");
testInc("detail: Speech.speak", detailSrc, "Speech.speak");
testInc("detail: favorite toggle", detailSrc, "toggleFavorite");
testInc("detail: heart icon", detailSrc, "heart");
testInc("detail: add to queue", detailSrc, "addToDrillQueue");
testInc("detail: QUEUE button", detailSrc, "QUEUE");
testInc("detail: delete for custom", detailSrc, "deleteCustomCombo");
testInc("detail: DELETE COMBO", detailSrc, "DELETE COMBO");
testInc("detail: delete confirm alert", detailSrc, "Alert.alert");
testInc("detail: scope personal check", detailSrc, '"personal"');
testInc("detail: not found state", detailSrc, "Combo not found");
testInc("detail: shows difficulty", detailSrc, "difficulty");
testInc("detail: unique punch cues", detailSrc, "uniquePunchCues");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("combo-utils intact", readSrc("lib/combo-utils.ts").includes("computeComboStats"));
testTrue("combo store intact", readSrc("stores/useComboStore.ts").includes("addCustomCombo"));
testTrue("punches data intact", readSrc("data/punches.ts").includes("Jab"));

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
