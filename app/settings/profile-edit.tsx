import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { successNotification, lightTap } from "../../src/lib/haptics";
import { goBack } from "../../src/lib/navigation";

export default function EditProfileScreen() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [name, setName] = useState(profile?.name ?? "");
  const [fightName, setFightName] = useState(profile?.fightName ?? "");
  const stance = profile?.stance ?? "orthodox";
  const experience = profile?.experienceLevel ?? "beginner";

  const handleSave = () => {
    updateProfile({
      name: name.trim() || profile?.name || "Fighter",
      fightName: fightName.trim() || null,
    });
    successNotification();
    goBack();
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <PageHeader kicker="PROFILE" title="Edit Profile" />

        <View style={s.section}>
          <Text style={s.label}>NAME</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.textMuted} />
        </View>

        <View style={s.section}>
          <Text style={s.label}>FIGHT NAME (OPTIONAL)</Text>
          <TextInput style={s.input} value={fightName} onChangeText={setFightName} placeholder="e.g. The Natural" placeholderTextColor={colors.textMuted} />
        </View>

        <View style={s.section}>
          <Text style={s.label}>STANCE</Text>
          <View style={s.pillRow}>
            {(["orthodox", "southpaw", "switch"] as const).map((st) => (
              <Pressable key={st} onPress={() => { lightTap(); updateProfile({ stance: st }); }}
                style={[s.pill, stance === st && s.pillActive]}>
                <Text style={[s.pillText, stance === st && s.pillTextActive]}>{st.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.label}>EXPERIENCE</Text>
          <View style={s.pillRow}>
            {(["beginner", "intermediate", "advanced"] as const).map((exp) => (
              <Pressable key={exp} onPress={() => { lightTap(); updateProfile({ experienceLevel: exp }); }}
                style={[s.pill, experience === exp && s.pillActive]}>
                <Text style={[s.pillText, experience === exp && s.pillTextActive]}>{exp.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={handleSave} style={s.saveBtn}>
          <Text style={s.saveBtnText}>SAVE</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  section: { marginBottom: spacing["2xl"] },
  label: { ...fonts.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  input: {
    height: TOUCH_MIN, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: colors.inputBorder, borderRadius: radius.md,
    paddingHorizontal: spacing.lg, fontSize: 18, fontWeight: "600", color: colors.text,
  },
  pillRow: { flexDirection: "row", gap: spacing.sm },
  pill: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.panelBorder, alignItems: "center" },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 1 },
  pillTextActive: { color: "#000000" },
  saveBtn: {
    backgroundColor: colors.accent, height: 56, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center", marginTop: spacing.xl,
  },
  saveBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
});
