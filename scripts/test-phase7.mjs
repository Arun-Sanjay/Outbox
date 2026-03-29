/**
 * Phase 7 — File Structure Test Script
 * Validates all directories, files, exports, and structure integrity
 */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "../src");

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
function testInc(name, src, pattern) {
  const found = src.includes(pattern);
  results.push({ name, expected: "contains", actual: found ? "found" : "NOT FOUND", pass: found });
  if (found) passed++; else failed++;
}

function fileExists(relPath) {
  return existsSync(path.join(srcDir, relPath));
}
function readFile(relPath) {
  return readFileSync(path.join(srcDir, relPath), "utf8");
}
function dirExists(relPath) {
  const p = path.join(srcDir, relPath);
  return existsSync(p) && statSync(p).isDirectory();
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECTORY STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== DIRECTORIES ===");
const requiredDirs = [
  "data",
  "lib",
  "db",
  "types",
  "stores",
  "components",
  "components/training",
  "components/combo",
  "components/session",
  "components/fight",
  "components/analytics",
  "components/gamification",
  "components/weight",
  "components/camp",
  "components/knowledge",
];
for (const dir of requiredDirs) {
  testTrue(`dir exists: src/${dir}`, dirExists(dir));
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA FILES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== DATA FILES ===");
const dataFiles = [
  "data/punches.ts",
  "data/combos-beginner.ts",
  "data/combos-intermediate.ts",
  "data/combos-advanced.ts",
  "data/presets.ts",
  "data/achievements.ts",
  "data/tips.ts",
  "data/glossary.ts",
  "data/programs.ts",
  "data/benchmarks.ts",
  "data/index.ts",
];
for (const file of dataFiles) {
  testTrue(`file exists: src/${file}`, fileExists(file));
}

console.log("\n=== DATA FILE EXPORTS ===");
// Verify each data file has a valid export
testInc("punches exports PUNCHES", readFile("data/punches.ts"), "export const PUNCHES");
testInc("punches exports DEFENSES", readFile("data/punches.ts"), "export const DEFENSES");
testInc("punches exports FOOTWORK", readFile("data/punches.ts"), "export const FOOTWORK");
// PunchInfo defined in types/index.ts; DefenseInfo/FootworkInfo in punches.ts
testTrue("PunchInfo type in types or punches", readFile("types/index.ts").includes("PunchInfo") || readFile("data/punches.ts").includes("export type PunchInfo"));
testInc("punches exports DefenseInfo type", readFile("data/punches.ts"), "export type DefenseInfo");
testInc("punches exports FootworkInfo type", readFile("data/punches.ts"), "export type FootworkInfo");
testInc("punches imports PunchCode", readFile("data/punches.ts"), "PunchCode");
testInc("punches imports DefenseCode", readFile("data/punches.ts"), "DefenseCode");
testInc("punches imports FootworkCode", readFile("data/punches.ts"), "FootworkCode");

testInc("combos-beginner exports BEGINNER_COMBOS", readFile("data/combos-beginner.ts"), "export const BEGINNER_COMBOS");
testInc("combos-intermediate exports INTERMEDIATE_COMBOS", readFile("data/combos-intermediate.ts"), "export const INTERMEDIATE_COMBOS");
testInc("combos-advanced exports ADVANCED_COMBOS", readFile("data/combos-advanced.ts"), "export const ADVANCED_COMBOS");
testInc("presets exports DEFAULT_TIMER_PRESETS", readFile("data/presets.ts"), "export const DEFAULT_TIMER_PRESETS");
testInc("achievements exports ACHIEVEMENTS", readFile("data/achievements.ts"), "export const ACHIEVEMENTS");
testInc("tips exports BOXING_TIPS", readFile("data/tips.ts"), "export const BOXING_TIPS");
testInc("glossary exports GLOSSARY_ENTRIES", readFile("data/glossary.ts"), "export const GLOSSARY_ENTRIES");
testInc("programs exports SYSTEM_PROGRAMS", readFile("data/programs.ts"), "export const SYSTEM_PROGRAMS");
testInc("benchmarks exports BENCHMARK_INFO", readFile("data/benchmarks.ts"), "export const BENCHMARK_INFO");

console.log("\n=== DATA BARREL EXPORTS ===");
const dataIndex = readFile("data/index.ts");
for (const exp of ["PUNCHES", "DEFENSES", "FOOTWORK", "BEGINNER_COMBOS", "INTERMEDIATE_COMBOS", "ADVANCED_COMBOS", "DEFAULT_TIMER_PRESETS", "ACHIEVEMENTS", "BOXING_TIPS", "GLOSSARY_ENTRIES", "SYSTEM_PROGRAMS", "BENCHMARK_INFO"]) {
  testInc(`data/index.ts exports ${exp}`, dataIndex, exp);
}
// PunchInfo now re-exported from types, not data barrel
testTrue("PunchInfo accessible (types or data)", readFile("types/index.ts").includes("PunchInfo"));
testInc("data/index.ts exports DefenseInfo type", dataIndex, "DefenseInfo");
testInc("data/index.ts exports FootworkInfo type", dataIndex, "FootworkInfo");
testInc("data/index.ts exports BenchmarkInfo type", dataIndex, "BenchmarkInfo");

// ═══════════════════════════════════════════════════════════════════════════════
// LIB FILES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== LIB FILES ===");
const libFiles = [
  "lib/date.ts",
  "lib/combo-engine.ts",
  "lib/tts-engine.ts",
  "lib/audio-manager.ts",
  "lib/xp-calculator.ts",
  "lib/achievement-checker.ts",
  "lib/haptics.ts",
  "lib/notifications.ts",
  "lib/workout-utils.ts",
  "lib/weight-class.ts",
  "lib/combo-utils.ts",
];
for (const file of libFiles) {
  testTrue(`file exists: src/${file}`, fileExists(file));
}

console.log("\n=== LIB FILES ARE VALID TS ===");
for (const file of libFiles) {
  const content = readFile(file);
  testTrue(`${file} has content`, content.length > 0);
  testTrue(`${file} has export statement`, content.includes("export"));
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT SUBDIRECTORY INDEX FILES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== COMPONENT SUBDIRECTORY INDEX FILES ===");
const componentDirs = [
  "components/training",
  "components/combo",
  "components/session",
  "components/fight",
  "components/analytics",
  "components/gamification",
  "components/weight",
  "components/camp",
  "components/knowledge",
];
for (const dir of componentDirs) {
  const indexPath = `${dir}/index.ts`;
  testTrue(`file exists: src/${indexPath}`, fileExists(indexPath));
  if (fileExists(indexPath)) {
    const content = readFile(indexPath);
    testTrue(`${indexPath} has export`, content.includes("export"));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE FILES STILL INTACT (from prior phases)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== PRIOR PHASE FILES INTACT ===");
const priorFiles = [
  "theme.ts",
  "components/Panel.tsx",
  "components/SectionHeader.tsx",
  "components/PageHeader.tsx",
  "components/MetricValue.tsx",
  "components/index.ts",
  "db/storage.ts",
  "lib/date.ts",
  "types/index.ts",
  "stores/index.ts",
  "stores/useComboStore.ts",
  "stores/useSessionStore.ts",
  "stores/useFightStore.ts",
  "stores/useProfileStore.ts",
  "stores/useWeightStore.ts",
  "stores/useTimerStore.ts",
  "stores/useProgramStore.ts",
  "stores/useBenchmarkStore.ts",
  "stores/useCampStore.ts",
  "stores/useKnowledgeStore.ts",
];
for (const file of priorFiles) {
  testTrue(`prior file intact: src/${file}`, fileExists(file));
}

// Verify core component exports still work
const compIndex = readFile("components/index.ts");
testInc("components index still exports Panel", compIndex, "Panel");
testInc("components index still exports SectionHeader", compIndex, "SectionHeader");
testInc("components index still exports PageHeader", compIndex, "PageHeader");
testInc("components index still exports MetricValue", compIndex, "MetricValue");

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE IMPORTS VALID IN DATA FILES
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== DATA FILES IMPORT FROM TYPES ===");
const dataFilesWithTypes = [
  "data/punches.ts",
  "data/combos-beginner.ts",
  "data/combos-intermediate.ts",
  "data/combos-advanced.ts",
  "data/presets.ts",
  "data/achievements.ts",
  "data/tips.ts",
  "data/glossary.ts",
  "data/programs.ts",
  "data/benchmarks.ts",
];
for (const file of dataFilesWithTypes) {
  testInc(`${file} imports from ../types`, readFile(file), 'from "../types"');
}

// ═══════════════════════════════════════════════════════════════════════════════
// NO ASYNCSTORAGE ANYWHERE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== NO ASYNCSTORAGE ===");
const allNewFiles = [...dataFiles, ...libFiles.filter(f => f !== "lib/date.ts")];
for (const file of allNewFiles) {
  if (fileExists(file)) {
    testTrue(`${file}: no AsyncStorage`, !readFile(file).includes("AsyncStorage"));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILE COUNT VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== FILE COUNTS ===");
const dataFileCount = readdirSync(path.join(srcDir, "data")).filter(f => f.endsWith(".ts")).length;
test("data directory has 11 .ts files", 11, dataFileCount);

const libFileCount = readdirSync(path.join(srcDir, "lib")).filter(f => f.endsWith(".ts")).length;
// 11 original + navigation.ts added in Phase 18
testTrue("lib directory has >= 11 .ts files", libFileCount >= 11);

const componentSubdirCount = readdirSync(path.join(srcDir, "components")).filter(f => {
  return statSync(path.join(srcDir, "components", f)).isDirectory();
}).length;
// 9 original + onboarding added in Phase 9
testTrue("components has >= 9 subdirectories", componentSubdirCount >= 9);

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
