# 02_requirements.md (JTBD PRD)

## Overview
Tony wants to rebuild his personal website as a high-signal personal brand asset that is more expressive than a resume. Primary usage is for recruiters/hiring managers and other people who want to quickly understand who Tony is, what he has done, and how to contact him.

This MVP will use a **hybrid command-driven website**: a single web experience with terminal-style interaction as the primary navigation model, while still presenting recruiter-friendly content in a clean, minimal layout.

## Product thesis
- Terminal-style command interaction creates differentiation and memorability.
- A clean web presentation layer preserves accessibility for mainstream visitors.
- A single hybrid interface maximizes brand impact while minimizing navigation friction.

## Goals (MVP)
1. Present Tony’s narrative and work in a clear, compelling format.
2. Create a memorable first impression (non-generic personal site feel).
3. Provide complete recruiter-relevant information and contact methods.
4. Include resume download/access from both website and terminal pathways.

## Non-goals (MVP)
- Blog/CMS publishing system
- Complex analytics dashboards
- Multi-language support
- Account system/login
- Content personalization by viewer segment
- Deep mobile optimization beyond functional baseline

## Users/personas
1. Recruiters / Hiring managers (primary)
2. Professional peers/colleagues (secondary)
3. General visitors from social/LinkedIn (secondary)

## Core JTBDs in scope
### JTBD #1 — Understand Tony quickly
When someone visits the site to evaluate Tony, they want a concise but high-signal understanding of his profile and work so they can decide fit quickly.

### JTBD #2 — Explore role-specific depth
When a visitor wants role-specific context, they want clearly separated sections for Product Manager and AI Product Builder so they can evaluate relevant experience without confusion.

### JTBD #3 — Reach out or continue evaluation
When a visitor is interested, they want immediate access to contact channels and resume download so they can proceed without friction.

## Functional requirements (with IDs: R1, R2, ...)
### Information architecture
- R1. Site must include these primary sections:
  - Hero
  - Product Manager
  - AI Product Builder
  - Projects
  - Contact
- R2. Content must avoid duplication across sections.
- R3. Resume must be downloadable/accessed from the experience.

### Experience model
- R4. MVP must be a single hybrid web interface with terminal-style command interaction as primary navigation.
- R5. The same interface must still present recruiter-friendly readable content without requiring deep command knowledge.
- R6. Projects section must be unified (do not hard-split content creation vs technical projects in IA).

### Terminal-command UX requirements
- R7. Hero must render in terminal CLI style.
- R8. Hero should include ASCII-art profile image rendering.
- R9. Command-driven navigation must support required commands from `02_uiux.md`.
- R10. Unknown commands must return guidance/suggestions.
- R11. Core content sections must be reachable through commands and reflected in the content panel.

### Contact/discovery
- R12. Contact section must include at least one primary direct method (email) and professional profile links.
- R13. Site must be shareable as a single URL for resume/LinkedIn/social usage.

### Delivery sequencing requirements (factory test mode)
- R14. For this initial epic/project (`plans/mvp_site_rebuild`), implementation may use placeholder content for non-contact sections to validate architecture and workflow.
- R15. A follow-up epic/project must replace placeholders with final materials provided by Tony.
- R16. Contact section should use real links/details from the start where possible.

## Non-functional requirements
- N1. Fast page load for core pages.
- N2. Reliable hosting and stable resume/link access.
- N3. Responsive baseline support; desktop-first optimization in MVP.
- N4. Maintainable content update flow.

## User journeys
### Journey A — Recruiter review
1. Recruiter opens URL from resume.
2. Reads Hero summary and role pages.
3. Checks selected projects.
4. Downloads resume and contacts Tony.

### Journey B — Technical visitor discovery
1. Visitor lands on site.
2. Uses command input in the hybrid interface.
3. Explores role/projects quickly with command-driven flow.
4. Uses contact links.

## UX/UI requirements (linked)
Detailed UI/UX requirements are defined in:
- `02_uiux.md`

## Authentication/access requirements (if applicable)
- No authentication required for MVP.

## Evaluation & success metrics
- M1. Visitor can identify Tony’s profile and key work within ~2 minutes.
- M2. Contact/resume actions are frictionless (single-step from visible sections).
- M3. Qualitative feedback: experience is “memorable” and “non-boring” from pilot reviewers.
- M4. Command discoverability: first-time user can access all core sections using hints/help.

## Risks & mitigations
- Risk: terminal-first approach may reduce accessibility.
  - Mitigation: minimal web companion contains all essential recruiter info.
- Risk: one-day build scope overrun.
  - Mitigation: strict MVP scope and phased work-order execution.
- Risk: unclear section boundaries.
  - Mitigation: enforce no-duplication rule and section ownership in content mapping.

## Out of scope
- Advanced SEO program
- Blog engine
- Interactive data visualizations beyond MVP
- Personal account/customized viewer paths

## Post-MVP roadmap
1. Refine terminal UX depth and polish.
2. Add richer project detail pages/media.
3. Add analytics and conversion instrumentation.
4. Add optional writing/blog section.

## Approval
- Tony approval: Approved
- Date: 2026-03-06
