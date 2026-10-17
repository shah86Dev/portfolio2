# Shahzaib — The Digital Frontier

An interactive portfolio built around **The Engineering Universe**: a 3D model
of how an idea becomes a product, which stays fully usable with WebGL switched
off, with a keyboard only, and with motion disabled.

> **Before you publish:** a few personal details are drafted defaults rather
> than confirmed facts. They are all in one file and listed in
> [`docs/content-guide.md`](./docs/content-guide.md#before-you-publish).

---

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit and component tests |
| `npm run test:e2e` | Playwright (needs `npx playwright install chromium` once) |
| **`npm run verify`** | **typecheck → lint → test → build.** The gate before shipping |

## Editing the content

Everything a visitor reads lives in `src/content/`. No component hard-codes a
name, a claim or a contact address.

| File | Holds |
|------|-------|
| **`site.config.ts`** | **Name, headline, bio, email, social links** — start here |
| `projects.ts` | Case studies, status, stack, evidence |
| `method.ts` | The eight engineering stages (drives the 3D universe too) |
| `capabilities.ts` | Skill groups, each marked `applied` or `learning` |
| `experiments.ts` | Current experiments |
| `schema.ts` | The rules all of the above must satisfy |

Content is validated by Zod when the module loads, so a mistake fails
`npm run build` instead of reaching a visitor. The rules it enforces:

- a project marked `deployed` must have a `liveUrl` that can be opened;
- nothing containing a `TODO:` placeholder can be `published`;
- every capability marked `applied` must name a published project;
- slugs are unique and kebab-case;
- the universe has exactly six nodes.

See [`docs/content-guide.md`](./docs/content-guide.md) for worked examples.

## How it is built

- **Next.js 16 App Router**, Server Components by default. Client components
  exist only where state, events or WebGL require them.
- **`three` is in exactly one module**, loaded through `next/dynamic` with
  `ssr: false` behind an intersection check. It is absent from the initial
  JavaScript of every route — verified, not assumed.
- **Client components never import `@/content` for values.** The server passes
  down what they need. This keeps the case-study prose and Zod out of the
  browser bundle.
- **Design tokens** are declared once, in a Tailwind 4 `@theme` block in
  `src/app/globals.css`.
- **No database, no CMS, no analytics, no tracking.**

The reasoning is written down:

| Document | Purpose |
|----------|---------|
| [`docs/constitution.md`](./docs/constitution.md) | The engineering rules, including measured performance budgets |
| [`docs/specification.md`](./docs/specification.md) | Requirements and acceptance criteria |
| [`docs/architecture.md`](./docs/architecture.md) | Structure and the decisions behind it |
| [`docs/implementation-plan.md`](./docs/implementation-plan.md) | The task breakdown this was built from |
| [`docs/deployment.md`](./docs/deployment.md) | Deploying to Vercel |
| [`docs/content-guide.md`](./docs/content-guide.md) | Editing the content |

## Accessibility

The 3D canvas is decorative and `aria-hidden`. The control is a real DOM
tablist underneath it — arrow keys, `Home`/`End`, a roving tabindex and
`aria-selected`. Everything the scene can show, that rail and its panel can
show too, which is why the site is unchanged when WebGL is missing.

`prefers-reduced-motion: reduce` is honoured in three places: the component
logic, the CSS rule for `.reveal`, and a global backstop that zeroes every
transition. With JavaScript off, a `<noscript>` rule forces revealed content
visible, so nothing is ever stranded at `opacity: 0`.

## Project structure

```
docs/            Constitution, spec, architecture, plan, deployment, content guide
public/projects/ Real screenshots of real projects
src/
  app/           Routes, metadata, sitemap, robots, OG image, global CSS
  components/
    layout/      Header, footer
    sections/    Hero, About, Work, Method, Capabilities, Experiments, Contact
    universe/    The Engineering Universe: 3D scene, SVG diagram, rail, panel
    ui/          Section, Cta, StatusBadge, Reveal
    work/        Project card
  content/       Typed, schema-validated content  ← edit here
  lib/           Hooks, pure universe geometry, link helpers
tests/
  unit/          Vitest
  e2e/           Playwright
```

## Deploying

See [`docs/deployment.md`](./docs/deployment.md). In short: push to GitHub,
import into Vercel, accept the detected Next.js settings, and set
`NEXT_PUBLIC_SITE_URL` to your domain once you have one. No other environment
variable is needed, and there are no secrets.
