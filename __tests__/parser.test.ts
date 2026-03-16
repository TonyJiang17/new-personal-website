import { describe, it, expect } from "vitest";
import { parseInput } from "../lib/terminal/parser";

describe("parseInput", () => {
  describe("empty / whitespace input", () => {
    it("returns isEmpty=true for empty string", () => {
      const r = parseInput("");
      expect(r.isEmpty).toBe(true);
      expect(r.command).toBe("");
      expect(r.args).toEqual([]);
    });

    it("returns isEmpty=true for whitespace-only string", () => {
      const r = parseInput("   \t  ");
      expect(r.isEmpty).toBe(true);
      expect(r.command).toBe("");
    });
  });

  describe("command normalization", () => {
    it("lowercases the command", () => {
      expect(parseInput("HELP").command).toBe("help");
      expect(parseInput("Projects").command).toBe("projects");
    });

    it("trims leading whitespace", () => {
      expect(parseInput("  about").command).toBe("about");
    });

    it("trims trailing whitespace", () => {
      expect(parseInput("contact  ").command).toBe("contact");
    });

    it("preserves raw input verbatim", () => {
      const raw = "  HELP  ";
      expect(parseInput(raw).raw).toBe(raw);
    });
  });

  describe("positional arguments", () => {
    it("captures a single positional arg", () => {
      const r = parseInput("project myapp");
      expect(r.command).toBe("project");
      expect(r.args).toEqual(["myapp"]);
    });

    it("captures multiple positional args", () => {
      const r = parseInput("project foo bar");
      expect(r.args).toEqual(["foo", "bar"]);
    });

    it("preserves arg case", () => {
      const r = parseInput("project MyProject");
      expect(r.args).toEqual(["MyProject"]);
    });
  });

  describe("quoted arguments", () => {
    it("handles double-quoted argument", () => {
      const r = parseInput('project "my project"');
      expect(r.args).toEqual(["my project"]);
    });

    it("handles single-quoted argument", () => {
      const r = parseInput("project 'my project'");
      expect(r.args).toEqual(["my project"]);
    });

    it("handles escaped quote inside double quotes", () => {
      const r = parseInput('project "say \\"hello\\""');
      expect(r.args).toEqual(['say "hello"']);
    });

    it("is lenient with unclosed quotes", () => {
      const r = parseInput('project "unclosed');
      expect(r.args).toEqual(["unclosed"]);
    });
  });

  describe("flags", () => {
    it("parses a long flag", () => {
      const r = parseInput("help --verbose");
      expect(r.flags["--verbose"]).toBe(true);
    });

    it("lowercases long flags", () => {
      const r = parseInput("help --Verbose");
      expect(r.flags["--verbose"]).toBe(true);
    });

    it("expands short flags (-abc → -a, -b, -c)", () => {
      const r = parseInput("help -abc");
      expect(r.flags["-a"]).toBe(true);
      expect(r.flags["-b"]).toBe(true);
      expect(r.flags["-c"]).toBe(true);
    });

    it("flags are not included in args", () => {
      const r = parseInput("help --verbose foo");
      expect(r.args).toEqual(["foo"]);
      expect(r.flags["--verbose"]).toBe(true);
    });
  });

  describe("isEmpty=false", () => {
    it("sets isEmpty=false for non-empty command", () => {
      expect(parseInput("help").isEmpty).toBe(false);
    });
  });
});
