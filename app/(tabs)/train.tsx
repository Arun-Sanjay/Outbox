import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { useComboStore } from "../../src/stores/useComboStore";
import { getSessionTypeLabel, getSessionTypeColor } from "../../src/lib/workout-utils";
import { lightTap } from "../../src/lib/haptics";
import { goToComboConfig, goToRoundTimer, goToSkipRope, goToRoadwork, goToLogSession, goToComboLibrary, goToComboBuilder, goToDrillQueue } from "../../src/lib/navigation";
import type { SessionType } from "../../src/types";

const LOG_TYPES: { type: SessionType; icon: string }[] = [
  { type: "heavy_bag", icon: "fitness" }, { type: "speed_bag", icon: "speedometer" },
  { type: "double_end_bag", icon: "ellipse" }, { type: "shadow_boxing", icon: "person" },
  { type: "mitt_work", icon: "hand-left" }, { type: "sparring", icon: "people" },
  { type: "conditioning", icon: "heart" }, { type: "strength", icon: "barbell" },
  { type: "roadwork", icon: "walk" },
];

export default function TrainScreen() {
  const combos = useComboStore((s) => s.combos);
  const drillQueue = useComboStore((s) => s.drillQueue);
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <PageHeader kicker="TRAIN" title="Training" subtitle="Choose your session" />
        <Panel onPress={() => { lightTap(); goToComboConfig(); }} style={s.hero}>
          <Text style={s.heroK}>COMBO CALLOUT</Text>
          <Text style={s.heroT}>START SESSION</Text>
          <Text style={s.heroD}>AI-powered combo drill with TTS callouts</Text>
          <View style={s.modes}>{["COMBOS","FOOTWORK","DEFENSE"].map(m=><View key={m} style={s.mode}><Text style={s.modeT}>{m}</Text></View>)}</View>
        </Panel>
        <SectionHeader title="TIMERS" />
        <View style={s.tRow}>
          <Pressable onPress={()=>{lightTap();goToRoundTimer();}} style={s.tCard}><Ionicons name="timer" size={24} color={colors.accent}/><Text style={s.tLabel}>Round Timer</Text></Pressable>
          <Pressable onPress={()=>{lightTap();goToSkipRope();}} style={s.tCard}><Ionicons name="heart" size={24} color={colors.accent}/><Text style={s.tLabel}>Skip Rope</Text></Pressable>
        </View>
        <SectionHeader title="LOG SESSION" />
        <View style={s.logGrid}>{LOG_TYPES.map(i=><Pressable key={i.type} onPress={()=>{lightTap();goToLogSession();}} style={s.logCard}><Ionicons name={i.icon as keyof typeof Ionicons.glyphMap} size={20} color={getSessionTypeColor(i.type)}/><Text style={s.logLabel}>{getSessionTypeLabel(i.type)}</Text></Pressable>)}</View>
        <SectionHeader title="ROADWORK" />
        <Panel tone="subtle" onPress={()=>{lightTap();goToRoadwork();}} style={s.road}><Ionicons name="walk" size={28} color={colors.sessionRoadwork}/><View style={{flex:1}}><Text style={fonts.subheading}>GPS Run Tracker</Text><Text style={{...fonts.small,color:colors.textSecondary}}>Track distance, pace, and route</Text></View></Panel>
        <SectionHeader title="MY COMBOS" right={combos.length+" combos"} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.comboS}>
          <Pressable onPress={()=>{lightTap();goToComboBuilder();}} style={s.createC}><Ionicons name="add-circle" size={24} color={colors.accent}/><Text style={s.createT}>CREATE</Text></Pressable>
          {combos.slice(0,5).map(c=><View key={c.id} style={s.prevC}><Text style={s.prevN} numberOfLines={1}>{c.name}</Text><Text style={s.prevS}>{c.sequence.join("-")}</Text></View>)}
          <Pressable onPress={()=>{lightTap();goToComboLibrary();}} style={s.allC}><Text style={s.allT}>VIEW ALL</Text></Pressable>
        </ScrollView>
        {drillQueue.length>0&&<><SectionHeader title="DRILL QUEUE" right={drillQueue.length+" combos"}/><Panel tone="subtle" onPress={()=>{lightTap();goToDrillQueue();}} style={s.queue}><Text style={fonts.subheading}>{drillQueue.length} combos queued</Text><Text style={s.qCta}>TAP TO VIEW →</Text></Panel></>}
        <View style={{height:40}}/>
      </ScrollView>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.bg},scroll:{flex:1},content:{padding:spacing.xl,paddingBottom:120},hero:{padding:spacing["2xl"],alignItems:"center",marginBottom:spacing["2xl"]},heroK:{fontSize:10,fontWeight:"700",color:colors.accent,letterSpacing:3},heroT:{fontSize:22,fontWeight:"800",color:colors.text,letterSpacing:2,marginVertical:spacing.md},heroD:{...fonts.small,color:colors.textSecondary,marginBottom:spacing.lg},modes:{flexDirection:"row",gap:spacing.sm},mode:{paddingHorizontal:spacing.md,paddingVertical:4,borderRadius:radius.full,borderWidth:1,borderColor:colors.accent},modeT:{fontSize:9,fontWeight:"700",color:colors.accent,letterSpacing:1},tRow:{flexDirection:"row",gap:spacing.md,marginBottom:spacing["2xl"]},tCard:{flex:1,paddingVertical:spacing.xl,borderRadius:radius.md,borderWidth:1,borderColor:colors.panelBorder,backgroundColor:colors.inputBg,alignItems:"center",gap:spacing.sm},tLabel:{fontSize:12,fontWeight:"700",color:colors.text,letterSpacing:1},logGrid:{flexDirection:"row",flexWrap:"wrap",gap:spacing.sm,marginBottom:spacing["2xl"]},logCard:{width:"31%",paddingVertical:spacing.md,borderRadius:radius.md,borderWidth:1,borderColor:colors.panelBorder,backgroundColor:colors.inputBg,alignItems:"center",gap:spacing.xs},logLabel:{fontSize:9,fontWeight:"700",color:colors.textSecondary,letterSpacing:0.5,textAlign:"center"},road:{flexDirection:"row",padding:spacing.lg,gap:spacing.lg,alignItems:"center",marginBottom:spacing["2xl"]},comboS:{marginBottom:spacing["2xl"]},createC:{width:100,height:80,borderRadius:radius.md,borderWidth:1,borderColor:colors.accent,borderStyle:"dashed",alignItems:"center",justifyContent:"center",gap:spacing.xs,marginRight:spacing.md},createT:{fontSize:9,fontWeight:"700",color:colors.accent,letterSpacing:1},prevC:{width:140,height:80,borderRadius:radius.md,borderWidth:1,borderColor:colors.panelBorder,backgroundColor:colors.inputBg,padding:spacing.md,justifyContent:"center",marginRight:spacing.md},prevN:{fontSize:12,fontWeight:"700",color:colors.text,marginBottom:4},prevS:{fontSize:10,color:colors.textMuted},allC:{width:80,height:80,borderRadius:radius.md,borderWidth:1,borderColor:colors.panelBorder,alignItems:"center",justifyContent:"center"},allT:{fontSize:9,fontWeight:"700",color:colors.accent,letterSpacing:1},queue:{padding:spacing.lg,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},qCta:{fontSize:11,fontWeight:"700",color:colors.accent,letterSpacing:1}});
