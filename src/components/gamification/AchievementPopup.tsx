import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, shadows } from "../../theme";
import { successNotification } from "../../lib/haptics";
import type { Achievement } from "../../types";

type AchievementPopupProps = {
  achievement: Achievement;
  onClaim: () => void;
};

export function AchievementPopup({ achievement, onClaim }: AchievementPopupProps) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    successNotification();
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.popup, shadows.panel, { transform: [{ scale }], opacity }]}>
        <Text style={styles.kicker}>ACHIEVEMENT UNLOCKED</Text>
        <View style={styles.iconContainer}>
          <Ionicons name={(achievement.icon as keyof typeof Ionicons.glyphMap) ?? "trophy"} size={40} color={colors.accent} />
        </View>
        <Text style={styles.name}>{achievement.name}</Text>
        <Text style={styles.description}>{achievement.description}</Text>
        {achievement.xpReward > 0 && (
          <Text style={styles.xp}>+{achievement.xpReward} XP</Text>
        )}
        <Pressable onPress={onClaim} style={styles.claimBtn}>
          <Text style={styles.claimText}>CLAIM</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  popup: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.xl,
    padding: spacing["3xl"],
    alignItems: "center",
    gap: spacing.md,
    width: "80%",
    maxWidth: 320,
  },
  kicker: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 3,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(251,191,36,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.md,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  description: {
    ...fonts.small,
    color: colors.textSecondary,
    textAlign: "center",
  },
  xp: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.accent,
    marginTop: spacing.sm,
  },
  claimBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing["3xl"],
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  claimText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2,
  },
});
