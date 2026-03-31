# 04_work_orders.md — Epic 3: LLM-backed Chat

## Phase 1 — API route + context injection
- WI-1.1 Build a static context string from `content/sections.ts`.
- WI-1.2 Implement `POST /api/chat` route handler.
- WI-1.3 Add provider client + env var wiring.
- WI-1.4 Unit tests for API route (mock provider).

## Phase 2 — Terminal integration
- WI-2.1 Replace non-slash “chat coming soon” path with CHAT_REQUEST.
- WI-2.2 Implement effect runner to call `/api/chat` and append transcript entries.
- WI-2.3 Add basic “suggested commands” rendering.
- WI-2.4 Update e2e smoke to include one chat exchange.

## Phase 3 — Hardening (minimal)
- WI-3.1 Add basic injection-resistant system prompt template.
- WI-3.2 Add minimal rate limit (if chosen for v1).
- WI-3.3 Error fallback (provider down) → friendly message + `/help`.

## Phase 4 — Stage 6 (staging)
- WI-6.1 Local validation: typecheck/test/e2e/build.
- WI-6.2 Deploy to Vercel preview.
- WI-6.3 Smoke: chat works + slash commands still work.
