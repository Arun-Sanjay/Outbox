import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../theme";
import { lightTap } from "../../lib/haptics";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useProfileStore } from "../../stores/useProfileStore";
import { getWeightClass } from "../../lib/weight-class";

export function StepPhysical() {
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("lb");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("in");
  const [reach, setReach] = useState("");
  const [reachUnit, setReachUnit] = useState<"cm" | "in">("in");

  const weightNum = parseFloat(weight);
  const isWeightValid = !isNaN(weightNum) && weightNum > 0;

  const handleContinue = () => {
    if (!isWeightValid) return;
    lightTap();

    const heightNum = parseFloat(height);
    const reachNum = parseFloat(reach);
    const wc = getWeightClass(weightNum, weightUnit === "kg" ? "kg" : "lb");

    updateProfile({
      weight: weightNum,
      weightUnit,
      height: isNaN(heightNum) ? null : heightNum,
      heightUnit,
      reach: isNaN(reachNum) ? null : reachNum,
      reachUnit,
      activeWeightClass: wc,
    });
    nextStep();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.kicker}>STATS</Text>
        <Text style={styles.title}>Your physical stats</Text>
      </View>

      <View style={styles.fields}>
        {/* Weight — required */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Weight *</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputLarge}
              value={weight}
              onChangeText={setWeight}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
            <View style={styles.toggleRow}>
              <Pressable
                onPress={() => { lightTap(); setWeightUnit("lb"); }}
                style={[styles.toggle, weightUnit === "lb" && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, weightUnit === "lb" && styles.toggleTextActive]}>LB</Text>
              </Pressable>
              <Pressable
                onPress={() => { lightTap(); setWeightUnit("kg"); }}
                style={[styles.toggle, weightUnit === "kg" && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, weightUnit === "kg" && styles.toggleTextActive]}>KG</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Height — optional */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Height (optional)</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputMedium}
              value={height}
              onChangeText={setHeight}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
            <View style={styles.toggleRow}>
              <Pressable
                onPress={() => { lightTap(); setHeightUnit("in"); }}
                style={[styles.toggle, heightUnit === "in" && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, heightUnit === "in" && styles.toggleTextActive]}>IN</Text>
              </Pressable>
              <Pressable
                onPress={() => { lightTap(); setHeightUnit("cm"); }}
                style={[styles.toggle, heightUnit === "cm" && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, heightUnit === "cm" && styles.toggleTextActive]}>CM</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Reach — optional */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Reach (optional)</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputMedium}
              value={reach}
              onChangeText={setReach}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
            <View style={styles.toggleRow}>
              <Pressable
                onPress={() => { lightTap(); setReachUnit("in"); }}
                style={[styles.toggle, reachUnit === "in" && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, reachUnit === "in" && styles.toggleTextActive]}>IN</Text>
              </Pressable>
              <Pressable
                onPress={() => { lightTap(); setReachUnit("cm"); }}
                style={[styles.toggle, reachUnit === "cm" && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, reachUnit === "cm" && styles.toggleTextActive]}>CM</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleContinue}
        style={[styles.continueBtn, !isWeightValid && styles.continueBtnDisabled]}
        disabled={!isWeightValid}
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  inputLarge: {
    flex: 1,
    height: TOUCH_MIN + 8,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  inputMedium: {
    flex: 1,
    height: TOUCH_MIN,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 2,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  toggle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.inputBg,
    minWidth: 44,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  toggleTextActive: {
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
