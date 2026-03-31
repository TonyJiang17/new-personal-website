# 03_blueprint.md

## Overview (mapped to PRD IDs)
This blueprint implements a **single hybrid command-driven web interface** for Tony’s personal website.

PRD mapping:
- R1–R3: IA sections + no duplication + resume access
- R4–R6: hybrid command-driven experience + unified projects section
- R7–R11: terminal-style hero, ASCII profile rendering, command UX behavior
- R12–R13: contact + shareable URL
- R14–R16: placeholder-content-first for this epic, real-content follow-up epic

## Infrastructure & Hosting
- Framework: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS (+ optional shadcn/ui for primitives)
- Hosting: Vercel
- Static assets: local repo assets (hero source image, resume PDF)
- Runtime model: server-rendered shell + client-side command router

Terminal UI implementation decision (explicit):
- MVP uses a **custom terminal-like web UI** to mimic CLI interaction (command input, history, suggestions, transcript rendering).
- MVP does **not** implement a virtual terminal/PTY emulator and does **not** require SSH.

## Infrastructure & Service Providers (provider matrix)
| Layer | Provider | Rationale | Risks/constraints | Fallback |
|---|---|---|---|---|
| Web framework | Next.js | Fast MVP shipping + routing flexibility | Overkill if ultra-static | Astro/React static |
| Hosting | Vercel | Easiest deploy + preview workflow | Vendor lock-in | Netlify/self-host |
| Styling | Tailwind | Fast visual iteration | Class-heavy code | CSS modules |
| Hero ASCII generation | Node script at build-time | Deterministic output, no runtime cost | Tuning quality required | Pre-generated static ASCII asset |
| Resume delivery | Static file in public assets | Simple + reliable | Manual updates | Object storage link |
| Analytics (MVP) | none/optional simple events | Keep MVP lean | Limited usage telemetry | Plausible/PostHog later |

---

## Terminal UI technical architecture (implementation-level)

### Goals and constraints
- **Single-page “terminal” experience** that can route to named sections via commands.
- **Shareable URLs** for sections (deep links) without duplicating content.
- **Hybrid UX**: terminal interaction first, but **readable fallback** for quick recruiter scanning.
- **Deterministic behavior**: command parsing, suggestions, and routing must be stable and testable.

### Component architecture (React/Next.js)
A thin “terminal shell” orchestrates parsing, state, and rendering; content is rendered as sections registered in a central registry.

Recommended file/module layout (conceptual):
- `app/(site)/layout.tsx`
  - Server component providing global metadata, fonts, theme tokens.
- `app/(site)/page.tsx`
  - Server component that renders the shell and initial section derived from URL.
- `components/terminal/TerminalShell.tsx` (client)
  - Owns terminal state machine (input, history, suggestions, current route).
  - Delegates: `CommandLine`, `OutputPane`, `SectionRenderer`.
- `components/terminal/CommandLine.tsx` (client)
  - Input + prompt + caret, handles keybindings and composition events.
- `components/terminal/Suggestions.tsx` (client)
  - Inline/under-input suggestions list, keyboard selection.
- `components/terminal/OutputPane.tsx` (client)
  - Renders scrollable “transcript”: command echoes + system output + section content.
- `components/sections/*` (server or client)
  - `HeroSection`, `PMSection`, `AIProductBuilderSection`, `ProjectsSection`, `ContactSection`.
  - Prefer server components where possible for SEO/readability; wrap with minimal client boundary only when needed.
- `lib/terminal/commandRegistry.ts`
  - Canonical command definitions, aliases, help text, argument schema.
- `lib/terminal/parser.ts`
  - Command lexer/parser (pure functions) + normalization.
- `lib/terminal/router.ts`
  - Maps parsed commands → route intents and actions.
- `lib/terminal/state.ts`
  - Reducer/state machine types + initial state.
- `lib/terminal/suggest.ts`
  - Suggestion engine (pure) using registry + history.
- `lib/terminal/history.ts`
  - Persistence helpers (localStorage) + sanitization.

#### Render responsibility boundaries
- **Parsing/routing/state updates must be pure/testable** (`lib/terminal/*`).
- UI components should be “dumb” where possible: translate events → intents, render state.
- Avoid section duplication: the same `SectionRenderer` should be used for both terminal transcript output and fallback/scan view.

### Command model + parser grammar

#### Canonical commands (MVP)
Map commands to IA sections and required actions:
- `help` → prints available commands + short usage
- `about` (or `pm`) → PM section
- `ai` (or `builder`) → AI Product Builder section
- `projects` → Projects section (unified)
- `contact` → Contact section
- `resume` → opens/downloads resume PDF
- `clear` → clears transcript (keeps current section route)

If PRD/UIUX defines exact names, those override. Above is a blueprint default; keep registry authoritative.

#### Grammar (simple, resilient)
Design for robust parsing without a heavy dependency:

EBNF-like:
```
input        := ws? command (ws+ args)? ws?
command      := word
args         := token (ws+ token)*
word         := [a-zA-Z][a-zA-Z0-9_-]*
token        := quoted | word | flag
flag         := ('--' word) | ('-' [a-zA-Z]+)
quoted       := '"' ( [^"\\] | '\\' . )* '"' | "'" ( [^'\\] | '\\' . )* "'"
ws           := [ \t]+
```

Normalization rules:
- Lowercase command and flags.
- Collapse multiple whitespace runs.
- Preserve quoted argument case.

Error tolerance:
- If input is empty/whitespace: no-op.
- If command unknown: return `UnknownCommand` with suggestion candidates.

#### Alias strategy
Use a **canonical command id** plus a set of aliases.

Example registry shape:
```ts
export type CommandId =
  | 'help' | 'about' | 'ai' | 'projects' | 'contact' | 'resume' | 'clear'

export interface CommandDef {
  id: CommandId
  names: string[]        // includes canonical + aliases
  summary: string
  usage?: string
  route?: RouteId        // if command navigates
  action?: ActionId      // if command triggers side-effect
  hidden?: boolean       // allow internal commands later
}
```

Principles:
- **Aliases never conflict** (enforced by test).
- When user types an alias, echo the raw command in transcript, but store normalized id in state.

### State model (terminal as a small state machine)
Maintain a single reducer to avoid UI edge cases.

#### State shape
```ts
type RouteId = 'home' | 'about' | 'ai' | 'projects' | 'contact'

interface TranscriptEntry {
  id: string
  ts: number
  kind: 'command' | 'system' | 'section'
  text?: string
  command?: { raw: string; id?: CommandId; args?: string[]; error?: string }
  route?: RouteId
}

interface TerminalState {
  route: RouteId
  input: string
  isComposing: boolean
  history: string[]              // raw inputs
  historyIndex: number | null    // null when not navigating history
  suggestions: { value: string; kind: 'command' | 'history'; score: number }[]
  suggestionIndex: number | null
  transcript: TranscriptEntry[]
  reducedMotion: boolean
  highContrast: boolean
}
```

#### Events (intents)
- `INPUT_CHANGED(text)`
- `INPUT_COMPOSITION_START/END`
- `SUBMIT_INPUT()`
- `HISTORY_PREV/NEXT()`
- `SUGGESTION_PREV/NEXT()`
- `ACCEPT_SUGGESTION()`
- `ROUTE_CHANGED(route)` (from URL popstate or programmatic navigation)
- `CLEAR_TRANSCRIPT()`

Reducer rules:
- `SUBMIT_INPUT`:
  1. append `command` transcript entry
  2. parse and route
  3. append `system` entry for errors/unknowns/help text
  4. if navigation: update `route`, append `section` entry
  5. push to `history` (dedupe consecutive identical commands)
  6. clear `input`, reset indices

Persistence:
- `history` persisted to `localStorage` (limit e.g. 100, LRU trim).
- Do **not** persist transcript (keeps refresh simple and avoids surprise data retention).

### Routing + render pipeline

#### Route sources
There are two authoritative ways to arrive at a section:
1. **URL route** (shareable): `/` or `/?r=projects` or `/projects` (choose one scheme, keep consistent with Stage 2 IA/UIUX).
2. **Terminal command**: user types `projects` → navigate.

Recommendation for MVP:
- Prefer path routes if UIUX already specifies them (e.g., `/projects`, `/contact`).
- If staying single-page, use a query param `?r=` and keep `/` as the only path.

#### Navigation behavior
- On command navigation:
  - call `router.push(targetUrl, { scroll: false })` to preserve terminal scroll.
  - update internal `route` immediately (optimistic) so UI responds instantly.
- On browser back/forward:
  - listen to route changes (Next navigation hooks) and dispatch `ROUTE_CHANGED`.

#### Section rendering
Two concurrent render modes:
1. **Terminal transcript mode**: when route changes (by command), append a `section` entry in transcript and render the section content as part of the transcript.
2. **Readable fallback mode**: a persistent right-side (desktop) or below-terminal (mobile) panel showing the current section content in a clean, typographic layout.

Implementation detail:
- `SectionRenderer` accepts `{ route, variant }` where `variant` is `'terminal' | 'readable'`.
- Section components expose the same content but adjust typography/spacing.
- Avoid duplicated copy by centralizing section data in a `content` module and mapping into both variants.

#### Scroll behavior
- Transcript auto-scrolls to bottom on:
  - new command submission
  - new system output
  - navigation section append
- Do not auto-scroll while user is manually scrolled up (detect via scrollTop distance threshold).

### Command history + suggestions behavior

#### History
- Up/Down arrow cycles through `history` when:
  - input is focused
  - not composing (IME)
  - no suggestion selection is active OR history takes precedence (define precedence and test it)
- Escape resets history navigation (sets `historyIndex=null`, restores pre-history draft input).

History dedupe + trim:
- Do not add empty commands.
- Do not add if identical to last command.
- Trim to max length (e.g., 100).

#### Suggestions
Two sources:
- **Command suggestions**: from registry, prefix match on `input` (first token).
- **History suggestions**: if `input` length >= 2, fuzzy match against prior commands.

Scoring (simple deterministic):
- Exact prefix match score > fuzzy.
- Shorter completion > longer completion.
- Registry commands generally outrank history unless the history match is exact.

Display behavior:
- If there is exactly one high-confidence completion, show an inline “ghost text” completion.
- If multiple, show a small list (max 5) under input.

Accept behavior:
- `Tab` accepts inline completion (or cycles suggestions if list open).
- `Enter` submits current input.
- If suggestion list is open and user presses `Enter` with no text changes, optionally accept highlighted suggestion first (must match UIUX; otherwise keep `Enter` as submit only).

Unknown commands:
- Print: `command not found: <raw>`
- Show: `Did you mean: projects, contact?` using top 1–3 suggestions (Levenshtein on known commands).

### Fallback + readability behavior (recruiter scan)
The terminal experience must not block content access.

Fallback requirements:
- Provide a visible “Scan mode” affordance (button or toggle) that:
  - reveals a clean content panel (or switches entire layout) without terminal chrome noise.
  - keeps URLs shareable and consistent with terminal routing.
- Ensure baseline accessibility:
  - semantic headings and landmarks in readable mode
  - sufficient contrast, avoid tiny monospace-only blocks
  - focus outline visible
  - `prefers-reduced-motion` respected (disable blinking cursor/animations)

If UIUX already specifies the fallback implementation (e.g., always-on split view), follow that.

### Error handling + resilience
- Parser errors are non-fatal: render a system message and keep input focus.
- Resume action failures (missing asset) show system error + offer contact command.
- Unknown route in URL falls back to `home` and prints a system notice.

---

## Data model (design-level)
No backend database required for MVP placeholder phase.

Content model (file-based):
- `context/` raw/source content
- `plans/mvp_site_rebuild/` stage artifacts
- optional `content/` for UI-facing section payloads

Recommended content payload shape per section:
- `id`
- `title`
- `summary`
- `details[]`
- `links[]`
- `status` (`placeholder` or `final`)

## Async pipelines / job model
MVP does not require async jobs. Build-time generation only:
1. Read `context/assets/hero_source.jpg`
2. Generate ASCII output via script
3. Save to renderable asset/text block for Hero

## Retrieval/Generation contracts (if applicable)
Not applicable for this project (no RAG/chat generation pipeline in MVP).

## Execution and validation model
### Stage 5A Generate/Implement
- Build command-driven shell layout
- Implement section rendering for: Hero, PM, AI Product Builder, Projects, Contact
- Wire command parser and command-to-section routing
- Add resume command/action
- Integrate ASCII hero asset
- Populate placeholder content for non-contact sections

### Stage 5B Backpressure/Validation
- Static checks (TypeScript/ESLint/build)
- Functional checks:
  - all required commands work
  - unknown command suggestions work
  - all required sections reachable via command
  - resume action works
  - contact info visible and valid
- UX checks:
  - terminal look-and-feel preserved
  - readable fallback for quick recruiter scan

Gate to Stage 6:
- Stage 5B pass for all in-scope requirements

## Guardrails and abstain/safety policies
- Scope guard: no additions beyond approved IA and command set without Tony approval
- Placeholder policy: non-contact placeholder content allowed in this epic
- No duplication policy across sections

## Security/access model
- Public website MVP
- No auth/login for MVP
- No sensitive data ingestion

## Logging/traceability model
- Basic build/deploy logs via Vercel
- Optional simple client event logs later (deferred)
- Keep stage artifacts as source of truth for traceability

## Test strategy

### Unit-level
Pure function tests (fast, deterministic):
- `parser`:
  - trims whitespace, lowercases command
  - supports quotes and escaped quotes
  - parses flags vs args correctly
  - empty input yields no-op
- `commandRegistry`:
  - no alias collisions
  - every command has summary and stable id
- `suggest`:
  - prefix suggestion ordering is deterministic
  - unknown command returns top-N candidates
- `history`:
  - dedupe consecutive identical commands
  - respects max length

### Integration-level (React)
- Command submit updates transcript and clears input.
- `projects` command changes route and renders section in both variants.
- Browser back/forward updates internal route without desync.
- Resume command triggers correct navigation/download behavior (stub `window.open`).
- IME composition: Enter during composition does not submit.

### E2E-level (Playwright)
- Load `/` and confirm terminal renders.
- Type `help` → help output visible.
- Type unknown command → suggestion text visible.
- Navigate to each section via command and confirm URL is shareable.
- Toggle scan/readable mode and confirm content headings present.

### Manual acceptance checks
- New visitor can discover all 5 sections quickly.
- Recruiter-style quick scan works without deep command knowledge.
- Terminal interaction remains distinct and polished.

## Open risks/questions
1. ASCII image quality vs readability on different screen sizes
2. Exact command vocabulary and aliases
3. Balance between terminal aesthetics and content legibility
4. Whether to add minimal clickable fallback nav in MVP

## Approval
- Review by OpenClaw: Complete
- Approval by Tony:

---

## Changelog (blueprint refinement)
- Added a detailed **Terminal UI technical architecture** section covering: component/module breakdown, command registry + parser grammar, alias strategy, reducer/state model, navigation + render pipeline, scroll behavior.
- Specified **command history + suggestions** behavior (keybindings, scoring, acceptance rules, unknown-command handling).
- Defined **fallback/readability** requirements and accessibility/resilience behaviors.
- Expanded **test strategy hooks** with concrete unit/integration/e2e targets aligned to the terminal command experience.
