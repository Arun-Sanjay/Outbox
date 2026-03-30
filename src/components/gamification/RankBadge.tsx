import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, shadows } from "../../theme";
import { rankColors } from "../../theme";
import type { Rank } from "../../types";

type RankBadgeSize = "sm" | "md" | "lg" | "hero";

type RankBadgeProps = {
  rank: Rank;
  size?: RankBadgeSize;
  showLabel?: boolean;
};

const RANK_LABELS: Record<Rank, string> = {
  rookie: "ROOKIE",
  prospect: "PROSPECT",
  contender: "CONTENDER",
  challenger: "CHALLENGER",
  champion: "CHAMPION",
  undisputed: "UNDISPUTED",
};

const SIZE_MAP: Record<RankBadgeSize, { icon: number; fontSize: number; padding: number }> = {
  sm: { icon: 14, fontSize: 9, padding: 4 },
  md: { icon: 20, fontSize: 11, padding: 8 },
  lg: { icon: 28, fontSize: 14, padding: 12 },
  hero: { icon: 40, fontSize: 18, padding: 16 },
};

const GLOW_RANKS = new Set<Rank>(["champion", "undisputed"]);

export function RankBadge({ rank, size = "md", showLabel = true }: RankBadgeProps) {
  const color = rankColors[rank];
  const config = SIZE_MAP[size];
  const hasGlow = GLOW_RANKS.has(rank);

  return (
    <View style={[styles.container, hasGlow && shadows.glow]}>
      <View
        style={[
          styles.badge,
          {
            padding: config.padding,
            borderColor: color,
            backgroundColor: `${color}15`,
          },
        ]}
      >
        <Ionicons name="fitness" size={config.icon} color={color} />
      </View>
      {showLabel && (
        <Text style={[styles.label, { fontSize: config.fontSize, color }]}>
          {RANK_LABELS[rank]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.xs,
  },
  badge: {
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "800",
    letterSpacing: 2,
  },
});
