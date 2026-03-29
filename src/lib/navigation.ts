import { router } from "expo-router";

// ── Tab routes ───────────────────────────────────────────────────────────────

export function goToHQ() {
  router.push("/(tabs)");
}

export function goToTrain() {
  router.push("/(tabs)/train");
}

export function goToLog() {
  router.push("/(tabs)/log");
}

export function goToStats() {
  router.push("/(tabs)/stats");
}

export function goToProfile() {
  router.push("/(tabs)/profile");
}

// ── Training routes ──────────────────────────────────────────────────────────

export function goToComboSession() {
  router.push("/training/combo-session");
}

export function goToRoundTimer() {
  router.push("/training/round-timer");
}

export function goToSkipRope() {
  router.push("/training/skip-rope");
}

export function goToRoadwork() {
  router.push("/training/roadwork");
}

export function goToSessionSummary() {
  router.push("/training/session-summary");
}

export function goToLogSession() {
  router.push("/training/log-session");
}

// ── Combo routes ─────────────────────────────────────────────────────────────

export function goToComboLibrary() {
  router.push("/combo/library");
}

export function goToComboBuilder() {
  router.push("/combo/builder");
}

export function goToComboDetail(id: string) {
  router.push(`/combo/${id}`);
}

export function goToDrillQueue() {
  router.push("/combo/drill-queue");
}

export function goToComboConfig() {
  router.push("/combo/config");
}

// ── Fight routes ─────────────────────────────────────────────────────────────

export function goToLogFight() {
  router.push("/fight/log-fight");
}

export function goToFightDetail(id: number) {
  router.push(`/fight/${id}`);
}

export function goToFightRecord() {
  router.push("/fight/record");
}

export function goToLogSparring() {
  router.push("/fight/sparring/log");
}

export function goToPartnerHistory() {
  router.push("/fight/sparring/partner-history");
}

// ── Camp routes ──────────────────────────────────────────────────────────────

export function goToCampSetup() {
  router.push("/camp/setup");
}

export function goToCampDashboard() {
  router.push("/camp/dashboard");
}

export function goToWeightCut() {
  router.push("/camp/weight-cut");
}

// ── Program routes ───────────────────────────────────────────────────────────

export function goToBoxerQuiz() {
  router.push("/programs/quiz");
}

export function goToBrowsePrograms() {
  router.push("/programs/browse");
}

export function goToProgramDetail(id: string) {
  router.push(`/programs/${id}`);
}

// ── Knowledge routes ─────────────────────────────────────────────────────────

export function goToGlossary() {
  router.push("/knowledge/glossary");
}

export function goToTechniqueReference() {
  router.push("/knowledge/technique");
}

export function goToTipOfDay() {
  router.push("/knowledge/tip-of-day");
}

// ── Benchmark routes ─────────────────────────────────────────────────────────

export function goToBenchmarks() {
  router.push("/benchmarks");
}

export function goToLogBenchmark() {
  router.push("/benchmarks/log");
}

export function goToBenchmarkDetail(id: number) {
  router.push(`/benchmarks/${id}`);
}

// ── Settings routes ──────────────────────────────────────────────────────────

export function goToSettings() {
  router.push("/settings");
}

export function goToProfileEdit() {
  router.push("/settings/profile-edit");
}

// ── General navigation ───────────────────────────────────────────────────────

export function goBack() {
  if (router.canGoBack()) {
    router.back();
  }
}

export function goToOnboarding() {
  router.replace("/onboarding");
}
