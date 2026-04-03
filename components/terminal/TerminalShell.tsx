// components/terminal/TerminalShell.tsx
// Main terminal shell — owns state, handles side effects, renders split layout.
// Imported via dynamic({ ssr: false }) so localStorage is always available.
// WI-3.1 (terminal UI) + WI-3.2 (readable companion) + WI-5.1/5.2 (URL scheme + back/forward sync).

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { terminalReducer, makeInitialState } from "@/lib/terminal/state";
import type { TerminalEvent, SideEffect } from "@/lib/terminal/state";
import { loadHistory, saveHistory } from "@/lib/terminal/history";
import { contact } from "@/content/contact";
import CommandLine from "./CommandLine";
import OutputPane from "./OutputPane";
import Suggestions from "./Suggestions";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { RouteId } from "@/lib/terminal/commandRegistry";
import type { TranscriptEntry } from "@/lib/terminal/state";

// ---------------------------------------------------------------------------
// URL scheme helpers (WI-5.1)
// Query param: /?r=<route>  (home = /, no param)
// ---------------------------------------------------------------------------

const VALID_ROUTES = new Set<string>(["home", "about", "ai", "projects", "contact"]);

function routeToUrl(route: RouteId): string {
  return route === "home" ? "/" : `/?r=${route}`;
}

function parseRouteFromSearch(search: string): { route: RouteId; wasUnknown: boolean } {
  const params = new URLSearchParams(search);
  const r = params.get("r");
  if (!r) return { route: "home", wasUnknown: false };
  if (VALID_ROUTES.has(r)) return { route: r as RouteId, wasUnknown: false };
  return { route: "home", wasUnknown: true };
}

// ---------------------------------------------------------------------------
// Readable companion — always-on right-panel showing all sections
// ---------------------------------------------------------------------------

const READABLE_SECTIONS: { route: RouteId; label: string }[] = [
  { route: "home", label: "Overview" },
  { route: "about", label: "Product Manager" },
  { route: "ai", label: "AI Research & Engineering" },
  { route: "projects", label: "Projects" },
  { route: "contact", label: "Contact" },
];

function ReadableCompanion({ activeRoute }: { activeRoute: RouteId }) {
  return (
    <aside aria-label="Readable companion — scan mode" className="flex flex-col h-full">
      {/* All sections stacked — always visible for recruiters */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8 leading-relaxed">
        {READABLE_SECTIONS.map(({ route, label }) => {
          const isActive = route === activeRoute;
          return (
            <section
              key={route}
              aria-label={label}
              className={`pb-4 border-b border-terminal-border last:border-0 transition-opacity ${
                isActive ? "opacity-100" : "opacity-60 hover:opacity-90"
              }`}
            >
              {isActive && (
                <div className="text-terminal-accent text-xs mb-1 font-semibold">▶ {label}</div>
              )}
              <SectionRenderer route={route} variant="readable" />
            </section>
          );
        })}
      </div>

      {/* Footer — quick links */}
      <div className="px-5 py-3 border-t border-terminal-border flex-shrink-0 flex flex-wrap gap-3">
        <a
          href={contact.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-terminal-accent underline hover:text-white"
        >
          Resume PDF
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="text-xs text-terminal-accent underline hover:text-white"
        >
          Email
        </a>
        {contact.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-terminal-accent underline hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// TerminalShell
// ---------------------------------------------------------------------------

export default function TerminalShell() {
  // Right panel collapse state (desktop). Persist in localStorage.
  const [companionCollapsed, setCompanionCollapsed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("companionCollapsed");
      if (raw === "1") setCompanionCollapsed(true);
    } catch {
      // ignore
    }
  }, []);

  const toggleCompanionCollapsed = useCallback(() => {
    setCompanionCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("companionCollapsed", next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Lazy init: runs client-side only (ssr:false import).
  // Reads initial route from URL query param ?r=<route> (WI-5.1).
  const [state, setState] = useState(() => {
    const s = makeInitialState();
    const history = loadHistory();
    const { route, wasUnknown } = parseRouteFromSearch(window.location.search);
    const transcript: TranscriptEntry[] = [...s.transcript];
    if (wasUnknown) {
      transcript.push({
        id: `init-unknown-${Date.now()}`,
        ts: Date.now(),
        kind: "system",
        text: "Unknown route in URL — redirected to home. Type `/help` for available commands.",
      });
    }
    // Append initial section entry so the hero/section content renders immediately.
    transcript.push({
      id: `init-section-${Date.now()}`,
      ts: Date.now(),
      kind: "section",
      route,
    });
    return { ...s, route, transcript, history };
  });

  // Effects produced by the latest action — processed in the effect below.
  const pendingEffects = useRef<SideEffect[]>([]);

  const runChatRequest = useCallback(async (message: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = (await res.json()) as { reply?: unknown; suggestedCommands?: unknown };
      const reply = typeof data?.reply === "string" ? data.reply : "Chat is temporarily unavailable. Try /help.";
      const suggestedCommands = Array.isArray(data?.suggestedCommands)
        ? (data.suggestedCommands.filter((c) => typeof c === "string") as string[])
        : [];

      setState((prev) => {
        const transcript: TranscriptEntry[] = [...prev.transcript];
        transcript.push({
          id: `chat-reply-${Date.now()}`,
          ts: Date.now(),
          kind: "system",
          text: reply,
        });

        if (suggestedCommands.length > 0) {
          transcript.push({
            id: `chat-suggest-${Date.now()}`,
            ts: Date.now(),
            kind: "system",
            text: `Suggested: ${suggestedCommands.map((c) => (c.startsWith("/") ? c : `/${c}`)).join(", ")}`,
          });
        }

        return { ...prev, transcript };
      });
    } catch {
      setState((prev) => ({
        ...prev,
        transcript: [
          ...prev.transcript,
          {
            id: `chat-error-${Date.now()}`,
            ts: Date.now(),
            kind: "system",
            text: "Chat is temporarily unavailable right now. Type `/help` for available commands.",
          },
        ],
      }));
    }
  }, []);

  // Process side-effects after each render.
  useEffect(() => {
    if (pendingEffects.current.length === 0) return;
    const effects = pendingEffects.current.splice(0);

    for (const effect of effects) {
      switch (effect.type) {
        case "OPEN_RESUME":
          window.open(contact.resumePath, "_blank", "noopener,noreferrer");
          break;
        case "PERSIST_HISTORY":
          saveHistory(effect.history);
          break;
        case "NAVIGATE":
          // WI-5.1: push URL on terminal navigation.
          // WI-5.2: popstate listener (below) handles back/forward → ROUTE_CHANGED.
          window.history.pushState({ route: effect.route }, "", routeToUrl(effect.route));
          break;
        case "CHAT_REQUEST":
          void runChatRequest(effect.message);
          break;
      }
    }
  });

  // Dispatch: apply reducer, capture effects, update state.
  const dispatch = useCallback((event: TerminalEvent) => {
    setState((prev) => {
      const { state: next, effects } = terminalReducer(prev, event);
      pendingEffects.current.push(...effects);
      return next;
    });
  }, []);

  // WI-5.2: Browser back/forward → dispatch ROUTE_CHANGED.
  // pushState (above) does NOT fire popstate, so no feedback loop.
  useEffect(() => {
    function handlePopState() {
      const { route } = parseRouteFromSearch(window.location.search);
      dispatch({ type: "ROUTE_CHANGED", route });
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [dispatch]);

  // Track submit count to re-focus input after each command.
  const [submitCount, setSubmitCount] = useState(0);
  const dispatchWithFocus = useCallback(
    (event: TerminalEvent) => {
      dispatch(event);
      if (event.type === "SUBMIT_INPUT") {
        setSubmitCount((c) => c + 1);
      }
    },
    [dispatch]
  );

  // Mobile: toggle scan panel.
  const [showScanPanel, setShowScanPanel] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-terminal-bg text-terminal-text font-mono overflow-hidden">
      {/* ── Left: Terminal ──────────────────────────────────── */}
      <div
        className={`flex flex-col min-w-0 border-r border-terminal-border ${
          showScanPanel ? "hidden md:flex md:flex-1" : "flex flex-1"
        }`}
      >
        {/* Terminal title bar */}
        <header className="relative flex items-center justify-between px-4 py-2 border-b border-terminal-border bg-terminal-surface flex-shrink-0">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-terminal-red inline-block" />
            <span className="w-3 h-3 rounded-full bg-terminal-amber inline-block" />
            <span className="w-3 h-3 rounded-full bg-terminal-green inline-block" />
          </div>
          <span className="text-terminal-muted text-xs absolute left-1/2 -translate-x-1/2 pointer-events-none">
            tony@personal ~{state.route !== "home" ? ` [${state.route}]` : ""}
          </span>
          {/* Mobile: toggle scan panel */}
          <button
            onClick={() => setShowScanPanel(true)}
            className="text-xs text-terminal-muted hover:text-terminal-text md:hidden"
            aria-label="Switch to scan mode"
          >
            scan →
          </button>
        </header>

        {/* Transcript */}
        <OutputPane transcript={state.transcript} />

        {/* Suggestions (above input) */}
        {state.suggestions.length > 0 && (
          <div className="px-4 pb-1">
            <Suggestions
              suggestions={state.suggestions}
              selectedIndex={state.suggestionIndex}
              onSelect={(value) => {
                dispatch({ type: "INPUT_CHANGED", text: value });
                dispatchWithFocus({ type: "SUBMIT_INPUT" });
              }}
            />
          </div>
        )}

        {/* Command input */}
        <CommandLine
          input={state.input}
          isComposing={state.isComposing}
          dispatch={dispatchWithFocus}
          autoFocusTrigger={submitCount}
        />
      </div>

      {/* ── Right: Readable companion ───────────────────────── */}
      <div
        className={`
          flex-shrink-0 flex flex-col
          bg-terminal-surface/70 backdrop-blur-md border-l border-terminal-border/60
          ${showScanPanel ? "flex w-full" : "hidden md:flex"}
          ${companionCollapsed ? "md:w-14" : "md:w-[520px] xl:w-[560px]"}
        `}
      >
        {/* Mobile: back button */}
        {showScanPanel && (
          <div className="md:hidden px-4 py-2 border-b border-terminal-border/60">
            <button
              onClick={() => setShowScanPanel(false)}
              className="text-xs text-terminal-muted hover:text-terminal-text"
              aria-label="Back to terminal"
            >
              ← terminal
            </button>
          </div>
        )}

        {/* Desktop: collapse toggle */}
        <div className="hidden md:flex items-center justify-between px-4 py-2 border-b border-terminal-border/60">
          <div className="text-[11px] tracking-wide text-terminal-muted">
            {companionCollapsed ? "Scan" : "Scan Mode"}
          </div>
          <button
            onClick={toggleCompanionCollapsed}
            className="text-xs text-terminal-muted hover:text-terminal-text"
            aria-label={companionCollapsed ? "Expand scan panel" : "Collapse scan panel"}
            title={companionCollapsed ? "Expand" : "Collapse"}
          >
            {companionCollapsed ? "«" : "»"}
          </button>
        </div>

        {companionCollapsed ? (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <button
              onClick={toggleCompanionCollapsed}
              className="text-terminal-accent hover:text-white"
              aria-label="Expand scan panel"
              title="Expand scan panel"
            >
              ▸
            </button>
          </div>
        ) : (
          <ReadableCompanion activeRoute={state.route} />
        )}
      </div>
    </div>
  );
}
