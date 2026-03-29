import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useOnboardingStore } from "../src/stores/useOnboardingStore";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const loadOnboarding = useOnboardingStore((s) => s.loadFromMMKV);
  const completed = useOnboardingStore((s) => s.completed);

  useEffect(() => {
    loadOnboarding();
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
