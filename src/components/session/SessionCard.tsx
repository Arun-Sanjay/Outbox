import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Panel } from "../Panel";
import { SessionTypeIcon } from "./SessionTypeIcon";
import { IntensityBadge } from "./IntensityBadge";
import { StarRating } from "./StarRating";
import { getSessionTypeLabel } from "../../lib/workout-utils";
import { formatDurationShort } from "../../lib/workout-utils";
import { colors, fonts, spacing } from "../../theme";
import { lightTap } from "../../lib/haptics";
import type { TrainingSession } from "../../types";

type SessionCardProps = {
  session: TrainingSession;
  onPress?: () => void;
};

export function SessionCard({ session, onPress }: SessionCardProps) {
  return (
    <Panel
      tone="subtle"
      onPress={onPress ? () => { lightTap(); onPress(); } : undefined}
      style={styles.panel}
    >
      <View style={styles.row}>
        <SessionTypeIcon type={session.sessionType} size={18} />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.typeName} numberOfLines={1}>
              {getSessionTypeLabel(session.sessionType)}
            </Text>
            <IntensityBadge intensity={session.intensity} />
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.duration}>
              {formatDurationShort(session.durationSeconds)}
            </Text>
            <Text style={styles.date}>{session.date}</Text>
            {session.energyRating > 0 && (
              <StarRating value={session.energyRating} size={12} readonly />
            )}
          </View>
        </View>
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  panel: { padding: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  content: { flex: 1, gap: 4 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  typeName: { ...fonts.subheading, flex: 1 },
  bottomRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  duration: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  date: { fontSize: 12, color: colors.textMuted },
});
