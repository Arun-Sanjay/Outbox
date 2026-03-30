import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { PageHeader, Panel, SectionHeader, MetricValue } from "../../src/components";
import { RankBadge, XPBar, StreakDisplay } from "../../src/components/gamification";
import { WeightClassIndicator, WeightEntryModal } from "../../src/components/weight";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { useWeightStore } from "../../src/stores/useWeightStore";
import { useCampStore } from "../../src/stores/useCampStore";
import { useBenchmarkStore } from "../../src/stores/useBenchmarkStore";
import { useProgramStore } from "../../src/stores/useProgramStore";
import { daysUntil } from "../../src/lib/date";
import { formatBenchmarkValue, getBenchmarkInfo } from "../../src/data/benchmarks";
import { lightTap } from "../../src/lib/haptics";
import { goToSettings, goToProfileEdit, goToCampSetup, goToCampDashboard, goToBenchmarks, goToBrowsePrograms, goToBoxerQuiz, goToGlossary, goToTechniqueReference, goToTipOfDay } from "../../src/lib/navigation";

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export default function ProfileScreen() {
  const profile = useProfileStore((s) => s.profile);
  const sessions = useSessionStore((s) => s.trainingHistory);
  const currentWeight = useWeightStore((s) => s.currentWeight);
  const unit = useWeightStore((s) => s.unit);
  const activeCamp = useCampStore((s) => s.activeCamp);
  const benchmarks = useBenchmarkStore((s) => s.getAllLatestBenchmarks());
  const activeProgram = useProgramStore((s) => s.getActiveProgram());
  const achievements = profile?.achievements ?? [];
  const unlocked = achievements.filter(a => a.unlockedAt !== null);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const totalStats = useSessionStore((s) => s.getTotalStats());

  return (
    <SafeAreaView style={st.safe} edges={["top"]}>
      <WeightEntryModal visible={showWeightModal} onClose={() => setShowWeightModal(false)} />
      <ScrollView style={st.scroll} contentContainerStyle={st.content}>
        <View style={st.headerRow}>
          <PageHeader kicker="PROFILE" title={profile?.fightName || profile?.name || "Fighter"} />
          <Pressable onPress={() => { lightTap(); goToSettings(); }}><Ionicons name="settings-outline" size={22} color={colors.textMuted} /></Pressable>
        </View>

        {profile && (
          <Panel style={st.rankPanel}>
            <RankBadge rank={profile.rank} size="lg" />
            <XPBar currentXP={profile.totalXP} />
            <View style={st.totalRow}>
              <MetricValue label="Sessions" value={totalStats.totalSessions} size="sm" animated />
              <MetricValue label="Hours" value={totalStats.totalHours} size="sm" animated />
              <MetricValue label="Rounds" value={totalStats.totalRounds} size="sm" animated />
            </View>
            <StreakDisplay days={profile.currentStreak} />
          </Panel>
        )}

        <SectionHeader title="WEIGHT" />
        <Panel tone="subtle" style={st.weightPanel}>
          {currentWeight ? (
            <>
              <Text style={st.weightValue}>{currentWeight} {unit}</Text>
              <WeightClassIndicator currentWeight={currentWeight} unit={unit} />
            </>
          ) : <Text style={st.emptyText}>No weight logged</Text>}
          <Pressable onPress={() => { lightTap(); setShowWeightModal(true); }} style={st.smallBtn}><Text style={st.smallBtnText}>LOG WEIGHT</Text></Pressable>
        </Panel>

        <SectionHeader title="FIGHT CAMP" />
        {activeCamp ? (
          <Panel tone="subtle" onPress={() => { lightTap(); goToCampDashboard(); }} style={st.campPanel}>
            <Text style={st.campDays}>{Math.max(0, daysUntil(activeCamp.fightDate))} days</Text>
            <Text style={st.campLabel}>to fight night</Text>
          </Panel>
        ) : (
          <Panel tone="subtle" onPress={() => { lightTap(); goToCampSetup(); }} style={st.campPanel}>
            <Text style={st.emptyText}>No active camp</Text>
            <Text style={st.campCta}>SET UP CAMP \u2192</Text>
          </Panel>
        )}

        <SectionHeader title="BENCHMARKS" right={benchmarks.length + "/8 tested"} />
        <Pressable onPress={() => { lightTap(); goToBenchmarks(); }}>
          <Panel tone="subtle" style={st.benchPanel}>
            {benchmarks.length > 0 ? benchmarks.slice(0, 3).map(b => {
              const info = getBenchmarkInfo(b.type);
              return <View key={b.id} style={st.benchRow}><Text style={st.benchName}>{info?.name ?? b.type}</Text><Text style={st.benchVal}>{formatBenchmarkValue(b.type, b.value)}</Text></View>;
            }) : <Text style={st.emptyText}>No benchmarks logged</Text>}
          </Panel>
        </Pressable>

        <SectionHeader title="KNOWLEDGE" />
        <View style={st.menuList}>
          <Pressable onPress={() => { lightTap(); goToTechniqueReference(); }} style={st.menuItem}><Ionicons name="school" size={18} color={colors.accent}/><Text style={st.menuText}>Technique Reference</Text><Ionicons name="chevron-forward" size={16} color={colors.textMuted}/></Pressable>
          <Pressable onPress={() => { lightTap(); goToGlossary(); }} style={st.menuItem}><Ionicons name="book" size={18} color={colors.accent}/><Text style={st.menuText}>Glossary</Text><Ionicons name="chevron-forward" size={16} color={colors.textMuted}/></Pressable>
          <Pressable onPress={() => { lightTap(); goToTipOfDay(); }} style={st.menuItem}><Ionicons name="bulb" size={18} color={colors.accent}/><Text style={st.menuText}>Tip of the Day</Text><Ionicons name="chevron-forward" size={16} color={colors.textMuted}/></Pressable>
        </View>

        <SectionHeader title="PROGRAMS" />
        {activeProgram ? (
          <Panel tone="subtle" onPress={() => { lightTap(); goToBrowsePrograms(); }} style={st.progPanel}>
            <Text style={fonts.subheading}>{activeProgram.program.name}</Text>
            <View style={st.progBar}><View style={[st.progFill, { width: `${Math.round(activeProgram.progress * 100)}%` as `${number}%` }]} /></View>
            <Text style={st.progPct}>{Math.round(activeProgram.progress * 100)}% complete</Text>
          </Panel>
        ) : (
          <Panel tone="subtle" onPress={() => { lightTap(); goToBoxerQuiz(); }} style={st.progPanel}>
            <Text style={st.emptyText}>No active program</Text>
            <Text style={st.campCta}>TAKE QUIZ \u2192</Text>
          </Panel>
        )}

        <SectionHeader title="ACHIEVEMENTS" right={unlocked.length + "/" + achievements.length} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.achScroll}>
          {(unlocked.length > 0 ? unlocked : achievements).slice(0, 8).map(a => (
            <View key={a.id} style={[st.achCard, !a.unlockedAt && st.achLocked]}>
              <Ionicons name={(a.icon as keyof typeof Ionicons.glyphMap) ?? "trophy"} size={20} color={a.unlockedAt ? colors.accent : colors.textMuted} />
              <Text style={[st.achName, !a.unlockedAt && st.achNameLocked]} numberOfLines={1}>{a.name}</Text>
            </View>
          ))}
        </ScrollView>

        <SectionHeader title="SETTINGS" />
        <View style={st.menuList}>
          <Pressable onPress={() => { lightTap(); goToProfileEdit(); }} style={st.menuItem}><Ionicons name="person" size={18} color={colors.textSecondary}/><Text style={st.menuText}>Edit Profile</Text><Ionicons name="chevron-forward" size={16} color={colors.textMuted}/></Pressable>
          <Pressable onPress={() => { lightTap(); goToSettings(); }} style={st.menuItem}><Ionicons name="settings" size={18} color={colors.textSecondary}/><Text style={st.menuText}>Settings</Text><Ionicons name="chevron-forward" size={16} color={colors.textMuted}/></Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 120 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  rankPanel: { padding: spacing.xl, alignItems: "center", gap: spacing.lg, marginBottom: spacing["2xl"] },
  totalRow: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  weightPanel: { padding: spacing.xl, gap: spacing.lg, marginBottom: spacing["2xl"] },
  weightValue: { fontSize: 28, fontWeight: "800", color: colors.text, fontFamily: monoFont, fontVariant: ["tabular-nums"] },
  smallBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.accent, alignSelf: "flex-start" },
  smallBtnText: { fontSize: 11, fontWeight: "700", color: colors.accent, letterSpacing: 1 },
  campPanel: { padding: spacing.xl, alignItems: "center", gap: spacing.sm, marginBottom: spacing["2xl"] },
  campDays: { fontSize: 28, fontWeight: "800", color: colors.accent, fontFamily: monoFont },
  campLabel: { fontSize: 12, color: colors.textSecondary },
  campCta: { fontSize: 12, fontWeight: "700", color: colors.accent, letterSpacing: 1, marginTop: spacing.sm },
  emptyText: { ...fonts.small, color: colors.textMuted },
  benchPanel: { padding: spacing.lg, gap: spacing.md, marginBottom: spacing["2xl"] },
  benchRow: { flexDirection: "row", justifyContent: "space-between" },
  benchName: { fontSize: 13, color: colors.textSecondary },
  benchVal: { fontSize: 14, fontWeight: "700", color: colors.accent, fontFamily: monoFont },
  menuList: { gap: spacing.sm, marginBottom: spacing["2xl"] },
  menuItem: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.panelBorder, backgroundColor: colors.inputBg },
  menuText: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.text },
  progPanel: { padding: spacing.xl, gap: spacing.md, marginBottom: spacing["2xl"] },
  progBar: { height: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" },
  progFill: { height: 6, backgroundColor: colors.accent, borderRadius: 3 },
  progPct: { fontSize: 12, color: colors.textSecondary },
  achScroll: { marginBottom: spacing["2xl"] },
  achCard: { width: 80, height: 80, borderRadius: radius.md, borderWidth: 1, borderColor: colors.panelBorder, backgroundColor: colors.inputBg, alignItems: "center", justifyContent: "center", gap: spacing.xs, marginRight: spacing.md },
  achLocked: { opacity: 0.4 },
  achName: { fontSize: 9, fontWeight: "700", color: colors.text, textAlign: "center" },
  achNameLocked: { color: colors.textMuted },
});
