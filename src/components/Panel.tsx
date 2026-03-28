import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, shadows } from "../theme";

type PanelTone = "default" | "hero" | "subtle";

type PanelProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  glowColor?: string;
  tone?: PanelTone;
  delay?: number;
};

const TONE_BG: Record<PanelTone, string> = {
  default: colors.surface,
  hero: colors.surfaceHero,
  subtle: "rgba(0,0,0,0.6)",
};

export function Panel({
  children,
  onPress,
  style,
  glowColor = "rgba(251,191,36,0.14)",
  tone = "default",
  delay = 0,
}: PanelProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(12)).current;
  const glowTranslateX = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    // Entrance animation: fade in + slide down
    const entranceTimeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    // Glow line shimmer: loop translateX ±12 over 6s
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowTranslateX, {
          toValue: 12,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowTranslateX, {
          toValue: -12,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    glowLoop.start();

    return () => {
      clearTimeout(entranceTimeout);
      glowLoop.stop();
    };
  }, [delay, fadeAnim, translateYAnim, glowTranslateX]);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const containerStyle: Animated.WithAnimatedObject<ViewStyle> = {
    opacity: fadeAnim,
    transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
  };

  const content = (
    <Animated.View
      style={[
        styles.panel,
        { backgroundColor: TONE_BG[tone] },
        shadows.panel,
        style,
        containerStyle,
      ]}
    >
      {/* Glow line at top */}
      <Animated.View
        style={[
          styles.glowLineWrapper,
          { transform: [{ translateX: glowTranslateX }] },
        ]}
      >
        <LinearGradient
          colors={["transparent", glowColor, "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.glowLine}
        />
      </Animated.View>

      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderColor: colors.panelBorder,
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: "hidden",
  },
  glowLineWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  glowLine: {
    height: 1,
    width: "100%",
  },
});
