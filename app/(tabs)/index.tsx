import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, spacing } from "../../src/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OUTBOX</Text>
      <Text style={styles.tagline}>Welcome, Fighter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...fonts.hero,
    color: colors.accent,
  },
  tagline: {
    ...fonts.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
