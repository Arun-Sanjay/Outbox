import React, { useState, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { PageHeader, Panel, SectionHeader } from "../../src/components";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { useComboStore } from "../../src/stores/useComboStore";
import { mediumTap, lightTap } from "../../src/lib/haptics";
import { goToComboSession } from "../../src/lib/navigation";
import type { ComboSessionConfig } from "../../src/types";

// ── Pill selector helper ─────────────────────────────────────────────────────

type PillOption<T extends string> = { value: T; label: string; desc?: string };

function PillRow<T extends string>({
  options,
  selected,
  onSelect,
  multi = false,
}: {
  options: PillOption<T>[];
  selected: T | T[];
  onSelect: (v: T) => void;
  multi?: boolean;
}) {
  const isSelected = (v: T) =>
    multi ? (selected as T[]).includes(v) : selected === v;

  return (
    <View style={pillStyles.row}>
      {options.map((o) => (
        <Pressable
          key={o.value}
          onPress={() => { lightTap(); onSelect(o.value); }}
          style={[
            pillStyles.pill,
            isSelected(o.value) && pillStyles.pillActive,
          ]}
        >
          <Text
            style={[
              pillStyles.pillText,
              isSelected(o.value) && pillStyles.pillTextActive,
            ]}
          >
            {o.label}
          </Text>
          {o.desc && isSelected(o.value) && (
            <Text style={pillStyles.pillDesc}>{o.desc}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const pillStyles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.inputBg,
  },
  pillActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(251,191,36,0.15)",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  pillTextActive: { color: colors.accent },
  pillDesc: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});

// ── Number stepper helper ────────────────────────────────────────────────────

function Stepper({
  value,
  min,
  max,
  step,
  formatLabel,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  formatLabel: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <View style={stepperStyles.container}>
      <Pressable
        onPress={() => { lightTap(); onChange(Math.max(min, value - step)); }}
        style={stepperStyles.btn}
        disabled={value <= min}
      >
        <Text style={[stepperStyles.btnText, value <= min && stepperStyles.btnDisabled]}>
          −
        </Text>
      </Pressable>
      <Text style={stepperStyles.value}>{formatLabel(value)}</Text>
      <Pressable
        onPress={() => { lightTap(); onChange(Math.min(max, value + step)); }}
        style={stepperStyles.btn}
        disabled={value >= max}
      >
        <Text style={[stepperStyles.btnText, value >= max && stepperStyles.btnDisabled]}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const stepperStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontSize: 22, fontWeight: "600", color: colors.text },
  btnDisabled: { color: colors.textMuted, opacity: 0.3 },
  value: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    minWidth: 80,
    textAlign: "center",
  },
});

// ── Toggle row helper ────────────────────────────────────────────────────────

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={toggleStyles.row}>
      <Text style={toggleStyles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={(v) => { lightTap(); onChange(v); }}
        trackColor={{ false: colors.inputBg, true: colors.accent }}
        thumbColor="#ffffff"
      />
    </View>
  );
}

const toggleStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  label: { ...fonts.body, flex: 1 },
});

// ── Drill mode options ───────────────────────────────────────────────────────

const DRILL_MODES: PillOption<"combo" | "footwork" | "defense">[] = [
  { value: "combo", label: "COMBOS" },
  { value: "footwork", label: "FOOTWORK" },
  { value: "defense", label: "DEFENSE" },
];

const TEMPO_OPTIONS: PillOption<"slow" | "medium" | "fast" | "random">[] = [
  { value: "slow", label: "Slow", desc: "6-8s between calls" },
  { value: "medium", label: "Medium", desc: "4-6s between calls" },
  { value: "fast", label: "Fast", desc: "2-4s between calls" },
  { value: "random", label: "Random", desc: "Varies each call" },
];

const CALLOUT_OPTIONS: PillOption<"numbers" | "names" | "both">[] = [
  { value: "numbers", label: "Numbers", desc: "1-2-3" },
  { value: "names", label: "Names", desc: "Jab-Cross-Hook" },
  { value: "both", label: "Both", desc: "1 Jab, 2 Cross..." },
];

const SOURCE_OPTIONS: PillOption<"beginner" | "intermediate" | "advanced">[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

// ── Main screen ──────────────────────────────────────────────────────────────

export default function SessionConfigScreen() {
  const profile = useProfileStore((s) => s.profile);
  const drillQueueLength = useComboStore((s) => s.drillQueue.length);

  // Config state
  const [drillMode, setDrillMode] = useState<"combo" | "footwork" | "defense">("combo");
  const [comboSources, setComboSources] = useState<("beginner" | "intermediate" | "advanced")[]>(["beginner", "intermediate"]);
  const [includeFavorites, setIncludeFavorites] = useState(false);
  const [useDrillQueue, setUseDrillQueue] = useState(false);
  const [numRounds, setNumRounds] = useState(6);
  const [roundLength, setRoundLength] = useState(180); // seconds
  const [restLength, setRestLength] = useState(60); // seconds
  const [tempo, setTempo] = useState<"slow" | "medium" | "fast" | "random">("medium");
  const [calloutStyle, setCalloutStyle] = useState<"numbers" | "names" | "both">(
    profile?.calloutStyle ?? "numbers"
  );
  const [stance, setStance] = useState<"orthodox" | "southpaw" | "switch">(
    profile?.stance ?? "orthodox"
  );
  const [warmupRound, setWarmupRound] = useState(false);
  const [warmupLength, setWarmupLength] = useState(60);
  const [tenSecondWarning, setTenSecondWarning] = useState(true);
  const [addPunchesBeforeDefense, setAddPunchesBeforeDefense] = useState(false);

  const toggleSource = (src: "beginner" | "intermediate" | "advanced") => {
    setComboSources((prev) =>
      prev.includes(src)
        ? prev.filter((s) => s !== src)
        : [...prev, src]
    );
  };

  // Session summary
  const totalMinutes = useMemo(() => {
    const roundsTotal = numRounds * roundLength;
    const restTotal = (numRounds - 1) * restLength;
    const warmupTotal = warmupRound ? warmupLength : 0;
    return Math.ceil((roundsTotal + restTotal + warmupTotal) / 60);
  }, [numRounds, roundLength, restLength, warmupRound, warmupLength]);

  const handleStart = () => {
    mediumTap();
    // Config is stored and used by the session screen
    // For now, navigate to the session
    goToComboSession();
  };

  const showComboSources = drillMode === "combo";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="CONFIG" title="Session Config" />

        {/* Drill Mode */}
        <View style={styles.section}>
          <SectionHeader title="DRILL MODE" />
          <PillRow
            options={DRILL_MODES}
            selected={drillMode}
            onSelect={setDrillMode}
          />
        </View>

        {/* Combo Sources — only for COMBOS mode */}
        {showComboSources && (
          <View style={styles.section}>
            <SectionHeader title="COMBO SOURCE" />
            <PillRow
              options={SOURCE_OPTIONS}
              selected={comboSources}
              onSelect={toggleSource}
              multi
            />
            <View style={styles.extraToggles}>
              <ToggleRow
                label="Include Favorites"
                value={includeFavorites}
                onChange={setIncludeFavorites}
              />
              {drillQueueLength > 0 && (
                <ToggleRow
                  label={`Use Drill Queue (${drillQueueLength})`}
                  value={useDrillQueue}
                  onChange={setUseDrillQueue}
                />
              )}
            </View>
          </View>
        )}

        {/* Defense mode: add punches toggle */}
        {drillMode === "defense" && (
          <View style={styles.section}>
            <SectionHeader title="DEFENSE OPTIONS" />
            <ToggleRow
              label="Add punches before defense"
              value={addPunchesBeforeDefense}
              onChange={setAddPunchesBeforeDefense}
            />
            <Text style={styles.hint}>
              Adds 1-2 random punches before each defense call
            </Text>
          </View>
        )}

        {/* Rounds */}
        <View style={styles.section}>
          <SectionHeader title="ROUNDS" />
          <Stepper
            value={numRounds}
            min={1}
            max={15}
            step={1}
            formatLabel={(v) => `${v} Round${v !== 1 ? "s" : ""}`}
            onChange={setNumRounds}
          />
        </View>

        {/* Round Length */}
        <View style={styles.section}>
          <SectionHeader title="ROUND LENGTH" />
          <Stepper
            value={roundLength}
            min={60}
            max={300}
            step={30}
            formatLabel={(v) => `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`}
            onChange={setRoundLength}
          />
        </View>

        {/* Rest Length */}
        <View style={styles.section}>
          <SectionHeader title="REST LENGTH" />
          <Stepper
            value={restLength}
            min={30}
            max={120}
            step={15}
            formatLabel={(v) => `${v}s`}
            onChange={setRestLength}
          />
        </View>

        {/* Tempo */}
        <View style={styles.section}>
          <SectionHeader title="TEMPO" />
          <PillRow options={TEMPO_OPTIONS} selected={tempo} onSelect={setTempo} />
        </View>

        {/* Callout Style */}
        <View style={styles.section}>
          <SectionHeader title="CALLOUT STYLE" />
          <PillRow
            options={CALLOUT_OPTIONS}
            selected={calloutStyle}
            onSelect={setCalloutStyle}
          />
        </View>

        {/* Options */}
        <View style={styles.section}>
          <SectionHeader title="OPTIONS" />
          <ToggleRow label="Warmup Round" value={warmupRound} onChange={setWarmupRound} />
          {warmupRound && (
            <Stepper
              value={warmupLength}
              min={30}
              max={180}
              step={15}
              formatLabel={(v) => `${v}s warmup`}
              onChange={setWarmupLength}
            />
          )}
          <ToggleRow
            label="10-Second Warning"
            value={tenSecondWarning}
            onChange={setTenSecondWarning}
          />
          <View style={styles.stanceOverride}>
            <Text style={styles.stanceLabel}>Stance Override</Text>
            <PillRow
              options={[
                { value: "orthodox" as const, label: "Orthodox" },
                { value: "southpaw" as const, label: "Southpaw" },
                { value: "switch" as const, label: "Switch" },
              ]}
              selected={stance}
              onSelect={setStance}
            />
          </View>
        </View>

        {/* Session Summary */}
        <Panel tone="subtle" style={styles.summary}>
          <Text style={styles.summaryText}>
            {numRounds} rounds × {Math.floor(roundLength / 60)} min = {totalMinutes} min
          </Text>
        </Panel>

        {/* Start button */}
        <Pressable onPress={handleStart} style={styles.startBtn}>
          <Text style={styles.startText}>START SESSION</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 100 },
  section: { marginBottom: spacing["2xl"] },
  extraToggles: { marginTop: spacing.md },
  hint: {
    ...fonts.small,
    color: colors.textMuted,
    fontStyle: "italic",
    marginTop: spacing.xs,
  },
  stanceOverride: { marginTop: spacing.md },
  stanceLabel: {
    ...fonts.small,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  summary: {
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 0.5,
  },
  startBtn: {
    backgroundColor: colors.accent,
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  startText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 2,
  },
});
