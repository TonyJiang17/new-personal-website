// lib/terminal/suggest.ts
// Pure suggestion engine: prefix matching + Levenshtein-based fuzzy matching.
// No side effects; all inputs are parameters.

import { allCommandNames, visibleCommands } from "./commandRegistry";

export interface Suggestion {
  value: string;
  kind: "command" | "history";
  /** Higher score = better match. */
  score: number;
}

const MAX_SUGGESTIONS = 5;
const MIN_FUZZY_INPUT_LENGTH = 2;

/**
 * Generate ordered suggestions for the current input value.
 *
 * Scoring:
 *   - Exact prefix match on command names: score 100 - length (shorter = better)
 *   - Exact match in history with prefix: score 80 - length
 *   - Registry commands always outrank history suggestions unless history is exact.
 *
 * @param input        Current raw input string (first token is the command prefix).
 * @param history      Recent command history (raw inputs, most recent first).
 * @returns            Ordered suggestion list (highest score first), max 5.
 */
export function getSuggestions(input: string, history: string[]): Suggestion[] {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed) return [];

  // First token only (we suggest commands, not full args)
  const prefix = trimmed.split(/\s+/)[0];

  const suggestions = new Map<string, Suggestion>();

  // --- Command prefix matches ---
  for (const name of allCommandNames()) {
    if (name.startsWith(prefix)) {
      const existing = suggestions.get(name);
      const score = 100 - name.length; // shorter completions rank higher
      if (!existing || existing.score < score) {
        suggestions.set(name, { value: name, kind: "command", score });
      }
    }
  }

  // --- History prefix matches (if input long enough to be meaningful) ---
  if (prefix.length >= MIN_FUZZY_INPUT_LENGTH) {
    for (const entry of history) {
      const entryLower = entry.toLowerCase().trim();
      const entryCommand = entryLower.split(/\s+/)[0];
      if (entryCommand.startsWith(prefix) && !suggestions.has(entryCommand)) {
        suggestions.set(entryCommand, {
          value: entryCommand,
          kind: "history",
          score: 80 - entryCommand.length,
        });
      }
    }
  }

  return Array.from(suggestions.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SUGGESTIONS);
}

/**
 * For unknown commands: return top 1–3 closest known command names via
 * Levenshtein distance. Used for "Did you mean: ..." messaging.
 *
 * @param unknown   The unrecognized command string (already lowercased).
 * @returns         Up to 3 closest canonical command names.
 */
export function getUnknownCommandSuggestions(unknown: string): string[] {
  const knownNames = allCommandNames();

  const scored = knownNames
    .map((name) => ({ name, dist: levenshtein(unknown, name) }))
    .filter(({ dist }) => dist <= 3) // only suggest if reasonably close
    .sort((a, b) => a.dist - b.dist || a.name.length - b.name.length);

  // Prefer canonical command names (first name of each command def)
  const canonicalNames = new Set(visibleCommands().map((c) => c.names[0]));

  const deduped: string[] = [];
  const seen = new Set<string>();
  // First pass: canonical names
  for (const { name } of scored) {
    if (canonicalNames.has(name) && !seen.has(name)) {
      deduped.push(name);
      seen.add(name);
    }
    if (deduped.length >= 3) break;
  }
  // Second pass: fill remaining from any aliases
  for (const { name } of scored) {
    if (!seen.has(name)) {
      deduped.push(name);
      seen.add(name);
    }
    if (deduped.length >= 3) break;
  }

  return deduped;
}

/**
 * Standard iterative Levenshtein distance (pure function).
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}
