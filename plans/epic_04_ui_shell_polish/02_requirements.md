# 02_requirements.md — Epic 4: UI Shell Polish (Right Panel + Theme)

Epic folder: `plans/epic_04_ui_shell_polish`
Trigger: Tony chat feedback (2026-03-31)

## Objective
Make the right-hand panel (Scan/Readable companion) more usable and the overall UI more modern and polished.

## In scope
### 1) Right panel collapsible (desktop)
- Collapse behavior: **shrink to a thin rail** (not overlay).
- Collapsed rail width: ~44–56px.
- Provide a clear affordance (handle/chevron) to expand/collapse.
- Persist expanded/collapsed state via **localStorage**.

### 2) Expanded panel wider
- When expanded, panel width should be larger than today.
- Responsive behavior:
  - Desktop: wider panel (target ~480–560px; finalize during implementation).
  - Mobile: stacked layout remains (no rail on mobile).

### 3) Improve spacing/readability in right panel
- Increase padding and vertical rhythm (line height, section spacing).
- Reduce the “squeezed” feel.

### 4) Modernize color scheme (monochrome + glass)
- Modern, sleek dark UI with subtle transparency.
- Avoid multi-color scheme; use a **single accent** (cyan/teal is OK, toned).
- Panel should feel slightly translucent (glass) with subtle blur.

## Out of scope
- No major redesign of information architecture.
- No new content sections.
- No changes to core terminal command behaviors.

## Success criteria
- Panel can be collapsed/expanded quickly.
- Collapsed rail is discoverable.
- Right panel is meaningfully more readable.
- Theme feels modern and consistent across terminal + panel.

## Acceptance checklist
- [ ] Toggle works and state persists after refresh.
- [ ] Expanded width is noticeably larger on desktop.
- [ ] Right panel text spacing is improved.
- [ ] Theme updated (no rainbow; single accent).
- [ ] Vercel preview redeployed for review.
