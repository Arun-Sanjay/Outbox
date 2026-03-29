import React, { useState, useCallback } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader } from "../../src/components";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { getSessionTypeLabel, getSessionTypeColor } from "../../src/lib/workout-utils";
import { successNotification, lightTap } from "../../src/lib/haptics";
import { toLocalDateKey } from "../../src/lib/date";
import { nextId } from "../../src/db/storage";
import { goBack } from "../../src/lib/navigation";
import type { SessionType, Intensity, TrainingSession } from "../../src/types";

const SESSION_TYPES: SessionType[] = [
  "heavy_bag", "speed_bag", "double_end_bag",
  "shadow_boxing", "mitt_work", "sparring",
  "conditioning", "strength", "roadwork",
];

const INTENSITIES: Intensity[] = ["light", "moderate", "hard", "war"];

export default function LogSessionScreen() {
  const addTrainingSession = useSessionStore((s) => s.addTrainingSession);

  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [durationMin, setDurationMin] = useState("30");
  const [rounds, setRounds] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("moderate");
  const [energy, setEnergy] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [notes, setNotes] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [conditioningType, setConditioningType] = useState("");
  const [distanceKm, setDistanceKm] = useState("");

  const handleSave = useCallback(() => {
    if (!sessionType) return;
    const dur = parseInt(durationMin) || 30;
    const roundsVal = parseInt(rounds) || null;
    const distMeters = distanceKm ? Math.round(parseFloat(distanceKm) * 1000) : null;

    const session: TrainingSession = {
      id: nextId(),
      sessionType,
      date: toLocalDateKey(new Date()),
      startedAt: Date.now() - dur * 60 * 1000,
      durationSeconds: dur * 60,
      rounds: roundsVal,
      intensity,
      energyRating: energy,
      sharpnessRating: sharpness,
      notes,
      comboSessionId: null,
      timerPresetId: null,
      comboModeUsed: false,
      partnerName: partnerName.trim() || null,
      coachName: null,
      distanceMeters: distMeters,
      routeDescription: null,
      conditioningType: conditioningType.trim() || null,
      xpEarned: 40,
      createdAt: Date.now(),
    };

    addTrainingSession(session);
    successNotification();
    goBack();
  }, [sessionType, durationMin, rounds, intensity, energy, sharpness, notes, partnerName, conditioningType, distanceKm, addTrainingSession]);

  const renderStars = (value: number, onChange: (v: number) => void) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)}>
          <Text style={[styles.star, star <= value && styles.starActive]}>
            {star <= value ? "\u2605" : "\u2606"}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  const needsPartner = sessionType === "mitt_work" || sessionType === "sparring";
  const needsConditioning = sessionType === "conditioning";
  const needsDistance = sessionType === "roadwork";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="LOG" title="Log Session" />

        {/* Type selector — 3x3 grid */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SESSION TYPE</Text>
          <View style={styles.typeGrid}>
            {SESSION_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => { lightTap(); setSessionType(type); }}
                style={[
                  styles.typeCell,
                  sessionType === type && { borderColor: getSessionTypeColor(type), backgroundColor: "rgba(255,255,255,0.04)" },
                ]}
              >
                <Text style={[
                  styles.typeText,
                  sessionType === type && { color: getSessionTypeColor(type) },
                ]}>
                  {getSessionTypeLabel(type).toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Common fields */}
        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionLabel}>DURATION (MIN)</Text>
            <TextInput
              style={styles.input}
              value={durationMin}
              onChangeText={setDurationMin}
              keyboardType="number-pad"
              placeholder="30"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionLabel}>ROUNDS</Text>
            <TextInput
              style={styles.input}
              value={rounds}
              onChangeText={setRounds}
              keyboardType="number-pad"
              placeholder="--"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* Intensity */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INTENSITY</Text>
          <View style={styles.pillRow}>
            {INTENSITIES.map((i) => (
              <Pressable
                key={i}
                onPress={() => { lightTap(); setIntensity(i); }}
                style={[styles.pill, intensity === i && styles.pillActive]}
              >
                <Text style={[styles.pillText, intensity === i && styles.pillTextActive]}>
                  {i.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Energy & Sharpness */}
        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionLabel}>ENERGY</Text>
            {renderStars(energy, setEnergy)}
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionLabel}>SHARPNESS</Text>
            {renderStars(sharpness, setSharpness)}
          </View>
        </View>

        {/* Type-specific fields */}
        {needsPartner && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PARTNER NAME</Text>
            <TextInput
              style={styles.input}
              value={partnerName}
              onChangeText={setPartnerName}
              placeholder="Training partner"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        )}

        {needsConditioning && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CONDITIONING TYPE</Text>
            <TextInput
              style={styles.input}
              value={conditioningType}
              onChangeText={setConditioningType}
              placeholder="e.g. Skip rope, HIIT"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        )}

        {needsDistance && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DISTANCE (KM)</Text>
            <TextInput
              style={styles.input}
              value={distanceKm}
              onChangeText={setDistanceKm}
              keyboardType="decimal-pad"
              placeholder="5.0"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        )}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTES</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="How did it go?"
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        <Pressable
          onPress={handleSave}
          style={[styles.saveBtn, !sessionType && styles.saveBtnDisabled]}
          disabled={!sessionType}
        >
          <Text style={styles.saveBtnText}>SAVE SESSION</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  section: { marginBottom: spacing["2xl"] },
  sectionLabel: { ...fonts.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  row: { flexDirection: "row", gap: spacing.lg },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  typeCell: {
    width: "31%", paddingVertical: spacing.md, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center",
  },
  typeText: { fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 },
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
  starsRow: { flexDirection: "row", gap: spacing.sm },
  star: { fontSize: 28, color: colors.textMuted },
  starActive: { color: colors.accent },
  saveBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing.lg,
  },
  saveBtnDisabled: { opacity: 0.3 },
  saveBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
