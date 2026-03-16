import { describe, it, expect } from "vitest";
import { pushHistory, MAX_HISTORY_LENGTH } from "../lib/terminal/history";

describe("pushHistory", () => {
  it("adds a command to an empty history", () => {
    const result = pushHistory([], "about");
    expect(result).toEqual(["about"]);
  });

  it("prepends most recent entry at index 0", () => {
    const result = pushHistory(["contact"], "about");
    expect(result[0]).toBe("about");
    expect(result[1]).toBe("contact");
  });

  it("does not add empty string", () => {
    const result = pushHistory(["about"], "");
    expect(result).toEqual(["about"]);
  });

  it("does not add whitespace-only string", () => {
    const result = pushHistory(["about"], "   ");
    expect(result).toEqual(["about"]);
  });

  it("trims the command before adding", () => {
    const result = pushHistory([], "  about  ");
    expect(result[0]).toBe("about");
  });

  it("skips consecutive duplicate (no-op)", () => {
    const result = pushHistory(["about"], "about");
    expect(result).toEqual(["about"]);
  });

  it("allows non-consecutive duplicates", () => {
    const result = pushHistory(["contact", "about"], "about");
    expect(result[0]).toBe("about");
    expect(result[1]).toBe("contact");
    expect(result[2]).toBe("about");
    expect(result.length).toBe(3);
  });

  it("does not mutate the input array", () => {
    const original = ["contact"];
    const result = pushHistory(original, "about");
    expect(original).toEqual(["contact"]);
    expect(result).not.toBe(original);
  });

  it("trims to MAX_HISTORY_LENGTH when exceeded", () => {
    const full = Array.from({ length: MAX_HISTORY_LENGTH }, (_, i) => `cmd${i}`);
    const result = pushHistory(full, "newcmd");
    expect(result.length).toBe(MAX_HISTORY_LENGTH);
    expect(result[0]).toBe("newcmd");
  });

  it("does not trim when at exactly MAX_HISTORY_LENGTH - 1", () => {
    const almostFull = Array.from({ length: MAX_HISTORY_LENGTH - 1 }, (_, i) => `cmd${i}`);
    const result = pushHistory(almostFull, "newcmd");
    expect(result.length).toBe(MAX_HISTORY_LENGTH);
  });

  it("MAX_HISTORY_LENGTH is 100", () => {
    expect(MAX_HISTORY_LENGTH).toBe(100);
  });
});
