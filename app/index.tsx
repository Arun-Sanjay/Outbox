import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OUTBOX</Text>
      <Text style={styles.tagline}>Outwork. Outthink. Outbox.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FBBF24",
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
    letterSpacing: 2,
  },
});
