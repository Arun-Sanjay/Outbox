import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Panel, MetricValue } from "../../components";
import { useSessionStore } from "../../stores/useSessionStore";
import { spacing } from "../../theme";
import { addDays, getTodayKey } from "../../lib/date";
import type { TimeRange } from "./TimeRangeToggle";
import type { TrainingSession } from "../../types";

type TrainingOverviewProps = {
  range: TimeRange;
};

function filterByRange(sessions: TrainingSession[], range: TimeRange): TrainingSession[] {
  if (range === "all") return sessions;
  const today = getTodayKey();
  const days = range === "week" ? 7 : 30;
  const cutoff = addDays(today, -days);
  return sessions.filter((s) => s.date >= cutoff);
}

export function TrainingOverview({ range }: TrainingOverviewProps) {
  const history = useSessionStore((s) => s.trainingHistory);

  const stats = useMemo(() => {
    const filtered = filterByRange(history, range);
    const totalSessions = filtered.length;
    const totalRounds = filtered.reduce((sum, s) => sum + (s.rounds ?? 0), 0);
    const totalSeconds = filtered.reduce((sum, s) => sum + s.durationSeconds, 0);
    const totalHours = Math.round((totalSeconds / 3600) * 10) / 10;

    let avgPerWeek = 0;
    if (filtered.length > 0) {
      const days = range === "week" ? 7 : range === "month" ? 30 : (() => {
        const oldest = filtered[filtered.length - 1].date;
        const newest = filtered[0].date;
        const ms = new Date(newest + "T00:00:00").getTime() - new Date(oldest + "T00:00:00").getTime();
        return Math.max(7, ms / (24 * 60 * 60 * 1000));
      })();
      const weeks = Math.max(1, (typeof days === "number" ? days : 7) / 7);
      avgPerWeek = Math.round((totalSessions / weeks) * 10) / 10;
    }

    return { totalSessions, totalRounds, totalHours, avgPerWeek };
  }, [history, range]);

  return (
    <Panel style={styles.panel}>
      <View style={styles.metricsRow}>
        <MetricValue label="Sessions" value={stats.totalSessions} size="lg" animated />
        <MetricValue label="Rounds" value={stats.totalRounds} size="lg" animated />
        <MetricValue label="Hours" value={stats.totalHours} size="lg" animated />
        <MetricValue label="Avg/Week" value={stats.avgPerWeek} size="lg" animated />
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  panel: { padding: spacing.xl, marginBottom: spacing["2xl"] },
  metricsRow: { flexDirection: "row", justifyContent: "space-around" },
});
