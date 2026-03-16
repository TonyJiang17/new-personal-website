// app/page.tsx
// Root page — delegates to TerminalShellLoader (client component) which uses
// dynamic({ ssr: false }) to avoid localStorage hydration mismatches.

import TerminalShellLoader from "@/components/terminal/TerminalShellLoader";

export default function Home() {
  return <TerminalShellLoader />;
}
