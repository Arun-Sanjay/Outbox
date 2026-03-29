import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../../theme";

type ComboStatsProps = {
  headShotCount: number;
  bodyShotCount: number;
  powerPunchCount: number;
  speedPunchCount: number;
  defensiveCount: number;
  footworkCount: number;
  totalPunches: number;
};

type StatPill = {
  label: string;
  value: number;
  color: string;
};

export function ComboStats({
  headShotCount,
  bodyShotCount,
  powerPunchCount,
  speedPunchCount,
  defensiveCount,
  footworkCount,
  totalPunches,
}: ComboStatsProps) {
  const pills: StatPill[] = [
    { label: "Total", value: totalPunches, color: colors.accent },
    { label: "Head", value: headShotCount, color: "#f87171" },
    { label: "Body", value: bodyShotCount, color: "#fb923c" },
    { label: "Power", value: powerPunchCount, color: "#e879f9" },
    { label: "Speed", value: speedPunchCount, color: "#34d399" },
  ];

  if (defensiveCount > 0) {
    pills.push({ label: "Defense", value: defensiveCount, color: "rgba(96, 165, 250, 0.8)" });
  }
  if (footworkCount > 0) {
    pills.push({ label: "Footwork", value: footworkCount, color: "#22d3ee" });
  }

  return (
    <View style={styles.row}>
      {pills.map((pill) => (
        <View
          key={pill.label}
          style={[styles.pill, { borderColor: pill.color }]}
        >
          <Text style={[styles.pillValue, { color: pill.color }]}>
            {pill.value}
          </Text>
          <Text style={styles.pillLabel}>{pill.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  pillValue: {
    fontSize: 13,
    fontWeight: "800",
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
