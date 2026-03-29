import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getIntensityLabel, getIntensityColor } from "../../lib/workout-utils";
import { radius } from "../../theme";
import type { Intensity } from "../../types";

type IntensityBadgeProps = {
  intensity: Intensity;
};

export function IntensityBadge({ intensity }: IntensityBadgeProps) {
  const color = getIntensityColor(intensity);
  const label = getIntensityLabel(intensity);

  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
