// components/terminal/Suggestions.tsx
// Inline suggestion list rendered below the command input.
// Keyboard selection is managed by the parent (TerminalShell) via suggestionIndex.

"use client";

import type { Suggestion } from "@/lib/terminal/state";

interface Props {
  suggestions: Suggestion[];
  selectedIndex: number | null;
  onSelect: (value: string) => void;
}

export default function Suggestions({ suggestions, selectedIndex, onSelect }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <div
      role="listbox"
      aria-label="Command suggestions"
      className="border border-terminal-border bg-terminal-surface rounded-b px-2 py-1 text-xs font-mono"
    >
      {suggestions.map((s, i) => {
        const isSelected = i === selectedIndex;
        return (
          <button
            key={`${s.value}-${i}`}
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(s.value)}
            className={`block w-full text-left px-2 py-0.5 rounded cursor-pointer transition-colors ${
              isSelected
                ? "bg-terminal-accent text-terminal-bg"
                : "text-terminal-text hover:bg-terminal-border"
            }`}
          >
            <span>{s.value}</span>
            {s.kind === "history" && (
              <span
                className={`ml-2 text-xs ${isSelected ? "text-terminal-bg opacity-70" : "text-terminal-muted"}`}
              >
                (history)
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
