import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../src/theme";
import { useOnboardingStore } from "../src/stores/useOnboardingStore";
import {
  StepWelcome,
  StepStance,
  StepExperience,
  StepGoals,
  StepPhysical,
  StepComplete,
} from "../src/components/onboarding";

const TOTAL_STEPS = 6;

const STEPS = [
  StepWelcome,
  StepStance,
  StepExperience,
  StepGoals,
  StepPhysical,
  StepComplete,
];

function StepDots({ current, total }: { current: number; total: number }) {
  // Don't show dots on welcome step
  if (current === 0) return null;

  return (
    <View style={dotStyles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            i === current && dotStyles.dotActive,
            i < current && dotStyles.dotCompleted,
          ]}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 24,
  },
  dotCompleted: {
    backgroundColor: "rgba(251,191,36,0.4)",
  },
});

export default function OnboardingScreen() {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const StepComponent = STEPS[currentStep] ?? StepWelcome;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <StepDots current={currentStep} total={TOTAL_STEPS} />
        <View style={styles.content}>
          <StepComponent />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
  },
});
