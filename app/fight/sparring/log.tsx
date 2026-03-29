import React, { useState, useCallback } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../../src/theme";
import { PageHeader, Panel } from "../../../src/components";
import { useFightStore } from "../../../src/stores/useFightStore";
import { useSessionStore } from "../../../src/stores/useSessionStore";
import { useProfileStore } from "../../../src/stores/useProfileStore";
import { toLocalDateKey } from "../../../src/lib/date";
import { nextId } from "../../../src/db/storage";
import { successNotification, lightTap } from "../../../src/lib/haptics";
import { goBack } from "../../../src/lib/navigation";
import type { Intensity, SparringEntry, SparringRoundNote, TrainingSession } from "../../../src/types";

const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced", "pro"] as const;
const INTENSITIES: Intensity[] = ["light", "moderate", "hard", "war"];
const DOMINANCE_OPTIONS = [
  { value: "me" as const, label: "I WON", color: colors.win },
  { value: "even" as const, label: "EVEN", color: colors.draw },
  { value: "them" as const, label: "THEY WON", color: colors.loss },
];

export default function LogSparringScreen() {
  const addSparringEntry = useFightStore((s) => s.addSparringEntry);
  const addOrUpdatePartner = useFightStore((s) => s.addOrUpdateSparringPartner);
  const addTrainingSession = useSessionStore((s) => s.addTrainingSession);
  const addXP = useProfileStore((s) => s.addXP);

  const [partnerName, setPartnerName] = useState("");
  const [partnerExp, setPartnerExp] = useState<typeof EXPERIENCE_LEVELS[number]>("intermediate");
  const [roundCount, setRoundCount] = useState(3);
  const [roundNotes, setRoundNotes] = useState<SparringRoundNote[]>(
    Array.from({ length: 3 }, (_, i) => ({ roundNumber: i + 1, notes: "", dominance: "even" as const }))
  );
  const [overallNotes, setOverallNotes] = useState("");
  const [whatWorked, setWhatWorked] = useState("");
  const [whatToImprove, setWhatToImprove] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("moderate");
  const [expandedRound, setExpandedRound] = useState<number | null>(1);

  const updateRoundCount = useCallback((count: number) => {
    const clamped = Math.max(1, Math.min(12, count));
    setRoundCount(clamped);
    setRoundNotes((prev) => {
      if (clamped > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: clamped - prev.length }, (_, i) => ({
            roundNumber: prev.length + i + 1,
            notes: "",
            dominance: "even" as const,
          })),
        ];
      }
      return prev.slice(0, clamped);
    });
  }, []);

  const updateRoundNote = (roundNum: number, field: "notes" | "dominance", value: string) => {
    setRoundNotes((prev) =>
      prev.map((r) => (r.roundNumber === roundNum ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = useCallback(() => {
    if (!partnerName.trim()) return;

    const date = toLocalDateKey(new Date());
    const entry: SparringEntry = {
      id: nextId(),
      sessionId: 0, // linked below
      partnerName: partnerName.trim(),
      partnerExperience: partnerExp,
      rounds: roundCount,
      roundNotes,
      overallNotes: overallNotes.trim(),
      whatWorked: whatWorked.trim(),
      whatToImprove: whatToImprove.trim(),
      intensity,
      date,
      createdAt: Date.now(),
    };

    addSparringEntry(entry);

    // Update partner record
    addOrUpdatePartner({
      name: partnerName.trim(),
      totalSessions: 1, // will be incremented by store
      lastSparred: date,
      averageIntensity: intensity,
      notes: "",
    });

    // Auto-create training session
    const session: TrainingSession = {
      id: nextId(),
      sessionType: "sparring",
      date,
      startedAt: Date.now() - roundCount * 3 * 60 * 1000,
      durationSeconds: roundCount * 3 * 60,
      rounds: roundCount,
      intensity,
      energyRating: 0,
      sharpnessRating: 0,
      notes: overallNotes.trim(),
      comboSessionId: null,
      timerPresetId: null,
      comboModeUsed: false,
      partnerName: partnerName.trim(),
      coachName: null,
      distanceMeters: null,
      routeDescription: null,
      conditioningType: null,
      xpEarned: 50,
      createdAt: Date.now(),
    };
    addTrainingSession(session);
    addXP(50, "sparring", `Sparring with ${partnerName.trim()}`);
    successNotification();
    goBack();
  }, [partnerName, partnerExp, roundCount, roundNotes, overallNotes, whatWorked, whatToImprove, intensity, addSparringEntry, addOrUpdatePartner, addTrainingSession, addXP]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="THE TAPE" title="Log Sparring" />

        {/* Partner */}
        <View style={styles.section}>
          <Text style={styles.label}>PARTNER NAME</Text>
          <TextInput
            style={styles.input}
            value={partnerName}
            onChangeText={setPartnerName}
            placeholder="Sparring partner"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.label}>PARTNER EXPERIENCE</Text>
          <View style={styles.pillRow}>
            {EXPERIENCE_LEVELS.map((exp) => (
              <Pressable key={exp} onPress={() => { lightTap(); setPartnerExp(exp); }}
                style={[styles.pill, partnerExp === exp && styles.pillActive]}>
                <Text style={[styles.pillText, partnerExp === exp && styles.pillTextActive]}>
                  {exp.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Rounds */}
        <View style={styles.section}>
          <Text style={styles.label}>ROUNDS</Text>
          <View style={styles.stepperRow}>
            <Pressable onPress={() => { lightTap(); updateRoundCount(roundCount - 1); }} style={styles.stepperBtn}>
              <Text style={styles.stepperText}>−</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{roundCount}</Text>
            <Pressable onPress={() => { lightTap(); updateRoundCount(roundCount + 1); }} style={styles.stepperBtn}>
              <Text style={styles.stepperText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Round-by-round notes (accordion) */}
        <View style={styles.section}>
          <Text style={styles.label}>ROUND-BY-ROUND</Text>
          {roundNotes.map((round) => (
            <Panel key={round.roundNumber} tone="subtle" style={styles.roundPanel}>
              <Pressable
                onPress={() => setExpandedRound(expandedRound === round.roundNumber ? null : round.roundNumber)}
                style={styles.roundHeader}
              >
                <Text style={styles.roundTitle}>ROUND {round.roundNumber}</Text>
                <Ionicons
                  name={expandedRound === round.roundNumber ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>

              {expandedRound === round.roundNumber && (
                <View style={styles.roundContent}>
                  <TextInput
                    style={styles.roundInput}
                    value={round.notes}
                    onChangeText={(v) => updateRoundNote(round.roundNumber, "notes", v)}
                    placeholder="Round notes..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                  />
                  <View style={styles.dominanceRow}>
                    {DOMINANCE_OPTIONS.map((opt) => (
                      <Pressable
                        key={opt.value}
                        onPress={() => { lightTap(); updateRoundNote(round.roundNumber, "dominance", opt.value); }}
                        style={[styles.domPill, round.dominance === opt.value && { backgroundColor: opt.color, borderColor: opt.color }]}
                      >
                        <Text style={[styles.domText, round.dominance === opt.value && styles.pillTextActive]}>
                          {opt.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </Panel>
          ))}
        </View>

        {/* Overall notes */}
        <View style={styles.section}>
          <Text style={styles.label}>OVERALL NOTES</Text>
          <TextInput style={styles.multiline} value={overallNotes} onChangeText={setOverallNotes} placeholder="How did it go overall?" placeholderTextColor={colors.textMuted} multiline />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>WHAT WORKED</Text>
          <TextInput style={styles.multiline} value={whatWorked} onChangeText={setWhatWorked} placeholder="Strengths" placeholderTextColor={colors.textMuted} multiline />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>WHAT TO IMPROVE</Text>
          <TextInput style={styles.multiline} value={whatToImprove} onChangeText={setWhatToImprove} placeholder="Areas for growth" placeholderTextColor={colors.textMuted} multiline />
        </View>

        {/* Intensity */}
        <View style={styles.section}>
          <Text style={styles.label}>INTENSITY</Text>
          <View style={styles.pillRow}>
            {INTENSITIES.map((i) => (
              <Pressable key={i} onPress={() => { lightTap(); setIntensity(i); }}
                style={[styles.pill, intensity === i && styles.pillActive]}>
                <Text style={[styles.pillText, intensity === i && styles.pillTextActive]}>
                  {i.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          style={[styles.saveBtn, !partnerName.trim() && styles.saveBtnDisabled]}
          disabled={!partnerName.trim()}
        >
          <Text style={styles.saveBtnText}>SAVE SPARRING</Text>
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
  input: {
    height: TOUCH_MIN, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, fontSize: 16, color: colors.text,
  },
  multiline: {
    minHeight: 80, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    padding: spacing.lg, fontSize: 16, color: colors.text, textAlignVertical: "top",
  },
  pillRow: { flexDirection: "row", gap: spacing.sm },
  pill: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center",
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 },
  pillTextActive: { color: "#000000" },
  stepperRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing["2xl"] },
  stepperBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1,
    borderColor: colors.panelBorder, backgroundColor: colors.inputBg,
    alignItems: "center", justifyContent: "center",
  },
  stepperText: { fontSize: 22, fontWeight: "600", color: colors.text },
  stepperValue: { fontSize: 28, fontWeight: "800", color: colors.text, minWidth: 50, textAlign: "center" },
  roundPanel: { padding: spacing.md, marginBottom: spacing.sm },
  roundHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  roundTitle: { fontSize: 12, fontWeight: "700", color: colors.accent, letterSpacing: 2 },
  roundContent: { marginTop: spacing.md, gap: spacing.md },
  roundInput: {
    minHeight: 60, backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.sm,
    padding: spacing.md, fontSize: 14, color: colors.text, textAlignVertical: "top",
  },
  dominanceRow: { flexDirection: "row", gap: spacing.sm },
  domPill: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center",
  },
  domText: { fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 },
  saveBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing.lg,
  },
  saveBtnDisabled: { opacity: 0.3 },
  saveBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
