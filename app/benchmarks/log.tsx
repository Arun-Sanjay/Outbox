import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel } from "../../src/components";
import { useBenchmarkStore } from "../../src/stores/useBenchmarkStore";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { BENCHMARK_INFO, formatBenchmarkValue } from "../../src/data/benchmarks";
import { toLocalDateKey } from "../../src/lib/date";
import { successNotification, lightTap } from "../../src/lib/haptics";
import { goBack } from "../../src/lib/navigation";
import type { BenchmarkType } from "../../src/types";

export default function LogBenchmarkScreen() {
  const logBenchmark = useBenchmarkStore((s) => s.logBenchmark);
  const getLatest = useBenchmarkStore((s) => s.getLatestBenchmark);
  const addXP = useProfileStore((s) => s.addXP);

  const [selectedType, setSelectedType] = useState<BenchmarkType | null>(null);
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");

  const selectedInfo = selectedType
    ? BENCHMARK_INFO.find((b) => b.type === selectedType)
    : null;

  const previousBest = selectedType ? getLatest(selectedType) : null;

  const handleSave = () => {
    if (!selectedType || !value) return;
    const numVal = parseFloat(value);
    if (!Number.isFinite(numVal) || numVal <= 0) return;

    logBenchmark(selectedType, numVal, toLocalDateKey(new Date()), notes.trim());
    addXP(30, "benchmark", `Benchmark: ${selectedInfo?.name ?? selectedType}`);
    successNotification();
    goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="BENCHMARK" title="Log Benchmark" subtitle="Track your progress over time" />

        {/* Type selector */}
        <View style={styles.section}>
          <Text style={styles.label}>SELECT TEST</Text>
          <View style={styles.typeGrid}>
            {BENCHMARK_INFO.map((info) => (
              <Pressable
                key={info.type}
                onPress={() => { lightTap(); setSelectedType(info.type); }}
                style={[styles.typeCard, selectedType === info.type && styles.typeCardActive]}
              >
                <Ionicons
                  name={(info.icon as keyof typeof Ionicons.glyphMap) ?? "help-circle"}
                  size={20}
                  color={selectedType === info.type ? "#000000" : colors.textSecondary}
                />
                <Text style={[styles.typeName, selectedType === info.type && styles.typeNameActive]}>
                  {info.name}
                </Text>
                <Text style={[styles.typeUnit, selectedType === info.type && styles.typeUnitActive]}>
                  {info.unit}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Selected benchmark info */}
        {selectedInfo && (
          <>
            <Panel tone="subtle" style={styles.infoPanel}>
              <Text style={styles.infoDesc}>{selectedInfo.description}</Text>
              {previousBest && (
                <View style={styles.prevBestRow}>
                  <Text style={styles.prevBestLabel}>PREVIOUS BEST</Text>
                  <Text style={styles.prevBestValue}>
                    {formatBenchmarkValue(selectedType!, previousBest.value)}
                  </Text>
                  <Text style={styles.prevBestDate}>{previousBest.date}</Text>
                </View>
              )}
            </Panel>

            {/* Value input */}
            <View style={styles.section}>
              <Text style={styles.label}>YOUR RESULT ({selectedInfo.unit.toUpperCase()})</Text>
              <TextInput
                style={styles.valueInput}
                value={value}
                onChangeText={setValue}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
            </View>

            {/* Notes */}
            <View style={styles.section}>
              <Text style={styles.label}>NOTES (OPTIONAL)</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="How did it feel? Conditions?"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            <Pressable
              onPress={handleSave}
              style={[styles.saveBtn, !value && styles.saveBtnDisabled]}
              disabled={!value}
            >
              <Text style={styles.saveBtnText}>SAVE (+30 XP)</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  section: { marginBottom: spacing["2xl"] },
  label: { ...fonts.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  typeCard: {
    width: "48%", padding: spacing.md, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, gap: spacing.xs,
    backgroundColor: colors.inputBg,
  },
  typeCardActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  typeName: { fontSize: 12, fontWeight: "700", color: colors.text },
  typeNameActive: { color: "#000000" },
  typeUnit: { fontSize: 10, color: colors.textMuted },
  typeUnitActive: { color: "rgba(0,0,0,0.6)" },
  infoPanel: { padding: spacing.lg, marginBottom: spacing["2xl"] },
  infoDesc: { ...fonts.small, color: colors.textSecondary, marginBottom: spacing.lg },
  prevBestRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  prevBestLabel: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 1 },
  prevBestValue: { fontSize: 18, fontWeight: "800", color: colors.accent },
  prevBestDate: { fontSize: 11, color: colors.textMuted },
  valueInput: {
    height: 64, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, fontSize: 32, fontWeight: "800",
    color: colors.text, textAlign: "center",
  },
  notesInput: {
    minHeight: 80, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    padding: spacing.lg, fontSize: 14, color: colors.text, textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center",
  },
  saveBtnDisabled: { opacity: 0.3 },
  saveBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
