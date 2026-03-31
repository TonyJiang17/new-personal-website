# 03_blueprint.md — Epic 2: UI Polish Round 1

## Approach
This epic is a small FE-only polish and content update on top of the existing Next.js app.

Key technical changes:
1) **Slash command support**
- Parser/router: if input begins with `/`, treat as command.
- If input does not begin with `/`, treat as "chat" placeholder for now:
  - respond with a system message directing to `/help`.

2) **Clear behavior**
- `clear` should clear transcript but re-render the current route section entry (home hero by default).

3) **Content updates**
- Update `content/sections.ts`:
  - Hero intro copy
  - PM section content
  - Rename and rewrite AI builder section to reflect: AI research + data science + software engineering

4) **UI polish**
- Make readable companion link colors consistent.
- Remove any unhelpful caption text under the hero portrait.

## Validation
- Unit tests: update/add cases for slash parsing.
- E2E: update smoke tests to use `/` commands.
- Manual: verify Vercel preview URL.
