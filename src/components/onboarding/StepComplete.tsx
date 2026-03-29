import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../theme";
import { lightTap, successNotification } from "../../lib/haptics";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useProfileStore } from "../../stores/useProfileStore";
import { Panel } from "../Panel";
import { toLocalDateKey } from "../../lib/date";
import type { UserProfile } from "../../types";

export function StepComplete() {
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const profile = useProfileStore((s) => s.profile);
  const initializeProfile = useProfileStore((s) => s.initializeProfile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [name, setName] = useState("");
  const [fightName, setFightName] = useState("");

  const isValid = name.trim().length > 0;

  const handleBegin = () => {
    if (!isValid) return;

    const now = Date.now();
    const today = toLocalDateKey(new Date());

    if (!profile) {
      // Initialize full profile
      const newProfile: UserProfile = {
        name: name.trim(),
        fightName: fightName.trim() || null,
        stance: "orthodox",
        experienceLevel: "beginner",
        trainingGoals: [],
        weight: null,
        weightUnit: "lb",
        height: null,
        heightUnit: "in",
        reach: null,
        reachUnit: "in",
        activeWeightClass: null,
        totalXP: 0,
        rank: "rookie",
        xpHistory: [],
        achievements: [],
        currentStreak: 0,
        longestStreak: 0,
        lastTrainingDate: today,
        streakMultiplier: 1.0,
        activeFightCampId: null,
        boxerType: null,
        activeProgramId: null,
        ttsRate: 1.0,
        ttsPitch: 1.0,
        calloutStyle: "numbers",
        bellSound: "classic",
        warningSound: "clap",
        masterVolume: 1.0,
        bellVolume: 1.0,
        calloutVolume: 1.0,
        notifications: true,
        trainingReminder: null,
        hapticsEnabled: true,
        createdAt: now,
      };
      initializeProfile(newProfile);
    } else {
      updateProfile({
        name: name.trim(),
        fightName: fightName.trim() || null,
      });
    }

    successNotification();
    completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.kicker}>ALMOST THERE</Text>
        <Text style={styles.title}>What should we call you?</Text>
      </View>

      <View style={styles.fields}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>YOUR NAME *</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>FIGHT NAME (OPTIONAL)</Text>
          <TextInput
            style={styles.fightNameInput}
            value={fightName}
            onChangeText={setFightName}
            placeholder="The Natural"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </View>

        {/* Summary panel */}
        <Panel tone="subtle" style={styles.summary}>
          <Text style={styles.summaryTitle}>YOUR FIGHTER PROFILE</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Stance</Text>
            <Text style={styles.summaryValue}>
              {profile?.stance ?? "Orthodox"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Experience</Text>
            <Text style={styles.summaryValue}>
              {profile?.experienceLevel ?? "Beginner"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Weight</Text>
            <Text style={styles.summaryValue}>
              {profile?.weight
                ? `${profile.weight} ${profile.weightUnit}`
                : "--"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rank</Text>
            <Text style={[styles.summaryValue, { color: colors.accent }]}>
              Rookie
            </Text>
          </View>
        </Panel>
      </View>

      <Pressable
        onPress={handleBegin}
        style={[styles.beginBtn, !isValid && styles.beginBtnDisabled]}
        disabled={!isValid}
      >
        <Text style={styles.beginText}>BEGIN</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: spacing["5xl"],
  },
  kicker: {
    ...fonts.kicker,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  title: {
    ...fonts.heading,
    marginBottom: spacing.lg,
  },
  fields: {
    gap: spacing.xl,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    ...fonts.caption,
    color: colors.textSecondary,
  },
  nameInput: {
    height: 56,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  fightNameInput: {
    height: TOUCH_MIN,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    fontStyle: "italic",
  },
  summary: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  summaryTitle: {
    ...fonts.kicker,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    ...fonts.small,
    color: colors.textMuted,
    textTransform: "capitalize",
  },
  summaryValue: {
    ...fonts.small,
    color: colors.text,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  beginBtn: {
    backgroundColor: colors.accent,
    height: TOUCH_MIN + 8,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  beginBtnDisabled: {
    opacity: 0.3,
  },
  beginText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 3,
  },
});
