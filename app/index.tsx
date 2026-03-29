import { Redirect } from "expo-router";
import { useOnboardingStore } from "../src/stores/useOnboardingStore";

export default function Index() {
  const completed = useOnboardingStore((s) => s.completed);

  if (!completed) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
