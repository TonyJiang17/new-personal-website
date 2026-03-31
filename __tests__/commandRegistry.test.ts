import { describe, it, expect } from "vitest";
import {
  COMMAND_REGISTRY,
  lookupCommand,
  visibleCommands,
  allCommandNames,
} from "../lib/terminal/commandRegistry";

describe("COMMAND_REGISTRY", () => {
  it("contains all required MVP commands", () => {
    const ids = COMMAND_REGISTRY.map((c) => c.id);
    for (const required of ["help", "home", "about", "ai", "projects", "contact", "resume", "clear"]) {
      expect(ids).toContain(required);
    }
  });

  it("every command has a non-empty summary", () => {
    for (const cmd of COMMAND_REGISTRY) {
      expect(cmd.summary.length).toBeGreaterThan(0);
    }
  });

  it("every command has at least one name", () => {
    for (const cmd of COMMAND_REGISTRY) {
      expect(cmd.names.length).toBeGreaterThan(0);
    }
  });

  it("every command usage starts with /", () => {
    for (const cmd of COMMAND_REGISTRY) {
      if (cmd.usage) {
        expect(cmd.usage.startsWith("/"), `usage for "${cmd.id}" should start with /`).toBe(true);
      }
    }
  });

  it("no alias collisions across all commands (test-time sanity check)", () => {
    const seen = new Map<string, string>();
    for (const cmd of COMMAND_REGISTRY) {
      for (const name of cmd.names) {
        expect(seen.has(name), `Collision: "${name}" already registered to "${seen.get(name)}"`).toBe(false);
        seen.set(name, cmd.id);
      }
    }
  });
});

describe("lookupCommand", () => {
  it("resolves canonical names", () => {
    expect(lookupCommand("help")?.id).toBe("help");
    expect(lookupCommand("about")?.id).toBe("about");
    expect(lookupCommand("projects")?.id).toBe("projects");
  });

  it("resolves aliases", () => {
    expect(lookupCommand("pm")?.id).toBe("about");
    expect(lookupCommand("who")?.id).toBe("about");
    expect(lookupCommand("builder")?.id).toBe("ai");
    expect(lookupCommand("work")?.id).toBe("projects");
    expect(lookupCommand("portfolio")?.id).toBe("projects");
    expect(lookupCommand("links")?.id).toBe("contact");
    expect(lookupCommand("email")?.id).toBe("contact");
    expect(lookupCommand("cv")?.id).toBe("resume");
    expect(lookupCommand("cls")?.id).toBe("clear");
    expect(lookupCommand("?")?.id).toBe("help");
  });

  it("is case-insensitive", () => {
    expect(lookupCommand("HELP")?.id).toBe("help");
    expect(lookupCommand("Projects")?.id).toBe("projects");
  });

  it("returns undefined for unknown command", () => {
    expect(lookupCommand("foobarqux")).toBeUndefined();
  });
});

describe("visibleCommands", () => {
  it("excludes hidden commands", () => {
    const visible = visibleCommands();
    for (const cmd of visible) {
      expect(cmd.hidden).toBeFalsy();
    }
  });

  it("includes all non-hidden MVP commands", () => {
    const visibleIds = visibleCommands().map((c) => c.id);
    for (const id of ["help", "about", "ai", "projects", "contact", "resume", "clear"]) {
      expect(visibleIds).toContain(id);
    }
  });
});

describe("allCommandNames", () => {
  it("includes canonical names", () => {
    const names = allCommandNames();
    expect(names).toContain("help");
    expect(names).toContain("projects");
    expect(names).toContain("clear");
  });

  it("includes aliases", () => {
    const names = allCommandNames();
    expect(names).toContain("pm");
    expect(names).toContain("cv");
    expect(names).toContain("cls");
  });
});
