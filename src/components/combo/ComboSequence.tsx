import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../theme";
import { PunchChip } from "./PunchChip";
import type { ComboElement } from "../../types";

type ComboSequenceProps = {
  sequence: ComboElement[];
  size?: "sm" | "md" | "lg";
  stance?: "orthodox" | "southpaw";
  displayMode?: "codes" | "names" | "both";
  scrollable?: boolean;
  wrap?: boolean;
  onChipPress?: (index: number) => void;
};

export function ComboSequence({
  sequence,
  size = "md",
  stance = "orthodox",
  displayMode = "codes",
  scrollable = false,
  wrap = false,
  onChipPress,
}: ComboSequenceProps) {
  if (!sequence || sequence.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No elements</Text>
      </View>
    );
  }

  const content = (
    <View style={[styles.row, wrap && styles.wrap]}>
      {sequence.map((code, i) => (
        <React.Fragment key={`${code}-${i}`}>
          {i > 0 && <Text style={styles.separator}>-</Text>}
          <PunchChip
            code={code}
            size={size}
            stance={stance}
            displayMode={displayMode}
            onPress={onChipPress ? () => onChipPress(i) : undefined}
          />
        </React.Fragment>
      ))}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  wrap: {
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  separator: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    paddingRight: spacing.lg,
  },
  empty: {
    paddingVertical: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
