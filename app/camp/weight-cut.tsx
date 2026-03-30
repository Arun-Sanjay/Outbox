import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { WeightChart, WeightEntryModal } from "../../src/components/weight";
import { useCampStore } from "../../src/stores/useCampStore";
import { useWeightStore } from "../../src/stores/useWeightStore";
import { daysUntil } from "../../src/lib/date";
import { lightTap } from "../../src/lib/haptics";

export default function WeightCutScreen() {
  const activeCamp = useCampStore((s) => s.activeCamp);
  const allEntries = useWeightStore((s) => s.entries);
  const [showModal, setShowModal] = useState(false);

  if (!activeCamp) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active fight camp</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Filter entries to camp period
  const campEntries = useMemo(
    () => allEntries.filter(
      (e) => e.date >= activeCamp.startDate && (e.fightCampId === activeCamp.id || e.date <= activeCamp.fightDate)
    ),
    [allEntries, activeCamp]
  );

  const daysLeft = daysUntil(activeCamp.fightDate);
  const latestWeight = campEntries.length > 0 ? campEntries[0].weight : activeCamp.currentWeight;
  const remaining = latestWeight - activeCamp.targetWeight;
  const ratePerDay = daysLeft > 0 ? remaining / daysLeft : 0;
  const ratePerWeek = ratePerDay * 7;
  const isCuttingTooFast = ratePerWeek > 3; // > 3 lb/week is aggressive

  // Projected fight day weight (linear)
  const projectedWeight = daysLeft > 0
    ? latestWeight - (ratePerDay * daysLeft)
    : latestWeight;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <WeightEntryModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        fightCampId={activeCamp.id}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader
          kicker="WEIGHT CUT"
          title="Track Your Cut"
          subtitle={`Target: ${activeCamp.targetWeight} lb by ${activeCamp.fightDate}`}
        />

        {/* Weight chart */}
        <SectionHeader title="WEIGHT TREND" right={`${campEntries.length} entries`} />
        <Panel tone="subtle" style={styles.chartPanel}>
          <WeightChart
            entries={campEntries}
            targetWeight={activeCamp.targetWeight}
          />
        </Panel>

        {/* Stats */}
        <SectionHeader title="CUT STATUS" />
        <Panel tone="subtle" style={styles.statsPanel}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{latestWeight}</Text>
              <Text style={styles.statLabel}>CURRENT</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeCamp.targetWeight}</Text>
              <Text style={styles.statLabel}>TARGET</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, remaining <= 0 && styles.statGreen]}>
                {remaining > 0 ? remaining.toFixed(1) : "MADE"}
              </Text>
              <Text style={styles.statLabel}>REMAINING</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.max(0, daysLeft)}</Text>
              <Text style={styles.statLabel}>DAYS LEFT</Text>
            </View>
          </View>
        </Panel>

        {/* Rate warning */}
        {isCuttingTooFast && remaining > 0 && (
          <Panel tone="subtle" style={styles.warningPanel}>
            <Text style={styles.warningTitle}>CUTTING TOO FAST</Text>
            <Text style={styles.warningText}>
              You need to lose {ratePerWeek.toFixed(1)} lb/week. Consider spreading the cut or consulting your coach.
            </Text>
          </Panel>
        )}

        {/* Projected */}
        {daysLeft > 0 && (
          <View style={styles.projectedSection}>
            <Text style={styles.projectedLabel}>PROJECTED FIGHT DAY WEIGHT</Text>
            <Text style={[styles.projectedValue, projectedWeight <= activeCamp.targetWeight && styles.statGreen]}>
              {projectedWeight.toFixed(1)} lb
            </Text>
          </View>
        )}

        {/* Daily log */}
        <SectionHeader title="WEIGH-IN LOG" />
        {campEntries.length === 0 ? (
          <Text style={styles.noEntries}>No weigh-ins logged for this camp</Text>
        ) : (
          campEntries.map((entry) => (
            <View key={entry.id} style={styles.logRow}>
              <Text style={styles.logDate}>{entry.date}</Text>
              <Text style={styles.logWeight}>{entry.weight} {entry.unit}</Text>
              {entry.notes ? <Text style={styles.logNotes}>{entry.notes}</Text> : null}
            </View>
          ))
        )}

        <Pressable
          onPress={() => { lightTap(); setShowModal(true); }}
          style={styles.logBtn}
        >
          <Text style={styles.logBtnText}>LOG WEIGH-IN</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { ...fonts.heading, color: colors.textMuted },
  chartPanel: { padding: spacing.lg, marginBottom: spacing["2xl"] },
  statsPanel: { padding: spacing.xl, marginBottom: spacing["2xl"] },
  statsGrid: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center", gap: 4 },
  statValue: { fontSize: 20, fontWeight: "800", color: colors.text },
  statGreen: { color: colors.win },
  statLabel: { fontSize: 9, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5 },
  warningPanel: { padding: spacing.lg, marginBottom: spacing["2xl"], borderColor: colors.danger },
  warningTitle: { fontSize: 12, fontWeight: "800", color: colors.danger, letterSpacing: 2, marginBottom: spacing.sm },
  warningText: { ...fonts.small, color: colors.textSecondary },
  projectedSection: { alignItems: "center", marginBottom: spacing["2xl"], gap: spacing.xs },
  projectedLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2 },
  projectedValue: { fontSize: 28, fontWeight: "800", color: colors.text },
  noEntries: { ...fonts.small, color: colors.textMuted, textAlign: "center", paddingVertical: spacing.lg },
  logRow: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.panelBorder,
  },
  logDate: { fontSize: 13, color: colors.textSecondary, width: 90 },
  logWeight: { fontSize: 16, fontWeight: "700", color: colors.text },
  logNotes: { fontSize: 12, color: colors.textMuted, flex: 1 },
  logBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing["2xl"],
  },
  logBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
