import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { PageHeader, Panel, MetricValue } from "../../src/components";
import { StarRating } from "../../src/components/session";
import { useFightStore } from "../../src/stores/useFightStore";
import { getWeightClassLabel } from "../../src/lib/weight-class";
import { warningNotification } from "../../src/lib/haptics";
import { goBack } from "../../src/lib/navigation";

const RESULT_COLORS: Record<string, string> = {
  win: colors.win, loss: colors.loss, draw: colors.draw, no_contest: colors.textMuted,
};

export default function FightDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fight = useFightStore((s) => s.getFightById(parseInt(id ?? "0")));
  const deleteFight = useFightStore((s) => s.deleteFight);

  if (!fight) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Fight not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const resultColor = RESULT_COLORS[fight.result] ?? colors.textMuted;

  const handleDelete = () => {
    Alert.alert("Delete Fight", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { warningNotification(); deleteFight(fight.id); goBack(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Result hero */}
        <View style={styles.heroSection}>
          <Text style={[styles.resultHero, { color: resultColor }]}>
            {fight.result.toUpperCase()}
          </Text>
          {fight.method && (
            <Text style={styles.methodText}>{fight.method.replace(/_/g, " ").toUpperCase()}</Text>
          )}
          {fight.endedRound && (
            <Text style={styles.stoppageText}>Round {fight.endedRound}{fight.endedTime ? ` at ${fight.endedTime}` : ""}</Text>
          )}
        </View>

        <PageHeader
          kicker={`${fight.fightType.toUpperCase()} \u00B7 ${fight.date}`}
          title={`vs ${fight.opponentName}`}
          subtitle={fight.location || undefined}
        />

        {/* Stats */}
        <Panel tone="subtle" style={styles.statsPanel}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>WEIGHT CLASS</Text>
              <Text style={styles.statValue}>{getWeightClassLabel(fight.weightClass)}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>ROUNDS</Text>
              <Text style={styles.statValue}>{fight.scheduledRounds}</Text>
            </View>
            {fight.weighInWeight && (
              <View style={styles.stat}>
                <Text style={styles.statLabel}>WEIGH-IN</Text>
                <Text style={styles.statValue}>{fight.weighInWeight} lb</Text>
              </View>
            )}
          </View>
          {fight.opponentRecord && (
            <View style={styles.stat}>
              <Text style={styles.statLabel}>OPPONENT RECORD</Text>
              <Text style={styles.statValue}>{fight.opponentRecord}</Text>
            </View>
          )}
        </Panel>

        {/* Corner */}
        {fight.cornerCoach && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CORNER COACH</Text>
            <Text style={styles.fieldValue}>{fight.cornerCoach}</Text>
          </View>
        )}

        {/* Notes */}
        {fight.notesWorked.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>WHAT WORKED</Text>
            <Text style={styles.fieldValue}>{fight.notesWorked}</Text>
          </View>
        )}
        {fight.notesImprove.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>WHAT TO IMPROVE</Text>
            <Text style={styles.fieldValue}>{fight.notesImprove}</Text>
          </View>
        )}
        {fight.generalNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>NOTES</Text>
            <Text style={styles.fieldValue}>{fight.generalNotes}</Text>
          </View>
        )}

        {/* Ratings */}
        {(fight.physicalRating > 0 || fight.mentalRating > 0) && (
          <View style={styles.ratingsRow}>
            {fight.physicalRating > 0 && (
              <View style={styles.ratingBlock}>
                <Text style={styles.ratingLabel}>Physical</Text>
                <StarRating value={fight.physicalRating} size={18} readonly />
              </View>
            )}
            {fight.mentalRating > 0 && (
              <View style={styles.ratingBlock}>
                <Text style={styles.ratingLabel}>Mental</Text>
                <StarRating value={fight.mentalRating} size={18} readonly />
              </View>
            )}
          </View>
        )}

        {/* XP */}
        <View style={styles.section}>
          <Text style={styles.xpValue}>+{fight.xpEarned} XP</Text>
        </View>

        {/* Delete */}
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.deleteText}>DELETE FIGHT</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFoundText: { ...fonts.heading, color: colors.textMuted },
  heroSection: { alignItems: "center", marginBottom: spacing["2xl"] },
  resultHero: { fontSize: 48, fontWeight: "800", letterSpacing: 4 },
  methodText: { fontSize: 16, fontWeight: "700", color: colors.textSecondary, letterSpacing: 2, marginTop: spacing.xs },
  stoppageText: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  statsPanel: { padding: spacing.xl, marginBottom: spacing["2xl"] },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: spacing.lg },
  stat: { alignItems: "center", gap: 4 },
  statLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 1 },
  statValue: { fontSize: 16, fontWeight: "700", color: colors.text },
  section: { marginBottom: spacing["2xl"] },
  sectionLabel: { ...fonts.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  fieldValue: { ...fonts.body },
  ratingsRow: { flexDirection: "row", gap: spacing["3xl"], marginBottom: spacing["2xl"] },
  ratingBlock: { gap: spacing.xs },
  ratingLabel: { ...fonts.small, color: colors.textMuted },
  xpValue: { fontSize: 20, fontWeight: "800", color: colors.accent, textAlign: "center" },
  deleteBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: spacing.sm, paddingVertical: spacing.lg, marginTop: spacing.xl,
  },
  deleteText: { fontSize: 13, fontWeight: "700", color: colors.danger, letterSpacing: 1 },
});
