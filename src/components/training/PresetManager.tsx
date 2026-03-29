import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../theme";
import { Panel } from "../Panel";
import { useTimerStore } from "../../stores/useTimerStore";
import { lightTap, mediumTap, successNotification } from "../../lib/haptics";
import type { TimerPreset } from "../../types";

type PresetManagerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (preset: TimerPreset) => void;
};

export function PresetManager({ visible, onClose, onSelect }: PresetManagerProps) {
  const presets = useTimerStore((s) => s.presets);
  const createPreset = useTimerStore((s) => s.createCustomPreset);
  const updatePreset = useTimerStore((s) => s.updatePreset);
  const deletePreset = useTimerStore((s) => s.deletePreset);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [roundSeconds, setRoundSeconds] = useState(180);
  const [restSeconds, setRestSeconds] = useState(60);
  const [numRounds, setNumRounds] = useState(6);
  const [warmupSeconds, setWarmupSeconds] = useState(0);
  const [tenSecondWarning, setTenSecondWarning] = useState(true);
  const [bellSound, setBellSound] = useState<TimerPreset["bellSound"]>("classic");
  const [warningSound, setWarningSound] = useState<TimerPreset["warningSound"]>("clap");

  const resetForm = () => {
    setName("");
    setRoundSeconds(180);
    setRestSeconds(60);
    setNumRounds(6);
    setWarmupSeconds(0);
    setTenSecondWarning(true);
    setBellSound("classic");
    setWarningSound("clap");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (preset: TimerPreset) => {
    setName(preset.name);
    setRoundSeconds(preset.roundSeconds);
    setRestSeconds(preset.restSeconds);
    setNumRounds(preset.numRounds);
    setWarmupSeconds(preset.warmupSeconds);
    setTenSecondWarning(preset.tenSecondWarning);
    setBellSound(preset.bellSound);
    setWarningSound(preset.warningSound);
    setEditingId(preset.id);
    setShowForm(true);
  };

  const handleDelete = (preset: TimerPreset) => {
    if (!preset.isCustom) return;
    Alert.alert("Delete Preset", `Delete "${preset.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => { deletePreset(preset.id); mediumTap(); },
      },
    ]);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("Name Required", "Enter a preset name.");
      return;
    }
    if (editingId !== null) {
      updatePreset(editingId, {
        name: trimmedName,
        roundSeconds,
        restSeconds,
        numRounds,
        warmupSeconds,
        tenSecondWarning,
        bellSound,
        warningSound,
      });
    } else {
      createPreset(trimmedName, roundSeconds, restSeconds, numRounds, warmupSeconds, tenSecondWarning, bellSound, warningSound);
    }
    successNotification();
    resetForm();
  };

  const handleLongPress = (preset: TimerPreset) => {
    if (!preset.isCustom) return;
    lightTap();
    Alert.alert(preset.name, "What would you like to do?", [
      { text: "Edit", onPress: () => handleEdit(preset) },
      { text: "Delete", style: "destructive", onPress: () => handleDelete(preset) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const formatSeconds = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ── Stepper inline ─────────────────────────────────────────────────────────
  const Stepper = ({
    value, min, max, step, label, format,
    onChange,
  }: {
    value: number; min: number; max: number; step: number; label: string;
    format: (v: number) => string; onChange: (v: number) => void;
  }) => (
    <View style={formStyles.stepperRow}>
      <Text style={formStyles.stepperLabel}>{label}</Text>
      <View style={formStyles.stepperControls}>
        <Pressable
          onPress={() => { lightTap(); onChange(Math.max(min, value - step)); }}
          style={formStyles.stepperBtn}
        >
          <Text style={formStyles.stepperBtnText}>−</Text>
        </Pressable>
        <Text style={formStyles.stepperValue}>{format(value)}</Text>
        <Pressable
          onPress={() => { lightTap(); onChange(Math.min(max, value + step)); }}
          style={formStyles.stepperBtn}
        >
          <Text style={formStyles.stepperBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{showForm ? (editingId ? "EDIT PRESET" : "NEW PRESET") : "PRESETS"}</Text>
          <Pressable onPress={showForm ? resetForm : onClose} hitSlop={20}>
            <Text style={styles.closeText}>{showForm ? "BACK" : "CLOSE"}</Text>
          </Pressable>
        </View>

        {showForm ? (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.formContent}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Preset Name"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />
            <Stepper
              label="Round Length" value={roundSeconds} min={30} max={300} step={15}
              format={formatSeconds} onChange={setRoundSeconds}
            />
            <Stepper
              label="Rest Length" value={restSeconds} min={15} max={120} step={15}
              format={(v) => `${v}s`} onChange={setRestSeconds}
            />
            <Stepper
              label="Rounds" value={numRounds} min={1} max={20} step={1}
              format={(v) => `${v}`} onChange={setNumRounds}
            />
            <View style={formStyles.toggleRow}>
              <Text style={formStyles.stepperLabel}>Warmup</Text>
              <Switch
                value={warmupSeconds > 0}
                onValueChange={(v) => setWarmupSeconds(v ? 60 : 0)}
                trackColor={{ false: colors.inputBg, true: colors.accent }}
              />
            </View>
            {warmupSeconds > 0 && (
              <Stepper
                label="Warmup Length" value={warmupSeconds} min={15} max={180} step={15}
                format={(v) => `${v}s`} onChange={setWarmupSeconds}
              />
            )}
            <View style={formStyles.toggleRow}>
              <Text style={formStyles.stepperLabel}>10s Warning</Text>
              <Switch
                value={tenSecondWarning}
                onValueChange={setTenSecondWarning}
                trackColor={{ false: colors.inputBg, true: colors.accent }}
              />
            </View>

            <Text style={formStyles.sectionLabel}>BELL SOUND</Text>
            <View style={formStyles.pillRow}>
              {(["classic", "buzzer", "horn"] as const).map((s) => (
                <Pressable
                  key={s}
                  onPress={() => { lightTap(); setBellSound(s); }}
                  style={[formStyles.pill, bellSound === s && formStyles.pillActive]}
                >
                  <Text style={[formStyles.pillText, bellSound === s && formStyles.pillTextActive]}>
                    {s.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={formStyles.sectionLabel}>WARNING SOUND</Text>
            <View style={formStyles.pillRow}>
              {(["clap", "beep", "stick"] as const).map((s) => (
                <Pressable
                  key={s}
                  onPress={() => { lightTap(); setWarningSound(s); }}
                  style={[formStyles.pill, warningSound === s && formStyles.pillActive]}
                >
                  <Text style={[formStyles.pillText, warningSound === s && formStyles.pillTextActive]}>
                    {s.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>{editingId ? "UPDATE" : "SAVE PRESET"}</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.listContent}>
            {presets.map((preset) => (
              <Pressable
                key={preset.id}
                onPress={() => onSelect(preset)}
                onLongPress={() => handleLongPress(preset)}
              >
                <Panel tone="subtle" style={styles.presetCard}>
                  <View style={styles.presetRow}>
                    <View style={styles.presetInfo}>
                      <Text style={styles.presetName}>{preset.name}</Text>
                      <Text style={styles.presetDetail}>
                        {preset.numRounds}R × {formatSeconds(preset.roundSeconds)} / {preset.restSeconds}s rest
                      </Text>
                    </View>
                    {preset.isCustom && (
                      <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
                    )}
                  </View>
                </Panel>
              </Pressable>
            ))}
            <Pressable
              onPress={() => { lightTap(); setShowForm(true); }}
              style={styles.createBtn}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
              <Text style={styles.createText}>CREATE CUSTOM PRESET</Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing["2xl"],
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 3,
  },
  closeText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  scroll: { flex: 1 },
  listContent: { paddingHorizontal: spacing.xl, gap: spacing.md, paddingBottom: 40 },
  formContent: { paddingHorizontal: spacing.xl, gap: spacing.xl, paddingBottom: 60 },
  presetCard: { padding: spacing.lg },
  presetRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  presetInfo: { flex: 1 },
  presetName: { ...fonts.subheading, marginBottom: spacing.xs },
  presetDetail: { ...fonts.small, color: colors.textMuted },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    borderStyle: "dashed",
    marginTop: spacing.md,
  },
  createText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 1,
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
  saveBtn: {
    backgroundColor: colors.accent,
    height: TOUCH_MIN + 8,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2,
  },
});

const formStyles = StyleSheet.create({
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepperLabel: { ...fonts.body, flex: 1 },
  stepperControls: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnText: { fontSize: 20, fontWeight: "600", color: colors.text },
  stepperValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    minWidth: 60,
    textAlign: "center",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabel: {
    ...fonts.caption,
    color: colors.textSecondary,
    marginBottom: -spacing.sm,
  },
  pillRow: { flexDirection: "row", gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.inputBg,
  },
  pillActive: { borderColor: colors.accent, backgroundColor: "rgba(251,191,36,0.15)" },
  pillText: { fontSize: 12, fontWeight: "700", color: colors.textSecondary, letterSpacing: 0.5 },
  pillTextActive: { color: colors.accent },
});
