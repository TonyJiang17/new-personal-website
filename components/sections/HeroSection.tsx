// components/sections/HeroSection.tsx
// Hero section — renders in both 'terminal' (transcript inline) and 'readable' (companion panel) variants.
// ASCII art block is a placeholder; WI-1.4 will generate from context/assets/hero_source.jpg.

import { HERO_CONTENT } from "@/content/sections";
import { contact } from "@/content/contact";

interface Props {
  variant: "terminal" | "readable";
}

// ---------------------------------------------------------------------------
// Terminal variant
// ---------------------------------------------------------------------------

function HeroTerminal() {
  return (
    <div className="font-mono text-sm leading-relaxed">
      {/* Two-column hero (portrait left, text right) */}
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <pre className="text-terminal-text whitespace-pre text-[8px] leading-[0.55rem] max-w-full overflow-x-auto md:flex-shrink-0">
          {HERO_CONTENT.asciiArt}
        </pre>

        <div className="min-w-0">
          {/* Name + tagline */}
          <div className="text-terminal-accent font-bold text-base mb-1">{HERO_CONTENT.name}</div>
          <div className="text-terminal-muted mb-3">{HERO_CONTENT.tagline}</div>

          {/* Intro */}
          {HERO_CONTENT.intro.map((line, i) => (
            <div key={i} className="text-terminal-text mb-1">
              {line}
            </div>
          ))}

          {/* Quick actions */}
          <div className="mt-4 text-terminal-muted text-xs space-y-1">
            <div>
              <span className="text-terminal-prompt">→</span>{" "}
              <a
                href={contact.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-accent underline hover:text-white"
              >
                download resume
              </a>
              <span className="text-terminal-muted mx-2">·</span>
              <span className="text-terminal-muted">
                or type <span className="text-terminal-text">`resume`</span>
              </span>
            </div>
            <div>
              <span className="text-terminal-prompt">→</span>{" "}
              <a
                href={`mailto:${contact.email}`}
                className="text-terminal-accent underline hover:text-white"
              >
                {contact.email}
              </a>
              <span className="text-terminal-muted mx-2">·</span>
              <span className="text-terminal-muted">
                or type <span className="text-terminal-text">`contact`</span>
              </span>
            </div>
          </div>

          {/* Help hint */}
          <div className="mt-4 text-terminal-muted text-xs border-t border-terminal-border pt-3">
            Type <span className="text-terminal-text font-semibold">`help`</span> to see all available
            commands.
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Readable variant
// ---------------------------------------------------------------------------

function HeroReadable() {
  return (
    <div>
      <h1 className="text-xl font-bold text-terminal-accent mb-1">{HERO_CONTENT.name}</h1>
      <p className="text-terminal-muted text-sm mb-3">{HERO_CONTENT.tagline}</p>

      {HERO_CONTENT.intro.map((line, i) => (
        <p key={i} className="text-terminal-text text-sm leading-relaxed mb-2">
          {line}
        </p>
      ))}

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={contact.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 bg-terminal-surface border border-terminal-accent text-terminal-accent rounded hover:bg-terminal-accent hover:text-terminal-bg transition-colors"
        >
          Download Resume
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="text-xs px-3 py-1.5 bg-terminal-surface border border-terminal-border text-terminal-text rounded hover:border-terminal-accent transition-colors"
        >
          Email Me
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default function HeroSection({ variant }: Props) {
  return variant === "terminal" ? <HeroTerminal /> : <HeroReadable />;
}
