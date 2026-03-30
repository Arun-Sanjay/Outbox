import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { useProgramStore } from "../../src/stores/useProgramStore";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { getSessionTypeLabel } from "../../src/lib/workout-utils";
import { successNotification, mediumTap, lightTap } from "../../src/lib/haptics";
import { goBack } from "../../src/lib/navigation";

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const program = useProgramStore((s) => s.getProgramById(id ?? ""));
  const activeData = useProgramStore((s) => s.getActiveProgram());
  const startProgram = useProgramStore((s) => s.startProgram);
  const completeDay = useProgramStore((s) => s.completeDay);
  const stopProgram = useProgramStore((s) => s.stopProgram);
  const addXP = useProfileStore((s) => s.addXP);

  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  if (!program) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Program not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isActive = activeData?.program.id === program.id;
  const hasOtherActive = activeData !== null && !isActive;

  // Group days into weeks
  const weeks: { weekNum: number; days: typeof program.days }[] = [];
  const daysPerWeek = program.daysPerWeek || 7;
  for (let i = 0; i < program.days.length; i += daysPerWeek) {
    weeks.push({
      weekNum: Math.floor(i / daysPerWeek) + 1,
      days: program.days.slice(i, i + daysPerWeek),
    });
  }

  const handleStart = () => {
    if (hasOtherActive) {
      Alert.alert(
        "Switch Program?",
        "Starting this program will end your current program.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Switch",
            onPress: () => {
              stopProgram();
              startProgram(program.id);
              successNotification();
            },
          },
        ]
      );
    } else {
      startProgram(program.id);
      successNotification();
    }
  };

  const handleCompleteToday = () => {
    mediumTap();
    completeDay();
    addXP(35, "program", `Completed ${program.name} day`);
    successNotification();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <PageHeader
          kicker={program.focus.replace(/_/g, " ").toUpperCase()}
          title={program.name}
          subtitle={program.description}
        />

        {/* Meta badges */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{program.durationWeeks} WEEKS</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{program.difficulty.toUpperCase()}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{program.daysPerWeek} DAYS/WK</Text>
          </View>
          {program.isPremium && (
            <View style={[styles.badge, styles.premiumBadge]}>
              <Text style={[styles.badgeText, styles.premiumText]}>PREMIUM</Text>
            </View>
          )}
        </View>

        {/* Active progress */}
        {isActive && activeData && (
          <Panel style={styles.activePanel}>
            <Text style={styles.activeKicker}>ACTIVE PROGRAM</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.round(activeData.progress * 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Day {activeData.data.currentDay} of {activeData.program.days.length} \u00B7 {Math.round(activeData.progress * 100)}%
            </Text>

            {activeData.currentProgramDay && (
              <Panel tone="subtle" style={styles.todayCard}>
                <Text style={styles.todayTitle}>{activeData.currentProgramDay.title}</Text>
                <Text style={styles.todayDesc}>{activeData.currentProgramDay.description}</Text>
                <Text style={styles.todayMeta}>
                  {getSessionTypeLabel(activeData.currentProgramDay.sessionType)} \u00B7 {activeData.currentProgramDay.suggestedDuration}min \u00B7 {activeData.currentProgramDay.suggestedIntensity.toUpperCase()}
                </Text>
                {!activeData.currentProgramDay.isRestDay && (
                  <Pressable onPress={handleCompleteToday} style={styles.completeBtn}>
                    <Text style={styles.completeBtnText}>COMPLETE TODAY (+35 XP)</Text>
                  </Pressable>
                )}
              </Panel>
            )}
          </Panel>
        )}

        {/* Weekly breakdown */}
        <SectionHeader title="WEEKLY BREAKDOWN" />
        {weeks.map((week) => (
          <View key={week.weekNum}>
            <Pressable
              onPress={() => { lightTap(); setExpandedWeek(expandedWeek === week.weekNum ? null : week.weekNum); }}
              style={styles.weekHeader}
            >
              <Text style={styles.weekTitle}>WEEK {week.weekNum}</Text>
              <Ionicons
                name={expandedWeek === week.weekNum ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.textMuted}
              />
            </Pressable>

            {expandedWeek === week.weekNum && (
              <View style={styles.weekDays}>
                {week.days.map((d) => {
                  const completed = isActive && activeData?.data.completedDays.includes(d.dayNumber);
                  return (
                    <View key={d.dayNumber} style={[styles.dayRow, d.isRestDay && styles.dayRowRest]}>
                      <View style={[styles.dayDot, completed && styles.dayDotCompleted]} />
                      <View style={styles.dayContent}>
                        <Text style={[styles.dayTitle, d.isRestDay && styles.dayTitleRest]}>{d.title}</Text>
                        {!d.isRestDay && (
                          <Text style={styles.dayMeta}>
                            {getSessionTypeLabel(d.sessionType)} \u00B7 {d.suggestedDuration}min
                          </Text>
                        )}
                      </View>
                      {completed && (
                        <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ))}

        {/* Start / Switch button */}
        {!isActive && (
          <Pressable onPress={handleStart} style={styles.startBtn}>
            <Text style={styles.startBtnText}>
              {hasOtherActive ? "SWITCH TO THIS PROGRAM" : "START PROGRAM"}
            </Text>
          </Pressable>
        )}

        {isActive && (
          <Pressable
            onPress={() => { Alert.alert("End Program?", "Your progress will be lost.", [
              { text: "Cancel", style: "cancel" },
              { text: "End", style: "destructive", onPress: stopProgram },
            ]); }}
            style={styles.endBtn}
          >
            <Text style={styles.endBtnText}>END PROGRAM</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFoundText: { ...fonts.heading, color: colors.textMuted },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing["2xl"] },
  badge: {
    paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.panelBorder,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 },
  premiumBadge: { borderColor: colors.accent, backgroundColor: "rgba(251,191,36,0.1)" },
  premiumText: { color: colors.accent },
  activePanel: { padding: spacing.xl, marginBottom: spacing["2xl"] },
  activeKicker: { fontSize: 10, fontWeight: "700", color: colors.accent, letterSpacing: 3, marginBottom: spacing.md },
  progressBarBg: { height: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", marginBottom: spacing.sm },
  progressBarFill: { height: 6, backgroundColor: colors.accent, borderRadius: 3 },
  progressText: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.lg },
  todayCard: { padding: spacing.lg, gap: spacing.sm },
  todayTitle: { ...fonts.subheading },
  todayDesc: { ...fonts.small, color: colors.textSecondary },
  todayMeta: { fontSize: 11, fontWeight: "600", color: colors.textMuted },
  completeBtn: {
    backgroundColor: colors.accent, paddingVertical: spacing.md,
    borderRadius: radius.md, alignItems: "center", marginTop: spacing.md,
  },
  completeBtnText: { fontSize: 13, fontWeight: "800", color: "#000000", letterSpacing: 1 },
  weekHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.panelBorder,
  },
  weekTitle: { fontSize: 12, fontWeight: "700", color: colors.text, letterSpacing: 2 },
  weekDays: { paddingVertical: spacing.sm },
  dayRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm, paddingLeft: spacing.md },
  dayRowRest: { opacity: 0.5 },
  dayDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.1)" },
  dayDotCompleted: { backgroundColor: colors.accent },
  dayContent: { flex: 1 },
  dayTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  dayTitleRest: { fontStyle: "italic", color: colors.textMuted },
  dayMeta: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  startBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing["2xl"],
  },
  startBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
  endBtn: {
    height: TOUCH_MIN, borderRadius: radius.md, borderWidth: 1, borderColor: colors.panelBorder,
    alignItems: "center", justifyContent: "center", marginTop: spacing["2xl"],
  },
  endBtnText: { fontSize: 13, fontWeight: "700", color: colors.textMuted, letterSpacing: 2 },
});
