import * as Speech from "expo-speech";
import {
  isPunchCode,
  isDefenseCode,
  isFootworkCode,
  getPunchName,
} from "./combo-utils";
import type { Combo, ComboElement } from "../types";

// ── Pluggable audio source interface ─────────────────────────────────────────

export type CalloutAudioSource = {
  speak: (text: string, rate?: number, pitch?: number) => void;
  stop: () => void;
  isSpeaking: () => Promise<boolean>;
};

// ── Number word mapping for TTS clarity ──────────────────────────────────────

const NUMBER_WORDS: Record<string, string> = {
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "1b": "one body",
  "2b": "two body",
  "3b": "three body",
  "4b": "four body",
};

// ── Callout text generation ──────────────────────────────────────────────────

export function getCalloutText(
  combo: Combo,
  style: "numbers" | "names" | "both",
  stance: "orthodox" | "southpaw" | "switch"
): string {
  return combo.sequence
    .map((el) => getElementCalloutText(el, style, stance))
    .join(", ");
}

export function getElementCalloutText(
  element: ComboElement,
  style: "numbers" | "names" | "both",
  stance: "orthodox" | "southpaw" | "switch"
): string {
  if (isPunchCode(element)) {
    if (style === "numbers") return NUMBER_WORDS[element] ?? element;
    if (style === "names") return getPunchName(element, stance === "switch" ? "orthodox" : stance);
    // "both"
    return `${NUMBER_WORDS[element] ?? element}, ${getPunchName(element, stance === "switch" ? "orthodox" : stance)}`;
  }
  if (isDefenseCode(element)) return getPunchName(element);
  if (isFootworkCode(element)) return getPunchName(element);
  return String(element);
}

// ── TTS Callout Source (expo-speech) ─────────────────────────────────────────

class TTSCalloutSource implements CalloutAudioSource {
  private rate = 1.0;
  private pitch = 1.0;

  setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  setPitch(pitch: number) {
    this.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  speak(text: string, rate?: number, pitch?: number) {
    Speech.speak(text, {
      rate: rate ?? this.rate,
      pitch: pitch ?? this.pitch,
      language: "en-US",
    });
  }

  stop() {
    Speech.stop();
  }

  async isSpeaking(): Promise<boolean> {
    return Speech.isSpeakingAsync();
  }
}

// ── Singleton export ─────────────────────────────────────────────────────────

export const calloutEngine: CalloutAudioSource = new TTSCalloutSource();

export function setTTSRate(rate: number) {
  (calloutEngine as TTSCalloutSource).setRate(rate);
}

export function setTTSPitch(pitch: number) {
  (calloutEngine as TTSCalloutSource).setPitch(pitch);
}
