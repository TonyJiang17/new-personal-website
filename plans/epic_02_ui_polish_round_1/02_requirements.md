# 02_requirements.md — Epic 2: UI Polish Round 1

Epic folder: `plans/epic_02_ui_polish_round_1`
Trigger: Feedback batch `feedback/2026-03-31_batch.md`

## Objective
Apply a first round of small UI/UX improvements and content upgrades on top of the shipped MVP (Epic 1) and redeploy to Vercel preview.

## In scope (feedback items)
- **FB-002** Consistent link colors (readable companion/right panel)
- **FB-003** Home/hero should persist after `clear`
- **FB-004** Replace placeholder text for Hero / Product Manager / AI Builder section using `public/resume.pdf`
  - Rename “AI Product Builder” section to better reflect AI research/data/software engineering builder scope.
  - Leave Projects placeholder/blank for now.
- **FB-005** Remove unhelpful text shown under hero portrait and/or in the right panel (per screenshots)
- **FB-006** Slash commands: require `/` prefix for commands
  - If the user types without `/`, show a friendly message (chat mode not implemented yet) directing them to `/help`.

## Out of scope (separate epic)
- **FB-001** LLM-backed chat experience (epic-worthy; separate Epic 3)

## Success criteria
- Commands still work, now via slash prefix: `/help`, `/about`, `/ai`, etc.
- `clear` does not remove the home hero output; user is never left with an empty terminal pane.
- Link colors are consistent across the readable companion.
- Placeholder text replaced with real, resume-aligned copy (except Projects).
- Unhelpful captions/labels removed.

## Non-goals
- No backend / no auth
- No LLM chat implementation (that is Epic 3)

## Acceptance checklist
- [ ] Slash commands work and are discoverable
- [ ] Typing `help` (without slash) shows guidance to use `/help`
- [ ] `clear` preserves the home/hero section
- [ ] Right panel link styling is consistent
- [ ] Hero/PM/AI sections updated with real content from resume
- [ ] Vercel preview redeployed and smoke checks pass
