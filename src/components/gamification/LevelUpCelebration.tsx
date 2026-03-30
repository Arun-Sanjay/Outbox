import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, radius, shadows } from "../../theme";
import { rankColors } from "../../theme";
import { RankBadge } from "./RankBadge";
import { successNotification } from "../../lib/haptics";
import type { Rank } from "../../types";

const RANK_TITLES: Record<Rank, string> = {
  rookie: "ROOKIE",
  prospect: "PROSPECT",
  contender: "CONTENDER",
  challenger: "CHALLENGER",
  champion: "CHAMPION",
  undisputed: "UNDISPUTED",
};

type LevelUpCelebrationProps = {
  rank: Rank;
  onDismiss: () => void;
};

export function LevelUpCelebration({ rank, onDismiss }: LevelUpCelebrationProps) {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const color = rankColors[rank];

  useEffect(() => {
    successNotification();
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.popup, shadows.ring, { borderColor: color, transform: [{ scale }], opacity }]}>
        <Text style={styles.kicker}>RANK UP</Text>
        <RankBadge rank={rank} size="hero" />
        <Text style={[styles.rankTitle, { color }]}>{RANK_TITLES[rank]}</Text>
        <Text style={styles.subtitle}>You've earned a new rank</Text>
        <Pressable onPress={onDismiss} style={[styles.dismissBtn, { backgroundColor: color }]}>
          <Text style={styles.dismissText}>LET'S GO</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  popup: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderRadius: radius.xl,
    padding: spacing["4xl"],
    alignItems: "center",
    gap: spacing.xl,
    width: "85%",
    maxWidth: 340,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 4,
  },
  rankTitle: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dismissBtn: {
    paddingHorizontal: spacing["3xl"],
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2,
  },
});
