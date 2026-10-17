# Architecture — Shahzaib · The Digital Frontier

Version 1.0.0 · 2026-10-16

---

## 1. Stack and why

| Choice | Version | Reason |
|--------|---------|--------|
| Next.js App Router | 16.x | Server Components keep the content payload off the client; first-class Vercel target |
| React | 19.x | Required by Next 16 and by `@react-three/fiber` 9 |
| TypeScript (`strict`) | 5.9 | Content is typed data; errors belong at build time |
| Tailwind CSS | 4.x | CSS-first config: design tokens live in one `@theme` block, no JS config file |
| `@react-three/fiber` + `three` | 9.x / 0.186 | Declarative scene graph; only loaded where used |
| *(no `@react-three/drei`)* | — | Used it for in-canvas labels, then removed both the labels and the package — see §4 |
| *(no animation library)* | — | Considered `motion`; measured it at 43 kB gzipped on `/` for one entrance effect, and replaced it with an IntersectionObserver plus a CSS transition |
| `zod` | 4.x | Validates content at module load so bad content fails the build |
| `lucide-react` | 0.5x | Tree-shaken SVG icons, no icon font |
| Vitest + Testing Library | 5.x | Fast unit layer for content + logic |
| Playwright | 1.57 | Real-browser checks for keyboard, fallback, console cleanliness |

Rejected: a CMS (content changes with the code), a database (nothing persists),
analytics (no stated need; Constitution §4.5), a custom cursor, and a physics
engine.

## 2. Routes

```
/                      Server Component. Composes all sections.
/work                  Server Component. Full project index.
/work/[slug]           Server Component. Case study. generateStaticParams +
                       generateMetadata from content.
/not-found             404.
/sitemap.xml           Generated from content.
/robots.txt            Generated.
/opengraph-image       Edge-rendered OG card from brand config.
```

All routes are statically rendered. There is no server-side data fetching, so
there is no loading or error boundary beyond Next's defaults — except around the
3D island, which has its own.

## 3. Server / client boundary

```
app/layout.tsx                      server
app/page.tsx                        server
  ├── SiteHeader                    client  (scroll state, mobile menu)
  ├── Hero                          server
  │     └── UniverseIsland          client  (dynamic, ssr:false)
  │           ├── UniverseScene     client  ← the only module importing three
  │           └── UniverseFallback  client  (SVG, no three)
  ├── About                         server
  ├── Work                          server
  │     └── ProjectCard             server
  ├── Method                        client  (stage selection state)
  ├── Capabilities                  server
  ├── Experiments                   server
  ├── Contact                       server
  │     └── CopyEmailButton         client  (clipboard)
  └── SiteFooter                    server
```

Two rules enforced by review:

1. A component becomes a client component only to own state, listen to events,
   or touch `window`. Presentation stays on the server.
2. **Client components never import `@/content` for values** — only for types,
   which are erased at compile time. A value import pulls every case study's
   prose and the whole of Zod into the browser bundle for the sake of one
   string. Instead the server passes down exactly what the island needs
   (`brand`, `projectTitles`). Measured: 41 kB gzipped on `/`.

## 4. 3D scene architecture

```
UniverseIsland (client)
  │  useWebGLSupport()      → 'checking' | 'ok' | 'unsupported'
  │  useIsCoarseOrNarrow()  → simplify on phones
  │  useReducedMotion()     → freeze drift
  │  useUniverseSelection() → shared selection state (also drives the fallback)
  │
  ├─ 'unsupported' | narrow  → <UniverseFallback/>      (SVG, 0 kB of three)
  └─ 'ok'                    → <Suspense><UniverseScene/></Suspense>
                                 dynamic(() => import('./UniverseScene'),
                                         { ssr: false, loading: Skeleton })
```

`UniverseScene` contents — deliberately small:

- One `Canvas` with `dpr={[1, 1.75]}` and `frameloop` switching to `demand`
  under reduced motion **or when the scene is scrolled off-screen**.
- A central icosahedron "core" (wireframe + inner solid), 2 materials.
- Six node meshes on a ring, procedural geometry (`octahedronGeometry`).
- One `lineSegments` carrying all six connectors — a single draw call, built
  from a `Float32Array`, rather than six line objects.
- Three lights. **No shadows, no post-processing, no environment map, no
  loaded model, no texture file.**
- **No text inside the canvas, and no DOM portalled into it.** Node names live
  in the rail below the canvas and in the caption drawn over it, both ordinary
  DOM. (drei's `<Html>` was used for in-scene labels at first; it portals real
  nodes into the canvas container and threw `NotFoundError` on unmount. It was
  removed, and `@react-three/drei` with it — nothing else needed the package.)

Failure handling: an error boundary around the island swaps in the fallback;
`WebGLRenderingContext` creation is probed before mount; `onError` on the Canvas
also triggers the swap.

## 5. Content architecture

```
src/content/
  schema.ts         Zod schemas + inferred types
  site.config.ts    ← THE single file to edit for personal details
  projects.ts       Project[] (published flag per project)
  method.ts         MethodStage[] — shared by Universe and Method section
  capabilities.ts   CapabilityGroup[]
  experiments.ts    Experiment[]
  index.ts          Parses every module through its schema and re-exports
```

`index.ts` runs `schema.parse()` at module evaluation. Because every route
imports from it, a malformed content file fails `next build`, not the browser.

The Engineering Universe and the Engineering Method read the *same*
`method.ts`, which is why the two can never drift apart.

## 6. Design tokens

Declared once in `src/app/globals.css` inside Tailwind v4's `@theme`:

- Colour: `--color-void` (page), `--color-surface`, `--color-surface-raised`,
  `--color-line`, `--color-ink` (primary text), `--color-ink-muted`,
  `--color-ink-faint`, `--color-signal` (accent), `--color-signal-dim`.
- Type: `--font-display` (Space Grotesk), `--font-sans` (Inter),
  `--font-mono` (JetBrains Mono), all via `next/font` → self-hosted.
- Scale: `--text-micro` … `--text-display`, fluid with `clamp()`.
- Space: 4 px base, exposed as Tailwind spacing.
- Motion: `--ease-out-expo`, `--dur-fast|base|slow`.
- Radius, border, focus-ring width.

Breakpoints use Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).

## 7. Animation architecture

- Entrance reveals: one `<Reveal>` client wrapper. An IntersectionObserver
  sets `data-shown`, and a CSS transition on `.reveal` does the rest.
  `usePrefersReducedMotion()` collapses it to a plain `div`, and a `<noscript>`
  rule in the root layout forces `.reveal` visible when no JavaScript runs —
  so content can never be stranded at `opacity: 0`.
- No scroll-jacking, no parallax on text.
- Canvas drift is a `useFrame` rotation of ≤0.05 rad/s, disabled under reduced
  motion **and whenever the scene is off-screen** — an `IntersectionObserver`
  drops `frameloop` to `demand`, so the canvas stops rendering entirely once
  the visitor scrolls past it.
- A global `@media (prefers-reduced-motion: reduce)` block zeroes transition and
  animation durations as a backstop for anything CSS-driven.

## 8. SEO

- `metadataBase` from `NEXT_PUBLIC_SITE_URL`, default `http://localhost:3000`.
- Root `metadata` with title template, description, OG and Twitter cards.
- Per-case-study `generateMetadata`.
- `app/sitemap.ts` enumerates `/`, `/work`, and every published project.
- `app/robots.ts` allows all, points at the sitemap.
- JSON-LD `Person` on the home route.
- Canonical URLs emitted only when `NEXT_PUBLIC_SITE_URL` is set.

## 9. Testing strategy

| Layer | Tool | Covers |
|-------|------|--------|
| Content | Vitest | Schema parse, unique slugs, status legality, no `TODO:` in published content, every project referenced by a method stage exists |
| Logic | Vitest | Selection reducer, status labels, slug helpers |
| Component | Vitest + RTL + jsdom | `UniverseFallback` keyboard interaction, `CopyEmailButton` |
| E2E | Playwright | Console cleanliness, keyboard path, WebGL-disabled fallback, internal link integrity, reduced-motion |

Playwright is configured but not run as part of `npm run verify`, because it
requires a browser download that may not be available in every environment. It is
run explicitly with `npm run test:e2e`.
