import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel } from "../../src/components";
import { ComboSequence, ComboStats } from "../../src/components/combo";
import { useComboStore } from "../../src/stores/useComboStore";
import { getPunchName, isPunchCode } from "../../src/lib/combo-utils";
import { PUNCHES } from "../../src/data/punches";
import { lightTap, mediumTap, successNotification } from "../../src/lib/haptics";
import { goBack } from "../../src/lib/navigation";
import { getComboDisplayText } from "../../src/lib/combo-utils";
import type { PunchCode } from "../../src/types";

export default function ComboDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const combo = useComboStore((s) => s.getCombo(id ?? ""));
  const toggleFavorite = useComboStore((s) => s.toggleFavorite);
  const addToDrillQueue = useComboStore((s) => s.addToDrillQueue);
  const deleteCustomCombo = useComboStore((s) => s.deleteCustomCombo);

  if (!combo) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Combo not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleTest = () => {
    mediumTap();
    const text = getComboDisplayText(combo.sequence, "names");
    Speech.speak(text, { rate: 1.0, pitch: 1.0 });
  };

  const handleFavorite = () => {
    lightTap();
    toggleFavorite(combo.id);
  };

  const handleAddToQueue = () => {
    lightTap();
    addToDrillQueue(combo.id);
    successNotification();
  };

  const handleDelete = () => {
    Alert.alert("Delete Combo", `Delete "${combo.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteCustomCombo(combo.id);
          goBack();
        },
      },
    ]);
  };

  // Get form cues for each punch in the sequence
  const punchCues = combo.sequence
    .filter(isPunchCode)
    .map((code) => ({
      code: code as PunchCode,
      name: getPunchName(code),
      cues: PUNCHES[code as PunchCode]?.formCues ?? [],
    }));

  // Unique punches only
  const uniquePunchCues = punchCues.filter(
    (p, i, arr) => arr.findIndex((a) => a.code === p.code) === i
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader
          kicker={combo.difficulty.toUpperCase()}
          title={combo.name}
          subtitle={combo.scope === "personal" ? "Custom Combo" : "System Combo"}
        />

        {/* Sequence */}
        <View style={styles.section}>
          <ComboSequence sequence={combo.sequence} size="lg" wrap />
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <ComboStats
            headShotCount={combo.headShotCount}
            bodyShotCount={combo.bodyShotCount}
            powerPunchCount={combo.powerPunchCount}
            speedPunchCount={combo.speedPunchCount}
            defensiveCount={combo.defensiveCount}
            footworkCount={combo.footworkCount}
            totalPunches={combo.totalPunches}
          />
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable onPress={handleTest} style={styles.actionBtn}>
            <Ionicons name="volume-high" size={18} color={colors.accent} />
            <Text style={styles.actionText}>TEST</Text>
          </Pressable>

          <Pressable onPress={handleFavorite} style={styles.actionBtn}>
            <Ionicons
              name={combo.isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={combo.isFavorite ? colors.danger : colors.textSecondary}
            />
            <Text style={styles.actionText}>
              {combo.isFavorite ? "UNFAVORITE" : "FAVORITE"}
            </Text>
          </Pressable>

          <Pressable onPress={handleAddToQueue} style={styles.actionBtn}>
            <Ionicons name="add-circle-outline" size={18} color={colors.accent} />
            <Text style={styles.actionText}>QUEUE</Text>
          </Pressable>
        </View>

        {/* Form cues */}
        {uniquePunchCues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.cueSectionTitle}>FORM CUES</Text>
            {uniquePunchCues.map((punch) => (
              <Panel key={punch.code} tone="subtle" style={styles.cuePanel}>
                <Text style={styles.cuePunchName}>{punch.name}</Text>
                {punch.cues.map((cue, i) => (
                  <Text key={i} style={styles.cueText}>
                    {i + 1}. {cue}
                  </Text>
                ))}
              </Panel>
            ))}
          </View>
        )}

        {/* Delete for custom combos */}
        {combo.scope === "personal" && (
          <Pressable onPress={handleDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={styles.deleteText}>DELETE COMBO</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: { ...fonts.heading, color: colors.textMuted },
  section: { marginBottom: spacing["2xl"] },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing["2xl"],
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.inputBg,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  cueSectionTitle: {
    ...fonts.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cuePanel: { padding: spacing.md, marginBottom: spacing.md },
  cuePunchName: {
    ...fonts.subheading,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  cueText: {
    ...fonts.small,
    color: colors.textSecondary,
    marginBottom: 4,
    paddingLeft: spacing.sm,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    marginTop: spacing.xl,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.danger,
    letterSpacing: 1,
  },
});
