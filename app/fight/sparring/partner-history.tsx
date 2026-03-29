import React, { useState, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../../src/theme";
import { PageHeader, Panel } from "../../../src/components";
import { IntensityBadge } from "../../../src/components/session";
import { useFightStore } from "../../../src/stores/useFightStore";
import { getIntensityColor } from "../../../src/lib/workout-utils";
import { lightTap } from "../../../src/lib/haptics";
import type { SparringEntry } from "../../../src/types";

type PartnerSummary = {
  name: string;
  sessions: number;
  lastSparred: string;
  totalRounds: number;
  entries: SparringEntry[];
  dominanceBreakdown: { me: number; even: number; them: number };
};

function getDominanceSummary(entries: SparringEntry[]) {
  let me = 0; let even = 0; let them = 0;
  for (const e of entries) {
    for (const r of e.roundNotes) {
      if (r.dominance === "me") me++;
      else if (r.dominance === "them") them++;
      else even++;
    }
  }
  return { me, even, them };
}

export default function PartnerHistoryScreen() {
  const sparringEntries = useFightStore((s) => s.sparringEntries);
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);

  const partners = useMemo(() => {
    const grouped: Map<string, SparringEntry[]> = new Map();
    for (const e of sparringEntries) {
      if (!grouped.has(e.partnerName)) grouped.set(e.partnerName, []);
      grouped.get(e.partnerName)!.push(e);
    }
    const result: PartnerSummary[] = [];
    for (const [name, entries] of grouped) {
      entries.sort((a, b) => b.date.localeCompare(a.date));
      result.push({
        name,
        sessions: entries.length,
        lastSparred: entries[0].date,
        totalRounds: entries.reduce((sum, e) => sum + e.rounds, 0),
        entries,
        dominanceBreakdown: getDominanceSummary(entries),
      });
    }
    return result.sort((a, b) => b.lastSparred.localeCompare(a.lastSparred));
  }, [sparringEntries]);

  if (partners.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.emptyContainer}>
          <PageHeader kicker="SPARRING" title="Partner History" />
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Partners Yet</Text>
            <Text style={styles.emptyDesc}>Log sparring sessions to track your partners</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="SPARRING" title="Partner History" subtitle={`${partners.length} partners`} />

        {partners.map((partner) => (
          <View key={partner.name} style={styles.partnerBlock}>
            <Pressable
              onPress={() => {
                lightTap();
                setExpandedPartner(expandedPartner === partner.name ? null : partner.name);
              }}
            >
              <Panel tone="subtle" style={styles.partnerCard}>
                <View style={styles.partnerRow}>
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <Text style={styles.partnerMeta}>
                      {partner.sessions} session{partner.sessions !== 1 ? "s" : ""} \u00B7 {partner.totalRounds} rounds \u00B7 Last: {partner.lastSparred}
                    </Text>
                  </View>
                  <View style={styles.dominanceBar}>
                    <Text style={[styles.domCount, { color: colors.win }]}>{partner.dominanceBreakdown.me}W</Text>
                    <Text style={[styles.domCount, { color: colors.draw }]}>{partner.dominanceBreakdown.even}E</Text>
                    <Text style={[styles.domCount, { color: colors.loss }]}>{partner.dominanceBreakdown.them}L</Text>
                  </View>
                  <Ionicons
                    name={expandedPartner === partner.name ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.textMuted}
                  />
                </View>
              </Panel>
            </Pressable>

            {expandedPartner === partner.name && (
              <View style={styles.sessionsList}>
                {partner.entries.map((entry) => (
                  <View key={entry.id} style={styles.sessionItem}>
                    <View style={styles.sessionHeader}>
                      <Text style={styles.sessionDate}>{entry.date}</Text>
                      <Text style={styles.sessionRounds}>{entry.rounds} rounds</Text>
                      <IntensityBadge intensity={entry.intensity} />
                    </View>
                    {entry.roundNotes.filter((r) => r.notes).length > 0 && (
                      <View style={styles.roundsList}>
                        {entry.roundNotes.filter((r) => r.notes).map((r) => (
                          <Text key={r.roundNumber} style={styles.roundNote}>
                            R{r.roundNumber}: {r.notes}
                          </Text>
                        ))}
                      </View>
                    )}
                    {entry.overallNotes.length > 0 && (
                      <Text style={styles.overallNote}>{entry.overallNotes}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
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
  partnerBlock: { marginBottom: spacing.lg },
  partnerCard: { padding: spacing.md },
  partnerRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  partnerInfo: { flex: 1, gap: 2 },
  partnerName: { ...fonts.subheading },
  partnerMeta: { fontSize: 11, color: colors.textMuted },
  dominanceBar: { flexDirection: "row", gap: spacing.sm },
  domCount: { fontSize: 12, fontWeight: "700" },
  sessionsList: { marginTop: spacing.sm, paddingLeft: spacing.lg, gap: spacing.md },
  sessionItem: {
    borderLeftWidth: 1, borderLeftColor: colors.panelBorder,
    paddingLeft: spacing.md, paddingVertical: spacing.sm, gap: spacing.xs,
  },
  sessionHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  sessionDate: { fontSize: 13, fontWeight: "600", color: colors.text },
  sessionRounds: { fontSize: 12, color: colors.textMuted },
  roundsList: { gap: 2, marginTop: spacing.xs },
  roundNote: { fontSize: 12, color: colors.textSecondary },
  overallNote: { fontSize: 12, color: colors.textMuted, fontStyle: "italic", marginTop: spacing.xs },
});
