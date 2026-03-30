import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { useBenchmarkStore } from "../../src/stores/useBenchmarkStore";
import { BENCHMARK_INFO, formatBenchmarkValue } from "../../src/data/benchmarks";
import { lightTap } from "../../src/lib/haptics";
import { goToLogBenchmark, goToBenchmarkDetail } from "../../src/lib/navigation";
import type { BenchmarkType } from "../../src/types";

const monoFont = Platform.select({ ios: "Menlo", default: "monospace" });

export default function BenchmarksScreen() {
  const currentBenchmarks = useBenchmarkStore((s) => s.currentBenchmarks);
  const entries = useBenchmarkStore((s) => s.entries);

  // Conditioning score: % of benchmarks tested
  const testedCount = Object.values(currentBenchmarks).filter((v) => v !== null).length;
  const conditioningScore = Math.round((testedCount / 8) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="TEST" title="Benchmarks" subtitle="Track your conditioning progress" />

        {/* Conditioning score */}
        <Panel style={styles.scorePanel}>
          <Text style={styles.scoreLabel}>CONDITIONING SCORE</Text>
          <Text style={styles.scoreValue}>{conditioningScore}%</Text>
          <Text style={styles.scoreDesc}>{testedCount} of 8 benchmarks tested</Text>
        </Panel>

        {/* Benchmark grid */}
        <SectionHeader title="YOUR BENCHMARKS" right={`${entries.length} total entries`} />
        <View style={styles.grid}>
          {BENCHMARK_INFO.map((info) => {
            const latest = currentBenchmarks[info.type];
            return (
              <Pressable
                key={info.type}
                onPress={() => {
                  lightTap();
                  if (latest) goToBenchmarkDetail(latest.id);
                  else goToLogBenchmark();
                }}
                style={styles.benchCard}
              >
                <Ionicons
                  name={(info.icon as keyof typeof Ionicons.glyphMap) ?? "help-circle"}
                  size={18}
                  color={latest ? colors.accent : colors.textMuted}
                />
                <Text style={styles.benchName}>{info.name}</Text>
                {latest ? (
                  <>
                    <Text style={styles.benchValue}>
                      {formatBenchmarkValue(info.type, latest.value)}
                    </Text>
                    <Text style={styles.benchDate}>{latest.date}</Text>
                  </>
                ) : (
                  <Text style={styles.benchEmpty}>Not tested</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={() => { lightTap(); goToLogBenchmark(); }} style={styles.logBtn}>
          <Text style={styles.logBtnText}>LOG BENCHMARK</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  scorePanel: { padding: spacing.xl, alignItems: "center", marginBottom: spacing["2xl"] },
  scoreLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 3 },
  scoreValue: {
    fontSize: 48, fontWeight: "800", color: colors.accent,
    fontFamily: monoFont, fontVariant: ["tabular-nums"],
  },
  scoreDesc: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginBottom: spacing["2xl"] },
  benchCard: {
    width: "47%", padding: spacing.lg, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, backgroundColor: colors.inputBg,
    gap: spacing.xs,
  },
  benchName: { fontSize: 12, fontWeight: "700", color: colors.text, marginTop: spacing.xs },
  benchValue: {
    fontSize: 20, fontWeight: "800", color: colors.accent,
    fontFamily: monoFont, fontVariant: ["tabular-nums"],
  },
  benchDate: { fontSize: 10, color: colors.textMuted },
  benchEmpty: { fontSize: 12, color: colors.textMuted, fontStyle: "italic" },
  logBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center",
  },
  logBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
