import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { Panel } from "../../src/components";
import { TimerEngine } from "../../src/lib/timer-engine";
import type { TimerState as EngineState } from "../../src/lib/timer-engine";
import {
  initAudio,
  playRoundStartBell,
  playRoundEndBell,
  playTenSecondWarning,
  playCountdownBeep,
  playFinalBell,
} from "../../src/lib/audio-manager";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { heavyTap, mediumTap, successNotification, lightTap } from "../../src/lib/haptics";
import { toLocalDateKey } from "../../src/lib/date";
import { nextId } from "../../src/db/storage";
import { goBack } from "../../src/lib/navigation";
import type { TrainingSession } from "../../src/types";

type ScreenMode = "config" | "running" | "paused" | "complete";

export default function SkipRopeScreen() {
  useKeepAwake();

  const addTrainingSession = useSessionStore((s) => s.addTrainingSession);

  // Config
  const [numRounds, setNumRounds] = useState(6);
  const [roundLength, setRoundLength] = useState(180);
  const [restLength, setRestLength] = useState(60);

  // Runtime
  const [mode, setMode] = useState<ScreenMode>("config");
  const [timerState, setTimerState] = useState<EngineState | null>(null);
  const [trips, setTrips] = useState("");
  const engineRef = useRef<TimerEngine | null>(null);
  const startTimeRef = useRef(0);
  const restPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => { initAudio(); }, []);

  useEffect(() => {
    if (timerState?.isResting) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(restPulse, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
          Animated.timing(restPulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [timerState?.isResting, restPulse]);

  const handleStart = useCallback(() => {
    mediumTap();
    startTimeRef.current = Date.now();
    const engine = new TimerEngine(
      { roundLength, restLength, numRounds, warmupLength: 0, tenSecondWarning: true },
      {
        onTick: (state) => setTimerState(state),
        onRoundStart: () => { playRoundStartBell(); heavyTap(); },
        onRoundEnd: () => { playRoundEndBell(); heavyTap(); },
        onWarning: (s) => { if (s === 10) playTenSecondWarning(); else playCountdownBeep(); },
        onComplete: () => { playFinalBell(); successNotification(); setMode("complete"); },
      }
    );
    engineRef.current = engine;
    engine.start();
    setMode("running");
  }, [roundLength, restLength, numRounds]);

  const handlePause = () => { engineRef.current?.pause(); setMode("paused"); };
  const handleResume = () => { engineRef.current?.resume(); setMode("running"); };
  const handleStop = () => { engineRef.current?.destroy(); goBack(); };

  const handleSave = () => {
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    const tripsCount = parseInt(trips) || 0;
    const session: TrainingSession = {
      id: nextId(),
      sessionType: "conditioning",
      date: toLocalDateKey(new Date()),
      startedAt: startTimeRef.current,
      durationSeconds: duration,
      rounds: numRounds,
      intensity: "moderate",
      energyRating: 0,
      sharpnessRating: 0,
      notes: tripsCount > 0 ? `Trips/misses: ${tripsCount}` : "",
      comboSessionId: null,
      timerPresetId: null,
      comboModeUsed: false,
      partnerName: null,
      coachName: null,
      distanceMeters: null,
      routeDescription: null,
      conditioningType: "skip_rope",
      xpEarned: 40,
      createdAt: Date.now(),
    };
    addTrainingSession(session);
    successNotification();
    goBack();
  };

  useEffect(() => () => { engineRef.current?.destroy(); }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(Math.max(0, s) / 60);
    const sec = Math.floor(Math.max(0, s) % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (!timerState) return colors.text;
    if (timerState.isResting) return colors.accent;
    if (timerState.timeRemaining <= 10) return colors.danger;
    return colors.text;
  };

  // ── Config screen ──────────────────────────────────────────────────────────
  if (mode === "config") {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.configContainer}>
          <Text style={styles.configTitle}>SKIP ROPE</Text>

          <View style={styles.configSection}>
            <Text style={styles.configLabel}>ROUNDS</Text>
            <View style={styles.stepperRow}>
              <Pressable onPress={() => { lightTap(); setNumRounds(Math.max(1, numRounds - 1)); }} style={styles.stepperBtn}>
                <Text style={styles.stepperBtnText}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{numRounds}</Text>
              <Pressable onPress={() => { lightTap(); setNumRounds(Math.min(15, numRounds + 1)); }} style={styles.stepperBtn}>
                <Text style={styles.stepperBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.configSection}>
            <Text style={styles.configLabel}>ROUND LENGTH</Text>
            <View style={styles.stepperRow}>
              <Pressable onPress={() => { lightTap(); setRoundLength(Math.max(60, roundLength - 30)); }} style={styles.stepperBtn}>
                <Text style={styles.stepperBtnText}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{formatTime(roundLength)}</Text>
              <Pressable onPress={() => { lightTap(); setRoundLength(Math.min(180, roundLength + 30)); }} style={styles.stepperBtn}>
                <Text style={styles.stepperBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.configSection}>
            <Text style={styles.configLabel}>REST LENGTH</Text>
            <View style={styles.stepperRow}>
              <Pressable onPress={() => { lightTap(); setRestLength(Math.max(30, restLength - 15)); }} style={styles.stepperBtn}>
                <Text style={styles.stepperBtnText}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{restLength}s</Text>
              <Pressable onPress={() => { lightTap(); setRestLength(Math.min(60, restLength + 15)); }} style={styles.stepperBtn}>
                <Text style={styles.stepperBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <Pressable onPress={handleStart} style={styles.startBtn}>
            <Text style={styles.startText}>START</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Complete screen ────────────────────────────────────────────────────────
  if (mode === "complete") {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>COMPLETE</Text>
          <Text style={styles.completeSubtitle}>{numRounds} rounds finished</Text>

          <View style={styles.tripsInput}>
            <Text style={styles.configLabel}>TRIPS / MISSES (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              value={trips}
              onChangeText={setTrips}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
          </View>

          <Pressable onPress={handleSave} style={styles.startBtn}>
            <Text style={styles.startText}>SAVE SESSION</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Timer HUD ──────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {mode === "paused" && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pausedText}>PAUSED</Text>
          <Pressable onPress={handleResume} style={styles.resumeBtn}>
            <Text style={styles.resumeBtnText}>RESUME</Text>
          </Pressable>
          <Pressable onPress={handleStop} style={styles.endBtn}>
            <Text style={styles.endBtnText}>END SESSION</Text>
          </Pressable>
        </View>
      )}

      <Pressable onPress={handlePause} style={styles.hudTouchable} disabled={mode !== "running"}>
        <View style={styles.topBar}>
          <Text style={styles.roundKicker}>
            {timerState?.isResting
              ? "REST"
              : `ROUND ${timerState?.currentRound ?? 0}/${numRounds}`}
          </Text>
          <Text style={styles.subtitle}>SKIP ROPE</Text>
        </View>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(100, (timerState ? (1 - timerState.timeRemaining / (timerState.isResting ? restLength : roundLength)) * 100 : 0))}%`,
                backgroundColor: timerState?.isResting ? colors.roundRest : colors.accent,
              },
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.timerContainer,
            timerState?.isResting && { transform: [{ scale: restPulse }] },
          ]}
        >
          <Text style={[styles.countdown, { color: getTimerColor() }]}>
            {formatTime(timerState?.timeRemaining ?? 0)}
          </Text>
        </Animated.View>

        <Pressable onPress={handleStop} style={styles.smallEndBtn} hitSlop={20}>
          <Text style={styles.smallEndText}>End</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  configContainer: { flex: 1, paddingTop: 80, paddingHorizontal: spacing.xl, gap: spacing["3xl"] },
  configTitle: { fontSize: 14, fontWeight: "800", color: colors.accent, letterSpacing: 3, textAlign: "center" },
  configSection: { gap: spacing.md },
  configLabel: { ...fonts.caption, color: colors.textSecondary },
  stepperRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing["2xl"] },
  stepperBtn: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 1,
    borderColor: colors.panelBorder, backgroundColor: colors.inputBg,
    alignItems: "center", justifyContent: "center",
  },
  stepperBtnText: { fontSize: 24, fontWeight: "600", color: colors.text },
  stepperValue: { fontSize: 28, fontWeight: "800", color: colors.text, minWidth: 80, textAlign: "center" },
  startBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing["2xl"],
  },
  startText: { fontSize: 18, fontWeight: "800", color: "#000000", letterSpacing: 2 },
  completeContainer: { flex: 1, paddingTop: 80, paddingHorizontal: spacing.xl, alignItems: "center", gap: spacing["2xl"] },
  completeTitle: { fontSize: 40, fontWeight: "800", color: colors.accent, letterSpacing: 4 },
  completeSubtitle: { ...fonts.body, color: colors.textSecondary },
  tripsInput: { width: "100%", gap: spacing.sm },
  input: {
    height: TOUCH_MIN, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, fontSize: 24, fontWeight: "700",
    color: colors.text, textAlign: "center",
  },
  hudTouchable: { flex: 1, justifyContent: "space-between", paddingTop: 60, paddingBottom: 40, paddingHorizontal: spacing.xl },
  topBar: { alignItems: "center", gap: 4 },
  roundKicker: { fontSize: 14, fontWeight: "800", color: colors.accent, letterSpacing: 3 },
  subtitle: { fontSize: 12, fontWeight: "500", color: colors.textMuted },
  progressBarBg: { height: 2, backgroundColor: "rgba(255,255,255,0.08)", marginTop: spacing.md },
  progressBarFill: { height: 2 },
  timerContainer: { alignItems: "center", justifyContent: "center", flex: 1 },
  countdown: {
    fontSize: 108, fontWeight: "200",
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    fontVariant: ["tabular-nums"], letterSpacing: -2,
  },
  smallEndBtn: { alignSelf: "flex-end", paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  smallEndText: { fontSize: 14, fontWeight: "600", color: colors.textMuted },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center", justifyContent: "center", zIndex: 100, gap: spacing["2xl"],
  },
  pausedText: { fontSize: 48, fontWeight: "800", color: colors.text, letterSpacing: 6, marginBottom: spacing["3xl"] },
  resumeBtn: {
    backgroundColor: colors.accent, height: 64, paddingHorizontal: spacing["5xl"],
    borderRadius: radius.md, alignItems: "center", justifyContent: "center",
  },
  resumeBtnText: { fontSize: 20, fontWeight: "800", color: "#000000", letterSpacing: 3 },
  endBtn: {
    height: 56, paddingHorizontal: spacing["4xl"], borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center", justifyContent: "center",
  },
  endBtnText: { fontSize: 16, fontWeight: "700", color: colors.textSecondary, letterSpacing: 2 },
});
