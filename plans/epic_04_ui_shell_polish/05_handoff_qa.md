# 05_handoff_qa.md — Epic 4 (UI Shell Polish)

## Release summary
- Epic: `plans/epic_04_ui_shell_polish`
- Default deploy target: **Vercel preview/staging**
- Production deploy: out-of-band; explicitly requested by Tony

## Staging deployment
- Preview URL: https://personalwebsiterebuild01-2c7kq5m9h.vercel.app
- Deployment method: Vercel (preview)
- Git ref: main
- Date: 2026-04-03

## Post-deploy smoke checklist (staging)
- [ ] Site loads
- [ ] Right panel collapse/expand works on desktop
- [ ] Collapse state persists after refresh
- [ ] Expanded width feels right (desktop)
- [ ] Right panel spacing feels readable (not squeezed)
- [ ] Theme feels modern (monochrome + single accent; subtle glass)
- [ ] Mobile behavior unchanged (no weird rail on mobile)

## Validation evidence
- Local validation:
  - `npm run typecheck` ✅
  - `npm test` ✅
  - `npm run test:e2e` ✅
  - `npm run build` ✅

## Stage 6 status
- staging_deployed: pass
- smoke_checks_pass: pending (Tony)
- handoff_complete: pending
