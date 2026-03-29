import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Panel, MetricValue, SectionHeader } from "../../components";
import { DonutChart } from "./DonutChart";
import { colors, fonts, spacing } from "../../theme";
import { getWeightClassLabel } from "../../lib/weight-class";
import type { Fight, WeightClass } from "../../types";

type FightAnalyticsProps = {
  fights: Fight[];
};

export function FightAnalytics({ fights }: FightAnalyticsProps) {
  const stats = useMemo(() => {
    if (fights.length === 0) return null;

    // Win rate by method
    const wins = fights.filter((f) => f.result === "win");
    const methodCounts: Record<string, number> = {};
    for (const w of wins) {
      const method = w.method ?? "decision";
      methodCounts[method] = (methodCounts[method] ?? 0) + 1;
    }
    const methodSegments = Object.entries(methodCounts).map(([method, count]) => ({
      label: method.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: count,
      color: method.includes("ko") ? colors.danger : method.includes("tko") ? colors.intensityHard : colors.accent,
    }));

    // Avg fight length
    const totalRounds = fights.reduce((s, f) => s + (f.endedRound ?? f.scheduledRounds), 0);
    const avgLength = Math.round((totalRounds / fights.length) * 10) / 10;

    // Performance by weight class
    const byClass: Map<WeightClass, { w: number; l: number }> = new Map();
    for (const f of fights) {
      if (!byClass.has(f.weightClass)) byClass.set(f.weightClass, { w: 0, l: 0 });
      const rec = byClass.get(f.weightClass)!;
      if (f.result === "win") rec.w++;
      else if (f.result === "loss") rec.l++;
    }

    // Win/loss timeline (dots)
    const timeline = [...fights]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((f) => ({
        date: f.date,
        result: f.result,
        color: f.result === "win" ? colors.win : f.result === "loss" ? colors.loss : colors.draw,
      }));

    return { methodSegments, avgLength, byClass: Array.from(byClass.entries()), timeline };
  }, [fights]);

  if (!stats) return null;

  return (
    <View style={styles.container}>
      <SectionHeader title="FIGHT ANALYTICS" />

      {/* Win by method donut */}
      {stats.methodSegments.length > 0 && (
        <Panel tone="subtle" style={styles.panel}>
          <Text style={styles.sectionLabel}>WINS BY METHOD</Text>
          <DonutChart
            segments={stats.methodSegments}
            size={140}
            strokeWidth={16}
            centerValue={fights.filter((f) => f.result === "win").length}
            centerLabel="WINS"
          />
        </Panel>
      )}

      {/* Avg fight length */}
      <View style={styles.metricsRow}>
        <MetricValue label="Avg Fight Length" value={stats.avgLength} size="md" />
        <MetricValue label="Total Fights" value={fights.length} size="md" />
      </View>

      {/* Performance by class */}
      {stats.byClass.length > 0 && (
        <Panel tone="subtle" style={styles.panel}>
          <Text style={styles.sectionLabel}>BY WEIGHT CLASS</Text>
          {stats.byClass.map(([wc, rec]) => (
            <View key={wc} style={styles.classRow}>
              <Text style={styles.className}>{getWeightClassLabel(wc)}</Text>
              <View style={styles.classRecord}>
                <Text style={[styles.classCount, { color: colors.win }]}>{rec.w}W</Text>
                <Text style={[styles.classCount, { color: colors.loss }]}>{rec.l}L</Text>
              </View>
            </View>
          ))}
        </Panel>
      )}

      {/* Timeline */}
      {stats.timeline.length > 0 && (
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionLabel}>FIGHT TIMELINE</Text>
          <View style={styles.timelineDots}>
            {stats.timeline.map((t, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: t.color }]} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing["2xl"] },
  panel: { padding: spacing.xl },
  sectionLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2, marginBottom: spacing.md },
  metricsRow: { flexDirection: "row", justifyContent: "space-around" },
  classRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  className: { fontSize: 13, color: colors.textSecondary },
  classRecord: { flexDirection: "row", gap: spacing.md },
  classCount: { fontSize: 13, fontWeight: "700" },
  timelineContainer: { gap: spacing.sm },
  timelineDots: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  dot: { width: 12, height: 12, borderRadius: 6 },
});
