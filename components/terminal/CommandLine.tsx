// components/terminal/CommandLine.tsx
// Terminal input bar with prompt glyph, text input, and keybinding handlers.
// Dispatches intents upward via callback props (TerminalShell owns the reducer).

"use client";

import { useRef, useEffect, useState } from "react";
import type { TerminalEvent } from "@/lib/terminal/state";

interface Props {
  input: string;
  isComposing: boolean;
  dispatch: (event: TerminalEvent) => void;
  /** Keep input focused when transcript updates. */
  autoFocusTrigger?: number;
}

export default function CommandLine({ input, dispatch, autoFocusTrigger }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  // WI-5.4: track focus for visible indicator on the input bar.
  const [isFocused, setIsFocused] = useState(false);

  // Re-focus input whenever a command is submitted (autoFocusTrigger increments).
  useEffect(() => {
    inputRef.current?.focus();
  }, [autoFocusTrigger]);

  // Initial focus on mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Enter":
        // Composition guard: handled by SUBMIT_INPUT in reducer
        dispatch({ type: "SUBMIT_INPUT" });
        break;
      case "ArrowUp":
        e.preventDefault();
        dispatch({ type: "HISTORY_PREV" });
        break;
      case "ArrowDown":
        e.preventDefault();
        dispatch({ type: "HISTORY_NEXT" });
        break;
      case "Tab":
        e.preventDefault();
        dispatch({ type: "ACCEPT_SUGGESTION" });
        break;
    }
  }

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 border-t border-terminal-border bg-terminal-bg transition-colors ${
        isFocused ? "border-l-2 border-l-terminal-accent" : "border-l-2 border-l-transparent"
      }`}
    >
      {/* Prompt */}
      <span
        className="text-terminal-prompt font-mono text-sm select-none flex-shrink-0"
        aria-hidden="true"
      >
        ~$
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => dispatch({ type: "INPUT_CHANGED", text: e.target.value })}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => dispatch({ type: "INPUT_COMPOSITION_START" })}
        onCompositionEnd={() => dispatch({ type: "INPUT_COMPOSITION_END" })}
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        aria-label="Terminal command input"
        aria-autocomplete="list"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          flex-1 bg-transparent border-none outline-none
          font-mono text-sm text-terminal-text
          caret-terminal-accent
          focus:outline-none
          placeholder:text-terminal-muted
        `}
        placeholder="type a command…"
      />
    </div>
  );
}
