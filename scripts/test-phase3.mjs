/**
 * Phase 3 — Core UI Components Test Script
 * Tests Panel, SectionHeader, PageHeader, MetricValue via source analysis + Node execution
 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");

const panelSrc = read("components/Panel.tsx");
const sectionSrc = read("components/SectionHeader.tsx");
const pageSrc = read("components/PageHeader.tsx");
const metricSrc = read("components/MetricValue.tsx");
const indexSrc = read("components/index.ts");
const themeSrc = read("theme.ts");

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
  results.push({ name, expected: `contains "${pattern.substring(0, 60)}"`, actual: found ? "found" : "NOT FOUND", pass: found });
  if (found) passed++; else failed++;
}

function testRegex(name, source, regex) {
  const found = regex.test(source);
  results.push({ name, expected: `matches ${regex}`, actual: found ? "matched" : "NOT matched", pass: found });
  if (found) passed++; else failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BARREL EXPORT TESTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== BARREL EXPORT (index.ts) ===");
testIncludes("index exports Panel", indexSrc, 'export { Panel } from "./Panel"');
testIncludes("index exports SectionHeader", indexSrc, 'export { SectionHeader } from "./SectionHeader"');
testIncludes("index exports PageHeader", indexSrc, 'export { PageHeader } from "./PageHeader"');
testIncludes("index exports MetricValue", indexSrc, 'export { MetricValue } from "./MetricValue"');

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== PANEL: PROPS ===");
testIncludes("Panel has children prop", panelSrc, "children: React.ReactNode");
testIncludes("Panel has onPress optional prop", panelSrc, "onPress?: () => void");
testIncludes("Panel has style prop (ViewStyle)", panelSrc, "style?: ViewStyle");
testIncludes("Panel has glowColor optional prop", panelSrc, "glowColor?: string");
testIncludes("Panel has tone optional prop", panelSrc, 'tone?: PanelTone');
testIncludes("Panel has delay optional prop", panelSrc, "delay?: number");

console.log("\n=== PANEL: DEFAULTS ===");
testIncludes("Panel default glowColor = gold", panelSrc, 'glowColor = "rgba(251,191,36,0.14)"');
testIncludes("Panel default tone = default", panelSrc, 'tone = "default"');
testIncludes("Panel default delay = 0", panelSrc, "delay = 0");

console.log("\n=== PANEL: TONE BACKGROUNDS ===");
testIncludes("Panel default bg = colors.surface", panelSrc, "default: colors.surface");
testIncludes("Panel hero bg = colors.surfaceHero", panelSrc, "hero: colors.surfaceHero");
testIncludes("Panel subtle bg = rgba(0,0,0,0.6)", panelSrc, 'subtle: "rgba(0,0,0,0.6)"');

console.log("\n=== PANEL: STYLES ===");
testIncludes("Panel borderWidth 1", panelSrc, "borderWidth: 1");
testIncludes("Panel borderColor = panelBorder", panelSrc, "borderColor: colors.panelBorder");
testIncludes("Panel borderRadius = radius.xl (22)", panelSrc, "borderRadius: radius.xl");
testIncludes("Panel padding = spacing.xl (20)", panelSrc, "padding: spacing.xl");
testIncludes("Panel overflow hidden", panelSrc, 'overflow: "hidden"');

console.log("\n=== PANEL: GLOW LINE ===");
testIncludes("Panel uses LinearGradient", panelSrc, "LinearGradient");
testIncludes("Panel glow line height 1", panelSrc, "height: 1");
testIncludes("Panel glow positioned absolute top", panelSrc, 'position: "absolute"');
testIncludes("Panel glow top: 0", panelSrc, "top: 0");
testIncludes("Panel glow uses transparent-glowColor-transparent", panelSrc, '["transparent", glowColor, "transparent"]');
testIncludes("Panel glow shimmer animates translateX", panelSrc, "glowTranslateX");

console.log("\n=== PANEL: GLOW ANIMATION SPEC ===");
testIncludes("Panel glow starts at -12", panelSrc, "new Animated.Value(-12)");
testIncludes("Panel glow animates to 12", panelSrc, "toValue: 12");
testIncludes("Panel glow animates to -12", panelSrc, "toValue: -12");
testIncludes("Panel glow 3000ms each direction (6s total)", panelSrc, "duration: 3000");
testIncludes("Panel glow loops", panelSrc, "Animated.loop");

console.log("\n=== PANEL: ENTRANCE ANIMATION ===");
testIncludes("Panel fade starts at 0", panelSrc, "new Animated.Value(0)");
testIncludes("Panel translateY starts at 12", panelSrc, "new Animated.Value(12)");
testIncludes("Panel entrance fade to 1", panelSrc, "toValue: 1");
testIncludes("Panel entrance translateY to 0", panelSrc, "toValue: 0");
testIncludes("Panel entrance 500ms", panelSrc, "duration: 500");
testIncludes("Panel uses delay via setTimeout", panelSrc, "setTimeout");
testIncludes("Panel clears timeout on unmount", panelSrc, "clearTimeout");

console.log("\n=== PANEL: PRESS ANIMATION ===");
testIncludes("Panel press scale 0.97", panelSrc, "toValue: 0.97");
testIncludes("Panel press scale restore 1", panelSrc, "toValue: 1");
testIncludes("Panel haptic on press", panelSrc, "Haptics.impactAsync");
testIncludes("Panel haptic style Light", panelSrc, "ImpactFeedbackStyle.Light");
testIncludes("Panel uses Pressable for onPress", panelSrc, "Pressable");
testIncludes("Panel conditionally wraps in Pressable", panelSrc, "if (onPress)");

console.log("\n=== PANEL: SHADOWS ===");
testIncludes("Panel uses shadows.panel", panelSrc, "shadows.panel");

console.log("\n=== PANEL: IMPORTS ===");
testIncludes("Panel imports from theme", panelSrc, 'from "../theme"');
testIncludes("Panel imports colors", panelSrc, "colors");
testIncludes("Panel imports radius", panelSrc, "radius");
testIncludes("Panel imports spacing", panelSrc, "spacing");
testIncludes("Panel imports shadows", panelSrc, "shadows");
testIncludes("Panel imports LinearGradient from expo", panelSrc, 'from "expo-linear-gradient"');
testIncludes("Panel imports Haptics from expo", panelSrc, 'from "expo-haptics"');

console.log("\n=== PANEL: EXPORT ===");
testIncludes("Panel is named export", panelSrc, "export function Panel");

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION HEADER TESTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== SECTIONHEADER: PROPS ===");
testIncludes("SH has title string prop", sectionSrc, "title: string");
testIncludes("SH has right optional string prop", sectionSrc, "right?: string");

console.log("\n=== SECTIONHEADER: ACCENT LINE ===");
testIncludes("SH accent line width 2", sectionSrc, "width: 2");
testIncludes("SH accent line height 12", sectionSrc, "height: 12");
testIncludes("SH accent line gold 0.3 opacity", sectionSrc, 'backgroundColor: "rgba(251,191,36,0.3)"');

console.log("\n=== SECTIONHEADER: TITLE STYLES ===");
testIncludes("SH title fontSize from kicker (10)", sectionSrc, "fontSize: fonts.kicker.fontSize");
testIncludes("SH title fontWeight from kicker (700)", sectionSrc, "fontWeight: fonts.kicker.fontWeight");
testIncludes("SH title color from kicker", sectionSrc, "color: fonts.kicker.color");
testIncludes("SH title uppercase", sectionSrc, 'textTransform: "uppercase"');
testIncludes("SH title letterSpacing from kicker (3)", sectionSrc, "letterSpacing: fonts.kicker.letterSpacing");
testIncludes("SH title calls toUpperCase", sectionSrc, "title.toUpperCase()");

console.log("\n=== SECTIONHEADER: RIGHT TEXT ===");
testIncludes("SH right text color muted", sectionSrc, "color: colors.textMuted");
testIncludes("SH right conditionally rendered", sectionSrc, "right !== undefined");

console.log("\n=== SECTIONHEADER: LAYOUT ===");
testIncludes("SH row layout", sectionSrc, 'flexDirection: "row"');
testIncludes("SH center aligned", sectionSrc, 'alignItems: "center"');
testIncludes("SH space-between", sectionSrc, 'justifyContent: "space-between"');
testIncludes("SH marginBottom spacing.md", sectionSrc, "marginBottom: spacing.md");

console.log("\n=== SECTIONHEADER: IMPORTS ===");
testIncludes("SH imports from theme", sectionSrc, 'from "../theme"');
testIncludes("SH imports colors", sectionSrc, "colors");
testIncludes("SH imports fonts", sectionSrc, "fonts");
testIncludes("SH imports spacing", sectionSrc, "spacing");

console.log("\n=== SECTIONHEADER: EXPORT ===");
testIncludes("SH is named export", sectionSrc, "export function SectionHeader");

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE HEADER TESTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== PAGEHEADER: PROPS ===");
testIncludes("PH has kicker optional string", pageSrc, "kicker?: string");
testIncludes("PH has title string", pageSrc, "title: string");
testIncludes("PH has subtitle optional string", pageSrc, "subtitle?: string");

console.log("\n=== PAGEHEADER: KICKER STYLES ===");
testIncludes("PH kicker fontSize from fonts.kicker (10)", pageSrc, "fontSize: fonts.kicker.fontSize");
testIncludes("PH kicker fontWeight from fonts.kicker (700)", pageSrc, "fontWeight: fonts.kicker.fontWeight");
testIncludes("PH kicker color textSecondary", pageSrc, "color: colors.textSecondary");
testIncludes("PH kicker uppercase", pageSrc, 'textTransform: "uppercase"');
testIncludes("PH kicker letterSpacing from kicker (3)", pageSrc, "letterSpacing: fonts.kicker.letterSpacing");
testIncludes("PH kicker calls toUpperCase", pageSrc, "kicker.toUpperCase()");
testIncludes("PH kicker marginBottom xs", pageSrc, "marginBottom: spacing.xs");

console.log("\n=== PAGEHEADER: TITLE STYLES ===");
testIncludes("PH title fontSize 30", pageSrc, "fontSize: 30");
testIncludes("PH title fontWeight 800", pageSrc, 'fontWeight: "800"');
testIncludes("PH title letterSpacing -0.5", pageSrc, "letterSpacing: -0.5");
testIncludes("PH title color text", pageSrc, "color: colors.text");
testIncludes("PH title uppercase", pageSrc, 'textTransform: "uppercase"');
testIncludes("PH title calls toUpperCase", pageSrc, "title.toUpperCase()");

console.log("\n=== PAGEHEADER: SUBTITLE STYLES ===");
testIncludes("PH subtitle fontSize 14", pageSrc, "fontSize: 14");
testIncludes("PH subtitle fontWeight 400", pageSrc, 'fontWeight: "400"');
testIncludes("PH subtitle color textMuted", pageSrc, "color: colors.textMuted");
testIncludes("PH subtitle marginTop xs", pageSrc, "marginTop: spacing.xs");

console.log("\n=== PAGEHEADER: CONDITIONAL RENDERING ===");
testIncludes("PH kicker conditionally rendered", pageSrc, "kicker !== undefined");
testIncludes("PH subtitle conditionally rendered", pageSrc, "subtitle !== undefined");

console.log("\n=== PAGEHEADER: LAYOUT ===");
testIncludes("PH container marginBottom lg", pageSrc, "marginBottom: spacing.lg");

console.log("\n=== PAGEHEADER: EXPORT ===");
testIncludes("PH is named export", pageSrc, "export function PageHeader");

// ═══════════════════════════════════════════════════════════════════════════════
// METRIC VALUE TESTS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== METRICVALUE: PROPS ===");
testIncludes("MV has label string prop", metricSrc, "label: string");
testIncludes("MV has value number prop", metricSrc, "value: number");
testIncludes("MV has size optional prop", metricSrc, "size?: MetricSize");
testIncludes("MV has color optional string prop", metricSrc, "color?: string");
testIncludes("MV has animated optional bool prop", metricSrc, "animated?: boolean");

console.log("\n=== METRICVALUE: DEFAULTS ===");
testIncludes("MV default size = md", metricSrc, 'size = "md"');
testIncludes("MV default color = colors.text", metricSrc, "color = colors.text");
testIncludes("MV default animated = false", metricSrc, "animated = false");

console.log("\n=== METRICVALUE: SIZE MAP ===");
testIncludes("MV sm = 18", metricSrc, "sm: 18");
testIncludes("MV md = 24", metricSrc, "md: 24");
testIncludes("MV lg = 32", metricSrc, "lg: 32");
testIncludes("MV hero = 48", metricSrc, "hero: 48");

console.log("\n=== METRICVALUE: WEIGHT MAP ===");
// hero uses 300, others use 800
testRegex("MV hero weight 300", metricSrc, /hero:\s*"300"/);
testRegex("MV sm weight 800", metricSrc, /sm:\s*"800"/);
testRegex("MV md weight 800", metricSrc, /md:\s*"800"/);
testRegex("MV lg weight 800", metricSrc, /lg:\s*"800"/);

console.log("\n=== METRICVALUE: MONO FONT ===");
testIncludes("MV uses Platform.select for monoFont", metricSrc, "Platform.select");
testIncludes("MV ios = Menlo", metricSrc, '"Menlo"');
testIncludes("MV android = monospace", metricSrc, '"monospace"');
testIncludes("MV fontFamily monoFont", metricSrc, "fontFamily: monoFont");
testIncludes("MV tabular-nums", metricSrc, '"tabular-nums"');

console.log("\n=== METRICVALUE: ANIMATION ===");
testIncludes("MV animated counts from 0", metricSrc, "new Animated.Value(0)");
testIncludes("MV animation 800ms", metricSrc, "duration: 800");
testIncludes("MV useNativeDriver false (for value animation)", metricSrc, "useNativeDriver: false");
testIncludes("MV rounds animated value", metricSrc, "Math.round");
testIncludes("MV removes listener on cleanup", metricSrc, "removeListener");

console.log("\n=== METRICVALUE: NaN/INFINITY GUARD ===");
testIncludes("MV checks Number.isFinite", metricSrc, "Number.isFinite");
testIncludes("MV shows -- for non-finite", metricSrc, '"--"');

console.log("\n=== METRICVALUE: LABEL ===");
testIncludes("MV label fontSize 12", metricSrc, "fontSize: 12");
testIncludes("MV label color textSecondary", metricSrc, "color: colors.textSecondary");

console.log("\n=== METRICVALUE: LAYOUT ===");
testIncludes("MV container center aligned", metricSrc, 'alignItems: "center"');

console.log("\n=== METRICVALUE: EXPORT ===");
testIncludes("MV is named export", metricSrc, "export function MetricValue");

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASE CHECKS (Source-Level)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== EDGE: NULL/UNDEFINED GUARDS ===");
testIncludes("SH right guarded for undefined", sectionSrc, "right !== undefined && right !== null");
testIncludes("PH kicker guarded for undefined", pageSrc, "kicker !== undefined && kicker !== null");
testIncludes("PH subtitle guarded for undefined", pageSrc, "subtitle !== undefined && subtitle !== null");
testIncludes("MV NaN guard on animated value", metricSrc, "Number.isFinite(value)");
testIncludes("MV NaN guard on display", metricSrc, "Number.isFinite(displayValue)");

console.log("\n=== EDGE: PANEL WITHOUT ONPRESS ===");
// Panel should NOT wrap in Pressable when onPress is undefined
testIncludes("Panel skips Pressable when no onPress", panelSrc, "if (onPress)");

console.log("\n=== EDGE: CLEANUP ===");
testIncludes("Panel clears timeout on unmount", panelSrc, "clearTimeout(entranceTimeout)");
testIncludes("Panel stops glow animation on unmount", panelSrc, "glowLoop.stop()");
testIncludes("MV removes animated listener on unmount", metricSrc, "animatedValue.removeListener");

console.log("\n=== EDGE: METRIC VALUE ZERO ===");
testIncludes("MV handles value 0 (skips animation for 0)", metricSrc, "value === 0");

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-REFERENCE: THEME TOKENS USED CORRECTLY
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== CROSS-REF: ALL COMPONENTS IMPORT FROM THEME ===");
const allSources = [panelSrc, sectionSrc, pageSrc, metricSrc];
const componentNames = ["Panel", "SectionHeader", "PageHeader", "MetricValue"];
for (let i = 0; i < allSources.length; i++) {
  testIncludes(`${componentNames[i]} imports from ../theme`, allSources[i], 'from "../theme"');
}

console.log("\n=== CROSS-REF: NO HARDCODED COLOR VALUES IN COMPONENTS ===");
// Check that components reference theme tokens, not hardcoded color strings
// Exception: Panel's gold glow default and SectionHeader's gold accent are the spec overrides
const panelHardcoded = (panelSrc.match(/#[0-9a-fA-F]{6}/g) || []).filter(c => c !== "#FBBF24");
testTrue("Panel has no unexpected hardcoded hex colors (only gold allowed)", panelHardcoded.length === 0);

// SectionHeader: only the gold accent line should be hardcoded
const shHardcoded = (sectionSrc.match(/#[0-9a-fA-F]{6}/g) || []);
testTrue("SH has no hardcoded hex colors (rgba only for accent)", shHardcoded.length === 0);

// PageHeader should reference theme tokens only
const phHardcoded = (pageSrc.match(/#[0-9a-fA-F]{6}/g) || []);
testTrue("PH has no hardcoded hex colors", phHardcoded.length === 0);

// MetricValue should reference theme tokens only
const mvHardcoded = (metricSrc.match(/#[0-9a-fA-F]{6}/g) || []);
testTrue("MV has no hardcoded hex colors", mvHardcoded.length === 0);

console.log("\n=== CROSS-REF: NO ASYNCSTORAGE IN COMPONENTS ===");
for (let i = 0; i < allSources.length; i++) {
  const has = allSources[i].includes("AsyncStorage");
  results.push({ name: `${componentNames[i]} has no AsyncStorage`, expected: "not found", actual: has ? "FOUND" : "not found", pass: !has });
  if (!has) passed++; else failed++;
}

console.log("\n=== CROSS-REF: ALL COMPONENTS USE STYLESHEET.CREATE ===");
for (let i = 0; i < allSources.length; i++) {
  testIncludes(`${componentNames[i]} uses StyleSheet.create`, allSources[i], "StyleSheet.create");
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPESCRIPT TYPE SAFETY CHECKS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== TYPE SAFETY: TONE TYPE ===");
testIncludes("Panel defines PanelTone union type", panelSrc, '"default" | "hero" | "subtle"');
testIncludes("Panel TONE_BG maps all tones", panelSrc, "TONE_BG: Record<PanelTone, string>");

console.log("\n=== TYPE SAFETY: METRIC SIZE TYPE ===");
testIncludes("MV defines MetricSize type", metricSrc, '"sm" | "md" | "lg" | "hero"');
testIncludes("MV SIZE_MAP covers all sizes", metricSrc, "SIZE_MAP: Record<MetricSize, number>");

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
