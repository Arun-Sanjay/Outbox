import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { colors, fonts, spacing } from "../../theme";
import { getIntensityColor } from "../../lib/workout-utils";
import { addDays, getTodayKey, getWeekNumber } from "../../lib/date";
import type { Intensity, TrainingSession } from "../../types";

type IntensityChartProps = {
  sessions: TrainingSession[];
  weeks?: number;
  width?: number;
  height?: number;
};

const INTENSITY_ORDER: Intensity[] = ["light", "moderate", "hard", "war"];

export function IntensityChart({
  sessions,
  weeks = 8,
  width = 320,
  height = 140,
}: IntensityChartProps) {
  const padX = 10;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const barGap = 6;

  const weekData = useMemo(() => {
    const today = getTodayKey();
    const result: { label: string; counts: Record<Intensity, number> }[] = [];

    for (let w = weeks - 1; w >= 0; w--) {
      const weekEnd = addDays(today, -w * 7);
      const weekStart = addDays(weekEnd, -6);
      const weekSessions = sessions.filter(
        (s) => s.date >= weekStart && s.date <= weekEnd
      );
      const counts: Record<Intensity, number> = { light: 0, moderate: 0, hard: 0, war: 0 };
      for (const s of weekSessions) {
        counts[s.intensity]++;
      }
      const wn = getWeekNumber(weekEnd);
      result.push({ label: `W${wn}`, counts });
    }
    return result;
  }, [sessions, weeks]);

  const maxTotal = Math.max(1, ...weekData.map((w) =>
    INTENSITY_ORDER.reduce((sum, i) => sum + w.counts[i], 0)
  ));

  const barWidth = (chartW - barGap * (weeks - 1)) / weeks;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {weekData.map((week, wIdx) => {
          const x = padX + wIdx * (barWidth + barGap);
          let y = padY + chartH;
          const total = INTENSITY_ORDER.reduce((s, i) => s + week.counts[i], 0);

          return INTENSITY_ORDER.map((intensity) => {
            const count = week.counts[intensity];
            if (count === 0) return null;
            const segH = (count / maxTotal) * chartH;
            y -= segH;
            return (
              <Rect
                key={`${wIdx}-${intensity}`}
                x={x}
                y={y}
                width={barWidth}
                height={segH}
                rx={2}
                fill={getIntensityColor(intensity)}
                opacity={0.85}
              />
            );
          });
        })}
      </Svg>

      {/* Legend */}
      <View style={styles.legendRow}>
        {INTENSITY_ORDER.map((i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getIntensityColor(i) }]} />
            <Text style={styles.legendText}>{i.charAt(0).toUpperCase() + i.slice(1)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.md },
  legendRow: { flexDirection: "row", gap: spacing.lg },
  legendItem: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: colors.textSecondary },
});
