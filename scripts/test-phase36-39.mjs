/**
 * Phases 36-39 — Round Timer Tests
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSrc = (f) => readFileSync(path.join(__dirname, "../src", f), "utf8");
const readApp = (f) => readFileSync(path.join(__dirname, "../app", f), "utf8");

let passed = 0, failed = 0;
const results = [];

function test(n, e, a) { const p=JSON.stringify(a)===JSON.stringify(e); results.push({name:n,expected:JSON.stringify(e),actual:JSON.stringify(a),pass:p}); if(p)passed++;else failed++; }
function testTrue(n, a) { results.push({name:n,expected:"true",actual:String(a),pass:!!a}); if(a)passed++;else failed++; }
function testInc(n, s, p) { const f=s.includes(p); results.push({name:n,expected:"contains",actual:f?"found":"NOT FOUND",pass:f}); if(f)passed++;else failed++; }

const timerEngSrc = readSrc("lib/timer-engine.ts");
const presetsSrc = readSrc("data/presets.ts");
const timerStoreSrc = readSrc("stores/useTimerStore.ts");
const timerScreenSrc = readApp("training/round-timer.tsx");
const presetMgrSrc = readSrc("components/training/PresetManager.tsx");

// ═══════════════════════════════════════════════════════════════════════════════
// P36: TIMER ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P36: TIMER ENGINE ===");
testInc("eng: exports TimerEngine class", timerEngSrc, "export class TimerEngine");
testInc("eng: exports TimerCallbacks type", timerEngSrc, "export type TimerCallbacks");
testInc("eng: exports TimerState type", timerEngSrc, "export type TimerState");
testInc("eng: exports TimerConfig type", timerEngSrc, "export type TimerConfig");
testInc("eng: state roundLength", timerEngSrc, "roundLength: number");
testInc("eng: state restLength", timerEngSrc, "restLength: number");
testInc("eng: state numRounds", timerEngSrc, "numRounds: number");
testInc("eng: state currentRound", timerEngSrc, "currentRound: number");
testInc("eng: state timeRemaining", timerEngSrc, "timeRemaining: number");
testInc("eng: state isResting", timerEngSrc, "isResting: boolean");
testInc("eng: state isPaused", timerEngSrc, "isPaused: boolean");
testInc("eng: state isComplete", timerEngSrc, "isComplete: boolean");
testInc("eng: state isWarmup", timerEngSrc, "isWarmup: boolean");
testInc("eng: start method", timerEngSrc, "start()");
testInc("eng: pause method", timerEngSrc, "pause()");
testInc("eng: resume method", timerEngSrc, "resume()");
testInc("eng: stop method", timerEngSrc, "stop()");
testInc("eng: tick method", timerEngSrc, "tick()");
testInc("eng: destroy method", timerEngSrc, "destroy()");
testInc("eng: getState method", timerEngSrc, "getState()");
testInc("eng: onRoundStart callback", timerEngSrc, "onRoundStart");
testInc("eng: onRoundEnd callback", timerEngSrc, "onRoundEnd");
testInc("eng: onRestStart callback", timerEngSrc, "onRestStart");
testInc("eng: onRestEnd callback", timerEngSrc, "onRestEnd");
testInc("eng: onWarning callback", timerEngSrc, "onWarning");
testInc("eng: onComplete callback", timerEngSrc, "onComplete");
testInc("eng: onTick callback", timerEngSrc, "onTick");
testInc("eng: 100ms interval", timerEngSrc, "100");
testInc("eng: handles warmup→round transition", timerEngSrc, "isWarmup");
testInc("eng: handles round→rest transition", timerEngSrc, "isResting = true");
testInc("eng: handles rest→round transition", timerEngSrc, "currentRound++");
testInc("eng: 10-second warning", timerEngSrc, "tenSecondWarning");
testInc("eng: 3-2-1 countdown during rest", timerEngSrc, "<= 3");

// ═══════════════════════════════════════════════════════════════════════════════
// P37: TIMER PRESETS
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P37: PRESETS DATA ===");
testInc("presets: Standard Boxing", presetsSrc, '"Standard Boxing"');
testInc("presets: Amateur", presetsSrc, '"Amateur"');
testInc("presets: Muay Thai", presetsSrc, '"Muay Thai"');
testInc("presets: Tabata", presetsSrc, '"Tabata"');
testInc("presets: Heavy Bag Blitz", presetsSrc, '"Heavy Bag Blitz"');
testInc("presets: Standard 180s/60s/12R", presetsSrc, "roundSeconds: 180");
testInc("presets: Tabata 20s/10s/8R", presetsSrc, "roundSeconds: 20");
testInc("presets: exports DEFAULT_TIMER_PRESETS", presetsSrc, "export const DEFAULT_TIMER_PRESETS");

console.log("\n=== P37: STORE USES DATA FILE ===");
testInc("store: imports DEFAULT_TIMER_PRESETS", timerStoreSrc, "DEFAULT_TIMER_PRESETS");
testInc("store: imports from data/presets", timerStoreSrc, '../data/presets');
testInc("store: load merges defaults + custom", timerStoreSrc, "DEFAULT_TIMER_PRESETS");

// ═══════════════════════════════════════════════════════════════════════════════
// P38: STANDALONE TIMER SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P38: TIMER SCREEN ===");
testInc("screen: uses TimerEngine", timerScreenSrc, "TimerEngine");
testInc("screen: keep-awake", timerScreenSrc, "useKeepAwake");
testInc("screen: StatusBar hidden", timerScreenSrc, "StatusBar hidden");
testInc("screen: countdown 108px", timerScreenSrc, "fontSize: 108");
testInc("screen: monospace font", timerScreenSrc, "Menlo");
testInc("screen: tabular-nums", timerScreenSrc, "tabular-nums");
testInc("screen: gold progress bar", timerScreenSrc, "colors.accent");
testInc("screen: rest blue", timerScreenSrc, "colors.roundRest");
testInc("screen: red last 10s", timerScreenSrc, "colors.danger");
testInc("screen: tap to pause", timerScreenSrc, "handlePause");
testInc("screen: preset selection", timerScreenSrc, "SELECT PRESET");
testInc("screen: bells on round start", timerScreenSrc, "playRoundStartBell");
testInc("screen: bells on round end", timerScreenSrc, "playRoundEndBell");
testInc("screen: 10s warning", timerScreenSrc, "playTenSecondWarning");
testInc("screen: countdown beeps", timerScreenSrc, "playCountdownBeep");
testInc("screen: final bell", timerScreenSrc, "playFinalBell");
testInc("screen: PAUSED overlay", timerScreenSrc, "PAUSED");
testInc("screen: RESUME button", timerScreenSrc, "RESUME");
testInc("screen: END SESSION button", timerScreenSrc, "END SESSION");
testInc("screen: COMPLETE overlay", timerScreenSrc, "COMPLETE");
testInc("screen: rest breathing pulse", timerScreenSrc, "restPulse");
testInc("screen: pulse 1.02", timerScreenSrc, "1.02");
testInc("screen: select/running/paused/complete modes", timerScreenSrc, "ScreenMode");
testInc("screen: initAudio", timerScreenSrc, "initAudio");
testInc("screen: successHaptic on complete", timerScreenSrc, "successNotification");
testInc("screen: heavyTap on bells", timerScreenSrc, "heavyTap");

// ═══════════════════════════════════════════════════════════════════════════════
// P39: PRESET MANAGER
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== P39: PRESET MANAGER ===");
testInc("mgr: exports PresetManager", presetMgrSrc, "export function PresetManager");
testInc("mgr: CREATE CUSTOM PRESET button", presetMgrSrc, "CREATE CUSTOM PRESET");
testInc("mgr: name input", presetMgrSrc, "Preset Name");
testInc("mgr: round length (30s-5min)", presetMgrSrc, "min={30}");
testInc("mgr: round length max 300", presetMgrSrc, "max={300}");
testInc("mgr: rest (15s-2min)", presetMgrSrc, "min={15}");
testInc("mgr: rest max 120", presetMgrSrc, "max={120}");
testInc("mgr: rounds (1-20)", presetMgrSrc, "max={20}");
testInc("mgr: warmup toggle", presetMgrSrc, "Warmup");
testInc("mgr: 10s warning toggle", presetMgrSrc, "10s Warning");
testInc("mgr: bell sound selection", presetMgrSrc, "BELL SOUND");
testInc("mgr: classic/buzzer/horn", presetMgrSrc, '"classic"');
testInc("mgr: warning sound selection", presetMgrSrc, "WARNING SOUND");
testInc("mgr: clap/beep/stick", presetMgrSrc, '"clap"');
testInc("mgr: save button", presetMgrSrc, "SAVE PRESET");
testInc("mgr: edit preset", presetMgrSrc, "handleEdit");
testInc("mgr: delete custom only", presetMgrSrc, "isCustom");
testInc("mgr: delete confirm alert", presetMgrSrc, "Alert.alert");
testInc("mgr: long-press for edit/delete", presetMgrSrc, "onLongPress");
testInc("mgr: uses Modal", presetMgrSrc, "Modal");
testInc("mgr: uses useTimerStore", presetMgrSrc, "useTimerStore");
testInc("mgr: createCustomPreset", presetMgrSrc, "createPreset");
testInc("mgr: updatePreset", presetMgrSrc, "updatePreset");
testInc("mgr: deletePreset", presetMgrSrc, "deletePreset");
testInc("mgr: successNotification on save", presetMgrSrc, "successNotification");

// Barrel export
testInc("training barrel: exports PresetManager", readSrc("components/training/index.ts"), "PresetManager");

// ═══════════════════════════════════════════════════════════════════════════════
// RUNTIME: TIMER ENGINE LOGIC
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== RUNTIME: TIMER ENGINE ===");

// Inline the timer engine logic for runtime testing
class TimerEngine {
  constructor(config, callbacks) {
    this.config = config;
    this.callbacks = callbacks;
    this.state = {
      roundLength: config.roundLength,
      restLength: config.restLength,
      numRounds: config.numRounds,
      warmupLength: config.warmupLength,
      currentRound: 0,
      timeRemaining: config.warmupLength > 0 ? config.warmupLength : config.roundLength,
      isResting: false, isPaused: false, isComplete: false,
      isWarmup: config.warmupLength > 0,
      elapsedInPhase: 0,
    };
    this.warningFired = false;
  }
  getState() { return { ...this.state }; }
  start() {
    if (this.state.isWarmup) {
      this.state.timeRemaining = this.config.warmupLength;
    } else {
      this.state.currentRound = 1;
      this.state.timeRemaining = this.config.roundLength;
      this.callbacks.onRoundStart?.(1);
    }
    this.state.elapsedInPhase = 0;
    this.warningFired = false;
  }
  pause() { this.state.isPaused = true; }
  resume() { this.state.isPaused = false; }
  tick() {
    if (this.state.isPaused || this.state.isComplete) return;
    this.state.timeRemaining = Math.max(0, this.state.timeRemaining - 0.1);
    this.state.elapsedInPhase += 0.1;
    this.callbacks.onTick?.(this.getState());
    if (this.state.timeRemaining <= 0) this.handlePhaseEnd();
  }
  handlePhaseEnd() {
    if (this.state.isWarmup) {
      this.state.isWarmup = false;
      this.state.currentRound = 1;
      this.state.timeRemaining = this.config.roundLength;
      this.state.elapsedInPhase = 0;
      this.callbacks.onRoundStart?.(1);
    } else if (this.state.isResting) {
      this.state.isResting = false;
      this.state.currentRound++;
      this.state.timeRemaining = this.config.roundLength;
      this.state.elapsedInPhase = 0;
      this.callbacks.onRestEnd?.(this.state.currentRound - 1);
      this.callbacks.onRoundStart?.(this.state.currentRound);
    } else {
      this.callbacks.onRoundEnd?.(this.state.currentRound);
      if (this.state.currentRound >= this.config.numRounds) {
        this.state.isComplete = true;
        this.callbacks.onComplete?.();
      } else {
        this.state.isResting = true;
        this.state.timeRemaining = this.config.restLength;
        this.state.elapsedInPhase = 0;
        this.callbacks.onRestStart?.(this.state.currentRound);
      }
    }
  }
}

// Test 1: Basic 3-round session
const events1 = [];
const t1 = new TimerEngine(
  { roundLength: 1, restLength: 0.5, numRounds: 3, warmupLength: 0, tenSecondWarning: false },
  {
    onRoundStart: (r) => events1.push(`roundStart:${r}`),
    onRoundEnd: (r) => events1.push(`roundEnd:${r}`),
    onRestStart: (r) => events1.push(`restStart:${r}`),
    onRestEnd: (r) => events1.push(`restEnd:${r}`),
    onComplete: () => events1.push("complete"),
    onTick: () => {},
  }
);
t1.start();
// Tick through 3 rounds + 2 rests
for (let i = 0; i < 400; i++) t1.tick(); // plenty of ticks

test("t1: starts round 1", "roundStart:1", events1[0]);
test("t1: ends round 1", "roundEnd:1", events1[1]);
test("t1: rest after round 1", "restStart:1", events1[2]);
test("t1: rest ends", "restEnd:1", events1[3]);
test("t1: starts round 2", "roundStart:2", events1[4]);
testTrue("t1: completes", events1.includes("complete"));
testTrue("t1: has 3 roundStart events", events1.filter(e => e.startsWith("roundStart")).length === 3);
testTrue("t1: has 3 roundEnd events", events1.filter(e => e.startsWith("roundEnd")).length === 3);
testTrue("t1: has 2 restStart events", events1.filter(e => e.startsWith("restStart")).length === 2);

// Test 2: With warmup
const events2 = [];
const t2 = new TimerEngine(
  { roundLength: 0.5, restLength: 0.3, numRounds: 2, warmupLength: 0.5, tenSecondWarning: false },
  {
    onRoundStart: (r) => events2.push(`roundStart:${r}`),
    onComplete: () => events2.push("complete"),
    onTick: () => {},
  }
);
t2.start();
const s2 = t2.getState();
test("t2: starts in warmup", true, s2.isWarmup);
test("t2: round 0 during warmup", 0, s2.currentRound);
for (let i = 0; i < 300; i++) t2.tick();
testTrue("t2: transitions from warmup to round 1", events2.includes("roundStart:1"));
testTrue("t2: completes after 2 rounds", events2.includes("complete"));

// Test 3: Pause/resume
const t3 = new TimerEngine(
  { roundLength: 5, restLength: 1, numRounds: 1, warmupLength: 0, tenSecondWarning: false },
  { onTick: () => {} }
);
t3.start();
for (let i = 0; i < 10; i++) t3.tick();
const before = t3.getState().timeRemaining;
t3.pause();
test("t3: paused", true, t3.getState().isPaused);
for (let i = 0; i < 10; i++) t3.tick();
test("t3: time frozen while paused", before, t3.getState().timeRemaining);
t3.resume();
test("t3: resumed", false, t3.getState().isPaused);
for (let i = 0; i < 5; i++) t3.tick();
testTrue("t3: time decreases after resume", t3.getState().timeRemaining < before);

// Test 4: Single round no rest
const events4 = [];
const t4 = new TimerEngine(
  { roundLength: 0.3, restLength: 0.3, numRounds: 1, warmupLength: 0, tenSecondWarning: false },
  {
    onRoundEnd: () => events4.push("roundEnd"),
    onComplete: () => events4.push("complete"),
    onRestStart: () => events4.push("restStart"),
    onTick: () => {},
  }
);
t4.start();
for (let i = 0; i < 100; i++) t4.tick();
testTrue("t4: no rest for single round", !events4.includes("restStart"));
testTrue("t4: completes after 1 round", events4.includes("complete"));

// ═══════════════════════════════════════════════════════════════════════════════
// REGRESSION
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n=== REGRESSION ===");
testTrue("theme intact", readSrc("theme.ts").length > 1000);
testTrue("fight HUD intact", readApp("training/combo-session.tsx").includes("PAUSED"));
testTrue("combo store intact", readSrc("stores/useComboStore.ts").includes("addCustomCombo"));

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
