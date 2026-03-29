import { Audio } from "expo-av";

// ── Volume state ─────────────────────────────────────────────────────────────

let masterVolume = 1.0;
let bellVolume = 1.0;
let calloutVolume = 1.0;

export function setMasterVolume(v: number) {
  masterVolume = Math.max(0, Math.min(1, v));
}
export function setBellVolume(v: number) {
  bellVolume = Math.max(0, Math.min(1, v));
}
export function setCalloutVolume(v: number) {
  calloutVolume = Math.max(0, Math.min(1, v));
}

function getEffectiveVolume(channel: "bell" | "callout"): number {
  const channelVol = channel === "bell" ? bellVolume : calloutVolume;
  return masterVolume * channelVol;
}

// ── Tone generation (simple beeps via expo-av) ───────────────────────────────
// Since we can't bundle audio files without assets, we use a minimal approach:
// preload sounds from Audio.Sound or generate simple notification tones.

let bellSound: Audio.Sound | null = null;
let beepSound: Audio.Sound | null = null;
let warningSound: Audio.Sound | null = null;

export async function initAudio() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  } catch {
    // Audio init may fail in dev/simulator
  }
}

// ── Sound playback ───────────────────────────────────────────────────────────
// In production these would load actual audio files.
// For now we use placeholder functions that the HUD calls.

export async function playBell() {
  try {
    if (bellSound) {
      await bellSound.setVolumeAsync(getEffectiveVolume("bell"));
      await bellSound.replayAsync();
    }
  } catch {
    // Silently fail if audio unavailable
  }
}

export async function playWarning() {
  try {
    if (warningSound) {
      await warningSound.setVolumeAsync(getEffectiveVolume("bell"));
      await warningSound.replayAsync();
    }
  } catch {
    // Silently fail
  }
}

export async function playBeep() {
  try {
    if (beepSound) {
      await beepSound.setVolumeAsync(getEffectiveVolume("bell"));
      await beepSound.replayAsync();
    }
  } catch {
    // Silently fail
  }
}

export async function playCountdownBeep() {
  await playBeep();
}

export async function playRoundStartBell() {
  await playBell();
}

export async function playRoundEndBell() {
  await playBell();
}

export async function playTenSecondWarning() {
  await playWarning();
}

export async function playFinalBell() {
  // Double bell for final round
  await playBell();
}

// ── Cleanup ──────────────────────────────────────────────────────────────────

export async function unloadSounds() {
  try {
    if (bellSound) { await bellSound.unloadAsync(); bellSound = null; }
    if (beepSound) { await beepSound.unloadAsync(); beepSound = null; }
    if (warningSound) { await warningSound.unloadAsync(); warningSound = null; }
  } catch {
    // Silently fail
  }
}
