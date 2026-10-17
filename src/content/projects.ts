import type { Project } from "./schema";

/**
 * Selected work.
 *
 * Every published entry below was written after reading the actual project
 * directory on this machine on 2026-10-16: source files, README, tests and
 * screenshots. The `evidence` array on each project records exactly what was
 * inspected, so any claim here can be traced back to something real.
 *
 * Entries with `published: false` are projects mentioned in planning but for
 * which no evidence was found on this machine. They are kept here as filled-in
 * templates and do NOT render anywhere on the site. Replace the "TODO:" values
 * with the truth and set `published: true`.
 */
export const projectsInput: Project[] = [
  /* ===================================================================== */
  {
    slug: "aa-matt-whatsapp-agent",
    title: "A.A Matt WhatsApp Agent",
    summary:
      "A WhatsApp assistant for a small business that answers customer questions in Urdu, Roman Urdu or English — by text or voice note — and refuses to invent anything it was not told.",
    status: "implemented",
    stack: [
      "Python",
      "FastAPI",
      "Google Gemini",
      "WhatsApp Cloud API",
      "SQLite",
      "YAML knowledge base",
      "edge-tts / Azure Speech",
      "pytest",
    ],
    stageId: "discover",
    evidence: [
      {
        label: "Application source",
        detail:
          "Eight Python modules under app/ — agent, config, knowledge, llm, main, store, voice, whatsapp — plus requirements.txt pinning FastAPI, uvicorn, httpx, pyyaml, python-dotenv and edge-tts.",
      },
      {
        label: "Evaluation suite",
        detail:
          "evals/aa_matt_evals.yaml with 24 scripted customer messages (20 typed, 4 voice-note transcripts) checked for language, invented facts, handoff behaviour, topic adherence and prompt-injection resistance.",
      },
      {
        label: "Offline test suite",
        detail:
          "tests/test_agent.py — 24 tests of the plumbing that run without an API key, including a real conversion to WhatsApp's OGG/Opus voice-note format.",
      },
      {
        label: "Operator documentation",
        detail:
          "README covering the fact-file workflow, local terminal testing, Meta Cloud API webhook setup, token lifetimes, free-tier rate limits and how to resell the agent to another business.",
      },
    ],
    caseStudy: {
      problem:
        "A small business receives customer questions on WhatsApp all day — sizes, prices, delivery, payment, returns — in Urdu, Roman Urdu and English, as often spoken as typed. Answering them personally does not scale, but handing the conversation to a general-purpose chatbot is worse: a confident wrong price is more damaging than a slow reply.",
      users:
        "The business owner, who needs the routine questions handled without supervising every message; and their customers, many of whom prefer to speak rather than type, and who expect a reply in the language they used.",
      solution:
        "A FastAPI service sits behind the Meta WhatsApp Cloud API webhook. Every fact the agent is allowed to state lives in a single YAML file the owner edits. Gemini writes the reply, but it can only use what that file contains: anything still unfilled is hidden from the model entirely, so the question routes to a holding reply and a handoff alert to the owner instead of being answered from imagination. Voice notes are transcribed by Gemini, answered like text, and replied to with an Urdu voice note plus the same answer in writing — because prices are easier to trust when you can read them.",
      contribution:
        "Sole designer and implementer: the knowledge-gating approach, the FastAPI service and its modules, the handoff rules, the voice pipeline including WhatsApp's OGG/Opus requirement, the 24-case evaluation suite, the offline test suite, and the operator documentation.",
      architecture: [
        "One YAML file is the only source of facts. Unfilled fields are withheld from the prompt rather than left for the model to fill in — the refusal is structural, not a plea in the system prompt.",
        "Handoff is a first-class outcome, not an error path. Unknown prices, bulk orders, complaints and explicit 'talk to a person' requests produce a holding reply plus an owner alert, logged in SQLite.",
        "Text-to-speech is swappable (TTS_BACKEND). The free Microsoft Urdu voices are good enough to demonstrate with but run on an unofficial package, so paying clients move to official Azure Speech without a code change.",
        "Degradation is designed: if speech generation fails the customer still gets the text reply; if a voice note cannot be understood they are asked to repeat or type it; images get a polite redirect.",
        "Reselling is a configuration act — copy the business YAML, copy the eval file, point BUSINESS_FILE at it. No code changes.",
      ],
      verification: [
        "24 evaluation cases covering correct language, absence of invented prices and delivery times, handoff when required, topic adherence, resistance to 'ignore your instructions' attacks, and brevity of spoken replies.",
        "24 offline tests requiring no API key, including a genuine audio conversion to WhatsApp's voice-note format.",
        "A /health endpoint that reports how many facts are still unfilled, so the operator can see the agent's blind spots before customers do.",
        "A manual voice-testing script for trying real recordings across accents and background noise.",
      ],
      outcomes: [],
      objectives: [
        "Answer routine customer questions without the owner present, in the customer's own language and medium.",
        "Make an invented fact structurally impossible rather than merely discouraged.",
        "Hand over to a human at exactly the moments where a wrong answer costs money or trust.",
        "Stay at zero running cost while being demonstrated, with a documented, costed path to a paid tier for real clients.",
      ],
      limitations: [
        "Not deployed. It runs locally behind a tunnel, which the documentation states is suitable for demonstrations only — a real deployment needs an always-on host and a permanent Meta token.",
        "No usage figures exist, because it has not been run against live customer traffic.",
        "The free Gemini tier allows roughly 10–15 requests per minute and its data may be used for product improvement, so a paying client must be moved to the paid tier.",
        "The demo voice uses an unofficial package that could stop working without notice.",
        "The fact file is still partly unfilled; every blank field is a question the agent must hand to a human.",
      ],
    },
    published: true,
  },

  /* ===================================================================== */
  {
    slug: "gen-z-kids",
    title: "Gen-Z Kids",
    summary:
      "A spec-driven production pipeline for short animated Islamic moral-lesson videos for children aged 4–10, with Urdu narration, English subtitles and mandatory human approval gates.",
    status: "in-progress",
    stack: [
      "Spec-Kit Plus",
      "Python 3.12 (uv)",
      "FFmpeg",
      "Claude Code",
      "Windows + WSL2",
    ],
    stageId: "specify",
    evidence: [
      {
        label: "Repository state",
        detail:
          "A .specify/ workspace containing a constitution template, spec, plan, tasks, ADR and checklist templates, and the scripts that drive them. No application code yet.",
      },
      {
        label: "Project README",
        detail:
          "States the audience (ages 4–10), format (Urdu narration, English subtitles, 16:9), the Spec-Kit Plus workflow in order, the environment, and the first milestone. It states plainly: 'setup only. No application code yet.'",
      },
      {
        label: "Declared first milestone",
        detail:
          "One complete, human-approved 2–3 minute episode on honesty: still-image motion-comic scenes, Urdu narration, English subtitles, FFmpeg assembly, mandatory approval gates, and per-episode cost tracking.",
      },
    ],
    caseStudy: {
      problem:
        "Producing short animated moral-lesson videos for young children by hand is slow and expensive, and the parts that are easy to automate — narration, subtitling, assembly — are exactly the parts where an unsupervised generative pipeline is most dangerous. Content for a four-year-old cannot contain a plausible-sounding mistake.",
      users:
        "Children aged 4–10 as the audience, and the parents and teachers who decide what those children watch — an audience that grants no tolerance for unverified religious or moral content.",
      solution:
        "A specification-first production pipeline in which each stage — source verification, Urdu script, storyboard, narration, subtitles, assembly — is a defined step with a human approval gate in front of it. Generation is used where it saves time and is blocked where correctness matters more than speed. Cost is tracked per episode so the economics of the pipeline are visible from the first one.",
      contribution:
        "Defining the pipeline and its approval gates, setting up the Spec-Kit Plus workflow, and scoping the first milestone to one complete episode rather than a general-purpose system.",
      architecture: [
        "Spec-Kit Plus drives the order of work: constitution, then specification, then clarification, then plan and decision records, then tasks, then implementation — one milestone at a time.",
        "Still-image motion-comic scenes rather than full animation: dramatically cheaper to produce and to correct, and sufficient for the format.",
        "FFmpeg for assembly, keeping the final composition step deterministic and inspectable rather than hidden inside a service.",
        "Approval gates are mandatory and are part of the pipeline definition, not a convention someone might skip under deadline.",
        "Per-episode cost tracking built in from the start, so the pipeline's viability is measured rather than assumed.",
      ],
      verification: [
        "Source verification is the first stage of the pipeline: religious and moral content must be traced to a source before a script is written.",
        "A human approval gate between every stage; no stage output proceeds automatically.",
        "Milestone 1 is itself the verification of the approach — one complete, approved episode end to end before the pipeline is generalised.",
      ],
      outcomes: [],
      objectives: [
        "Produce one complete, human-approved 2–3 minute episode on honesty.",
        "Establish repeatable, inspectable stages rather than a single opaque generation step.",
        "Keep a human responsible for every claim that reaches a child.",
        "Know the real per-episode cost before committing to a series.",
      ],
      limitations: [
        "Setup only. The workflow and milestone are defined; no application code has been written yet.",
        "No episode has been produced, so neither the production time nor the per-episode cost is known.",
        "The quality ceiling of still-image motion comics for this audience is an assumption that milestone 1 is designed to test.",
      ],
    },
    published: true,
  },

  /* ===================================================================== */
  {
    slug: "teachers-day-greeting",
    title: "Teacher's Day Greeting",
    summary:
      "A small animated Next.js greeting built as a gift from one Class 1-B student to her teacher — a four-screen narrative with page transitions, ambient sound and a progress-aware route.",
    status: "implemented",
    period: "2025",
    stack: [
      "Next.js (App Router)",
      "TypeScript",
      "React",
      "Motion for React",
      "CSS",
    ],
    stageId: "implement",
    image: {
      src: "/projects/teachers-day-home.png",
      alt: "The Teacher's Day greeting home screen, captured from the running application.",
      width: 1280,
      height: 900,
    },
    evidence: [
      {
        label: "Application source",
        detail:
          "Next.js App Router project with four routes (home, letter, memories, thank-you) and five components: PageTransition, Particles, ProgressNav, SoundProvider and SoundToggle.",
      },
      {
        label: "Captured screenshots",
        detail:
          "Five screenshots of the running application: home, letter closed, letter open, memories and thank-you.",
      },
      {
        label: "Project README",
        detail:
          "Documents the stack and names every file that has to change to re-address the greeting to a different teacher.",
      },
    ],
    caseStudy: {
      problem:
        "A Teacher's Day card that is a single static page is forgettable. The brief was to make something a child could hand over that unfolds — that rewards moving through it — without becoming a thing she has to be taught how to use.",
      users:
        "One Class 1-B student presenting it, and one teacher receiving it, most likely on a phone, probably once.",
      solution:
        "A four-screen narrative rather than a page: an opening, a letter that opens, a memories screen and a thank-you. Transitions carry the visitor between screens, a progress indicator shows where they are in the sequence, and ambient sound is offered behind an explicit toggle rather than played at them.",
      contribution:
        "Sole designer and implementer: the four-screen structure, the transition and particle components, the sound provider and its opt-in toggle, the progress navigation, and the README that makes the greeting re-addressable.",
      architecture: [
        "Next.js App Router with one route per narrative beat, so each screen is a real URL that can be returned to or linked.",
        "Motion for React for page transitions, which keeps the animation declarative and lets the whole effect be removed in one place.",
        "Sound behind a provider and an explicit toggle — audio is never started without the visitor asking for it.",
        "No external image assets required for the starter version, so the project runs immediately after a clone with nothing to fetch.",
        "The teacher's name is a single constant, with the README naming every file that references it — personalisation is a documented edit, not an archaeology exercise.",
      ],
      verification: [
        "Exercised manually across all four routes; the five screenshots in the repository are captures of those runs.",
        "Verified that the project runs from a clean clone with npm install and npm run dev and no external assets.",
      ],
      outcomes: [],
      objectives: [
        "Make a greeting that unfolds rather than one that is simply read.",
        "Keep it usable on a phone, by a child, with no instructions.",
        "Make it re-addressable to another teacher through a documented one-line edit.",
      ],
      limitations: [
        "Not deployed to a public URL.",
        "No automated tests; verification was manual.",
        "Accessibility was not formally audited — the motion and sound are opt-out rather than preference-driven.",
        "Built for one recipient; it is a personal artefact, not a product.",
      ],
    },
    published: true,
  },

  /* ===================================================================== */
  {
    slug: "digital-frontier-portfolio",
    title: "The Digital Frontier",
    summary:
      "This site: a dark editorial portfolio whose centrepiece is an interactive 3D model of the engineering method — built to stay fully usable with WebGL switched off.",
    status: "implemented",
    period: "2026",
    stack: [
      "Next.js 16 (App Router)",
      "TypeScript (strict)",
      "React 19",
      "Tailwind CSS 4",
      "React Three Fiber",
      "Three.js",
      "Zod",
      "Vitest",
      "Playwright",
    ],
    stageId: "deploy",
    evidence: [
      {
        label: "This repository",
        detail:
          "Specification, architecture and implementation plan under docs/, typed and schema-validated content under src/content/, and the verification suite behind npm run verify.",
      },
      {
        label: "Dual-path interaction",
        detail:
          "The Engineering Universe exists twice: a React Three Fiber scene and an SVG diagram driven by the same selection state and the same content, so the WebGL path is an enhancement rather than a requirement.",
      },
    ],
    caseStudy: {
      problem:
        "A portfolio that says 'I use AI-assisted, specification-driven engineering' and then shows a template with a skills bar chart has argued against itself. The site needed to be the evidence: the method visible in the artefact, and the interactive layer earning its weight rather than taxing the visitor for it.",
      users:
        "Hiring managers and technical leads judging capability quickly; prospective clients deciding whether this person can solve their problem; engineers curious about how it was built; and keyboard and screen-reader users, who must get the same information as everyone else.",
      solution:
        "A dark editorial interface with one accent colour, built around the Engineering Universe: a 3D structure whose six orbiting nodes are the stages of building a product. Selecting a node — by mouse, touch, or keyboard — reveals what that stage produces and what a human stays responsible for. The 3D bundle is dynamically imported and never reaches a visitor whose browser cannot use it; those visitors get an SVG diagram with identical content and identical controls.",
      contribution:
        "Everything: the constitution, specification and architecture documents; the design tokens; the 3D scene and its DOM equivalent; the content schema that fails the build on a dishonest or unfinished entry; and the test suite.",
      architecture: [
        "Server Components by default. Client components exist only where state, events or WebGL require them, which keeps the content payload off the browser.",
        "The three.js dependency is isolated in one module behind next/dynamic with ssr disabled, so it is absent from the initial JavaScript of every route.",
        "All visitor-readable content lives in typed modules under src/content and is parsed by Zod at module-evaluation time — a malformed or placeholder-bearing entry fails the build instead of reaching a page.",
        "The Engineering Universe and the Engineering Method section read the same stage data, so the 3D scene and the prose can never disagree.",
        "Design tokens are declared once in a Tailwind 4 @theme block; components consume tokens, never raw colour values.",
        "Reduced motion is handled in three places — the component logic, the reveal wrapper, and a global CSS backstop — because one of them will eventually be forgotten.",
        "No animation library. The one entrance effect on the site is an IntersectionObserver and a CSS transition; measuring showed the dependency cost 43 kB gzipped on the home route for that single use.",
      ],
      verification: [
        "Vitest unit tests over the content layer: schema validity, unique slugs, deployed-means-reachable, and no unresolved placeholder in anything published.",
        "Component tests for the SVG universe fallback, covering arrow-key traversal and activation.",
        "Playwright specs for console cleanliness, the keyboard path through the universe, the WebGL-disabled fallback, and internal link integrity.",
        "A single npm run verify that runs type-checking, linting, unit tests and the production build.",
      ],
      outcomes: [],
      objectives: [
        "Make the engineering method the thing a visitor interacts with, not a paragraph they skim.",
        "Keep every piece of information reachable without WebGL, without a mouse, and with motion disabled.",
        "Make dishonest content a build failure rather than a matter of discipline.",
        "Keep the 3D layer off the critical path for everybody who does not use it.",
      ],
      limitations: [
        "Lighthouse has not been run. Bundle sizes were measured directly from the production build; the Lighthouse performance and accessibility scores in the constitution remain targets, not results.",
        "No light theme — the brand is a dark surface, and a half-finished light mode would be worse than none.",
        "The contact section is a mailto link, not a form, because no message-delivery mechanism has been built and tested.",
        "Some personal details are still drafted defaults awaiting confirmation; they are marked in src/content/site.config.ts.",
      ],
    },
    published: true,
  },

  /* =====================================================================
     NOT PUBLISHED — no evidence was found on this machine.
     Fill in the TODO values and set published: true to make one appear.
     ===================================================================== */
  {
    slug: "aa-matt-ecommerce",
    title: "A.A Matt E-commerce",
    summary: "TODO: one sentence describing what this store does and for whom.",
    status: "in-progress",
    stack: ["TODO: actual technologies used"],
    evidence: [
      {
        label: "TODO: what can be inspected",
        detail: "TODO: repository path, live URL, or screenshots.",
      },
    ],
    caseStudy: {
      problem: "TODO:",
      users: "TODO:",
      solution: "TODO:",
      contribution: "TODO:",
      architecture: ["TODO:"],
      verification: ["TODO:"],
      outcomes: [],
      objectives: ["TODO:"],
      limitations: ["TODO:"],
    },
    published: false,
  },
  {
    slug: "zaymexa-technologies",
    title: "ZAYMEXA Technologies",
    summary: "TODO: one sentence describing the corporate site and its purpose.",
    status: "in-progress",
    stack: ["TODO: actual technologies used"],
    evidence: [
      {
        label: "TODO: what can be inspected",
        detail: "TODO: repository path, live URL, or screenshots.",
      },
    ],
    caseStudy: {
      problem: "TODO:",
      users: "TODO:",
      solution: "TODO:",
      contribution: "TODO:",
      architecture: ["TODO:"],
      verification: ["TODO:"],
      outcomes: [],
      objectives: ["TODO:"],
      limitations: ["TODO:"],
    },
    published: false,
  },
  {
    slug: "kids-learning-platform",
    title: "Interactive Children's Learning Platform",
    summary: "TODO: one sentence describing the platform and its audience.",
    status: "in-progress",
    stack: ["TODO: actual technologies used"],
    evidence: [
      {
        label: "TODO: what can be inspected",
        detail: "TODO: repository path, live URL, or screenshots.",
      },
    ],
    caseStudy: {
      problem: "TODO:",
      users: "TODO:",
      solution: "TODO:",
      contribution: "TODO:",
      architecture: ["TODO:"],
      verification: ["TODO:"],
      outcomes: [],
      objectives: ["TODO:"],
      limitations: ["TODO:"],
    },
    published: false,
  },
];
