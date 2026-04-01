// lib/chat/context.ts
// WI-1.1: Builds a static context string from canonical site content.
// Used as the knowledge base injected into every chat request.

import { HERO_CONTENT, PM_CONTENT, AI_CONTENT, PROJECTS_CONTENT } from "@/content/sections";
import { contact } from "@/content/contact";
import { COMMAND_REGISTRY } from "@/lib/terminal/commandRegistry";

/**
 * Assemble a plain-text context payload for the LLM.
 * Excludes ASCII art (not useful to the model) and placeholder noise.
 */
export function buildContext(): string {
  const lines: string[] = [];

  // ── Personal intro ──────────────────────────────────────────────────────────
  lines.push(`=== About ${HERO_CONTENT.name} ===`);
  lines.push(`Name: ${HERO_CONTENT.name}`);
  lines.push(`Title: ${HERO_CONTENT.tagline}`);
  HERO_CONTENT.intro.forEach((l) => lines.push(l));
  lines.push("");

  // ── Sections ─────────────────────────────────────────────────────────────────
  for (const section of [PM_CONTENT, AI_CONTENT, PROJECTS_CONTENT]) {
    lines.push(`=== ${section.title} ===`);
    if (section.status === "placeholder") {
      lines.push("[Note: Content is a placeholder; full details coming soon.]");
    }
    lines.push(section.summary);
    section.details.forEach((d) => lines.push(d));
    lines.push("");
  }

  // ── Contact ──────────────────────────────────────────────────────────────────
  lines.push("=== Contact ===");
  lines.push(`Email: ${contact.email}`);
  contact.links.forEach((l) => lines.push(`${l.label}: ${l.url}`));
  lines.push(`Resume: ${contact.resumePath}`);
  lines.push("");

  // ── Available slash commands ──────────────────────────────────────────────────
  lines.push("=== Available Slash Commands ===");
  lines.push("Users navigate the site with slash-prefixed commands:");
  COMMAND_REGISTRY.filter((c) => !c.hidden).forEach((c) => {
    const usage = c.usage ?? `/${c.names[0]}`;
    lines.push(`  ${usage} — ${c.summary}`);
  });
  lines.push("");

  return lines.join("\n");
}
