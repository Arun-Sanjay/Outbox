import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../theme";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  maxStars?: number;
  size?: number;
  readonly?: boolean;
};

export function StarRating({
  value,
  onChange,
  maxStars = 5,
  size = 24,
  readonly = false,
}: StarRatingProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => {
        const filled = star <= value;
        const starEl = (
          <Text
            key={star}
            style={[
              styles.star,
              { fontSize: size },
              filled ? styles.starFilled : styles.starEmpty,
            ]}
          >
            {filled ? "\u2605" : "\u2606"}
          </Text>
        );

        if (readonly || !onChange) return starEl;

        return (
          <Pressable key={star} onPress={() => onChange(star)}>
            {starEl}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  star: {},
  starFilled: { color: colors.accent },
  starEmpty: { color: colors.textMuted },
});
