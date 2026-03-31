// lib/terminal/state.ts
// Terminal reducer + state machine. Pure: no DOM, no localStorage access here.
// Side effects (localStorage, window.open, router.push) are handled by the
// TerminalShell component after inspecting the returned state + intent.

import { type CommandId, type RouteId, visibleCommands } from "./commandRegistry";
import { parseInput } from "./parser";
import { getSuggestions } from "./suggest";
import { pushHistory } from "./history";
import { routeCommand } from "./router";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TranscriptEntry {
  id: string;
  ts: number;
  kind: "command" | "system" | "section" | "help";
  /** Raw text for system/help entries. */
  text?: string;
  /** For command echo entries. */
  command?: {
    raw: string;
    id?: CommandId;
    args?: string[];
    error?: string;
  };
  /** Route this section entry represents. */
  route?: RouteId;
}

export interface Suggestion {
  value: string;
  kind: "command" | "history";
  score: number;
}

export interface TerminalState {
  route: RouteId;
  input: string;
  isComposing: boolean;
  /** Raw command history. Most-recent at index 0. */
  history: string[];
  /** null when not navigating history. */
  historyIndex: number | null;
  /** Draft input saved when user starts history navigation. */
  historyDraft: string;
  suggestions: Suggestion[];
  suggestionIndex: number | null;
  transcript: TranscriptEntry[];
  reducedMotion: boolean;
  highContrast: boolean;
}

// ---------------------------------------------------------------------------
// Events (intents)
// ---------------------------------------------------------------------------

export type TerminalEvent =
  | { type: "INPUT_CHANGED"; text: string }
  | { type: "INPUT_COMPOSITION_START" }
  | { type: "INPUT_COMPOSITION_END" }
  | { type: "SUBMIT_INPUT" }
  | { type: "HISTORY_PREV" }
  | { type: "HISTORY_NEXT" }
  | { type: "SUGGESTION_PREV" }
  | { type: "SUGGESTION_NEXT" }
  | { type: "ACCEPT_SUGGESTION" }
  | { type: "ROUTE_CHANGED"; route: RouteId }
  | { type: "CLEAR_TRANSCRIPT" };

// ---------------------------------------------------------------------------
// Side-effect intents (returned alongside state for the shell to handle)
// ---------------------------------------------------------------------------

export type SideEffect =
  | { type: "NAVIGATE"; route: RouteId }
  | { type: "OPEN_RESUME" }
  | { type: "PERSIST_HISTORY"; history: string[] };

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

export function makeInitialState(overrides: Partial<TerminalState> = {}): TerminalState {
  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return {
    route: "home",
    input: "",
    isComposing: false,
    history: [],
    historyIndex: null,
    historyDraft: "",
    suggestions: [],
    suggestionIndex: null,
    transcript: [makeWelcomeEntry()],
    reducedMotion,
    highContrast: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function terminalReducer(
  state: TerminalState,
  event: TerminalEvent
): { state: TerminalState; effects: SideEffect[] } {
  switch (event.type) {
    case "INPUT_CHANGED": {
      const suggestions = getSuggestions(event.text, state.history);
      return {
        state: {
          ...state,
          input: event.text,
          historyIndex: null,
          historyDraft: event.text,
          suggestions,
          suggestionIndex: null,
        },
        effects: [],
      };
    }

    case "INPUT_COMPOSITION_START":
      return { state: { ...state, isComposing: true }, effects: [] };

    case "INPUT_COMPOSITION_END":
      return { state: { ...state, isComposing: false }, effects: [] };

    case "SUBMIT_INPUT": {
      if (state.isComposing) return { state, effects: [] };

      const raw = state.input.trim();

      // Empty input — no-op (don't pollute history)
      if (!raw) {
        return {
          state: { ...state, input: "", historyIndex: null, suggestions: [] },
          effects: [],
        };
      }

      const parsed = parseInput(raw);

      // Echo command entry
      const cmdEntry: TranscriptEntry = {
        id: uid(),
        ts: Date.now(),
        kind: "command",
        command: { raw, id: undefined, args: parsed.args },
      };

      const newTranscript: TranscriptEntry[] = [...state.transcript, cmdEntry];
      const effects: SideEffect[] = [];

      // Delegate to router for command → intent resolution (WI-4.3)
      const routeResult = routeCommand(parsed);

      let newRoute = state.route;

      if (routeResult.type === "non_command") {
        // Non-slash input: not a command invocation.
        const suggestion = routeResult.matchesCommand
          ? `Did you mean \`/${routeResult.matchesCommand}\`?`
          : "Chat mode is coming soon. Type `/help` for available commands.";
        newTranscript.push({
          id: uid(),
          ts: Date.now(),
          kind: "system",
          text: suggestion,
        });
      } else if (routeResult.type === "unknown") {
        const didYouMean =
          routeResult.suggestions.length > 0
            ? `Did you mean: ${routeResult.suggestions.map((s) => `/${s}`).join(", ")}?`
            : "Type `/help` for available commands.";
        newTranscript.push({
          id: uid(),
          ts: Date.now(),
          kind: "system",
          text: `command not found: /${routeResult.raw}\n${didYouMean}`,
        });
      } else if (routeResult.type === "builtin" && routeResult.id === "help") {
        newTranscript.push(makeHelpEntry());
      } else if (routeResult.type === "builtin" && routeResult.id === "clear") {
        // Clear — return early with wiped transcript
        const newHistory = pushHistory(state.history, raw);
        return {
          state: {
            ...state,
            input: "",
            historyIndex: null,
            historyDraft: "",
            suggestions: [],
            suggestionIndex: null,
            history: newHistory,
            transcript: [],
          },
          effects: [{ type: "PERSIST_HISTORY", history: newHistory }],
        };
      } else if (routeResult.type === "action" && routeResult.action === "resume") {
        newTranscript.push({
          id: uid(),
          ts: Date.now(),
          kind: "system",
          text: "Opening resume PDF…",
        });
        effects.push({ type: "OPEN_RESUME" });
      } else if (routeResult.type === "navigate") {
        newRoute = routeResult.route;
        // Pass args to section entry so OutputPane can use them (e.g. project name — WI-4.2)
        newTranscript.push({
          id: uid(),
          ts: Date.now(),
          kind: "section",
          route: routeResult.route,
          command:
            routeResult.args.length > 0
              ? { raw, args: routeResult.args }
              : undefined,
        });
        effects.push({ type: "NAVIGATE", route: routeResult.route });
      }

      const newHistory = pushHistory(state.history, raw);
      effects.push({ type: "PERSIST_HISTORY", history: newHistory });

      return {
        state: {
          ...state,
          input: "",
          historyIndex: null,
          historyDraft: "",
          suggestions: [],
          suggestionIndex: null,
          history: newHistory,
          route: newRoute,
          transcript: newTranscript,
        },
        effects,
      };
    }

    case "HISTORY_PREV": {
      const { history, historyIndex, historyDraft, input } = state;
      if (history.length === 0) return { state, effects: [] };

      const draft = historyIndex === null ? input : historyDraft;
      const nextIndex = historyIndex === null ? 0 : Math.min(historyIndex + 1, history.length - 1);

      return {
        state: {
          ...state,
          historyIndex: nextIndex,
          historyDraft: historyIndex === null ? draft : historyDraft,
          input: history[nextIndex],
          suggestions: [],
          suggestionIndex: null,
        },
        effects: [],
      };
    }

    case "HISTORY_NEXT": {
      const { history, historyIndex, historyDraft } = state;
      if (historyIndex === null) return { state, effects: [] };

      if (historyIndex === 0) {
        // Back to draft
        return {
          state: {
            ...state,
            historyIndex: null,
            input: historyDraft,
            suggestions: getSuggestions(historyDraft, history),
            suggestionIndex: null,
          },
          effects: [],
        };
      }

      const nextIndex = historyIndex - 1;
      return {
        state: {
          ...state,
          historyIndex: nextIndex,
          input: history[nextIndex],
          suggestions: [],
          suggestionIndex: null,
        },
        effects: [],
      };
    }

    case "SUGGESTION_PREV": {
      const { suggestions, suggestionIndex } = state;
      if (suggestions.length === 0) return { state, effects: [] };
      const nextIndex =
        suggestionIndex === null ? suggestions.length - 1 : Math.max(0, suggestionIndex - 1);
      return {
        state: { ...state, suggestionIndex: nextIndex },
        effects: [],
      };
    }

    case "SUGGESTION_NEXT": {
      const { suggestions, suggestionIndex } = state;
      if (suggestions.length === 0) return { state, effects: [] };
      const nextIndex =
        suggestionIndex === null ? 0 : Math.min(suggestions.length - 1, suggestionIndex + 1);
      return {
        state: { ...state, suggestionIndex: nextIndex },
        effects: [],
      };
    }

    case "ACCEPT_SUGGESTION": {
      const { suggestions, suggestionIndex } = state;
      if (suggestionIndex === null || suggestions.length === 0) return { state, effects: [] };
      const accepted = suggestions[suggestionIndex].value;
      return {
        state: {
          ...state,
          input: accepted,
          suggestionIndex: null,
          suggestions: getSuggestions(accepted, state.history),
          historyIndex: null,
        },
        effects: [],
      };
    }

    case "ROUTE_CHANGED": {
      // Fired by browser popstate / Next.js navigation
      if (event.route === state.route) return { state, effects: [] };
      return {
        state: {
          ...state,
          route: event.route,
          transcript: [
            ...state.transcript,
            {
              id: uid(),
              ts: Date.now(),
              kind: "section",
              route: event.route,
              text: `[navigated to ${event.route}]`,
            },
          ],
        },
        effects: [],
      };
    }

    case "CLEAR_TRANSCRIPT":
      return { state: { ...state, transcript: [] }, effects: [] };

    default:
      return { state, effects: [] };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _counter = 0;
function uid(): string {
  return `${Date.now()}-${++_counter}`;
}

function makeWelcomeEntry(): TranscriptEntry {
  return {
    id: uid(),
    ts: Date.now(),
    kind: "system",
    text: "Welcome to Tony Jiang's terminal. Type `/help` to see available commands.",
  };
}

function makeHelpEntry(): TranscriptEntry {
  const cmds = visibleCommands();
  const lines = [
    "Available commands:",
    ...cmds.map((c) => {
      const aliases = c.names.slice(1).map((a) => `/${a}`);
      const aliasStr = aliases.length > 0 ? `  (aliases: ${aliases.join(", ")})` : "";
      return `  ${`/${c.names[0]}`.padEnd(13)} — ${c.summary}${aliasStr}`;
    }),
    "",
    "Usage examples:",
    "  /about        — view PM section",
    "  /ai           — view AI Product Builder section",
    "  /projects     — list all projects",
    "  /project foo  — drill into a specific project",
    "  /resume       — open resume PDF",
    "  /clear        — clear transcript",
  ];

  return {
    id: uid(),
    ts: Date.now(),
    kind: "help",
    text: lines.join("\n"),
  };
}
