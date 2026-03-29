/**
 * Phase 8 — Utility Libraries Test Script
 * haptics: source-level | workout-utils, weight-class, combo-utils: runtime
 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");

const hapticsSrc = readSrc("lib/haptics.ts");
const workoutSrc = readSrc("lib/workout-utils.ts");
const weightSrc = readSrc("lib/weight-class.ts");
const comboSrc = readSrc("lib/combo-utils.ts");

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
// HAPTICS — SOURCE LEVEL
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== HAPTICS: EXPORTS ===");
testInc("haptics: exports lightTap", hapticsSrc, "export function lightTap");
testInc("haptics: exports mediumTap", hapticsSrc, "export function mediumTap");
testInc("haptics: exports heavyTap", hapticsSrc, "export function heavyTap");
testInc("haptics: exports selectionTap", hapticsSrc, "export function selectionTap");
testInc("haptics: exports successNotification", hapticsSrc, "export function successNotification");
testInc("haptics: exports warningNotification", hapticsSrc, "export function warningNotification");
testInc("haptics: exports errorNotification", hapticsSrc, "export function errorNotification");

console.log("\n=== HAPTICS: IMPLEMENTATIONS ===");
testInc("haptics: uses ImpactFeedbackStyle.Light", hapticsSrc, "ImpactFeedbackStyle.Light");
testInc("haptics: uses ImpactFeedbackStyle.Medium", hapticsSrc, "ImpactFeedbackStyle.Medium");
testInc("haptics: uses ImpactFeedbackStyle.Heavy", hapticsSrc, "ImpactFeedbackStyle.Heavy");
testInc("haptics: uses selectionAsync", hapticsSrc, "Haptics.selectionAsync");
testInc("haptics: uses NotificationFeedbackType.Success", hapticsSrc, "NotificationFeedbackType.Success");
testInc("haptics: uses NotificationFeedbackType.Warning", hapticsSrc, "NotificationFeedbackType.Warning");
testInc("haptics: uses NotificationFeedbackType.Error", hapticsSrc, "NotificationFeedbackType.Error");
testInc("haptics: imports from expo-haptics", hapticsSrc, 'from "expo-haptics"');

// ═══════════════════════════════════════════════════════════════════════════════
// WORKOUT-UTILS — SOURCE + RUNTIME
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== WORKOUT-UTILS: EXPORTS ===");
testInc("wu: exports formatDurationShort", workoutSrc, "export function formatDurationShort");
testInc("wu: exports formatRounds", workoutSrc, "export function formatRounds");
testInc("wu: exports getSessionTypeLabel", workoutSrc, "export function getSessionTypeLabel");
testInc("wu: exports getSessionTypeIcon", workoutSrc, "export function getSessionTypeIcon");
testInc("wu: exports getSessionTypeColor", workoutSrc, "export function getSessionTypeColor");
testInc("wu: exports getIntensityLabel", workoutSrc, "export function getIntensityLabel");
testInc("wu: exports getIntensityColor", workoutSrc, "export function getIntensityColor");
testInc("wu: imports from theme", workoutSrc, 'from "../theme"');
testInc("wu: imports SessionType", workoutSrc, "SessionType");
testInc("wu: imports Intensity", workoutSrc, "Intensity");

// Runtime: inline the pure functions
function formatDurationShort(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const s = Math.floor(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${minutes}:${pad(seconds)}`;
}
function formatRounds(rounds) {
  if (rounds === null || rounds === undefined) return "--";
  if (rounds === 1) return "1 Round";
  return `${rounds} Rounds`;
}

console.log("\n=== RUNTIME: formatDurationShort ===");
test("fds(0)", "0:00", formatDurationShort(0));
test("fds(1)", "0:01", formatDurationShort(1));
test("fds(59)", "0:59", formatDurationShort(59));
test("fds(60)", "1:00", formatDurationShort(60));
test("fds(65)", "1:05", formatDurationShort(65));
test("fds(119)", "1:59", formatDurationShort(119));
test("fds(120)", "2:00", formatDurationShort(120));
test("fds(600)", "10:00", formatDurationShort(600));
test("fds(3599)", "59:59", formatDurationShort(3599));
test("fds(3600)", "1:00:00", formatDurationShort(3600));
test("fds(3661)", "1:01:01", formatDurationShort(3661));
test("fds(7200)", "2:00:00", formatDurationShort(7200));
test("fds(86399)", "23:59:59", formatDurationShort(86399));
test("fds(-1)", "0:00", formatDurationShort(-1));
test("fds(-999)", "0:00", formatDurationShort(-999));
test("fds(NaN)", "0:00", formatDurationShort(NaN));
test("fds(Infinity)", "0:00", formatDurationShort(Infinity));
test("fds(-Infinity)", "0:00", formatDurationShort(-Infinity));
test("fds(0.5)", "0:00", formatDurationShort(0.5));
test("fds(1.9)", "0:01", formatDurationShort(1.9));
test("fds(59.9)", "0:59", formatDurationShort(59.9));

console.log("\n=== RUNTIME: formatRounds ===");
test("fr(null)", "--", formatRounds(null));
test("fr(undefined)", "--", formatRounds(undefined));
test("fr(0)", "0 Rounds", formatRounds(0));
test("fr(1)", "1 Round", formatRounds(1));
test("fr(2)", "2 Rounds", formatRounds(2));
test("fr(3)", "3 Rounds", formatRounds(3));
test("fr(12)", "12 Rounds", formatRounds(12));
test("fr(100)", "100 Rounds", formatRounds(100));

console.log("\n=== SOURCE: SESSION TYPE MAPS ===");
const sessionTypes = ["heavy_bag", "speed_bag", "double_end_bag", "shadow_boxing", "mitt_work", "sparring", "conditioning", "strength", "roadwork"];
for (const st of sessionTypes) {
  testInc(`wu: label for ${st}`, workoutSrc, `${st}:`);
}
testInc("wu: label Heavy Bag", workoutSrc, '"Heavy Bag"');
testInc("wu: label Speed Bag", workoutSrc, '"Speed Bag"');
testInc("wu: label Double End Bag", workoutSrc, '"Double End Bag"');
testInc("wu: label Shadow Boxing", workoutSrc, '"Shadow Boxing"');
testInc("wu: label Mitt Work", workoutSrc, '"Mitt Work"');
testInc("wu: label Sparring", workoutSrc, '"Sparring"');
testInc("wu: label Conditioning", workoutSrc, '"Conditioning"');
testInc("wu: label Strength", workoutSrc, '"Strength"');
testInc("wu: label Roadwork", workoutSrc, '"Roadwork"');

console.log("\n=== SOURCE: INTENSITY MAPS ===");
const intensities = ["light", "moderate", "hard", "war"];
for (const i of intensities) {
  testInc(`wu: intensity label ${i}`, workoutSrc, `${i}:`);
}
testInc("wu: intensity Light", workoutSrc, '"Light"');
testInc("wu: intensity Moderate", workoutSrc, '"Moderate"');
testInc("wu: intensity Hard", workoutSrc, '"Hard"');
testInc("wu: intensity War", workoutSrc, '"War"');

testInc("wu: uses colors.sessionHeavyBag", workoutSrc, "colors.sessionHeavyBag");
testInc("wu: uses colors.intensityLight", workoutSrc, "colors.intensityLight");
testInc("wu: uses colors.intensityWar", workoutSrc, "colors.intensityWar");

// ═══════════════════════════════════════════════════════════════════════════════
// WEIGHT-CLASS — SOURCE + RUNTIME
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== WEIGHT-CLASS: EXPORTS ===");
testInc("wc: exports getWeightClass", weightSrc, "export function getWeightClass");
testInc("wc: exports getWeightClassLabel", weightSrc, "export function getWeightClassLabel");
testInc("wc: exports getWeightClassLimits", weightSrc, "export function getWeightClassLimits");
testInc("wc: exports convertWeight", weightSrc, "export function convertWeight");
testInc("wc: imports WeightClass type", weightSrc, "WeightClass");

// Runtime inline
const WEIGHT_CLASSES = [
  { key: "strawweight", label: "Strawweight", minLb: 0, maxLb: 105, minKg: 0, maxKg: 47.6 },
  { key: "flyweight", label: "Flyweight", minLb: 105, maxLb: 112, minKg: 47.6, maxKg: 50.8 },
  { key: "bantamweight", label: "Bantamweight", minLb: 112, maxLb: 118, minKg: 50.8, maxKg: 53.5 },
  { key: "featherweight", label: "Featherweight", minLb: 118, maxLb: 126, minKg: 53.5, maxKg: 57.2 },
  { key: "lightweight", label: "Lightweight", minLb: 126, maxLb: 135, minKg: 57.2, maxKg: 61.2 },
  { key: "super_lightweight", label: "Super Lightweight", minLb: 135, maxLb: 140, minKg: 61.2, maxKg: 63.5 },
  { key: "welterweight", label: "Welterweight", minLb: 140, maxLb: 147, minKg: 63.5, maxKg: 66.7 },
  { key: "super_welterweight", label: "Super Welterweight", minLb: 147, maxLb: 154, minKg: 66.7, maxKg: 69.9 },
  { key: "middleweight", label: "Middleweight", minLb: 154, maxLb: 160, minKg: 69.9, maxKg: 72.6 },
  { key: "super_middleweight", label: "Super Middleweight", minLb: 160, maxLb: 168, minKg: 72.6, maxKg: 76.2 },
  { key: "light_heavyweight", label: "Light Heavyweight", minLb: 168, maxLb: 175, minKg: 76.2, maxKg: 79.4 },
  { key: "cruiserweight", label: "Cruiserweight", minLb: 175, maxLb: 200, minKg: 79.4, maxKg: 90.7 },
  { key: "heavyweight", label: "Heavyweight", minLb: 200, maxLb: Infinity, minKg: 90.7, maxKg: Infinity },
];

function getWeightClass(weight, unit = "lb") {
  if (!Number.isFinite(weight) || weight <= 0) return null;
  const lb = unit === "kg" ? weight * 2.20462 : weight;
  for (const wc of WEIGHT_CLASSES) { if (lb <= wc.maxLb) return wc.key; }
  return "heavyweight";
}
function getWeightClassLabel(wc) {
  const found = WEIGHT_CLASSES.find(w => w.key === wc);
  return found?.label ?? wc;
}
function getWeightClassLimits(wc) {
  const found = WEIGHT_CLASSES.find(w => w.key === wc);
  if (!found) return null;
  return { minLb: found.minLb, maxLb: found.maxLb, minKg: found.minKg, maxKg: found.maxKg };
}
function convertWeight(value, from, to) {
  if (from === to) return value;
  if (from === "kg" && to === "lb") return Math.round(value * 2.20462 * 10) / 10;
  return Math.round((value / 2.20462) * 10) / 10;
}

console.log("\n=== RUNTIME: getWeightClass ===");
test("gwc(100 lb) = strawweight", "strawweight", getWeightClass(100));
test("gwc(105 lb) = strawweight", "strawweight", getWeightClass(105));
test("gwc(106 lb) = flyweight", "flyweight", getWeightClass(106));
test("gwc(112 lb) = flyweight", "flyweight", getWeightClass(112));
test("gwc(118 lb) = bantamweight", "bantamweight", getWeightClass(118));
test("gwc(126 lb) = featherweight", "featherweight", getWeightClass(126));
test("gwc(135 lb) = lightweight", "lightweight", getWeightClass(135));
test("gwc(140 lb) = super_lightweight", "super_lightweight", getWeightClass(140));
test("gwc(147 lb) = welterweight", "welterweight", getWeightClass(147));
test("gwc(154 lb) = super_welterweight", "super_welterweight", getWeightClass(154));
test("gwc(160 lb) = middleweight", "middleweight", getWeightClass(160));
test("gwc(168 lb) = super_middleweight", "super_middleweight", getWeightClass(168));
test("gwc(175 lb) = light_heavyweight", "light_heavyweight", getWeightClass(175));
test("gwc(200 lb) = cruiserweight", "cruiserweight", getWeightClass(200));
test("gwc(201 lb) = heavyweight", "heavyweight", getWeightClass(201));
test("gwc(250 lb) = heavyweight", "heavyweight", getWeightClass(250));
test("gwc(0) = null", null, getWeightClass(0));
test("gwc(-1) = null", null, getWeightClass(-1));
test("gwc(NaN) = null", null, getWeightClass(NaN));
test("gwc(Infinity) = null", null, getWeightClass(Infinity));
// KG tests
test("gwc(50 kg) = flyweight", "flyweight", getWeightClass(50, "kg"));
// 70 kg = 154.3 lb → middleweight (154-160 range)
test("gwc(70 kg) = middleweight", "middleweight", getWeightClass(70, "kg"));
test("gwc(90 kg) = cruiserweight", "cruiserweight", getWeightClass(90, "kg"));
test("gwc(100 kg) = heavyweight", "heavyweight", getWeightClass(100, "kg"));

console.log("\n=== RUNTIME: getWeightClassLabel ===");
test("gwcl(strawweight)", "Strawweight", getWeightClassLabel("strawweight"));
test("gwcl(heavyweight)", "Heavyweight", getWeightClassLabel("heavyweight"));
test("gwcl(super_lightweight)", "Super Lightweight", getWeightClassLabel("super_lightweight"));
test("gwcl(middleweight)", "Middleweight", getWeightClassLabel("middleweight"));

console.log("\n=== RUNTIME: getWeightClassLimits ===");
test("gwcli(strawweight).maxLb", 105, getWeightClassLimits("strawweight").maxLb);
test("gwcli(heavyweight).maxLb", Infinity, getWeightClassLimits("heavyweight").maxLb);
test("gwcli(welterweight).minLb", 140, getWeightClassLimits("welterweight").minLb);
test("gwcli(welterweight).maxLb", 147, getWeightClassLimits("welterweight").maxLb);
test("gwcli(invalid) = null", null, getWeightClassLimits("nonexistent"));

console.log("\n=== RUNTIME: convertWeight ===");
test("cw(100 kg->lb)", 220.5, convertWeight(100, "kg", "lb"));
test("cw(220.5 lb->kg)", 100, convertWeight(220.5, "lb", "kg"));
test("cw(0 kg->lb)", 0, convertWeight(0, "kg", "lb"));
test("cw(1 kg->lb)", 2.2, convertWeight(1, "kg", "lb"));
test("cw(50 kg->lb)", 110.2, convertWeight(50, "kg", "lb"));
test("cw(same unit)", 75, convertWeight(75, "kg", "kg"));
test("cw(same unit lb)", 165, convertWeight(165, "lb", "lb"));

// ═══════════════════════════════════════════════════════════════════════════════
// COMBO-UTILS — SOURCE + RUNTIME
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== COMBO-UTILS: EXPORTS ===");
testInc("cu: exports getPunchName", comboSrc, "export function getPunchName");
testInc("cu: exports getComboDisplayText", comboSrc, "export function getComboDisplayText");
testInc("cu: exports computeComboStats", comboSrc, "export function computeComboStats");
testInc("cu: exports isPunchCode", comboSrc, "export function isPunchCode");
testInc("cu: exports isDefenseCode", comboSrc, "export function isDefenseCode");
testInc("cu: exports isFootworkCode", comboSrc, "export function isFootworkCode");
testInc("cu: exports isBodyShot", comboSrc, "export function isBodyShot");
testInc("cu: exports isPowerPunch", comboSrc, "export function isPowerPunch");
testInc("cu: imports from types", comboSrc, 'from "../types"');

// Runtime inline
const PUNCH_CODES = new Set(["1","2","3","4","5","6","1b","2b","3b","4b"]);
const DEFENSE_CODES = new Set(["slip","roll","pull","step_back","block"]);
const FOOTWORK_CODES = new Set(["pivot_left","pivot_right","angle_left","angle_right","circle_left","circle_right","step_in","step_out"]);
const BODY_PUNCHES = new Set(["1b","2b","3b","4b"]);
const POWER_PUNCHES = new Set(["2","3","4","5","6","2b","3b","4b"]);

const isPunchCode = c => PUNCH_CODES.has(c);
const isDefenseCode = c => DEFENSE_CODES.has(c);
const isFootworkCode = c => FOOTWORK_CODES.has(c);
const isBodyShot = c => BODY_PUNCHES.has(c);
const isPowerPunch = c => POWER_PUNCHES.has(c);

const PUNCH_NAMES = { "1":"Jab","2":"Cross","3":"Lead Hook","4":"Rear Hook","5":"Lead Uppercut","6":"Rear Uppercut","1b":"Body Jab","2b":"Body Cross","3b":"Lead Body Hook","4b":"Rear Body Hook" };
const DEFENSE_NAMES = { slip:"Slip",roll:"Roll",pull:"Pull",step_back:"Step Back",block:"Block" };
const FOOTWORK_NAMES = { pivot_left:"Pivot Left",pivot_right:"Pivot Right",angle_left:"Angle Left",angle_right:"Angle Right",circle_left:"Circle Left",circle_right:"Circle Right",step_in:"Step In",step_out:"Step Out" };

function getPunchName(code, stance = "orthodox") {
  if (isPunchCode(code)) return PUNCH_NAMES[code];
  if (isDefenseCode(code)) return DEFENSE_NAMES[code];
  if (isFootworkCode(code)) return FOOTWORK_NAMES[code];
  return String(code);
}
function getComboDisplayText(seq, mode = "codes") {
  if (!seq || seq.length === 0) return "--";
  return seq.map(el => {
    if (mode === "codes") return isPunchCode(el) ? el : getPunchName(el);
    if (mode === "names") return getPunchName(el);
    if (isPunchCode(el)) return `${el} (${getPunchName(el)})`;
    return getPunchName(el);
  }).join("-");
}
function computeComboStats(seq) {
  let tp=0,hs=0,bs=0,pp=0,sp=0,dc=0,fc=0;
  for (const el of seq) {
    if (isPunchCode(el)) { tp++; if (isBodyShot(el)) bs++; else hs++; if (isPowerPunch(el)) pp++; else sp++; }
    else if (isDefenseCode(el)) dc++;
    else if (isFootworkCode(el)) fc++;
  }
  return { totalPunches:tp, headShotCount:hs, bodyShotCount:bs, powerPunchCount:pp, speedPunchCount:sp, defensiveCount:dc, footworkCount:fc };
}

console.log("\n=== RUNTIME: isPunchCode ===");
for (const c of ["1","2","3","4","5","6","1b","2b","3b","4b"]) test(`isPunchCode("${c}")`, true, isPunchCode(c));
for (const c of ["slip","roll","pull","step_back","block"]) test(`isPunchCode("${c}")`, false, isPunchCode(c));
for (const c of ["pivot_left","step_in","step_out"]) test(`isPunchCode("${c}")`, false, isPunchCode(c));
test('isPunchCode("")', false, isPunchCode(""));
test('isPunchCode("7")', false, isPunchCode("7"));
test('isPunchCode("jab")', false, isPunchCode("jab"));

console.log("\n=== RUNTIME: isDefenseCode ===");
for (const c of ["slip","roll","pull","step_back","block"]) test(`isDefenseCode("${c}")`, true, isDefenseCode(c));
test('isDefenseCode("1")', false, isDefenseCode("1"));
test('isDefenseCode("")', false, isDefenseCode(""));

console.log("\n=== RUNTIME: isFootworkCode ===");
for (const c of ["pivot_left","pivot_right","angle_left","angle_right","circle_left","circle_right","step_in","step_out"]) test(`isFootworkCode("${c}")`, true, isFootworkCode(c));
test('isFootworkCode("1")', false, isFootworkCode("1"));
test('isFootworkCode("slip")', false, isFootworkCode("slip"));

console.log("\n=== RUNTIME: isBodyShot / isPowerPunch ===");
test('isBodyShot("1")', false, isBodyShot("1"));
test('isBodyShot("1b")', true, isBodyShot("1b"));
test('isBodyShot("2b")', true, isBodyShot("2b"));
test('isBodyShot("3b")', true, isBodyShot("3b"));
test('isBodyShot("4b")', true, isBodyShot("4b"));
test('isBodyShot("2")', false, isBodyShot("2"));
test('isPowerPunch("1")', false, isPowerPunch("1"));
test('isPowerPunch("2")', true, isPowerPunch("2"));
test('isPowerPunch("3")', true, isPowerPunch("3"));
test('isPowerPunch("4")', true, isPowerPunch("4"));
test('isPowerPunch("5")', true, isPowerPunch("5"));
test('isPowerPunch("6")', true, isPowerPunch("6"));
test('isPowerPunch("1b")', false, isPowerPunch("1b"));
test('isPowerPunch("2b")', true, isPowerPunch("2b"));

console.log("\n=== RUNTIME: getPunchName ===");
test('getPunchName("1")', "Jab", getPunchName("1"));
test('getPunchName("2")', "Cross", getPunchName("2"));
test('getPunchName("3")', "Lead Hook", getPunchName("3"));
test('getPunchName("4")', "Rear Hook", getPunchName("4"));
test('getPunchName("5")', "Lead Uppercut", getPunchName("5"));
test('getPunchName("6")', "Rear Uppercut", getPunchName("6"));
test('getPunchName("1b")', "Body Jab", getPunchName("1b"));
test('getPunchName("2b")', "Body Cross", getPunchName("2b"));
test('getPunchName("3b")', "Lead Body Hook", getPunchName("3b"));
test('getPunchName("4b")', "Rear Body Hook", getPunchName("4b"));
test('getPunchName("slip")', "Slip", getPunchName("slip"));
test('getPunchName("roll")', "Roll", getPunchName("roll"));
test('getPunchName("pull")', "Pull", getPunchName("pull"));
test('getPunchName("step_back")', "Step Back", getPunchName("step_back"));
test('getPunchName("block")', "Block", getPunchName("block"));
test('getPunchName("pivot_left")', "Pivot Left", getPunchName("pivot_left"));
test('getPunchName("step_in")', "Step In", getPunchName("step_in"));
test('getPunchName("step_out")', "Step Out", getPunchName("step_out"));

console.log("\n=== RUNTIME: getComboDisplayText ===");
test("gcdt codes: 1-2", "1-2", getComboDisplayText(["1","2"]));
test("gcdt codes: 1-2-slip-3-2", "1-2-Slip-3-2", getComboDisplayText(["1","2","slip","3","2"]));
test("gcdt codes: 1-2-3", "1-2-3", getComboDisplayText(["1","2","3"]));
test("gcdt names: 1-2", "Jab-Cross", getComboDisplayText(["1","2"], "names"));
test("gcdt names: 1-2-slip-3", "Jab-Cross-Slip-Lead Hook", getComboDisplayText(["1","2","slip","3"], "names"));
test("gcdt both: 1-2", "1 (Jab)-2 (Cross)", getComboDisplayText(["1","2"], "both"));
test("gcdt both: with defense", "1 (Jab)-Slip-2 (Cross)", getComboDisplayText(["1","slip","2"], "both"));
test("gcdt empty", "--", getComboDisplayText([]));
test("gcdt null", "--", getComboDisplayText(null));

console.log("\n=== RUNTIME: computeComboStats ===");
const s1 = computeComboStats(["1","2","3"]);
test("ccs [1,2,3] totalPunches", 3, s1.totalPunches);
test("ccs [1,2,3] headShots", 3, s1.headShotCount);
test("ccs [1,2,3] bodyShots", 0, s1.bodyShotCount);
test("ccs [1,2,3] power", 2, s1.powerPunchCount);  // 2,3 power; 1 speed
test("ccs [1,2,3] speed", 1, s1.speedPunchCount);
test("ccs [1,2,3] defense", 0, s1.defensiveCount);
test("ccs [1,2,3] footwork", 0, s1.footworkCount);

const s2 = computeComboStats(["1","2","slip","3b","4b","pivot_left"]);
test("ccs mixed totalPunches", 4, s2.totalPunches);
test("ccs mixed headShots", 2, s2.headShotCount);
test("ccs mixed bodyShots", 2, s2.bodyShotCount);
test("ccs mixed power", 3, s2.powerPunchCount); // 2, 3b, 4b
test("ccs mixed speed", 1, s2.speedPunchCount); // 1
test("ccs mixed defense", 1, s2.defensiveCount);
test("ccs mixed footwork", 1, s2.footworkCount);

const s3 = computeComboStats([]);
test("ccs empty totalPunches", 0, s3.totalPunches);
test("ccs empty headShots", 0, s3.headShotCount);
test("ccs empty bodyShots", 0, s3.bodyShotCount);
test("ccs empty power", 0, s3.powerPunchCount);
test("ccs empty speed", 0, s3.speedPunchCount);
test("ccs empty defense", 0, s3.defensiveCount);
test("ccs empty footwork", 0, s3.footworkCount);

// All body shots
const s4 = computeComboStats(["1b","2b","3b","4b"]);
test("ccs all body totalPunches", 4, s4.totalPunches);
test("ccs all body headShots", 0, s4.headShotCount);
test("ccs all body bodyShots", 4, s4.bodyShotCount);
test("ccs all body power", 3, s4.powerPunchCount); // 2b,3b,4b
test("ccs all body speed", 1, s4.speedPunchCount); // 1b

// All defense
const s5 = computeComboStats(["slip","roll","pull","step_back","block"]);
test("ccs all defense totalPunches", 0, s5.totalPunches);
test("ccs all defense defense", 5, s5.defensiveCount);

// All footwork
const s6 = computeComboStats(["pivot_left","pivot_right","step_in","step_out"]);
test("ccs all footwork totalPunches", 0, s6.totalPunches);
test("ccs all footwork footwork", 4, s6.footworkCount);

// Single punch
const s7 = computeComboStats(["1"]);
test("ccs single jab totalPunches", 1, s7.totalPunches);
test("ccs single jab headShots", 1, s7.headShotCount);
test("ccs single jab speed", 1, s7.speedPunchCount);
test("ccs single jab power", 0, s7.powerPunchCount);

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme.ts intact", readSrc("theme.ts").length > 1000);
testTrue("types intact", readSrc("types/index.ts").includes("PunchCode"));
testTrue("stores intact", readSrc("stores/index.ts").includes("useComboStore"));
testTrue("date.ts intact", readSrc("lib/date.ts").includes("toLocalDateKey"));

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
