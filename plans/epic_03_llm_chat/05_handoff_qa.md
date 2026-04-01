# Epic 03 — LLM Chat: Handoff + QA

## Preview URL
- https://personalwebsiterebuild01-27q82qncq.vercel.app

## What shipped
- Non-slash input now triggers a `CHAT_REQUEST` terminal effect and calls `POST /api/chat`.
- Assistant reply is appended into the transcript.
- If the API returns `suggestedCommands`, the terminal prints a `Suggested: /...` line.
- Server route hardened system prompt framing against prompt injection.
- v1 ships **without rate limiting** (TODOs + constants added for follow-up).

## Env vars (Vercel)
- `OPENAI_API_KEY` (required for real replies)
- `CHAT_MODEL` (optional; defaults to `gpt-5.2`)
- `CHAT_ENABLED` (optional; default `1`; set `0` to disable)

## Smoke checklist (manual)
1. Load `/`:
   - Welcome message visible
   - Input focused
2. Slash commands still work:
   - `/help` shows command list
   - `/about`, `/ai`, `/projects`, `/contact` render expected headings
3. Non-slash chat path:
   - Type `hello` (no leading slash)
   - Terminal prints `Assistant is thinking…`
   - Then prints an assistant response (if `OPENAI_API_KEY` set) OR friendly fallback with `/help`.
4. Suggested commands rendering (only if provider returns them):
   - Ask something like: `how do I contact Tony?`
   - Expect a `Suggested: /contact, /resume` style line.
5. Unknown slash commands:
   - `/foobarqux` shows `command not found` and a `/help` hint.

## Automated checks run locally
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`
- `npm run build`
