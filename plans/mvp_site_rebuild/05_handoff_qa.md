# 05_handoff_qa.md — Epic 1 (MVP Site Rebuild)

## Release summary
- Epic: `plans/mvp_site_rebuild`
- Default deploy target: **Vercel (staging/preview)**
- Production deploy: out-of-band; explicitly requested by Tony

## Staging deployment
- Staging URL: https://personalwebsiterebuild01-19x61ndle.vercel.app
- Deployment method: Vercel (preview)
- Git ref (branch/commit): main @ 890cdeb
- Date: 2026-03-18

## Post-deploy smoke checklist (staging)
- [ ] Site loads
- [ ] Hero renders + ASCII portrait visible
- [ ] `help` works
- [ ] Section navigation works: `about`, `ai`, `projects`, `contact`, `home`
- [ ] Shareable URLs work (`/?r=...`)
- [ ] Resume link works (`/resume.pdf`) and `resume` command works
- [ ] Scan mode/readable companion visible on desktop + toggles on mobile
- [ ] Links in Contact are correct

## Validation evidence
- Local validation doc: `VALIDATION.md`
- Tests:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:e2e`
  - `npm run build`

## Deployment/runbook notes
- (notes)

## Rollback notes
- (notes)

## Known limitations
- Placeholder content remains in non-contact sections (expected for MVP)

## Stage 6 status
- staging_deployed: pass
- smoke_checks_pass: pass (Tony confirmed)
- handoff_complete: pass
