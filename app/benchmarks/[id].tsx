import React, { useMemo } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { useBenchmarkStore } from "../../src/stores/useBenchmarkStore";
import { getBenchmarkInfo, formatBenchmarkValue } from "../../src/data/benchmarks";
import { lightTap } from "../../src/lib/haptics";
import { goToLogBenchmark } from "../../src/lib/navigation";
import type { BenchmarkType } from "../../src/types";

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export default function BenchmarkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entries = useBenchmarkStore((s) => s.entries);
  const calculateProgress = useBenchmarkStore((s) => s.calculateProgress);

  // Find the entry to get its type
  const entry = entries.find((e) => String(e.id) === id);
  const benchType = entry?.type;
  const info = benchType ? getBenchmarkInfo(benchType) : null;

  // All entries for this type
  const typeEntries = useMemo(
    () => benchType
      ? entries.filter((e) => e.type === benchType).sort((a, b) => a.date.localeCompare(b.date))
      : [],
    [entries, benchType]
  );

  const bestEntry = useMemo(() => {
    if (typeEntries.length === 0) return null;
    return info?.higherIsBetter
      ? typeEntries.reduce((best, e) => (e.value > best.value ? e : best))
      : typeEntries.reduce((best, e) => (e.value < best.value ? e : best));
  }, [typeEntries, info]);

  const progress = benchType ? calculateProgress(benchType) : null;

  // Simple chart path
  const chartW = 300;
  const chartH = 120;
  const padX = 10;
  const padY = 10;

  const chartPath = useMemo(() => {
    if (typeEntries.length < 2) return "";
    const vals = typeEntries.map((e) => e.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const w = chartW - padX * 2;
    const h = chartH - padY * 2;
    const step = w / (typeEntries.length - 1);

    return typeEntries
      .map((e, i) => {
        const x = padX + i * step;
        const y = padY + h - ((e.value - min) / range) * h;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [typeEntries]);

  if (!entry || !info) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Benchmark not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker={info.unit.toUpperCase()} title={info.name} subtitle={info.description} />

        {/* Best value hero */}
        {bestEntry && (
          <Panel style={styles.bestPanel}>
            <Text style={styles.bestLabel}>PERSONAL BEST</Text>
            <Text style={styles.bestValue}>
              {formatBenchmarkValue(benchType!, bestEntry.value)}
            </Text>
            <Text style={styles.bestDate}>{bestEntry.date}</Text>
          </Panel>
        )}

        {/* Progress chart */}
        {typeEntries.length >= 2 && (
          <View style={styles.section}>
            <SectionHeader title="PROGRESS" right={progress !== null ? `${progress > 0 ? "+" : ""}${progress}%` : "--"} />
            <Panel tone="subtle" style={styles.chartPanel}>
              <Svg width={chartW} height={chartH}>
                <Defs>
                  <LinearGradient id="bench-grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.3" />
                    <Stop offset="100%" stopColor={colors.accent} stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Path
                  d={chartPath}
                  fill="none"
                  stroke="url(#bench-grad)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Panel>
          </View>
        )}

        {/* Improvement stats */}
        {typeEntries.length >= 2 && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{typeEntries.length}</Text>
              <Text style={styles.statLabel}>TESTS</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, progress !== null && progress > 0 && styles.statGreen, progress !== null && progress < 0 && !info.higherIsBetter && styles.statGreen]}>
                {progress !== null ? `${progress > 0 ? "+" : ""}${progress}%` : "--"}
              </Text>
              <Text style={styles.statLabel}>CHANGE</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatBenchmarkValue(benchType!, typeEntries[typeEntries.length - 1].value)}
              </Text>
              <Text style={styles.statLabel}>LATEST</Text>
            </View>
          </View>
        )}

        {/* History list */}
        <SectionHeader title="HISTORY" right={`${typeEntries.length} entries`} />
        {[...typeEntries].reverse().map((e) => (
          <View key={e.id} style={[styles.historyRow, e.id === bestEntry?.id && styles.historyRowBest]}>
            <Text style={styles.historyDate}>{e.date}</Text>
            <Text style={[styles.historyValue, e.id === bestEntry?.id && styles.historyValueBest]}>
              {formatBenchmarkValue(benchType!, e.value)}
            </Text>
            {e.notes ? <Text style={styles.historyNotes} numberOfLines={1}>{e.notes}</Text> : null}
          </View>
        ))}

        <Pressable onPress={() => { lightTap(); goToLogBenchmark(); }} style={styles.logBtn}>
          <Text style={styles.logBtnText}>LOG NEW TEST</Text>
        </Pressable>
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
  bestPanel: { padding: spacing.xl, alignItems: "center", marginBottom: spacing["2xl"] },
  bestLabel: { fontSize: 10, fontWeight: "700", color: colors.accent, letterSpacing: 3 },
  bestValue: {
    fontSize: 40, fontWeight: "800", color: colors.accent,
    fontFamily: monoFont, fontVariant: ["tabular-nums"], marginTop: spacing.sm,
  },
  bestDate: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  section: { marginBottom: spacing["2xl"] },
  chartPanel: { padding: spacing.md },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: spacing["2xl"] },
  statItem: { alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontWeight: "800", color: colors.text, fontFamily: monoFont },
  statGreen: { color: colors.win },
  statLabel: { fontSize: 9, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5 },
  historyRow: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.panelBorder,
  },
  historyRowBest: { backgroundColor: "rgba(251,191,36,0.05)" },
  historyDate: { fontSize: 13, color: colors.textSecondary, width: 90 },
  historyValue: { fontSize: 16, fontWeight: "700", color: colors.text, fontFamily: monoFont, fontVariant: ["tabular-nums"] },
  historyValueBest: { color: colors.accent },
  historyNotes: { fontSize: 12, color: colors.textMuted, flex: 1 },
  logBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing["2xl"],
  },
  logBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
