import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { useComboStore } from "../../src/stores/useComboStore";
import { calloutEngine, getCalloutText } from "../../src/lib/tts-engine";
import { getNextCombo, getNextFootworkCall, getNextDefenseCall, getTempoDelay } from "../../src/lib/combo-engine";
import { getPunchName } from "../../src/lib/combo-utils";
import { playRoundStartBell, playRoundEndBell, playTenSecondWarning, playCountdownBeep, playFinalBell, initAudio } from "../../src/lib/audio-manager";
import { successNotification, heavyTap, mediumTap } from "../../src/lib/haptics";
import { goToSessionSummary, goBack } from "../../src/lib/navigation";
import type { ComboElement, ComboSessionConfig } from "../../src/types";

// ── Session phases ───────────────────────────────────────────────────────────

type SessionPhase = "warmup" | "round" | "rest" | "complete" | "paused";

// ── Default config (loaded from route params or previous screen) ─────────────

const DEFAULT_CONFIG: ComboSessionConfig = {
  drillMode: "combo",
  comboSources: ["beginner", "intermediate"],
  includeFavorites: false,
  drillQueueIds: null,
  roundLength: 180,
  restLength: 60,
  numRounds: 6,
  tempo: "medium",
  calloutStyle: "numbers",
  stance: "orthodox",
  warmupRound: false,
  warmupLength: 60,
  tenSecondWarning: true,
  bellSound: "classic",
};

export default function ComboSessionScreen() {
  useKeepAwake();

  // ── Stores ─────────────────────────────────────────────────────────────────
  const allCombos = useComboStore((s) => s.combos);
  const startSession = useSessionStore((s) => s.startComboSession);
  const calloutCombo = useSessionStore((s) => s.calloutCombo);
  const updateRound = useSessionStore((s) => s.updateSessionRound);
  const updateResting = useSessionStore((s) => s.updateSessionResting);
  const updatePaused = useSessionStore((s) => s.updateSessionPaused);
  const completeSession = useSessionStore((s) => s.completeComboSession);
  const abandonSession = useSessionStore((s) => s.abandonComboSession);

  // ── State ──────────────────────────────────────────────────────────────────
  const [config] = useState<ComboSessionConfig>(DEFAULT_CONFIG);
  const [phase, setPhase] = useState<SessionPhase>("warmup");
  const [currentRound, setCurrentRound] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentCallout, setCurrentCallout] = useState<string>("");
  const [previousCallout, setPreviousCallout] = useState<string>("");
  const [initialized, setInitialized] = useState(false);
  const [phaseBeforePause, setPhaseBeforePause] = useState<SessionPhase>("round");

  const recentComboIds = useRef<string[]>([]);
  const recentCallCodes = useRef<string[]>([]);
  const calloutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(0);

  // ── Animations ─────────────────────────────────────────────────────────────
  const calloutOpacity = useRef(new Animated.Value(0)).current;
  const calloutTranslateY = useRef(new Animated.Value(8)).current;
  const restPulse = useRef(new Animated.Value(1)).current;
  const roundSlide = useRef(new Animated.Value(0)).current;

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    initAudio();
    startSession(config);

    if (config.warmupRound) {
      setPhase("warmup");
      setTimeRemaining(config.warmupLength);
      timeRef.current = config.warmupLength;
    } else {
      beginRound(1);
    }
    setInitialized(true);

    return () => {
      calloutEngine.stop();
      if (calloutTimerRef.current) clearTimeout(calloutTimerRef.current);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Timer tick ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!initialized || phase === "paused" || phase === "complete") return;

    tickIntervalRef.current = setInterval(() => {
      timeRef.current -= 0.1;
      const t = Math.max(0, timeRef.current);
      setTimeRemaining(t);

      // 10-second warning
      if (config.tenSecondWarning && phase === "round" && Math.abs(t - 10) < 0.1) {
        playTenSecondWarning();
      }

      // 3-2-1 countdown beeps during rest
      if (phase === "rest" && t <= 3 && t > 0 && Math.abs(t - Math.round(t)) < 0.1) {
        playCountdownBeep();
      }

      if (t <= 0) {
        if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
        handlePhaseEnd();
      }
    }, 100);

    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, initialized]);

  // ── Rest breathing pulse ───────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "rest") return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(restPulse, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
        Animated.timing(restPulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [phase, restPulse]);

  // ── Phase transitions ──────────────────────────────────────────────────────
  const beginRound = useCallback((round: number) => {
    setCurrentRound(round);
    updateRound(round);
    setPhase("round");
    updateResting(false);
    timeRef.current = config.roundLength;
    setTimeRemaining(config.roundLength);
    setCurrentCallout("");
    setPreviousCallout("");
    playRoundStartBell();
    heavyTap();

    // Round slide-in animation
    roundSlide.setValue(-50);
    Animated.spring(roundSlide, {
      toValue: 0,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();

    // Start callouts after 2s delay
    calloutTimerRef.current = setTimeout(() => {
      scheduleNextCallout(round);
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const beginRest = useCallback(() => {
    calloutEngine.stop();
    if (calloutTimerRef.current) clearTimeout(calloutTimerRef.current);
    setPhase("rest");
    updateResting(true);
    timeRef.current = config.restLength;
    setTimeRemaining(config.restLength);
    playRoundEndBell();
    heavyTap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handlePhaseEnd = useCallback(() => {
    if (phase === "warmup") {
      beginRound(1);
    } else if (phase === "round") {
      if (currentRound >= config.numRounds) {
        // Session complete
        calloutEngine.stop();
        if (calloutTimerRef.current) clearTimeout(calloutTimerRef.current);
        playFinalBell();
        setPhase("complete");
        successNotification();
        const session = completeSession(allCombos);
        setTimeout(() => goToSessionSummary(), 2000);
      } else {
        beginRest();
      }
    } else if (phase === "rest") {
      beginRound(currentRound + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentRound, config, allCombos]);

  // ── Combo callout scheduling ───────────────────────────────────────────────
  const scheduleNextCallout = useCallback((round: number) => {
    if (phase === "paused" || phase === "rest" || phase === "complete") return;

    let calloutText = "";
    let comboId = "";

    if (config.drillMode === "combo") {
      const combo = getNextCombo(config, recentComboIds.current, allCombos);
      if (combo) {
        calloutText = getCalloutText(combo, config.calloutStyle, config.stance);
        comboId = combo.id;
        recentComboIds.current = [combo.id, ...recentComboIds.current].slice(0, 3);
        calloutCombo(combo.id, round);
      }
    } else if (config.drillMode === "footwork") {
      const code = getNextFootworkCall(recentCallCodes.current);
      calloutText = getPunchName(code);
      recentCallCodes.current = [code, ...recentCallCodes.current].slice(0, 2);
    } else if (config.drillMode === "defense") {
      const elements = getNextDefenseCall(recentCallCodes.current, false);
      calloutText = elements.map((el) => getPunchName(el)).join(", ");
      recentCallCodes.current = [elements[elements.length - 1], ...recentCallCodes.current].slice(0, 2);
    }

    if (calloutText) {
      // Animate callout in
      setPreviousCallout(currentCallout);
      setCurrentCallout(calloutText);
      calloutOpacity.setValue(0);
      calloutTranslateY.setValue(8);
      Animated.parallel([
        Animated.timing(calloutOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(calloutTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();

      calloutEngine.speak(calloutText);
    }

    // Schedule next
    const delay = getTempoDelay(config.tempo);
    calloutTimerRef.current = setTimeout(() => {
      scheduleNextCallout(round);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, allCombos, phase, currentCallout]);

  // ── Pause / Resume ─────────────────────────────────────────────────────────
  const handlePause = () => {
    if (phase === "complete") return;
    if (phase === "paused") return;
    setPhaseBeforePause(phase);
    setPhase("paused");
    updatePaused(true);
    calloutEngine.stop();
    if (calloutTimerRef.current) clearTimeout(calloutTimerRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
  };

  const handleResume = () => {
    setPhase(phaseBeforePause);
    updatePaused(false);
    // Resume callouts after 2s if was in round
    if (phaseBeforePause === "round") {
      calloutTimerRef.current = setTimeout(() => {
        scheduleNextCallout(currentRound);
      }, 2000);
    }
  };

  const handleEnd = () => {
    calloutEngine.stop();
    if (calloutTimerRef.current) clearTimeout(calloutTimerRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    abandonSession();
    goBack();
  };

  const handleEndWithSave = () => {
    calloutEngine.stop();
    if (calloutTimerRef.current) clearTimeout(calloutTimerRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    completeSession(allCombos);
    successNotification();
    goToSessionSummary();
  };

  // ── Format time ────────────────────────────────────────────────────────────
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.floor(Math.max(0, seconds) % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // ── Timer color ────────────────────────────────────────────────────────────
  const getTimerColor = (): string => {
    if (phase === "rest") return colors.accent;
    if (phase === "warmup") return colors.textSecondary;
    if (timeRemaining <= 10 && timeRemaining > 0) return colors.danger;
    return colors.text;
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const progressPercent =
    phase === "round"
      ? 1 - timeRemaining / config.roundLength
      : phase === "rest"
      ? 1 - timeRemaining / config.restLength
      : phase === "warmup"
      ? 1 - timeRemaining / config.warmupLength
      : 1;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Pause overlay */}
      {phase === "paused" && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pausedText}>PAUSED</Text>
          <Pressable onPress={handleResume} style={styles.resumeBtn}>
            <Text style={styles.resumeText}>RESUME</Text>
          </Pressable>
          <Pressable onPress={handleEndWithSave} style={styles.endBtn}>
            <Text style={styles.endBtnText}>END SESSION</Text>
          </Pressable>
        </View>
      )}

      {/* Main HUD */}
      <Pressable onPress={handlePause} style={styles.hudTouchable}>
        {/* Top bar: round info */}
        <Animated.View style={[styles.topBar, { transform: [{ translateX: roundSlide }] }]}>
          <Text style={styles.roundKicker}>
            {phase === "warmup"
              ? "WARMUP"
              : phase === "rest"
              ? "REST"
              : phase === "complete"
              ? "COMPLETE"
              : `ROUND ${currentRound}/${config.numRounds}`}
          </Text>
          <Text style={styles.elapsed}>
            {formatTime(
              phase === "round"
                ? config.roundLength - timeRemaining
                : phase === "rest"
                ? config.restLength - timeRemaining
                : 0
            )}
          </Text>
        </Animated.View>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, progressPercent * 100)}%` },
            ]}
          />
        </View>

        {/* Countdown timer */}
        <Animated.View
          style={[
            styles.timerContainer,
            phase === "rest" && { transform: [{ scale: restPulse }] },
          ]}
        >
          <Text style={[styles.countdown, { color: getTimerColor() }]}>
            {formatTime(timeRemaining)}
          </Text>
        </Animated.View>

        {/* Combo display */}
        <View style={styles.calloutContainer}>
          {previousCallout !== "" && (
            <Text style={styles.previousCallout}>{previousCallout}</Text>
          )}
          {currentCallout !== "" && phase !== "rest" && phase !== "warmup" && (
            <Animated.Text
              style={[
                styles.currentCallout,
                {
                  opacity: calloutOpacity,
                  transform: [{ translateY: calloutTranslateY }],
                },
                config.drillMode === "footwork" && { color: "#22d3ee" },
                config.drillMode === "defense" && { color: "rgba(96,165,250,0.8)" },
              ]}
            >
              {currentCallout}
            </Animated.Text>
          )}
        </View>

        {/* Small end button */}
        <Pressable
          onPress={handleEnd}
          style={styles.smallEndBtn}
          hitSlop={20}
        >
          <Text style={styles.smallEndText}>End</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hudTouchable: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
  },
  topBar: {
    alignItems: "center",
    gap: 4,
  },
  roundKicker: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  elapsed: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    color: colors.textMuted,
  },
  progressBarBg: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginTop: spacing.md,
  },
  progressBarFill: {
    height: 2,
    backgroundColor: colors.accent,
  },
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
  calloutContainer: {
    alignItems: "center",
    minHeight: 80,
    justifyContent: "center",
    gap: spacing.sm,
  },
  currentCallout: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    letterSpacing: 1,
  },
  previousCallout: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.text,
    opacity: 0.1,
    textAlign: "center",
  },
  smallEndBtn: {
    alignSelf: "flex-end",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  smallEndText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textMuted,
  },
  // Pause overlay
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
