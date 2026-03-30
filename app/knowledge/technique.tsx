import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { PUNCHES, DEFENSES, FOOTWORK } from "../../src/data/punches";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { lightTap } from "../../src/lib/haptics";
import type { PunchCode, DefenseCode, FootworkCode } from "../../src/types";

const PUNCH_ORDER: PunchCode[] = ["1", "2", "3", "4", "5", "6", "1b", "2b", "3b", "4b"];
const DEFENSE_ORDER: DefenseCode[] = ["slip", "roll", "pull", "step_back", "block"];
const FOOTWORK_ORDER: FootworkCode[] = [
  "pivot_left", "pivot_right", "angle_left", "angle_right",
  "circle_left", "circle_right", "step_in", "step_out",
];

export default function TechniqueReferenceScreen() {
  const stance = useProfileStore((s) => s.profile?.stance ?? "orthodox");
  const [expandedPunch, setExpandedPunch] = useState<PunchCode | null>(null);
  const [expandedDefense, setExpandedDefense] = useState<DefenseCode | null>(null);
  const [expandedFootwork, setExpandedFootwork] = useState<FootworkCode | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="LEARN" title="Technique Reference" subtitle={`Showing for ${stance} stance`} />

        {/* PUNCHES */}
        <SectionHeader title="PUNCHES" right="10 techniques" />
        {PUNCH_ORDER.map((code) => {
          const punch = PUNCHES[code];
          if (!punch) return null;
          const isExpanded = expandedPunch === code;
          const hand = stance === "southpaw" ? punch.southpawHand : punch.orthodoxHand;

          return (
            <Pressable
              key={code}
              onPress={() => { lightTap(); setExpandedPunch(isExpanded ? null : code); }}
            >
              <Panel tone="subtle" style={styles.techPanel}>
                <View style={styles.techHeader}>
                  <View style={styles.techLeft}>
                    <Text style={styles.punchCode}>{code}</Text>
                    <View>
                      <Text style={styles.punchName}>{punch.name}</Text>
                      <Text style={styles.punchMeta}>
                        {hand.toUpperCase()} hand \u00B7 {punch.target} \u00B7 {punch.type}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={colors.textMuted} />
                </View>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.subLabel}>FORM CUES</Text>
                    {punch.formCues.map((cue, i) => (
                      <Text key={i} style={styles.cueText}>{i + 1}. {cue}</Text>
                    ))}

                    <Text style={[styles.subLabel, { marginTop: spacing.lg }]}>COMMON MISTAKES</Text>
                    {punch.commonMistakes.map((m, i) => (
                      <Text key={i} style={styles.mistakeText}>\u2022 {m}</Text>
                    ))}
                  </View>
                )}
              </Panel>
            </Pressable>
          );
        })}

        {/* DEFENSE */}
        <View style={styles.sectionGap} />
        <SectionHeader title="DEFENSE" right="5 techniques" />
        {DEFENSE_ORDER.map((code) => {
          const defense = DEFENSES[code];
          if (!defense) return null;
          const isExpanded = expandedDefense === code;

          return (
            <Pressable
              key={code}
              onPress={() => { lightTap(); setExpandedDefense(isExpanded ? null : code); }}
            >
              <Panel tone="subtle" style={styles.techPanel}>
                <View style={styles.techHeader}>
                  <View style={styles.techLeft}>
                    <Text style={styles.defenseName}>{defense.name}</Text>
                  </View>
                  <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={colors.textMuted} />
                </View>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.descText}>{defense.description}</Text>

                    {defense.defendsAgainst && defense.defendsAgainst.length > 0 && (
                      <>
                        <Text style={[styles.subLabel, { marginTop: spacing.lg }]}>DEFENDS AGAINST</Text>
                        <Text style={styles.cueText}>{defense.defendsAgainst.join(", ")}</Text>
                      </>
                    )}

                    <Text style={[styles.subLabel, { marginTop: spacing.lg }]}>FORM CUES</Text>
                    {defense.formCues.map((cue, i) => (
                      <Text key={i} style={styles.cueText}>{i + 1}. {cue}</Text>
                    ))}

                    {defense.counterOpportunities && defense.counterOpportunities.length > 0 && (
                      <>
                        <Text style={[styles.subLabel, { marginTop: spacing.lg }]}>COUNTER OPPORTUNITIES</Text>
                        {defense.counterOpportunities.map((c, i) => (
                          <Text key={i} style={styles.cueText}>\u2022 {c}</Text>
                        ))}
                      </>
                    )}
                  </View>
                )}
              </Panel>
            </Pressable>
          );
        })}

        {/* FOOTWORK */}
        <View style={styles.sectionGap} />
        <SectionHeader title="FOOTWORK" right="8 techniques" />
        {FOOTWORK_ORDER.map((code) => {
          const fw = FOOTWORK[code];
          if (!fw) return null;
          const isExpanded = expandedFootwork === code;

          return (
            <Pressable
              key={code}
              onPress={() => { lightTap(); setExpandedFootwork(isExpanded ? null : code); }}
            >
              <Panel tone="subtle" style={styles.techPanel}>
                <View style={styles.techHeader}>
                  <View style={styles.techLeft}>
                    <Text style={styles.defenseName}>{fw.name}</Text>
                  </View>
                  <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={colors.textMuted} />
                </View>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.descText}>{fw.description}</Text>

                    <Text style={[styles.subLabel, { marginTop: spacing.lg }]}>FORM CUES</Text>
                    {fw.formCues.map((cue, i) => (
                      <Text key={i} style={styles.cueText}>{i + 1}. {cue}</Text>
                    ))}

                  </View>
                )}
              </Panel>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  sectionGap: { height: spacing["2xl"] },
  techPanel: { padding: spacing.md, marginBottom: spacing.sm },
  techHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  techLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  punchCode: {
    fontSize: 18, fontWeight: "800", color: colors.accent,
    width: 32, textAlign: "center",
  },
  punchName: { ...fonts.subheading },
  punchMeta: { fontSize: 11, color: colors.textMuted },
  defenseName: { ...fonts.subheading },
  expandedContent: { marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.panelBorder },
  subLabel: { fontSize: 10, fontWeight: "700", color: colors.accent, letterSpacing: 2, marginBottom: spacing.sm },
  descText: { ...fonts.body, color: colors.textSecondary, marginBottom: spacing.md },
  cueText: { ...fonts.small, color: colors.textSecondary, marginBottom: 4, paddingLeft: spacing.sm },
  mistakeText: { ...fonts.small, color: colors.danger, marginBottom: 4, paddingLeft: spacing.sm, opacity: 0.8 },
});
