// lib/terminal/history.ts
// Persistence helpers for command history (localStorage).
// Pure helpers + thin localStorage wrapper with sanitization.

const STORAGE_KEY = "tj_terminal_history";
const MAX_HISTORY_LENGTH = 100;

/**
 * Load persisted history from localStorage.
 * Returns an empty array if unavailable or malformed.
 * Most-recent entry is at index 0.
 */
export function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/**
 * Persist history to localStorage.
 * Silently ignores errors (e.g., private browsing quota issues).
 */
export function saveHistory(history: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

/**
 * Push a new command entry onto history, applying deduplication and length trim.
 *
 * Rules (pure function — does NOT mutate the input array):
 *   - Skip empty strings.
 *   - Skip if identical to the most recent entry (no consecutive dupes).
 *   - Prepend to front (most recent = index 0).
 *   - Trim to MAX_HISTORY_LENGTH (LRU: drop oldest from tail).
 *
 * @param history  Current history array (most-recent first).
 * @param command  Raw command string to add.
 * @returns        New history array.
 */
export function pushHistory(history: string[], command: string): string[] {
  const trimmed = command.trim();
  if (!trimmed) return history;
  if (history.length > 0 && history[0] === trimmed) return history;

  const next = [trimmed, ...history];
  return next.length > MAX_HISTORY_LENGTH ? next.slice(0, MAX_HISTORY_LENGTH) : next;
}

/** Exported constant for use in other modules. */
export { MAX_HISTORY_LENGTH };
