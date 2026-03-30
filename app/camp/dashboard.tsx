import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel, MetricValue, SectionHeader } from "../../src/components";
import { WeightEntryModal } from "../../src/components/weight";
import { useCampStore } from "../../src/stores/useCampStore";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { daysUntil } from "../../src/lib/date";
import { getWeightClassLabel } from "../../src/lib/weight-class";
import { lightTap, mediumTap } from "../../src/lib/haptics";
import { goToWeightCut, goBack } from "../../src/lib/navigation";

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export default function CampDashboardScreen() {
  const activeCamp = useCampStore((s) => s.activeCamp);
  const calculateStatus = useCampStore((s) => s.calculateWeightCutStatus);
  const sessions = useSessionStore((s) => s.trainingHistory);
  const [showWeightModal, setShowWeightModal] = useState(false);

  if (!activeCamp) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.emptyContainer}>
          <PageHeader kicker="CAMP" title="No Active Camp" />
          <Text style={styles.emptyText}>Set up a fight camp to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  const daysLeft = daysUntil(activeCamp.fightDate);
  const status = calculateStatus(activeCamp.id);
  const remaining = status?.remaining ?? 0;
  const pctComplete = status?.percentComplete ?? 0;

  // Camp training stats
  const campSessions = sessions.filter(
    (s) => s.date >= activeCamp.startDate && s.date <= activeCamp.fightDate
  );
  const totalCampSessions = campSessions.length;
  const totalCampRounds = campSessions.reduce((sum, s) => sum + (s.rounds ?? 0), 0);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <WeightEntryModal
        visible={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        fightCampId={activeCamp.id}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader
          kicker="FIGHT CAMP"
          title={activeCamp.opponentName ? `vs ${activeCamp.opponentName}` : "Fight Camp"}
          subtitle={`${getWeightClassLabel(activeCamp.weightClass)} \u00B7 ${activeCamp.fightDate}`}
        />

        {/* Countdown hero */}
        <Panel style={styles.countdownPanel}>
          <Text style={styles.countdownKicker}>DAYS TO FIGHT NIGHT</Text>
          <Text style={styles.countdownValue}>{Math.max(0, daysLeft)}</Text>
          {daysLeft <= 0 && <Text style={styles.fightDay}>FIGHT DAY</Text>}
        </Panel>

        {/* Weight progress */}
        <SectionHeader title="WEIGHT CUT" right={`${remaining.toFixed(1)} lb to go`} />
        <Panel tone="subtle" style={styles.weightPanel}>
          <View style={styles.weightRow}>
            <View style={styles.weightStat}>
              <Text style={styles.weightLabel}>CURRENT</Text>
              <Text style={styles.weightValue}>{activeCamp.currentWeight}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(100, pctComplete)}%` }]} />
              </View>
            </View>
            <View style={styles.weightStat}>
              <Text style={styles.weightLabel}>TARGET</Text>
              <Text style={styles.weightValue}>{activeCamp.targetWeight}</Text>
            </View>
          </View>
        </Panel>

        {/* Camp training stats */}
        <SectionHeader title="CAMP TRAINING" />
        <View style={styles.metricsRow}>
          <MetricValue label="Sessions" value={totalCampSessions} size="md" animated />
          <MetricValue label="Rounds" value={totalCampRounds} size="md" animated />
          <MetricValue label="Days Left" value={Math.max(0, daysLeft)} size="md" color={colors.accent} animated />
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => { lightTap(); setShowWeightModal(true); }}
            style={styles.actionBtn}
          >
            <Text style={styles.actionText}>LOG WEIGHT</Text>
          </Pressable>
          <Pressable
            onPress={() => { lightTap(); goToWeightCut(); }}
            style={styles.actionBtn}
          >
            <Text style={styles.actionText}>WEIGHT CUT</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => { mediumTap(); goBack(); }}
          style={styles.endBtn}
        >
          <Text style={styles.endText}>END CAMP</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  emptyContainer: { flex: 1, padding: spacing.xl, justifyContent: "center", alignItems: "center" },
  emptyText: { ...fonts.body, color: colors.textMuted },
  countdownPanel: { padding: spacing["3xl"], alignItems: "center", marginBottom: spacing["2xl"] },
  countdownKicker: { fontSize: 10, fontWeight: "700", color: colors.accent, letterSpacing: 3, marginBottom: spacing.md },
  countdownValue: {
    fontSize: 72, fontWeight: "800", color: colors.accent,
    fontFamily: monoFont, fontVariant: ["tabular-nums"],
  },
  fightDay: { fontSize: 16, fontWeight: "800", color: colors.accent, letterSpacing: 3, marginTop: spacing.sm },
  weightPanel: { padding: spacing.xl, marginBottom: spacing["2xl"] },
  weightRow: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  weightStat: { alignItems: "center" },
  weightLabel: { fontSize: 9, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5 },
  weightValue: { fontSize: 20, fontWeight: "800", color: colors.text, fontFamily: monoFont, fontVariant: ["tabular-nums"], marginTop: 4 },
  progressBarContainer: { flex: 1 },
  progressBar: { height: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, backgroundColor: colors.accent, borderRadius: 3 },
  metricsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: spacing["3xl"] },
  actionsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing["2xl"] },
  actionBtn: {
    flex: 1, height: TOUCH_MIN, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.accent, alignItems: "center", justifyContent: "center",
  },
  actionText: { fontSize: 13, fontWeight: "700", color: colors.accent, letterSpacing: 2 },
  endBtn: {
    height: TOUCH_MIN, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center", justifyContent: "center",
  },
  endText: { fontSize: 13, fontWeight: "700", color: colors.textMuted, letterSpacing: 2 },
});
