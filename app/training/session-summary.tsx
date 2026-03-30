import React, { useState } from "react";
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
import { PageHeader, Panel, MetricValue } from "../../src/components";
import { StreakDisplay, XPBar } from "../../src/components/gamification";
import { AchievementPopup, LevelUpCelebration } from "../../src/components/gamification";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { useCelebrationStore } from "../../src/stores/useCelebrationStore";
import { getSessionTypeLabel } from "../../src/lib/workout-utils";
import { successNotification } from "../../src/lib/haptics";
import { goToHQ } from "../../src/lib/navigation";
import type { Intensity } from "../../src/types";

const INTENSITIES: Intensity[] = ["light", "moderate", "hard", "war"];

export default function SessionSummaryScreen() {
  const history = useSessionStore((s) => s.trainingHistory);
  const updateSession = useSessionStore((s) => s.updateTrainingSession);
  const profile = useProfileStore((s) => s.profile);
  const celebration = useCelebrationStore((s) => s.current);
  const dismissCelebration = useCelebrationStore((s) => s.dismiss);

  const session = history[0];

  const [intensity, setIntensity] = useState<Intensity>(session?.intensity ?? "moderate");
  const [energy, setEnergy] = useState(session?.energyRating ?? 0);
  const [sharpness, setSharpness] = useState(session?.sharpnessRating ?? 0);
  const [notes, setNotes] = useState(session?.notes ?? "");

  if (!session) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No session to summarize</Text>
          <Pressable onPress={goToHQ} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>BACK TO HOME</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    updateSession(session.id, {
      intensity,
      energyRating: energy,
      sharpnessRating: sharpness,
      notes,
    });
    successNotification();
    goToHQ();
  };

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

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Celebration overlays */}
      {celebration?.type === "achievement" && (
        <AchievementPopup
          achievement={celebration.achievement}
          onClaim={dismissCelebration}
        />
      )}
      {celebration?.type === "rank_up" && (
        <LevelUpCelebration
          rank={celebration.rank}
          onDismiss={dismissCelebration}
        />
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader
          kicker="SESSION COMPLETE"
          title={getSessionTypeLabel(session.sessionType)}
          subtitle={`+${session.xpEarned} XP`}
        />

        {/* Stats */}
        <Panel style={styles.statsPanel}>
          <View style={styles.metricsRow}>
            <MetricValue label="Duration" value={Math.round(session.durationSeconds / 60)} size="lg" color={colors.accent} animated />
            {session.rounds !== null && (
              <MetricValue label="Rounds" value={session.rounds} size="lg" animated />
            )}
            {session.distanceMeters !== null && (
              <MetricValue label="Distance (m)" value={session.distanceMeters} size="lg" animated />
            )}
          </View>
        </Panel>

        {/* Combo stats (if combo session) */}
        {session.comboModeUsed && (
          <Panel tone="subtle" style={styles.comboPanel}>
            <Text style={styles.sectionLabel}>COMBO SESSION</Text>
            <Text style={styles.comboNote}>Combos drilled with callouts</Text>
          </Panel>
        )}

        {/* Intensity */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INTENSITY</Text>
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

        {/* Ratings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ENERGY LEVEL</Text>
          {renderStars(energy, setEnergy)}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SHARPNESS</Text>
          {renderStars(sharpness, setSharpness)}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTES</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="How did you feel? What went well?"
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        {/* XP + Streak */}
        <Panel tone="subtle" style={styles.xpPanel}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>XP EARNED</Text>
            <Text style={styles.xpValue}>+{session.xpEarned}</Text>
          </View>
          {profile && (
            <XPBar currentXP={profile.totalXP} />
          )}
          {profile && profile.currentStreak > 0 && (
            <View style={styles.streakRow}>
              <StreakDisplay days={profile.currentStreak} compact />
            </View>
          )}
        </Panel>

        <Pressable onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>DONE</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing["2xl"] },
  emptyText: { ...fonts.heading, color: colors.textMuted },
  statsPanel: { padding: spacing.xl, marginBottom: spacing["2xl"] },
  metricsRow: { flexDirection: "row", justifyContent: "space-around" },
  comboPanel: { padding: spacing.lg, marginBottom: spacing["2xl"] },
  comboNote: { ...fonts.small, color: colors.textSecondary, marginTop: spacing.xs },
  section: { marginBottom: spacing["2xl"] },
  sectionLabel: { ...fonts.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  pillRow: { flexDirection: "row", gap: spacing.sm },
  pill: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center",
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { fontSize: 11, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 },
  pillTextActive: { color: "#000000" },
  starsRow: { flexDirection: "row", gap: spacing.md },
  star: { fontSize: 32, color: colors.textMuted },
  starActive: { color: colors.accent },
  notesInput: {
    minHeight: 100, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    padding: spacing.lg, fontSize: 16, color: colors.text, textAlignVertical: "top",
  },
  xpPanel: { padding: spacing.xl, marginBottom: spacing["2xl"], gap: spacing.lg },
  xpRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  xpLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2 },
  xpValue: { fontSize: 24, fontWeight: "800", color: colors.accent },
  streakRow: { marginTop: spacing.sm },
  saveBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing.lg,
  },
  saveBtnText: { fontSize: 18, fontWeight: "800", color: "#000000", letterSpacing: 2 },
  doneBtn: {
    paddingHorizontal: spacing["3xl"], paddingVertical: spacing.lg,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.accent,
  },
  doneBtnText: { fontSize: 14, fontWeight: "700", color: colors.accent, letterSpacing: 2 },
});
