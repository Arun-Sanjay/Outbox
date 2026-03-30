import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { colors, spacing, radius } from "../../theme";
import { getRankProgress, getXPForNextRank } from "../../lib/xp-calculator";

type XPBarProps = {
  currentXP: number;
  showValues?: boolean;
};

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export function XPBar({ currentXP, showValues = true }: XPBarProps) {
  const progress = getRankProgress(currentXP);
  const nextRankXP = getXPForNextRank(currentXP);

  return (
    <View style={styles.container}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      {showValues && (
        <View style={styles.valuesRow}>
          <Text style={styles.xpText}>
            {currentXP.toLocaleString()} XP
          </Text>
          <Text style={styles.nextText}>
            {nextRankXP.toLocaleString()} XP
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  barBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  valuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  xpText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: monoFont,
    color: colors.accent,
    fontVariant: ["tabular-nums"],
  },
  nextText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: monoFont,
    fontVariant: ["tabular-nums"],
  },
});
