import { AccessibilityInfo } from "react-native";
import { useEffect, useState } from "react";

/**
 * Hook to check if the user has enabled reduced motion.
 * When true, skip or shorten animations.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced
    );
    return () => sub.remove();
  }, []);

  return reduced;
}

/**
 * Returns animation duration respecting reduceMotion.
 * If reduced, returns 0 (instant). Otherwise returns the given duration.
 */
export function getAnimDuration(ms: number, reduced: boolean): number {
  return reduced ? 0 : ms;
}
