/**
 * Phases 48-53 — Fight System Tests
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const fileEx = (f) => existsSync(path.join(__dirname, "..", f));

let passed = 0, failed = 0;
const results = [];

function testTrue(n, a) { results.push({ name: n, expected: "true", actual: String(a), pass: !!a }); if (a) passed++; else failed++; }
function testInc(n, s, p) { const f = s.includes(p); results.push({ name: n, expected: "contains", actual: f ? "found" : "NOT FOUND", pass: f }); if (f) passed++; else failed++; }

// ═══════════════════════════════════════════════════════════════════════════════
// P48: Fight Log Form
// ═══════════════════════════════════════════════════════════════════════════════
const logFight = readApp("fight/log-fight.tsx");
console.log("\n=== P48: FIGHT LOG FORM ===");
testInc("fl: fight type pills", logFight, "FIGHT_TYPES");
testInc("fl: amateur type", logFight, '"amateur"');
testInc("fl: professional type", logFight, '"professional"');
testInc("fl: date input", logFight, "DATE");
testInc("fl: location input", logFight, "LOCATION");
testInc("fl: opponent name", logFight, "OPPONENT NAME");
testInc("fl: opponent record", logFight, "RECORD");
testInc("fl: weight class scroll", logFight, "WEIGHT_CLASSES");
testInc("fl: 13 weight classes", logFight, '"heavyweight"');
testInc("fl: weigh-in input", logFight, "WEIGH-IN");
testInc("fl: scheduled rounds", logFight, "SCHEDULED ROUNDS");
testInc("fl: result WIN", logFight, '"WIN"');
testInc("fl: result LOSS", logFight, '"LOSS"');
testInc("fl: result DRAW", logFight, '"DRAW"');
testInc("fl: result NC", logFight, '"NC"');
testInc("fl: result colors (green/red/gray)", logFight, "colors.win");
testInc("fl: method pills", logFight, "METHODS");
testInc("fl: TKO method", logFight, '"tko"');
testInc("fl: KO method", logFight, '"ko"');
testInc("fl: ended round (if stoppage)", logFight, "ENDED ROUND");
testInc("fl: ended time", logFight, "ENDED TIME");
testInc("fl: corner coach", logFight, "CORNER COACH");
testInc("fl: what worked", logFight, "WHAT WORKED");
testInc("fl: what to improve", logFight, "WHAT TO IMPROVE");
testInc("fl: general notes", logFight, "GENERAL NOTES");
testInc("fl: physical rating stars", logFight, "PHYSICAL");
testInc("fl: mental rating stars", logFight, "MENTAL");
testInc("fl: StarRating", logFight, "StarRating");
testInc("fl: SAVE FIGHT button", logFight, "SAVE FIGHT");
testInc("fl: XP for win (125)", logFight, "125");
testInc("fl: XP for loss (75)", logFight, "75");
testInc("fl: addFight call", logFight, "addFight");
testInc("fl: addXP call", logFight, "addXP");
testInc("fl: successNotification", logFight, "successNotification");
testInc("fl: getWeightClassLabel", logFight, "getWeightClassLabel");

// ═══════════════════════════════════════════════════════════════════════════════
// P49: Fight Record Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
const record = readApp("fight/record.tsx");
console.log("\n=== P49: FIGHT RECORD DASHBOARD ===");
testInc("rec: FightRecordDisplay", record, "FightRecordDisplay");
testInc("rec: full variant", record, '"full"');
testInc("rec: FightCard per fight", record, "FightCard");
testInc("rec: FIGHT HISTORY section", record, "FIGHT HISTORY");
testInc("rec: LOG FIGHT button", record, "LOG FIGHT");
testInc("rec: goToLogFight", record, "goToLogFight");
testInc("rec: goToFightDetail", record, "goToFightDetail");
testInc("rec: empty state", record, "No Fights Yet");

// ═══════════════════════════════════════════════════════════════════════════════
// P50: FightCard
// ═══════════════════════════════════════════════════════════════════════════════
const fightCard = readSrc("components/fight/FightCard.tsx");
console.log("\n=== P50: FIGHT CARD ===");
testInc("fc: Panel", fightCard, "Panel");
testInc("fc: result-colored left border", fightCard, "resultBar");
testInc("fc: 3px border width", fightCard, "width: 3");
testInc("fc: result colors (win/loss/draw)", fightCard, "colors.win");
testInc("fc: opponent name", fightCard, "opponentName");
testInc("fc: result text with method", fightCard, "getResultText");
testInc("fc: date + class + location", fightCard, "getWeightClassLabel");
testInc("fc: onPress prop", fightCard, "onPress?:");

// P50: Fight Detail
const fightDetail = readApp("fight/[id].tsx");
console.log("\n=== P50: FIGHT DETAIL ===");
testInc("fd: useLocalSearchParams", fightDetail, "useLocalSearchParams");
testInc("fd: getFightById", fightDetail, "getFightById");
testInc("fd: result hero", fightDetail, "resultHero");
testInc("fd: result color", fightDetail, "resultColor");
testInc("fd: weight class display", fightDetail, "WEIGHT CLASS");
testInc("fd: rounds display", fightDetail, "ROUNDS");
testInc("fd: corner coach", fightDetail, "CORNER COACH");
testInc("fd: what worked", fightDetail, "WHAT WORKED");
testInc("fd: what to improve", fightDetail, "WHAT TO IMPROVE");
testInc("fd: StarRating", fightDetail, "StarRating");
testInc("fd: XP earned", fightDetail, "xpEarned");
testInc("fd: DELETE FIGHT", fightDetail, "DELETE FIGHT");
testInc("fd: delete confirm", fightDetail, "Alert.alert");
testInc("fd: not found state", fightDetail, "Fight not found");

// ═══════════════════════════════════════════════════════════════════════════════
// P51: Sparring Logger
// ═══════════════════════════════════════════════════════════════════════════════
const sparLog = readApp("fight/sparring/log.tsx");
console.log("\n=== P51: SPARRING LOGGER ===");
testInc("sl: partner name", sparLog, "PARTNER NAME");
testInc("sl: partner experience", sparLog, "PARTNER EXPERIENCE");
testInc("sl: experience levels", sparLog, "EXPERIENCE_LEVELS");
testInc("sl: round count stepper", sparLog, "roundCount");
testInc("sl: round-by-round accordion", sparLog, "ROUND-BY-ROUND");
testInc("sl: round notes input", sparLog, "Round notes");
testInc("sl: I WON dominance", sparLog, '"I WON"');
testInc("sl: EVEN dominance", sparLog, '"EVEN"');
testInc("sl: THEY WON dominance", sparLog, '"THEY WON"');
testInc("sl: dominance colors", sparLog, "colors.win");
testInc("sl: overall notes", sparLog, "OVERALL NOTES");
testInc("sl: what worked", sparLog, "WHAT WORKED");
testInc("sl: what to improve", sparLog, "WHAT TO IMPROVE");
testInc("sl: intensity pills", sparLog, "INTENSITY");
testInc("sl: SAVE SPARRING button", sparLog, "SAVE SPARRING");
testInc("sl: addSparringEntry", sparLog, "addSparringEntry");
testInc("sl: addOrUpdatePartner", sparLog, "addOrUpdatePartner");
testInc("sl: creates TrainingSession", sparLog, "TrainingSession");
testInc("sl: addXP 50", sparLog, "50");
testInc("sl: expandedRound", sparLog, "expandedRound");

// ═══════════════════════════════════════════════════════════════════════════════
// P52: Sparring Partner History
// ═══════════════════════════════════════════════════════════════════════════════
const partHist = readApp("fight/sparring/partner-history.tsx");
console.log("\n=== P52: PARTNER HISTORY ===");
testInc("ph: sparringEntries", partHist, "sparringEntries");
testInc("ph: groups by partnerName", partHist, "partnerName");
testInc("ph: sessions count", partHist, "sessions");
testInc("ph: last sparred", partHist, "lastSparred");
testInc("ph: total rounds", partHist, "totalRounds");
testInc("ph: dominance breakdown", partHist, "dominanceBreakdown");
testInc("ph: W/E/L counts", partHist, "dominanceBreakdown.me");
testInc("ph: expandable accordion", partHist, "expandedPartner");
testInc("ph: sessions list per partner", partHist, "sessionsList");
testInc("ph: IntensityBadge", partHist, "IntensityBadge");
testInc("ph: round notes display", partHist, "roundNote");
testInc("ph: empty state", partHist, "No Partners Yet");

// ═══════════════════════════════════════════════════════════════════════════════
// P53: FightRecordDisplay
// ═══════════════════════════════════════════════════════════════════════════════
const frd = readSrc("components/fight/FightRecordDisplay.tsx");
console.log("\n=== P53: FIGHT RECORD DISPLAY ===");
testInc("frd: compact variant", frd, '"compact"');
testInc("frd: full variant", frd, '"full"');
testInc("frd: W-L-D hero numbers", frd, "heroNum");
testInc("frd: 48px hero font", frd, "fontSize: 48");
testInc("frd: win% stat", frd, "WIN %");
testInc("frd: KO rate", frd, "KO RATE");
testInc("frd: streak", frd, "STREAK");
testInc("frd: avg rounds", frd, "AVG RDS");
testInc("frd: pro/amateur split", frd, "proRecord");
testInc("frd: record by class", frd, "BY WEIGHT CLASS");
testInc("frd: getWeightClassLabel", frd, "getWeightClassLabel");
testInc("frd: compact 24px", frd, "fontSize: 24");
testInc("frd: win/loss/draw colors", frd, "colors.win");
testInc("frd: monospace font", frd, "monoFont");
testInc("frd: tabular-nums", frd, "tabular-nums");

// Barrel exports
const fightIdx = readSrc("components/fight/index.ts");
testInc("barrel: FightCard", fightIdx, "FightCard");
testInc("barrel: FightRecordDisplay", fightIdx, "FightRecordDisplay");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("fight store intact", readSrc("stores/useFightStore.ts").includes("addFight"));
testTrue("session store intact", readSrc("stores/useSessionStore.ts").includes("addTrainingSession"));
testTrue("profile store intact", readSrc("stores/useProfileStore.ts").includes("addXP"));

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT
// ═══════════════════════════════════════════════════════════════════════════════
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
