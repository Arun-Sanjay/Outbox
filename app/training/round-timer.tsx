import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { Panel } from "../../src/components";
import { useTimerStore } from "../../src/stores/useTimerStore";
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
import { heavyTap, mediumTap, successNotification } from "../../src/lib/haptics";
import { goToSessionSummary, goBack } from "../../src/lib/navigation";
import type { TimerPreset } from "../../src/types";

type ScreenMode = "select" | "running" | "paused" | "complete";

export default function RoundTimerScreen() {
  useKeepAwake();

  const presets = useTimerStore((s) => s.presets);
  const [mode, setMode] = useState<ScreenMode>("select");
  const [selectedPreset, setSelectedPreset] = useState<TimerPreset | null>(null);
  const [timerState, setTimerState] = useState<EngineState | null>(null);
  const engineRef = useRef<TimerEngine | null>(null);
  const restPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    initAudio();
  }, []);

  // Rest breathing pulse
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

  const startWithPreset = useCallback((preset: TimerPreset) => {
    setSelectedPreset(preset);
    mediumTap();

    const engine = new TimerEngine(
      {
        roundLength: preset.roundSeconds,
        restLength: preset.restSeconds,
        numRounds: preset.numRounds,
        warmupLength: preset.warmupSeconds,
        tenSecondWarning: preset.tenSecondWarning,
      },
      {
        onTick: (state) => setTimerState(state),
        onRoundStart: (round) => {
          playRoundStartBell();
          heavyTap();
        },
        onRoundEnd: (round) => {
          playRoundEndBell();
          heavyTap();
        },
        onRestStart: () => {},
        onRestEnd: () => {},
        onWarning: (secondsLeft) => {
          if (secondsLeft === 10) playTenSecondWarning();
          else playCountdownBeep();
        },
        onComplete: () => {
          playFinalBell();
          successNotification();
          setMode("complete");
        },
      }
    );

    engineRef.current = engine;
    engine.start();
    setMode("running");
  }, []);

  const handlePause = () => {
    engineRef.current?.pause();
    setMode("paused");
  };

  const handleResume = () => {
    engineRef.current?.resume();
    setMode("running");
  };

  const handleStop = () => {
    engineRef.current?.destroy();
    engineRef.current = null;
    goBack();
  };

  const handleComplete = () => {
    engineRef.current?.destroy();
    engineRef.current = null;
    goToSessionSummary();
  };

  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  // ── Format helpers ─────────────────────────────────────────────────────────
  const formatTime = (s: number) => {
    const m = Math.floor(Math.max(0, s) / 60);
    const sec = Math.floor(Math.max(0, s) % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (!timerState) return colors.text;
    if (timerState.isResting) return colors.accent;
    if (timerState.isWarmup) return colors.textSecondary;
    if (timerState.timeRemaining <= 10 && timerState.timeRemaining > 0) return colors.danger;
    return colors.text;
  };

  const getProgressPercent = () => {
    if (!timerState || !selectedPreset) return 0;
    if (timerState.isWarmup) return 1 - timerState.timeRemaining / selectedPreset.warmupSeconds;
    if (timerState.isResting) return 1 - timerState.timeRemaining / selectedPreset.restSeconds;
    return 1 - timerState.timeRemaining / selectedPreset.roundSeconds;
  };

  // ── Preset selection ───────────────────────────────────────────────────────
  if (mode === "select") {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.selectContainer}>
          <Text style={styles.selectTitle}>SELECT PRESET</Text>
          <FlatList
            data={presets}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.presetList}
            renderItem={({ item }) => (
              <Pressable onPress={() => startWithPreset(item)}>
                <Panel tone="subtle" style={styles.presetCard}>
                  <Text style={styles.presetName}>{item.name}</Text>
                  <Text style={styles.presetInfo}>
                    {item.numRounds}R × {Math.floor(item.roundSeconds / 60)}:{String(item.roundSeconds % 60).padStart(2, "0")} / {item.restSeconds}s rest
                  </Text>
                  {item.isCustom && <Text style={styles.customBadge}>CUSTOM</Text>}
                </Panel>
              </Pressable>
            )}
          />
        </View>
      </View>
    );
  }

  // ── Timer HUD ──────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Pause overlay */}
      {mode === "paused" && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pausedText}>PAUSED</Text>
          <Pressable onPress={handleResume} style={styles.resumeBtn}>
            <Text style={styles.resumeText}>RESUME</Text>
          </Pressable>
          <Pressable onPress={handleStop} style={styles.endBtn}>
            <Text style={styles.endBtnText}>END SESSION</Text>
          </Pressable>
        </View>
      )}

      {/* Complete overlay */}
      {mode === "complete" && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.completeText}>COMPLETE</Text>
          <Text style={styles.completeSubtext}>
            {selectedPreset?.numRounds} rounds finished
          </Text>
          <Pressable onPress={handleComplete} style={styles.resumeBtn}>
            <Text style={styles.resumeText}>CONTINUE</Text>
          </Pressable>
        </View>
      )}

      <Pressable onPress={handlePause} style={styles.hudTouchable} disabled={mode !== "running"}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.roundKicker}>
            {timerState?.isWarmup
              ? "WARMUP"
              : timerState?.isResting
              ? "REST"
              : `ROUND ${timerState?.currentRound ?? 0}/${selectedPreset?.numRounds ?? 0}`}
          </Text>
          <Text style={styles.presetLabel}>{selectedPreset?.name}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(100, getProgressPercent() * 100)}%`,
                backgroundColor: timerState?.isResting ? colors.roundRest : colors.accent,
              },
            ]}
          />
        </View>

        {/* Countdown */}
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

        {/* Small end button */}
        <Pressable onPress={handleStop} style={styles.smallEndBtn} hitSlop={20}>
          <Text style={styles.smallEndText}>End</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  selectContainer: { flex: 1, paddingTop: 60, paddingHorizontal: spacing.xl },
  selectTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: spacing["2xl"],
  },
  presetList: { gap: spacing.md, paddingBottom: 40 },
  presetCard: { padding: spacing.lg },
  presetName: { ...fonts.subheading, marginBottom: spacing.xs },
  presetInfo: { ...fonts.small, color: colors.textMuted },
  customBadge: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  hudTouchable: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
  },
  topBar: { alignItems: "center", gap: 4 },
  roundKicker: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 3,
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
  progressBarBg: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginTop: spacing.md,
  },
  progressBarFill: { height: 2 },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  countdown: {
    fontSize: 108,
    fontWeight: "200",
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    fontVariant: ["tabular-nums"],
    letterSpacing: -2,
  },
  smallEndBtn: {
    alignSelf: "flex-end",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  smallEndText: { fontSize: 14, fontWeight: "600", color: colors.textMuted },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    gap: spacing["2xl"],
  },
  pausedText: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 6,
    marginBottom: spacing["3xl"],
  },
  completeText: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 4,
  },
  completeSubtext: {
    ...fonts.body,
    color: colors.textSecondary,
    marginBottom: spacing["3xl"],
  },
  resumeBtn: {
    backgroundColor: colors.accent,
    height: 64,
    paddingHorizontal: spacing["5xl"],
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  resumeText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 3,
  },
  endBtn: {
    height: 56,
    paddingHorizontal: spacing["4xl"],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  endBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 2,
  },
});
