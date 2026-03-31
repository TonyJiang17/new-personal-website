# EPICS.md (Project Epic Tracker)

Rules:
- One folder under `plans/` == one epic.
- Each epic completes when Stage 6 (staging deploy + smoke) passes.
- Production deploy is out-of-band and must be explicitly requested.

## Status definitions
- `active`: currently being executed
- `planned`: created but not started
- `blocked`: waiting on inputs/decisions
- `in_review`: deployed to staging; awaiting review / feedback intake
- `done`: Stage 6 passed; epic closed

## Epic list

| Epic ID | Epic folder | Trigger | Status | PRD | Work Orders | Design Preview | Notes |
|---|---|---|---|---|---|---|---|
| epic_01_mvp_site_rebuild | plans/mvp_site_rebuild | intake | done | plans/mvp_site_rebuild/02_requirements.md | plans/mvp_site_rebuild/04_work_orders.md | (n/a) | Stage 6 passed (staging + smoke): https://personalwebsiterebuild01-19x61ndle.vercel.app |
| epic_02_ui_polish_round_1 | plans/epic_02_ui_polish_round_1 | feedback | done | plans/epic_02_ui_polish_round_1/02_requirements.md | plans/epic_02_ui_polish_round_1/04_work_orders.md | optional | Stage 6 passed (staging + smoke): https://personalwebsiterebuild01-i22zcnc4y.vercel.app |
| epic_03_llm_chat | plans/epic_03_llm_chat | feedback | planned | plans/epic_03_llm_chat/02_requirements.md | plans/epic_03_llm_chat/04_work_orders.md | optional | LLM-backed chat for non-slash input |
