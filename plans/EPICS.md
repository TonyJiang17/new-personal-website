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
| epic_01_mvp_site_rebuild | plans/mvp_site_rebuild | intake | in_review | plans/mvp_site_rebuild/02_requirements.md | plans/mvp_site_rebuild/04_work_orders.md | (n/a) | Staging deployed: https://personalwebsiterebuild01-19x61ndle.vercel.app (needs smoke + signoff) |
