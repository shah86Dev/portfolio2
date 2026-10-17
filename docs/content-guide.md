# Content guide

Everything a visitor reads comes from `src/content/`. You never have to open a
component to change a word on the site.

---

## Before you publish

These are drafted defaults, not confirmed facts. All of them are in
[`src/content/site.config.ts`](../src/content/site.config.ts) and marked
`⟵ CHECK THIS`.

| What | Current value | Why it needs you |
|------|---------------|------------------|
| Contact email | `shahzaib8620@gmail.com` | Defaulted to the address on this machine's Claude account. Change it if you want a different address shown publicly. |
| Headline | "I turn ideas into intelligent digital products." | Drafted positioning copy. Yours to approve or rewrite. |
| Supporting statement | "Exploring the intersection of…" | Same. |
| Bio (3 paragraphs) | Describes how you work | Written from your actual projects. It deliberately makes **no** claim about where you have worked, for how long, or for whom — check it reads like you. |
| GitHub / LinkedIn | *not set* | Uncomment and fill in `contact.github` / `contact.linkedin`. Until you do, no link is rendered — the site never shows a dead social icon. |
| WhatsApp | *not set* | Only set this if the number is meant for public display. |
| `emailSubject` | "Project enquiry via shahzaib.dev" | Update if your domain differs. |

Three projects are in `projects.ts` with `published: false` because no
evidence for them was found on this machine: **A.A Matt E-commerce**,
**ZAYMEXA Technologies**, and the **children's learning platform**. They do
not render anywhere. See "Publishing a project" below.

---

## Adding or editing a project

Open [`src/content/projects.ts`](../src/content/projects.ts).

```ts
{
  slug: "my-project",            // kebab-case; becomes /work/my-project
  title: "My Project",
  summary: "One sentence a stranger would understand.",
  status: "implemented",         // in-progress | prototype | implemented | deployed
  period: "2026",                // optional — omit rather than guess
  stack: ["Next.js", "Postgres"],// what you actually used
  liveUrl: "https://…",          // REQUIRED if status is "deployed"
  repoUrl: "https://…",          // optional
  image: {                       // optional, but must be a real screenshot
    src: "/projects/my-project.png",   // put the file in public/projects/
    alt: "What the screenshot shows.",
    width: 1280, height: 900,          // the file's real dimensions
  },
  stageId: "implement",          // which universe stage this illustrates
  evidence: [                    // what someone could inspect to check you
    { label: "Source", detail: "…" },
  ],
  caseStudy: {
    problem: "…", users: "…", solution: "…", contribution: "…",
    architecture: ["…"],         // decisions, with their trade-offs
    verification: ["…"],         // what was actually tested
    outcomes: [],                // ONLY measured results. Empty is fine.
    objectives: ["…"],           // shown when outcomes is empty
    limitations: ["…"],          // what is missing or unproven
  },
  published: true,
}
```

### What the statuses promise

| Status | Means |
|--------|-------|
| `in-progress` | Being built now. Not finished. |
| `prototype` | Proves the idea. Not built to be relied on. |
| `implemented` | Built and working. Not deployed publicly. |
| `deployed` | Live at a URL anyone can open. **Requires `liveUrl`.** |

### Outcomes vs objectives

`outcomes` is for results you measured. If you did not measure anything, leave
it as `[]` — the case study then renders your `objectives` under a heading
that says so. This is enforced by a test, and it is the single most important
rule in this repository: the site is only worth anything if a reader can trust
it.

### Publishing a placeholder project

1. Replace every `TODO:` value with the truth.
2. Add at least one real `evidence` entry.
3. Set `published: true`.
4. Run `npm test` — it will tell you if a placeholder survived.

---

## Editing the engineering method

[`src/content/method.ts`](../src/content/method.ts) drives **both** the 3D
universe and the Method section, so the two can never disagree.

- Exactly six stages must have `inUniverse: true` — the scene is built for
  six nodes, and the schema rejects any other number.
- `ordinal` is a two-digit string used for display ordering.
- `relatedProjectSlug` must name a **published** project, or no link renders.
- `humanControl` is the point of the whole section. Keep it honest.

## Editing capabilities

[`src/content/capabilities.ts`](../src/content/capabilities.ts).

- `applied` means it was used in a project documented on this site, and
  `evidenceSlug` must name that project. A test enforces this.
- `learning` means exactly that.
- There are no percentages and no star ratings. Do not add them.

## Editing experiments

[`src/content/experiments.ts`](../src/content/experiments.ts). Each entry needs
a present-tense `status` line. "Setup only, nothing built yet" is a perfectly
good status — delete an entry rather than let it go stale.

---

## Changing the look

Design tokens are in one place: the `@theme` block at the top of
[`src/app/globals.css`](../src/app/globals.css) — colours, type scale, radii,
easing, layout widths.

Changing `--color-signal` re-skins the whole site. Two things do **not** follow
automatically, because `three.js` cannot read CSS variables:

- the `COLOR` constants at the top of
  [`UniverseScene.tsx`](../src/components/universe/UniverseScene.tsx);
- the hex values in [`opengraph-image.tsx`](../src/app/opengraph-image.tsx).

If you change the accent, check contrast. Body text needs 4.5:1 against its
background; the current `--color-ink-muted` sits at about 8:1 on `--color-void`.

## After any content change

```bash
npm run verify
```

Type-check, lint, tests and production build. If the content rules are
satisfied, it exits 0.
