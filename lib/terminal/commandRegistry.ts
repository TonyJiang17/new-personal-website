// lib/terminal/commandRegistry.ts
// Canonical command definitions for the terminal experience.
// Every command navigation or action must be registered here.

export type RouteId = "home" | "about" | "ai" | "projects" | "contact";

export type ActionId = "resume" | "clear";

export type CommandId =
  | "help"
  | "home"
  | "about"
  | "ai"
  | "projects"
  | "contact"
  | "resume"
  | "clear";

export interface CommandDef {
  id: CommandId;
  /** All accepted names: canonical name first, then aliases. */
  names: string[];
  summary: string;
  usage?: string;
  /** If this command navigates to a section route. */
  route?: RouteId;
  /** If this command triggers a side-effect action. */
  action?: ActionId;
  /** Hide from help output (reserved for internal/future commands). */
  hidden?: boolean;
}

export const COMMAND_REGISTRY: CommandDef[] = [
  {
    id: "help",
    names: ["help", "?"],
    summary: "List available commands and usage",
    usage: "/help",
  },
  {
    id: "home",
    names: ["home"],
    summary: "Go to the home / hero section",
    usage: "/home",
    route: "home",
  },
  {
    id: "about",
    names: ["about", "pm", "who"],
    summary: "View the Product Manager section",
    usage: "/about",
    route: "about",
  },
  {
    id: "ai",
    names: ["ai", "builder"],
    summary: "View the AI Product Builder section",
    usage: "/ai",
    route: "ai",
  },
  {
    id: "projects",
    names: ["projects", "work", "portfolio"],
    summary: "Browse all projects (use `/project <name>` to drill in)",
    usage: "/projects | /project <name>",
    route: "projects",
  },
  {
    id: "contact",
    names: ["contact", "links", "email"],
    summary: "View contact information and links",
    usage: "/contact",
    route: "contact",
  },
  {
    id: "resume",
    names: ["resume", "cv"],
    summary: "Open / download resume PDF",
    usage: "/resume",
    action: "resume",
  },
  {
    id: "clear",
    names: ["clear", "cls"],
    summary: "Clear the terminal transcript",
    usage: "/clear",
    action: "clear",
  },
];

/** Lookup map: every accepted name (incl. aliases) → CommandDef. Built once. */
const _nameIndex = new Map<string, CommandDef>();

for (const cmd of COMMAND_REGISTRY) {
  for (const name of cmd.names) {
    if (_nameIndex.has(name)) {
      throw new Error(
        `commandRegistry: alias collision — "${name}" is registered to both ` +
          `"${_nameIndex.get(name)!.id}" and "${cmd.id}"`
      );
    }
    _nameIndex.set(name, cmd);
  }
}

/** Resolve a command name (or alias) to its CommandDef, or undefined. */
export function lookupCommand(name: string): CommandDef | undefined {
  return _nameIndex.get(name.toLowerCase());
}

/** All visible commands (for help output). */
export function visibleCommands(): CommandDef[] {
  return COMMAND_REGISTRY.filter((c) => !c.hidden);
}

/** All registered names (canonical + aliases), for suggestion/fuzzy matching. */
export function allCommandNames(): string[] {
  return Array.from(_nameIndex.keys());
}
