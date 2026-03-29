import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { colors, fonts, spacing } from "../../theme";
import { addDays, getTodayKey } from "../../lib/date";
import type { TrainingSession } from "../../types";

type VolumeChartProps = {
  sessions: TrainingSession[];
  weeks?: number;
  width?: number;
  height?: number;
};

export function VolumeChart({
  sessions,
  weeks = 8,
  width = 320,
  height = 120,
}: VolumeChartProps) {
  const padX = 10;
  const padY = 10;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const weeklyMinutes = useMemo(() => {
    const today = getTodayKey();
    const result: number[] = [];
    for (let w = weeks - 1; w >= 0; w--) {
      const weekEnd = addDays(today, -w * 7);
      const weekStart = addDays(weekEnd, -6);
      const minutes = sessions
        .filter((s) => s.date >= weekStart && s.date <= weekEnd)
        .reduce((sum, s) => sum + Math.round(s.durationSeconds / 60), 0);
      result.push(minutes);
    }
    return result;
  }, [sessions, weeks]);

  const maxMinutes = Math.max(1, ...weeklyMinutes);

  const pathD = useMemo(() => {
    if (weeklyMinutes.length < 2) return "";
    const xStep = chartW / (weeklyMinutes.length - 1);
    const points = weeklyMinutes.map((m, i) => ({
      x: padX + i * xStep,
      y: padY + chartH - (m / maxMinutes) * chartH,
    }));
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [weeklyMinutes, chartW, chartH, maxMinutes, padX, padY]);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="vol-grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.accent} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d={pathD}
          fill="none"
          stroke="url(#vol-grad)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={styles.axisLabel}>Training minutes per week</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.sm },
  axisLabel: { fontSize: 10, color: colors.textMuted, letterSpacing: 1 },
});
