import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { useProgramStore } from "../../src/stores/useProgramStore";
import { lightTap } from "../../src/lib/haptics";
import { goToProgramDetail, goToBoxerQuiz } from "../../src/lib/navigation";
import type { TrainingProgram } from "../../src/types";

function ProgramCard({ program }: { program: TrainingProgram }) {
  return (
    <Panel
      tone="subtle"
      onPress={() => { lightTap(); goToProgramDetail(program.id); }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardName} numberOfLines={1}>{program.name}</Text>
        {program.isPremium && (
          <View style={styles.premBadge}>
            <Text style={styles.premText}>PREMIUM</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardDesc} numberOfLines={2}>{program.description}</Text>
      <View style={styles.cardMeta}>
        <View style={styles.metaBadge}>
          <Text style={styles.metaText}>{program.focus.replace(/_/g, " ").toUpperCase()}</Text>
        </View>
        <Text style={styles.metaDuration}>{program.durationWeeks}wk \u00B7 {program.daysPerWeek}d/wk</Text>
        <Text style={styles.metaDiff}>{program.difficulty.toUpperCase()}</Text>
      </View>
    </Panel>
  );
}

export default function BrowseProgramsScreen() {
  const programs = useProgramStore((s) => s.getAllPrograms());
  const boxerType = useProgramStore((s) => s.boxerType);

  const recommended = boxerType
    ? programs.filter((p) => p.targetBoxerType.includes(boxerType))
    : [];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="PROGRAMS" title="Training Programs" subtitle="Structured plans to level up your boxing" />

        {!boxerType && (
          <Panel
            onPress={() => { lightTap(); goToBoxerQuiz(); }}
            style={styles.quizPrompt}
          >
            <Text style={styles.quizTitle}>Find Your Program</Text>
            <Text style={styles.quizDesc}>Take a quick quiz to get personalized recommendations</Text>
            <Text style={styles.quizCta}>TAKE QUIZ \u2192</Text>
          </Panel>
        )}

        {recommended.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="RECOMMENDED FOR YOU" />
            {recommended.map((p) => <ProgramCard key={p.id} program={p} />)}
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader title="ALL PROGRAMS" right={`${programs.length} programs`} />
          {programs.map((p) => <ProgramCard key={p.id} program={p} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  section: { marginBottom: spacing["2xl"] },
  card: { padding: spacing.lg, marginBottom: spacing.md },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  cardName: { ...fonts.subheading, flex: 1 },
  premBadge: {
    paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.accent, backgroundColor: "rgba(251,191,36,0.1)",
  },
  premText: { fontSize: 9, fontWeight: "700", color: colors.accent, letterSpacing: 1 },
  cardDesc: { ...fonts.small, color: colors.textSecondary, marginBottom: spacing.md },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  metaBadge: {
    paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.panelBorder,
  },
  metaText: { fontSize: 9, fontWeight: "700", color: colors.textMuted, letterSpacing: 0.5 },
  metaDuration: { fontSize: 11, color: colors.textSecondary },
  metaDiff: { fontSize: 11, fontWeight: "700", color: colors.textMuted },
  quizPrompt: { padding: spacing.xl, marginBottom: spacing["2xl"], borderColor: colors.accent },
  quizTitle: { ...fonts.heading, color: colors.accent, marginBottom: spacing.xs },
  quizDesc: { ...fonts.small, color: colors.textSecondary, marginBottom: spacing.lg },
  quizCta: { fontSize: 13, fontWeight: "700", color: colors.accent, letterSpacing: 2 },
});
