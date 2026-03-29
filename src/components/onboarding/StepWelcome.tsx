import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing, radius } from "../../theme";
import { lightTap } from "../../lib/haptics";
import { useOnboardingStore } from "../../stores/useOnboardingStore";

export function StepWelcome() {
  const nextStep = useOnboardingStore((s) => s.nextStep);

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Title fade in
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Tagline fade in with 400ms delay
    setTimeout(() => {
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Button fade in with 800ms delay
    setTimeout(() => {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 800);

    // Breathing pulse on button — 2s loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [titleOpacity, taglineOpacity, buttonOpacity, pulseAnim]);

  const handlePress = () => {
    lightTap();
    nextStep();
  };

  const handlePressIn = () => {
    Animated.timing(buttonScale, {
      toValue: 0.95,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.timing(buttonScale, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Animated.Text style={[styles.hero, { opacity: titleOpacity }]}>
          OUTBOX
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Outwork. Outthink. Outbox.
        </Animated.Text>
      </View>
      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            opacity: buttonOpacity,
            transform: [{ scale: Animated.multiply(pulseAnim, buttonScale) }],
          },
        ]}
      >
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.button}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: spacing["5xl"],
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  tagline: {
    ...fonts.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    letterSpacing: 1,
  },
  buttonWrapper: {
    paddingHorizontal: spacing.xl,
  },
  button: {
    backgroundColor: colors.accent,
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
