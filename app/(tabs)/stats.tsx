import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../../src/theme";
import { PageHeader, SectionHeader } from "../../src/components";
import { TimeRangeToggle, TrainingOverview, DonutChart, HeatMap, TrendChart, IntensityChart, VolumeChart, ComboAnalytics, FightAnalytics, PersonalRecords } from "../../src/components/analytics";
import type { TimeRange } from "../../src/components/analytics";
import { useSessionStore } from "../../src/stores/useSessionStore";
import { useFightStore } from "../../src/stores/useFightStore";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { getSessionTypeLabel, getSessionTypeColor } from "../../src/lib/workout-utils";
import type { SessionType } from "../../src/types";

const ALL_TYPES: SessionType[] = ["heavy_bag","speed_bag","double_end_bag","shadow_boxing","mitt_work","sparring","conditioning","strength","roadwork"];

export default function StatsScreen() {
  const [range, setRange] = useState<TimeRange>("month");
  const sessions = useSessionStore((s) => s.trainingHistory);
  const fights = useFightStore((s) => s.fights);
  const profile = useProfileStore((s) => s.profile);

  const donutSegments = ALL_TYPES.map(t=>({label:getSessionTypeLabel(t),value:sessions.filter(s=>s.sessionType===t).length,color:getSessionTypeColor(t)})).filter(s=>s.value>0);
  const trendData = sessions.slice(0,12).reverse().map(s=>({label:s.date.slice(5),energy:s.energyRating||3,sharpness:s.sharpnessRating||3}));
  const totalCombos = sessions.filter(s=>s.comboModeUsed).length;

  return (
    <SafeAreaView style={st.safe} edges={["top"]}>
      <ScrollView style={st.scroll} contentContainerStyle={st.content}>
        <PageHeader kicker="STATS" title="Analytics" subtitle="Your performance data" />
        <TimeRangeToggle value={range} onChange={setRange} />
        <TrainingOverview range={range} />
        {donutSegments.length>0&&<><SectionHeader title="SESSION BREAKDOWN" /><DonutChart segments={donutSegments} centerValue={sessions.length} centerLabel="SESSIONS" /></>}
        <View style={st.section}><SectionHeader title="TRAINING HEAT MAP" /><HeatMap sessions={sessions} /></View>
        {trendData.length>=2&&<View style={st.section}><SectionHeader title="PERFORMANCE TRENDS" /><TrendChart data={trendData} /></View>}
        <View style={st.section}><SectionHeader title="INTENSITY DISTRIBUTION" /><IntensityChart sessions={sessions} /></View>
        <View style={st.section}><SectionHeader title="TRAINING VOLUME" /><VolumeChart sessions={sessions} /></View>
        {totalCombos>0&&<View style={st.section}><SectionHeader title="COMBO STATS" /><ComboAnalytics totalCombos={totalCombos} topDrilled={[]} /></View>}
        {fights.length>0&&<FightAnalytics fights={fights} />}
        <View style={st.section}><SectionHeader title="PERSONAL RECORDS" /><PersonalRecords sessions={sessions} longestStreak={profile?.longestStreak??0} /></View>
        <View style={{height:40}} />
      </ScrollView>
    </SafeAreaView>
  );
}
const st=StyleSheet.create({safe:{flex:1,backgroundColor:colors.bg},scroll:{flex:1},content:{padding:spacing.xl,paddingBottom:120},section:{marginTop:spacing["2xl"]}});
