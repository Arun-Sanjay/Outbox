import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../../theme";
import { addDays, getTodayKey, toLocalDateKey } from "../../lib/date";
import type { TrainingSession } from "../../types";

type HeatMapProps = {
  sessions: TrainingSession[];
  weeks?: number;
};

const CELL_SIZE = 12;
const CELL_GAP = 2;
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getIntensityColor(minutes: number): string {
  if (minutes <= 0) return "rgba(255,255,255,0.03)";
  if (minutes < 15) return "rgba(251,191,36,0.12)";
  if (minutes < 30) return "rgba(251,191,36,0.25)";
  if (minutes < 60) return "rgba(251,191,36,0.45)";
  if (minutes < 90) return "rgba(251,191,36,0.65)";
  return "rgba(251,191,36,0.9)";
}

export function HeatMap({ sessions, weeks = 12 }: HeatMapProps) {
  const grid = useMemo(() => {
    // Build a map of dateKey → total minutes
    const minutesByDate: Map<string, number> = new Map();
    for (const s of sessions) {
      const existing = minutesByDate.get(s.date) ?? 0;
      minutesByDate.set(s.date, existing + Math.round(s.durationSeconds / 60));
    }

    // Calculate grid: 12 weeks ending today
    const today = getTodayKey();
    const todayDate = new Date(today + "T00:00:00");
    const todayDow = todayDate.getDay() || 7; // Mon=1, Sun=7
    const gridEnd = today;
    const totalDays = weeks * 7;
    const gridStart = addDays(gridEnd, -(totalDays - 1) + (7 - todayDow));

    const columns: { date: string; minutes: number }[][] = [];
    let currentDate = gridStart;

    for (let w = 0; w < weeks; w++) {
      const column: { date: string; minutes: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const minutes = minutesByDate.get(currentDate) ?? 0;
        column.push({ date: currentDate, minutes });
        currentDate = addDays(currentDate, 1);
      }
      columns.push(column);
    }

    return columns;
  }, [sessions, weeks]);

  return (
    <View style={styles.container}>
      {/* Day labels */}
      <View style={styles.dayLabelsCol}>
        {DAY_LABELS.map((label, i) => (
          <View key={i} style={[styles.cell, styles.labelCell]}>
            <Text style={styles.dayLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        {grid.map((column, w) => (
          <View key={w} style={styles.column}>
            {column.map((cell, d) => (
              <View
                key={`${w}-${d}`}
                style={[
                  styles.cell,
                  { backgroundColor: getIntensityColor(cell.minutes) },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: CELL_GAP,
  },
  dayLabelsCol: {
    gap: CELL_GAP,
    marginRight: spacing.xs,
  },
  labelCell: {
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  dayLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: "500",
  },
  gridContainer: {
    flexDirection: "row",
    gap: CELL_GAP,
  },
  column: {
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
  },
});
