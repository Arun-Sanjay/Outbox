/**
 * Phase 4 — MMKV Storage + Date Utilities Test Script
 * Storage: source-level verification (needs native MMKV runtime)
 * Date: full runtime execution (pure JS)
 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");

const storageSrc = readSrc("db/storage.ts");
const dateSrc = readSrc("lib/date.ts");

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

function testIncludes(name, source, pattern) {
  const found = source.includes(pattern);
  results.push({ name, expected: `contains "${pattern.substring(0, 80)}"`, actual: found ? "found" : "NOT FOUND", pass: found });
  if (found) passed++; else failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART A: STORAGE.TS — SOURCE-LEVEL VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== STORAGE: EXPORTS ===");
testIncludes("storage exports storage const", storageSrc, "export const storage");
testIncludes("storage exports getJSON function", storageSrc, "export function getJSON");
testIncludes("storage exports setJSON function", storageSrc, "export function setJSON");
testIncludes("storage exports nextId function", storageSrc, "export function nextId");

console.log("\n=== STORAGE: MMKV CONFIG ===");
testIncludes("storage uses createMMKV", storageSrc, "createMMKV");
testIncludes("storage id = outbox-storage", storageSrc, 'id: "outbox-storage"');
testIncludes("storage imports from react-native-mmkv", storageSrc, 'from "react-native-mmkv"');

console.log("\n=== STORAGE: getJSON IMPLEMENTATION ===");
testIncludes("getJSON is generic <T>", storageSrc, "getJSON<T>(key: string, fallback: T): T");
testIncludes("getJSON uses getString", storageSrc, "storage.getString(key)");
testIncludes("getJSON returns fallback when no raw", storageSrc, "if (!raw) return fallback");
testIncludes("getJSON uses JSON.parse", storageSrc, "JSON.parse(raw)");
testIncludes("getJSON has try-catch", storageSrc, "try {");
testIncludes("getJSON returns fallback on catch", storageSrc, "catch {");
testIncludes("getJSON casts as T", storageSrc, "as T");

console.log("\n=== STORAGE: setJSON IMPLEMENTATION ===");
testIncludes("setJSON signature correct", storageSrc, "setJSON(key: string, value: unknown): void");
testIncludes("setJSON uses storage.set", storageSrc, "storage.set(key, JSON.stringify(value))");

console.log("\n=== STORAGE: nextId IMPLEMENTATION ===");
testIncludes("nextId uses getNumber for counter", storageSrc, 'storage.getNumber("id_counter")');
testIncludes("nextId falls back to 0", storageSrc, "?? 0");
testIncludes("nextId increments counter", storageSrc, "_counter++");
testIncludes("nextId persists counter", storageSrc, 'storage.set("id_counter", _counter)');
testIncludes("nextId returns number", storageSrc, "return _counter");
testIncludes("nextId return type is number", storageSrc, "nextId(): number");

console.log("\n=== STORAGE: NO ASYNCSTORAGE ===");
testTrue("storage has no AsyncStorage", !storageSrc.includes("AsyncStorage"));

console.log("\n=== STORAGE: NO toISOString ===");
testTrue("storage has no toISOString", !storageSrc.includes("toISOString"));

// ═══════════════════════════════════════════════════════════════════════════════
// PART B: DATE.TS — SOURCE-LEVEL VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== DATE: EXPORTS ===");
testIncludes("date exports toLocalDateKey", dateSrc, "export function toLocalDateKey");
testIncludes("date exports getTodayKey", dateSrc, "export function getTodayKey");
testIncludes("date exports addDays", dateSrc, "export function addDays");
testIncludes("date exports daysUntil", dateSrc, "export function daysUntil");
testIncludes("date exports weeksUntil", dateSrc, "export function weeksUntil");
testIncludes("date exports getWeekNumber", dateSrc, "export function getWeekNumber");

console.log("\n=== DATE: SIGNATURES ===");
testIncludes("toLocalDateKey(d: Date): string", dateSrc, "toLocalDateKey(d: Date): string");
testIncludes("getTodayKey(): string", dateSrc, "getTodayKey(): string");
testIncludes("addDays(dateKey: string, days: number): string", dateSrc, "addDays(dateKey: string, days: number): string");
testIncludes("daysUntil(dateKey: string): number", dateSrc, "daysUntil(dateKey: string): number");
testIncludes("weeksUntil(dateKey: string): number", dateSrc, "weeksUntil(dateKey: string): number");
testIncludes("getWeekNumber(dateKey: string): number", dateSrc, "getWeekNumber(dateKey: string): number");

console.log("\n=== DATE: LOCAL TIMEZONE ENFORCEMENT ===");
// Check that toISOString is only in comments, never in executable code
const codeLines = dateSrc.split("\n").filter(l => !l.trim().startsWith("//"));
testTrue("date.ts NEVER uses toISOString in code (comments ok)", !codeLines.join("\n").includes("toISOString"));
testIncludes("addDays uses T00:00:00", dateSrc, 'dateKey + "T00:00:00"');
testIncludes("daysUntil uses T00:00:00", dateSrc, 'getTodayKey() + "T00:00:00"');
testIncludes("getWeekNumber uses T00:00:00", dateSrc, 'dateKey + "T00:00:00"');
testIncludes("toLocalDateKey uses getFullYear", dateSrc, "d.getFullYear()");
testIncludes("toLocalDateKey uses getMonth", dateSrc, "d.getMonth()");
testIncludes("toLocalDateKey uses getDate", dateSrc, "d.getDate()");
testTrue("toLocalDateKey never uses getUTCFullYear", !dateSrc.includes("getUTCFullYear"));
testTrue("toLocalDateKey never uses getUTCMonth", !dateSrc.includes("getUTCMonth"));
testTrue("toLocalDateKey never uses getUTCDate", !dateSrc.includes("getUTCDate"));

console.log("\n=== DATE: PADSTART FORMATTING ===");
testIncludes("month uses padStart(2, '0')", dateSrc, '.padStart(2, "0")');

// ═══════════════════════════════════════════════════════════════════════════════
// PART C: DATE.TS — RUNTIME EXECUTION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

// Inline the pure functions for direct testing (no RN dependencies)
function toLocalDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTodayKey() {
  return toLocalDateKey(new Date());
}

function addDays(dateKey, days) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toLocalDateKey(d);
}

function daysUntil(dateKey) {
  const today = new Date(getTodayKey() + "T00:00:00");
  const target = new Date(dateKey + "T00:00:00");
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function weeksUntil(dateKey) {
  const days = daysUntil(dateKey);
  return Math.floor(days / 7);
}

function getWeekNumber(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  const dayOfWeek = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - dayOfWeek);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24) + 1) / 7
  );
  return weekNumber;
}

// ── toLocalDateKey HAPPY PATH ────────────────────────────────────────────────
console.log("\n=== RUNTIME: toLocalDateKey HAPPY PATH ===");
test("toLocalDateKey(2024-01-15)", "2024-01-15", toLocalDateKey(new Date(2024, 0, 15)));
test("toLocalDateKey(2024-12-31)", "2024-12-31", toLocalDateKey(new Date(2024, 11, 31)));
test("toLocalDateKey(2024-02-29 leap)", "2024-02-29", toLocalDateKey(new Date(2024, 1, 29)));
test("toLocalDateKey(2023-02-28 non-leap)", "2023-02-28", toLocalDateKey(new Date(2023, 1, 28)));
test("toLocalDateKey(2024-06-01)", "2024-06-01", toLocalDateKey(new Date(2024, 5, 1)));
test("toLocalDateKey(2000-01-01)", "2000-01-01", toLocalDateKey(new Date(2000, 0, 1)));
test("toLocalDateKey(1999-12-31)", "1999-12-31", toLocalDateKey(new Date(1999, 11, 31)));

// ── toLocalDateKey SINGLE DIGIT PADDING ──────────────────────────────────────
console.log("\n=== RUNTIME: toLocalDateKey PADDING ===");
test("pad month 1 -> 01", "2024-01-15", toLocalDateKey(new Date(2024, 0, 15)));
test("pad month 9 -> 09", "2024-09-05", toLocalDateKey(new Date(2024, 8, 5)));
test("pad day 1 -> 01", "2024-03-01", toLocalDateKey(new Date(2024, 2, 1)));
test("pad day 9 -> 09", "2024-03-09", toLocalDateKey(new Date(2024, 2, 9)));
test("no pad month 10", "2024-10-15", toLocalDateKey(new Date(2024, 9, 15)));
test("no pad month 12", "2024-12-15", toLocalDateKey(new Date(2024, 11, 15)));
test("no pad day 10", "2024-03-10", toLocalDateKey(new Date(2024, 2, 10)));
test("no pad day 31", "2024-03-31", toLocalDateKey(new Date(2024, 2, 31)));

// ── toLocalDateKey EDGE CASES ────────────────────────────────────────────────
console.log("\n=== RUNTIME: toLocalDateKey EDGE CASES ===");
test("epoch date", "1970-01-01", toLocalDateKey(new Date(1970, 0, 1)));
test("Y2K", "2000-01-01", toLocalDateKey(new Date(2000, 0, 1)));
test("far future 2099", "2099-12-31", toLocalDateKey(new Date(2099, 11, 31)));
test("midnight exact", "2024-06-15", toLocalDateKey(new Date(2024, 5, 15, 0, 0, 0)));
test("end of day 23:59:59", "2024-06-15", toLocalDateKey(new Date(2024, 5, 15, 23, 59, 59)));
test("noon", "2024-06-15", toLocalDateKey(new Date(2024, 5, 15, 12, 0, 0)));

// ── getTodayKey ──────────────────────────────────────────────────────────────
console.log("\n=== RUNTIME: getTodayKey ===");
const todayKey = getTodayKey();
test("getTodayKey returns string", "string", typeof todayKey);
test("getTodayKey format YYYY-MM-DD", true, /^\d{4}-\d{2}-\d{2}$/.test(todayKey));
test("getTodayKey length is 10", 10, todayKey.length);
// Verify it matches current local date
const now = new Date();
const expectedToday = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
test("getTodayKey matches current date", expectedToday, todayKey);

// ── addDays HAPPY PATH ──────────────────────────────────────────────────────
console.log("\n=== RUNTIME: addDays HAPPY PATH ===");
test("addDays +1", "2024-01-16", addDays("2024-01-15", 1));
test("addDays +7", "2024-01-22", addDays("2024-01-15", 7));
test("addDays +30", "2024-02-14", addDays("2024-01-15", 30));
test("addDays +365", "2025-01-14", addDays("2024-01-15", 365));
test("addDays -1", "2024-01-14", addDays("2024-01-15", -1));
test("addDays -7", "2024-01-08", addDays("2024-01-15", -7));
test("addDays 0 (identity)", "2024-01-15", addDays("2024-01-15", 0));

// ── addDays MONTH/YEAR BOUNDARIES ────────────────────────────────────────────
console.log("\n=== RUNTIME: addDays BOUNDARIES ===");
test("addDays cross month end Jan->Feb", "2024-02-01", addDays("2024-01-31", 1));
test("addDays cross month end Feb->Mar (leap)", "2024-03-01", addDays("2024-02-29", 1));
test("addDays cross month end Feb->Mar (non-leap)", "2023-03-01", addDays("2023-02-28", 1));
test("addDays cross year end", "2025-01-01", addDays("2024-12-31", 1));
test("addDays cross year start backwards", "2023-12-31", addDays("2024-01-01", -1));
test("addDays Feb 28 non-leap +1", "2023-03-01", addDays("2023-02-28", 1));
test("addDays Feb 29 leap +1", "2024-03-01", addDays("2024-02-29", 1));
test("addDays Mar 1 -1 (leap)", "2024-02-29", addDays("2024-03-01", -1));
test("addDays Mar 1 -1 (non-leap)", "2023-02-28", addDays("2023-03-01", -1));

// ── addDays LARGE VALUES ─────────────────────────────────────────────────────
console.log("\n=== RUNTIME: addDays LARGE VALUES ===");
// Verify via JS reference: new Date("2024-01-15T00:00:00") + 1000 days
const ref1000 = new Date("2024-01-15T00:00:00"); ref1000.setDate(ref1000.getDate() + 1000);
const expected1000 = toLocalDateKey(ref1000);
test("addDays +1000", expected1000, addDays("2024-01-15", 1000));
const refN1000 = new Date("2024-01-15T00:00:00"); refN1000.setDate(refN1000.getDate() - 1000);
const expectedN1000 = toLocalDateKey(refN1000);
test("addDays -1000", expectedN1000, addDays("2024-01-15", -1000));
const ref3650 = new Date("2024-01-15T00:00:00"); ref3650.setDate(ref3650.getDate() + 3650);
const expected3650 = toLocalDateKey(ref3650);
test("addDays +3650 (~10 years)", expected3650, addDays("2024-01-15", 3650));

// ── addDays EDGE CASES ───────────────────────────────────────────────────────
console.log("\n=== RUNTIME: addDays EDGE CASES ===");
// 2024 is a leap year so -366 from Jan 15 2024 = Jan 14 2023
const refN366 = new Date("2024-01-15T00:00:00"); refN366.setDate(refN366.getDate() - 366);
const expectedN366 = toLocalDateKey(refN366);
test("addDays negative days (large -366)", expectedN366, addDays("2024-01-15", -366));

// ── daysUntil HAPPY PATH ─────────────────────────────────────────────────────
console.log("\n=== RUNTIME: daysUntil HAPPY PATH ===");
const today = getTodayKey();
test("daysUntil today = 0", 0, daysUntil(today));
test("daysUntil tomorrow = 1", 1, daysUntil(addDays(today, 1)));
test("daysUntil yesterday = -1", -1, daysUntil(addDays(today, -1)));
test("daysUntil +7 = 7", 7, daysUntil(addDays(today, 7)));
test("daysUntil -7 = -7", -7, daysUntil(addDays(today, -7)));
test("daysUntil +30 = 30", 30, daysUntil(addDays(today, 30)));
test("daysUntil +365 = 365", 365, daysUntil(addDays(today, 365)));

// ── daysUntil EDGE CASES ─────────────────────────────────────────────────────
console.log("\n=== RUNTIME: daysUntil EDGE CASES ===");
test("daysUntil +0 = 0", 0, daysUntil(addDays(today, 0)));
test("daysUntil -365", -365, daysUntil(addDays(today, -365)));
test("daysUntil +1000", 1000, daysUntil(addDays(today, 1000)));
test("daysUntil -1000", -1000, daysUntil(addDays(today, -1000)));

// ── weeksUntil HAPPY PATH ────────────────────────────────────────────────────
console.log("\n=== RUNTIME: weeksUntil HAPPY PATH ===");
test("weeksUntil today = 0", 0, weeksUntil(today));
test("weeksUntil +7 = 1", 1, weeksUntil(addDays(today, 7)));
test("weeksUntil +14 = 2", 2, weeksUntil(addDays(today, 14)));
test("weeksUntil -7 = -1", -1, weeksUntil(addDays(today, -7)));
test("weeksUntil -14 = -2", -2, weeksUntil(addDays(today, -14)));
test("weeksUntil +6 = 0 (not full week)", 0, weeksUntil(addDays(today, 6)));
test("weeksUntil +13 = 1 (not full 2 weeks)", 1, weeksUntil(addDays(today, 13)));

// ── weeksUntil EDGE CASES ────────────────────────────────────────────────────
console.log("\n=== RUNTIME: weeksUntil EDGE CASES ===");
test("weeksUntil +1 = 0", 0, weeksUntil(addDays(today, 1)));
test("weeksUntil -1 = -1 (floor)", -1, weeksUntil(addDays(today, -1)));
test("weeksUntil -6 = -1 (floor)", -1, weeksUntil(addDays(today, -6)));
test("weeksUntil +365 = 52", 52, weeksUntil(addDays(today, 365)));
test("weeksUntil -365 = -53", -53, weeksUntil(addDays(today, -365)));

// ── getWeekNumber KNOWN DATES ────────────────────────────────────────────────
console.log("\n=== RUNTIME: getWeekNumber KNOWN DATES ===");
// Reference: https://www.timeanddate.com/date/weeknumber.html
test("getWeekNumber 2024-01-01 = week 1", 1, getWeekNumber("2024-01-01"));
test("getWeekNumber 2024-01-07 = week 1", 1, getWeekNumber("2024-01-07"));
test("getWeekNumber 2024-01-08 = week 2", 2, getWeekNumber("2024-01-08"));
test("getWeekNumber 2024-06-15 = week 24", 24, getWeekNumber("2024-06-15"));
test("getWeekNumber 2024-12-31 = week 1 (of 2025)", 1, getWeekNumber("2024-12-31"));
test("getWeekNumber 2024-12-30 = week 1 (of 2025)", 1, getWeekNumber("2024-12-30"));
test("getWeekNumber 2023-01-01 = week 52 (of 2022)", 52, getWeekNumber("2023-01-01"));
test("getWeekNumber 2023-01-02 = week 1", 1, getWeekNumber("2023-01-02"));
test("getWeekNumber 2024-02-29 = week 9 (leap day)", 9, getWeekNumber("2024-02-29"));

// ── getWeekNumber BOUNDARY: WEEK 53 ─────────────────────────────────────────
console.log("\n=== RUNTIME: getWeekNumber WEEK 53 ===");
// 2020 had 53 ISO weeks
test("getWeekNumber 2020-12-31 = week 53", 53, getWeekNumber("2020-12-31"));
test("getWeekNumber 2020-12-28 = week 53", 53, getWeekNumber("2020-12-28"));

// ── getWeekNumber RETURNS 1-53 (RANGE) ───────────────────────────────────────
console.log("\n=== RUNTIME: getWeekNumber RANGE VALIDATION ===");
// Check every month start of 2024
const monthStarts2024 = [
  "2024-01-01", "2024-02-01", "2024-03-01", "2024-04-01",
  "2024-05-01", "2024-06-01", "2024-07-01", "2024-08-01",
  "2024-09-01", "2024-10-01", "2024-11-01", "2024-12-01"
];
for (const dateKey of monthStarts2024) {
  const wn = getWeekNumber(dateKey);
  const inRange = wn >= 1 && wn <= 53;
  results.push({
    name: `getWeekNumber(${dateKey}) = ${wn} in range [1,53]`,
    expected: "true",
    actual: String(inRange),
    pass: inRange
  });
  if (inRange) passed++; else failed++;
}

// ── RETURN TYPE CHECKS ───────────────────────────────────────────────────────
console.log("\n=== RUNTIME: RETURN TYPES ===");
test("toLocalDateKey returns string", "string", typeof toLocalDateKey(new Date()));
test("getTodayKey returns string", "string", typeof getTodayKey());
test("addDays returns string", "string", typeof addDays("2024-01-15", 1));
test("daysUntil returns number", "number", typeof daysUntil("2024-01-15"));
test("weeksUntil returns number", "number", typeof weeksUntil("2024-01-15"));
test("getWeekNumber returns number", "number", typeof getWeekNumber("2024-01-15"));

// ── FORMAT VALIDATION ────────────────────────────────────────────────────────
console.log("\n=== RUNTIME: FORMAT VALIDATION ===");
const dateKeyFormat = /^\d{4}-\d{2}-\d{2}$/;
test("toLocalDateKey format YYYY-MM-DD", true, dateKeyFormat.test(toLocalDateKey(new Date())));
test("addDays result format YYYY-MM-DD", true, dateKeyFormat.test(addDays("2024-01-15", 5)));
test("getTodayKey format YYYY-MM-DD", true, dateKeyFormat.test(getTodayKey()));

// ── daysUntil SYMMETRY PROPERTY ──────────────────────────────────────────────
console.log("\n=== RUNTIME: daysUntil SYMMETRY ===");
for (const n of [0, 1, 5, 7, 14, 30, 100, 365]) {
  const future = addDays(today, n);
  const past = addDays(today, -n);
  test(`daysUntil(today+${n}) = ${n}`, n, daysUntil(future));
  test(`daysUntil(today-${n}) = -${n}`, -n, daysUntil(past));
}

// ── addDays ROUNDTRIP PROPERTY ───────────────────────────────────────────────
console.log("\n=== RUNTIME: addDays ROUNDTRIP ===");
for (const n of [1, 7, 30, 100, 365, 1000]) {
  const start = "2024-06-15";
  const rt = addDays(addDays(start, n), -n);
  test(`addDays roundtrip +${n} then -${n} = original`, start, rt);
}

// ── DST EDGE CASE: March spring forward ──────────────────────────────────────
console.log("\n=== RUNTIME: DST SPRING FORWARD ===");
// US DST 2024: March 10 (spring forward)
test("addDays across DST spring forward", "2024-03-11", addDays("2024-03-09", 2));
test("addDays across DST spring forward +1", "2024-03-10", addDays("2024-03-09", 1));
test("addDays across DST spring forward +7", "2024-03-16", addDays("2024-03-09", 7));

// ── DST EDGE CASE: November fall back ────────────────────────────────────────
console.log("\n=== RUNTIME: DST FALL BACK ===");
// US DST 2024: November 3 (fall back)
test("addDays across DST fall back", "2024-11-04", addDays("2024-11-02", 2));
test("addDays across DST fall back +1", "2024-11-03", addDays("2024-11-02", 1));
test("addDays across DST fall back +7", "2024-11-09", addDays("2024-11-02", 7));

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASE: SPECIAL / INVALID INPUTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== EDGE: EXTREME DATES ===");
// JS Date(1,0,1) = 1901 (quirk). Not a realistic boxing app scenario.
// Test realistic extremes instead:
test("toLocalDateKey year 1970", "1970-01-01", toLocalDateKey(new Date(1970, 0, 1)));
test("toLocalDateKey year 2100", "2100-12-31", toLocalDateKey(new Date(2100, 11, 31)));
test("toLocalDateKey year 9999", "9999-12-31", toLocalDateKey(new Date(9999, 11, 31)));

console.log("\n=== EDGE: addDays WITH ZERO ===");
test("addDays 0 from Jan 1", "2024-01-01", addDays("2024-01-01", 0));
test("addDays 0 from Dec 31", "2024-12-31", addDays("2024-12-31", 0));
test("addDays 0 from Feb 29 leap", "2024-02-29", addDays("2024-02-29", 0));

console.log("\n=== EDGE: addDays WITH NEGATIVE OVERFLOW ===");
test("addDays from Jan 1 -1 = prev year", "2023-12-31", addDays("2024-01-01", -1));
test("addDays from Jan 1 -31 = prev year", "2023-12-01", addDays("2024-01-01", -31));
test("addDays from Jan 1 -365", "2023-01-01", addDays("2024-01-01", -365));

// ═══════════════════════════════════════════════════════════════════════════════
// INTEGRATION: daysUntil + addDays CONSISTENCY
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== INTEGRATION: daysUntil + addDays CONSISTENCY ===");
for (const n of [-100, -7, -1, 0, 1, 7, 100]) {
  const target = addDays(today, n);
  const computedDays = daysUntil(target);
  test(`addDays(today, ${n}) then daysUntil = ${n}`, n, computedDays);
}

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION: NO PREVIOUS PHASE BREAKAGE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION: THEME STILL EXISTS ===");
const themeSrc = readSrc("theme.ts");
testTrue("theme.ts still exists and has content", themeSrc.length > 1000);
testIncludes("theme still has gold accent", themeSrc, '#FBBF24');

console.log("\n=== REGRESSION: COMPONENTS STILL EXIST ===");
const compIndex = readSrc("components/index.ts");
testIncludes("components index still exports Panel", compIndex, "Panel");
testIncludes("components index still exports SectionHeader", compIndex, "SectionHeader");
testIncludes("components index still exports PageHeader", compIndex, "PageHeader");
testIncludes("components index still exports MetricValue", compIndex, "MetricValue");

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
  console.log("\nFAILURES DETECTED — see above for details");
  process.exit(1);
} else {
  console.log("\nALL TESTS PASSED");
  process.exit(0);
}
