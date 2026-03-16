// components/terminal/TerminalShellLoader.tsx
// Client-side loader for TerminalShell using dynamic import with ssr:false.
// Required by Next.js App Router: ssr:false is only allowed in client components.

"use client";

import dynamic from "next/dynamic";

const TerminalShell = dynamic(() => import("./TerminalShell"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-terminal-bg text-terminal-text font-mono flex items-center justify-center">
      <span className="text-terminal-muted text-sm">
        loading terminal<span className="animate-pulse">…</span>
      </span>
    </main>
  ),
});

export default function TerminalShellLoader() {
  return <TerminalShell />;
}
