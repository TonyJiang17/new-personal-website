// lib/terminal/router.ts
// Maps a parsed terminal command → a typed routing intent.
// Pure: no DOM, no state, no side effects. Fully testable.
// WI-4.3 (Phase 4 — Sections + Command-to-Section Routing)

import type { ParsedInput } from "./parser";
import { lookupCommand } from "./commandRegistry";
import type { RouteId, ActionId, CommandId } from "./commandRegistry";
import { getUnknownCommandSuggestions } from "./suggest";

// ---------------------------------------------------------------------------
// RouterResult — typed discriminated union of all possible outcomes
// ---------------------------------------------------------------------------

/** Command navigates to a named section. */
export interface NavigateResult {
  type: "navigate";
  route: RouteId;
  /** Positional args passed to the command (e.g. project name for `project foo`). */
  args: string[];
}

/** Command triggers a side-effect action (resume, etc.). */
export interface ActionResult {
  type: "action";
  action: ActionId;
}

/** Built-in commands handled directly by the shell (help, clear). */
export interface BuiltinResult {
  type: "builtin";
  id: Extract<CommandId, "help" | "clear">;
}

/** Command not found — suggestions are Levenshtein-matched candidates. */
export interface UnknownResult {
  type: "unknown";
  raw: string;
  suggestions: string[];
}

/** Input was empty or whitespace — no-op. */
export interface EmptyResult {
  type: "empty";
}

export type RouterResult =
  | NavigateResult
  | ActionResult
  | BuiltinResult
  | UnknownResult
  | EmptyResult;

// ---------------------------------------------------------------------------
// routeCommand — main entry point
// ---------------------------------------------------------------------------

/**
 * Resolve a parsed terminal input to a routing intent.
 *
 * Special cases:
 * - `project <name>` is treated as a navigation to the `projects` route with
 *   the project name as an arg (MVP-lite drill-down per WI-4.2).
 * - `help` and `clear` return `builtin` so the shell can handle them without
 *   the router needing to know about transcript shape.
 */
export function routeCommand(parsed: ParsedInput): RouterResult {
  if (parsed.isEmpty) {
    return { type: "empty" };
  }

  // `project <name>` is a sub-command of `projects`
  const effectiveCommand = parsed.command === "project" ? "projects" : parsed.command;

  const cmdDef = lookupCommand(effectiveCommand);

  if (!cmdDef) {
    return {
      type: "unknown",
      raw: parsed.command,
      suggestions: getUnknownCommandSuggestions(parsed.command),
    };
  }

  // Builtin commands (shell handles transcript shape directly)
  if (cmdDef.id === "help" || cmdDef.id === "clear") {
    return { type: "builtin", id: cmdDef.id };
  }

  // Action commands (side effects: open resume, etc.)
  if (cmdDef.action) {
    return { type: "action", action: cmdDef.action };
  }

  // Navigation commands
  if (cmdDef.route) {
    return { type: "navigate", route: cmdDef.route, args: parsed.args };
  }

  // Registry entry has neither route nor action — treat as unknown (shouldn't occur)
  return {
    type: "unknown",
    raw: parsed.command,
    suggestions: getUnknownCommandSuggestions(parsed.command),
  };
}
