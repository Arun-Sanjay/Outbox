import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";
import { colors, fonts, spacing } from "../../theme";
import type { WeightEntry } from "../../types";

type WeightChartProps = {
  entries: WeightEntry[];
  targetWeight?: number | null;
  width?: number;
  height?: number;
};

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export function WeightChart({
  entries,
  targetWeight = null,
  width = 320,
  height = 160,
}: WeightChartProps) {
  const padX = 40;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries]
  );

  const { pathD, points, minW, maxW } = useMemo(() => {
    if (sorted.length < 2) return { pathD: "", points: [], minW: 0, maxW: 0 };

    const weights = sorted.map((e) => e.weight);
    let lo = Math.min(...weights);
    let hi = Math.max(...weights);
    if (targetWeight !== null) {
      lo = Math.min(lo, targetWeight);
      hi = Math.max(hi, targetWeight);
    }
    const range = hi - lo || 1;
    lo -= range * 0.1;
    hi += range * 0.1;
    const finalRange = hi - lo;

    const xStep = chartW / (sorted.length - 1);
    const pts = sorted.map((e, i) => ({
      x: padX + i * xStep,
      y: padY + chartH - ((e.weight - lo) / finalRange) * chartH,
      weight: e.weight,
      date: e.date,
    }));

    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return { pathD: d, points: pts, minW: lo, maxW: hi };
  }, [sorted, targetWeight, chartW, chartH, padX, padY]);

  if (sorted.length < 2) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Log at least 2 weigh-ins to see chart</Text>
      </View>
    );
  }

  const targetY = targetWeight !== null
    ? padY + chartH - ((targetWeight - minW) / (maxW - minW)) * chartH
    : null;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="weight-grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.accent} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Target line (dashed gold) */}
        {targetY !== null && (
          <Line
            x1={padX}
            y1={targetY}
            x2={width - padX}
            y2={targetY}
            stroke={colors.accent}
            strokeWidth={1}
            strokeDasharray="6,4"
            opacity={0.5}
          />
        )}

        {/* Weight line */}
        <Path
          d={pathD}
          fill="none"
          stroke="url(#weight-grad)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3} fill={colors.accent} />
        ))}
      </Svg>

      {/* Labels */}
      <View style={styles.labelsRow}>
        <Text style={styles.labelText}>{sorted[0].date}</Text>
        {targetWeight !== null && (
          <Text style={styles.targetLabel}>Target: {targetWeight}</Text>
        )}
        <Text style={styles.labelText}>{sorted[sorted.length - 1].date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  empty: { paddingVertical: spacing["3xl"], alignItems: "center" },
  emptyText: { ...fonts.small, color: colors.textMuted },
  labelsRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.xs },
  labelText: { fontSize: 10, color: colors.textMuted },
  targetLabel: { fontSize: 10, fontWeight: "700", color: colors.accent },
});
