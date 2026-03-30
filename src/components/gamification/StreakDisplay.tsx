import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../theme";
import { getStreakMultiplier } from "../../lib/xp-calculator";

type StreakDisplayProps = {
  days: number;
  compact?: boolean;
};

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export function StreakDisplay({ days, compact = false }: StreakDisplayProps) {
  const isActive = days > 0;
  const multiplier = getStreakMultiplier(days);

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Text style={[styles.flame, isActive && styles.flameActive]}>
          {isActive ? "\uD83D\uDD25" : "\u26AA"}
        </Text>
        <Text style={[styles.compactDays, isActive && styles.compactDaysActive]}>
          {days}d
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.flameLarge, isActive && styles.flameActive]}>
        {isActive ? "\uD83D\uDD25" : "\u26AA"}
      </Text>
      <View style={styles.textColumn}>
        <Text style={[styles.daysText, isActive && styles.daysActive]}>
          {days} DAY{days !== 1 ? "S" : ""}
        </Text>
        {isActive && multiplier > 1 && (
          <Text style={styles.multiplier}>{multiplier}x XP</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  flame: {
    fontSize: 16,
  },
  flameLarge: {
    fontSize: 28,
  },
  flameActive: {},
  textColumn: {
    gap: 2,
  },
  daysText: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: monoFont,
    color: colors.textMuted,
    letterSpacing: 1,
    fontVariant: ["tabular-nums"],
  },
  daysActive: {
    color: colors.accent,
  },
  compactDays: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: monoFont,
    color: colors.textMuted,
    fontVariant: ["tabular-nums"],
  },
  compactDaysActive: {
    color: colors.accent,
  },
  multiplier: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 1,
  },
});
