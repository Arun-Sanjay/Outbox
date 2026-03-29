import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSessionTypeColor } from "../../lib/workout-utils";
import { spacing, radius } from "../../theme";
import type { SessionType } from "../../types";

const ICON_MAP: Record<SessionType, keyof typeof Ionicons.glyphMap> = {
  heavy_bag: "fitness",
  speed_bag: "speedometer",
  double_end_bag: "ellipse",
  shadow_boxing: "person",
  mitt_work: "hand-left",
  sparring: "people",
  conditioning: "heart",
  strength: "barbell",
  roadwork: "walk",
};

type SessionTypeIconProps = {
  type: SessionType;
  size?: number;
};

export function SessionTypeIcon({ type, size = 20 }: SessionTypeIconProps) {
  const color = getSessionTypeColor(type);
  const iconName = ICON_MAP[type] ?? "help-circle";
  return (
    <View style={[styles.container, { width: size + 16, height: size + 16, backgroundColor: color + "20" }]}>
      <Ionicons name={iconName} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
