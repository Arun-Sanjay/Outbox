import React, { useState, useCallback } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, spacing, radius, TOUCH_MIN } from "../../src/theme";
import { Panel } from "../../src/components";
import { useProgramStore } from "../../src/stores/useProgramStore";
import { useProfileStore } from "../../src/stores/useProfileStore";
import { lightTap, mediumTap, successNotification } from "../../src/lib/haptics";
import { goToBrowsePrograms, goBack } from "../../src/lib/navigation";
import type { BoxerType } from "../../src/types";

type QuizQuestion = {
  id: number;
  question: string;
  options: { label: string; value: string; description: string }[];
};

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your fitness background?",
    options: [
      { label: "Brand New", value: "none", description: "No combat sports or regular exercise" },
      { label: "Gym Goer", value: "gym", description: "Regular gym/weights but no boxing" },
      { label: "Cardio Background", value: "cardio", description: "Running, cycling, or other cardio" },
      { label: "Returning Boxer", value: "returning", description: "Boxed before, getting back into it" },
    ],
  },
  {
    id: 2,
    question: "How quickly do you gas out?",
    options: [
      { label: "Very Quickly", value: "fast", description: "Can barely last 2 minutes of intense work" },
      { label: "After a Few Rounds", value: "moderate", description: "Good for 3-4 rounds then fade" },
      { label: "Pretty Good", value: "good", description: "Can handle 6+ rounds comfortably" },
      { label: "Iron Lungs", value: "excellent", description: "Conditioning is my strength" },
    ],
  },
  {
    id: 3,
    question: "How would you rate your punching power?",
    options: [
      { label: "Pillow Fists", value: "weak", description: "Need to develop power from scratch" },
      { label: "Decent Pop", value: "moderate", description: "Some natural power, room to grow" },
      { label: "Heavy Hands", value: "strong", description: "Power is one of my best attributes" },
      { label: "Not Sure", value: "unknown", description: "Haven't tested it yet" },
    ],
  },
  {
    id: 4,
    question: "How's your overall mobility and flexibility?",
    options: [
      { label: "Very Stiff", value: "poor", description: "Limited range of motion" },
      { label: "Average", value: "average", description: "Can move but nothing special" },
      { label: "Pretty Flexible", value: "good", description: "Good range, comfortable moving" },
      { label: "Very Mobile", value: "excellent", description: "Yoga/mobility is part of my routine" },
    ],
  },
  {
    id: 5,
    question: "What are you training for?",
    options: [
      { label: "General Fitness", value: "fitness", description: "Get in shape with boxing" },
      { label: "Amateur Competition", value: "amateur", description: "Want to compete at amateur level" },
      { label: "Upcoming Fight", value: "fight", description: "Have a fight date scheduled" },
      { label: "Skill Development", value: "skill", description: "Improve technique and ability" },
    ],
  },
];

function determineBoxerType(answers: string[]): BoxerType {
  const [bg, cardio, power, flex, goal] = answers;

  if (bg === "none") return "complete_beginner";
  if (bg === "gym") return "gym_background";
  if (bg === "cardio") return "cardio_background";
  if (bg === "returning") return "returning_boxer";
  if (goal === "fight") return "competition_prep";
  if (goal === "amateur") return "competition_prep";
  if (cardio === "good" || cardio === "excellent") return "intermediate_boxer";
  return "gym_background";
}

const BOXER_TYPE_LABELS: Record<BoxerType, string> = {
  complete_beginner: "Complete Beginner",
  gym_background: "Gym Background",
  cardio_background: "Cardio Background",
  returning_boxer: "Returning Boxer",
  intermediate_boxer: "Intermediate Boxer",
  competition_prep: "Competition Prep",
};

export default function BoxerQuizScreen() {
  const setBoxerType = useProgramStore((s) => s.setBoxerType);
  const setQuizCompleted = useProgramStore((s) => s.setQuizCompleted);
  const profileSetBoxerType = useProfileStore((s) => s.setBoxerType);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<BoxerType | null>(null);

  const handleSelect = useCallback((value: string) => {
    lightTap();
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Quiz complete
      const type = determineBoxerType(newAnswers);
      setResult(type);
      setBoxerType(type);
      setQuizCompleted(true);
      profileSetBoxerType(type);
      successNotification();
    }
  }, [currentQ, answers, setBoxerType, setQuizCompleted, profileSetBoxerType]);

  // Result screen
  if (result) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultKicker}>YOUR BOXER PROFILE</Text>
          <Text style={styles.resultType}>{BOXER_TYPE_LABELS[result]}</Text>
          <Text style={styles.resultDesc}>
            We've identified programs tailored to your level and goals.
          </Text>

          <Pressable
            onPress={() => { mediumTap(); goToBrowsePrograms(); }}
            style={styles.browseBtn}
          >
            <Text style={styles.browseBtnText}>VIEW ALL PROGRAMS</Text>
          </Pressable>

          <Pressable onPress={goBack} style={styles.skipBtn}>
            <Text style={styles.skipText}>BACK</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Quiz questions
  const question = QUESTIONS[currentQ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* Progress dots */}
        <View style={styles.dotsRow}>
          {QUESTIONS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i <= currentQ && styles.dotActive]}
            />
          ))}
        </View>

        <Text style={styles.questionKicker}>QUESTION {currentQ + 1} OF {QUESTIONS.length}</Text>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((opt) => (
            <Panel
              key={opt.value}
              tone="subtle"
              onPress={() => handleSelect(opt.value)}
              style={styles.optionPanel}
            >
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionDesc}>{opt.description}</Text>
            </Panel>
          ))}
        </View>

        {currentQ > 0 && (
          <Pressable
            onPress={() => { lightTap(); setCurrentQ(currentQ - 1); setAnswers(answers.slice(0, -1)); }}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>BACK</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.xl, paddingTop: 60 },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: spacing.sm, marginBottom: spacing["3xl"] },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.1)" },
  dotActive: { backgroundColor: colors.accent },
  questionKicker: { fontSize: 10, fontWeight: "700", color: colors.accent, letterSpacing: 3, marginBottom: spacing.md },
  questionText: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: spacing["3xl"], lineHeight: 30 },
  optionsContainer: { gap: spacing.md },
  optionPanel: { padding: spacing.lg },
  optionLabel: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 4 },
  optionDesc: { fontSize: 13, color: colors.textSecondary },
  backBtn: { alignSelf: "center", paddingVertical: spacing.lg, marginTop: spacing["2xl"] },
  backText: { fontSize: 13, fontWeight: "700", color: colors.textMuted, letterSpacing: 2 },
  resultContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl, gap: spacing["2xl"] },
  resultKicker: { fontSize: 10, fontWeight: "700", color: colors.accent, letterSpacing: 3 },
  resultType: { fontSize: 28, fontWeight: "800", color: colors.text, textAlign: "center" },
  resultDesc: { ...fonts.body, color: colors.textSecondary, textAlign: "center" },
  browseBtn: {
    backgroundColor: colors.accent, height: 56, paddingHorizontal: spacing["4xl"],
    borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.xl,
  },
  browseBtnText: { fontSize: 16, fontWeight: "800", color: "#000000", letterSpacing: 2 },
  skipBtn: { paddingVertical: spacing.lg, marginTop: spacing.md },
  skipText: { fontSize: 13, fontWeight: "700", color: colors.textMuted, letterSpacing: 2 },
});
