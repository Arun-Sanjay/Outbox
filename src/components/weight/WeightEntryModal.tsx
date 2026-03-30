import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../theme";
import { useWeightStore } from "../../stores/useWeightStore";
import { toLocalDateKey } from "../../lib/date";
import { successNotification, lightTap } from "../../lib/haptics";

type WeightEntryModalProps = {
  visible: boolean;
  onClose: () => void;
  fightCampId?: number | null;
};

export function WeightEntryModal({
  visible,
  onClose,
  fightCampId = null,
}: WeightEntryModalProps) {
  const addEntry = useWeightStore((s) => s.addWeightEntry);
  const unit = useWeightStore((s) => s.unit);
  const setUnit = useWeightStore((s) => s.setPreferredUnit);

  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    const val = parseFloat(weight);
    if (!val || val <= 0) return;
    addEntry(val, unit, toLocalDateKey(new Date()), fightCampId, notes.trim());
    successNotification();
    setWeight("");
    setNotes("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>LOG WEIGHT</Text>

          <View style={styles.field}>
            <Text style={styles.label}>WEIGHT</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.weightInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
              <View style={styles.unitToggle}>
                <Pressable
                  onPress={() => { lightTap(); setUnit("kg"); }}
                  style={[styles.unitBtn, unit === "kg" && styles.unitActive]}
                >
                  <Text style={[styles.unitText, unit === "kg" && styles.unitTextActive]}>KG</Text>
                </Pressable>
                <Pressable
                  onPress={() => { lightTap(); setUnit("lb"); }}
                  style={[styles.unitBtn, unit === "lb" && styles.unitActive]}
                >
                  <Text style={[styles.unitText, unit === "lb" && styles.unitTextActive]}>LB</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>NOTES (OPTIONAL)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Morning weigh-in, post-workout..."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.btnRow}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[styles.saveBtn, !weight && styles.saveBtnDisabled]}
              disabled={!weight}
            >
              <Text style={styles.saveText}>SAVE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modal: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    borderRadius: radius.xl,
    padding: spacing["2xl"],
    width: "100%",
    maxWidth: 360,
    gap: spacing["2xl"],
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 3,
    textAlign: "center",
  },
  field: { gap: spacing.sm },
  label: { ...fonts.caption, color: colors.textSecondary },
  inputRow: { flexDirection: "row", gap: spacing.md },
  weightInput: {
    flex: 1,
    height: TOUCH_MIN + 8,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  unitToggle: {
    flexDirection: "column",
    gap: 4,
  },
  unitBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: "center",
  },
  unitActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  unitText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  unitTextActive: { color: "#000000" },
  notesInput: {
    height: TOUCH_MIN,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: 14,
    color: colors.text,
  },
  btnRow: { flexDirection: "row", gap: spacing.md },
  cancelBtn: {
    flex: 1,
    height: TOUCH_MIN,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1 },
  saveBtn: {
    flex: 1,
    height: TOUCH_MIN,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnDisabled: { opacity: 0.3 },
  saveText: { fontSize: 14, fontWeight: "800", color: "#000000", letterSpacing: 1 },
});
