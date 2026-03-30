import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, radius } from "../../theme";
import { getWeightClass, getWeightClassLabel, getWeightClassLimits } from "../../lib/weight-class";
import type { WeightClass } from "../../types";

type WeightClassIndicatorProps = {
  currentWeight: number;
  unit: "kg" | "lb";
};

const DISPLAY_CLASSES: WeightClass[] = [
  "flyweight", "bantamweight", "featherweight", "lightweight",
  "welterweight", "middleweight", "light_heavyweight", "heavyweight",
];

export function WeightClassIndicator({ currentWeight, unit }: WeightClassIndicatorProps) {
  const currentClass = getWeightClass(currentWeight, unit);
  const weightLb = unit === "kg" ? currentWeight * 2.20462 : currentWeight;

  const { position, adjacentClasses } = useMemo(() => {
    if (!currentClass) return { position: 0, adjacentClasses: [] };

    const classIdx = DISPLAY_CLASSES.indexOf(currentClass);
    const start = Math.max(0, classIdx - 1);
    const end = Math.min(DISPLAY_CLASSES.length, classIdx + 2);
    const adjacent = DISPLAY_CLASSES.slice(start, end);

    // Position within the bar (0-1)
    const limits = getWeightClassLimits(currentClass);
    if (!limits) return { position: 0.5, adjacentClasses: adjacent };

    const range = limits.maxLb - limits.minLb;
    const pos = range > 0 && range < 1000
      ? (weightLb - limits.minLb) / range
      : 0.5;

    return { position: Math.max(0, Math.min(1, pos)), adjacentClasses: adjacent };
  }, [currentWeight, currentClass, weightLb, unit]);

  if (!currentClass) return null;

  return (
    <View style={styles.container}>
      {/* Class labels */}
      <View style={styles.labelsRow}>
        {DISPLAY_CLASSES.map((wc) => (
          <Text
            key={wc}
            style={[
              styles.classLabel,
              wc === currentClass && styles.classLabelActive,
            ]}
          >
            {getWeightClassLabel(wc).split(" ")[0].slice(0, 4).toUpperCase()}
          </Text>
        ))}
      </View>

      {/* Bar */}
      <View style={styles.bar}>
        {DISPLAY_CLASSES.map((wc, i) => (
          <View
            key={wc}
            style={[
              styles.segment,
              wc === currentClass && styles.segmentActive,
              i === 0 && styles.segmentFirst,
              i === DISPLAY_CLASSES.length - 1 && styles.segmentLast,
            ]}
          />
        ))}
      </View>

      {/* Current weight indicator */}
      <View style={styles.indicatorRow}>
        <Text style={styles.currentClass}>{getWeightClassLabel(currentClass)}</Text>
        <Text style={styles.currentWeight}>{currentWeight} {unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  classLabel: {
    fontSize: 8,
    fontWeight: "600",
    color: colors.textMuted,
    letterSpacing: 0.5,
    flex: 1,
    textAlign: "center",
  },
  classLabelActive: {
    color: colors.accent,
    fontWeight: "800",
  },
  bar: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    gap: 1,
  },
  segment: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  segmentActive: {
    backgroundColor: colors.accent,
  },
  segmentFirst: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  segmentLast: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  indicatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentClass: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accent,
  },
  currentWeight: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
