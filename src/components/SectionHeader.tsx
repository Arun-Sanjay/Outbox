import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../theme";

type SectionHeaderProps = {
  title: string;
  right?: string;
};

export function SectionHeader({ title, right }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.accentLine} />
        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </View>
      {right !== undefined && right !== null && (
        <Text style={styles.right}>{right}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  accentLine: {
    width: 2,
    height: 12,
    backgroundColor: "rgba(251,191,36,0.3)",
    borderRadius: 1,
  },
  title: {
    fontSize: fonts.kicker.fontSize,
    fontWeight: fonts.kicker.fontWeight,
    color: fonts.kicker.color,
    textTransform: "uppercase",
    letterSpacing: fonts.kicker.letterSpacing,
  },
  right: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: undefined, // mono handled via Platform in theme
    color: colors.textMuted,
  },
});
