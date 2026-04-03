// components/sections/ProjectsSection.tsx
// Projects section — placeholder content per MVP policy (R14).
// Supports optional projectName for `project <name>` drill-down (MVP-lite).

import { PROJECTS_CONTENT, KNOWN_PROJECTS } from "@/content/sections";

interface Props {
  variant: "terminal" | "readable";
  projectName?: string;
}

// ---------------------------------------------------------------------------
// Drill-down detail (terminal only for now)
// ---------------------------------------------------------------------------

function ProjectDetailTerminal({ name }: { name: string }) {
  const project = KNOWN_PROJECTS[name];

  if (!project) {
    const known = Object.keys(KNOWN_PROJECTS).join(", ");
    return (
      <div className="font-mono text-sm">
        <div className="text-terminal-red mb-1">project not found: {name}</div>
        <div className="text-terminal-muted text-xs">Known projects: {known}</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm leading-relaxed">
      <div className="text-terminal-muted text-xs mb-2">
        ─── PROJECT: {name.toUpperCase()} ───────────────────────────────────
      </div>
      <div className="text-terminal-accent font-bold mb-1">{project.title}</div>
      <div className="text-terminal-text mb-3">{project.description}</div>
      <div className="text-terminal-muted text-xs border-t border-terminal-border pt-2">
        ← type <span className="text-terminal-text">`projects`</span> to go back
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Terminal variant (list view)
// ---------------------------------------------------------------------------

function ProjectsTerminal({ projectName }: { projectName?: string }) {
  if (projectName) {
    return <ProjectDetailTerminal name={projectName} />;
  }

  return (
    <div className="font-mono text-sm leading-relaxed">
      <div className="text-terminal-muted text-xs mb-2">
        ─── {PROJECTS_CONTENT.title.toUpperCase()} ───────────────────────────────────
      </div>
      <div className="text-terminal-text mb-2">{PROJECTS_CONTENT.summary}</div>
      {PROJECTS_CONTENT.details.map((line, i) => (
        <div
          key={i}
          className={`${
            line === ""
              ? "my-1"
              : line.startsWith("  project-")
                ? "text-terminal-green text-xs font-mono"
                : "text-terminal-muted text-xs"
          }`}
        >
          {line}
        </div>
      ))}
      <div className="mt-3 text-terminal-muted text-xs border-t border-terminal-border pt-2">
        Next:{" "}
        {PROJECTS_CONTENT.nextHints.map((hint, i) => (
          <span key={hint}>
            <span className="text-terminal-text">`{hint}`</span>
            {i < PROJECTS_CONTENT.nextHints.length - 1 && (
              <span className="text-terminal-muted"> · </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Readable variant
// ---------------------------------------------------------------------------

function ProjectsReadable() {
  return (
    <div>
      <h2 className="text-lg font-bold text-terminal-accent mb-2">{PROJECTS_CONTENT.title}</h2>
      <p className="text-terminal-text text-sm leading-relaxed mb-3">{PROJECTS_CONTENT.summary}</p>
      <ul className="space-y-3">
        {Object.entries(KNOWN_PROJECTS).map(([id, proj]) => (
          <li key={id}>
            <span className="text-terminal-green text-sm font-mono">{id}</span>
            <span className="text-terminal-muted text-sm ml-2">— {proj.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default function ProjectsSection({ variant, projectName }: Props) {
  return variant === "terminal" ? (
    <ProjectsTerminal projectName={projectName} />
  ) : (
    <ProjectsReadable />
  );
}
