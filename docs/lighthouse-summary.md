# Lighthouse — measured results

The raw reports (`docs/lighthouse/*.report.{json,html}`, ~6 MB per run) are
git-ignored. This file is the part worth keeping. The headline scores are also
recorded in [constitution.md](./constitution.md) §6.

## What was measured, and how

| | |
|---|---|
| Date | 2026-10-16 |
| Lighthouse | 13.5.0 (`node_modules/lighthouse/cli/index.js`) |
| Browser | HeadlessChrome/154.0.0.0 on Windows 10 x64, `--headless=new --no-sandbox --disable-gpu` |
| Target | `npx next start --port 3100` — a **local production build**, not a deployment |
| Routes | `/` and `/work/aa-matt-whatsapp-agent` |
| Presets | `--preset=desktop`, and the default mobile preset (4× CPU throttle, emulated slow 4G) |
| Runs | 5 per route × preset combination (20 in total) |

```bash
npm run build
npx next start --port 3100
node node_modules/lighthouse/cli/index.js http://localhost:3100/ \
  --output=json --output=html --output-path=docs/lighthouse/home-desktop \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" --preset=desktop
```

**A localhost measurement is not a production measurement.** There is no real
network, no TLS handshake, no CDN, no cold start and no third-party traffic.
Mobile figures come from Lighthouse's *emulated* throttling on a desktop CPU,
not from a phone. The site is not deployed anywhere, so a production
measurement does not exist yet. Treat these as a development signal.

## Scores

Median of 5 runs, with the observed range where it varied.

| Route | Preset | Performance | Accessibility | Best practices | SEO |
|-------|--------|-------------|---------------|----------------|-----|
| `/` | desktop | **99** (98–99) | **100** | **100** | **100** |
| `/` | mobile | **89** (89–93) | **100** | **100** | **100** |
| `/work/aa-matt-whatsapp-agent` | desktop | **100** | **100** | **100** | **100** |
| `/work/aa-matt-whatsapp-agent` | mobile | **96** (93–96) | **100** | **100** | **100** |

Accessibility, best practices and SEO were 100 on **every one of the 20
post-fix runs** — no range to report.

### Against the §6 targets

- **Accessibility ≥ 95 — met**, at 100 on both routes and both presets.
- **Performance ≥ 90 — met on three of the four**, and missed on `/` mobile by
  a single point at a median of 89 (range 89–93). Say "89, just under",
  not "about 90".

### Core Web Vitals

Median of the 4 instrumented runs, with range. CLS was **0 on all 20 runs**.

| Route / preset | LCP | TBT | CLS |
|---|---|---|---|
| `/` desktop | 0.65 s (0.64–0.70) | 80 ms (69–110) | **0** |
| `/` mobile | 2.99 s (2.92–3.09) | 171 ms (127–198) | **0** |
| `/work/[slug]` desktop | 0.59 s (0.57–0.60) | 0 ms | **0** |
| `/work/[slug]` mobile | 2.76 s (2.73–2.90) | 88 ms (55–150) | **0** |

## Read this before quoting any performance number

These scores were measured twice on the same machine, hours apart, with the
performance-relevant code identical. The results were **not** the same:

| Session | Lighthouse `benchmarkIndex` | `/` desktop performance |
|---|---|---|
| First, machine busy | 786–1053 | 86, and 78–91 across four runs |
| Second, machine quiet | 1300–1813 | **98–99 across five runs** |

The host was roughly 40 % slower in the first session, and the score moved
more than 20 points because of it. The table above reports the second
session: it is both the faster host *and* by far the more stable one
(98–99 across five runs versus a 13-point spread).

The lesson is not "the site got faster" — it did not. It is that **a local
Lighthouse performance score mostly measures the machine it ran on.** When
re-measuring, record `environment.benchmarkIndex` from the JSON alongside the
score, run each configuration at least three times, and publish the range.
A single run on a loaded laptop is close to meaningless.

The accessibility, best-practices and SEO audits were byte-identical across
both sessions, as you would expect — a contrast ratio and a 404 do not care
how busy the CPU is. Those three scores are trustworthy from a single run.

## The 3D canvas, specifically

Two questions were asked of the measurement:

- **Does the lazily loaded 3D canvas cause layout shift?** **No. CLS was 0 on
  all 20 runs**, on both routes and both presets. The container reserves its
  box with `aspect-ratio: 1 / 1` before anything mounts
  (`EngineeringUniverse.tsx`), and the measurement confirms it works.
- **Does it affect LCP?** No. LCP is the server-rendered hero text — FCP is
  0.4 s on `/` desktop and the LCP follows at 0.65 s, well before the canvas
  exists. The canvas does cost **TBT**: on a desktop viewport the universe is
  above the fold, so the visibility gate opens on the first frame and the
  919 kB raw (236.6 kB gzipped) `three` chunk is parsed during load. On a
  quiet host that is ~80 ms of blocking and performance still lands at 99, so
  it is not currently worth engineering around — see the reverted experiment
  below for what happened when it was.

## Fixed as a result

Both fixes are deterministic — they hold regardless of host load.

1. **Contrast failure on `/`** (`color-contrast`, accessibility **97 → 100**).
   The ordinal numeral on the *selected* tab in the engineering-method rail
   was `--color-ink-faint` (#7b8595) on `--color-signal-wash` (#0b2630) at
   11 px: **4.22:1**, under the 4.5:1 floor §5.3 sets. It now uses
   `--color-signal` when selected — **9.0:1** — which is also what
   `UniverseRail` already did for the same element in the hero. The two
   components had drifted apart; they now agree.
   `src/components/sections/Method.tsx`.

   Note the two tokens named in the brief are *not* themselves at fault.
   Against `--color-void` (#05070c), `--color-ink-faint` is **5.40:1** and
   `--color-ink-muted` is **7.92:1** — both pass, and Lighthouse raised
   nothing against either. Only the tinted selected surface pushed one
   combination under the floor.

2. **`/favicon.ico` 404 on every route** (`errors-in-console`, best practices
   **96 → 100** on all four configurations). The site shipped no icon, so
   every page load logged a console error. Added `src/app/icon.svg`, which
   Next serves and links automatically.

## Tried, measured, and reverted: idle-gating the 3D chunk

Worth recording so nobody tries it again without knowing how it went.

**The idea.** On desktop the universe is above the fold, so the `three` chunk
parses while React is still hydrating. Gating the scene on
`nearViewport && idle` instead of `nearViewport` alone — via a
`useHasBeenIdle` hook using `requestIdleCallback` — moves that parse after
hydration. The skeleton already reserves the box, so nothing would shift.

**Why it was reverted.** It broke the universe's interaction tests on desktop,
reproducibly:

| Build | `-g "engineering universe" --repeat-each=3` |
|---|---|
| With the idle gate | **2 of 6 passed** |
| Without it | **6 of 6 passed** |

One failure was a 30-second timeout on *clicking* the reset button. That is
the real objection, and it is a user-facing one rather than a test artefact:
the gate does not remove the 919 kB parse, it **moves it out of page load and
into the first second and a half of interaction** — precisely when somebody is
reaching for the rail. Blocking the main thread while the visitor is clicking
is worse than blocking it while they are still reading the hero.

The supposed gain did not survive scrutiny either. It looked like 86 → 90 on
desktop, but that was one run during the loaded session, inside a 78–91 noise
band. On a quiet host the ungated build scores 98–99 with ~80 ms of TBT, so
there was no problem left to solve.

## Flagged and deliberately not changed

- **`unused-javascript` — ~144 KiB on `/`.** Almost all of it is the `three`
  chunk, ~50 % unused at first paint. That is what a 3D engine looks like: the
  unused half is geometry and material code the scene reaches later. The chunk
  is already lazy and already excluded from every route's initial payload.
  Shrinking it further means removing the universe.
- **`legacy-javascript` — 14 KiB.** Polyfills Next.js emits for its own
  browserslist target (`Array.prototype.at`, `Object.fromEntries`, …).
  Dropping them narrows browser support to save 14 KiB. Not worth it.
- **`render-blocking-insight` — the 8.6 kB stylesheet.** One Tailwind bundle,
  which Next links in the head. Hand-inlining critical CSS would be a brittle
  trick against the framework for a sub-frame win.
- **`network-dependency-tree-insight` / "no origins were preconnected".**
  Lighthouse itself reports "No additional origins are good candidates for
  preconnecting" — the site makes no third-party requests, which is §7.4
  working as intended. Nothing to fix.
- **`valid-source-maps`** (seen on `/` desktop in the loaded session).
  Production browser source maps are off, which is the Next default and
  deliberate: shipping them would publish the source. Informational.
- **`forced-reflow-insight` — ~31 ms, attributed to `[unattributed]`.**
  Lighthouse cannot name a call site, so there is nothing actionable; chasing
  it blind would be guesswork.
- **Mobile LCP ~2.8–3.0 s**, and the 89 on `/` mobile that follows from it.
  This is emulated 4× CPU throttling and slow 4G against localhost. The
  document itself arrives in ~100 ms; the rest is emulated transfer plus
  hydration of React 19 / Next 16, which §6 already records as close to the
  framework floor. The honest next step is a real measurement against a
  deployed origin, not more local tuning.

## Reproducing

```bash
npm run build
npx next start --port 3100
# in another shell
node node_modules/lighthouse/cli/index.js http://localhost:3100/ \
  --output=json --output=html --output-path=docs/lighthouse/home-desktop \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" --preset=desktop
```

Run each configuration at least three times, take the median, publish the
range, and record `environment.benchmarkIndex` next to it. The section above
shows what happens when you do not.
