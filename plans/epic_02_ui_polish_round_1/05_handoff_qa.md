# 05_handoff_qa.md — Epic 2 (UI Polish Round 1)

## Release summary
- Epic: `plans/epic_02_ui_polish_round_1`
- Default deploy target: **Vercel preview/staging**
- Production deploy: out-of-band; explicitly requested by Tony

## Staging deployment
- Preview URL: https://personalwebsiterebuild01-i22zcnc4y.vercel.app
- Deployment method: Vercel (preview)
- Git ref: branch `factory/epic2-phase4-stage6-deploy`
- Date: 2026-03-31

## Post-deploy smoke checklist (staging)
- [ ] Site loads
- [ ] Hero renders + ASCII portrait visible
- [ ] `/help` works
- [ ] Section navigation works: `/about`, `/ai`, `/projects`, `/contact`, `/home`
- [ ] Shareable URLs work (`/?r=...`)
- [ ] Resume link works (`/resume.pdf`) and `/resume` command works
- [ ] `clear` behavior:
  - [ ] `/clear` keeps hero visible
  - [ ] `/clear` always resets view to home
- [ ] Readable companion visible on desktop + link colors consistent

## Validation evidence
- Local validation (Phase 4):
  - `npm run typecheck` ✅
  - `npm run test` ✅
  - `npm run test:e2e` ✅
  - `npm run build` ✅

## Known limitations
- LLM chat experience is intentionally not implemented (Epic 3)
- Projects remain placeholder

## Stage 6 status
- staging_deployed: pass
- smoke_checks_pass: pending (Tony)
- handoff_complete: pending
