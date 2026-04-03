// components/terminal/OutputPane.tsx
// Scrollable transcript pane. Renders each TranscriptEntry by kind.
// Auto-scrolls to bottom on new entries unless user has manually scrolled up.

"use client";

import { useEffect, useRef } from "react";
import type { TranscriptEntry } from "@/lib/terminal/state";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { RouteId } from "@/lib/terminal/commandRegistry";

interface Props {
  transcript: TranscriptEntry[];
}

export default function OutputPane({ transcript }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new entries, unless user scrolled up.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    // Only auto-scroll if within 120px of bottom (user hasn't manually scrolled).
    if (distanceFromBottom < 120) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript.length]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent"
    >
      {transcript.map((entry) => (
        <TranscriptRow key={entry.id} entry={entry} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-entry renderers
// ---------------------------------------------------------------------------

function TranscriptRow({ entry }: { entry: TranscriptEntry }) {
  switch (entry.kind) {
    case "command":
      return <CommandRow entry={entry} />;
    case "system":
      return <SystemRow text={entry.text ?? ""} />;
    case "help":
      return <HelpRow text={entry.text ?? ""} />;
    case "section":
      return <SectionRow route={entry.route!} projectName={entry.command?.args?.[0]} />;
    default:
      return null;
  }
}

function CommandRow({ entry }: { entry: TranscriptEntry }) {
  return (
    <div className="flex items-start gap-2 font-mono text-sm">
      <span className="text-terminal-prompt select-none flex-shrink-0">~$</span>
      <span className="text-terminal-text">{entry.command?.raw ?? ""}</span>
    </div>
  );
}

function SystemRow({ text }: { text: string }) {
  // Multi-line system messages — split on newline for proper rendering.
  const lines = text.split("\n");
  const isError = text.startsWith("command not found");

  return (
    <div className="font-mono text-xs pl-5 space-y-0.5" data-testid="system-row">
      {lines.map((line, i) => (
        <div
          key={i}
          className={
            isError && i === 0
              ? "text-terminal-red"
              : i === 0
                ? "text-terminal-text"
                : "text-terminal-muted"
          }
        >
          {line}
        </div>
      ))}
    </div>
  );
}

function HelpRow({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="font-mono text-xs pl-5 space-y-0.5">
      {lines.map((line, i) => {
        const isHeader = line.endsWith(":");
        const isExample = line.startsWith("  ") && line.includes("—");
        return (
          <div
            key={i}
            className={
              isHeader
                ? "text-terminal-accent font-semibold mt-1"
                : isExample
                  ? "text-terminal-muted"
                  : line === ""
                    ? "h-1"
                    : "text-terminal-text"
            }
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}

function SectionRow({ route, projectName }: { route: RouteId; projectName?: string }) {
  return (
    <div className="pl-5 py-1">
      <SectionRenderer route={route} variant="terminal" projectName={projectName} />
    </div>
  );
}
