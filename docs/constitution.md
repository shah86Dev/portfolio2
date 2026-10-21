# Project Constitution — Shahzaib · The Digital Frontier

Version 1.0.0 · Ratified 2026-10-16 · Last amended 2026-10-16

This document is the highest-authority engineering rulebook for this repository.
Where any other document, comment, or convenience conflicts with it, this
document wins. Amendments are made by editing this file and noting the change in
the version line above.

---

## 1. Product goals

1. Communicate, within the first screen, that Shahzaib builds useful software
   products using AI-assisted engineering and written specifications.
2. Provide evidence — real projects, real stacks, real verification — rather than
   claims.
3. Give a visitor three unambiguous next actions: read the work, understand the
   method, make contact.
4. Be memorable without being hostile: the interactive 3D layer must deepen the
   story, never gate it.

## 2. Content integrity (NON-NEGOTIABLE)

1. **No invented facts.** Employment history, years of experience, client names,
   awards, testimonials, user counts, revenue figures, and performance scores are
   never written unless they are verifiable from evidence in this repository or
   supplied directly by Shahzaib.
2. **No invented outcomes.** When a project's results are unknown, the site
   states objectives and current status instead.
3. **Status is explicit.** Every project carries one of
   `in-progress | prototype | implemented | deployed`. `deployed` requires a
   reachable public URL recorded in the content config.
4. **Placeholders are visible.** Unknown personal details live in one config file,
   are prefixed `TODO:`, and are validated at build time. A placeholder must never
   be rendered as if it were a fact.
5. **No decorative fakery.** No fake terminals, fake dashboards, fake logos, or
   mock product UI presented as a shipped product.

## 3. Design principles

1. Dark editorial base, restrained accent. Accent is for meaning (state, focus,
   emphasis), never for decoration-at-volume.
2. Typography carries the hierarchy. Scale, weight and space do the work before
   colour or effects do.
3. Motion is purposeful, short, and interruptible. Nothing animates that delays
   reading.
4. Structure is visible: rules, grids, and alignment are part of the aesthetic.
5. One visual language across hero, scene, case studies, and footer.

## 4. Architecture rules

1. Next.js App Router. **Server Components by default.** `"use client"` requires a
   reason: browser event handling, animation, or WebGL.
2. The 3D bundle (`three`, `@react-three/*`) must not appear in the initial
   JavaScript of any route. It is loaded with `next/dynamic` and `ssr: false`,
   behind an intersection check.
3. All site content lives in typed modules under `src/content/`. Components read
   content; they never hard-code copy that a visitor can read.
4. Content modules are validated with Zod at module evaluation time, so bad
   content fails the build rather than the browser.
5. No database, no auth, no CMS, no analytics. Add one only with a written
   requirement in `docs/specification.md`.

## 5. Accessibility rules

Target: WCAG 2.2 AA where practical.

1. Every interaction available in the 3D canvas is available in the DOM.
2. Keyboard reaches every control; focus is always visible (`:focus-visible` ring
   of at least 2px at ≥3:1 contrast against its background).
3. Body text meets 4.5:1 contrast; large text and UI boundaries meet 3:1.
4. State is never signalled by colour alone — pair it with text, shape, or an
   `aria-*` attribute.
5. `prefers-reduced-motion: reduce` disables autonomous motion, parallax, and
   camera drift. Content still appears; it simply does not animate.
6. One `<h1>` per route; heading levels never skip.

## 6. Performance rules

1. Budget per route (initial JavaScript, gzipped, excluding the lazy 3D chunk):
   - `/` ≤ 200 kB
   - `/work`, `/work/[slug]` ≤ 190 kB
2. The 3D chunk is excluded from the above and must stay under 600 kB gzipped.

   **Measured 2026-10-16** against the production build, by extracting the
   `<script src>` list from each prerendered HTML file in `.next/server/app`
   and gzipping those chunks:

   | Route | Initial JS (gzip) | Budget | `three` present |
   |-------|------------------|--------|-----------------|
   | `/` | 187.8 kB | 200 kB | no |
   | `/work` | 181.8 kB | 190 kB | no |
   | `/work/[slug]` | 181.8 kB | 190 kB | no |
   | 3D chunk (lazy) | 236.6 kB | 600 kB | — |

   The budgets were set after this measurement, not before it. The first
   figures were 272.9 kB and 223.9 kB; three changes brought them down:
   dropping the animation library (−43 kB), keeping the content graph and Zod
   out of client components (−41 kB), and removing `@react-three/drei`
   (−2.6 kB from the lazy chunk). What remains is close to the React 19 and
   Next 16 App Router floor.

   Re-measure with the same method after any dependency change.

3. Lighthouse targets: Performance ≥ 90 and Accessibility ≥ 95 on `/` and
   `/work/[slug]`.

   **Measured 2026-10-16.** Lighthouse 13.5.0, HeadlessChrome/154, against
   `npx next start --port 3100` — a local production build. Five runs per
   route × preset; median shown, with the observed range where it varied.
   Full method, per-audit findings and the reproduction command are in
   [lighthouse-summary.md](./lighthouse-summary.md).

   | Route | Preset | Perf | A11y | Best practices | SEO |
   |-------|--------|------|------|----------------|-----|
   | `/` | desktop | 99 (98–99) | 100 | 100 | 100 |
   | `/` | mobile | 89 (89–93) | 100 | 100 | 100 |
   | `/work/[slug]` | desktop | 100 | 100 | 100 | 100 |
   | `/work/[slug]` | mobile | 96 (93–96) | 100 | 100 | 100 |

   Against the targets: **Accessibility is met** — 100 on every one of the 20
   runs, above the 95 target. **Performance is met on three of the four** and
   missed on `/` mobile by one point, at a median of 89. Write that as "89,
   just under the target", never as "about 90".

   **Measured again 2026-10-22, against the deployed site** at
   <https://portfolio2-pi-six-98.vercel.app> — real TLS, real CDN. This is
   the measurement that counts; the localhost table above is kept for
   comparison, not replaced. Lighthouse 13.5.0, HeadlessChrome/155, 30 runs.
   `/` is reported from a re-run on a quiet host (see the second caution).

   | Route | Preset | Perf | A11y | Best practices | SEO |
   |-------|--------|------|------|----------------|-----|
   | `/` | desktop | 95 (85–96) | 100 | 100 | 100 |
   | `/` | mobile | 92 (85–96) | 100 | 100 | 100 |
   | `/work/[slug]` | desktop | 100 | 100 | 100 | 100 |
   | `/work/[slug]` | mobile | 95 (87–98) | 100 | 100 | 100 |

   Against the targets in production: **Accessibility met** at 100 on all 30
   runs. **Performance met on all four medians.** But individual runs on `/`
   fell to 85 on both presets, so the honest phrasing is "a median of 95,
   with runs between 85 and 96" — not "95". CLS was 0 on all 30 runs.

   Production costs what localhost hid: TBT on `/` desktop roughly doubled,
   80 ms → 185 ms, because the 236.6 kB gzipped `three` chunk now arrives
   over a network instead of off a local disk. LCP *improved*, 0.65 s →
   0.56 s, on Vercel's CDN. `/work/[slug]`, which loads no canvas, sits at
   18 ms of TBT on the same origin.

   Three cautions, all of which bear on what these numbers mean:

   - **Localhost did not predict production, in either direction.** It was
     optimistic on blocking time and pessimistic on load time. Keep both
     tables; quote the production one.
   - **A local performance score mostly measures the host.** The same build
     was measured twice hours apart: with `benchmarkIndex` 786–1053 the `/`
     desktop score was 86 and ranged 78–91; with `benchmarkIndex` 1300–1813 it
     was 98–99. More than twenty points of difference, no code change. Record
     `environment.benchmarkIndex` beside any performance score, run each
     configuration at least three times, and publish the range.

     This caught a wrong conclusion on 2026-10-22. The first production batch
     put `/` desktop at a median of 86 — an apparent 13-point regression —
     but it ran while this machine was also running `tsc`, ESLint and Vitest,
     with `benchmarkIndex` swinging 798–1657. Re-run on a quiet host, the
     same deployment scored 95. Do not measure performance and run the test
     suite at the same time.
   - **Accessibility, best practices and SEO are not load-sensitive.** They
     were identical across both sessions and all 20 runs. One run is enough
     for those three; it is never enough for performance.

   Measured Core Web Vitals, and the rule they confirm: **CLS was 0 on all 20
   runs**, on both routes and both presets — rule 5 below holds, as measured.
   LCP is the server-rendered hero text (0.65 s on `/` desktop), not the
   canvas.

4. Device pixel ratio for the canvas is clamped to `[1, 1.75]`.
5. No layout shift from the canvas: its container reserves space with an aspect
   ratio before mount. *(Confirmed by measurement: CLS 0 on all 20 runs,
   2026-10-16.)*
6. The 3D scene mounts once the stage is near the viewport. Do **not** add an
   idle gate on top of that. It was tried on 2026-10-16 and reverted: it does
   not remove the 919 kB `three` parse, it moves it out of page load and into
   the first seconds of interaction, and the universe's desktop interaction
   tests went from 6/6 to 2/6 passing — one of them a 30-second timeout on a
   click. Blocking the main thread while someone is reaching for the rail is
   worse than blocking it while they are still reading the hero.
7. Fonts are self-hosted via `next/font` with `display: swap`. No render-blocking
   external stylesheet.
8. Budgets are *targets*. Any number reported to a human must come from a command
   whose output was actually observed.

   Lighthouse findings knowingly left unfixed — unused JS in the lazy `three`
   chunk, Next's 14 KiB legacy-JS polyfills, the single 8.6 kB render-blocking
   stylesheet, and source maps being off — are listed with reasons in
   [lighthouse-summary.md](./lighthouse-summary.md). None is a defect; each
   would cost a feature, browser support, or source privacy to "fix".

## 7. Security rules

1. No secrets in client code. The only public env var is `NEXT_PUBLIC_SITE_URL`.
2. External links carry `rel="noopener noreferrer"`.
3. No contact form unless a real, tested delivery mechanism exists. Until then,
   contact is `mailto:` plus a copy-to-clipboard affordance — both of which do
   exactly what they claim.
4. No third-party script tags.

## 8. Testing rules

1. Content invariants are unit-tested: schema validity, unique slugs, status
   legality, no unresolved `TODO:` in published content.
2. Pure logic (universe node selection, status labelling) is unit-tested.
3. End-to-end tests cover: page renders without console errors, keyboard path
   through the universe, the no-WebGL fallback, and every internal link resolving.
4. A change that alters content shape updates its test in the same change.

## 9. Definition of done

A change is done when all of the following are true and were observed, not assumed:

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` succeeds.
- [ ] The affected UI was exercised with a keyboard.
- [ ] No new content violates section 2.
- [ ] Any failure that remains is written down in the delivery report, not hidden.
