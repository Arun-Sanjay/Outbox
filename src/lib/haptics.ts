import * as Haptics from "expo-haptics";

/** Subtle tap — button press, navigation */
export function lightTap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** Medium impact — toggle, action confirmation */
export function mediumTap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/** Heavy impact — round bell, punch landed */
export function heavyTap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

/** Picker / selection change */
export function selectionTap() {
  Haptics.selectionAsync();
}

/** Success — save, complete, achievement unlocked */
export function successNotification() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/** Warning — delete confirmation, danger action */
export function warningNotification() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

/** Error — failed action */
export function errorNotification() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
