import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing } from "../theme";

type PageHeaderProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
};

export function PageHeader({ kicker, title, subtitle }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      {kicker !== undefined && kicker !== null && (
        <Text style={styles.kicker}>{kicker.toUpperCase()}</Text>
      )}
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      {subtitle !== undefined && subtitle !== null && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  kicker: {
    fontSize: fonts.kicker.fontSize,
    fontWeight: fonts.kicker.fontWeight,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: fonts.kicker.letterSpacing,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: colors.text,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
