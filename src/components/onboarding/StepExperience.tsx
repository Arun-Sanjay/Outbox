import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../theme";
import { lightTap } from "../../lib/haptics";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useProfileStore } from "../../stores/useProfileStore";
import { Panel } from "../Panel";

type ExperienceLevel = "beginner" | "intermediate" | "advanced";

const LEVELS: { value: ExperienceLevel; title: string; desc: string; sub: string }[] = [
  { value: "beginner", title: "Beginner", desc: "Less than 6 months", sub: "2-3 punch combos" },
  { value: "intermediate", title: "Intermediate", desc: "6 months — 2 years", sub: "Defense + body shots" },
  { value: "advanced", title: "Advanced", desc: "2+ years", sub: "Full arsenal" },
];

export function StepExperience() {
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [selected, setSelected] = useState<ExperienceLevel | null>(null);

  const handleSelect = (level: ExperienceLevel) => {
    lightTap();
    setSelected(level);
  };

  const handleContinue = () => {
    if (!selected) return;
    lightTap();
    updateProfile({ experienceLevel: selected });
    nextStep();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.kicker}>EXPERIENCE</Text>
        <Text style={styles.title}>How long have you been boxing?</Text>
      </View>

      <View style={styles.options}>
        {LEVELS.map((l) => (
          <Pressable key={l.value} onPress={() => handleSelect(l.value)}>
            <Panel
              tone="subtle"
              style={{
                ...styles.option,
                ...(selected === l.value ? styles.optionSelected : {}),
              }}
            >
              <Text style={styles.optionTitle}>{l.title}</Text>
              <Text style={styles.optionDesc}>{l.desc}</Text>
              <Text style={styles.optionSub}>{l.sub}</Text>
            </Panel>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleContinue}
        style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
        disabled={!selected}
      >
        <Text style={styles.continueText}>CONTINUE</Text>
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
    marginBottom: spacing.sm,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    padding: spacing.lg,
  },
  optionSelected: {
    borderColor: colors.surfaceBorderStrong,
  },
  optionTitle: {
    ...fonts.subheading,
    marginBottom: spacing.xs,
  },
  optionDesc: {
    ...fonts.small,
    color: colors.textSecondary,
  },
  optionSub: {
    ...fonts.small,
    color: colors.accent,
    marginTop: spacing.xs,
  },
  continueBtn: {
    backgroundColor: colors.accent,
    height: TOUCH_MIN + 8,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnDisabled: {
    opacity: 0.3,
  },
  continueText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2,
  },
});
