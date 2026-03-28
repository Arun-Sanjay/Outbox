import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

type MetricSize = "sm" | "md" | "lg" | "hero";

type MetricValueProps = {
  label: string;
  value: number;
  size?: MetricSize;
  color?: string;
  animated?: boolean;
};

const SIZE_MAP: Record<MetricSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
  hero: 48,
};

const WEIGHT_MAP: Record<MetricSize, "300" | "800"> = {
  sm: "800",
  md: "800",
  lg: "800",
  hero: "300",
};

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

export function MetricValue({
  label,
  value,
  size = "md",
  color = colors.text,
  animated = false,
}: MetricValueProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const displayRef = useRef(0);
  const [displayValue, setDisplayValue] = React.useState(
    animated ? 0 : value
  );

  useEffect(() => {
    // Guard: NaN/Infinity fall through to static display
    if (!animated || !Number.isFinite(value) || value === 0) {
      setDisplayValue(value);
      return;
    }

    animatedValue.setValue(0);
    const listener = animatedValue.addListener(({ value: v }) => {
      const rounded = Math.round(v);
      if (rounded !== displayRef.current) {
        displayRef.current = rounded;
        setDisplayValue(rounded);
      }
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration: 800,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, animated, animatedValue]);

  const fontSize = SIZE_MAP[size];
  const fontWeight = WEIGHT_MAP[size];

  // Format: NaN/Infinity show as dashes
  const formattedValue = Number.isFinite(displayValue)
    ? String(displayValue)
    : "--";

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.value,
          {
            fontSize,
            fontWeight,
            color,
          },
        ]}
      >
        {formattedValue}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  value: {
    fontFamily: monoFont,
    fontVariant: ["tabular-nums"],
  },
  label: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textSecondary,
    marginTop: 2,
  },
});
