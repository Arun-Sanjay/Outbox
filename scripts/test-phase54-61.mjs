/**
 * Phases 54-61 — Analytics Tests
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const fileEx = (f) => existsSync(path.join(__dirname, "../src", f));

let passed = 0, failed = 0;
const results = [];

function testTrue(n, a) { results.push({ name: n, expected: "true", actual: String(a), pass: !!a }); if (a) passed++; else failed++; }
function testInc(n, s, p) { const f = s.includes(p); results.push({ name: n, expected: "contains", actual: f ? "found" : "NOT FOUND", pass: f }); if (f) passed++; else failed++; }

// ═══════════════════════════════════════════════════════════════════════════════
// FILE EXISTENCE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== FILE EXISTENCE ===");
const files = [
  "components/analytics/TimeRangeToggle.tsx",
  "components/analytics/TrainingOverview.tsx",
  "components/analytics/DonutChart.tsx",
  "components/analytics/HeatMap.tsx",
  "components/analytics/TrendChart.tsx",
  "components/analytics/IntensityChart.tsx",
  "components/analytics/VolumeChart.tsx",
  "components/analytics/ComboAnalytics.tsx",
  "components/analytics/FightAnalytics.tsx",
  "components/analytics/PersonalRecords.tsx",
  "components/analytics/index.ts",
];
for (const f of files) { testTrue(`exists: ${f}`, fileEx(f)); }

// ═══════════════════════════════════════════════════════════════════════════════
// P54: TimeRangeToggle + TrainingOverview
// ═══════════════════════════════════════════════════════════════════════════════
const trt = readSrc("components/analytics/TimeRangeToggle.tsx");
console.log("\n=== P54: TIME RANGE TOGGLE ===");
testInc("trt: exports TimeRangeToggle", trt, "export function TimeRangeToggle");
testInc("trt: exports TimeRange type", trt, "export type TimeRange");
testInc("trt: week option", trt, '"WEEK"');
testInc("trt: month option", trt, '"MONTH"');
testInc("trt: all option", trt, '"ALL"');
testInc("trt: gold active pill", trt, "colors.accent");
testInc("trt: segmented control style", trt, "pillActive");
testInc("trt: lightTap haptic", trt, "lightTap");

const to = readSrc("components/analytics/TrainingOverview.tsx");
console.log("\n=== P54: TRAINING OVERVIEW ===");
testInc("to: exports TrainingOverview", to, "export function TrainingOverview");
testInc("to: range prop", to, "range: TimeRange");
testInc("to: MetricValue Sessions", to, '"Sessions"');
testInc("to: MetricValue Rounds", to, '"Rounds"');
testInc("to: MetricValue Hours", to, '"Hours"');
testInc("to: MetricValue Avg/Week", to, '"Avg/Week"');
testInc("to: animated prop", to, "animated");
testInc("to: Panel wrapper", to, "Panel");
testInc("to: filterByRange", to, "filterByRange");
testInc("to: uses useSessionStore", to, "useSessionStore");

// ══════════════════════════���════════════════════════════════════════════════════
// P55: DonutChart
// ═══════════════════════════════════════════════════════════════════════════════
const dc = readSrc("components/analytics/DonutChart.tsx");
console.log("\n=== P55: DONUT CHART ===");
testInc("dc: exports DonutChart", dc, "export function DonutChart");
testInc("dc: SVG ring", dc, "Circle");
testInc("dc: segments prop", dc, "segments: DonutSegment[]");
testInc("dc: center total", dc, "centerValue");
testInc("dc: gap between segments", dc, "GAP_DEGREES");
testInc("dc: unique gradient IDs", dc, "gradientId");
testInc("dc: LinearGradient", dc, "LinearGradient");
testInc("dc: legend dots", dc, "legendDot");
testInc("dc: legend labels + %", dc, "legendPct");
testInc("dc: strokeLinecap round", dc, "strokeLinecap");

// ════════════════════════��══════════════════════════════════════════════════════
// P56: HeatMap
// ═���═════════════════════════════════════════════════════════════════════════════
const hm = readSrc("components/analytics/HeatMap.tsx");
console.log("\n=== P56: HEAT MAP ===");
testInc("hm: exports HeatMap", hm, "export function HeatMap");
testInc("hm: 12-week default", hm, "weeks = 12");
testInc("hm: columns = weeks", hm, "columns");
testInc("hm: Mon-Sun day labels", hm, "DAY_LABELS");
testInc("hm: cell 12px", hm, "CELL_SIZE = 12");
testInc("hm: 2px gap", hm, "CELL_GAP = 2");
testInc("hm: gold intensity gradient", hm, "251,191,36");
testInc("hm: getIntensityColor", hm, "getIntensityColor");
testInc("hm: sessions by date", hm, "minutesByDate");
testInc("hm: 0 min = dark", hm, "rgba(255,255,255,0.03)");
testInc("hm: 90+ min = bright gold", hm, "0.9");

// ═════════════════════════════════════════════════════��═════════════════════════
// P57: TrendChart
// ═══════════════════════════════════════════════════════════════════════════════
const tc = readSrc("components/analytics/TrendChart.tsx");
console.log("\n=== P57: TREND CHART ===");
testInc("tc: exports TrendChart", tc, "export function TrendChart");
testInc("tc: dual-line (energy + sharpness)", tc, "energy");
testInc("tc: gold energy line", tc, "colors.accent");
testInc("tc: white sharpness line", tc, "colors.text");
testInc("tc: 1-5 Y scale", tc, "/ 4");
testInc("tc: LinearGradient", tc, "LinearGradient");
testInc("tc: unique gradient IDs", tc, "trend-energy-grad");
testInc("tc: interpretation text", tc, "getInterpretation");
testInc("tc: overtraining detection", tc, "overtraining");
testInc("tc: peaking detection", tc, "peaking");
testInc("tc: legend", tc, "Energy");
testInc("tc: SVG Path", tc, "Path");

// ════════════════════���══════════════════════════════════════════════════════════
// P58: IntensityChart
// ═══════════════════════════════════════════════════���═══════════════════════════
const ic = readSrc("components/analytics/IntensityChart.tsx");
console.log("\n=== P58: INTENSITY CHART ===");
testInc("ic: exports IntensityChart", ic, "export function IntensityChart");
testInc("ic: stacked bar", ic, "Rect");
testInc("ic: 8 weeks default", ic, "weeks = 8");
testInc("ic: intensity colors", ic, "getIntensityColor");
testInc("ic: light/moderate/hard/war", ic, "INTENSITY_ORDER");
testInc("ic: segments per week", ic, "segH");
testInc("ic: legend", ic, "legendDot");

// ═══════════════════════════════════════════════════════════════════════════════
// P59: VolumeChart + ComboAnalytics
// ��══════════════════════════════════════════════════════════════════════════════
const vc = readSrc("components/analytics/VolumeChart.tsx");
console.log("\n=== P59: VOLUME CHART ===");
testInc("vc: exports VolumeChart", vc, "export function VolumeChart");
testInc("vc: line chart (Path)", vc, "Path");
testInc("vc: weekly minutes", vc, "weeklyMinutes");
testInc("vc: gradient", vc, "LinearGradient");
testInc("vc: axis label", vc, "Training minutes per week");

const ca = readSrc("components/analytics/ComboAnalytics.tsx");
console.log("\n=== P59: COMBO ANALYTICS ===");
testInc("ca: exports ComboAnalytics", ca, "export function ComboAnalytics");
testInc("ca: total combos gold animated", ca, "colors.accent");
testInc("ca: top 5 most drilled", ca, "TOP 5 MOST DRILLED");
testInc("ca: rank numbers", ca, "topRank");
testInc("ca: count display", ca, "topCount");
testInc("ca: Panel wrapper", ca, "Panel");

// ═══════════════════════════════════════════════════════════════════════════════
// P60: FightAnalytics
// ═══════════��════════════════════════════════════��══════════════════════════════
const fa = readSrc("components/analytics/FightAnalytics.tsx");
console.log("\n=== P60: FIGHT ANALYTICS ===");
testInc("fa: exports FightAnalytics", fa, "export function FightAnalytics");
testInc("fa: fights prop", fa, "fights: Fight[]");
testInc("fa: win by method donut", fa, "WINS BY METHOD");
testInc("fa: DonutChart", fa, "DonutChart");
testInc("fa: avg fight length", fa, "avgLength");
testInc("fa: by weight class", fa, "BY WEIGHT CLASS");
testInc("fa: getWeightClassLabel", fa, "getWeightClassLabel");
testInc("fa: win/loss timeline dots", fa, "FIGHT TIMELINE");
testInc("fa: colored dots", fa, "backgroundColor: t.color");
testInc("fa: conditional (null if no fights)", fa, "return null");

// ════════════════════════════════════════════════════════���══════════════════════
// P61: PersonalRecords
// ═══════════════════════════════════════════════════════════════════════════════
const pr = readSrc("components/analytics/PersonalRecords.tsx");
console.log("\n=== P61: PERSONAL RECORDS ===");
testInc("pr: exports PersonalRecords", pr, "export function PersonalRecords");
testInc("pr: 2x3 grid", pr, "flexWrap");
testInc("pr: Longest Streak", pr, '"Longest Streak"');
testInc("pr: Most Rounds", pr, '"Most Rounds"');
testInc("pr: Most Sessions/Week", pr, '"Most Sessions/Week"');
testInc("pr: Longest Session", pr, '"Longest Session"');
testInc("pr: Most Combos", pr, '"Most Combos"');
testInc("pr: Heaviest Sparring", pr, '"Heaviest Sparring"');
testInc("pr: gold monoValue", pr, "colors.accent");
testInc("pr: monoFont", pr, "monoFont");
testInc("pr: date textMuted", pr, "colors.textMuted");
testInc("pr: Panel per record", pr, "Panel");
testInc("pr: 47% width (2 column)", pr, '47%');

// ═══════════════════════════════════════════════════════════════════════════════
// BARREL EXPORTS
// ═══════════════════════════════════════════════���═══════════════════════════════
const idx = readSrc("components/analytics/index.ts");
console.log("\n=== BARREL EXPORTS ===");
for (const exp of ["TimeRangeToggle", "TrainingOverview", "DonutChart", "HeatMap", "TrendChart", "IntensityChart", "VolumeChart", "ComboAnalytics", "FightAnalytics", "PersonalRecords"]) {
  testInc(`barrel: ${exp}`, idx, exp);
}
testInc("barrel: TimeRange type", idx, "TimeRange");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("session store intact", readSrc("stores/useSessionStore.ts").includes("getHistoryGrouped"));
testTrue("fight store intact", readSrc("stores/useFightStore.ts").includes("addFight"));
testTrue("workout-utils intact", readSrc("lib/workout-utils.ts").includes("getIntensityColor"));

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT
// ════════════════════════��══════════════════════════════════════════════════════
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
