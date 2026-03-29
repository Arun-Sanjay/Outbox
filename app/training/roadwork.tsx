import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import * as Location from "expo-location";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { successNotification, mediumTap, heavyTap } from "../../src/lib/haptics";
import { toLocalDateKey } from "../../src/lib/date";
import { nextId } from "../../src/db/storage";
import { goBack } from "../../src/lib/navigation";
import type { TrainingSession, Intensity } from "../../src/types";

type RunMode = "pre" | "active" | "paused" | "summary";

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RoadworkScreen() {
  useKeepAwake();

  const addTrainingSession = useSessionStore((s) => s.addTrainingSession);

  const [mode, setMode] = useState<RunMode>("pre");
  const [distance, setDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [intensity, setIntensity] = useState<Intensity>("moderate");
  const [routeDesc, setRouteDesc] = useState("");
  const [notes, setNotes] = useState("");

  const startTimeRef = useRef(0);
  const pausedTimeRef = useRef(0);
  const lastCoordsRef = useRef<{ lat: number; lon: number } | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const distanceRef = useRef(0);

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Location permission is needed to track your run.");
      return false;
    }
    return true;
  };

  const startRun = useCallback(async () => {
    const ok = await requestPermission();
    if (!ok) return;

    mediumTap();
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    distanceRef.current = 0;
    lastCoordsRef.current = null;
    setDistance(0);
    setElapsed(0);
    setMode("active");

    // GPS tracking
    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        if (lastCoordsRef.current) {
          const d = haversineDistance(
            lastCoordsRef.current.lat,
            lastCoordsRef.current.lon,
            latitude,
            longitude
          );
          if (d > 2 && d < 100) {
            distanceRef.current += d;
            setDistance(distanceRef.current);
          }
        }
        lastCoordsRef.current = { lat: latitude, lon: longitude };
      }
    );

    // Elapsed timer
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current - pausedTimeRef.current);
    }, 1000);
  }, []);

  const pauseRun = useCallback(() => {
    mediumTap();
    watchRef.current?.remove();
    watchRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setMode("paused");
  }, []);

  const resumeRun = useCallback(async () => {
    mediumTap();
    setMode("active");

    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 5 },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        if (lastCoordsRef.current) {
          const d = haversineDistance(
            lastCoordsRef.current.lat, lastCoordsRef.current.lon,
            latitude, longitude
          );
          if (d > 2 && d < 100) {
            distanceRef.current += d;
            setDistance(distanceRef.current);
          }
        }
        lastCoordsRef.current = { lat: latitude, lon: longitude };
      }
    );

    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current - pausedTimeRef.current);
    }, 1000);
  }, []);

  const stopRun = useCallback(() => {
    heavyTap();
    watchRef.current?.remove();
    watchRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setMode("summary");
  }, []);

  const handleSave = useCallback(() => {
    const durationSeconds = Math.round(elapsed / 1000);
    const session: TrainingSession = {
      id: nextId(),
      sessionType: "roadwork",
      date: toLocalDateKey(new Date()),
      startedAt: startTimeRef.current,
      durationSeconds,
      rounds: null,
      intensity,
      energyRating: 0,
      sharpnessRating: 0,
      notes,
      comboSessionId: null,
      timerPresetId: null,
      comboModeUsed: false,
      partnerName: null,
      coachName: null,
      distanceMeters: Math.round(distanceRef.current),
      routeDescription: routeDesc || null,
      conditioningType: null,
      xpEarned: 50,
      createdAt: Date.now(),
    };
    addTrainingSession(session);
    successNotification();
    goBack();
  }, [elapsed, intensity, notes, routeDesc, addTrainingSession]);

  useEffect(() => {
    return () => {
      watchRef.current?.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatDistance = (m: number) => {
    if (m < 1000) return `${Math.round(m)}m`;
    return `${(m / 1000).toFixed(2)}km`;
  };

  const formatElapsed = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${String(sec).padStart(2, "0")}`;
  };

  const formatPace = (ms: number, meters: number) => {
    if (meters < 10) return "--:--";
    const totalMin = ms / 60000;
    const km = meters / 1000;
    const paceMin = totalMin / km;
    const m = Math.floor(paceMin);
    const s = Math.round((paceMin - m) * 60);
    return `${m}:${String(s).padStart(2, "0")} /km`;
  };

  // ── Pre-run screen ─────────────────────────────────────────────────────────
  if (mode === "pre") {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.preContainer}>
          <Text style={styles.preKicker}>ROADWORK</Text>
          <Text style={styles.preTitle}>HIT THE ROAD</Text>
          <Pressable onPress={startRun} style={styles.startBtn}>
            <Text style={styles.startBtnText}>START RUN</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Summary screen ─────────────────────────────────────────────────────────
  if (mode === "summary") {
    const INTENSITIES: Intensity[] = ["light", "moderate", "hard", "war"];
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.summaryContainer}>
          <Text style={styles.completeTitle}>RUN COMPLETE</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatDistance(distance)}</Text>
              <Text style={styles.statLabel}>DISTANCE</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatElapsed(elapsed)}</Text>
              <Text style={styles.statLabel}>TIME</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatPace(elapsed, distance)}</Text>
              <Text style={styles.statLabel}>AVG PACE</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>ROUTE DESCRIPTION</Text>
            <TextInput
              style={styles.input}
              value={routeDesc}
              onChangeText={setRouteDesc}
              placeholder="e.g. Park loop"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>INTENSITY</Text>
            <View style={styles.pillRow}>
              {INTENSITIES.map((i) => (
                <Pressable
                  key={i}
                  onPress={() => setIntensity(i)}
                  style={[styles.pill, intensity === i && styles.pillActive]}
                >
                  <Text style={[styles.pillText, intensity === i && styles.pillTextActive]}>
                    {i.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>NOTES</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="How did it feel?"
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>

          <Pressable onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>SAVE</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Active / Paused HUD ────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {mode === "paused" && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pausedText}>PAUSED</Text>
          <Pressable onPress={resumeRun} style={styles.resumeBtn}>
            <Text style={styles.resumeBtnText}>RESUME</Text>
          </Pressable>
          <Pressable onPress={stopRun} style={styles.endBtn}>
            <Text style={styles.endBtnText}>STOP RUN</Text>
          </Pressable>
        </View>
      )}

      <Pressable onPress={mode === "active" ? pauseRun : undefined} style={styles.hudContainer}>
        <Text style={styles.hudKicker}>ROADWORK</Text>

        <Text style={styles.distanceValue}>{formatDistance(distance)}</Text>

        <View style={styles.hudStatsRow}>
          <View style={styles.hudStat}>
            <Text style={styles.hudStatValue}>{formatPace(elapsed, distance)}</Text>
            <Text style={styles.hudStatLabel}>PACE</Text>
          </View>
          <View style={styles.hudStat}>
            <Text style={styles.hudStatValue}>{formatElapsed(elapsed)}</Text>
            <Text style={styles.hudStatLabel}>TIME</Text>
          </View>
        </View>

        <View style={styles.hudActions}>
          <Pressable onPress={pauseRun} style={styles.pauseBtn}>
            <Text style={styles.pauseBtnText}>PAUSE</Text>
          </Pressable>
          <Pressable onPress={stopRun} style={styles.stopBtn}>
            <Text style={styles.stopBtnText}>STOP</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  preContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing["2xl"] },
  preKicker: { fontSize: 12, fontWeight: "700", color: colors.textSecondary, letterSpacing: 3 },
  preTitle: { fontSize: 36, fontWeight: "800", color: colors.text, letterSpacing: 2 },
  startBtn: {
    backgroundColor: colors.accent, height: 56, paddingHorizontal: spacing["5xl"],
    borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing["3xl"],
  },
  startBtnText: { fontSize: 18, fontWeight: "800", color: "#000000", letterSpacing: 2 },
  hudContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: spacing.xl },
  hudKicker: { fontSize: 14, fontWeight: "800", color: colors.accent, letterSpacing: 3, marginBottom: spacing["3xl"] },
  distanceValue: {
    fontSize: 64, fontWeight: "200",
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    color: colors.text, fontVariant: ["tabular-nums"],
  },
  hudStatsRow: { flexDirection: "row", gap: spacing["5xl"], marginTop: spacing["3xl"] },
  hudStat: { alignItems: "center" },
  hudStatValue: {
    fontSize: 20, fontWeight: "700",
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    color: colors.text, fontVariant: ["tabular-nums"],
  },
  hudStatLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2, marginTop: 4 },
  hudActions: { flexDirection: "row", gap: spacing["2xl"], marginTop: spacing["5xl"] },
  pauseBtn: {
    paddingHorizontal: spacing["3xl"], paddingVertical: spacing.lg,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.panelBorder,
  },
  pauseBtnText: { fontSize: 14, fontWeight: "700", color: colors.textSecondary, letterSpacing: 2 },
  stopBtn: {
    paddingHorizontal: spacing["3xl"], paddingVertical: spacing.lg,
    borderRadius: radius.md, backgroundColor: colors.danger,
  },
  stopBtnText: { fontSize: 14, fontWeight: "700", color: "#000000", letterSpacing: 2 },
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
  summaryContainer: { flex: 1, paddingTop: 60, paddingHorizontal: spacing.xl, gap: spacing["2xl"] },
  completeTitle: { fontSize: 32, fontWeight: "800", color: colors.accent, letterSpacing: 4, textAlign: "center" },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: spacing.lg },
  stat: { alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2, marginTop: 4 },
  field: { gap: spacing.sm },
  fieldLabel: { ...fonts.caption, color: colors.textSecondary },
  input: {
    height: TOUCH_MIN, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, fontSize: 16, color: colors.text,
  },
  pillRow: { flexDirection: "row", gap: spacing.sm },
  pill: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center",
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { fontSize: 11, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 },
  pillTextActive: { color: "#000000" },
  saveBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing.lg,
  },
  saveBtnText: { fontSize: 18, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
