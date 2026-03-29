// ALWAYS use local timezone, NEVER UTC
// NEVER use d.toISOString().slice(0,10) — produces wrong dates east of UTC

/**
 * Converts a Date to "YYYY-MM-DD" string in local timezone.
 */
export function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Returns today's date key in local timezone.
 */
export function getTodayKey(): string {
  return toLocalDateKey(new Date());
}

/**
 * Adds (or subtracts) days from a dateKey string.
 * Appends T00:00:00 to force local timezone parsing.
 */
export function addDays(dateKey: string, days: number): string {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toLocalDateKey(d);
}

/**
 * Returns the number of full days between today and a target dateKey.
 * Positive = target is in the future. Negative = target is in the past.
 */
export function daysUntil(dateKey: string): number {
  const today = new Date(getTodayKey() + "T00:00:00");
  const target = new Date(dateKey + "T00:00:00");
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns the number of full weeks between today and a target dateKey.
 * Positive = target is in the future. Negative = target is in the past.
 */
export function weeksUntil(dateKey: string): number {
  const days = daysUntil(dateKey);
  return Math.floor(days / 7);
}

/**
 * Returns the ISO week number (1-53) for a given dateKey.
 * Uses the ISO 8601 algorithm: week 1 contains the first Thursday of the year.
 */
export function getWeekNumber(dateKey: string): number {
  const d = new Date(dateKey + "T00:00:00");
  // Set to nearest Thursday: current date + 4 - current day number (Monday=1, Sunday=7)
  const dayOfWeek = d.getDay() || 7; // Convert Sunday from 0 to 7
  d.setDate(d.getDate() + 4 - dayOfWeek);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24) + 1) / 7
  );
  return weekNumber;
}
