# 02_requirements.md — Epic 3: LLM-backed Chat

Epic folder: `plans/epic_03_llm_chat`
Trigger: Feedback batch `feedback/2026-03-31_batch.md` (FB-001)

## Objective
Add an LLM-backed chat experience to the terminal interface so users can ask questions in natural language and receive helpful answers, including recommendations for relevant slash commands.

## UX / behavior requirements
### Input routing
- If user input begins with `/`, treat as a command (existing behavior).
- Otherwise, treat input as **chat**.

### Chat behavior
- Chat should:
  - answer questions about Tony based on the public site content (and optionally resume)
  - suggest relevant commands when appropriate (e.g. “Try `/projects`”)
  - be concise and non-hyperbolic
- Chat must **not** take actions beyond responding (no tool execution).

### Guardrails
- No sensitive data access.
- Only use sources that are explicitly public in the repo/site (e.g. sections content, resume PDF if included).
- Add basic prompt-injection resistance: user input must not override system instructions.

### Failure modes
- If the LLM is unavailable or rate-limited:
  - show a friendly fallback message and suggest `/help`.

## Scope
### In scope
- Chat API endpoint (server-side) to call an LLM provider.
- Minimal “knowledge base”:
  - use `content/sections.ts` as primary source of truth
  - optionally include text extracted from `public/resume.pdf`
- Response streaming is optional; non-streaming is acceptable for v1.
- Telemetry/logging (minimal) for debugging errors.

### Out of scope (for v1)
- Full RAG system / vector database
- User accounts / persistence
- Long-term memory
- External tool calling

## Provider / model
Default recommendation for v1:
- Provider: Anthropic (Claude)
- Model: Sonnet-class

## Success criteria
- Non-slash inputs return a relevant, helpful response.
- Responses frequently suggest relevant slash commands.
- Existing slash commands and navigation continue to work.
- Staging deploy on Vercel works reliably.

## Acceptance tests
- Manual:
  - Ask “What do you do?” → coherent answer; suggests `/resume` or `/about`
  - Ask “How to contact you?” → suggests `/contact` and includes email
  - Ask “Show projects” → suggests `/projects`
- Automated:
  - unit tests for routing: slash vs chat
  - mocked API tests for chat endpoint

## Open questions (Tony)
1) Should chat use `public/resume.pdf` as a source, or only `content/sections.ts`?
2) Do you want streaming responses (typing effect) or standard responses?
3) Do you want a visible “Chat is powered by Claude” footer/attribution?
