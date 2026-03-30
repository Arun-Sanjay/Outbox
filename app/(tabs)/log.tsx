import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { SessionCard } from "../../src/components/session";
import { FightCard, FightRecordDisplay } from "../../src/components/fight";
import { IntensityBadge } from "../../src/components/session";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { useFightStore } from "../../src/stores/useFightStore";
import { lightTap } from "../../src/lib/haptics";
import { goToLogSession, goToLogFight, goToLogSparring, goToFightDetail, goToPartnerHistory } from "../../src/lib/navigation";

type LogTab = "sessions" | "fights" | "sparring";

export default function LogScreen() {
  const [tab, setTab] = useState<LogTab>("sessions");
  const sessions = useSessionStore((s) => s.trainingHistory);
  const grouped = useSessionStore((s) => s.getHistoryGrouped());
  const fights = useFightStore((s) => s.fights);
  const sparring = useFightStore((s) => s.sparringEntries);
  const partners = useFightStore((s) => s.sparringPartners);

  return (
    <SafeAreaView style={st.safe} edges={["top"]}>
      <ScrollView style={st.scroll} contentContainerStyle={st.content}>
        <PageHeader kicker="LOG" title="Training Log" />
        <View style={st.tabs}>
          {(["sessions","fights","sparring"] as LogTab[]).map(t=>(
            <Pressable key={t} onPress={()=>{lightTap();setTab(t);}} style={[st.tabPill,tab===t&&st.tabActive]}>
              <Text style={[st.tabText,tab===t&&st.tabTextActive]}>{t.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>

        {tab==="sessions"&&(<>
          {sessions.length===0?<View style={st.empty}><Text style={st.emptyTitle}>No Sessions Yet</Text><Text style={st.emptyDesc}>Log your first training session</Text></View>:
          grouped.map(g=><View key={g.month}><SectionHeader title={g.month}/>{g.sessions.map(s=><SessionCard key={s.id} session={s}/>)}</View>)}
          <Pressable onPress={()=>{lightTap();goToLogSession();}} style={st.addBtn}><Text style={st.addText}>LOG SESSION</Text></Pressable>
        </>)}

        {tab==="fights"&&(<>
          {fights.length>0&&<FightRecordDisplay fights={fights} variant="full"/>}
          <Pressable onPress={()=>{lightTap();goToLogFight();}} style={st.addBtn}><Text style={st.addText}>LOG FIGHT</Text></Pressable>
          {fights.length===0?<View style={st.empty}><Text style={st.emptyTitle}>No Fights Yet</Text></View>:
          <View style={st.list}>{fights.map(f=><FightCard key={f.id} fight={f} onPress={()=>goToFightDetail(f.id)}/>)}</View>}
        </>)}

        {tab==="sparring"&&(<>
          <Pressable onPress={()=>{lightTap();goToLogSparring();}} style={st.addBtn}><Text style={st.addText}>LOG SPARRING</Text></Pressable>
          {partners.length>0&&<><SectionHeader title="PARTNERS" right={partners.length+" partners"}/><ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.partnerScroll}>{partners.map(p=><Pressable key={p.name} onPress={()=>{lightTap();goToPartnerHistory();}} style={st.partnerCard}><Text style={st.partnerName}>{p.name}</Text><Text style={st.partnerMeta}>{p.totalSessions} sessions</Text></Pressable>)}</ScrollView></>}
          {sparring.length===0?<View style={st.empty}><Text style={st.emptyTitle}>No Sparring Yet</Text></View>:
          <View style={st.list}>{sparring.map(e=><Panel key={e.id} tone="subtle" style={st.sparCard}><Text style={fonts.subheading}>{e.partnerName}</Text><Text style={{...fonts.small,color:colors.textSecondary}}>{e.date} · {e.rounds} rounds</Text></Panel>)}</View>}
        </>)}
        <View style={{height:40}}/>
      </ScrollView>
    </SafeAreaView>
  );
}
const st=StyleSheet.create({safe:{flex:1,backgroundColor:colors.bg},scroll:{flex:1},content:{padding:spacing.xl,paddingBottom:120},tabs:{flexDirection:"row",backgroundColor:"rgba(255,255,255,0.04)",borderRadius:radius.md,padding:2,marginBottom:spacing["2xl"]},tabPill:{flex:1,paddingVertical:spacing.sm,borderRadius:radius.md-2,alignItems:"center"},tabActive:{backgroundColor:colors.accent},tabText:{fontSize:11,fontWeight:"700",color:colors.textMuted,letterSpacing:2},tabTextActive:{color:"#000000"},empty:{paddingVertical:spacing["5xl"],alignItems:"center",gap:spacing.md},emptyTitle:{...fonts.heading,color:colors.textSecondary},emptyDesc:{...fonts.small,color:colors.textMuted},addBtn:{backgroundColor:colors.accent,height:56,borderRadius:radius.md,alignItems:"center",justifyContent:"center",marginVertical:spacing["2xl"]},addText:{fontSize:16,fontWeight:"800",color:"#000000",letterSpacing:2},list:{gap:spacing.md},partnerScroll:{marginBottom:spacing["2xl"]},partnerCard:{width:120,paddingVertical:spacing.lg,paddingHorizontal:spacing.md,borderRadius:radius.md,borderWidth:1,borderColor:colors.panelBorder,backgroundColor:colors.inputBg,marginRight:spacing.md,gap:spacing.xs},partnerName:{fontSize:13,fontWeight:"700",color:colors.text},partnerMeta:{fontSize:10,color:colors.textMuted},sparCard:{padding:spacing.md,marginBottom:spacing.sm}});
