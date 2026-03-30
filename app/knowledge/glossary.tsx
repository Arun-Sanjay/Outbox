import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel } from "../../src/components";
import { GLOSSARY_ENTRIES } from "../../src/data/glossary";
import { useKnowledgeStore } from "../../src/stores/useKnowledgeStore";
import { lightTap } from "../../src/lib/haptics";
import type { GlossaryEntry } from "../../src/types";

const CATEGORIES = ["all", "technique", "equipment", "rules", "slang", "training"] as const;

export default function GlossaryScreen() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const bookmarked = useKnowledgeStore((s) => s.bookmarkedTerms);
  const toggleBookmark = useKnowledgeStore((s) => s.toggleBookmark);

  const filtered = useMemo(() => {
    let entries = GLOSSARY_ENTRIES;
    if (activeCategory !== "all") {
      entries = entries.filter((e) => e.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.term.toLowerCase().includes(q) ||
          e.definition.toLowerCase().includes(q)
      );
    }
    return entries.sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory]);

  const renderItem = ({ item }: { item: GlossaryEntry }) => {
    const isExpanded = expandedId === item.id;
    const isBookmarked = bookmarked.includes(item.id);

    return (
      <Pressable
        onPress={() => {
          lightTap();
          setExpandedId(isExpanded ? null : item.id);
        }}
      >
        <Panel tone="subtle" style={styles.entryPanel}>
          <View style={styles.entryHeader}>
            <View style={styles.entryLeft}>
              <Text style={styles.term}>{item.term}</Text>
              <Text style={styles.category}>{item.category.toUpperCase()}</Text>
            </View>
            <View style={styles.entryRight}>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  lightTap();
                  toggleBookmark(item.id);
                }}
                hitSlop={12}
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color={isBookmarked ? colors.accent : colors.textMuted}
                />
              </Pressable>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.textMuted}
              />
            </View>
          </View>

          {isExpanded && (
            <View style={styles.definitionSection}>
              <Text style={styles.definition}>{item.definition}</Text>
            </View>
          )}
        </Panel>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.headerPad}>
          <PageHeader kicker="LEARN" title="Glossary" subtitle={`${GLOSSARY_ENTRIES.length} terms`} />
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search terms..."
            placeholderTextColor={colors.textMuted}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Category filter pills */}
        <View style={styles.filterRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => { lightTap(); setActiveCategory(cat); }}
              style={[styles.filterPill, activeCategory === cat && styles.filterActive]}
            >
              <Text style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>
                {cat.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  headerPad: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    height: TOUCH_MIN,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.text },
  filterRow: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  filterPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  filterActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { fontSize: 9, fontWeight: "700", color: colors.textMuted, letterSpacing: 1 },
  filterTextActive: { color: "#000000" },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  entryPanel: { padding: spacing.md, marginBottom: spacing.sm },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  entryLeft: { flex: 1, gap: 2 },
  term: { ...fonts.subheading },
  category: { fontSize: 9, fontWeight: "600", color: colors.textMuted, letterSpacing: 1 },
  entryRight: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  definitionSection: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.panelBorder },
  definition: { ...fonts.body, color: colors.textSecondary, lineHeight: 24 },
});
