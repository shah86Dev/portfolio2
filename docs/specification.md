# Specification — Shahzaib · The Digital Frontier

Status: accepted · Version 1.0.0 · 2026-10-16

Authority: this document is subordinate to [`constitution.md`](./constitution.md).

---

## 1. Problem

Shahzaib builds software with AI coding agents working against written
specifications. A conventional developer portfolio — a grid of cards and a skills
bar chart — does not communicate that, and cannot be distinguished from a
template. The site must make the *method* legible and back it with real artefacts.

## 2. Personas and journeys

| # | Persona | Arrives wanting | Success looks like |
|---|---------|-----------------|--------------------|
| P1 | Hiring manager / technical lead | To judge capability in under two minutes | Reads hero, scans one case study, reaches contact |
| P2 | Prospective client (small business) | To know whether this person can solve their problem | Reads the A.A Matt case study, understands cost and scope, emails |
| P3 | Fellow engineer | To see how the thing was built | Reads the Engineering Method, opens the repository links |
| P4 | Screen-reader / keyboard user | The same information as everyone else | Completes P1's journey with no mouse and no WebGL |

Primary journey (P1): land → understand positioning → open Engineering Universe
or scroll → reach Selected Work → open one case study → contact.

## 3. Functional requirements

### FR-1 Hero
- Renders brand name, positioning headline, supporting statement.
- Two actions: **Explore projects** (→ `/#work`), **Contact** (→ `/#contact`).
- Hosts the Engineering Universe. Hero text is real DOM, never canvas text.
- Hero content is readable before the 3D chunk has loaded.

### FR-2 Engineering Universe
- Six nodes: Discover, Specify, Architect, Build, Verify, Ship.
- A central structure representing the system under construction.
- Exactly one node is "active" at a time; a node is activated by click, tap,
  `Enter`/`Space` on its DOM control, or arrow keys within the node list.
- Activation reveals: title, one-line summary, description, deliverables list,
  and a link to the related project where one exists.
- A **Reset view** control returns the camera to the overview pose and clears
  selection; it is present whenever the camera can move.
- No text is drawn inside the canvas. Node names appear in the DOM rail
  beneath it and in a DOM caption positioned over it, both in the
  accessibility tree.
- The canvas is `aria-hidden` and `pointer-events` are scoped so page scrolling,
  text selection and tab order are unaffected.

### FR-3 Universe fallback
- If WebGL is unavailable, initialisation throws, or the user is on a small
  viewport, an SVG/DOM diagram with identical nodes and identical interaction is
  rendered instead.
- The fallback is not a degraded message; it is a working alternative.

### FR-4 About
- Explains approach: structured problem-solving, spec-driven engineering,
  AI-assisted implementation, product thinking, verification.
- Contains no employment history, qualification, or duration claim.

### FR-5 Selected work
- Gallery of projects from `src/content/projects.ts`.
- Each card: title, one-line summary, status badge, stack chips.
- Each project has a case-study route `/work/<slug>` documenting: problem and
  context, intended users, solution, Shahzaib's contribution, architecture
  decisions, stack, verification, outcomes *or* objectives, and limitations.
- Unverified projects are present in config but excluded from rendering until
  their `published` flag is set.

### FR-6 Engineering method
- Eight stages: Discover → Specify → Architect → Plan → Implement → Verify →
  Deploy → Improve.
- Interactive: selecting a stage shows what it produces and what the human
  controls. Shares its data source with the Engineering Universe.

### FR-7 Capabilities
- Six groups: Frontend & interactive UI, Backend & APIs, AI & agent workflows,
  Data & storage, Developer tooling, Testing & deployment.
- Each entry is marked `applied` (used in a project in this site's content) or
  `learning`. No percentages, no star ratings.

### FR-8 Experiments
- Current work in progress, each with an honest status line.

### FR-9 Contact
- Email as `mailto:` plus copy-to-clipboard.
- GitHub / LinkedIn / WhatsApp links render only when configured.
- No form. (Constitution §7.3.)

### FR-10 Navigation
- Sticky header with in-page anchors and a skip link.
- Anchor navigation respects reduced motion (`scroll-behavior` is conditional).
- A 404 route that offers the way back.

## 4. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | First load JS within the budgets in Constitution §6.1 |
| NFR-2 | No `three` in the initial chunk of any route |
| NFR-3 | Zero console errors or React warnings on `/` and `/work/<slug>` |
| NFR-4 | Usable at 320 px, 768 px, 1280 px, 1920 px |
| NFR-5 | Full keyboard operation with a visible focus ring |
| NFR-6 | `prefers-reduced-motion` honoured by every animation |
| NFR-7 | Site fully usable with WebGL disabled |
| NFR-8 | Type-check, lint, unit tests and production build all pass |
| NFR-9 | Deployable to Vercel with zero required environment variables |

## 5. Content inventory (evidence-based)

Derived from a read-only inspection of `D:\` on 2026-10-16.

| Project | Evidence found | Status assigned |
|---------|----------------|-----------------|
| A.A Matt WhatsApp Agent | `D:\aa-matt-whatsapp-agent\` — FastAPI app (8 modules), `requirements.txt`, `business/aa_matt.yaml`, 24-case eval suite, pytest suite, detailed README | `implemented` — not deployed; README states a laptop + tunnel is demo-only |
| Gen-Z Kids | `D:\gen-z\` — Spec-Kit Plus scaffold (`.specify/`), README stating "setup only. No application code yet." | `in-progress` |
| Teacher's Day Greeting | `D:\teachers-day-greeting-nextjs\` — Next.js App Router app, 4 routes, 5 components, 5 screenshots | `implemented` — no public URL found |
| A.A Matt e-commerce | None found | Unpublished placeholder in config |
| ZAYMEXA Technologies | None found | Unpublished placeholder in config |
| Children's learning platform | None found | Unpublished placeholder in config |

Projects with no evidence are written into the config with `published: false` and
`TODO:` fields. They do not render.

## 6. Acceptance criteria

- **AC-1** With JavaScript enabled and WebGL available, `/` renders the hero and
  a 3D universe; selecting each of the six nodes updates the detail panel.
- **AC-2** With WebGL unavailable, `/` renders the hero and the DOM diagram;
  selecting each of the six nodes updates the same detail panel.
- **AC-3** From a cold load, `Tab` reaches: skip link → nav links → hero CTAs →
  universe nodes → reset → section controls → footer links, in that visual order.
- **AC-4** With `prefers-reduced-motion: reduce`, no element animates on load and
  the camera does not drift.
- **AC-5** Every project card links to a case study that returns HTTP 200 and
  contains all nine documentation headings.
- **AC-6** No rendered text anywhere on the site contains the string `TODO:`.
- **AC-7** `npm run verify` exits zero.
