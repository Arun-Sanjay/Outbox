import React from "react";
import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";
import { colors, radius, spacing } from "../../theme";
import { isPunchCode, isDefenseCode, isFootworkCode, getPunchName } from "../../lib/combo-utils";
import type { ComboElement } from "../../types";

type PunchChipSize = "sm" | "md" | "lg";

type PunchChipProps = {
  code: ComboElement;
  size?: PunchChipSize;
  selected?: boolean;
  dragging?: boolean;
  stance?: "orthodox" | "southpaw";
  displayMode?: "codes" | "names" | "both";
  onPress?: () => void;
  style?: ViewStyle;
};

const SIZE_MAP: Record<PunchChipSize, { height: number; fontSize: number; px: number }> = {
  sm: { height: 28, fontSize: 11, px: 8 },
  md: { height: 36, fontSize: 13, px: 12 },
  lg: { height: 44, fontSize: 16, px: 16 },
};

function getChipColor(code: ComboElement): string {
  if (isPunchCode(code)) return colors.accent;
  if (isDefenseCode(code)) return "rgba(96, 165, 250, 0.8)";
  if (isFootworkCode(code)) return "#22d3ee";
  return colors.textMuted;
}

function getChipBg(code: ComboElement): string {
  if (isPunchCode(code)) return "rgba(251, 191, 36, 0.15)";
  if (isDefenseCode(code)) return "rgba(96, 165, 250, 0.12)";
  if (isFootworkCode(code)) return "rgba(34, 211, 238, 0.12)";
  return "rgba(255,255,255,0.06)";
}

function getDisplayText(
  code: ComboElement,
  mode: "codes" | "names" | "both",
  stance: "orthodox" | "southpaw"
): string {
  if (mode === "codes" && isPunchCode(code)) return code;
  if (mode === "names") return getPunchName(code, stance);
  if (mode === "both" && isPunchCode(code))
    return `${code} ${getPunchName(code, stance)}`;
  return getPunchName(code, stance);
}

export function PunchChip({
  code,
  size = "md",
  selected = false,
  dragging = false,
  stance = "orthodox",
  displayMode = "codes",
  onPress,
  style,
}: PunchChipProps) {
  const sizeConfig = SIZE_MAP[size];
  const chipColor = getChipColor(code);
  const chipBg = getChipBg(code);
  const label = getDisplayText(code, displayMode, stance);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.px,
          backgroundColor: selected ? chipColor : chipBg,
          borderColor: selected ? chipColor : dragging ? chipColor : "transparent",
          borderWidth: 1,
          opacity: dragging ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            fontSize: sizeConfig.fontSize,
            color: selected ? "#000000" : chipColor,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
