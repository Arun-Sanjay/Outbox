import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel } from "../../src/components";
import { ComboSequence } from "../../src/components/combo";
import { useComboStore } from "../../src/stores/useComboStore";
import { lightTap } from "../../src/lib/haptics";
import { goToComboDetail, goToComboBuilder } from "../../src/lib/navigation";
import type { Combo } from "../../src/types";

type Filter = "all" | "beginner" | "intermediate" | "advanced" | "favorites" | "personal";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "beginner", label: "BEG" },
  { key: "intermediate", label: "INT" },
  { key: "advanced", label: "ADV" },
  { key: "favorites", label: "FAV" },
  { key: "personal", label: "MY" },
];

export default function ComboLibraryScreen() {
  const combos = useComboStore((s) => s.combos);
  const searchCombos = useComboStore((s) => s.searchCombos);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = search ? searchCombos(search) : combos;
    if (filter === "beginner") list = list.filter((c) => c.difficulty === "beginner");
    else if (filter === "intermediate") list = list.filter((c) => c.difficulty === "intermediate");
    else if (filter === "advanced") list = list.filter((c) => c.difficulty === "advanced");
    else if (filter === "favorites") list = list.filter((c) => c.isFavorite);
    else if (filter === "personal") list = list.filter((c) => c.scope === "personal");
    return list;
  }, [combos, filter, search, searchCombos]);

  const renderItem = ({ item }: { item: Combo }) => (
    <Panel
      tone="subtle"
      onPress={() => { lightTap(); goToComboDetail(item.id); }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        {item.isFavorite && <Ionicons name="heart" size={14} color={colors.danger} />}
      </View>
      <ComboSequence sequence={item.sequence} size="sm" scrollable />
      <View style={styles.cardMeta}>
        <Text style={styles.cardDiff}>{item.difficulty.toUpperCase()}</Text>
        <Text style={styles.cardPunches}>{item.totalPunches} punches</Text>
      </View>
    </Panel>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <PageHeader kicker="COMBOS" title="Combo Library" subtitle={`${filtered.length} combos`} />
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search combos..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Filter pills */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => { lightTap(); setFilter(f.key); }}
              style={[styles.filterPill, filter === f.key && styles.filterActive]}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* List */}
        <FlashList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No combos found</Text>
            </View>
          }
        />

        {/* Create button */}
        <Pressable onPress={() => { lightTap(); goToComboBuilder(); }} style={styles.createBtn}>
          <Ionicons name="add" size={24} color="#000000" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  searchRow: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    marginHorizontal: spacing.xl, marginBottom: spacing.md,
    paddingHorizontal: spacing.lg, height: TOUCH_MIN,
    backgroundColor: colors.inputBg, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.inputBorder,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  filterRow: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  filterPill: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.panelBorder },
  filterActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 1 },
  filterTextActive: { color: "#000000" },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  card: { padding: spacing.md, gap: spacing.sm },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardName: { ...fonts.subheading, flex: 1 },
  cardMeta: { flexDirection: "row", gap: spacing.lg },
  cardDiff: { fontSize: 10, fontWeight: "700", color: colors.textMuted, letterSpacing: 1 },
  cardPunches: { fontSize: 10, color: colors.textMuted },
  empty: { paddingVertical: spacing["5xl"], alignItems: "center" },
  emptyText: { ...fonts.body, color: colors.textMuted },
  createBtn: {
    position: "absolute", bottom: 90, right: spacing.xl,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.accent, alignItems: "center", justifyContent: "center",
    elevation: 8, shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
});
