import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel, MetricValue } from "../../src/components";
import { FightRecordDisplay } from "../../src/components/fight/FightRecordDisplay";
import { FightCard } from "../../src/components/fight/FightCard";
import { useFightStore } from "../../src/stores/useFightStore";
import { lightTap } from "../../src/lib/haptics";
import { goToLogFight, goToFightDetail } from "../../src/lib/navigation";

export default function FightRecordScreen() {
  const fights = useFightStore((s) => s.fights);

  if (fights.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.emptyContainer}>
          <PageHeader kicker="RECORD" title="Fight Record" />
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Fights Yet</Text>
            <Text style={styles.emptyDesc}>Log your first fight to start building your record</Text>
            <Pressable onPress={() => { lightTap(); goToLogFight(); }} style={styles.logBtn}>
              <Text style={styles.logBtnText}>LOG FIGHT</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="RECORD" title="Fight Record" />

        {/* Full record display */}
        <FightRecordDisplay fights={fights} variant="full" />

        {/* Fight history */}
        <View style={styles.historySection}>
          <Text style={styles.sectionLabel}>FIGHT HISTORY</Text>
          {fights.map((fight) => (
            <FightCard
              key={fight.id}
              fight={fight}
              onPress={() => goToFightDetail(fight.id)}
            />
          ))}
        </View>

        <Pressable onPress={() => { lightTap(); goToLogFight(); }} style={styles.addBtn}>
          <Text style={styles.addBtnText}>LOG FIGHT</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  emptyContainer: { flex: 1, padding: spacing.xl },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.lg },
  emptyTitle: { ...fonts.heading, color: colors.textSecondary },
  emptyDesc: { ...fonts.small, color: colors.textMuted, textAlign: "center" },
  logBtn: {
    paddingHorizontal: spacing["3xl"], paddingVertical: spacing.lg,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.accent, marginTop: spacing.lg,
  },
  logBtnText: { fontSize: 14, fontWeight: "700", color: colors.accent, letterSpacing: 2 },
  historySection: { marginTop: spacing["2xl"], gap: spacing.md },
  sectionLabel: { ...fonts.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  addBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing["2xl"],
  },
  addBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
