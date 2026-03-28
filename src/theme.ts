import { Platform } from "react-native";

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────

export const colors = {
  // Backgrounds — pure black base
  bg: "#000000",
  surface: "rgba(0, 0, 0, 0.97)",
  surfaceHero: "rgba(0, 0, 0, 0.985)",
  surfaceLight: "rgba(0, 0, 0, 0.95)",
  surfaceBorder: "rgba(255, 255, 255, 0.12)",
  surfaceBorderStrong: "rgba(255, 255, 255, 0.24)",

  // Primary — clean white
  primary: "rgba(247, 250, 255, 0.96)",
  primaryDim: "rgba(255, 255, 255, 0.08)",
  primaryGlow: "rgba(188, 202, 247, 0.14)",
  primaryMuted: "rgba(255, 255, 255, 0.50)",

  // Status — OUTBOX OVERRIDES: gold replaces green accent
  success: "#FBBF24",
  successDim: "rgba(251, 191, 36, 0.15)",
  warning: "#FBBF24",
  warningDim: "rgba(251, 191, 36, 0.15)",
  danger: "#f87171",
  dangerDim: "rgba(248, 113, 113, 0.15)",

  // Text hierarchy
  text: "rgba(245, 248, 255, 0.92)",
  textSecondary: "rgba(210, 216, 230, 0.62)",
  textMuted: "rgba(210, 220, 242, 0.52)",

  // Panel chrome
  panelBorder: "rgba(255, 255, 255, 0.12)",
  panelBorderHover: "rgba(255, 255, 255, 0.26)",
  panelHighlight: "rgba(255, 255, 255, 0.10)",
  panelInnerBorder: "rgba(255, 255, 255, 0.04)",
  glowLine: "rgba(242, 247, 255, 0.5)",
  glowSoft: "rgba(188, 202, 247, 0.14)",

  // Inputs
  inputBg: "rgba(255, 255, 255, 0.04)",
  inputBorder: "rgba(255, 255, 255, 0.10)",
  inputFocusBorder: "rgba(255, 255, 255, 0.30)",

  // Tab bar
  tabBar: "#080809",
  tabBarBorder: "rgba(255, 255, 255, 0.06)",

  // Accent — OUTBOX OVERRIDE: championship gold
  accent: "#FBBF24",
  accentDim: "rgba(251, 191, 36, 0.15)",

  // ── Boxing-specific contextual colors ──

  // Round states
  roundActive: "#FBBF24",
  roundRest: "rgba(96, 165, 250, 0.8)",
  roundWarning: "#f87171",

  // Fight result colors
  win: "#34d399",
  loss: "#f87171",
  draw: "#94a3b8",

  // Intensity colors
  intensityLight: "#34d399",
  intensityModerate: "#FBBF24",
  intensityHard: "#fb923c",
  intensityWar: "#f87171",

  // Session type colors
  sessionHeavyBag: "#f87171",
  sessionSpeedBag: "#60a5fa",
  sessionDoubleEnd: "#a78bfa",
  sessionShadow: "#94a3b8",
  sessionMitts: "#fb923c",
  sessionSparring: "#f87171",
  sessionConditioning: "#34d399",
  sessionStrength: "#e879f9",
  sessionRoadwork: "#22d3ee",
} as const;

// ─────────────────────────────────────────────
// RANK COLORS
// ─────────────────────────────────────────────

export const rankColors = {
  rookie: "rgba(255,255,255,0.6)",
  prospect: "#34d399",
  contender: "#60a5fa",
  challenger: "#a78bfa",
  champion: "#FBBF24",
  undisputed: "#FBBF24",
} as const;

// ─────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
} as const;

// ─────────────────────────────────────────────
// RADIUS
// ─────────────────────────────────────────────

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 999,
} as const;

// ─────────────────────────────────────────────
// TOUCH TARGET MINIMUM
// ─────────────────────────────────────────────

export const TOUCH_MIN = 48;

// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────

const monoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

export const fonts = {
  hero: {
    fontSize: 48,
    fontWeight: "800" as const,
    letterSpacing: 2,
    color: colors.text,
    textTransform: "uppercase" as const,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: 1,
    color: colors.text,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
    color: colors.text,
  },
  kicker: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 3,
  },
  caption: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: colors.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
  },
  small: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: colors.textSecondary,
  },
  mono: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: monoFont,
    color: colors.text,
  },
  monoLarge: {
    fontSize: 48,
    fontWeight: "300" as const,
    fontFamily: monoFont,
    color: colors.text,
    fontVariant: ["tabular-nums"] as const,
  },
  monoValue: {
    fontSize: 24,
    fontWeight: "800" as const,
    fontFamily: monoFont,
    color: colors.text,
  },
} as const;

// ─────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────

export const shadows = {
  panel: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.66,
    shadowRadius: 27,
    elevation: 8,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 4,
  },
  glow: {
    shadowColor: "rgba(188,202,247,1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
  ring: {
    shadowColor: "rgba(188,202,247,1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  panelGlow: {
    shadowColor: "rgba(188,202,247,1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 6,
  },
} as const;
