// __tests__/state.test.ts
// Unit tests for terminalReducer — WI-3.2 (clear preserves hero)

import { describe, it, expect, beforeAll, vi } from "vitest";
import { terminalReducer, makeInitialState } from "../lib/terminal/state";

// jsdom doesn't implement matchMedia — stub it before any state is created.
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("clear command — WI-3.1", () => {
  it("produces exactly 2 transcript entries: welcome + section", () => {
    const initial = makeInitialState();
    const { state } = terminalReducer(initial, { type: "SUBMIT_INPUT" });
    // Set up: submit /clear
    const withInput = { ...initial, input: "/clear" };
    const { state: after } = terminalReducer(withInput, { type: "SUBMIT_INPUT" });

    expect(after.transcript).toHaveLength(2);
    expect(after.transcript[0].kind).toBe("system");
    expect(after.transcript[0].text).toMatch(/Welcome/);
    expect(after.transcript[1].kind).toBe("section");
  });

  it("re-renders the home section when route is home", () => {
    const initial = makeInitialState();
    const withInput = { ...initial, input: "/clear", route: "home" as const };
    const { state: after } = terminalReducer(withInput, { type: "SUBMIT_INPUT" });

    expect(after.transcript[1].route).toBe("home");
  });

  it("resets view to home even if current route is not home", () => {
    const initial = makeInitialState();
    const withInput = { ...initial, input: "/clear", route: "about" as const };
    const { state: after } = terminalReducer(withInput, { type: "SUBMIT_INPUT" });

    expect(after.route).toBe("home");
    expect(after.transcript[1].route).toBe("home");
  });

  it("also works via /cls alias", () => {
    const initial = makeInitialState();
    const withInput = { ...initial, input: "/cls" };
    const { state: after } = terminalReducer(withInput, { type: "SUBMIT_INPUT" });

    expect(after.transcript).toHaveLength(2);
    expect(after.transcript[0].kind).toBe("system");
    expect(after.transcript[1].kind).toBe("section");
  });

  it("clears input and resets historyIndex", () => {
    const initial = makeInitialState();
    const withInput = { ...initial, input: "/clear" };
    const { state: after } = terminalReducer(withInput, { type: "SUBMIT_INPUT" });

    expect(after.input).toBe("");
    expect(after.historyIndex).toBeNull();
    expect(after.suggestions).toHaveLength(0);
  });

  it("emits PERSIST_HISTORY effect", () => {
    const initial = makeInitialState();
    const withInput = { ...initial, input: "/clear" };
    const { effects } = terminalReducer(withInput, { type: "SUBMIT_INPUT" });

    const persistEffect = effects.find((e) => e.type === "PERSIST_HISTORY");
    expect(persistEffect).toBeDefined();
  });
});

describe("CLEAR_TRANSCRIPT event — WI-3.1", () => {
  it("produces welcome + section entries (not empty)", () => {
    const initial = makeInitialState();
    const { state: after } = terminalReducer(initial, { type: "CLEAR_TRANSCRIPT" });

    expect(after.transcript).toHaveLength(2);
    expect(after.transcript[0].kind).toBe("system");
    expect(after.transcript[1].kind).toBe("section");
  });

  it("resets route to home", () => {
    const initial = { ...makeInitialState(), route: "projects" as const };
    const { state: after } = terminalReducer(initial, { type: "CLEAR_TRANSCRIPT" });

    expect(after.route).toBe("home");
    expect(after.transcript[1].route).toBe("home");
  });
});
