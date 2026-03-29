import React, { useState, useMemo, useCallback } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader } from "../../src/components";
import { ComboSequence, ComboStats, PunchChip } from "../../src/components/combo";
import { useComboStore } from "../../src/stores/useComboStore";
import { computeComboStats, getComboDisplayText } from "../../src/lib/combo-utils";
import { lightTap, successNotification, mediumTap } from "../../src/lib/haptics";
import { goBack } from "../../src/lib/navigation";
import type { ComboElement, PunchCode, DefenseCode, FootworkCode } from "../../src/types";

const PUNCH_ROW_1: PunchCode[] = ["1", "2", "3", "4", "5", "6"];
const PUNCH_ROW_2: PunchCode[] = ["1b", "2b", "3b", "4b"];
const DEFENSE_ROW: DefenseCode[] = ["slip", "roll", "pull", "step_back", "block"];
const FOOTWORK_ROW: FootworkCode[] = [
  "pivot_left", "pivot_right", "angle_left", "angle_right",
  "circle_left", "circle_right", "step_in", "step_out",
];

export default function ComboBuilderScreen() {
  const addCustomCombo = useComboStore((s) => s.addCustomCombo);
  const [name, setName] = useState("");
  const [sequence, setSequence] = useState<ComboElement[]>([]);

  const stats = useMemo(() => computeComboStats(sequence), [sequence]);

  const addElement = useCallback((el: ComboElement) => {
    lightTap();
    setSequence((prev) => [...prev, el]);
  }, []);

  const removeElement = useCallback((index: number) => {
    lightTap();
    setSequence((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleTest = useCallback(() => {
    if (sequence.length === 0) return;
    mediumTap();
    const text = getComboDisplayText(sequence, "names");
    Speech.speak(text, { rate: 1.0, pitch: 1.0 });
  }, [sequence]);

  const handleSave = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("Name Required", "Please enter a combo name.");
      return;
    }
    if (sequence.length < 2) {
      Alert.alert("Too Short", "A combo needs at least 2 elements.");
      return;
    }
    addCustomCombo(trimmedName, sequence);
    successNotification();
    goBack();
  }, [name, sequence, addCustomCombo]);

  const isValid = name.trim().length > 0 && sequence.length >= 2;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="BUILD" title="Combo Builder" />

        {/* Name input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>COMBO NAME</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Liver Destroyer"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
          />
        </View>

        {/* Sequence strip */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>SEQUENCE</Text>
            {sequence.length > 0 && (
              <Pressable onPress={() => { lightTap(); setSequence([]); }}>
                <Text style={styles.clearText}>CLEAR</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.sequenceContainer}>
            {sequence.length === 0 ? (
              <Text style={styles.placeholder}>Tap punches below to build your combo</Text>
            ) : (
              <ComboSequence
                sequence={sequence}
                size="md"
                scrollable
                onChipPress={removeElement}
              />
            )}
          </View>
        </View>

        {/* Live stats */}
        {sequence.length > 0 && (
          <View style={styles.section}>
            <ComboStats {...stats} />
          </View>
        )}

        {/* Test button */}
        {sequence.length > 0 && (
          <Pressable onPress={handleTest} style={styles.testButton}>
            <Text style={styles.testText}>TEST</Text>
          </Pressable>
        )}

        {/* Punch chips grid */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PUNCHES</Text>
          <View style={styles.chipRow}>
            {PUNCH_ROW_1.map((code) => (
              <PunchChip
                key={code}
                code={code}
                size="md"
                onPress={() => addElement(code)}
              />
            ))}
          </View>
          <View style={[styles.chipRow, { marginTop: spacing.sm }]}>
            {PUNCH_ROW_2.map((code) => (
              <PunchChip
                key={code}
                code={code}
                size="md"
                onPress={() => addElement(code)}
              />
            ))}
          </View>
        </View>

        {/* Defense chips */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DEFENSE</Text>
          <View style={styles.chipRow}>
            {DEFENSE_ROW.map((code) => (
              <PunchChip
                key={code}
                code={code}
                size="md"
                displayMode="names"
                onPress={() => addElement(code)}
              />
            ))}
          </View>
        </View>

        {/* Footwork chips */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FOOTWORK</Text>
          <View style={[styles.chipRow, { flexWrap: "wrap" }]}>
            {FOOTWORK_ROW.map((code) => (
              <PunchChip
                key={code}
                code={code}
                size="sm"
                displayMode="names"
                onPress={() => addElement(code)}
              />
            ))}
          </View>
        </View>

        {/* Save button */}
        <Pressable
          onPress={handleSave}
          style={[styles.saveButton, !isValid && styles.saveDisabled]}
          disabled={!isValid}
        >
          <Text style={styles.saveText}>SAVE COMBO</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  section: { marginBottom: spacing["2xl"] },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    ...fonts.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  nameInput: {
    height: TOUCH_MIN,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  sequenceContainer: {
    minHeight: 60,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    padding: spacing.md,
    justifyContent: "center",
  },
  placeholder: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
  clearText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.danger,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  testButton: {
    alignSelf: "center",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: spacing["2xl"],
  },
  testText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 2,
  },
  saveButton: {
    backgroundColor: colors.accent,
    height: TOUCH_MIN + 8,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  saveDisabled: { opacity: 0.3 },
  saveText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2,
  },
});
