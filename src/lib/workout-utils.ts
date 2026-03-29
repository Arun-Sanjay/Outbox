import type { SessionType, Intensity } from "../types";
import { colors } from "../theme";

/**
 * Format seconds into short duration string.
 * Examples: 65 → "1:05", 3661 → "1:01:01", 0 → "0:00"
 */
export function formatDurationShort(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const s = Math.floor(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${minutes}:${pad(seconds)}`;
}

/**
 * Format round count. Examples: 3 → "3 Rounds", 1 → "1 Round", null → "--"
 */
export function formatRounds(rounds: number | null): string {
  if (rounds === null || rounds === undefined) return "--";
  if (rounds === 1) return "1 Round";
  return `${rounds} Rounds`;
}

// ── Session Type helpers ─────────────────────────────────────────────────────

const SESSION_LABELS: Record<SessionType, string> = {
  heavy_bag: "Heavy Bag",
  speed_bag: "Speed Bag",
  double_end_bag: "Double End Bag",
  shadow_boxing: "Shadow Boxing",
  mitt_work: "Mitt Work",
  sparring: "Sparring",
  conditioning: "Conditioning",
  strength: "Strength",
  roadwork: "Roadwork",
};

const SESSION_ICONS: Record<SessionType, string> = {
  heavy_bag: "boxing-glove",
  speed_bag: "speedometer",
  double_end_bag: "target",
  shadow_boxing: "account-outline",
  mitt_work: "hand-pointing-right",
  sparring: "sword-cross",
  conditioning: "heart-pulse",
  strength: "dumbbell",
  roadwork: "run",
};

const SESSION_COLORS: Record<SessionType, string> = {
  heavy_bag: colors.sessionHeavyBag,
  speed_bag: colors.sessionSpeedBag,
  double_end_bag: colors.sessionDoubleEnd,
  shadow_boxing: colors.sessionShadow,
  mitt_work: colors.sessionMitts,
  sparring: colors.sessionSparring,
  conditioning: colors.sessionConditioning,
  strength: colors.sessionStrength,
  roadwork: colors.sessionRoadwork,
};

export function getSessionTypeLabel(type: SessionType): string {
  return SESSION_LABELS[type] ?? type;
}

export function getSessionTypeIcon(type: SessionType): string {
  return SESSION_ICONS[type] ?? "help-circle";
}

export function getSessionTypeColor(type: SessionType): string {
  return SESSION_COLORS[type] ?? colors.textMuted;
}

// ── Intensity helpers ────────────────────────────────────────────────────────

const INTENSITY_LABELS: Record<Intensity, string> = {
  light: "Light",
  moderate: "Moderate",
  hard: "Hard",
  war: "War",
};

const INTENSITY_COLORS: Record<Intensity, string> = {
  light: colors.intensityLight,
  moderate: colors.intensityModerate,
  hard: colors.intensityHard,
  war: colors.intensityWar,
};

export function getIntensityLabel(intensity: Intensity): string {
  return INTENSITY_LABELS[intensity] ?? intensity;
}

export function getIntensityColor(intensity: Intensity): string {
  return INTENSITY_COLORS[intensity] ?? colors.textMuted;
}
