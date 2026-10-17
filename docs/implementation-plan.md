# Implementation plan

Version 1.0.0 · 2026-10-16 · Tracks [`specification.md`](./specification.md)

Each task is small enough to verify on its own. "Done" means the acceptance
check was run and observed.

| # | Task | Depends on | Acceptance check |
|---|------|-----------|------------------|
| T1 | Scaffold: `package.json`, `tsconfig`, `next.config`, PostCSS, ESLint, `.gitignore`, `.env.example` | — | `npm run typecheck` passes on an empty app |
| T2 | Design tokens + `globals.css` + fonts via `next/font` | T1 | Dev server renders a styled page, no FOUT |
| T3 | `src/content/schema.ts` — Zod schemas for every content type | T1 | `vitest` parses a fixture |
| T4 | `src/content/site.config.ts` — brand config with `TODO:` placeholders | T3 | Schema parse passes |
| T5 | `projects.ts`, `method.ts`, `capabilities.ts`, `experiments.ts`, `index.ts` | T3 | Content unit tests pass |
| T6 | Layout shell: `layout.tsx`, `SkipLink`, `SiteHeader`, `SiteFooter` | T2 | Tab order: skip link first; header links scroll to anchors |
| T7 | `Reveal` motion primitive + `useReducedMotion` | T2 | With reduce set, element renders with no transform |
| T8 | `useWebGLSupport`, `useUniverseSelection`, `UniverseFallback` (SVG) | T5 | RTL test: arrow keys move selection, `Enter` activates |
| T9 | `UniverseScene` (R3F) + `UniverseIsland` dynamic loader + error boundary | T8 | `next build` shows no `three` in the `/` first-load chunk |
| T10 | `UniverseDetailPanel` shared by scene and fallback | T8 | Six nodes each render title, deliverables, link |
| T11 | Hero section | T9 | Hero text visible before the 3D chunk resolves |
| T12 | About section | T6 | Contains no duration or employment claim |
| T13 | Work gallery + `ProjectCard` | T5 | Only `published` projects render |
| T14 | `/work` index and `/work/[slug]` case study | T13 | All nine headings present; 404 for unknown slug |
| T15 | Method section (interactive, shares `method.ts`) | T5 | Selecting a stage updates the panel by keyboard |
| T16 | Capabilities section | T5 | Every item shows `applied` or `learning` |
| T17 | Experiments section | T5 | Status line on every entry |
| T18 | Contact section + `CopyEmailButton` | T4 | Clipboard copy works; no form present |
| T19 | SEO: metadata, `sitemap.ts`, `robots.ts`, OG image, JSON-LD | T14 | `/sitemap.xml` lists every published slug |
| T20 | `not-found.tsx` | T6 | Unknown URL renders it |
| T21 | Unit tests (content + logic + components) | T5–T18 | `npm run test` green |
| T22 | Playwright specs | T19 | `npm run test:e2e` green where browsers are installed |
| T23 | Verification sweep: typecheck, lint, test, build; fix findings | T21 | `npm run verify` exits 0 |
| T24 | `README.md`, `docs/deployment.md`, `docs/content-guide.md` | T23 | A new reader can run and deploy it |

## Deliberate non-goals for v1

- Blog / MDX article pipeline (projects are typed data; MDX adds a toolchain for
  content that does not exist yet).
- Light theme (the brand is a dark editorial surface; a half-done light mode is
  worse than none).
- i18n.
- A contact form (Constitution §7.3).
