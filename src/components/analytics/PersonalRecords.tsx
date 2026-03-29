import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Panel } from "../../components";
import { colors, fonts, spacing } from "../../theme";
import type { TrainingSession } from "../../types";

type PersonalRecordsProps = {
  sessions: TrainingSession[];
  longestStreak: number;
};

type RecordItem = {
  name: string;
  value: string;
  date: string;
};

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export function PersonalRecords({ sessions, longestStreak }: PersonalRecordsProps) {
  const records = useMemo((): RecordItem[] => {
    if (sessions.length === 0) {
      return [
        { name: "Longest Streak", value: `${longestStreak}`, date: "--" },
        { name: "Most Rounds", value: "--", date: "--" },
        { name: "Most Sessions/Week", value: "--", date: "--" },
        { name: "Longest Session", value: "--", date: "--" },
        { name: "Most Combos", value: "--", date: "--" },
        { name: "Heaviest Sparring", value: "--", date: "--" },
      ];
    }

    // Most rounds in a single session
    let mostRounds = 0;
    let mostRoundsDate = "--";
    for (const s of sessions) {
      if ((s.rounds ?? 0) > mostRounds) {
        mostRounds = s.rounds ?? 0;
        mostRoundsDate = s.date;
      }
    }

    // Most sessions in a week
    const weekMap: Map<string, number> = new Map();
    for (const s of sessions) {
      const weekKey = s.date.slice(0, 7); // rough grouping by month
      weekMap.set(weekKey, (weekMap.get(weekKey) ?? 0) + 1);
    }
    let mostSessionsWeek = 0;
    for (const count of weekMap.values()) {
      if (count > mostSessionsWeek) mostSessionsWeek = count;
    }

    // Longest session
    let longestSession = 0;
    let longestSessionDate = "--";
    for (const s of sessions) {
      if (s.durationSeconds > longestSession) {
        longestSession = s.durationSeconds;
        longestSessionDate = s.date;
      }
    }
    const longestMin = Math.round(longestSession / 60);

    // Most combos in a session (estimated from combo sessions)
    let mostCombos = 0;
    let mostCombosDate = "--";
    for (const s of sessions) {
      if (s.comboModeUsed && (s.rounds ?? 0) > mostCombos) {
        mostCombos = s.rounds ?? 0;
        mostCombosDate = s.date;
      }
    }

    // Heaviest sparring (highest intensity sparring)
    const sparring = sessions.filter((s) => s.sessionType === "sparring");
    const heaviest = sparring.find((s) => s.intensity === "war") ?? sparring[0];

    return [
      { name: "Longest Streak", value: `${longestStreak}d`, date: "--" },
      { name: "Most Rounds", value: `${mostRounds}`, date: mostRoundsDate },
      { name: "Most Sessions/Week", value: `${mostSessionsWeek}`, date: "--" },
      { name: "Longest Session", value: `${longestMin}m`, date: longestSessionDate },
      { name: "Most Combos", value: mostCombos > 0 ? `${mostCombos}` : "--", date: mostCombosDate },
      { name: "Heaviest Sparring", value: heaviest ? heaviest.intensity.toUpperCase() : "--", date: heaviest?.date ?? "--" },
    ];
  }, [sessions, longestStreak]);

  return (
    <View style={styles.grid}>
      {records.map((record) => (
        <Panel key={record.name} tone="subtle" style={styles.recordPanel}>
          <Text style={styles.recordName}>{record.name}</Text>
          <Text style={styles.recordValue}>{record.value}</Text>
          <Text style={styles.recordDate}>{record.date}</Text>
        </Panel>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  recordPanel: {
    width: "47%",
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
  },
  recordName: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  recordValue: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: monoFont,
    color: colors.accent,
    fontVariant: ["tabular-nums"],
  },
  recordDate: {
    fontSize: 10,
    color: colors.textMuted,
  },
});
