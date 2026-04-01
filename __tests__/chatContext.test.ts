// __tests__/chatContext.test.ts
// WI-1.4: Unit tests for the static context builder (lib/chat/context.ts).

import { describe, it, expect } from "vitest";
import { buildContext } from "@/lib/chat/context";

describe("buildContext", () => {
  let ctx: string;

  // Build once — it's a pure function with no IO.
  ctx = buildContext();

  it("includes Tony's name", () => {
    expect(ctx).toContain("Tony Jiang");
  });

  it("includes the tagline", () => {
    expect(ctx).toContain("Product Manager");
    expect(ctx).toContain("AI Researcher");
  });

  it("includes intro lines", () => {
    expect(ctx).toContain("MIT LGO Fellow");
    expect(ctx).toContain("AWS GenAI Innovation Center");
  });

  it("includes PM section content", () => {
    expect(ctx).toContain("TikTok");
    expect(ctx).toContain("Salesforce");
  });

  it("includes AI section content", () => {
    expect(ctx).toContain("multi-agent");
    expect(ctx).toContain("CVPR");
  });

  it("includes projects section with placeholder note", () => {
    expect(ctx).toContain("Projects");
    expect(ctx).toContain("placeholder");
  });

  it("includes contact email", () => {
    expect(ctx).toContain("tjiang217@gmail.com");
  });

  it("includes contact links", () => {
    expect(ctx).toContain("LinkedIn");
    expect(ctx).toContain("GitHub");
  });

  it("lists available slash commands", () => {
    expect(ctx).toContain("/help");
    expect(ctx).toContain("/about");
    expect(ctx).toContain("/ai");
    expect(ctx).toContain("/contact");
    expect(ctx).toContain("/resume");
  });

  it("does not include ASCII art characters in bulk", () => {
    // The context should not include the long ASCII art dot patterns
    // (thousands of · chars) — they waste tokens and aren't useful.
    const dotRunCount = (ctx.match(/·{10,}/g) ?? []).length;
    expect(dotRunCount).toBe(0);
  });

  it("returns a non-empty string", () => {
    expect(ctx.length).toBeGreaterThan(100);
  });
});
