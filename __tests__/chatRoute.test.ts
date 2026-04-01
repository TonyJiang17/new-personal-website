// __tests__/chatRoute.test.ts
// WI-1.4: Unit tests for POST /api/chat route handler (mocked OpenAI provider).

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";

// ── Hoisted mock: OpenAI ────────────────────────────────────────────────────
// vi.hoisted ensures mockCreate is accessible inside the vi.mock() factory,
// which is hoisted before module-level code runs.
const mockCreate = vi.hoisted(() => vi.fn());

vi.mock("openai", () => ({
  // Regular function (not arrow) so `new OpenAI()` works as a constructor call.
  default: vi.fn().mockImplementation(function MockOpenAI() {
    return { chat: { completions: { create: mockCreate } } };
  }),
}));

// ── Mock next/server ─────────────────────────────────────────────────────────
// Avoids depending on the Next.js runtime in a pure vitest environment.
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      _data: data,
      status: (init as { status?: number } | undefined)?.status ?? 200,
    })),
  },
}));

// Import after mocks are registered.
import { POST } from "@/app/api/chat/route";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

type MockResponse = { _data: unknown; status: number };

async function callPOST(body: unknown): Promise<MockResponse> {
  return POST(makeRequest(body)) as unknown as Promise<MockResponse>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = "test-key-abc";
    process.env.CHAT_ENABLED = "1";
    process.env.CHAT_MODEL = "gpt-test";

    // Default happy-path mock response
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              reply: "Tony is a PM and AI engineer.",
              suggestedCommands: ["/about", "/ai"],
            }),
          },
        },
      ],
    });
  });

  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.CHAT_ENABLED;
    delete process.env.CHAT_MODEL;
  });

  // ── Happy path ──────────────────────────────────────────────────────────────

  it("returns 200 with reply on a valid message", async () => {
    const res = await callPOST({ message: "Who is Tony?" });
    expect(res.status).toBe(200);
    expect((res._data as { reply: string }).reply).toBe("Tony is a PM and AI engineer.");
  });

  it("returns suggestedCommands when provider includes them", async () => {
    const res = await callPOST({ message: "Tell me about Tony" });
    expect((res._data as { suggestedCommands: string[] }).suggestedCommands).toEqual(["/about", "/ai"]);
  });

  it("omits suggestedCommands when provider returns empty array", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ reply: "Hello!" }) } }],
    });
    const res = await callPOST({ message: "Hi" });
    expect((res._data as Record<string, unknown>).suggestedCommands).toBeUndefined();
  });

  it("calls OpenAI with the configured model", async () => {
    await callPOST({ message: "test" });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: "gpt-test" })
    );
  });

  it("passes a system message and the user message", async () => {
    await callPOST({ message: "Who is Tony?" });
    const call = mockCreate.mock.calls[0][0] as { messages: { role: string; content: string }[] };
    expect(call.messages[0].role).toBe("system");
    expect(call.messages[1].role).toBe("user");
    expect(call.messages[1].content).toBe("Who is Tony?");
  });

  it("injects context into the system prompt", async () => {
    await callPOST({ message: "test" });
    const call = mockCreate.mock.calls[0][0] as { messages: { role: string; content: string }[] };
    const systemContent = call.messages[0].content;
    // Context includes Tony's name and a command list
    expect(systemContent).toContain("Tony Jiang");
    expect(systemContent).toContain("/about");
  });

  it("requests json_object response format", async () => {
    await callPOST({ message: "test" });
    const call = mockCreate.mock.calls[0][0] as { response_format: { type: string } };
    expect(call.response_format).toEqual({ type: "json_object" });
  });

  // ── Feature flag disabled ───────────────────────────────────────────────────

  it("returns 503 when CHAT_ENABLED=0", async () => {
    process.env.CHAT_ENABLED = "0";
    const res = await callPOST({ message: "hello" });
    expect(res.status).toBe(503);
    expect((res._data as { reply: string }).reply).toMatch(/disabled/i);
  });

  it("does not call OpenAI when CHAT_ENABLED=0", async () => {
    process.env.CHAT_ENABLED = "0";
    await callPOST({ message: "hello" });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ── Missing API key ─────────────────────────────────────────────────────────

  it("returns 503 when OPENAI_API_KEY is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    const res = await callPOST({ message: "hello" });
    expect(res.status).toBe(503);
    expect((res._data as { reply: string }).reply).toMatch(/unavailable/i);
  });

  it("does not call OpenAI when API key is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    await callPOST({ message: "hello" });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ── Input validation ────────────────────────────────────────────────────────

  it("returns 400 for missing message field", async () => {
    const res = await callPOST({});
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-string message", async () => {
    const res = await callPOST({ message: 42 });
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty string message", async () => {
    const res = await callPOST({ message: "   " });
    expect(res.status).toBe(400);
  });

  // ── Provider error ──────────────────────────────────────────────────────────

  it("returns 503 when OpenAI throws", async () => {
    mockCreate.mockRejectedValue(new Error("Network error"));
    const res = await callPOST({ message: "hello" });
    expect(res.status).toBe(503);
    expect((res._data as { reply: string }).reply).toMatch(/unavailable/i);
  });

  // ── Fallback when provider returns malformed JSON ───────────────────────────

  it("falls back gracefully when provider returns non-JSON", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "plain text response" } }],
    });
    const res = await callPOST({ message: "hello" });
    expect(res.status).toBe(200);
    // The fallback reply should be non-empty
    expect((res._data as { reply: string }).reply.length).toBeGreaterThan(0);
  });

  it("falls back gracefully when provider returns JSON without reply field", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ unexpected: "field" }) } }],
    });
    const res = await callPOST({ message: "hello" });
    expect(res.status).toBe(200);
    expect((res._data as { reply: string }).reply).toBeTruthy();
  });

  // ── NextResponse.json spy ───────────────────────────────────────────────────

  it("calls NextResponse.json with the reply object", async () => {
    await callPOST({ message: "Who is Tony?" });
    expect(vi.mocked(NextResponse.json)).toHaveBeenCalledWith(
      expect.objectContaining({ reply: "Tony is a PM and AI engineer." })
    );
  });
});
