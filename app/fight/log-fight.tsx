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
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader } from "../../src/components";
import { StarRating } from "../../src/components/session";
import { useFightStore } from "../../src/stores/useFightStore";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { getWeightClassLabel } from "../../src/lib/weight-class";
import { toLocalDateKey } from "../../src/lib/date";
import { nextId } from "../../src/db/storage";
import { successNotification, lightTap } from "../../src/lib/haptics";
import { goBack } from "../../src/lib/navigation";
import type { Fight, FightType, FightResult, FightMethod, WeightClass } from "../../src/types";

const FIGHT_TYPES: FightType[] = ["amateur", "professional", "exhibition", "sparring"];
const RESULTS: { value: FightResult; label: string; color: string }[] = [
  { value: "win", label: "WIN", color: colors.win },
  { value: "loss", label: "LOSS", color: colors.loss },
  { value: "draw", label: "DRAW", color: colors.draw },
  { value: "no_contest", label: "NC", color: colors.textMuted },
];
const METHODS: FightMethod[] = ["unanimous_decision", "split_decision", "majority_decision", "tko", "ko", "corner_stoppage", "dq", "points"];
const WEIGHT_CLASSES: WeightClass[] = [
  "strawweight", "flyweight", "bantamweight", "featherweight", "lightweight",
  "super_lightweight", "welterweight", "super_welterweight", "middleweight",
  "super_middleweight", "light_heavyweight", "cruiserweight", "heavyweight",
];

export default function LogFightScreen() {
  const addFight = useFightStore((s) => s.addFight);
  const addXP = useProfileStore((s) => s.addXP);

  const [fightType, setFightType] = useState<FightType>("amateur");
  const [date, setDate] = useState(toLocalDateKey(new Date()));
  const [location, setLocation] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [opponentRecord, setOpponentRecord] = useState("");
  const [weightClass, setWeightClass] = useState<WeightClass>("welterweight");
  const [weighIn, setWeighIn] = useState("");
  const [scheduledRounds, setScheduledRounds] = useState("3");
  const [result, setResult] = useState<FightResult>("win");
  const [method, setMethod] = useState<FightMethod | null>(null);
  const [endedRound, setEndedRound] = useState("");
  const [endedTime, setEndedTime] = useState("");
  const [cornerCoach, setCornerCoach] = useState("");
  const [whatWorked, setWhatWorked] = useState("");
  const [whatToImprove, setWhatToImprove] = useState("");
  const [notes, setNotes] = useState("");
  const [physicalRating, setPhysicalRating] = useState(0);
  const [mentalRating, setMentalRating] = useState(0);

  const isStoppage = method === "tko" || method === "ko";
  const showMethod = result === "win" || result === "loss";

  const handleSave = useCallback(() => {
    if (!opponentName.trim()) return;
    const xp = result === "win" ? 125 : 75;
    const fight: Fight = {
      id: nextId(),
      fightType,
      date,
      location: location.trim(),
      opponentName: opponentName.trim(),
      opponentRecord: opponentRecord.trim() || null,
      weightClass,
      weighInWeight: weighIn ? parseFloat(weighIn) : null,
      scheduledRounds: parseInt(scheduledRounds) || 3,
      result,
      method: showMethod ? method : null,
      endedRound: isStoppage && endedRound ? parseInt(endedRound) : null,
      endedTime: isStoppage && endedTime.trim() ? endedTime.trim() : null,
      cornerCoach: cornerCoach.trim() || null,
      notesWorked: whatWorked.trim(),
      notesImprove: whatToImprove.trim(),
      generalNotes: notes.trim(),
      physicalRating,
      mentalRating,
      xpEarned: xp,
      createdAt: Date.now(),
    };
    addFight(fight);
    addXP(xp, "fight", `Fight vs ${opponentName.trim()}`);
    successNotification();
    goBack();
  }, [fightType, date, location, opponentName, opponentRecord, weightClass, weighIn, scheduledRounds, result, method, endedRound, endedTime, cornerCoach, whatWorked, whatToImprove, notes, physicalRating, mentalRating, showMethod, isStoppage, addFight, addXP]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="FIGHT" title="Log Fight" />

        {/* Fight Type */}
        <View style={styles.section}>
          <Text style={styles.label}>FIGHT TYPE</Text>
          <View style={styles.pillRow}>
            {FIGHT_TYPES.map((t) => (
              <Pressable key={t} onPress={() => { lightTap(); setFightType(t); }}
                style={[styles.pill, fightType === t && styles.pillActive]}>
                <Text style={[styles.pillText, fightType === t && styles.pillTextActive]}>
                  {t.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Date + Location */}
        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>DATE</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textMuted} />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>LOCATION</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Venue" placeholderTextColor={colors.textMuted} />
          </View>
        </View>

        {/* Opponent */}
        <View style={styles.row}>
          <View style={[styles.section, { flex: 2 }]}>
            <Text style={styles.label}>OPPONENT NAME</Text>
            <TextInput style={styles.input} value={opponentName} onChangeText={setOpponentName} placeholder="Name" placeholderTextColor={colors.textMuted} />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>RECORD</Text>
            <TextInput style={styles.input} value={opponentRecord} onChangeText={setOpponentRecord} placeholder="W-L-D" placeholderTextColor={colors.textMuted} />
          </View>
        </View>

        {/* Weight class */}
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

        {/* Weigh-in + Rounds */}
        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>WEIGH-IN (LB)</Text>
            <TextInput style={styles.input} value={weighIn} onChangeText={setWeighIn} keyboardType="decimal-pad" placeholder="--" placeholderTextColor={colors.textMuted} />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>SCHEDULED ROUNDS</Text>
            <TextInput style={styles.input} value={scheduledRounds} onChangeText={setScheduledRounds} keyboardType="number-pad" placeholder="3" placeholderTextColor={colors.textMuted} />
          </View>
        </View>

        {/* Result */}
        <View style={styles.section}>
          <Text style={styles.label}>RESULT</Text>
          <View style={styles.pillRow}>
            {RESULTS.map((r) => (
              <Pressable key={r.value} onPress={() => { lightTap(); setResult(r.value); }}
                style={[styles.pill, result === r.value && { backgroundColor: r.color, borderColor: r.color }]}>
                <Text style={[styles.pillText, result === r.value && styles.pillTextActive]}>
                  {r.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Method */}
        {showMethod && (
          <View style={styles.section}>
            <Text style={styles.label}>METHOD</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillRow}>
                {METHODS.map((m) => (
                  <Pressable key={m} onPress={() => { lightTap(); setMethod(m); }}
                    style={[styles.pill, method === m && styles.pillActive]}>
                    <Text style={[styles.pillText, method === m && styles.pillTextActive]}>
                      {m.replace(/_/g, " ").toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Ended round/time (if stoppage) */}
        {isStoppage && (
          <View style={styles.row}>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.label}>ENDED ROUND</Text>
              <TextInput style={styles.input} value={endedRound} onChangeText={setEndedRound} keyboardType="number-pad" placeholder="#" placeholderTextColor={colors.textMuted} />
            </View>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.label}>ENDED TIME</Text>
              <TextInput style={styles.input} value={endedTime} onChangeText={setEndedTime} placeholder="1:23" placeholderTextColor={colors.textMuted} />
            </View>
          </View>
        )}

        {/* Corner coach */}
        <View style={styles.section}>
          <Text style={styles.label}>CORNER COACH</Text>
          <TextInput style={styles.input} value={cornerCoach} onChangeText={setCornerCoach} placeholder="Coach name" placeholderTextColor={colors.textMuted} />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.label}>WHAT WORKED</Text>
          <TextInput style={styles.multiline} value={whatWorked} onChangeText={setWhatWorked} placeholder="Strengths and successes" placeholderTextColor={colors.textMuted} multiline />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>WHAT TO IMPROVE</Text>
          <TextInput style={styles.multiline} value={whatToImprove} onChangeText={setWhatToImprove} placeholder="Areas for growth" placeholderTextColor={colors.textMuted} multiline />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>GENERAL NOTES</Text>
          <TextInput style={styles.multiline} value={notes} onChangeText={setNotes} placeholder="Additional notes" placeholderTextColor={colors.textMuted} multiline />
        </View>

        {/* Ratings */}
        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>PHYSICAL</Text>
            <StarRating value={physicalRating} onChange={setPhysicalRating} size={28} />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>MENTAL</Text>
            <StarRating value={mentalRating} onChange={setMentalRating} size={28} />
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          style={[styles.saveBtn, !opponentName.trim() && styles.saveBtnDisabled]}
          disabled={!opponentName.trim()}
        >
          <Text style={styles.saveBtnText}>SAVE FIGHT</Text>
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
  multiline: {
    minHeight: 80, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    padding: spacing.lg, fontSize: 16, color: colors.text, textAlignVertical: "top",
  },
  pillRow: { flexDirection: "row", gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center",
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { fontSize: 11, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 },
  pillTextActive: { color: "#000000" },
  saveBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing.lg,
  },
  saveBtnDisabled: { opacity: 0.3 },
  saveBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
