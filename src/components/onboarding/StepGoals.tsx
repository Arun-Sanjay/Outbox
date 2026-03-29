import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../theme";
import { lightTap } from "../../lib/haptics";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useProfileStore } from "../../stores/useProfileStore";
import { Panel } from "../Panel";

const GOALS = [
  { key: "fitness", label: "Fitness", desc: "Get in shape, lose weight, build endurance" },
  { key: "competition", label: "Competition", desc: "Prepare for amateur or pro bouts" },
  { key: "self_defense", label: "Self-Defense", desc: "Learn practical fighting skills" },
  { key: "stress_relief", label: "Stress Relief", desc: "Channel energy, clear the mind" },
];

export function StepGoals() {
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleGoal = (key: string) => {
    lightTap();
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    lightTap();
    updateProfile({ trainingGoals: selected });
    nextStep();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.kicker}>GOALS</Text>
        <Text style={styles.title}>What are you training for?</Text>
        <Text style={styles.hint}>Select all that apply</Text>
      </View>

      <View style={styles.options}>
        {GOALS.map((g) => {
          const isSelected = selected.includes(g.key);
          return (
            <Pressable key={g.key} onPress={() => toggleGoal(g.key)}>
              <Panel
                tone="subtle"
                style={{
                  ...styles.option,
                  ...(isSelected ? styles.optionSelected : {}),
                }}
              >
                <View style={styles.optionRow}>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{g.label}</Text>
                    <Text style={styles.optionDesc}>{g.desc}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.check}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </View>
              </Panel>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleContinue}
        style={[
          styles.continueBtn,
          selected.length === 0 && styles.continueBtnDisabled,
        ]}
        disabled={selected.length === 0}
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
    marginBottom: spacing.xs,
  },
  hint: {
    ...fonts.small,
    color: colors.textMuted,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    padding: spacing.lg,
  },
  optionSelected: {
    borderColor: colors.accent,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    ...fonts.subheading,
    marginBottom: spacing.xs,
  },
  optionDesc: {
    ...fonts.small,
    color: colors.textSecondary,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.md,
  },
  checkText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
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
