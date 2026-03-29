import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "../app");

function makePlaceholder(filePath, title, kicker) {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const content = `import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "${getThemeImport(filePath)}";
import { PageHeader } from "${getComponentImport(filePath)}";

export default function ${toPascal(title)}Screen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <PageHeader kicker="${kicker}" title="${title}" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.xl },
});
`;
  writeFileSync(filePath, content);
  console.log(`Created: ${filePath.replace(appDir, "app")}`);
}

function makeLayout(filePath) {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const content = `import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000000" },
        animation: "slide_from_right",
      }}
    />
  );
}
`;
  writeFileSync(filePath, content);
  console.log(`Created layout: ${filePath.replace(appDir, "app")}`);
}

function getThemeImport(filePath) {
  const rel = path.relative(path.dirname(filePath), path.join(appDir, "../src/theme"));
  return rel.replace(/\\/g, "/");
}

function getComponentImport(filePath) {
  const rel = path.relative(path.dirname(filePath), path.join(appDir, "../src/components"));
  return rel.replace(/\\/g, "/");
}

function toPascal(str) {
  return str.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

// ── TRAINING ROUTES ──
makeLayout(path.join(appDir, "training/_layout.tsx"));
makePlaceholder(path.join(appDir, "training/combo-session.tsx"), "Combo Session", "TRAIN");
makePlaceholder(path.join(appDir, "training/round-timer.tsx"), "Round Timer", "TIMER");
makePlaceholder(path.join(appDir, "training/skip-rope.tsx"), "Skip Rope", "CARDIO");
makePlaceholder(path.join(appDir, "training/roadwork.tsx"), "Roadwork", "CARDIO");
makePlaceholder(path.join(appDir, "training/session-summary.tsx"), "Session Summary", "COMPLETE");
makePlaceholder(path.join(appDir, "training/log-session.tsx"), "Log Session", "LOG");

// ── COMBO ROUTES ──
makeLayout(path.join(appDir, "combo/_layout.tsx"));
makePlaceholder(path.join(appDir, "combo/library.tsx"), "Combo Library", "COMBOS");
makePlaceholder(path.join(appDir, "combo/builder.tsx"), "Combo Builder", "BUILD");
makePlaceholder(path.join(appDir, "combo/[id].tsx"), "Combo Detail", "COMBO");
makePlaceholder(path.join(appDir, "combo/drill-queue.tsx"), "Drill Queue", "QUEUE");
makePlaceholder(path.join(appDir, "combo/config.tsx"), "Session Config", "CONFIG");

// ── FIGHT ROUTES ──
makeLayout(path.join(appDir, "fight/_layout.tsx"));
makePlaceholder(path.join(appDir, "fight/log-fight.tsx"), "Log Fight", "FIGHT");
makePlaceholder(path.join(appDir, "fight/[id].tsx"), "Fight Detail", "FIGHT");
makePlaceholder(path.join(appDir, "fight/record.tsx"), "Fight Record", "RECORD");
makePlaceholder(path.join(appDir, "fight/sparring/log.tsx"), "Log Sparring", "SPARRING");
makePlaceholder(path.join(appDir, "fight/sparring/partner-history.tsx"), "Partner History", "SPARRING");

// ── CAMP ROUTES ──
makeLayout(path.join(appDir, "camp/_layout.tsx"));
makePlaceholder(path.join(appDir, "camp/setup.tsx"), "Camp Setup", "CAMP");
makePlaceholder(path.join(appDir, "camp/dashboard.tsx"), "Camp Dashboard", "CAMP");
makePlaceholder(path.join(appDir, "camp/weight-cut.tsx"), "Weight Cut", "WEIGHT");

// ── PROGRAMS ROUTES ──
makeLayout(path.join(appDir, "programs/_layout.tsx"));
makePlaceholder(path.join(appDir, "programs/quiz.tsx"), "Boxer Quiz", "QUIZ");
makePlaceholder(path.join(appDir, "programs/browse.tsx"), "Browse Programs", "PROGRAMS");
makePlaceholder(path.join(appDir, "programs/[id].tsx"), "Program Detail", "PROGRAM");

// ── KNOWLEDGE ROUTES ──
makeLayout(path.join(appDir, "knowledge/_layout.tsx"));
makePlaceholder(path.join(appDir, "knowledge/glossary.tsx"), "Glossary", "LEARN");
makePlaceholder(path.join(appDir, "knowledge/technique.tsx"), "Technique Reference", "LEARN");
makePlaceholder(path.join(appDir, "knowledge/tip-of-day.tsx"), "Tip of the Day", "DAILY");

// ── BENCHMARKS ROUTES ──
makeLayout(path.join(appDir, "benchmarks/_layout.tsx"));
makePlaceholder(path.join(appDir, "benchmarks/index.tsx"), "Benchmarks", "TEST");
makePlaceholder(path.join(appDir, "benchmarks/log.tsx"), "Log Benchmark", "BENCHMARK");
makePlaceholder(path.join(appDir, "benchmarks/[id].tsx"), "Benchmark Detail", "BENCHMARK");

// ── SETTINGS ROUTES ──
makeLayout(path.join(appDir, "settings/_layout.tsx"));
makePlaceholder(path.join(appDir, "settings/index.tsx"), "Settings", "SETTINGS");
makePlaceholder(path.join(appDir, "settings/profile-edit.tsx"), "Edit Profile", "PROFILE");

console.log("\nAll placeholder screens created!");
