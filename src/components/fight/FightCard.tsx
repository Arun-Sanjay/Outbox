import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, spacing, radius } from "../../theme";
import { Panel } from "../Panel";
import { getWeightClassLabel } from "../../lib/weight-class";
import { lightTap } from "../../lib/haptics";
import type { Fight } from "../../types";

type FightCardProps = {
  fight: Fight;
  onPress?: () => void;
};

const RESULT_COLORS: Record<string, string> = {
  win: colors.win,
  loss: colors.loss,
  draw: colors.draw,
  no_contest: colors.textMuted,
};

function getResultText(fight: Fight): string {
  const result = fight.result.toUpperCase();
  if (fight.method) {
    const method = fight.method.replace(/_/g, " ").toUpperCase();
    if (fight.endedRound) {
      return `${result} \u2014 ${method} Round ${fight.endedRound}`;
    }
    return `${result} \u2014 ${method}`;
  }
  return result;
}

export function FightCard({ fight, onPress }: FightCardProps) {
  const resultColor = RESULT_COLORS[fight.result] ?? colors.textMuted;

  return (
    <Panel
      tone="subtle"
      onPress={onPress ? () => { lightTap(); onPress(); } : undefined}
      style={styles.panel}
    >
      <View style={styles.row}>
        <View style={[styles.resultBar, { backgroundColor: resultColor }]} />
        <View style={styles.content}>
          <Text style={styles.opponent} numberOfLines={1}>{fight.opponentName}</Text>
          <Text style={[styles.resultText, { color: resultColor }]}>{getResultText(fight)}</Text>
          <Text style={styles.meta}>
            {fight.date} \u00B7 {getWeightClassLabel(fight.weightClass)}{fight.location ? ` \u00B7 ${fight.location}` : ""}
          </Text>
        </View>
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  panel: { padding: spacing.md },
  row: { flexDirection: "row", gap: spacing.md },
  resultBar: { width: 3, borderRadius: 2, alignSelf: "stretch" },
  content: { flex: 1, gap: 2 },
  opponent: { ...fonts.subheading },
  resultText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  meta: { fontSize: 11, color: colors.textMuted },
});
