import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader } from "../../src/components";
import { useCampStore } from "../../src/stores/useCampStore";
import { useWeightStore } from "../../src/stores/useWeightStore";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { getWeightClassLabel } from "../../src/lib/weight-class";
import { successNotification, lightTap } from "../../src/lib/haptics";
import { goToCampDashboard } from "../../src/lib/navigation";
import type { WeightClass } from "../../src/types";

const WEIGHT_CLASSES: WeightClass[] = [
  "strawweight", "flyweight", "bantamweight", "featherweight", "lightweight",
  "super_lightweight", "welterweight", "super_welterweight", "middleweight",
  "super_middleweight", "light_heavyweight", "cruiserweight", "heavyweight",
];

export default function CampSetupScreen() {
  const createCamp = useCampStore((s) => s.createCamp);
  const setActiveFightCamp = useProfileStore((s) => s.setActiveFightCamp);
  const currentWeight = useWeightStore((s) => s.currentWeight);

  const [fightDate, setFightDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [weightClass, setWeightClass] = useState<WeightClass>("welterweight");
  const [targetWeight, setTargetWeight] = useState("");
  const [startWeight, setStartWeight] = useState(currentWeight ? String(currentWeight) : "");
  const [notes, setNotes] = useState("");

  const handleStart = () => {
    if (!fightDate.trim()) return;
    const tw = parseFloat(targetWeight) || 0;
    const sw = parseFloat(startWeight) || 0;

    createCamp(
      fightDate.trim(),
      opponent.trim() || null,
      weightClass,
      tw,
      sw,
      new Date().toISOString().slice(0, 10),
      notes.trim()
    );

    // Get the camp ID (most recent)
    const camps = useCampStore.getState().camps;
    if (camps.length > 0) {
      setActiveFightCamp(camps[0].id);
    }

    successNotification();
    goToCampDashboard();
  };

  const isValid = fightDate.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="FIGHT CAMP" title="Set Up Camp" subtitle="Prepare for fight night" />

        <View style={styles.section}>
          <Text style={styles.label}>FIGHT DATE</Text>
          <TextInput
            style={styles.input}
            value={fightDate}
            onChangeText={setFightDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>OPPONENT (OPTIONAL)</Text>
          <TextInput
            style={styles.input}
            value={opponent}
            onChangeText={setOpponent}
            placeholder="Opponent name"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>WEIGHT CLASS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.pillRow}>
              {WEIGHT_CLASSES.map((wc) => (
                <Pressable key={wc} onPress={() => { lightTap(); setWeightClass(wc); }}
                  style={[styles.pill, weightClass === wc && styles.pillActive]}>
                  <Text style={[styles.pillText, weightClass === wc && styles.pillTextActive]}>
                    {getWeightClassLabel(wc).toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>TARGET WEIGHT</Text>
            <TextInput
              style={styles.input}
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="decimal-pad"
              placeholder="lb"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>CURRENT WEIGHT</Text>
            <TextInput
              style={styles.input}
              value={startWeight}
              onChangeText={setStartWeight}
              keyboardType="decimal-pad"
              placeholder="lb"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>NOTES</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Camp goals, strategy notes..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        <Pressable
          onPress={handleStart}
          style={[styles.startBtn, !isValid && styles.startBtnDisabled]}
          disabled={!isValid}
        >
          <Text style={styles.startBtnText}>START CAMP</Text>
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
  label: { ...fonts.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  row: { flexDirection: "row", gap: spacing.lg },
  input: {
    height: TOUCH_MIN, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, fontSize: 16, color: colors.text,
  },
  pillRow: { flexDirection: "row", gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center",
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 },
  pillTextActive: { color: "#000000" },
  startBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing.lg,
  },
  startBtnDisabled: { opacity: 0.3 },
  startBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
