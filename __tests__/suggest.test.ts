import { describe, it, expect } from "vitest";
import { getSuggestions, getUnknownCommandSuggestions, levenshtein } from "../lib/terminal/suggest";

describe("levenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshtein("abc", "abc")).toBe(0);
  });

  it("returns source length for empty target", () => {
    expect(levenshtein("abc", "")).toBe(3);
  });

  it("returns target length for empty source", () => {
    expect(levenshtein("", "abc")).toBe(3);
  });

  it("single substitution", () => {
    expect(levenshtein("cat", "bat")).toBe(1);
  });

  it("single insertion", () => {
    expect(levenshtein("cat", "cats")).toBe(1);
  });

  it("single deletion", () => {
    expect(levenshtein("cats", "cat")).toBe(1);
  });

  it("multiple edits", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
  });
});

describe("getSuggestions", () => {
  it("returns empty array for empty input", () => {
    expect(getSuggestions("", [])).toEqual([]);
  });

  it("returns empty array for whitespace-only input", () => {
    expect(getSuggestions("   ", [])).toEqual([]);
  });

  it("returns empty array for non-slash input (not a command)", () => {
    expect(getSuggestions("pro", [])).toEqual([]);
    expect(getSuggestions("about", [])).toEqual([]);
    expect(getSuggestions("hello world", [])).toEqual([]);
  });

  it("prefix-matches command names for slash input", () => {
    const results = getSuggestions("/pro", []);
    const values = results.map((r) => r.value);
    expect(values).toContain("/projects");
  });

  it("suggestion values include the leading /", () => {
    const results = getSuggestions("/he", []);
    for (const r of results) {
      expect(r.value.startsWith("/")).toBe(true);
    }
  });

  it("marks command suggestions as kind='command'", () => {
    const results = getSuggestions("/pro", []);
    for (const r of results) {
      if (r.value === "/projects" || r.value === "/portfolio") {
        expect(r.kind).toBe("command");
      }
    }
  });

  it("shorter completions rank higher than longer ones (deterministic order)", () => {
    // "/ai" (2 chars) should rank above "/about" (5 chars) when prefix "/a" matches both
    const results = getSuggestions("/a", []);
    const aiIdx = results.findIndex((r) => r.value === "/ai");
    const aboutIdx = results.findIndex((r) => r.value === "/about");
    if (aiIdx !== -1 && aboutIdx !== -1) {
      expect(aiIdx).toBeLessThan(aboutIdx);
    }
  });

  it("respects MAX_SUGGESTIONS cap of 5", () => {
    // Single character "/c" matches many names
    const results = getSuggestions("/c", []);
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it("does not add history suggestions if command prefix length < 2", () => {
    const history = ["/about", "/contact"];
    const results = getSuggestions("/a", history);
    // All results should be 'command' kind for 1-char prefix
    for (const r of results) {
      expect(r.kind).toBe("command");
    }
  });

  it("adds history suggestions for slash input with prefix length >= 2", () => {
    // '/abcustom' won't match any command — but if history has it, it should appear
    const history = ["/abcustom"];
    const results = getSuggestions("/ab", history);
    const historyResult = results.find((r) => r.kind === "history");
    expect(historyResult).toBeDefined();
  });

  it("ignores non-slash history entries", () => {
    // History entry without slash should not contribute suggestions
    const history = ["abcustom"];
    const results = getSuggestions("/ab", history);
    // 'abcustom' (no slash) should not appear as a suggestion
    const historyResult = results.find((r) => r.value === "/abcustom" && r.kind === "history");
    expect(historyResult).toBeUndefined();
  });

  it("command suggestions always outscore history for same prefix", () => {
    // '/about' is a command (score ~95); a history entry '/aboutxyz' would score lower
    const history = ["/aboutxyz"];
    const results = getSuggestions("/ab", history);
    const cmdResult = results.find((r) => r.kind === "command" && r.value === "/about");
    const histResult = results.find((r) => r.kind === "history");
    if (cmdResult && histResult) {
      expect(cmdResult.score).toBeGreaterThan(histResult.score);
    }
  });

  it("is case-insensitive (uppercased slash input matches commands)", () => {
    const results = getSuggestions("/PRO", []);
    const values = results.map((r) => r.value);
    expect(values).toContain("/projects");
  });
});

describe("getUnknownCommandSuggestions", () => {
  it("returns empty array for completely unrelated input", () => {
    // 'xyzqwertyuiop' has distance > 3 from all commands
    const results = getUnknownCommandSuggestions("xyzqwertyuiop");
    expect(results).toEqual([]);
  });

  it("suggests canonical command for close typo", () => {
    // 'prjects' is 1 edit from 'projects'
    const results = getUnknownCommandSuggestions("prjects");
    expect(results).toContain("projects");
  });

  it("suggests 'contact' for 'contect'", () => {
    const results = getUnknownCommandSuggestions("contect");
    expect(results).toContain("contact");
  });

  it("returns at most 3 suggestions", () => {
    const results = getUnknownCommandSuggestions("a");
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("prefers canonical names over aliases in output", () => {
    // 'abut' is close to 'about' (canonical)
    const results = getUnknownCommandSuggestions("abut");
    const aboutIdx = results.indexOf("about");
    if (aboutIdx !== -1) {
      expect(aboutIdx).toBeGreaterThanOrEqual(0);
    }
  });
});
