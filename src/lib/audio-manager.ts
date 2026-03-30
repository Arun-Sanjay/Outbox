import { Audio } from "expo-av";
import * as Speech from "expo-speech";

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

// ── Audio mode ───────────────────────────────────────────────────────────────

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

// ── TTS-based sound effects ──────────────────────────────────────────────────
// Uses expo-speech to generate audio cues without bundled sound files.
// In a future version, these can be swapped for real audio assets.

function speakCue(text: string, rate = 1.2, pitch = 0.8) {
  if (masterVolume === 0 || bellVolume === 0) return;
  Speech.speak(text, {
    rate,
    pitch,
    language: "en-US",
  });
}

// ── Bell sounds ──────────────────────────────────────────────────────────────

export async function playBell() {
  speakCue("Ding ding ding", 1.3, 1.2);
}

export async function playRoundStartBell() {
  speakCue("Ding ding", 1.3, 1.2);
}

export async function playRoundEndBell() {
  speakCue("Ding ding ding", 1.2, 1.0);
}

export async function playFinalBell() {
  speakCue("Ding ding ding ding", 1.1, 1.0);
}

// ── Warning sounds ───────────────────────────────────────────────────────────

export async function playTenSecondWarning() {
  speakCue("Ten seconds", 1.4, 0.9);
}

export async function playWarning() {
  speakCue("Warning", 1.3, 0.9);
}

// ── Countdown beeps ──────────────────────────────────────────────────────────

export async function playBeep() {
  speakCue("Beep", 1.5, 1.5);
}

export async function playCountdownBeep() {
  speakCue("Beep", 1.5, 1.5);
}

// ── Cleanup ──────────────────────────────────────────────────────────────────

export async function unloadSounds() {
  Speech.stop();
}
