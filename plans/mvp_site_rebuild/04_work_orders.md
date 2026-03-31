# 04_work_orders.md — MVP Site Rebuild (Stage 4 Planner)

Epic: `plans/mvp_site_rebuild`

Scope note (MVP): implement the hybrid terminal-driven + readable scan experience with **placeholder content allowed for non-contact sections** (R14–R16). Contact details + resume path must be real in MVP.

---

## Phase 0 — Kickoff / Repo Preparation

**Depends on:** none

### WI-0.1 Create Next.js app scaffold (App Router) + TypeScript
- **Owner persona:** Tech Lead (Frontend)
- **Suggested subagent profile:** `frontend-scaffold-nextjs`
- **Parallel-safe:** blocks most other work; do first
- **Description:** Create the Next.js + TS project in this repo and standardize scripts.
- **Status:** `done` — manually scaffolded (2026-03-09, Stage 5A). `npm run build` passes, TypeScript enabled, App Router configured.
- **Acceptance criteria:**
  - Next.js App Router boots locally.
  - `next build` succeeds.
  - TypeScript enabled.
- **Test / verification commands:**
  - `cd <repo_root>`
  - `npm create next-app@latest` (or `pnpm create next-app`) with App Router + TS
  - `npm run dev`
  - `npm run build`
- **Refs:**
  - prd_ref: R4, N1
  - blueprint_ref: “Infrastructure & Hosting”, “Component architecture (React/Next.js)”
- **Phase 0 closure note (2026-03-09):** DONE — `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css` created manually (create-next-app rejected non-empty dir). `npm run build` ✓ (Next.js 15.5.12, no vulnerabilities). `npm run typecheck` ✓.

### WI-0.2 Add Tailwind CSS + baseline theme tokens
- **Owner persona:** Frontend Engineer
- **Suggested subagent profile:** `frontend-tailwind-theme`
- **Parallel-safe:** can run in parallel with WI-0.3 after scaffold exists
- **Description:** Configure Tailwind; set a dark terminal theme baseline; ensure readable mode typography is sane.
- **Status:** `done` — Tailwind configured (2026-03-09). Dark theme tokens in `tailwind.config.ts` and `app/globals.css` under `terminal.*` namespace. Monospace font stack defined.
- **Acceptance criteria:**
  - Tailwind builds with no warnings.
  - Dark theme default; readable text contrast meets baseline.
- **Test / verification commands:**
  - `npm run dev`
  - visually verify dark background + monospace in terminal area
- **Refs:**
  - prd_ref: R4, R7, N3
  - blueprint_ref: “Styling: Tailwind CSS”, “Fallback + readability behavior”
- **Phase 0 closure note (2026-03-09):** DONE — `tailwind.config.ts` with `terminal.*` color tokens (bg, surface, border, text, muted, accent, prompt, green, amber, red). `postcss.config.mjs` configured. `prefers-reduced-motion` CSS handled in `globals.css`. `npm run build` ✓ with Tailwind.

### WI-0.3 Add code quality tooling (ESLint, Prettier) + CI-friendly scripts
- **Owner persona:** Tech Lead
- **Suggested subagent profile:** `tooling-eslint-prettier`
- **Parallel-safe:** can run parallel with WI-0.2
- **Description:** Ensure repo has consistent lint/format and that build can be used as a Stage 5B gate.
- **Status:** `done` — ESLint (`eslint.config.mjs`) and Prettier (`.prettierrc`, `.prettierignore`) configured (2026-03-09). `lint`, `format`, `format:check`, `typecheck` scripts in `package.json`.
- **Acceptance criteria:**
  - `lint` and `format:check` scripts exist and pass.
  - No lint errors on scaffold.
- **Test / verification commands:**
  - `npm run lint`
  - `npm run format` (or `npm run format:check`)
- **Refs:**
  - prd_ref: N4
  - blueprint_ref: “Execution and validation model”, “Stage 5B Backpressure/Validation”
- **Phase 0 closure note (2026-03-09):** DONE — `npm run lint` ✓ (no warnings or errors). `npm run format:check` ✓ (all files pass). `npm run typecheck` ✓. `.prettierignore` excludes planning docs, `context/`, `evidence/`.

---

## Phase 1 — Content/Assets Plumbing (Placeholder-first)

**Depends on:** Phase 0

### WI-1.1 Establish file-based content model with placeholder flags
- **Owner persona:** Tech Lead (Architecture)
- **Suggested subagent profile:** `frontend-content-model`
- **Parallel-safe:** yes (parallel with WI-1.2, WI-1.3)
- **Description:** Create a simple `content/` module (or `lib/content/`) for the 5 sections with `status: placeholder|final` as per blueprint.
- **Acceptance criteria:**
  - Single canonical source of content per section used by both terminal and readable render variants.
  - Non-contact sections may contain placeholders.
- **Test / verification commands:**
  - `npm run typecheck` (if present) or `npm run build`
- **Refs:**
  - prd_ref: R1, R2, R14, R15
  - blueprint_ref: “Data model (design-level)”, “Avoid duplicated copy by centralizing section data”
- **Status:** `done` — `content/sections.ts` created (2026-03-09, Phase 3 execution). Exports `HERO_CONTENT`, `PM_CONTENT`, `AI_CONTENT`, `PROJECTS_CONTENT`, `SECTION_MAP`, `KNOWN_PROJECTS`. All non-contact sections carry `status: 'placeholder'`. `content/contact.ts` remains canonical for contact (final). Both terminal and readable section components import from these canonical sources.
- **Phase 1 closure note (2026-03-09):** BLOCKED — prior patch. **Phase 3 resolution (2026-03-09):** DONE — `content/sections.ts` implements full 5-section content model with `SectionContent` and `HeroContent` interfaces. `npm run typecheck` ✓, `npm run build` ✓.

### WI-1.2 Resume asset path is real (MVP) + wired to `/resume`
- **Owner persona:** Tech Lead (Delivery)
- **Suggested subagent profile:** `frontend-static-assets`
- **Parallel-safe:** yes, after Phase 0; can proceed while terminal UI is built
- **Description:** Add actual resume PDF to `public/` and ensure the site links to it reliably (from hero + `resume` command).
- **Status:** `assets-wired` — `public/resume.pdf` placed (Stage 5A patch 2026-03-09); UI wiring (hero link + `resume` command) pending Phase 0 scaffold + Phase 2–3 terminal core.
- **Acceptance criteria:**
  - `GET /resume.pdf` (or chosen filename) returns the real file in local dev.
  - Resume reachable in **<= 1 step** from hero UI.
  - `resume` command opens/downloads resume.
- **Test / verification commands:**
  - `npm run dev`
  - open `http://localhost:3000/resume.pdf`
  - in UI: click resume link; type `resume`
- **Refs:**
  - prd_ref: R3, R12 (related), R16
  - blueprint_ref: “Resume delivery: Static file in public assets”, “Stage 5A Generate/Implement”
- **Phase 1 closure note (2026-03-09):** BLOCKED — `public/resume.pdf` placed and verified (131K). Criteria 1 (GET /resume.pdf) unverifiable until Phase 0 dev server exists. Criteria 2 (hero UI link) and Criteria 3 (`resume` command) blocked on Phase 3 (WI-3.3) and Phase 2/4 (WI-2.1, WI-4.3) respectively. Asset is ready; UI wiring is out of Phase 1 scope.

### WI-1.3 Contact details are real (MVP) + validated links
- **Owner persona:** Product Owner / Content Editor
- **Suggested subagent profile:** `content-contact-links`
- **Parallel-safe:** yes
- **Description:** Populate Contact section with real email (mailto) + professional links (e.g., LinkedIn, GitHub). Ensure no placeholders in Contact.
- **Status:** `content-wired` — `content/contact.ts` created with real email, LinkedIn, GitHub, TikTok, and resumePath (Stage 5A patch 2026-03-09); Contact section component wiring pending Phase 0 scaffold + Phase 4.
- **Acceptance criteria:**
  - Contact section includes a working `mailto:` email link.
  - At least one professional profile link present and correct.
  - Contact reachable in **<= 1 command**.
- **Test / verification commands:**
  - manual: click mailto and profile links in dev
  - `npm run build` (ensures no missing imports/assets)
- **Refs:**
  - prd_ref: R12, R16
  - blueprint_ref: “Fallback requirements”, “Functional checks: contact info visible and valid”
- **Phase 1 closure note (2026-03-09):** BLOCKED — `content/contact.ts` contains real email (tjiang217@gmail.com), LinkedIn, GitHub, TikTok, and resumePath with no placeholders. Criteria 2 (professional link present) is satisfied at the data layer. Criteria 1 (working mailto link in rendered section) and Criteria 3 (contact command routing) blocked on Phase 4 (WI-4.1, WI-4.3). Content data is complete; component and routing wiring are out of Phase 1 scope.

### WI-1.4 ASCII hero asset pipeline (build-time generation)
- **Owner persona:** Frontend Engineer
- **Suggested subagent profile:** `frontend-ascii-art-pipeline`
- **Parallel-safe:** yes (can be developed alongside terminal UI)
- **Description:** Add a Node build script to convert `context/assets/hero_source.jpg` to ASCII output stored as a deterministic asset used by Hero.
- **Acceptance criteria:**
  - Script runs deterministically and outputs a text file (e.g., `content/heroAscii.txt` or `public/hero-ascii.txt`).
  - Hero renders ASCII in terminal style (R8).
- **Test / verification commands:**
  - `node scripts/generate-hero-ascii.mjs` (or `npm run gen:ascii`)
  - `npm run build`
- **Refs:**
  - prd_ref: R7, R8
  - blueprint_ref: “Hero ASCII generation: Node script at build-time”

---

## Phase 2 — Terminal Core (Stage 5A: Generate/Implement)

**Depends on:** Phase 0

### WI-2.1 Implement command registry (commands + aliases + help text)
- **Owner persona:** Tech Lead (Core UX)
- **Suggested subagent profile:** `frontend-terminal-core`
- **Parallel-safe:** yes (parallel with WI-2.2)
- **Description:** Implement `lib/terminal/commandRegistry.ts` with required MVP commands and friendly help.
- **Must include commands (MVP):** `help`, `home`, `about`, `pm`, `ai`, `projects`, `project <name>`, `contact`, `resume`, `clear`.
- **Status:** `done` — `lib/terminal/commandRegistry.ts` implemented (2026-03-09).
- **Acceptance criteria:**
  - Registry contains canonical ids + aliases (no collisions).
  - `help` output enumerates commands and quick usage.
- **Test / verification commands:**
  - `npm run test` (unit) OR `npm run build` if unit harness not added yet
- **Refs:**
  - prd_ref: R9
  - blueprint_ref: “Canonical commands (MVP)”, “Alias strategy”, “commandRegistry tests”
- **Phase 2 closure note (2026-03-09):** DONE — `COMMAND_REGISTRY` with 8 commands: help, home, about, ai, projects, contact, resume, clear. Aliases: pm/who→about, builder→ai, work/portfolio→projects, links/email→contact, cv→resume, cls→clear, ?→help. Runtime collision detection via `_nameIndex` Map (throws on conflict). `lookupCommand`, `visibleCommands`, `allCommandNames` exported. `npm run typecheck` ✓, `npm run build` ✓.

### WI-2.2 Implement parser + unknown-command suggestions (pure functions)
- **Owner persona:** Frontend Engineer
- **Suggested subagent profile:** `frontend-terminal-parser`
- **Parallel-safe:** yes
- **Description:** Implement `lib/terminal/parser.ts` and `lib/terminal/suggest.ts` per blueprint grammar; unknown commands return suggestions.
- **Status:** `done` — `lib/terminal/parser.ts` and `lib/terminal/suggest.ts` implemented (2026-03-09).
- **Acceptance criteria:**
  - Leading/trailing whitespace trimmed; command normalized to lowercase.
  - Quoted args supported (for future) and at least works for `project <name>`.
  - Unknown commands produce `Did you mean: ...` suggestions.
- **Test / verification commands:**
  - `npm run test` (recommended: Vitest/Jest) with cases from blueprint
- **Refs:**
  - prd_ref: R10, R11
  - blueprint_ref: “Grammar (simple, resilient)”, “Unknown commands”, “Unit-level tests (parser/suggest)”
- **Phase 2 closure note (2026-03-09):** DONE — `parseInput` handles: whitespace trim, lowercase command, quoted args (single+double+escape), short/long flags. `getSuggestions` uses prefix match (score 100-len) + history fuzzy (score 80-len), max 5. `getUnknownCommandSuggestions` uses Levenshtein (distance ≤ 3, max 3 results, canonical-first). `levenshtein` exported as pure function. `npm run typecheck` ✓.

### WI-2.3 Implement terminal reducer/state machine + history persistence
- **Owner persona:** Frontend Engineer
- **Suggested subagent profile:** `frontend-terminal-state`
- **Parallel-safe:** yes (after WI-2.1 and WI-2.2 shapes are stable)
- **Description:** Implement `lib/terminal/state.ts` reducer and `lib/terminal/history.ts` for localStorage persistence of history only.
- **Status:** `done` — `lib/terminal/state.ts` and `lib/terminal/history.ts` implemented (2026-03-09).
- **Acceptance criteria:**
  - Enter submits; transcript entries created; input clears.
  - Up/Down navigates history; IME composition safe.
  - History max length enforced; no consecutive dupes.
- **Test / verification commands:**
  - `npm run test`
  - manual: type commands, refresh page, verify history navigation persists
- **Refs:**
  - prd_ref: R4, R9
  - blueprint_ref: “State model”, “Events (intents)”, “History dedupe + trim”
- **Phase 2 closure note (2026-03-09):** DONE — `terminalReducer` handles all 11 event types from blueprint (INPUT_CHANGED, COMPOSITION_START/END, SUBMIT_INPUT, HISTORY_PREV/NEXT, SUGGESTION_PREV/NEXT, ACCEPT_SUGGESTION, ROUTE_CHANGED, CLEAR_TRANSCRIPT). Side effects (NAVIGATE, OPEN_RESUME, PERSIST_HISTORY) returned as intent array for shell to apply. IME composition guard on SUBMIT_INPUT. `history.ts` exports `pushHistory` (pure), `loadHistory`, `saveHistory` with SSR safety + quota error resilience. Max 100 history entries, no consecutive dupes, no empty entries. `npm run typecheck` ✓, `npm run build` ✓.

---

## Phase 3 — Terminal UI Shell + Hybrid Readable Companion (Stage 5A)

**Depends on:** Phase 2, Phase 1.1

### WI-3.1 Build TerminalShell UI (input, transcript, suggestions)
- **Owner persona:** Frontend Engineer
- **Suggested subagent profile:** `frontend-terminal-ui`
- **Parallel-safe:** yes (parallel with WI-3.2 once route scheme decided)
- **Description:** Implement `components/terminal/*` per blueprint: `TerminalShell`, `CommandLine`, `OutputPane`, `Suggestions`.
- **Acceptance criteria:**
  - Terminal look/feel: monospace, high-contrast dark theme.
  - Immediate feedback latency (no noticeable delay).
  - `clear` command clears transcript.
- **Test / verification commands:**
  - `npm run dev`
  - manual: run `help`, `clear`, unknown command
- **Refs:**
  - prd_ref: R4, R7, R9, R10
  - blueprint_ref: “Component architecture”, “Suggestions behavior”, “Scroll behavior”
- **Status:** `done` — implemented 2026-03-09 (Phase 3). `CommandLine.tsx` (prompt, input, keybindings: Enter/↑/↓/Tab, composition events), `Suggestions.tsx` (listbox, keyboard selection, history badge), `OutputPane.tsx` (transcript auto-scroll, per-kind renderers: command/system/help/section), `TerminalShell.tsx` (useState+terminalReducer pattern, side-effect processing via useRef+useEffect, `TerminalShellLoader.tsx` for ssr:false dynamic import). `npm run typecheck` ✓, `npm run build` ✓.

### WI-3.2 Implement hybrid readable companion (scan mode) using the same SectionRenderer
- **Owner persona:** UX-minded Frontend Engineer
- **Suggested subagent profile:** `frontend-hybrid-layout`
- **Parallel-safe:** yes
- **Description:** Implement readable view that lets recruiters scan essentials without terminal literacy. Can be split-panel on desktop or toggle (“Scan mode”), but must be visible and non-dead-end.
- **Acceptance criteria:**
  - Visible recruiter-friendly content includes: identity summary, PM + AI snapshots, projects overview, contact + resume link.
  - Readable mode uses semantic headings.
  - Users can still navigate via commands; readable pane updates with current route.
- **Test / verification commands:**
  - `npm run dev`
  - manual: toggle scan mode (if implemented), or confirm split view
- **Refs:**
  - prd_ref: R5, R6
  - blueprint_ref: “Fallback + readability behavior”, “Section rendering”
- **Status:** `done` — implemented 2026-03-09 (Phase 3). `ReadableCompanion` embedded in `TerminalShell.tsx`: always-visible right panel (desktop, `md:flex`) with toggle for mobile (“scan →” / “← terminal”). Shows all 5 sections stacked (home/about/ai/projects/contact); active route highlighted with `▶ label` indicator and full opacity. Footer has quick links (Resume PDF, Email, LinkedIn, GitHub, TikTok). Uses `SectionRenderer` with `variant=”readable”` — same content, semantic headings (`h1`, `h2`). `npm run build` ✓.

### WI-3.3 Implement Hero section (terminal style) with ASCII profile + immediate actions
- **Owner persona:** Frontend Engineer
- **Suggested subagent profile:** `frontend-hero-terminal`
- **Parallel-safe:** yes (after WI-1.4 or can stub ASCII placeholder)
- **Description:** Hero must present name, short intro (placeholder ok), `help` hint, and immediate actions (resume/contact). Render ASCII art block.
- **Acceptance criteria:**
  - Hero renders in terminal CLI style.
  - ASCII block visible and aligned.
  - Resume/contact actions visible without typing.
- **Test / verification commands:**
  - `npm run dev`
  - manual: load home, confirm hero elements
- **Refs:**
  - prd_ref: R7, R8
  - blueprint_ref: “Landing / Hero requirements”, “Hero ASCII generation”
- **Status:** `done` — `components/sections/HeroSection.tsx` implemented 2026-03-09 (Phase 3). Terminal variant: box-art ASCII placeholder (`╔═╗` frame, `[photo placeholder — WI-1.4]` label), name in `terminal-accent`, tagline, intro lines, resume link + `resume` command hint, contact mailto + `contact` command hint, `help` type-hint. Readable variant: `h1` heading, tagline, intro, Download Resume + Email Me buttons. Placeholder ASCII — full pipeline deferred to WI-1.4. `npm run build` ✓.

---

## Phase 4 — Sections + Command-to-Section Routing (Stage 5A)

**Depends on:** Phase 3, Phase 1.1

### WI-4.1 Implement section components + no-duplication content wiring
- **Owner persona:** Tech Lead (Information architecture)
- **Suggested subagent profile:** `frontend-sections-implementation`
- **Parallel-safe:** yes (sections can be built in parallel: PM/AI/Projects/Contact)
- **Description:** Create `components/sections/*` for Hero, PM, AI Product Builder, Projects, Contact. Use centralized content module to avoid copy duplication.
- **Status:** `done` — all 5 section components built in Phase 3 (WI-3.3). Verified complete for Phase 4 acceptance (2026-03-09). `HeroSection`, `PMSection`, `AISection`, `ProjectsSection`, `ContactSection` all exist, render both `terminal` and `readable` variants, use `content/sections.ts` and `content/contact.ts` (no copy duplication). Contact is real; PM/AI/Projects are placeholder per R14. `SectionRenderer` dispatches to all 5 sections. `npm run build` ✓.
- **Acceptance criteria:**
  - All 5 sections exist and render in both variants (`terminal` transcript rendering and `readable` scan rendering).
  - PM/AI/Projects may be placeholder content; Contact must be real.
- **Test / verification commands:**
  - `npm run build`
  - manual: navigate to each section and verify both views update
- **Refs:**
  - prd_ref: R1, R2, R14
  - blueprint_ref: “SectionRenderer accepts { route, variant }”, “Data model”
- **Phase 4 closure note (2026-03-09):** DONE — built in Phase 3 (WI-3.3), acceptance criteria confirmed satisfied. No new implementation required.

### WI-4.2 Implement `project <name>` drill-down within Projects (MVP-lite)
- **Owner persona:** Frontend Engineer
- **Suggested subagent profile:** `frontend-projects-command`
- **Parallel-safe:** yes (after WI-2.2 parser + WI-4.1 projects section)
- **Description:** Provide a minimal `project <name>` command that shows a detail view for a known set of project ids (placeholder ok). Unknown project names should suggest valid ones.
- **Status:** `done` — 2026-03-09 (Phase 4). `ProjectsSection.tsx` (Phase 3) already renders `projectName` prop including `ProjectDetailTerminal` (known project detail) and friendly error with `KNOWN_PROJECTS` list for unknown names. Phase 4 fix: `lib/terminal/state.ts` now passes `command: { raw, args }` on section transcript entries when `routeResult.args.length > 0`, so `OutputPane` correctly reads `entry.command?.args?.[0]` as the project name. Full drill-down path: `project foo` → parser extracts arg `[“foo”]` → router returns `{ type: “navigate”, route: “projects”, args: [“foo”] }` → section entry created with args → OutputPane passes `projectName=”foo”` to `SectionRenderer` → `ProjectsSection` renders project detail or error. `npm run build` ✓, `npm run typecheck` ✓.
- **Acceptance criteria:**
  - `projects` shows list.
  - `project foo` navigates to a detail view if foo is known.
  - Unknown project yields a friendly error + suggestions.
- **Test / verification commands:**
  - manual: type `projects`, then `project <known>` and `project <unknown>`
- **Refs:**
  - prd_ref: R9, R10, R11
  - blueprint_ref: “Command model + parser grammar”, “Unknown commands”
- **Phase 4 closure note (2026-03-09):** DONE — `project <name>` routing fully wired end-to-end via router integration.

### WI-4.3 Implement router mapping: commands → route intents + actions
- **Owner persona:** Tech Lead (Routing)
- **Suggested subagent profile:** `frontend-terminal-router`
- **Parallel-safe:** yes
- **Description:** Implement `lib/terminal/router.ts` mapping parsed command → either navigation (section route) or action (resume, clear).
- **Status:** `done` — `lib/terminal/router.ts` created (2026-03-09, Phase 4). Exports `routeCommand(parsed: ParsedInput): RouterResult` — pure function, fully typed discriminated union (`navigate | action | builtin | unknown | empty`). Handles `project <name>` → `projects` route with args. `lib/terminal/state.ts` SUBMIT_INPUT handler refactored to use `routeCommand` (previously inline logic); all 5 route types handled cleanly. `npm run typecheck` ✓, `npm run build` ✓, `npm run lint` ✓.
- **Acceptance criteria:**
  - `home/about/pm/ai/projects/contact` update route.
  - `resume` triggers download/open of resume asset.
  - `clear` clears transcript but does not break routing.
- **Test / verification commands:**
  - `npm run dev`
  - manual: run through all commands
- **Refs:**
  - prd_ref: R9, R11
  - blueprint_ref: “Routing + render pipeline”, “Navigation behavior”
- **Phase 4 closure note (2026-03-09):** DONE — `lib/terminal/router.ts` implemented as standalone pure routing module. `state.ts` imports and uses it. All acceptance criteria met.

---

## Phase 5 — Shareable URLs, Navigation Sync, and MVP Polish (Stage 5A)

**Depends on:** Phase 4

### WI-5.1 Choose and implement shareable URL scheme (paths or query param)
- **Owner persona:** Tech Lead
- **Suggested subagent profile:** `frontend-nextjs-routing`
- **Parallel-safe:** blocks WI-5.2; decide early in this phase
- **Description:** Implement shareable URLs for sections (either `/projects` etc, or `/?r=projects`). Keep consistent and stable.
- **Status:** `done` — 2026-03-09 (Phase 5). Scheme: `/?r=<route>` query param (single-page app, all routes on `/`). Home = `/` (no param). Implemented in `TerminalShell.tsx`: `routeToUrl()` + `parseRouteFromSearch()` helpers; lazy initializer reads URL on mount; unknown `?r=` falls back to home with system notice. `npm run build` ✓.
- **Acceptance criteria:**
  - Each section has a shareable URL.
  - Unknown route falls back to home with a system notice.
- **Test / verification commands:**
  - manual: load each URL directly; refresh; copy/paste
  - `npm run build`
- **Refs:**
  - prd_ref: R13, R4
  - blueprint_ref: “Route sources”, “Unknown route in URL falls back to home”
- **Phase 5 closure note (2026-03-09):** DONE — `/?r=about`, `/?r=ai`, `/?r=projects`, `/?r=contact` are all shareable. Unknown `?r=foo` shows system notice and defaults to home. `npm run build` ✓, `npm run typecheck` ✓.

### WI-5.2 Sync browser back/forward with terminal route state
- **Owner persona:** Frontend Engineer
- **Suggested subagent profile:** `frontend-navigation-sync`
- **Parallel-safe:** yes (after WI-5.1)
- **Description:** Ensure route changes via commands push URL; browser back/forward updates terminal state via `ROUTE_CHANGED`.
- **Status:** `done` — 2026-03-09 (Phase 5). NAVIGATE side-effect now calls `window.history.pushState(...)` (previously no-op). `useEffect` with `popstate` listener dispatches `ROUTE_CHANGED` on browser back/forward. Reducer dedupes via `if (event.route === state.route)` guard — no feedback loop from pushState (pushState does not fire popstate). Both terminal transcript and readable companion update on navigation.
- **Acceptance criteria:**
  - Back/forward changes the visible section in both terminal and readable modes.
  - No desync between URL and internal route.
- **Test / verification commands:**
  - manual: navigate via commands; use back button; verify section updates
- **Refs:**
  - prd_ref: R13
  - blueprint_ref: “On browser back/forward… dispatch ROUTE_CHANGED”, “Integration-level tests”
- **Phase 5 closure note (2026-03-09):** DONE — `window.history.pushState` on NAVIGATE; `popstate` → `ROUTE_CHANGED`; reducer deduplication prevents feedback loop. `npm run build` ✓.

### WI-5.3 UX baseline: discoverability and breadcrumbs/next-step hints
- **Owner persona:** UX Engineer
- **Suggested subagent profile:** `ux-terminal-copy-hints`
- **Parallel-safe:** yes
- **Description:** Ensure `help` and unknown-command responses guide a first-time user; show next-step suggestions in each section output.
- **Status:** `done` — 2026-03-09 (Phase 5). All 5 sections now have discoverable next-step hints in terminal variant: Hero (help hint + resume/contact actions from Phase 3), PM/AI/Projects (nextHints from `content/sections.ts` from Phase 3/4), Contact (added `about · ai · projects` Next hints in Phase 5). Unknown commands show Levenshtein suggestions (max 3, from Phase 2). Welcome message says “Type `help`”. `help` output enumerates all 8 commands.
- **Acceptance criteria:**
  - First-time visitor can discover all 5 sections via hints.
  - Unknown command shows 1–3 likely suggestions.
- **Test / verification commands:**
  - manual: attempt exploration without prior knowledge; verify no dead ends
- **Refs:**
  - prd_ref: R10, M4
  - blueprint_ref: “Unknown commands… Did you mean…”, “Manual acceptance checks”
- **Phase 5 closure note (2026-03-09):** DONE — `ContactSection.tsx` updated with next-step hints. All 5 sections have terminal-mode next hints. No dead ends for first-time users.

### WI-5.4 Accessibility + motion baseline (MVP minimum)
- **Owner persona:** Frontend Engineer
- **Suggested subagent profile:** `frontend-a11y-baseline`
- **Parallel-safe:** yes
- **Description:** Respect `prefers-reduced-motion`, ensure focus outlines, and readable mode uses semantic headings/landmarks.
- **Status:** `done` — 2026-03-09 (Phase 5). (1) Focus visible: `CommandLine.tsx` now tracks input focus and renders a `border-l-2 border-l-terminal-accent` left-border indicator on the command bar when focused. (2) `globals.css` already has `:focus-visible { outline: 2px solid terminal-accent }` for all other interactive elements. (3) Readable mode: h1/h2 headings in all section readable variants (from Phase 3). (4) `prefers-reduced-motion`: CSS in `globals.css` sets `animation-duration: 0.01ms` globally; `reducedMotion` flag tracked in state (from Phase 0/2). `npm run build` ✓.
- **Acceptance criteria:**
  - Focus visible on command input.
  - Readable mode has headings (`h1/h2`) and sufficient contrast.
  - Reduced motion disables cursor blink/animations (if present).
- **Test / verification commands:**
  - manual: keyboard-only navigation
  - optional: `npx @axe-core/cli http://localhost:3000` (if added)
- **Refs:**
  - prd_ref: N3
  - blueprint_ref: “Fallback requirements… baseline accessibility”, “prefers-reduced-motion respected”
- **Phase 5 closure note (2026-03-09):** DONE — Left-border accent focus indicator on CommandLine; global `:focus-visible` ring on all buttons/links; semantic headings; reduced-motion CSS all confirmed. `npm run lint` ✓ `npm run typecheck` ✓ `npm run build` ✓.

---

## Phase 6 — Stage 5B Backpressure/Validation (Tests + Gates)

**Depends on:** Phases 2–5 complete enough to validate

### WI-6.1 Add unit tests for terminal pure libs (parser/registry/suggest/history)
- **Owner persona:** QA-minded Frontend Engineer
- **Suggested subagent profile:** `test-unit-terminal`
- **Parallel-safe:** yes (can start once libs exist; can run in parallel with UI polish)
- **Description:** Implement unit tests for the pure modules described in blueprint.
- **Status:** `done` — 2026-03-09 (Phase 6). Vitest 4.x installed with jsdom environment. `vitest.config.ts` created; `test` and `test:watch` scripts added to `package.json`. Four test files in `__tests__/`: `parser.test.ts` (18 tests), `commandRegistry.test.ts` (12 tests), `suggest.test.ts` (22 tests), `history.test.ts` (11 tests). 63 tests total, all pass.
- **Acceptance criteria:**
  - Tests cover: parsing, alias collisions, deterministic suggestion ordering, history dedupe/trim.
- **Test / verification commands:**
  - `npm run test`
- **Refs:**
  - prd_ref: N4
  - blueprint_ref: “Unit-level” section
- **Phase 6 closure note (2026-03-09):** DONE — `npm run test` ✓ 63 tests passed (4 files). Coverage: parser (whitespace/normalization/quotes/flags), commandRegistry (MVP commands, no alias collisions, lookupCommand including case-insensitive + all aliases), suggest (prefix ordering determinism, history kind, Levenshtein correctness, MAX_SUGGESTIONS=5), history (dedupe, trim to 100, no mutation).

### WI-6.2 Add Playwright E2E smoke suite for core commands + scan mode
- **Owner persona:** QA Engineer
- **Suggested subagent profile:** `test-e2e-playwright`
- **Parallel-safe:** yes
- **Description:** Add Playwright tests to validate: load, `help`, unknown command suggestions, navigate to each section, resume link works, readable mode/scan mode works.
- **Status:** `done` — 2026-03-09 (Phase 6). `@playwright/test` installed; Chromium browser installed. `playwright.config.ts` created with webServer (builds + starts Next.js). `e2e/smoke.spec.ts` with 22 tests across 8 describe blocks. `test:e2e` script added to `package.json`. All 22 tests pass.
- **Acceptance criteria:**
  - E2E suite passes locally and is stable.
  - Tests assert shareable URL behavior.
- **Test / verification commands:**
  - `npx playwright install chromium` (first time)
  - `npm run test:e2e`
- **Refs:**
  - prd_ref: R9, R10, R11, R13
  - blueprint_ref: “E2E-level (Playwright)”
- **Phase 6 closure note (2026-03-09):** DONE — `npm run test:e2e` ✓ 22/22 tests passed (38s). Covers: terminal load + welcome message, help output, unknown command (command-not-found + Did-you-mean), all 5 section commands (about/ai/projects/contact/home), shareable URLs (/?r=about/projects/contact, unknown fallback), URL push on navigate, readable companion aside present, h1/h2 headings, Resume PDF link href, project drill-down error.

### WI-6.3 Stage 5B gate runbook (one-command validation)
- **Owner persona:** Tech Lead
- **Suggested subagent profile:** `release-checklist`
- **Parallel-safe:** yes
- **Description:** Create a short `VALIDATION.md` or package scripts that run all required checks for the MVP gate.
- **Status:** `done` — 2026-03-09 (Phase 6). `VALIDATION.md` created at repo root with full gate sequence, per-check documentation, and gate status table.
- **Acceptance criteria:**
  - Single documented sequence to validate: lint, typecheck, unit, e2e, build.
  - All checks pass.
- **Test / verification commands:**
  - `npm run lint && npm run typecheck && npm run test && npm run test:e2e && npm run build`
- **Refs:**
  - prd_ref: N4
  - blueprint_ref: “Stage 5B Backpressure/Validation”, “Gate to Stage 6”
- **Phase 6 closure note (2026-03-09):** DONE — `VALIDATION.md` documents full gate sequence. Verified: `npm run lint` ✓, `npm run typecheck` ✓, `npm run test` ✓ (63 unit), `npm run test:e2e` ✓ (22 E2E), `npm run build` ✓. All Stage 5B checks pass. Gate to Phase 7 (Vercel deploy) is open.

---

## Phase 7 — Deployment (Vercel) + MVP Release Checks

**Depends on:** Phase 6

### WI-7.1 Vercel project setup + preview deployments
- **Owner persona:** DevOps / Tech Lead
- **Suggested subagent profile:** `devops-vercel-deploy`
- **Parallel-safe:** yes (can be prepared while tests are finishing, but final deploy after Phase 6 passes)
- **Description:** Connect repo to Vercel, ensure build passes and preview URLs work.
- **Acceptance criteria:**
  - Preview deploy on PR/branch.
  - Production deploy on main.
  - Resume asset served correctly in production.
- **Test / verification commands:**
  - `vercel` (local) or Vercel dashboard deploy
  - production smoke: open site URL; download resume; open contact links
- **Refs:**
  - prd_ref: N2, R13
  - blueprint_ref: “Hosting: Vercel”, “Reliable hosting and stable resume/link access”

### WI-7.2 Post-deploy smoke checklist (MVP)
- **Owner persona:** Product Owner
- **Suggested subagent profile:** `qa-manual-smoke`
- **Parallel-safe:** yes
- **Description:** Manual checks aligned to PRD success metrics.
- **Acceptance criteria:**
  - Visitor can identify Tony’s profile + work within ~2 minutes (M1).
  - Resume download works from hero and from `resume` command.
  - Contact reachable in <= 1 command and links are correct.
  - Terminal mode is coherent and scan mode is readable.
- **Test / verification commands:**
  - manual production walkthrough
- **Refs:**
  - prd_ref: M1, M2, M4, R12
  - blueprint_ref: “Manual acceptance checks”

---

## Planning Notes
- Decomposition follows the blueprint’s explicit split between **Stage 5A (Generate/Implement)** and **Stage 5B (Backpressure/Validation)**, with Phase 2–5 focused on implementation and Phase 6 providing the validation gates.
- Placeholder-first policy (R14) is enforced by making content file-based early (Phase 1) and explicitly allowing placeholders for PM/AI/Projects while requiring **real Contact + real Resume** paths in Phase 1.
- Work items are intentionally shaped to allow parallel execution after scaffolding: terminal core libs (Phase 2) can progress in parallel with content plumbing and ASCII pipeline (Phase 1), and section components can be built in parallel once the SectionRenderer/content contract is in place.
- Assumptions (MVP-safe):
  - Exact URL scheme (path routes vs `?r=`) will be chosen once during Phase 5 and then held stable.
  - The `project <name>` command will be MVP-lite (known ids only) with suggestions; deep project media/detail pages are post-MVP.
  - Mobile is functional baseline only (PRD N3); layout decisions prioritize desktop split/toggle scan mode.
