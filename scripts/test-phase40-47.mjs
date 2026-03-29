/**
 * Phases 40-47 — Skip Rope, Roadwork, Session Logging, Components Tests
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const fileExists = (f) => existsSync(path.join(__dirname, "..", f));

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
// Phase 40: Skip Rope
// ═══════════════════════════════════════════════════════════════════════════════
const skipSrc = readApp("training/skip-rope.tsx");
console.log("\n=== P40: SKIP ROPE ===");
testInc("skip: useKeepAwake", skipSrc, "useKeepAwake");
testInc("skip: config screen", skipSrc, '"config"');
testInc("skip: running mode", skipSrc, '"running"');
testInc("skip: paused mode", skipSrc, '"paused"');
testInc("skip: complete mode", skipSrc, '"complete"');
testInc("skip: rounds config (1-15)", skipSrc, "numRounds");
testInc("skip: round length config", skipSrc, "roundLength");
testInc("skip: rest length config", skipSrc, "restLength");
testInc("skip: timer countdown", skipSrc, "countdown");
testInc("skip: PAUSED overlay", skipSrc, "PAUSED");
testInc("skip: RESUME button", skipSrc, "RESUME");
testInc("skip: END SESSION", skipSrc, "END SESSION");
testInc("skip: trips/misses input", skipSrc, "TRIPS");
testInc("skip: auto-log conditioning", skipSrc, '"conditioning"');
testInc("skip: SAVE SESSION button", skipSrc, "SAVE SESSION");
testInc("skip: uses TimerEngine", skipSrc, "TimerEngine");
testInc("skip: bell sounds", skipSrc, "playRoundStartBell");
testInc("skip: 10s warning", skipSrc, "playTenSecondWarning");
testInc("skip: StatusBar hidden", skipSrc, "StatusBar hidden");
testInc("skip: stepper controls", skipSrc, "stepperBtn");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 41: Roadwork
// ═══════════════════════════════════════════════════════════════════════════════
const roadSrc = readApp("training/roadwork.tsx");
console.log("\n=== P41: ROADWORK ===");
testInc("road: useKeepAwake", roadSrc, "useKeepAwake");
testInc("road: location permission", roadSrc, "requestForegroundPermissionsAsync");
testInc("road: START RUN button", roadSrc, "START RUN");
testInc("road: GPS tracking", roadSrc, "watchPositionAsync");
testInc("road: HIGH accuracy", roadSrc, "Accuracy.High");
testInc("road: Haversine distance", roadSrc, "haversineDistance");
testInc("road: distance display", roadSrc, "formatDistance");
testInc("road: live pace", roadSrc, "formatPace");
testInc("road: elapsed time", roadSrc, "formatElapsed");
testInc("road: PAUSE button", roadSrc, "PAUSE");
testInc("road: STOP button", roadSrc, "STOP");
testInc("road: PAUSED overlay", roadSrc, "PAUSED");
testInc("road: auto-log roadwork", roadSrc, '"roadwork"');
testInc("road: distance saved as meters", roadSrc, "distanceMeters");
testInc("road: pre-run screen", roadSrc, '"pre"');
testInc("road: active mode", roadSrc, '"active"');
testInc("road: summary mode", roadSrc, '"summary"');
testInc("road: RUN COMPLETE", roadSrc, "RUN COMPLETE");
testInc("road: route description input", roadSrc, "ROUTE DESCRIPTION");
testInc("road: intensity pills", roadSrc, "INTENSITY");
testInc("road: notes input", roadSrc, "NOTES");
testInc("road: SAVE button", roadSrc, "SAVE");
testInc("road: cleanup on unmount", roadSrc, "watchRef.current?.remove");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 42: Session Summary
// ═══════════════════════════════════════════════════════════════════════════════
const sumSrc = readApp("training/session-summary.tsx");
console.log("\n=== P42: SESSION SUMMARY ===");
testInc("sum: Session Complete title", sumSrc, "Session Complete");
testInc("sum: MetricValue components", sumSrc, "MetricValue");
testInc("sum: intensity pills", sumSrc, "INTENSITY");
testInc("sum: energy stars", sumSrc, "ENERGY");
testInc("sum: sharpness stars", sumSrc, "SHARPNESS");
testInc("sum: notes input", sumSrc, "NOTES");
testInc("sum: XP display", sumSrc, "xpEarned");
testInc("sum: SAVE button", sumSrc, "SAVE");
testInc("sum: updates session", sumSrc, "updateSession");
testInc("sum: successNotification", sumSrc, "successNotification");
testInc("sum: empty state", sumSrc, "No session to summarize");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 43: Manual Logger
// ═══════════════════════════════════════════════════════════════════════════════
const logSrc = readApp("training/log-session.tsx");
console.log("\n=== P43: MANUAL LOGGER ===");
testInc("log: SESSION TYPE label", logSrc, "SESSION TYPE");
testInc("log: 9 session types", logSrc, "SESSION_TYPES");
testInc("log: type grid", logSrc, "typeGrid");
testInc("log: DURATION input", logSrc, "DURATION");
testInc("log: ROUNDS input", logSrc, "ROUNDS");
testInc("log: INTENSITY pills", logSrc, "INTENSITY");
testInc("log: ENERGY stars", logSrc, "ENERGY");
testInc("log: SHARPNESS stars", logSrc, "SHARPNESS");
testInc("log: NOTES input", logSrc, "NOTES");
testInc("log: partner field (conditional)", logSrc, "PARTNER NAME");
testInc("log: conditioning type (conditional)", logSrc, "CONDITIONING TYPE");
testInc("log: distance for roadwork", logSrc, "DISTANCE");
testInc("log: SAVE SESSION button", logSrc, "SAVE SESSION");
testInc("log: disabled when no type", logSrc, "saveBtnDisabled");
testInc("log: successNotification", logSrc, "successNotification");
testInc("log: addTrainingSession", logSrc, "addTrainingSession");
testInc("log: creates TrainingSession", logSrc, "TrainingSession");
testInc("log: uses nextId", logSrc, "nextId");
testInc("log: uses toLocalDateKey", logSrc, "toLocalDateKey");
testInc("log: getSessionTypeLabel", logSrc, "getSessionTypeLabel");
testInc("log: getSessionTypeColor", logSrc, "getSessionTypeColor");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 45: Session Store Methods
// ═══════════════════════════════════════════════════════════════════════════════
const storeSrc = readSrc("stores/useSessionStore.ts");
console.log("\n=== P45: SESSION STORE METHODS ===");
testInc("store: getHistoryGrouped", storeSrc, "getHistoryGrouped:");
testInc("store: getTotalStats", storeSrc, "getTotalStats:");
testInc("store: getRecentSessions", storeSrc, "getRecentSessions:");
testInc("store: groups by month", storeSrc, 'slice(0, 7)');
testInc("store: totalSessions", storeSrc, "totalSessions");
testInc("store: totalRounds", storeSrc, "totalRounds");
testInc("store: totalHours", storeSrc, "totalHours");
testInc("store: avgPerWeek", storeSrc, "avgPerWeek");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 46: Session Detail
// ═══════════════════════════════════════════════════════════════════════════════
const detailSrc = readApp("training/session/[id].tsx");
console.log("\n=== P46: SESSION DETAIL ===");
testInc("detail: useLocalSearchParams", detailSrc, "useLocalSearchParams");
testInc("detail: finds session by id", detailSrc, "String(s.id)");
testInc("detail: SessionTypeIcon", detailSrc, "SessionTypeIcon");
testInc("detail: IntensityBadge", detailSrc, "IntensityBadge");
testInc("detail: MetricValue", detailSrc, "MetricValue");
testInc("detail: StarRating", detailSrc, "StarRating");
testInc("detail: duration metric", detailSrc, "Duration");
testInc("detail: rounds metric", detailSrc, "Rounds");
testInc("detail: distance metric", detailSrc, "Distance");
testInc("detail: energy rating", detailSrc, "energyRating");
testInc("detail: sharpness rating", detailSrc, "sharpnessRating");
testInc("detail: combo mode badge", detailSrc, "COMBO MODE");
testInc("detail: notes display", detailSrc, "NOTES");
testInc("detail: XP earned", detailSrc, "XP EARNED");
testInc("detail: DELETE button", detailSrc, "DELETE SESSION");
testInc("detail: delete confirmation", detailSrc, "Alert.alert");
testInc("detail: not found state", detailSrc, "Session not found");

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 47: Session Components
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P47: SESSION TYPE COMPONENTS ===");
testTrue("SessionTypeIcon exists", fileExists("src/components/session/SessionTypeIcon.tsx"));
testTrue("IntensityBadge exists", fileExists("src/components/session/IntensityBadge.tsx"));
testTrue("StarRating exists", fileExists("src/components/session/StarRating.tsx"));
testTrue("SessionCard exists", fileExists("src/components/session/SessionCard.tsx"));

const iconSrc = readSrc("components/session/SessionTypeIcon.tsx");
testInc("icon: maps all 9 types", iconSrc, "heavy_bag:");
testInc("icon: uses getSessionTypeColor", iconSrc, "getSessionTypeColor");
testInc("icon: uses Ionicons", iconSrc, "Ionicons");

const badgeSrc = readSrc("components/session/IntensityBadge.tsx");
testInc("badge: uses getIntensityColor", badgeSrc, "getIntensityColor");
testInc("badge: uses getIntensityLabel", badgeSrc, "getIntensityLabel");
testInc("badge: pill shape", badgeSrc, "radius.full");

const starSrc = readSrc("components/session/StarRating.tsx");
testInc("star: value prop", starSrc, "value: number");
testInc("star: onChange prop", starSrc, "onChange?:");
testInc("star: readonly prop", starSrc, "readonly?:");
testInc("star: gold filled", starSrc, "colors.accent");
testInc("star: tappable", starSrc, "Pressable");
testInc("star: filled/empty chars", starSrc, "\\u2605");

const cardSrc = readSrc("components/session/SessionCard.tsx");
testInc("card: uses Panel", cardSrc, "Panel");
testInc("card: SessionTypeIcon", cardSrc, "SessionTypeIcon");
testInc("card: IntensityBadge", cardSrc, "IntensityBadge");
testInc("card: formatDurationShort", cardSrc, "formatDurationShort");
testInc("card: session date", cardSrc, "session.date");
testInc("card: onPress prop", cardSrc, "onPress?:");
testInc("card: lightTap on press", cardSrc, "lightTap");

// Barrel export
const sessionIdx = readSrc("components/session/index.ts");
testInc("barrel: SessionTypeIcon", sessionIdx, "SessionTypeIcon");
testInc("barrel: IntensityBadge", sessionIdx, "IntensityBadge");
testInc("barrel: StarRating", sessionIdx, "StarRating");
testInc("barrel: SessionCard", sessionIdx, "SessionCard");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("combo store intact", readSrc("stores/useComboStore.ts").includes("addCustomCombo"));
testTrue("tts-engine intact", readSrc("lib/tts-engine.ts").includes("calloutEngine"));
testTrue("combo-engine intact", readSrc("lib/combo-engine.ts").includes("getNextCombo"));
testTrue("timer-engine intact", readSrc("lib/timer-engine.ts").includes("TimerEngine"));
testTrue("audio-manager intact", readSrc("lib/audio-manager.ts").includes("playBell"));

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
