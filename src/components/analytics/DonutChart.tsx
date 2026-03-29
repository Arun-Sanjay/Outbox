import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors, fonts, spacing } from "../../theme";

type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerValue?: number;
  centerLabel?: string;
};

const GAP_DEGREES = 3;
const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export function DonutChart({
  segments,
  size = 180,
  strokeWidth = 20,
  centerValue,
  centerLabel,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const arcs = useMemo(() => {
    if (total === 0) return [];
    const gapTotal = GAP_DEGREES * segments.filter((s) => s.value > 0).length;
    const availableDegrees = 360 - gapTotal;
    let currentAngle = -90; // start at top

    return segments
      .filter((s) => s.value > 0)
      .map((seg, i) => {
        const degrees = (seg.value / total) * availableDegrees;
        const dashLength = (degrees / 360) * circumference;
        const gapLength = circumference - dashLength;
        const rotation = currentAngle;
        currentAngle += degrees + GAP_DEGREES;

        return {
          ...seg,
          dashArray: `${dashLength} ${gapLength}`,
          rotation,
          gradientId: `donut-grad-${i}`,
          pct: Math.round((seg.value / total) * 100),
        };
      });
  }, [segments, total, circumference]);

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size}>
          <Defs>
            {arcs.map((arc) => (
              <LinearGradient key={arc.gradientId} id={arc.gradientId} x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={arc.color} stopOpacity="1" />
                <Stop offset="100%" stopColor={arc.color} stopOpacity="0.7" />
              </LinearGradient>
            ))}
          </Defs>

          {/* Background ring */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={strokeWidth}
          />

          {/* Segments */}
          {arcs.map((arc) => (
            <Circle
              key={arc.gradientId}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={`url(#${arc.gradientId})`}
              strokeWidth={strokeWidth}
              strokeDasharray={arc.dashArray}
              strokeLinecap="round"
              rotation={arc.rotation}
              origin={`${center}, ${center}`}
            />
          ))}
        </Svg>

        {/* Center text */}
        <View style={[styles.centerOverlay, { width: size, height: size }]}>
          {centerValue !== undefined && (
            <Text style={styles.centerValue}>{centerValue}</Text>
          )}
          {centerLabel && (
            <Text style={styles.centerLabel}>{centerLabel}</Text>
          )}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {arcs.map((arc) => (
          <View key={arc.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: arc.color }]} />
            <Text style={styles.legendLabel}>{arc.label}</Text>
            <Text style={styles.legendPct}>{arc.pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: spacing.xl },
  chartWrapper: { position: "relative" },
  centerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    fontSize: 32,
    fontWeight: "800",
    fontFamily: monoFont,
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: 2,
  },
  legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.md },
  legendItem: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, color: colors.textSecondary },
  legendPct: { fontSize: 11, fontWeight: "700", color: colors.textMuted },
});
