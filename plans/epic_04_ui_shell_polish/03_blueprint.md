# 03_blueprint.md — Epic 4: UI Shell Polish

## Approach
This epic is FE-only. We will:
- Add a collapsible right panel with a thin rail collapsed state.
- Persist state in localStorage.
- Adjust layout widths at desktop breakpoints.
- Introduce/adjust theme tokens and apply consistently.

## Key implementation areas
- Right panel component/layout (collapse/expand)
- Styling tokens (Tailwind/theme CSS)
- Readable companion typography/spacing

## Validation
- Unit tests: state persistence helpers (if any).
- E2E: toggle collapsible panel; verify persists on refresh.
- Manual: Vercel preview on desktop + mobile.
