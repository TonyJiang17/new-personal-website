# 04_work_orders.md — Epic 2: UI Polish Round 1

## Phase 1 — Slash command UX
- WI-2.1 Update parser/router to recognize `/command`.
- WI-2.2 Update command registry/help text to show slash commands.
- WI-2.3 Add friendly response for non-slash input (chat coming soon → suggest `/help`).
- WI-2.4 Update unit tests + E2E tests accordingly.

## Phase 2 — Clear preserves hero
- WI-3.1 Adjust `clear` behavior so home/hero stays visible.
- WI-3.2 Add/adjust tests.

## Phase 3 — Content + polish
- WI-4.1 Extract resume highlights (from `public/resume.pdf`) into hero/PM/AI sections.
- WI-4.2 Rename AI section and update copy.
- WI-4.3 Fix link color consistency in readable panel.
- WI-4.4 Remove unhelpful caption text.

## Phase 4 — Stage 6
- WI-6.1 Local validation: lint/typecheck/unit/e2e/build.
- WI-6.2 Deploy to Vercel preview and run smoke check.
