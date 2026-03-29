import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing, radius } from "../../theme";
import { Panel } from "../Panel";
import { getWeightClassLabel } from "../../lib/weight-class";
import type { Fight, WeightClass } from "../../types";

type FightRecordDisplayProps = {
  fights: Fight[];
  variant: "compact" | "full";
};

type RecordStats = {
  wins: number;
  losses: number;
  draws: number;
  nc: number;
  winPct: number;
  koWins: number;
  koRate: number;
  currentStreak: number;
  streakType: "W" | "L" | "D" | "none";
  avgFightLengthRounds: number;
  recordByClass: { weightClass: WeightClass; w: number; l: number; d: number }[];
  proRecord: { w: number; l: number; d: number };
  amRecord: { w: number; l: number; d: number };
};

function computeStats(fights: Fight[]): RecordStats {
  const sorted = [...fights].sort((a, b) => b.date.localeCompare(a.date));
  let wins = 0, losses = 0, draws = 0, nc = 0, koWins = 0;
  let totalEndedRounds = 0, fightCount = 0;
  const proW = { w: 0, l: 0, d: 0 }, amW = { w: 0, l: 0, d: 0 };
  const classMap: Map<WeightClass, { w: number; l: number; d: number }> = new Map();

  for (const f of fights) {
    if (f.result === "win") wins++;
    else if (f.result === "loss") losses++;
    else if (f.result === "draw") draws++;
    else nc++;

    if (f.result === "win" && (f.method === "ko" || f.method === "tko")) koWins++;
    if (f.endedRound) { totalEndedRounds += f.endedRound; fightCount++; }
    else { totalEndedRounds += f.scheduledRounds; fightCount++; }

    const isPro = f.fightType === "professional";
    const rec = isPro ? proW : amW;
    if (f.result === "win") rec.w++;
    else if (f.result === "loss") rec.l++;
    else if (f.result === "draw") rec.d++;

    if (!classMap.has(f.weightClass)) classMap.set(f.weightClass, { w: 0, l: 0, d: 0 });
    const cr = classMap.get(f.weightClass)!;
    if (f.result === "win") cr.w++;
    else if (f.result === "loss") cr.l++;
    else if (f.result === "draw") cr.d++;
  }

  // Current streak
  let currentStreak = 0;
  let streakType: "W" | "L" | "D" | "none" = "none";
  if (sorted.length > 0) {
    const firstResult = sorted[0].result;
    if (firstResult === "win") streakType = "W";
    else if (firstResult === "loss") streakType = "L";
    else if (firstResult === "draw") streakType = "D";
    for (const f of sorted) {
      if (f.result === firstResult && firstResult !== "no_contest") currentStreak++;
      else break;
    }
  }

  const totalFights = wins + losses + draws;
  return {
    wins, losses, draws, nc,
    winPct: totalFights > 0 ? Math.round((wins / totalFights) * 100) : 0,
    koWins,
    koRate: wins > 0 ? Math.round((koWins / wins) * 100) : 0,
    currentStreak, streakType,
    avgFightLengthRounds: fightCount > 0 ? Math.round((totalEndedRounds / fightCount) * 10) / 10 : 0,
    recordByClass: Array.from(classMap.entries()).map(([wc, r]) => ({ weightClass: wc, ...r })),
    proRecord: proW, amRecord: amW,
  };
}

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export function FightRecordDisplay({ fights, variant }: FightRecordDisplayProps) {
  const stats = useMemo(() => computeStats(fights), [fights]);

  if (variant === "compact") {
    return (
      <View style={styles.compactRow}>
        <Text style={[styles.compactNum, { color: colors.win }]}>{stats.wins}</Text>
        <Text style={styles.compactSep}>-</Text>
        <Text style={[styles.compactNum, { color: colors.loss }]}>{stats.losses}</Text>
        <Text style={styles.compactSep}>-</Text>
        <Text style={[styles.compactNum, { color: colors.draw }]}>{stats.draws}</Text>
        <Text style={styles.compactPct}>{stats.winPct}%</Text>
      </View>
    );
  }

  // Full variant
  return (
    <Panel tone="subtle" style={styles.fullPanel}>
      {/* Hero W-L-D */}
      <View style={styles.heroRow}>
        <View style={styles.heroItem}>
          <Text style={[styles.heroNum, { color: colors.win }]}>{stats.wins}</Text>
          <Text style={styles.heroLabel}>WINS</Text>
        </View>
        <Text style={styles.heroSep}>-</Text>
        <View style={styles.heroItem}>
          <Text style={[styles.heroNum, { color: colors.loss }]}>{stats.losses}</Text>
          <Text style={styles.heroLabel}>LOSSES</Text>
        </View>
        <Text style={styles.heroSep}>-</Text>
        <View style={styles.heroItem}>
          <Text style={[styles.heroNum, { color: colors.draw }]}>{stats.draws}</Text>
          <Text style={styles.heroLabel}>DRAWS</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.winPct}%</Text>
          <Text style={styles.statLabel}>WIN %</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.koRate}%</Text>
          <Text style={styles.statLabel}>KO RATE</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {stats.currentStreak > 0 ? `${stats.currentStreak}${stats.streakType}` : "--"}
          </Text>
          <Text style={styles.statLabel}>STREAK</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.avgFightLengthRounds}</Text>
          <Text style={styles.statLabel}>AVG RDS</Text>
        </View>
      </View>

      {/* Pro/Am split */}
      {(stats.proRecord.w + stats.proRecord.l + stats.proRecord.d > 0 || stats.amRecord.w + stats.amRecord.l + stats.amRecord.d > 0) && (
        <View style={styles.splitRow}>
          {stats.proRecord.w + stats.proRecord.l + stats.proRecord.d > 0 && (
            <View style={styles.splitItem}>
              <Text style={styles.splitLabel}>PRO</Text>
              <Text style={styles.splitValue}>{stats.proRecord.w}-{stats.proRecord.l}-{stats.proRecord.d}</Text>
            </View>
          )}
          {stats.amRecord.w + stats.amRecord.l + stats.amRecord.d > 0 && (
            <View style={styles.splitItem}>
              <Text style={styles.splitLabel}>AMATEUR</Text>
              <Text style={styles.splitValue}>{stats.amRecord.w}-{stats.amRecord.l}-{stats.amRecord.d}</Text>
            </View>
          )}
        </View>
      )}

      {/* Record by class */}
      {stats.recordByClass.length > 0 && (
        <View style={styles.classSection}>
          <Text style={styles.classSectionLabel}>BY WEIGHT CLASS</Text>
          {stats.recordByClass.map((c) => (
            <View key={c.weightClass} style={styles.classRow}>
              <Text style={styles.className}>{getWeightClassLabel(c.weightClass)}</Text>
              <Text style={styles.classRecord}>{c.w}-{c.l}-{c.d}</Text>
            </View>
          ))}
        </View>
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  // Compact
  compactRow: { flexDirection: "row", alignItems: "baseline", gap: spacing.xs },
  compactNum: { fontSize: 24, fontWeight: "800", fontFamily: monoFont, fontVariant: ["tabular-nums"] },
  compactSep: { fontSize: 20, fontWeight: "300", color: colors.textMuted },
  compactPct: { fontSize: 14, fontWeight: "600", color: colors.textSecondary, marginLeft: spacing.sm },
  // Full
  fullPanel: { padding: spacing.xl },
  heroRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.lg, marginBottom: spacing["2xl"] },
  heroItem: { alignItems: "center" },
  heroNum: { fontSize: 48, fontWeight: "800", fontFamily: monoFont, fontVariant: ["tabular-nums"] },
  heroLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2, marginTop: 2 },
  heroSep: { fontSize: 36, fontWeight: "200", color: colors.textMuted },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: spacing["2xl"] },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: colors.text, fontFamily: monoFont },
  statLabel: { fontSize: 9, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, marginTop: 2 },
  splitRow: { flexDirection: "row", justifyContent: "center", gap: spacing["3xl"], marginBottom: spacing["2xl"] },
  splitItem: { alignItems: "center" },
  splitLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2 },
  splitValue: { fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 2 },
  classSection: { borderTopWidth: 1, borderTopColor: colors.panelBorder, paddingTop: spacing.lg },
  classSectionLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 2, marginBottom: spacing.md },
  classRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  className: { fontSize: 13, color: colors.textSecondary },
  classRecord: { fontSize: 13, fontWeight: "700", color: colors.text, fontFamily: monoFont },
});
