# 02_uiux.md

## UI/UX Requirements — personal_website_rebuild_01

Status: Draft v1 (based on Tony decisions)

## 1) Experience model
- Primary mode: terminal-first, command-driven website UI.
- Companion mode: minimal web-friendly content presentation for fast recruiter scanning.
- Device priority: desktop first; mobile support is secondary in MVP.

## 2) Landing / Hero requirements
1. Hero must render with a terminal CLI aesthetic.
2. Hero should include an ASCII-art version of Tony’s profile photo.
   - Source image: `context/assets/hero_source.jpg`
3. Hero must include:
   - name
   - short intro (2–4 sentences)
   - quick command hint (`help`)
4. Hero must expose immediate actions:
   - resume download/access
   - contact

## 3) Navigation model
- Primary navigation via terminal commands (no heavy traditional navbar required).
- Required base commands (MVP):
  - `help`
  - `home`
  - `about` (or intro)
  - `pm`
  - `ai`
  - `projects`
  - `project <name>`
  - `contact`
  - `resume`
  - `clear`
- Unknown command behavior:
  - return friendly error + nearest suggestions.

## 4) Section presentation requirements
For each core section (PM, AI Product Builder, Projects, Contact):
1. Show concise summary first.
2. Allow drill-down detail via command progression.
3. Avoid content duplication across sections.
4. Keep command breadcrumbs or next-step suggestions visible.

## 5) Minimal web companion requirements
- Must present essential information without requiring command literacy.
- Minimum visible content:
  - identity summary
  - two role snapshots (PM + AI Product Builder)
  - projects overview
  - contact + resume link
- Should include clear instruction to use terminal mode for deeper exploration.

## 6) Interaction and readability requirements
- Monospace typography in terminal shell.
- High-contrast terminal theme (dark default).
- Keep text line lengths readable.
- Command feedback latency should feel immediate.

## 7) Accessibility and fallback (MVP scope)
- Full accessibility optimization is not primary MVP focus.
- Minimum fallback behavior required:
  - basic readable web content path
  - no dead-end if command input fails

## 8) Acceptance checks (UI/UX)
- A first-time visitor can discover all 5 sections with command hints.
- Resume can be accessed in <= 1 step from hero.
- Contact details are reachable in <= 1 command.
- Recruiter can quickly scan core profile without using advanced commands.
- Terminal mode feels distinctive and coherent with brand goal.
