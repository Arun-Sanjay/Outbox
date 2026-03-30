import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// ── Permission ───────────────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

// ── Channel (Android) ────────────────────────────────────────────────────────

export async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("training", {
      name: "Training Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FBBF24",
    });
  }
}

// ── Schedule Training Reminder ───────────────────────────────────────────────

export async function scheduleTrainingReminder(
  timeString: string // "HH:mm" format
): Promise<string | null> {
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return null;

    // Cancel existing training reminders
    await cancelTrainingReminders();

    const [hours, minutes] = timeString.split(":").map(Number);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to Train",
        body: "Your boxing session is waiting. Let's get to work.",
        sound: true,
        ...(Platform.OS === "android" && { channelId: "training" }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });

    return id;
  } catch {
    return null;
  }
}

// ── Streak Warning (7 PM if no session today) ────────────────────────────────

export async function scheduleStreakWarning(): Promise<string | null> {
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return null;

    await cancelStreakWarnings();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't Break Your Streak!",
        body: "You haven't trained today. A quick session keeps your streak alive.",
        sound: true,
        ...(Platform.OS === "android" && { channelId: "training" }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 19,
        minute: 0,
      },
    });

    return id;
  } catch {
    return null;
  }
}

// ── Cancel ───────────────────────────────────────────────────────────────────

export async function cancelTrainingReminders() {
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of all) {
      if (n.content.title === "Time to Train") {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }
  } catch {
    // Silently fail
  }
}

export async function cancelStreakWarnings() {
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of all) {
      if (n.content.title?.includes("Streak")) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }
  } catch {
    // Silently fail
  }
}

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Silently fail
  }
}
