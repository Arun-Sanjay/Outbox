import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../../src/theme";
import { PageHeader, Panel, MetricValue } from "../../../src/components";
import { SessionTypeIcon, IntensityBadge, StarRating } from "../../../src/components/session";
import { useSessionStore } from "../../../src/stores/useSessionStore";
import {
  formatDurationShort,
  formatRounds,
  getSessionTypeLabel,
} from "../../../src/lib/workout-utils";
import { goBack } from "../../../src/lib/navigation";
import { warningNotification } from "../../../src/lib/haptics";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const history = useSessionStore((s) => s.trainingHistory);
  const deleteSession = useSessionStore((s) => s.deleteTrainingSession);

  const session = history.find((s) => String(s.id) === id);

  if (!session) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Session not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert("Delete Session", "Are you sure you want to delete this session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          warningNotification();
          deleteSession(session.id);
          goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <SessionTypeIcon type={session.sessionType} size={24} />
          <View style={styles.headerContent}>
            <PageHeader
              kicker={session.date}
              title={getSessionTypeLabel(session.sessionType)}
            />
          </View>
        </View>

        {/* Summary panel */}
        <Panel tone="subtle" style={styles.summaryPanel}>
          <View style={styles.metricsRow}>
            <MetricValue
              label="Duration"
              value={Math.round(session.durationSeconds / 60)}
              size="lg"
            />
            {session.rounds !== null && (
              <MetricValue label="Rounds" value={session.rounds} size="lg" />
            )}
            {session.distanceMeters !== null && (
              <MetricValue
                label="Distance (m)"
                value={session.distanceMeters}
                size="lg"
              />
            )}
          </View>
          <View style={styles.badgeRow}>
            <IntensityBadge intensity={session.intensity} />
            {session.comboModeUsed && (
              <View style={styles.comboBadge}>
                <Text style={styles.comboBadgeText}>COMBO MODE</Text>
              </View>
            )}
          </View>
        </Panel>

        {/* Ratings */}
        {(session.energyRating > 0 || session.sharpnessRating > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RATINGS</Text>
            <View style={styles.ratingsRow}>
              {session.energyRating > 0 && (
                <View style={styles.ratingBlock}>
                  <Text style={styles.ratingLabel}>Energy</Text>
                  <StarRating value={session.energyRating} size={18} readonly />
                </View>
              )}
              {session.sharpnessRating > 0 && (
                <View style={styles.ratingBlock}>
                  <Text style={styles.ratingLabel}>Sharpness</Text>
                  <StarRating value={session.sharpnessRating} size={18} readonly />
                </View>
              )}
            </View>
          </View>
        )}

        {/* Partner */}
        {session.partnerName && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PARTNER</Text>
            <Text style={styles.fieldValue}>{session.partnerName}</Text>
          </View>
        )}

        {/* Route */}
        {session.routeDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ROUTE</Text>
            <Text style={styles.fieldValue}>{session.routeDescription}</Text>
          </View>
        )}

        {/* Notes */}
        {session.notes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>NOTES</Text>
            <Text style={styles.fieldValue}>{session.notes}</Text>
          </View>
        )}

        {/* XP */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>XP EARNED</Text>
          <Text style={styles.xpValue}>+{session.xpEarned} XP</Text>
        </View>

        {/* Delete */}
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.deleteText}>DELETE SESSION</Text>
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
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginBottom: spacing.lg },
  headerContent: { flex: 1 },
  summaryPanel: { padding: spacing.xl, marginBottom: spacing["2xl"] },
  metricsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: spacing.lg },
  badgeRow: { flexDirection: "row", gap: spacing.sm, justifyContent: "center" },
  comboBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.accent,
  },
  comboBadgeText: { fontSize: 10, fontWeight: "700", color: colors.accent, letterSpacing: 1 },
  section: { marginBottom: spacing["2xl"] },
  sectionLabel: { ...fonts.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  ratingsRow: { flexDirection: "row", gap: spacing["3xl"] },
  ratingBlock: { gap: spacing.xs },
  ratingLabel: { ...fonts.small, color: colors.textMuted },
  fieldValue: { ...fonts.body },
  xpValue: { fontSize: 20, fontWeight: "800", color: colors.accent },
  deleteBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: spacing.sm, paddingVertical: spacing.lg, marginTop: spacing["2xl"],
  },
  deleteText: { fontSize: 13, fontWeight: "700", color: colors.danger, letterSpacing: 1 },
});
