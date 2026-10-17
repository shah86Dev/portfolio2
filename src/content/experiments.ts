import type { Experiment } from "./schema";

/**
 * Current experiments.
 *
 * Only things that genuinely exist on this machine or are genuinely in
 * progress. The `status` line is present tense and honest — "setup only" is a
 * perfectly good status. Delete an entry rather than let it go stale.
 */
export const experimentsInput: Experiment[] = [
  {
    id: "voice-first-agents",
    title: "Voice-first agents for Urdu speakers",
    description:
      "Most conversational AI assumes typing, and most of it assumes English. The A.A Matt agent answers voice notes in Urdu and replies in kind — the open question is how well transcription holds up across accents, shop noise and road noise, and where the honest cut-off is for trusting a spoken number.",
    status: "Working locally; accuracy across real recording conditions is still being tested.",
    tags: ["Gemini", "Speech", "Urdu", "WhatsApp"],
  },
  {
    id: "spec-driven-pipelines",
    title: "Specification-gated media production",
    description:
      "Applying spec-driven development to something that is not an application: a video production pipeline where each stage has a written definition and a mandatory human approval gate, and where per-episode cost is tracked from the first episode rather than estimated afterwards.",
    status: "Workflow and first milestone defined; no episode produced yet.",
    tags: ["Spec-Kit Plus", "FFmpeg", "Content pipelines"],
  },
  {
    id: "webgl-without-cost",
    title: "3D that does not tax the visitor",
    description:
      "An interactive scene is easy to make and easy to make expensive. The constraint set here: procedural geometry only, no loaded models or textures, no post-processing, a clamped pixel ratio, the whole bundle dynamically imported, and a DOM equivalent that carries the same information for anyone who never loads it.",
    status:
      "Shipped on this site. Measured on 2026-10-16 against a local production build, five Lighthouse runs per route: the 3D chunk stays out of every route's initial JavaScript, cumulative layout shift is 0 on all twenty runs, and accessibility is 100. Home-route performance is 99 on desktop and 89 on mobile. Not yet measured against a real deployment, which is the number that would count.",
    tags: ["React Three Fiber", "Performance", "Accessibility"],
  },
  {
    id: "content-as-build-gate",
    title: "Making dishonest content fail the build",
    description:
      "Portfolios drift into exaggeration quietly. Here every visitor-readable claim is typed data parsed by Zod at build time: a project cannot be marked deployed without a URL that can be opened, and nothing carrying an unfinished placeholder can be published.",
    status: "In use across this site; the rules live in src/content/schema.ts.",
    tags: ["Zod", "TypeScript", "Content integrity"],
  },
];
