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

    it("returns isEmpty=true for bare slash", () => {
      const r = parseInput("/");
      expect(r.isEmpty).toBe(true);
      expect(r.command).toBe("");
    });
  });

  describe("isSlashCommand", () => {
    it("sets isSlashCommand=true when input starts with /", () => {
      expect(parseInput("/help").isSlashCommand).toBe(true);
      expect(parseInput("/about").isSlashCommand).toBe(true);
      expect(parseInput("/ help").isSlashCommand).toBe(true);
    });

    it("sets isSlashCommand=false when input does not start with /", () => {
      expect(parseInput("help").isSlashCommand).toBe(false);
      expect(parseInput("about").isSlashCommand).toBe(false);
      expect(parseInput("hello world").isSlashCommand).toBe(false);
    });

    it("empty input has isSlashCommand=false", () => {
      expect(parseInput("").isSlashCommand).toBe(false);
    });
  });

  describe("slash command parsing — strips leading /", () => {
    it("strips / and parses command correctly", () => {
      const r = parseInput("/help");
      expect(r.command).toBe("help");
      expect(r.isEmpty).toBe(false);
    });

    it("lowercases the command from /HELP", () => {
      expect(parseInput("/HELP").command).toBe("help");
    });

    it("parses /project <name> with args", () => {
      const r = parseInput("/project myapp");
      expect(r.command).toBe("project");
      expect(r.args).toEqual(["myapp"]);
    });

    it("parses /help --verbose flag", () => {
      const r = parseInput("/help --verbose");
      expect(r.command).toBe("help");
      expect(r.flags["--verbose"]).toBe(true);
    });

    it("preserves raw input verbatim", () => {
      const raw = "/help  ";
      expect(parseInput(raw).raw).toBe(raw);
    });
  });

  describe("non-slash command parsing — preserves command for suggestion logic", () => {
    it("parses command from non-slash input (for suggestion lookup)", () => {
      const r = parseInput("about");
      expect(r.command).toBe("about");
      expect(r.isSlashCommand).toBe(false);
    });

    it("lowercases non-slash command", () => {
      expect(parseInput("HELP").command).toBe("help");
    });

    it("trims leading whitespace", () => {
      expect(parseInput("  about").command).toBe("about");
    });

    it("trims trailing whitespace", () => {
      expect(parseInput("contact  ").command).toBe("contact");
    });

    it("preserves raw input verbatim for non-slash", () => {
      const raw = "  HELP  ";
      expect(parseInput(raw).raw).toBe(raw);
    });
  });

  describe("positional arguments", () => {
    it("captures a single positional arg (slash)", () => {
      const r = parseInput("/project myapp");
      expect(r.command).toBe("project");
      expect(r.args).toEqual(["myapp"]);
    });

    it("captures multiple positional args (slash)", () => {
      const r = parseInput("/project foo bar");
      expect(r.args).toEqual(["foo", "bar"]);
    });

    it("preserves arg case (slash)", () => {
      const r = parseInput("/project MyProject");
      expect(r.args).toEqual(["MyProject"]);
    });
  });

  describe("quoted arguments", () => {
    it("handles double-quoted argument (slash)", () => {
      const r = parseInput('/project "my project"');
      expect(r.args).toEqual(["my project"]);
    });

    it("handles single-quoted argument (slash)", () => {
      const r = parseInput("/project 'my project'");
      expect(r.args).toEqual(["my project"]);
    });

    it("handles escaped quote inside double quotes (slash)", () => {
      const r = parseInput('/project "say \\"hello\\""');
      expect(r.args).toEqual(['say "hello"']);
    });

    it("is lenient with unclosed quotes (slash)", () => {
      const r = parseInput('/project "unclosed');
      expect(r.args).toEqual(["unclosed"]);
    });
  });

  describe("flags", () => {
    it("parses a long flag (slash)", () => {
      const r = parseInput("/help --verbose");
      expect(r.flags["--verbose"]).toBe(true);
    });

    it("lowercases long flags (slash)", () => {
      const r = parseInput("/help --Verbose");
      expect(r.flags["--verbose"]).toBe(true);
    });

    it("expands short flags -abc → -a, -b, -c (slash)", () => {
      const r = parseInput("/help -abc");
      expect(r.flags["-a"]).toBe(true);
      expect(r.flags["-b"]).toBe(true);
      expect(r.flags["-c"]).toBe(true);
    });

    it("flags are not included in args (slash)", () => {
      const r = parseInput("/help --verbose foo");
      expect(r.args).toEqual(["foo"]);
      expect(r.flags["--verbose"]).toBe(true);
    });
  });

  describe("isEmpty=false", () => {
    it("sets isEmpty=false for non-empty slash command", () => {
      expect(parseInput("/help").isEmpty).toBe(false);
    });

    it("sets isEmpty=false for non-empty non-slash input", () => {
      expect(parseInput("help").isEmpty).toBe(false);
    });
  });
});
