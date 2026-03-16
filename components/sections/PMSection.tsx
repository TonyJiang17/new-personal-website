// components/sections/PMSection.tsx
// Product Manager section — placeholder content per MVP policy (R14).

import { PM_CONTENT } from "@/content/sections";

interface Props {
  variant: "terminal" | "readable";
}

function PMTerminal() {
  return (
    <div className="font-mono text-sm leading-relaxed">
      <div className="text-terminal-muted text-xs mb-2">
        ─── {PM_CONTENT.title.toUpperCase()} ───────────────────────────────────
      </div>
      <div className="text-terminal-text mb-2">{PM_CONTENT.summary}</div>
      {PM_CONTENT.details.map((line, i) => (
        <div key={i} className={`${line === "" ? "my-1" : "text-terminal-muted text-xs"}`}>
          {line}
        </div>
      ))}
      <div className="mt-3 text-terminal-muted text-xs border-t border-terminal-border pt-2">
        Next:{" "}
        {PM_CONTENT.nextHints.map((hint, i) => (
          <span key={hint}>
            <span className="text-terminal-text">`{hint}`</span>
            {i < PM_CONTENT.nextHints.length - 1 && (
              <span className="text-terminal-muted"> · </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function PMReadable() {
  return (
    <div>
      <h2 className="text-base font-bold text-terminal-accent mb-2">{PM_CONTENT.title}</h2>
      <p className="text-terminal-text text-sm mb-3">{PM_CONTENT.summary}</p>
      <ul className="space-y-1">
        {PM_CONTENT.details
          .filter((line) => line.startsWith("·"))
          .map((line, i) => (
            <li key={i} className="text-terminal-muted text-xs">
              {line}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default function PMSection({ variant }: Props) {
  return variant === "terminal" ? <PMTerminal /> : <PMReadable />;
}
