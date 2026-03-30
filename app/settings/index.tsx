import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { usePremiumStore } from "../../src/stores/usePremiumStore";
import { storage } from "../../src/db/storage";
import { lightTap, mediumTap, successNotification } from "../../src/lib/haptics";
import { goToProfileEdit } from "../../src/lib/navigation";

export default function SettingsScreen() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const updateCallout = useProfileStore((s) => s.updateCalloutPreferences);
  const updateHaptics = useProfileStore((s) => s.updateHapticsEnabled);
  const isPremium = usePremiumStore((s) => s.isPremium);
  const togglePremium = usePremiumStore((s) => s.togglePremium);

  const cs = profile?.calloutStyle ?? "numbers";
  const bs = profile?.bellSound ?? "classic";
  const ws = profile?.warningSound ?? "clap";
  const hap = profile?.hapticsEnabled ?? true;
  const notif = profile?.notifications ?? false;
  const wu = profile?.weightUnit ?? "kg";
  const hu = profile?.heightUnit ?? "cm";

  const preview = () => {
    mediumTap();
    const t = cs === "numbers" ? "one, two, slip, three, two" : cs === "names" ? "Jab, Cross, Slip, Lead Hook, Cross" : "one Jab, two Cross, slip, three Lead Hook";
    Speech.speak(t, { rate: profile?.ttsRate ?? 1.0, pitch: profile?.ttsPitch ?? 1.0 });
  };
  const reset = () => Alert.alert("Reset All Data", "Delete ALL data? Cannot be undone.", [
    { text: "Cancel", style: "cancel" },
    { text: "Reset", style: "destructive", onPress: () => { storage.clearAll(); successNotification(); Alert.alert("Done", "Restart the app."); } },
  ]);

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <PageHeader kicker="SETTINGS" title="Settings" />

        <SectionHeader title="VOICE & TTS" />
        <Panel tone="subtle" style={s.sec}>
          <Text style={s.label}>CALLOUT STYLE</Text>
          <View style={s.pillRow}>
            {(["numbers","names","both"] as const).map(v=><Pressable key={v} onPress={()=>{lightTap();updateCallout(v,bs,ws);}} style={[s.pill,cs===v&&s.pillAct]}><Text style={[s.pillTxt,cs===v&&s.pillTxtAct]}>{v.toUpperCase()}</Text></Pressable>)}
          </View>
          <Pressable onPress={preview} style={s.prevBtn}><Text style={s.prevTxt}>PREVIEW CALLOUT</Text></Pressable>
        </Panel>

        <SectionHeader title="SOUNDS" />
        <Panel tone="subtle" style={s.sec}>
          <Text style={s.label}>BELL SOUND</Text>
          <View style={s.pillRow}>
            {(["classic","buzzer","horn"] as const).map(v=><Pressable key={v} onPress={()=>{lightTap();updateCallout(cs,v,ws);}} style={[s.pill,bs===v&&s.pillAct]}><Text style={[s.pillTxt,bs===v&&s.pillTxtAct]}>{v.toUpperCase()}</Text></Pressable>)}
          </View>
          <Text style={s.label}>WARNING SOUND</Text>
          <View style={s.pillRow}>
            {(["clap","beep","stick"] as const).map(v=><Pressable key={v} onPress={()=>{lightTap();updateCallout(cs,bs,v);}} style={[s.pill,ws===v&&s.pillAct]}><Text style={[s.pillTxt,ws===v&&s.pillTxtAct]}>{v.toUpperCase()}</Text></Pressable>)}
          </View>
        </Panel>

        <SectionHeader title="FEEDBACK" />
        <Panel tone="subtle" style={s.sec}>
          <View style={s.togRow}><Text style={s.togLbl}>Haptic Feedback</Text><Switch value={hap} onValueChange={v=>updateHaptics(v)} trackColor={{false:"rgba(255,255,255,0.1)",true:colors.accent}} thumbColor="#fff"/></View>
        </Panel>

        <SectionHeader title="PROFILE" />
        <Pressable onPress={()=>{lightTap();goToProfileEdit();}} style={s.menuItem}><Text style={s.menuTxt}>Edit Profile</Text><Text style={s.menuArr}>{"\u2192"}</Text></Pressable>

        <SectionHeader title="NOTIFICATIONS" />
        <Panel tone="subtle" style={s.sec}>
          <View style={s.togRow}><Text style={s.togLbl}>Training Reminder</Text><Switch value={notif} onValueChange={v=>updateProfile({notifications:v})} trackColor={{false:"rgba(255,255,255,0.1)",true:colors.accent}} thumbColor="#fff"/></View>
        </Panel>

        <SectionHeader title="UNITS" />
        <Panel tone="subtle" style={s.sec}>
          <Text style={s.label}>WEIGHT</Text>
          <View style={s.pillRow}>{(["kg","lb"] as const).map(u=><Pressable key={u} onPress={()=>{lightTap();updateProfile({weightUnit:u});}} style={[s.pill,wu===u&&s.pillAct]}><Text style={[s.pillTxt,wu===u&&s.pillTxtAct]}>{u.toUpperCase()}</Text></Pressable>)}</View>
          <Text style={s.label}>HEIGHT / REACH</Text>
          <View style={s.pillRow}>{(["cm","in"] as const).map(u=><Pressable key={u} onPress={()=>{lightTap();updateProfile({heightUnit:u,reachUnit:u});}} style={[s.pill,hu===u&&s.pillAct]}><Text style={[s.pillTxt,hu===u&&s.pillTxtAct]}>{u.toUpperCase()}</Text></Pressable>)}</View>
        </Panel>

        <SectionHeader title="DATA" />
        <Pressable onPress={reset} style={s.dangerBtn}><Text style={s.dangerTxt}>RESET ALL DATA</Text></Pressable>

        <SectionHeader title="DEVELOPER" />
        <Panel tone="subtle" style={s.sec}>
          <View style={s.togRow}><Text style={s.togLbl}>Premium (Dev)</Text><Switch value={isPremium} onValueChange={()=>togglePremium()} trackColor={{false:"rgba(255,255,255,0.1)",true:colors.accent}} thumbColor="#fff"/></View>
        </Panel>

        <SectionHeader title="ABOUT" />
        <Panel tone="subtle" style={s.sec}>
          <Text style={{fontSize:16,fontWeight:"700",color:colors.text}}>Outbox v1.0.0</Text>
          <Text style={{fontSize:13,color:colors.textSecondary}}>Boxing training companion</Text>
        </Panel>
        <View style={{height:40}}/>
      </ScrollView>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.bg},scroll:{flex:1},content:{padding:spacing.xl,paddingBottom:120},sec:{padding:spacing.xl,marginBottom:spacing["2xl"],gap:spacing.lg},label:{...fonts.caption,color:colors.textSecondary},pillRow:{flexDirection:"row",gap:spacing.sm},pill:{flex:1,paddingVertical:spacing.sm,borderRadius:radius.md,borderWidth:1,borderColor:colors.panelBorder,alignItems:"center"},pillAct:{backgroundColor:colors.accent,borderColor:colors.accent},pillTxt:{fontSize:11,fontWeight:"700",color:colors.textMuted,letterSpacing:1},pillTxtAct:{color:"#000000"},prevBtn:{paddingVertical:spacing.md,borderRadius:radius.md,borderWidth:1,borderColor:colors.accent,alignItems:"center"},prevTxt:{fontSize:12,fontWeight:"700",color:colors.accent,letterSpacing:2},togRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},togLbl:{fontSize:15,fontWeight:"600",color:colors.text},menuItem:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingVertical:spacing.lg,paddingHorizontal:spacing.xl,borderRadius:radius.md,borderWidth:1,borderColor:colors.panelBorder,backgroundColor:colors.inputBg,marginBottom:spacing["2xl"]},menuTxt:{fontSize:15,fontWeight:"600",color:colors.text},menuArr:{fontSize:18,color:colors.textMuted},dangerBtn:{paddingVertical:spacing.lg,borderRadius:radius.md,borderWidth:1,borderColor:colors.danger,alignItems:"center",marginBottom:spacing["2xl"]},dangerTxt:{fontSize:13,fontWeight:"700",color:colors.danger,letterSpacing:2}});
