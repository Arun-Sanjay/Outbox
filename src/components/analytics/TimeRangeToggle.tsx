import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../../theme";
import { lightTap } from "../../lib/haptics";

export type TimeRange = "week" | "month" | "all";

type TimeRangeToggleProps = {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
};

const OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "week", label: "WEEK" },
  { value: "month", label: "MONTH" },
  { value: "all", label: "ALL" },
];

export function TimeRangeToggle({ value, onChange }: TimeRangeToggleProps) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => { lightTap(); onChange(opt.value); }}
          style={[styles.pill, value === opt.value && styles.pillActive]}
        >
          <Text style={[styles.text, value === opt.value && styles.textActive]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: radius.md,
    padding: 2,
    marginBottom: spacing["2xl"],
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md - 2,
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: colors.accent,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 2,
  },
  textActive: {
    color: "#000000",
  },
});
