import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useOnboardingStore } from "../src/stores/useOnboardingStore";
import { useComboStore } from "../src/stores/useComboStore";
import { useSessionStore } from "../src/stores/useSessionStore";
import { useFightStore } from "../src/stores/useFightStore";
import { useProfileStore } from "../src/stores/useProfileStore";
import { useWeightStore } from "../src/stores/useWeightStore";
import { useTimerStore } from "../src/stores/useTimerStore";
import { useProgramStore } from "../src/stores/useProgramStore";
import { useBenchmarkStore } from "../src/stores/useBenchmarkStore";
import { useCampStore } from "../src/stores/useCampStore";
import { useKnowledgeStore } from "../src/stores/useKnowledgeStore";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const loadOnboarding = useOnboardingStore((s) => s.loadFromMMKV);
  const completed = useOnboardingStore((s) => s.completed);

  useEffect(() => {
    // Load ALL stores from MMKV on app startup
    loadOnboarding();
    useComboStore.getState().loadFromMMKV();
    useSessionStore.getState().loadFromMMKV();
    useFightStore.getState().loadFromMMKV();
    useProfileStore.getState().loadFromMMKV();
    useWeightStore.getState().loadFromMMKV();
    useTimerStore.getState().loadFromMMKV();
    useProgramStore.getState().loadFromMMKV();
    useBenchmarkStore.getState().loadFromMMKV();
    useCampStore.getState().loadFromMMKV();
    useKnowledgeStore.getState().loadFromMMKV();
    setReady(true);
  }, [loadOnboarding]);

  useEffect(() => {
    if (!ready) return;
    if (!completed) {
      router.replace("/onboarding");
    }
  }, [ready, completed]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000000" },
          animation: "fade",
        }}
      />
    </GestureHandlerRootView>
  );
}
