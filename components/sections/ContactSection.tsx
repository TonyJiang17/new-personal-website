// components/sections/ContactSection.tsx
// Contact section — uses real data from content/contact.ts (R16).

import { contact } from "@/content/contact";

interface Props {
  variant: "terminal" | "readable";
}

// ---------------------------------------------------------------------------
// Terminal variant
// ---------------------------------------------------------------------------

function ContactTerminal() {
  return (
    <div className="font-mono text-sm leading-relaxed">
      <div className="text-terminal-muted text-xs mb-2">
        ─── CONTACT ────────────────────────────────────────────────────────────
      </div>

      {/* Email */}
      <div className="mb-2">
        <span className="text-terminal-muted text-xs">email </span>
        <a
          href={`mailto:${contact.email}`}
          className="text-terminal-accent underline hover:text-white"
        >
          {contact.email}
        </a>
      </div>

      {/* Profile links */}
      {contact.links.map((link) => (
        <div key={link.label} className="mb-1">
          <span className="text-terminal-muted text-xs">{link.label.toLowerCase().padEnd(7)} </span>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terminal-accent underline hover:text-white text-xs"
          >
            {link.url}
          </a>
        </div>
      ))}

      {/* Resume */}
      <div className="mt-3 pt-2 border-t border-terminal-border">
        <span className="text-terminal-muted text-xs">resume </span>
        <a
          href={contact.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-accent underline hover:text-white text-xs"
        >
          {contact.resumePath}
        </a>
        <span className="text-terminal-muted text-xs ml-2">
          · or type <span className="text-terminal-text">`resume`</span>
        </span>
      </div>

      {/* Next-step hints (WI-5.3) */}
      <div className="mt-3 text-terminal-muted text-xs border-t border-terminal-border pt-2">
        {"Next: "}
        {(["about", "ai", "projects"] as const).map((hint, i) => (
          <span key={hint}>
            <span className="text-terminal-text">`{hint}`</span>
            {i < 2 && <span className="text-terminal-muted"> · </span>}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Readable variant
// ---------------------------------------------------------------------------

function ContactReadable() {
  return (
    <div>
      <h2 className="text-lg font-bold text-terminal-accent mb-3">Contact</h2>

      <div className="space-y-3">
        <div>
          <span className="text-terminal-muted text-xs uppercase tracking-wide block mb-0.5">
            Email
          </span>
          <a
            href={`mailto:${contact.email}`}
            className="text-terminal-text text-sm underline hover:text-terminal-accent"
          >
            {contact.email}
          </a>
        </div>

        {contact.links.map((link) => (
          <div key={link.label}>
            <span className="text-terminal-muted text-xs uppercase tracking-wide block mb-0.5">
              {link.label}
            </span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-text text-sm underline hover:text-terminal-accent break-all"
            >
              {link.url}
            </a>
          </div>
        ))}

        <div>
          <span className="text-terminal-muted text-xs uppercase tracking-wide block mb-0.5">
            Resume
          </span>
          <a
            href={contact.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 inline-block bg-terminal-surface border border-terminal-accent text-terminal-accent rounded hover:bg-terminal-accent hover:text-terminal-bg transition-colors"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default function ContactSection({ variant }: Props) {
  return variant === "terminal" ? <ContactTerminal /> : <ContactReadable />;
}
