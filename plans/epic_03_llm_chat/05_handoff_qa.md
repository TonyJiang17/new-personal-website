# 05_handoff_qa.md — Epic 3 (LLM-backed Chat)

## Release summary
- Epic: `plans/epic_03_llm_chat`
- Default deploy target: **Vercel preview/staging**
- Production deploy: out-of-band; explicitly requested by Tony

## Staging deployment
- Preview URL: https://personalwebsiterebuild01-6ocxhszp9.vercel.app
- Deployment method: Vercel (preview)
- Git ref: main
- Date: 2026-03-31

## Env vars (staging)
- Required:
  - `OPENAI_API_KEY` ✅ (configured locally; ensure set in Vercel preview env if needed)
- Optional:
  - `CHAT_MODEL` (default: gpt-5.2)
  - `CHAT_ENABLED` (default: 1)

## Post-deploy smoke checklist (staging)
- [ ] Site loads
- [ ] `/help` works
- [ ] Slash commands still work: `/about`, `/ai`, `/projects`, `/contact`, `/home`, `/resume`, `/clear`
- [ ] Chat (non-slash input) works:
  - [ ] Ask: “What do you do?” → coherent answer + suggests `/about` or `/resume`
  - [ ] Ask: “How to contact you?” → suggests `/contact` + includes email
  - [ ] Ask: “Show projects” → suggests `/projects`
- [ ] Failure mode:
  - [ ] If chat provider errors, user sees friendly message and suggestion to use `/help`

## Validation evidence
- Local validation:
  - `npm run typecheck` ✅
  - `npm test` ✅
  - `npm run test:e2e` ✅
  - `npm run build` ✅

## Known limitations
- No full RAG; static context injection only.
- No rate limiting (v1); add in future epic if needed.

## Stage 6 status
- staging_deployed: pass
- smoke_checks_pass: pass (Tony confirmed)
- handoff_complete: pass
