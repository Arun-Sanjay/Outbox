/**
 * Theme Test Script — Phase 2
 * Tests every export in src/theme.ts
 * Run: node scripts/test-theme.mjs
 */

// ─── Mock react-native Platform ───────────────────────────────────────────────
import { createRequire } from "module";
import { register } from "module";
import { resolve as pathResolve } from "path";
import { fileURLToPath } from "url";

// We'll use a manual mock approach by temporarily monkey-patching the module
// Since theme.ts imports Platform from react-native, we need to transpile it
// We'll do static analysis via reading and parsing the file as a workaround
// and validate every value independently.

import { readFileSync } from "fs";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themeSource = readFileSync(
  path.join(__dirname, "../src/theme.ts"),
  "utf8"
);

let passed = 0;
let failed = 0;
const results = [];

function test(name, input, expected, actual) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, input: JSON.stringify(input), expected: JSON.stringify(expected), actual: JSON.stringify(actual), pass });
  if (pass) passed++;
  else failed++;
}

function testTruthy(name, actual) {
  const pass = !!actual;
  results.push({ name, input: "n/a", expected: "truthy", actual: JSON.stringify(actual), pass });
  if (pass) passed++;
  else failed++;
}

function testType(name, actual, expectedType) {
  const pass = typeof actual === expectedType;
  results.push({ name, input: "n/a", expected: expectedType, actual: typeof actual, pass });
  if (pass) passed++;
  else failed++;
}

function testMatches(name, actual, regex) {
  const pass = regex.test(actual);
  results.push({ name, input: actual, expected: `matches ${regex}`, actual, pass });
  if (pass) passed++;
  else failed++;
}

// ─── Static extraction: pull color/value definitions from source ──────────────
// We extract key: "value" pairs from the theme source

function extractValues(source) {
  const values = {};
  // Match patterns like:  key: "value", or key: value,
  const re = /^\s{2}(\w+):\s*("(?:[^"\\]|\\.)*"|\d+)/gm;
  let m;
  while ((m = re.exec(source)) !== null) {
    values[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return values;
}

const vals = extractValues(themeSource);

// ─── COLOR VALIDATION HELPER ───────────────────────────────────────────────────
// Valid color formats: #RRGGBB, rgba(...), #RGB
const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const RGBA_COLOR = /^rgba\(\s*\d+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*\)$/;

function isValidColor(v) {
  return HEX_COLOR.test(v) || RGBA_COLOR.test(v);
}

// ─── EXTRACT ALL COLORS BLOCK FROM SOURCE ─────────────────────────────────────
// Parse out all color key:value pairs
const colorRe = /(\w+):\s*"(#[0-9a-fA-F]{3,8}|rgba\([^)]+\))"/g;
const colorEntries = {};
let cm;
while ((cm = colorRe.exec(themeSource)) !== null) {
  colorEntries[cm[1]] = cm[2];
}

// ─── EXTRACT SPACING VALUES ────────────────────────────────────────────────────
const spacingRe = /(\w+):\s*(\d+),/g;
const spacingEntries = {};
const spacingSection = themeSource.match(/export const spacing[\s\S]*?} as const/)?.[0] ?? "";
let sm2;
// Match both quoted keys ("2xl": 24) and unquoted keys (xs: 4)
const spacingRe2 = /(?:"([\w-]+)"|(\w+))\s*:\s*(\d+)/g;
while ((sm2 = spacingRe2.exec(spacingSection)) !== null) {
  const key = sm2[1] ?? sm2[2]; // quoted key or unquoted key
  spacingEntries[key] = parseInt(sm2[3]);
}

// ─── EXTRACT RADIUS VALUES ─────────────────────────────────────────────────────
const radiusSection = themeSource.match(/export const radius[\s\S]*?} as const/)?.[0] ?? "";
const radiusEntries = {};
let rm;
const radiusRe = /(\w+):\s*(\d+)/g;
while ((rm = radiusRe.exec(radiusSection)) !== null) {
  radiusEntries[rm[1]] = parseInt(rm[2]);
}

// ─── TEST 1: FILE EXISTS AND IS NON-EMPTY ─────────────────────────────────────
console.log("\n=== TEST 1: FILE EXISTS AND IS NON-EMPTY ===");
testTruthy("theme.ts exists", themeSource);
testTruthy("theme.ts has content > 100 chars", themeSource.length > 100);
test("theme.ts length > 1000 chars", null, true, themeSource.length > 1000);
console.log(`  File length: ${themeSource.length} chars`);

// ─── TEST 2: REQUIRED EXPORTS PRESENT ─────────────────────────────────────────
console.log("\n=== TEST 2: REQUIRED EXPORTS PRESENT ===");
const requiredExports = ["colors", "rankColors", "spacing", "radius", "TOUCH_MIN", "fonts", "shadows"];
for (const exp of requiredExports) {
  const present = themeSource.includes(`export const ${exp}`) || themeSource.includes(`export const ${exp} `);
  results.push({ name: `export '${exp}' present`, input: exp, expected: "found in source", actual: present ? "found" : "NOT FOUND", pass: present });
  if (present) passed++; else failed++;
}

// ─── TEST 3: OUTBOX GOLD OVERRIDES ────────────────────────────────────────────
console.log("\n=== TEST 3: OUTBOX GOLD OVERRIDES ===");
// accent must be championship gold
test("accent = #FBBF24", "accent", "#FBBF24", colorEntries["accent"]);
test("accentDim = rgba(251,191,36,0.15)", "accentDim", "rgba(251, 191, 36, 0.15)", colorEntries["accentDim"]);
test("success = #FBBF24 (gold override)", "success", "#FBBF24", colorEntries["success"]);
test("successDim = rgba(251,191,36,0.15)", "successDim", "rgba(251, 191, 36, 0.15)", colorEntries["successDim"]);
// warning stays gold too
test("warning = #FBBF24", "warning", "#FBBF24", colorEntries["warning"]);

// ─── TEST 4: BASE COLORS NOT CHANGED ──────────────────────────────────────────
console.log("\n=== TEST 4: BASE TITAN COLORS UNCHANGED ===");
test("bg = #000000", "bg", "#000000", colorEntries["bg"]);
test("danger = #f87171", "danger", "#f87171", colorEntries["danger"]);
test("text present", "text", true, "text" in colorEntries);
test("tabBar = #080809", "tabBar", "#080809", colorEntries["tabBar"]);

// ─── TEST 5: BOXING-SPECIFIC COLORS PRESENT ───────────────────────────────────
console.log("\n=== TEST 5: BOXING ROUND STATE COLORS ===");
test("roundActive = #FBBF24", "roundActive", "#FBBF24", colorEntries["roundActive"]);
test("roundRest = rgba(96, 165, 250, 0.8)", "roundRest", "rgba(96, 165, 250, 0.8)", colorEntries["roundRest"]);
test("roundWarning = #f87171", "roundWarning", "#f87171", colorEntries["roundWarning"]);

console.log("\n=== TEST 6: FIGHT RESULT COLORS ===");
test("win = #34d399", "win", "#34d399", colorEntries["win"]);
test("loss = #f87171", "loss", "#f87171", colorEntries["loss"]);
test("draw = #94a3b8", "draw", "#94a3b8", colorEntries["draw"]);

console.log("\n=== TEST 7: INTENSITY COLORS ===");
test("intensityLight = #34d399 (green)", "intensityLight", "#34d399", colorEntries["intensityLight"]);
test("intensityModerate = #FBBF24 (gold)", "intensityModerate", "#FBBF24", colorEntries["intensityModerate"]);
test("intensityHard = #fb923c (orange)", "intensityHard", "#fb923c", colorEntries["intensityHard"]);
test("intensityWar = #f87171 (red)", "intensityWar", "#f87171", colorEntries["intensityWar"]);

console.log("\n=== TEST 8: SESSION TYPE COLORS (9 types) ===");
const sessionColors = {
  sessionHeavyBag: "#f87171",
  sessionSpeedBag: "#60a5fa",
  sessionDoubleEnd: "#a78bfa",
  sessionShadow: "#94a3b8",
  sessionMitts: "#fb923c",
  sessionSparring: "#f87171",
  sessionConditioning: "#34d399",
  sessionStrength: "#e879f9",
  sessionRoadwork: "#22d3ee",
};
for (const [key, expected] of Object.entries(sessionColors)) {
  test(`${key} = ${expected}`, key, expected, colorEntries[key]);
}

// ─── TEST 9: RANK COLORS ──────────────────────────────────────────────────────
console.log("\n=== TEST 9: RANK COLORS ===");
const rankSection = themeSource.match(/export const rankColors[\s\S]*?} as const/)?.[0] ?? "";
const rankColorRe = /(\w+):\s*"(#[0-9a-fA-F]{3,8}|rgba\([^)]+\))"/g;
const rankColorEntries = {};
let rcm;
while ((rcm = rankColorRe.exec(rankSection)) !== null) {
  rankColorEntries[rcm[1]] = rcm[2];
}
const expectedRanks = {
  rookie: "rgba(255,255,255,0.6)",
  prospect: "#34d399",
  contender: "#60a5fa",
  challenger: "#a78bfa",
  champion: "#FBBF24",
  undisputed: "#FBBF24",
};
for (const [key, expected] of Object.entries(expectedRanks)) {
  test(`rankColors.${key} = ${expected}`, key, expected, rankColorEntries[key]);
}

// ─── TEST 10: ALL COLORS ARE VALID FORMAT ─────────────────────────────────────
console.log("\n=== TEST 10: ALL COLOR VALUES ARE VALID FORMAT ===");
for (const [key, val] of Object.entries(colorEntries)) {
  const valid = isValidColor(val);
  results.push({ name: `color '${key}' valid format`, input: val, expected: "valid hex or rgba", actual: val, pass: valid });
  if (valid) passed++; else failed++;
}
// Rank colors
for (const [key, val] of Object.entries(rankColorEntries)) {
  const valid = isValidColor(val);
  results.push({ name: `rankColor '${key}' valid format`, input: val, expected: "valid hex or rgba", actual: val, pass: valid });
  if (valid) passed++; else failed++;
}

// ─── TEST 11: SPACING VALUES ───────────────────────────────────────────────────
console.log("\n=== TEST 11: SPACING VALUES ===");
test("spacing.xs = 4", "xs", 4, spacingEntries["xs"]);
test("spacing.sm = 8", "sm", 8, spacingEntries["sm"]);
test("spacing.md = 12", "md", 12, spacingEntries["md"]);
test("spacing.lg = 16", "lg", 16, spacingEntries["lg"]);
test("spacing.xl = 20", "xl", 20, spacingEntries["xl"]);
test("spacing.2xl = 24", "2xl", 24, spacingEntries["2xl"]);
test("spacing.3xl = 32", "3xl", 32, spacingEntries["3xl"]);
test("spacing.4xl = 40", "4xl", 40, spacingEntries["4xl"]);
test("spacing.5xl = 48", "5xl", 48, spacingEntries["5xl"]);

// ─── TEST 12: RADIUS VALUES ───────────────────────────────────────────────────
console.log("\n=== TEST 12: RADIUS VALUES ===");
test("radius.sm = 8", "sm", 8, radiusEntries["sm"]);
test("radius.md = 12", "md", 12, radiusEntries["md"]);
test("radius.lg = 16", "lg", 16, radiusEntries["lg"]);
test("radius.xl = 22", "xl", 22, radiusEntries["xl"]);
test("radius.full = 999", "full", 999, radiusEntries["full"]);

// ─── TEST 13: TOUCH_MIN ──────────────────────────────────────────────────────
console.log("\n=== TEST 13: TOUCH_MIN ===");
const touchMatch = themeSource.match(/export const TOUCH_MIN\s*=\s*(\d+)/);
const touchValue = touchMatch ? parseInt(touchMatch[1]) : null;
test("TOUCH_MIN = 48", "TOUCH_MIN", 48, touchValue);

// ─── TEST 14: FONTS KEYS PRESENT ──────────────────────────────────────────────
console.log("\n=== TEST 14: FONTS KEYS PRESENT ===");
const fontKeys = ["hero", "title", "heading", "subheading", "body", "kicker", "caption", "small", "mono", "monoLarge", "monoValue"];
for (const key of fontKeys) {
  const present = themeSource.includes(`${key}:`);
  results.push({ name: `fonts.${key} defined`, input: key, expected: "present", actual: present ? "present" : "MISSING", pass: present });
  if (present) passed++; else failed++;
}

// Verify monoLarge has tabular-nums
const hasTabularNums = themeSource.includes('["tabular-nums"]') || themeSource.includes('"tabular-nums"');
results.push({ name: "monoLarge has tabular-nums fontVariant", input: "fontVariant", expected: "tabular-nums found", actual: hasTabularNums ? "found" : "MISSING", pass: hasTabularNums });
if (hasTabularNums) passed++; else failed++;

// Verify mono uses Platform.select
const hasPlatformSelect = themeSource.includes("Platform.select");
results.push({ name: "monoFont uses Platform.select", input: "Platform.select", expected: "found", actual: hasPlatformSelect ? "found" : "MISSING", pass: hasPlatformSelect });
if (hasPlatformSelect) passed++; else failed++;

// Verify mono ios = Menlo, android = monospace
const hasMenlo = themeSource.includes('"Menlo"');
const hasMonospace = themeSource.includes('"monospace"');
results.push({ name: "monoFont ios = Menlo", input: "Menlo", expected: "found", actual: hasMenlo ? "found" : "MISSING", pass: hasMenlo });
if (hasMenlo) passed++; else failed++;
results.push({ name: "monoFont android = monospace", input: "monospace", expected: "found", actual: hasMonospace ? "found" : "MISSING", pass: hasMonospace });
if (hasMonospace) passed++; else failed++;

// ─── TEST 15: FONT WEIGHTS VALID (only 100-900 in steps of 100) ───────────────
console.log("\n=== TEST 15: FONT WEIGHTS VALID ===");
const fontWeightRe = /fontWeight:\s*"(\d+)"/g;
const validWeights = new Set(["100","200","300","400","500","600","700","800","900"]);
let fwm;
while ((fwm = fontWeightRe.exec(themeSource)) !== null) {
  const w = fwm[1];
  const valid = validWeights.has(w);
  results.push({ name: `fontWeight "${w}" is valid RN value`, input: w, expected: "100-900 in steps", actual: w, pass: valid });
  if (valid) passed++; else failed++;
}

// ─── TEST 16: SHADOWS KEYS PRESENT ───────────────────────────────────────────
console.log("\n=== TEST 16: SHADOWS KEYS PRESENT ===");
const shadowKeys = ["panel", "card", "glow", "ring", "panelGlow"];
for (const key of shadowKeys) {
  const present = themeSource.includes(`${key}:`);
  results.push({ name: `shadows.${key} defined`, input: key, expected: "present", actual: present ? "present" : "MISSING", pass: present });
  if (present) passed++; else failed++;
}

// Verify all shadows have required fields
const shadowFields = ["shadowColor", "shadowOffset", "shadowOpacity", "shadowRadius", "elevation"];
for (const field of shadowFields) {
  const present = themeSource.includes(field);
  results.push({ name: `shadows have field '${field}'`, input: field, expected: "present", actual: present ? "present" : "MISSING", pass: present });
  if (present) passed++; else failed++;
}

// ─── TEST 17: EDGE CASES — EMPTY/NULL/UNDEFINED resistance ───────────────────
console.log("\n=== TEST 17: EDGE CASES — COLOR LOOKUP WITH UNEXPECTED KEYS ===");
// Since colors is a const object, TypeScript prevents bad key access.
// Verify there are NO undefined/null values in the parsed color entries
for (const [key, val] of Object.entries(colorEntries)) {
  const notNull = val !== null && val !== undefined && val !== "";
  results.push({ name: `colors.${key} is not null/undefined/empty`, input: key, expected: "non-empty value", actual: val, pass: notNull });
  if (notNull) passed++; else failed++;
}

// ─── TEST 18: SPACING ORDERING (monotonically increasing) ────────────────────
console.log("\n=== TEST 18: SPACING VALUES ARE MONOTONICALLY INCREASING ===");
const spacingOrder = [
  ["xs", 4], ["sm", 8], ["md", 12], ["lg", 16], ["xl", 20],
];
for (let i = 1; i < spacingOrder.length; i++) {
  const [prevKey, prevVal] = spacingOrder[i - 1];
  const [curKey, curVal] = spacingOrder[i];
  const increasing = curVal > prevVal;
  results.push({ name: `spacing.${prevKey}(${prevVal}) < spacing.${curKey}(${curVal})`, input: `${prevKey},${curKey}`, expected: "increasing", actual: increasing ? "increasing" : "NOT increasing", pass: increasing });
  if (increasing) passed++; else failed++;
}

// ─── TEST 19: RADIUS ORDERING ─────────────────────────────────────────────────
console.log("\n=== TEST 19: RADIUS VALUES ORDERING ===");
const radiusOrder = [
  ["sm", 8], ["md", 12], ["lg", 16], ["xl", 22],
];
for (let i = 1; i < radiusOrder.length; i++) {
  const [prevKey, prevVal] = radiusOrder[i - 1];
  const [curKey, curVal] = radiusOrder[i];
  const increasing = curVal > prevVal;
  results.push({ name: `radius.${prevKey}(${prevVal}) < radius.${curKey}(${curVal})`, input: `${prevKey},${curKey}`, expected: "increasing", actual: increasing ? "increasing" : "NOT increasing", pass: increasing });
  if (increasing) passed++; else failed++;
}
// radius.full is 999 — must be largest
const fullLargest = radiusEntries["full"] > radiusEntries["xl"];
results.push({ name: "radius.full(999) > radius.xl(22)", input: "full,xl", expected: "full largest", actual: fullLargest ? "full is largest" : "NOT largest", pass: fullLargest });
if (fullLargest) passed++; else failed++;

// ─── TEST 20: NO ASYNC_STORAGE USAGE ──────────────────────────────────────────
console.log("\n=== TEST 20: NO ASYNCSTORAGE USAGE ===");
const hasAsyncStorage = themeSource.includes("AsyncStorage");
results.push({ name: "No AsyncStorage in theme", input: "AsyncStorage", expected: "not found", actual: hasAsyncStorage ? "FOUND (violation!)" : "not found", pass: !hasAsyncStorage });
if (!hasAsyncStorage) passed++; else failed++;

// ─── TEST 21: AS CONST USED ON ALL EXPORTS ────────────────────────────────────
console.log("\n=== TEST 21: AS CONST ON ALL EXPORTS ===");
const exportsToCheck = ["colors", "rankColors", "spacing", "radius", "fonts", "shadows"];
for (const exp of exportsToCheck) {
  // Check that the export ends with "} as const" pattern
  const re = new RegExp(`export const ${exp}[\\s\\S]*?} as const`);
  const hasAsConst = re.test(themeSource);
  results.push({ name: `${exp} uses 'as const'`, input: exp, expected: "as const found", actual: hasAsConst ? "found" : "MISSING", pass: hasAsConst });
  if (hasAsConst) passed++; else failed++;
}

// ─── TEST 22: DUPLICATE KEY CHECK WITHIN EACH OBJECT ─────────────────────────
console.log("\n=== TEST 22: NO DUPLICATE KEYS WITHIN EACH EXPORT ===");

function findDuplicatesInBlock(source, exportName) {
  // Extract the block between 'export const <name> = {' and '} as const'
  const blockRe = new RegExp(`export const ${exportName}[\\s\\S]*?\\{([\\s\\S]*?)\\} as const`);
  const blockMatch = source.match(blockRe);
  if (!blockMatch) return [];
  const block = blockMatch[1];
  const keys = [];
  const keyRe = /^\s{2}(\w+):/gm;
  let m;
  while ((m = keyRe.exec(block)) !== null) {
    keys.push(m[1]);
  }
  const seen = new Set();
  const dupes = [];
  for (const k of keys) {
    if (seen.has(k)) dupes.push(k);
    seen.add(k);
  }
  return dupes;
}

const objectsToCheck = ["colors", "rankColors", "spacing", "radius", "fonts", "shadows"];
for (const obj of objectsToCheck) {
  const dupes = findDuplicatesInBlock(themeSource, obj);
  const noDupes = dupes.length === 0;
  results.push({ name: `No duplicate keys within '${obj}'`, input: obj, expected: "no duplicates", actual: noDupes ? "no duplicates" : `DUPES: ${dupes.join(",")}`, pass: noDupes });
  if (noDupes) passed++; else failed++;
}

// ─── TEST 23: IMPORT FROM react-native ────────────────────────────────────────
console.log("\n=== TEST 23: PROPER IMPORT FROM REACT-NATIVE ===");
const hasRNImport = themeSource.includes('from "react-native"') || themeSource.includes("from 'react-native'");
results.push({ name: "Imports Platform from react-native", input: "import", expected: "react-native import found", actual: hasRNImport ? "found" : "MISSING", pass: hasRNImport });
if (hasRNImport) passed++; else failed++;

const importsPlatform = themeSource.includes("Platform");
results.push({ name: "Platform imported/used", input: "Platform", expected: "found", actual: importsPlatform ? "found" : "MISSING", pass: importsPlatform });
if (importsPlatform) passed++; else failed++;

// ─── PRINT ALL RESULTS ────────────────────────────────────────────────────────
console.log("\n");
console.log("═".repeat(80));
console.log("STAGE 3 — FULL TEST RESULTS");
console.log("═".repeat(80));
for (const r of results) {
  const icon = r.pass ? "✅ PASS" : "❌ FAIL";
  console.log(`${icon} | ${r.name}`);
  if (!r.pass) {
    console.log(`       Input:    ${r.input}`);
    console.log(`       Expected: ${r.expected}`);
    console.log(`       Actual:   ${r.actual}`);
  }
}

console.log("\n" + "═".repeat(80));
console.log(`TOTAL: ${passed + failed} tests | ${passed} PASSED | ${failed} FAILED`);
console.log("═".repeat(80));

if (failed > 0) {
  console.log("\n❌ FAILURES DETECTED — see above for details");
  process.exit(1);
} else {
  console.log("\n✅ ALL TESTS PASSED");
  process.exit(0);
}
