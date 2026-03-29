import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";
import { colors, fonts, spacing } from "../../theme";

type TrendPoint = {
  label: string;
  energy: number;
  sharpness: number;
};

type TrendChartProps = {
  data: TrendPoint[];
  width?: number;
  height?: number;
};

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

function getInterpretation(data: TrendPoint[]): string {
  if (data.length < 3) return "Not enough data for trend analysis";
  const recent = data.slice(-3);
  const avgEnergy = recent.reduce((s, d) => s + d.energy, 0) / 3;
  const avgSharpness = recent.reduce((s, d) => s + d.sharpness, 0) / 3;

  if (avgEnergy < 2.5 && avgSharpness < 2.5) return "Signs of overtraining. Consider a recovery week.";
  if (avgEnergy > 3.5 && avgSharpness > 3.5) return "You're peaking. Great time to push intensity.";
  if (avgEnergy > 3.5 && avgSharpness < 2.5) return "Energy is high but sharpness is low. Focus on technique.";
  if (avgEnergy < 2.5 && avgSharpness > 3.5) return "Sharp but fatigued. Manage your recovery.";
  return "Training is balanced. Keep it steady.";
}

export function TrendChart({ data, width = 320, height = 160 }: TrendChartProps) {
  const padX = 30;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const paths = useMemo(() => {
    if (data.length < 2) return { energy: "", sharpness: "" };
    const xStep = chartW / (data.length - 1);
    const toY = (v: number) => padY + chartH - ((v - 1) / 4) * chartH;

    const energyPts = data.map((d, i) => ({ x: padX + i * xStep, y: toY(d.energy) }));
    const sharpPts = data.map((d, i) => ({ x: padX + i * xStep, y: toY(d.sharpness) }));

    return { energy: buildPath(energyPts), sharpness: buildPath(sharpPts) };
  }, [data, chartW, chartH, padX, padY]);

  const interpretation = useMemo(() => getInterpretation(data), [data]);

  if (data.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.noData}>Log more sessions to see trends</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="trend-energy-grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.accent} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="trend-sharp-grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={colors.text} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.text} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Y-axis grid lines */}
        {[1, 2, 3, 4, 5].map((v) => {
          const y = padY + chartH - ((v - 1) / 4) * chartH;
          return (
            <Line
              key={v}
              x1={padX}
              y1={y}
              x2={width - padX}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          );
        })}

        {/* Energy line (gold) */}
        <Path
          d={paths.energy}
          fill="none"
          stroke="url(#trend-energy-grad)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sharpness line (white) */}
        <Path
          d={paths.sharpness}
          fill="none"
          stroke="url(#trend-sharp-grad)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: colors.accent }]} />
          <Text style={styles.legendText}>Energy</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: colors.text }]} />
          <Text style={styles.legendText}>Sharpness</Text>
        </View>
      </View>

      {/* Interpretation */}
      <Text style={styles.interpretation}>{interpretation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.md },
  noData: { ...fonts.small, color: colors.textMuted, textAlign: "center", paddingVertical: spacing["3xl"] },
  legendRow: { flexDirection: "row", gap: spacing["2xl"] },
  legendItem: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  legendLine: { width: 16, height: 2, borderRadius: 1 },
  legendText: { fontSize: 11, color: colors.textSecondary },
  interpretation: { ...fonts.small, color: colors.textMuted, textAlign: "center", fontStyle: "italic" },
});
