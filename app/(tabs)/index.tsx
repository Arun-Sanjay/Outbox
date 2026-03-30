import React, { useMemo } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { Panel, SectionHeader } from "../../src/components";
import { RankBadge, XPBar, StreakDisplay } from "../../src/components/gamification";
import { SessionCard } from "../../src/components/session";
import { FightRecordDisplay } from "../../src/components/fight";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { useFightStore } from "../../src/stores/useFightStore";
import { useCampStore } from "../../src/stores/useCampStore";
import { useKnowledgeStore } from "../../src/stores/useKnowledgeStore";
import { daysUntil, getTodayKey, addDays } from "../../src/lib/date";
import { lightTap } from "../../src/lib/haptics";
import {
  goToComboSession, goToRoundTimer, goToLogSession, goToSkipRope,
  goToFightRecord, goToCampDashboard,
} from "../../src/lib/navigation";

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export default function HomeScreen() {
  const profile = useProfileStore((s) => s.profile);
  const sessions = useSessionStore((s) => s.trainingHistory);
  const fights = useFightStore((s) => s.fights);
  const activeCamp = useCampStore((s) => s.activeCamp);
  const getDailyTip = useKnowledgeStore((s) => s.getDailyTip);

  const today = getTodayKey();
  const trainedToday = sessions.some((s) => s.date === today);
  const recentSessions = sessions.slice(0, 4);

  const weekBars = useMemo(() => {
    const bars: { day: string; minutes: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dateKey = addDays(today, -i);
      const dayMinutes = sessions
        .filter((s) => s.date === dateKey)
        .reduce((sum, s) => sum + Math.round(s.durationSeconds / 60), 0);
      const dayLabel = new Date(dateKey + "T00:00:00").toLocaleDateString("en", { weekday: "short" }).charAt(0);
      bars.push({ day: dayLabel, minutes: dayMinutes, isToday: i === 0 });
    }
    return bars;
  }, [sessions, today]);
  const maxBarMin = Math.max(1, ...weekBars.map((b) => b.minutes));

  const dailyTip = getDailyTip(today);
  const greeting = profile
    ? `${trainedToday ? "Great work today" : "Ready to train"}, ${profile.fightName || profile.name}?`
    : "Ready to train?";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>OUTBOX</Text>
            <Text style={styles.greeting}>{greeting}</Text>
          </View>
          {profile && <RankBadge rank={profile.rank} size="sm" showLabel={false} />}
        </View>

        {activeCamp ? (
          <Panel onPress={() => { lightTap(); goToCampDashboard(); }} style={styles.heroPanel}>
            <Text style={styles.heroKicker}>FIGHT CAMP</Text>
            <Text style={styles.heroDays}>{Math.max(0, daysUntil(activeCamp.fightDate))}</Text>
            <Text style={styles.heroLabel}>DAYS TO FIGHT NIGHT</Text>
          </Panel>
        ) : trainedToday ? (
          <Panel style={styles.heroPanel}>
            <Text style={styles.heroKicker}>TODAY</Text>
            <Ionicons name="checkmark-circle" size={40} color={colors.accent} />
            <Text style={styles.heroLabel}>SESSION COMPLETE</Text>
          </Panel>
        ) : (
          <Panel onPress={() => { lightTap(); goToComboSession(); }} style={styles.heroPanel}>
            <Text style={styles.heroKicker}>READY?</Text>
            <Text style={styles.heroStart}>START TRAINING</Text>
            <Text style={styles.heroLabel}>Tap to begin a combo session</Text>
          </Panel>
        )}

        {profile && (
          <View style={styles.statsRow}>
            <Panel tone="subtle" style={styles.statPanel}>
              <StreakDisplay days={profile.currentStreak} compact />
            </Panel>
            <Panel tone="subtle" style={styles.statPanel}>
              <Text style={styles.xpValue}>{profile.totalXP.toLocaleString()}</Text>
              <Text style={styles.xpLabel}>XP</Text>
              <XPBar currentXP={profile.totalXP} showValues={false} />
            </Panel>
          </View>
        )}

        <SectionHeader title="THIS WEEK" />
        <View style={styles.weekChart}>
          {weekBars.map((bar, i) => (
            <View key={i} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {
                  height: `${Math.max(4, (bar.minutes / maxBarMin) * 100)}%`,
                  backgroundColor: bar.isToday ? colors.accent : "rgba(251,191,36,0.3)",
                }]} />
              </View>
              <Text style={[styles.barLabel, bar.isToday && styles.barLabelToday]}>{bar.day}</Text>
            </View>
          ))}
        </View>

        <SectionHeader title="QUICK START" />
        <View style={styles.quickGrid}>
          {([
            { label: "Bag Work", icon: "fitness" as const, action: goToComboSession },
            { label: "Timer", icon: "timer" as const, action: goToRoundTimer },
            { label: "Log Session", icon: "create" as const, action: goToLogSession },
            { label: "Skip Rope", icon: "heart" as const, action: goToSkipRope },
          ]).map((item) => (
            <Pressable key={item.label} onPress={() => { lightTap(); item.action(); }} style={styles.quickCard}>
              <Ionicons name={item.icon} size={24} color={colors.accent} />
              <Text style={styles.quickLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {fights.length > 0 && (
          <>
            <SectionHeader title="FIGHT RECORD" />
            <Pressable onPress={() => { lightTap(); goToFightRecord(); }}>
              <Panel tone="subtle" style={styles.fightPanel}>
                <FightRecordDisplay fights={fights} variant="compact" />
              </Panel>
            </Pressable>
          </>
        )}

        {recentSessions.length > 0 && (
          <>
            <SectionHeader title="RECENT SESSIONS" right={`${sessions.length} total`} />
            <View style={styles.sessionsContainer}>
              {recentSessions.map((s) => <SessionCard key={s.id} session={s} />)}
            </View>
          </>
        )}

        {dailyTip && (
          <>
            <SectionHeader title="TIP OF THE DAY" />
            <Panel tone="subtle" style={styles.tipPanel}>
              <Text style={styles.tipTitle}>{dailyTip.title}</Text>
              <Text style={styles.tipContent} numberOfLines={3}>{dailyTip.content}</Text>
            </Panel>
          </>
        )}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 120 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing["2xl"] },
  headerLeft: { flex: 1 },
  logo: { fontSize: 28, fontWeight: "800", color: colors.accent, letterSpacing: 4 },
  greeting: { ...fonts.small, color: colors.textSecondary, marginTop: spacing.xs },
  heroPanel: { padding: spacing["2xl"], alignItems: "center", marginBottom: spacing["2xl"] },
  heroKicker: { fontSize: 10, fontWeight: "700", color: colors.accent, letterSpacing: 3 },
  heroDays: { fontSize: 56, fontWeight: "800", color: colors.accent, fontFamily: monoFont, fontVariant: ["tabular-nums"], marginVertical: spacing.sm },
  heroLabel: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.sm },
  heroStart: { fontSize: 20, fontWeight: "800", color: colors.text, letterSpacing: 2, marginVertical: spacing.md },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing["2xl"] },
  statPanel: { flex: 1, padding: spacing.lg, alignItems: "center", gap: spacing.sm },
  xpValue: { fontSize: 20, fontWeight: "800", color: colors.accent, fontFamily: monoFont, fontVariant: ["tabular-nums"] },
  xpLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2 },
  weekChart: { flexDirection: "row", justifyContent: "space-between", height: 80, marginBottom: spacing["2xl"], gap: spacing.xs },
  barColumn: { flex: 1, alignItems: "center", gap: spacing.xs },
  barTrack: { flex: 1, width: "100%", justifyContent: "flex-end", borderRadius: 3, overflow: "hidden" },
  barFill: { width: "100%", borderRadius: 3, minHeight: 4 },
  barLabel: { fontSize: 10, fontWeight: "600", color: colors.textMuted },
  barLabelToday: { color: colors.accent, fontWeight: "800" },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginBottom: spacing["2xl"] },
  quickCard: { width: "47%", paddingVertical: spacing.xl, borderRadius: radius.md, borderWidth: 1, borderColor: colors.panelBorder, backgroundColor: colors.inputBg, alignItems: "center", gap: spacing.sm },
  quickLabel: { fontSize: 12, fontWeight: "700", color: colors.text, letterSpacing: 1 },
  fightPanel: { padding: spacing.lg, marginBottom: spacing["2xl"] },
  sessionsContainer: { gap: spacing.md, marginBottom: spacing["2xl"] },
  tipPanel: { padding: spacing.lg, marginBottom: spacing["2xl"] },
  tipTitle: { ...fonts.subheading, color: colors.accent, marginBottom: spacing.xs },
  tipContent: { ...fonts.small, color: colors.textSecondary, lineHeight: 20 },
  spacer: { height: 40 },
});
