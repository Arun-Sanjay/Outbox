/**
 * Phases 28-35 — Fight HUD Tests
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");

let passed = 0, failed = 0;
const results = [];

function testTrue(n, a) { results.push({ name:n, expected:"true", actual:String(a), pass:!!a }); if(a) passed++; else failed++; }
function testInc(n, s, p) { const f=s.includes(p); results.push({ name:n, expected:"contains", actual:f?"found":"NOT FOUND", pass:f }); if(f) passed++; else failed++; }

const ttsSrc = readSrc("lib/tts-engine.ts");
const comboEngSrc = readSrc("lib/combo-engine.ts");
const audioSrc = readSrc("lib/audio-manager.ts");
const sessionStoreSrc = readSrc("stores/useSessionStore.ts");
const hudSrc = readApp("training/combo-session.tsx");

// ═══════════════════════════════════════════════════════════════════════════════
// P28: TTS ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P28: TTS ENGINE ===");
testInc("tts: CalloutAudioSource type", ttsSrc, "CalloutAudioSource");
testInc("tts: speak method", ttsSrc, "speak:");
testInc("tts: stop method", ttsSrc, "stop:");
testInc("tts: isSpeaking method", ttsSrc, "isSpeaking:");
testInc("tts: TTSCalloutSource class", ttsSrc, "TTSCalloutSource");
testInc("tts: uses expo-speech", ttsSrc, 'from "expo-speech"');
testInc("tts: getCalloutText export", ttsSrc, "export function getCalloutText");
testInc("tts: numbers mode one two", ttsSrc, '"one"');
testInc("tts: names mode stance-aware", ttsSrc, "getPunchName");
testInc("tts: both mode combined", ttsSrc, '"both"');
testInc("tts: body punch words", ttsSrc, '"one body"');
testInc("tts: singleton calloutEngine", ttsSrc, "export const calloutEngine");
testInc("tts: setTTSRate", ttsSrc, "export function setTTSRate");
testInc("tts: setTTSPitch", ttsSrc, "export function setTTSPitch");
testInc("tts: getElementCalloutText", ttsSrc, "export function getElementCalloutText");
testInc("tts: switch stance fallback", ttsSrc, '"orthodox"');

// ═══════════════════════════════════════════════════════════════════════════════
// P29: COMBO SEQUENCING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P29: COMBO ENGINE ===");
testInc("eng: getNextCombo export", comboEngSrc, "export function getNextCombo");
testInc("eng: getNextFootworkCall export", comboEngSrc, "export function getNextFootworkCall");
testInc("eng: getNextDefenseCall export", comboEngSrc, "export function getNextDefenseCall");
testInc("eng: getTempoDelay export", comboEngSrc, "export function getTempoDelay");
testInc("eng: estimatePunchCount export", comboEngSrc, "export function estimatePunchCount");
testInc("eng: TEMPO_RANGES slow", comboEngSrc, "slow:");
testInc("eng: TEMPO_RANGES medium", comboEngSrc, "medium:");
testInc("eng: TEMPO_RANGES fast", comboEngSrc, "fast:");
testInc("eng: tempo random picks randomly", comboEngSrc, '"random"');
testInc("eng: drill queue order", comboEngSrc, "drillQueueIds");
testInc("eng: weighted random avoids last 3", comboEngSrc, "slice(0, 3)");
testInc("eng: filter by sources", comboEngSrc, "comboSources");
testInc("eng: favorites included", comboEngSrc, "includeFavorites");
testInc("eng: defense with preamble punches", comboEngSrc, "addPreamble");
testInc("eng: 1-2 random punches", comboEngSrc, "punchCount");
testInc("eng: footwork avoids last 2", comboEngSrc, "slice(0, 2)");

// ═══════════════════════════════════════════════════════════════════════════════
// P30: SESSION STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P30: SESSION STATE MACHINE ===");
testInc("sess: startComboSession", sessionStoreSrc, "startComboSession:");
testInc("sess: completeComboSession", sessionStoreSrc, "completeComboSession:");
testInc("sess: abandonComboSession", sessionStoreSrc, "abandonComboSession:");
testInc("sess: calloutCombo", sessionStoreSrc, "calloutCombo:");
testInc("sess: updateSessionRound", sessionStoreSrc, "updateSessionRound:");
testInc("sess: updateSessionResting", sessionStoreSrc, "updateSessionResting:");
testInc("sess: updateSessionPaused", sessionStoreSrc, "updateSessionPaused:");
testInc("sess: creates ActiveComboSession", sessionStoreSrc, "ActiveComboSession");
testInc("sess: computes durationSeconds", sessionStoreSrc, "durationSeconds");
testInc("sess: creates TrainingSession on complete", sessionStoreSrc, "TrainingSession");
testInc("sess: uses toLocalDateKey", sessionStoreSrc, "toLocalDateKey");
testInc("sess: uses estimatePunchCount", sessionStoreSrc, "estimatePunchCount");
testInc("sess: persists on complete", sessionStoreSrc, "persistToMMKV");
testInc("sess: clears activeSession on complete", sessionStoreSrc, "activeSession: null");
testInc("sess: sets isSessionActive false", sessionStoreSrc, "isSessionActive: false");

// ═══════════════════════════════════════════════════════════════════════════════
// P31: FIGHT HUD TIMER
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P31: HUD TIMER ===");
testInc("hud: full-screen no StatusBar", hudSrc, "StatusBar hidden");
testInc("hud: keep-awake", hudSrc, "useKeepAwake");
testInc("hud: ROUND X/Y kicker", hudSrc, "ROUND ${currentRound}/${config.numRounds}");
testInc("hud: elapsed time mono", hudSrc, "elapsed");
testInc("hud: countdown 108px", hudSrc, "fontSize: 108");
testInc("hud: monospace font", hudSrc, "Menlo");
testInc("hud: tabular-nums", hudSrc, "tabular-nums");
testInc("hud: gold during rest", hudSrc, "colors.accent");
testInc("hud: red last 10s", hudSrc, "colors.danger");
testInc("hud: progress bar 2px", hudSrc, "height: 2");
testInc("hud: timer interval 100ms", hudSrc, "100");
testInc("hud: WARMUP kicker", hudSrc, "WARMUP");

// ═══════════════════════════════════════════════════════════════════════════════
// P32: COMBO DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P32: COMBO DISPLAY ===");
testInc("hud: current callout 32px", hudSrc, "fontSize: 32");
testInc("hud: previous callout 0.1 opacity", hudSrc, "opacity: 0.1");
testInc("hud: callout animation FadeInUp", hudSrc, "calloutTranslateY");
testInc("hud: callout opacity animation", hudSrc, "calloutOpacity");
testInc("hud: 2s initial delay", hudSrc, "2000");
testInc("hud: calls getNextCombo", hudSrc, "getNextCombo");
testInc("hud: calls getCalloutText", hudSrc, "getCalloutText");
testInc("hud: speaks via calloutEngine", hudSrc, "calloutEngine.speak");
testInc("hud: waits getTempoDelay", hudSrc, "getTempoDelay");
testInc("hud: FOOTWORK cyan color", hudSrc, "#22d3ee");
testInc("hud: DEFENSE blue color", hudSrc, "96,165,250");
testInc("hud: footwork mode check", hudSrc, "getNextFootworkCall");
testInc("hud: defense mode check", hudSrc, "getNextDefenseCall");

// ═══════════════════════════════════════════════════════════════════════════════
// P33: REST PERIODS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P33: REST PERIODS ===");
testInc("hud: REST kicker", hudSrc, "REST");
testInc("hud: breathing pulse", hudSrc, "restPulse");
testInc("hud: pulse 1.02", hudSrc, "1.02");
testInc("hud: 3-2-1 beeps", hudSrc, "playCountdownBeep");
testInc("hud: round start bell", hudSrc, "playRoundStartBell");
testInc("hud: round end bell", hudSrc, "playRoundEndBell");
testInc("hud: final bell", hudSrc, "playFinalBell");
testInc("hud: round slide-in spring", hudSrc, "Animated.spring");
testInc("hud: resume callouts after 2s", hudSrc, "2000");
testInc("hud: session complete auto-navigate", hudSrc, "goToSessionSummary");

// ═══════════════════════════════════════════════════════════════════════════════
// P34: AUDIO SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P34: AUDIO SYSTEM ===");
testInc("audio: initAudio export", audioSrc, "export async function initAudio");
testInc("audio: playBell", audioSrc, "export async function playBell");
testInc("audio: playWarning", audioSrc, "export async function playWarning");
testInc("audio: playBeep", audioSrc, "export async function playBeep");
testInc("audio: playCountdownBeep", audioSrc, "export async function playCountdownBeep");
testInc("audio: playRoundStartBell", audioSrc, "export async function playRoundStartBell");
testInc("audio: playRoundEndBell", audioSrc, "export async function playRoundEndBell");
testInc("audio: playTenSecondWarning", audioSrc, "export async function playTenSecondWarning");
testInc("audio: playFinalBell", audioSrc, "export async function playFinalBell");
testInc("audio: setMasterVolume", audioSrc, "export function setMasterVolume");
testInc("audio: setBellVolume", audioSrc, "export function setBellVolume");
testInc("audio: setCalloutVolume", audioSrc, "export function setCalloutVolume");
testInc("audio: unloadSounds", audioSrc, "export async function unloadSounds");
testInc("audio: playsInSilentModeIOS", audioSrc, "playsInSilentModeIOS: true");
testInc("audio: staysActiveInBackground", audioSrc, "staysActiveInBackground: true");
testInc("audio: uses expo-av", audioSrc, 'from "expo-av"');

// ═══════════════════════════════════════════════════════════════════════════════
// P35: PAUSE + END
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P35: PAUSE + END ===");
testInc("hud: entire screen = pause tap", hudSrc, "hudTouchable");
testInc("hud: pause overlay", hudSrc, "pauseOverlay");
testInc("hud: PAUSED text 48px", hudSrc, "fontSize: 48");
testInc("hud: RESUME gold 64px", hudSrc, "height: 64");
testInc("hud: END SESSION outlined 56px", hudSrc, "height: 56");
testInc("hud: stop TTS on pause", hudSrc, "calloutEngine.stop()");
testInc("hud: freeze timer on pause", hudSrc, "clearInterval");
testInc("hud: dark overlay 0.85", hudSrc, "rgba(0,0,0,0.85)");
testInc("hud: small End bottom-right", hudSrc, "smallEndBtn");
testInc("hud: resume adjusts timer", hudSrc, "handleResume");
testInc("hud: resume callouts after 2s", hudSrc, "scheduleNextCallout");
testInc("hud: end confirmation saves", hudSrc, "handleEndWithSave");
testInc("hud: abandon on end", hudSrc, "abandonSession");
testInc("hud: successHaptic on complete", hudSrc, "successNotification");
testInc("hud: heavyTap on bell", hudSrc, "heavyTap");

// ═══════════════════════════════════════════════════════════════════════════════
// P31: 10-SECOND WARNING
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P31: 10-SEC WARNING ===");
testInc("hud: 10s warning trigger", hudSrc, "playTenSecondWarning");
testInc("hud: tenSecondWarning config check", hudSrc, "tenSecondWarning");

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("combo store intact", readSrc("stores/useComboStore.ts").includes("addCustomCombo"));
testTrue("config screen intact", readApp("combo/config.tsx").includes("START SESSION"));

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n" + "=".repeat(80));
for (const r of results) {
  const icon = r.pass ? "PASS" : "FAIL";
  console.log(`${icon} | ${r.name}`);
  if (!r.pass) console.log(`       Expected: ${r.expected}\n       Actual:   ${r.actual}`);
}
console.log("=".repeat(80));
console.log(`TOTAL: ${passed + failed} tests | ${passed} PASSED | ${failed} FAILED`);
console.log("=".repeat(80));
if (failed > 0) { console.log("\nFAILURES DETECTED"); process.exit(1); }
else { console.log("\nALL TESTS PASSED"); process.exit(0); }
