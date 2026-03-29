import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Panel, MetricValue } from "../../components";
import { colors, fonts, spacing } from "../../theme";

type ComboAnalyticsProps = {
  totalCombos: number;
  topDrilled: { name: string; count: number }[];
};

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export function ComboAnalytics({ totalCombos, topDrilled }: ComboAnalyticsProps) {
  return (
    <Panel style={styles.panel}>
      <MetricValue label="Total Combos Drilled" value={totalCombos} size="lg" color={colors.accent} animated />

      {topDrilled.length > 0 && (
        <View style={styles.topSection}>
          <Text style={styles.topLabel}>TOP 5 MOST DRILLED</Text>
          {topDrilled.slice(0, 5).map((combo, i) => (
            <View key={combo.name} style={styles.topRow}>
              <Text style={styles.topRank}>{i + 1}</Text>
              <Text style={styles.topName} numberOfLines={1}>{combo.name}</Text>
              <Text style={styles.topCount}>{combo.count}x</Text>
            </View>
          ))}
        </View>
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  panel: { padding: spacing.xl },
  topSection: { marginTop: spacing.xl },
  topLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2, marginBottom: spacing.md },
  topRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, gap: spacing.md },
  topRank: { fontSize: 14, fontWeight: "800", color: colors.accent, width: 22, fontFamily: monoFont },
  topName: { flex: 1, fontSize: 14, color: colors.text },
  topCount: { fontSize: 13, fontWeight: "700", color: colors.textSecondary, fontFamily: monoFont },
});
