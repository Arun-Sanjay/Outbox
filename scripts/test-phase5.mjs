/**
 * Phase 5 — Type Definitions Test Script
 * Validates every exported type, union literal, field, and structural relationship
 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.join(__dirname, "../src/types/index.ts"), "utf8");

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

function testIncludes(name, pattern) {
  const found = src.includes(pattern);
  results.push({ name, expected: `contains`, actual: found ? "found" : "NOT FOUND", pass: found });
  if (found) passed++; else failed++;
}

function testExport(name) {
  testIncludes(`export type ${name}`, `export type ${name}`);
}

// Helper: extract union values from "type X = "a" | "b" | ..."
function extractUnion(typeName) {
  const re = new RegExp(`export type ${typeName}\\s*=[\\s\\S]*?;`);
  const match = src.match(re);
  if (!match) return [];
  const vals = [];
  const valRe = /"([^"]+)"/g;
  let m;
  while ((m = valRe.exec(match[0])) !== null) {
    vals.push(m[1]);
  }
  return vals;
}

// Helper: extract field names from a type block
function extractFields(typeName) {
  const re = new RegExp(`export type ${typeName}\\s*=\\s*\\{([\\s\\S]*?)\\};`);
  const match = src.match(re);
  if (!match) return [];
  const fields = [];
  const fieldRe = /^\s{2}(\w+):/gm;
  let m;
  while ((m = fieldRe.exec(match[1])) !== null) {
    fields.push(m[1]);
  }
  return fields;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALL EXPORTS PRESENT
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== ALL TYPE EXPORTS PRESENT ===");
const allTypes = [
  "PunchCode", "DefenseCode", "FootworkCode", "ComboElement", "PunchInfo",
  "Combo", "ComboSessionConfig", "ComboCalloutRecord", "ActiveComboSession",
  "SessionType", "Intensity", "TrainingSession",
  "FightType", "FightResult", "FightMethod", "WeightClass", "Fight",
  "SparringRoundNote", "SparringEntry", "SparringPartner",
  "TimerPreset", "FightCamp", "WeightEntry",
  "BenchmarkType", "BenchmarkEntry",
  "BoxerType", "ProgramFocus", "ProgramDay", "TrainingProgram",
  "Rank", "XPSource", "XPEntry", "Achievement",
  "UserProfile", "BoxingTip", "GlossaryEntry"
];
for (const t of allTypes) {
  testExport(t);
}
test("Total exported types count", 36, allTypes.length);

// ═══════════════════════════════════════════════════════════════════════════════
// UNION TYPE: PUNCH CODES (10 values)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== PUNCHCODE VALUES ===");
const punchCodes = extractUnion("PunchCode");
const expectedPunches = ["1", "2", "3", "4", "5", "6", "1b", "2b", "3b", "4b"];
test("PunchCode count", 10, punchCodes.length);
for (const p of expectedPunches) {
  testTrue(`PunchCode has "${p}"`, punchCodes.includes(p));
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNION TYPE: DEFENSE CODES (5 values)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== DEFENSECODE VALUES ===");
const defenseCodes = extractUnion("DefenseCode");
const expectedDefense = ["slip", "roll", "pull", "step_back", "block"];
test("DefenseCode count", 5, defenseCodes.length);
for (const d of expectedDefense) {
  testTrue(`DefenseCode has "${d}"`, defenseCodes.includes(d));
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNION TYPE: FOOTWORK CODES (8 values)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== FOOTWORKCODE VALUES ===");
const footworkCodes = extractUnion("FootworkCode");
const expectedFootwork = ["pivot_left", "pivot_right", "angle_left", "angle_right", "circle_left", "circle_right", "step_in", "step_out"];
test("FootworkCode count", 8, footworkCodes.length);
for (const f of expectedFootwork) {
  testTrue(`FootworkCode has "${f}"`, footworkCodes.includes(f));
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBO ELEMENT = UNION OF ALL THREE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== COMBOELEMENT ===");
testIncludes("ComboElement = PunchCode | DefenseCode | FootworkCode", "PunchCode | DefenseCode | FootworkCode");

// ═══════════════════════════════════════════════════════════════════════════════
// PUNCHINFO FIELDS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== PUNCHINFO FIELDS ===");
const punchInfoFields = extractFields("PunchInfo");
const expectedPIFields = ["code", "name", "orthodoxHand", "southpawHand", "target", "type", "formCues", "commonMistakes"];
test("PunchInfo field count", 8, punchInfoFields.length);
for (const f of expectedPIFields) {
  testTrue(`PunchInfo has field "${f}"`, punchInfoFields.includes(f));
}
testIncludes("PunchInfo.code is PunchCode", "code: PunchCode");
testIncludes("PunchInfo.orthodoxHand left|right", 'orthodoxHand: "left" | "right"');
testIncludes("PunchInfo.target head|body", 'target: "head" | "body"');
testIncludes("PunchInfo.type speed|power", 'type: "speed" | "power"');
testIncludes("PunchInfo.formCues is string[]", "formCues: string[]");
testIncludes("PunchInfo.commonMistakes is string[]", "commonMistakes: string[]");

// ═══════════════════════════════════════════════════════════════════════════════
// COMBO FIELDS (14 fields)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== COMBO FIELDS ===");
const comboFields = extractFields("Combo");
const expectedComboFields = ["id", "name", "sequence", "difficulty", "scope", "isFavorite", "headShotCount", "bodyShotCount", "powerPunchCount", "speedPunchCount", "defensiveCount", "footworkCount", "totalPunches", "createdAt"];
test("Combo field count", 14, comboFields.length);
for (const f of expectedComboFields) {
  testTrue(`Combo has field "${f}"`, comboFields.includes(f));
}
testIncludes("Combo.sequence is ComboElement[]", "sequence: ComboElement[]");
testIncludes("Combo.difficulty beginner|intermediate|advanced", 'difficulty: "beginner" | "intermediate" | "advanced"');
testIncludes("Combo.scope system|personal", 'scope: "system" | "personal"');

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION TYPE (9 values)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== SESSIONTYPE VALUES ===");
const sessionTypes = extractUnion("SessionType");
const expectedSessions = ["heavy_bag", "speed_bag", "double_end_bag", "shadow_boxing", "mitt_work", "sparring", "conditioning", "strength", "roadwork"];
test("SessionType count", 9, sessionTypes.length);
for (const s of expectedSessions) {
  testTrue(`SessionType has "${s}"`, sessionTypes.includes(s));
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTENSITY (4 values)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== INTENSITY VALUES ===");
const intensities = extractUnion("Intensity");
const expectedIntensity = ["light", "moderate", "hard", "war"];
test("Intensity count", 4, intensities.length);
for (const i of expectedIntensity) {
  testTrue(`Intensity has "${i}"`, intensities.includes(i));
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRAINING SESSION FIELDS (21 fields)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== TRAININGSESSION FIELDS ===");
const tsFields = extractFields("TrainingSession");
const expectedTSFields = ["id", "sessionType", "date", "startedAt", "durationSeconds", "rounds", "intensity", "energyRating", "sharpnessRating", "notes", "comboSessionId", "timerPresetId", "comboModeUsed", "partnerName", "coachName", "distanceMeters", "routeDescription", "conditioningType", "xpEarned", "createdAt"];
test("TrainingSession field count", 20, tsFields.length);
for (const f of expectedTSFields) {
  testTrue(`TrainingSession has field "${f}"`, tsFields.includes(f));
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIGHT TYPE (4), RESULT (4), METHOD (8)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== FIGHTTYPE VALUES ===");
const fightTypes = extractUnion("FightType");
test("FightType count", 4, fightTypes.length);
for (const v of ["amateur", "professional", "exhibition", "sparring"]) {
  testTrue(`FightType has "${v}"`, fightTypes.includes(v));
}

console.log("\n=== FIGHTRESULT VALUES ===");
const fightResults = extractUnion("FightResult");
test("FightResult count", 4, fightResults.length);
for (const v of ["win", "loss", "draw", "no_contest"]) {
  testTrue(`FightResult has "${v}"`, fightResults.includes(v));
}

console.log("\n=== FIGHTMETHOD VALUES ===");
const fightMethods = extractUnion("FightMethod");
test("FightMethod count", 8, fightMethods.length);
for (const v of ["ko", "tko", "unanimous_decision", "split_decision", "majority_decision", "corner_stoppage", "dq", "points"]) {
  testTrue(`FightMethod has "${v}"`, fightMethods.includes(v));
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEIGHT CLASS (13 values)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== WEIGHTCLASS VALUES ===");
const weightClasses = extractUnion("WeightClass");
const expectedWC = ["strawweight", "flyweight", "bantamweight", "featherweight", "lightweight", "super_lightweight", "welterweight", "super_welterweight", "middleweight", "super_middleweight", "light_heavyweight", "cruiserweight", "heavyweight"];
test("WeightClass count", 13, weightClasses.length);
for (const v of expectedWC) {
  testTrue(`WeightClass has "${v}"`, weightClasses.includes(v));
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIGHT FIELDS (21 fields)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== FIGHT FIELDS ===");
const fightFields = extractFields("Fight");
const expectedFightFields = ["id", "fightType", "date", "location", "opponentName", "opponentRecord", "weightClass", "weighInWeight", "scheduledRounds", "result", "method", "endedRound", "endedTime", "cornerCoach", "notesWorked", "notesImprove", "generalNotes", "physicalRating", "mentalRating", "xpEarned", "createdAt"];
test("Fight field count", 21, fightFields.length);
for (const f of expectedFightFields) {
  testTrue(`Fight has field "${f}"`, fightFields.includes(f));
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPARRING TYPES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== SPARRING TYPES ===");
const srnFields = extractFields("SparringRoundNote");
test("SparringRoundNote field count", 3, srnFields.length);
for (const f of ["roundNumber", "notes", "dominance"]) {
  testTrue(`SparringRoundNote has "${f}"`, srnFields.includes(f));
}
testIncludes("SparringRoundNote.dominance me|them|even", 'dominance: "me" | "them" | "even"');

const seFields = extractFields("SparringEntry");
test("SparringEntry field count", 12, seFields.length);
for (const f of ["id", "sessionId", "partnerName", "partnerExperience", "rounds", "roundNotes", "overallNotes", "whatWorked", "whatToImprove", "intensity", "date", "createdAt"]) {
  testTrue(`SparringEntry has "${f}"`, seFields.includes(f));
}
testIncludes("SparringEntry.roundNotes is SparringRoundNote[]", "roundNotes: SparringRoundNote[]");

const spFields = extractFields("SparringPartner");
test("SparringPartner field count", 5, spFields.length);
for (const f of ["name", "totalSessions", "lastSparred", "averageIntensity", "notes"]) {
  testTrue(`SparringPartner has "${f}"`, spFields.includes(f));
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIMER PRESET (12 fields)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== TIMERPRESET FIELDS ===");
const tpFields = extractFields("TimerPreset");
test("TimerPreset field count", 12, tpFields.length);
for (const f of ["id", "name", "roundSeconds", "restSeconds", "numRounds", "warmupSeconds", "tenSecondWarning", "bellSound", "warningSound", "isDefault", "isCustom", "createdAt"]) {
  testTrue(`TimerPreset has "${f}"`, tpFields.includes(f));
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIGHT CAMP & WEIGHT
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== FIGHTCAMP FIELDS ===");
const fcFields = extractFields("FightCamp");
test("FightCamp field count", 10, fcFields.length);
for (const f of ["id", "fightDate", "opponentName", "weightClass", "targetWeight", "currentWeight", "startDate", "isActive", "notes", "createdAt"]) {
  testTrue(`FightCamp has "${f}"`, fcFields.includes(f));
}

console.log("\n=== WEIGHTENTRY FIELDS ===");
const weFields = extractFields("WeightEntry");
test("WeightEntry field count", 6, weFields.length);
for (const f of ["id", "weight", "unit", "date", "fightCampId", "notes"]) {
  testTrue(`WeightEntry has "${f}"`, weFields.includes(f));
}
testIncludes("WeightEntry.unit kg|lb", 'unit: "kg" | "lb"');

// ═══════════════════════════════════════════════════════════════════════════════
// BENCHMARK TYPES (8 values)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== BENCHMARKTYPE VALUES ===");
const benchTypes = extractUnion("BenchmarkType");
const expectedBench = ["3min_punch_count", "shadow_3rounds", "skip_rope_3min", "5k_roadwork", "3k_roadwork", "push_ups_max", "burpees_3min", "plank_hold"];
test("BenchmarkType count", 8, benchTypes.length);
for (const v of expectedBench) {
  testTrue(`BenchmarkType has "${v}"`, benchTypes.includes(v));
}

const beFields = extractFields("BenchmarkEntry");
test("BenchmarkEntry field count", 6, beFields.length);

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRAM TYPES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== BOXERTYPE VALUES (6) ===");
const boxerTypes = extractUnion("BoxerType");
const expectedBT = ["complete_beginner", "gym_background", "cardio_background", "returning_boxer", "intermediate_boxer", "competition_prep"];
test("BoxerType count", 6, boxerTypes.length);
for (const v of expectedBT) {
  testTrue(`BoxerType has "${v}"`, boxerTypes.includes(v));
}

console.log("\n=== PROGRAMFOCUS VALUES (7) ===");
const progFocus = extractUnion("ProgramFocus");
const expectedPF = ["power", "cardio", "mobility", "footwork", "technique", "fight_camp", "general"];
test("ProgramFocus count", 7, progFocus.length);
for (const v of expectedPF) {
  testTrue(`ProgramFocus has "${v}"`, progFocus.includes(v));
}

console.log("\n=== PROGRAMDAY FIELDS ===");
const pdFields = extractFields("ProgramDay");
test("ProgramDay field count", 11, pdFields.length);
for (const f of ["dayNumber", "title", "description", "sessionType", "suggestedDuration", "suggestedRounds", "suggestedIntensity", "comboSetIds", "exercises", "notes", "isRestDay"]) {
  testTrue(`ProgramDay has "${f}"`, pdFields.includes(f));
}

console.log("\n=== TRAININGPROGRAM FIELDS ===");
const tpgFields = extractFields("TrainingProgram");
test("TrainingProgram field count", 11, tpgFields.length);
for (const f of ["id", "name", "description", "focus", "targetBoxerType", "durationWeeks", "daysPerWeek", "days", "isPremium", "difficulty", "createdAt"]) {
  testTrue(`TrainingProgram has "${f}"`, tpgFields.includes(f));
}

// ═══════════════════════════════════════════════════════════════════════════════
// RANK (6 values)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== RANK VALUES ===");
const ranks = extractUnion("Rank");
const expectedRanks = ["rookie", "prospect", "contender", "challenger", "champion", "undisputed"];
test("Rank count", 6, ranks.length);
for (const v of expectedRanks) {
  testTrue(`Rank has "${v}"`, ranks.includes(v));
}

// ═══════════════════════════════════════════════════════════════════════════════
// XPSOURCE (8 values)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== XPSOURCE VALUES ===");
const xpSources = extractUnion("XPSource");
const expectedXP = ["training", "combo_drill", "sparring", "fight", "streak", "achievement", "benchmark", "program"];
test("XPSource count", 8, xpSources.length);
for (const v of expectedXP) {
  testTrue(`XPSource has "${v}"`, xpSources.includes(v));
}

// ═══════════════════════════════════════════════════════════════════════════════
// XPENTRY, ACHIEVEMENT FIELDS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== XPENTRY FIELDS ===");
const xeFields = extractFields("XPEntry");
test("XPEntry field count", 5, xeFields.length);
for (const f of ["id", "amount", "source", "description", "earnedAt"]) {
  testTrue(`XPEntry has "${f}"`, xeFields.includes(f));
}

console.log("\n=== ACHIEVEMENT FIELDS ===");
const achFields = extractFields("Achievement");
test("Achievement field count", 7, achFields.length);
for (const f of ["id", "name", "description", "icon", "xpReward", "unlockedAt", "category"]) {
  testTrue(`Achievement has "${f}"`, achFields.includes(f));
}
testIncludes("Achievement.category has 5 values", '"training" | "fighting" | "consistency" | "skill" | "milestone"');

// ═══════════════════════════════════════════════════════════════════════════════
// USER PROFILE (37 fields)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== USERPROFILE FIELDS ===");
const upFields = extractFields("UserProfile");
const expectedUPFields = [
  "name", "fightName", "stance", "experienceLevel", "trainingGoals",
  "weight", "weightUnit", "height", "heightUnit", "reach", "reachUnit",
  "activeWeightClass", "totalXP", "rank", "xpHistory", "achievements",
  "currentStreak", "longestStreak", "lastTrainingDate", "streakMultiplier",
  "activeFightCampId", "boxerType", "activeProgramId",
  "ttsRate", "ttsPitch", "calloutStyle", "bellSound", "warningSound",
  "masterVolume", "bellVolume", "calloutVolume",
  "notifications", "trainingReminder", "hapticsEnabled", "createdAt"
];
test("UserProfile field count", 35, upFields.length);
for (const f of expectedUPFields) {
  testTrue(`UserProfile has "${f}"`, upFields.includes(f));
}
testIncludes("UserProfile.stance orthodox|southpaw|switch", 'stance: "orthodox" | "southpaw" | "switch"');
testIncludes("UserProfile.rank is Rank", "rank: Rank");
testIncludes("UserProfile.xpHistory is XPEntry[]", "xpHistory: XPEntry[]");
testIncludes("UserProfile.achievements is Achievement[]", "achievements: Achievement[]");
testIncludes("UserProfile.activeWeightClass nullable", "activeWeightClass: WeightClass | null");
testIncludes("UserProfile.boxerType nullable", "boxerType: BoxerType | null");

// ═══════════════════════════════════════════════════════════════════════════════
// BOXING TIP & GLOSSARY
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== BOXINGTIP FIELDS ===");
const btFields = extractFields("BoxingTip");
test("BoxingTip field count", 4, btFields.length);
for (const f of ["id", "title", "content", "category"]) {
  testTrue(`BoxingTip has "${f}"`, btFields.includes(f));
}

console.log("\n=== GLOSSARYENTRY FIELDS ===");
const geFields = extractFields("GlossaryEntry");
test("GlossaryEntry field count", 4, geFields.length);
for (const f of ["id", "term", "definition", "category"]) {
  testTrue(`GlossaryEntry has "${f}"`, geFields.includes(f));
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBOSESSIONCONFIG FIELDS (14)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== COMBOSESSIONCONFIG FIELDS ===");
const cscFields = extractFields("ComboSessionConfig");
const expectedCSCFields = ["drillMode", "comboSources", "includeFavorites", "drillQueueIds", "roundLength", "restLength", "numRounds", "tempo", "calloutStyle", "stance", "warmupRound", "warmupLength", "tenSecondWarning", "bellSound"];
test("ComboSessionConfig field count", 14, cscFields.length);
for (const f of expectedCSCFields) {
  testTrue(`ComboSessionConfig has "${f}"`, cscFields.includes(f));
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVECOMBOSESSION FIELDS (13)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== ACTIVECOMBOSESSION FIELDS ===");
const acsFields = extractFields("ActiveComboSession");
const expectedACSFields = ["id", "config", "startedAt", "currentRound", "isResting", "isPaused", "combosCalledOut", "totalPunchesEstimated", "headShotsEstimated", "bodyShotsEstimated", "powerPunchesEstimated", "speedPunchesEstimated", "status"];
test("ActiveComboSession field count", 13, acsFields.length);
for (const f of expectedACSFields) {
  testTrue(`ActiveComboSession has "${f}"`, acsFields.includes(f));
}
testIncludes("ActiveComboSession.config is ComboSessionConfig", "config: ComboSessionConfig");
testIncludes("ActiveComboSession.combosCalledOut is ComboCalloutRecord[]", "combosCalledOut: ComboCalloutRecord[]");
testIncludes("ActiveComboSession.status active|completed|abandoned", '"active" | "completed" | "abandoned"');

// ═══════════════════════════════════════════════════════════════════════════════
// STRUCTURAL CROSS-REFERENCES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== CROSS-REFERENCES ===");
testIncludes("TrainingSession.sessionType is SessionType", "sessionType: SessionType");
testIncludes("TrainingSession.intensity is Intensity", "intensity: Intensity");
testIncludes("Fight.fightType is FightType", "fightType: FightType");
testIncludes("Fight.result is FightResult", "result: FightResult");
testIncludes("Fight.method nullable FightMethod", "method: FightMethod | null");
testIncludes("Fight.weightClass is WeightClass", "weightClass: WeightClass");
testIncludes("FightCamp.weightClass is WeightClass", "weightClass: WeightClass");
testIncludes("SparringEntry.intensity is Intensity", "intensity: Intensity");
testIncludes("ProgramDay.sessionType is SessionType", "sessionType: SessionType");
testIncludes("ProgramDay.suggestedIntensity is Intensity", "suggestedIntensity: Intensity");
testIncludes("TrainingProgram.focus is ProgramFocus", "focus: ProgramFocus");
testIncludes("TrainingProgram.targetBoxerType is BoxerType[]", "targetBoxerType: BoxerType[]");
testIncludes("TrainingProgram.days is ProgramDay[]", "days: ProgramDay[]");
testIncludes("XPEntry.source is XPSource", "source: XPSource");

// ═══════════════════════════════════════════════════════════════════════════════
// NO DUPLICATES CHECK
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== NO DUPLICATE TYPE EXPORTS ===");
const exportRe = /export type (\w+)/g;
const exportNames = [];
let em;
while ((em = exportRe.exec(src)) !== null) {
  exportNames.push(em[1]);
}
const uniqueExports = new Set(exportNames);
test("No duplicate type export names", exportNames.length, uniqueExports.size);

// ═══════════════════════════════════════════════════════════════════════════════
// NO IMPORT NEEDED (self-contained types file)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== SELF-CONTAINED ===");
testTrue("types/index.ts has no external imports", !src.includes("import "));

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
const themeSrc = readFileSync(path.join(__dirname, "../src/theme.ts"), "utf8");
testTrue("theme.ts still intact", themeSrc.length > 1000);
const compIndex = readFileSync(path.join(__dirname, "../src/components/index.ts"), "utf8");
testTrue("components/index.ts still intact", compIndex.includes("Panel"));
const storageSrc = readFileSync(path.join(__dirname, "../src/db/storage.ts"), "utf8");
testTrue("db/storage.ts still intact", storageSrc.includes("outbox-storage"));
const dateSrc = readFileSync(path.join(__dirname, "../src/lib/date.ts"), "utf8");
testTrue("lib/date.ts still intact", dateSrc.includes("toLocalDateKey"));

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT ALL RESULTS
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
