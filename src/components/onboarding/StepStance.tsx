import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../theme";
import { lightTap } from "../../lib/haptics";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useProfileStore } from "../../stores/useProfileStore";
import { Panel } from "../Panel";

type Stance = "orthodox" | "southpaw" | "switch";

const STANCES: { value: Stance; title: string; desc: string }[] = [
  { value: "orthodox", title: "Orthodox", desc: "Left foot forward, left hand jabs" },
  { value: "southpaw", title: "Southpaw", desc: "Right foot forward, right hand jabs" },
  { value: "switch", title: "Switch", desc: "Both stances" },
];

export function StepStance() {
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [selected, setSelected] = useState<Stance | null>(null);

  const handleSelect = (stance: Stance) => {
    lightTap();
    setSelected(stance);
  };

  const handleContinue = () => {
    if (!selected) return;
    lightTap();
    updateProfile({ stance: selected });
    nextStep();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.kicker}>STANCE</Text>
        <Text style={styles.title}>Which stance do you fight from?</Text>
        <Text style={styles.note}>
          This determines how punches are called out.
        </Text>
      </View>

      <View style={styles.options}>
        {STANCES.map((s) => (
          <Pressable key={s.value} onPress={() => handleSelect(s.value)}>
            <Panel
              tone="subtle"
              style={{
                ...styles.option,
                ...(selected === s.value ? styles.optionSelected : {}),
              }}
            >
              <Text style={styles.optionTitle}>{s.title}</Text>
              <Text style={styles.optionDesc}>{s.desc}</Text>
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
  note: {
    ...fonts.small,
    color: colors.textMuted,
    fontStyle: "italic",
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
