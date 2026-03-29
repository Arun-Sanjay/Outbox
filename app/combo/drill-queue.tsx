import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel } from "../../src/components";
import { ComboSequence } from "../../src/components/combo";
import { useComboStore } from "../../src/stores/useComboStore";
import { lightTap, mediumTap } from "../../src/lib/haptics";
import { goToComboSession, goToComboLibrary } from "../../src/lib/navigation";
import type { Combo } from "../../src/types";

export default function DrillQueueScreen() {
  const drillQueueCombos = useComboStore((s) => s.getDrillQueue());
  const removeFromDrillQueue = useComboStore((s) => s.removeFromDrillQueue);
  const clearDrillQueue = useComboStore((s) => s.clearDrillQueue);

  const handleRemove = (id: string) => {
    lightTap();
    removeFromDrillQueue(id);
  };

  const handleClear = () => {
    mediumTap();
    clearDrillQueue();
  };

  const handleDrill = () => {
    mediumTap();
    goToComboSession();
  };

  const renderItem = ({ item, index }: { item: Combo; index: number }) => (
    <Panel tone="subtle" style={styles.queueItem}>
      <View style={styles.itemRow}>
        <Text style={styles.itemIndex}>{index + 1}</Text>
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <ComboSequence sequence={item.sequence} size="sm" scrollable />
        </View>
        <Pressable onPress={() => handleRemove(item.id)} style={styles.removeBtn}>
          <Ionicons name="close-circle" size={22} color={colors.danger} />
        </Pressable>
      </View>
    </Panel>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <PageHeader kicker="QUEUE" title="Drill Queue" subtitle={`${drillQueueCombos.length} combos`} />
          {drillQueueCombos.length > 0 && (
            <Pressable onPress={handleClear}>
              <Text style={styles.clearText}>CLEAR ALL</Text>
            </Pressable>
          )}
        </View>

        {drillQueueCombos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Queue is empty</Text>
            <Text style={styles.emptyDesc}>Add combos from the library to build your drill queue</Text>
            <Pressable onPress={() => { lightTap(); goToComboLibrary(); }} style={styles.addBtn}>
              <Text style={styles.addBtnText}>BROWSE COMBOS</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={drillQueueCombos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}

        {drillQueueCombos.length > 0 && (
          <View style={styles.footer}>
            <Pressable onPress={handleDrill} style={styles.drillBtn}>
              <Text style={styles.drillText}>DRILL THIS QUEUE</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.xl },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  clearText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.danger,
    letterSpacing: 1,
    marginTop: spacing.lg,
  },
  list: { gap: spacing.md, paddingBottom: 100 },
  queueItem: { padding: spacing.md },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  itemIndex: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.accent,
    width: 28,
    textAlign: "center",
  },
  itemContent: { flex: 1, gap: spacing.xs },
  itemName: { ...fonts.subheading },
  removeBtn: { padding: spacing.xs },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  emptyTitle: { ...fonts.heading, color: colors.textSecondary },
  emptyDesc: { ...fonts.small, color: colors.textMuted, textAlign: "center" },
  addBtn: {
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
    marginTop: spacing.lg,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 2,
  },
  footer: {
    paddingTop: spacing.lg,
  },
  drillBtn: {
    backgroundColor: colors.accent,
    height: TOUCH_MIN + 8,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  drillText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2,
  },
});
