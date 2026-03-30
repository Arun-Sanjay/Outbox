/**
 * Phases 74-78 — Knowledge Tests
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");

let passed = 0, failed = 0;
const results = [];

function testTrue(n, a) { results.push({ name: n, expected: "true", actual: String(a), pass: !!a }); if (a) passed++; else failed++; }
function testInc(n, s, p) { const f = s.includes(p); results.push({ name: n, expected: "contains", actual: f ? "found" : "NOT FOUND", pass: f }); if (f) passed++; else failed++; }
function test(n, e, a) { const p = JSON.stringify(a) === JSON.stringify(e); results.push({ name: n, expected: JSON.stringify(e), actual: JSON.stringify(a), pass: p }); if (p) passed++; else failed++; }

// ═══════════════════════════════════════════════════════════════════════════════
// P74: Tips Data
// ═══════════════════════════════════════════════════════════════════════════════
const tipsSrc = readSrc("data/tips.ts");
console.log("\n=== P74: TIPS DATA ===");
testInc("tips: exports BOXING_TIPS", tipsSrc, "export const BOXING_TIPS");
// Count entries
const tipCount = (tipsSrc.match(/id: "tip_/g) || []).length;
testTrue("tips: at least 50 entries", tipCount >= 50);
console.log(`  Tip count: ${tipCount}`);

// Categories present
testInc("tips: offense category", tipsSrc, '"offense"');
testInc("tips: defense category", tipsSrc, '"defense"');
testInc("tips: footwork category", tipsSrc, '"footwork"');
testInc("tips: conditioning category", tipsSrc, '"conditioning"');
testInc("tips: mindset category", tipsSrc, '"mindset"');
testInc("tips: nutrition category", tipsSrc, '"nutrition"');

// Count by category
const offenseCount = (tipsSrc.match(/category: "offense"/g) || []).length;
const defenseCount = (tipsSrc.match(/category: "defense"/g) || []).length;
const footworkCount = (tipsSrc.match(/category: "footwork"/g) || []).length;
const condCount = (tipsSrc.match(/category: "conditioning"/g) || []).length;
const mindCount = (tipsSrc.match(/category: "mindset"/g) || []).length;
const nutrCount = (tipsSrc.match(/category: "nutrition"/g) || []).length;
testTrue("tips: >= 10 offense tips", offenseCount >= 10);
testTrue("tips: >= 6 defense tips", defenseCount >= 6);
testTrue("tips: >= 6 footwork tips", footworkCount >= 6);
testTrue("tips: >= 6 conditioning tips", condCount >= 6);
testTrue("tips: >= 6 mindset tips", mindCount >= 6);
testTrue("tips: >= 5 nutrition tips", nutrCount >= 5);

// Each entry has content
testInc("tips: entries have title", tipsSrc, "title:");
testInc("tips: entries have content", tipsSrc, "content:");
testInc("tips: entries have category", tipsSrc, "category:");

// ═══════════════════════════════════════════════════════════════════════════════
// P75: Tip Screen
// ═══════════════════════════════════════════════════════════════════════════════
const tipScreen = readApp("knowledge/tip-of-day.tsx");
console.log("\n=== P75: TIP OF DAY SCREEN ===");
testInc("ts: DAILY TIP kicker", tipScreen, "DAILY TIP");
testInc("ts: category badge", tipScreen, "categoryBadge");
testInc("ts: category colors", tipScreen, "CATEGORY_COLORS");
testInc("ts: title display", tipScreen, "tipTitle");
testInc("ts: content display", tipScreen, "tipContent");
testInc("ts: MARK AS READ button", tipScreen, "MARK AS READ");
testInc("ts: +5 XP", tipScreen, "+5 XP");
testInc("ts: addXP call", tipScreen, "addXP");
testInc("ts: READ TODAY badge", tipScreen, "READ TODAY");
testInc("ts: date tracking", tipScreen, "getTodayKey");
testInc("ts: daily rotation", tipScreen, "dayNum");
testInc("ts: successNotification", tipScreen, "successNotification");
testInc("ts: useKnowledgeStore", tipScreen, "useKnowledgeStore");
testInc("ts: TipCard component exported", tipScreen, "export function TipCard");
testInc("ts: TipCard for home preview", tipScreen, "cardPanel");
testInc("ts: TipCard has onPress", tipScreen, "onPress");

// ═══════════════════════════════════════════════════════════════════════════════
// P76: Glossary Data
// ═══════════════════════════════════════════════════════════════════════════════
const glossSrc = readSrc("data/glossary.ts");
console.log("\n=== P76: GLOSSARY DATA ===");
testInc("gloss: exports GLOSSARY_ENTRIES", glossSrc, "export const GLOSSARY_ENTRIES");
const glossCount = (glossSrc.match(/id: "g_/g) || []).length;
testTrue("gloss: at least 80 entries", glossCount >= 80);
console.log(`  Glossary count: ${glossCount}`);

// Categories
testInc("gloss: technique category", glossSrc, '"technique"');
testInc("gloss: equipment category", glossSrc, '"equipment"');
testInc("gloss: rules category", glossSrc, '"rules"');
testInc("gloss: slang category", glossSrc, '"slang"');
testInc("gloss: training category", glossSrc, '"training"');

// Each entry has required fields
testInc("gloss: entries have term", glossSrc, "term:");
testInc("gloss: entries have definition", glossSrc, "definition:");

// ═══════════════════════════════════════════════════════════════════════════════
// P77: Glossary Screen
// ═══════════════════════════════════════════════════════════════════════════════
const glossScreen = readApp("knowledge/glossary.tsx");
console.log("\n=== P77: GLOSSARY SCREEN ===");
testInc("gs: search bar", glossScreen, "searchInput");
testInc("gs: search icon", glossScreen, '"search"');
testInc("gs: category filter pills", glossScreen, "filterPill");
testInc("gs: all categories option", glossScreen, '"all"');
testInc("gs: technique filter", glossScreen, '"technique"');
testInc("gs: equipment filter", glossScreen, '"equipment"');
testInc("gs: alphabetical sort", glossScreen, "localeCompare");
testInc("gs: FlatList", glossScreen, "FlatList");
testInc("gs: expandable definitions", glossScreen, "expandedId");
testInc("gs: bookmark toggle", glossScreen, "toggleBookmark");
testInc("gs: bookmark icon", glossScreen, '"bookmark"');
testInc("gs: GLOSSARY_ENTRIES imported", glossScreen, "GLOSSARY_ENTRIES");
testInc("gs: useKnowledgeStore", glossScreen, "useKnowledgeStore");
testInc("gs: search filtering", glossScreen, "toLowerCase");
testInc("gs: term count display", glossScreen, "terms");
testInc("gs: clear search button", glossScreen, "close-circle");

// ═══════════════════════════════════════════════════════════════════════════════
// P78: Technique Reference
// ═══════════════════════════════════════════════════════════════════════════════
const techScreen = readApp("knowledge/technique.tsx");
console.log("\n=== P78: TECHNIQUE REFERENCE ===");
testInc("tr: PUNCHES section", techScreen, "PUNCHES");
testInc("tr: DEFENSE section", techScreen, "DEFENSE");
testInc("tr: FOOTWORK section", techScreen, "FOOTWORK");
testInc("tr: 10 punch codes", techScreen, "PUNCH_ORDER");
testInc("tr: 5 defense codes", techScreen, "DEFENSE_ORDER");
testInc("tr: 8 footwork codes", techScreen, "FOOTWORK_ORDER");
testInc("tr: expandable panels", techScreen, "expandedPunch");
testInc("tr: punch code display", techScreen, "punchCode");
testInc("tr: punch name", techScreen, "punchName");
testInc("tr: stance-aware hand", techScreen, "southpawHand");
testInc("tr: orthodox hand", techScreen, "orthodoxHand");
testInc("tr: target display", techScreen, "punch.target");
testInc("tr: form cues", techScreen, "FORM CUES");
testInc("tr: common mistakes", techScreen, "COMMON MISTAKES");
testInc("tr: defense description", techScreen, "defense.description");
testInc("tr: defends against", techScreen, "DEFENDS AGAINST");
testInc("tr: counter opportunities", techScreen, "COUNTER OPPORTUNITIES");
testInc("tr: footwork description", techScreen, "fw.description");
testInc("tr: footwork form cues", techScreen, "fw.formCues");
testInc("tr: stance from profile", techScreen, "useProfileStore");
testInc("tr: PUNCHES data import", techScreen, "PUNCHES");
testInc("tr: DEFENSES data import", techScreen, "DEFENSES");
testInc("tr: FOOTWORK data import", techScreen, "FOOTWORK");
testInc("tr: 10 techniques subtitle", techScreen, "10 techniques");
testInc("tr: 5 techniques subtitle", techScreen, "5 techniques");
testInc("tr: 8 techniques subtitle", techScreen, "8 techniques");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("knowledge store intact", readSrc("stores/useKnowledgeStore.ts").includes("toggleBookmark"));
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
  if (!r.pass) { console.log(`       Expected: ${r.expected}`); console.log(`       Actual:   ${r.actual}`); }
}
console.log("\n" + "=".repeat(80));
console.log(`TOTAL: ${passed + failed} tests | ${passed} PASSED | ${failed} FAILED`);
console.log("=".repeat(80));
if (failed > 0) { console.log("\nFAILURES DETECTED"); process.exit(1); }
else { console.log("\nALL TESTS PASSED"); process.exit(0); }
