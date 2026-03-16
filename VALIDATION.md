# Stage 5B Validation Runbook

> One-command gate for the MVP Site Rebuild epic.
> Run this sequence before any Stage 6 (deploy) action.

## Prerequisites

```sh
npm install
npx playwright install chromium   # first time only
```

## Full validation sequence

```sh
npm run lint && npm run typecheck && npm run test && npm run test:e2e && npm run build
```

All commands must exit 0 for the gate to pass.

## Individual checks

| Check | Command | Scope |
|---|---|---|
| Lint | `npm run lint` | ESLint, no warnings/errors |
| Type check | `npm run typecheck` | TypeScript strict, no errors |
| Unit tests | `npm run test` | Pure libs: parser, registry, suggest, history (63 tests) |
| E2E tests | `npm run test:e2e` | Playwright Chromium smoke suite (22 tests) |
| Build | `npm run build` | Next.js production build |

## What each check validates

### `npm run lint`
ESLint passes on all source files. No unresolved imports, no React rules violations.

### `npm run typecheck`
TypeScript compilation with `--noEmit`. All types resolve; no implicit any or missing types.

### `npm run test` (Vitest unit suite)
- **parser**: whitespace trim, lowercase normalization, quoted args, flags, isEmpty
- **commandRegistry**: MVP commands present, no alias collisions, lookupCommand resolves all names/aliases
- **suggest**: prefix match ordering (shorter = higher score), history suggestions, Levenshtein distances
- **history**: dedupe consecutive identical commands, max length enforcement, no mutation of input

### `npm run test:e2e` (Playwright E2E suite)
Covers blueprint requirements:
- Terminal loads with welcome message and focused input
- `help` command shows command list
- Unknown command shows "command not found" + "Did you mean" suggestions
- All 5 sections reachable via commands (`about`, `ai`, `projects`, `contact`, `home`)
- Shareable URL scheme (`/?r=<route>`) loads correct section directly
- Unknown URL falls back to home with system notice
- Commands push URL correctly
- Readable companion (scan mode) is visible; contains h1/h2 headings
- Resume PDF link present and href targets `resume.pdf`
- `project <unknown>` shows friendly error

### `npm run build`
Next.js 15 production build compiles with 0 errors. Static routes optimized.

## Gate status

| Phase | Status |
|---|---|
| Phase 0 (scaffold) | ✓ DONE |
| Phase 1 (content/assets) | ✓ DONE |
| Phase 2 (terminal core) | ✓ DONE |
| Phase 3 (terminal UI + readable companion) | ✓ DONE |
| Phase 4 (sections + routing) | ✓ DONE |
| Phase 5 (shareable URLs, nav sync, polish) | ✓ DONE |
| **Phase 6 (Stage 5B validation)** | **✓ DONE — all gates pass** |

**Ready for Phase 7 (Vercel deployment).**
