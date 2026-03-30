import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { PageHeader, Panel } from "../../src/components";
import { useKnowledgeStore } from "../../src/stores/useKnowledgeStore";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { BOXING_TIPS } from "../../src/data/tips";
import { getTodayKey } from "../../src/lib/date";
import { successNotification, lightTap } from "../../src/lib/haptics";

const CATEGORY_COLORS: Record<string, string> = {
  offense: "#f87171",
  defense: "rgba(96,165,250,0.8)",
  footwork: "#22d3ee",
  conditioning: "#34d399",
  mindset: "#a78bfa",
  nutrition: "#fb923c",
  recovery: "#e879f9",
};

export default function TipOfTheDayScreen() {
  const lastTipDate = useKnowledgeStore((s) => s.lastDailyTipDate);
  const currentTipId = useKnowledgeStore((s) => s.currentDailyTipId);
  const setLastDate = useKnowledgeStore((s) => s.setLastDailyTipDate);
  const addXP = useProfileStore((s) => s.addXP);

  const todayKey = getTodayKey();
  const alreadyRead = lastTipDate === todayKey;

  // Pick tip: rotate through all tips by day number
  const tip = useMemo(() => {
    if (BOXING_TIPS.length === 0) return null;
    if (alreadyRead && currentTipId) {
      return BOXING_TIPS.find((t) => t.id === currentTipId) ?? BOXING_TIPS[0];
    }
    const dayNum = Math.floor(
      new Date(todayKey + "T00:00:00").getTime() / (1000 * 60 * 60 * 24)
    ) % BOXING_TIPS.length;
    return BOXING_TIPS[dayNum];
  }, [todayKey, alreadyRead, currentTipId]);

  const handleMarkAsRead = () => {
    if (alreadyRead || !tip) return;
    lightTap();
    setLastDate(todayKey);
    addXP(5, "training", "Read daily tip");
    successNotification();
  };

  if (!tip) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No tips available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const categoryColor = CATEGORY_COLORS[tip.category] ?? colors.textMuted;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="DAILY TIP" title="Tip of the Day" />

        <Panel style={styles.tipPanel}>
          {/* Category badge */}
          <View style={[styles.categoryBadge, { borderColor: categoryColor }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {tip.category.toUpperCase()}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.tipTitle}>{tip.title}</Text>

          {/* Content */}
          <Text style={styles.tipContent}>{tip.content}</Text>

          {/* Mark as read */}
          {!alreadyRead ? (
            <Pressable onPress={handleMarkAsRead} style={styles.readBtn}>
              <Text style={styles.readBtnText}>MARK AS READ +5 XP</Text>
            </Pressable>
          ) : (
            <View style={styles.readBadge}>
              <Text style={styles.readBadgeText}>READ TODAY</Text>
            </View>
          )}
        </Panel>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── TipCard for home dashboard preview ───────────────────────────────────────
export function TipCard({ onPress }: { onPress?: () => void }) {
  const todayKey = getTodayKey();
  const tip = useMemo(() => {
    if (BOXING_TIPS.length === 0) return null;
    const dayNum = Math.floor(
      new Date(todayKey + "T00:00:00").getTime() / (1000 * 60 * 60 * 24)
    ) % BOXING_TIPS.length;
    return BOXING_TIPS[dayNum];
  }, [todayKey]);

  if (!tip) return null;
  const categoryColor = CATEGORY_COLORS[tip.category] ?? colors.textMuted;

  return (
    <Panel tone="subtle" onPress={onPress} style={styles.cardPanel}>
      <View style={styles.cardRow}>
        <View style={[styles.cardDot, { backgroundColor: categoryColor }]} />
        <View style={styles.cardContent}>
          <Text style={styles.cardCategory}>{tip.category.toUpperCase()}</Text>
          <Text style={styles.cardTitle} numberOfLines={1}>{tip.title}</Text>
        </View>
        <Text style={styles.cardArrow}>{"\u203A"}</Text>
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { ...fonts.heading, color: colors.textMuted },
  tipPanel: { padding: spacing["2xl"], gap: spacing.lg },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  categoryText: { fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  tipTitle: { fontSize: 24, fontWeight: "800", color: colors.text, lineHeight: 32 },
  tipContent: { ...fonts.body, color: colors.textSecondary, lineHeight: 26 },
  readBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  readBtnText: { fontSize: 14, fontWeight: "800", color: "#000000", letterSpacing: 2 },
  readBadge: {
    alignSelf: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.win,
  },
  readBadgeText: { fontSize: 11, fontWeight: "700", color: colors.win, letterSpacing: 2 },
  // TipCard (home preview)
  cardPanel: { padding: spacing.md },
  cardRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  cardDot: { width: 8, height: 8, borderRadius: 4 },
  cardContent: { flex: 1, gap: 2 },
  cardCategory: { fontSize: 9, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5 },
  cardTitle: { ...fonts.subheading },
  cardArrow: { fontSize: 20, color: colors.textMuted },
});
