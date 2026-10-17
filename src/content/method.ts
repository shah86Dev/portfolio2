import type { MethodStage } from "./schema";

/**
 * The engineering method.
 *
 * This single array drives BOTH the Engineering Universe (the six nodes marked
 * `inUniverse`) and the Engineering Method section (all eight stages). They
 * cannot drift apart, because there is only one source.
 */
export const methodStagesInput: MethodStage[] = [
  {
    id: "discover",
    label: "Discover",
    ordinal: "01",
    summary: "Find the real problem before writing anything.",
    description:
      "Most software fails because it solved a problem nobody had, or solved the wrong half of a real one. This stage is conversation, observation and writing down what is actually painful — in the user's words, not in technical ones. It ends when the problem can be stated in a sentence that the person with the problem would recognise.",
    deliverables: [
      "Problem statement in plain language",
      "Who is affected, and what they do today instead",
      "What is explicitly out of scope",
      "The one thing that must be true for this to be worth building",
    ],
    humanControl:
      "Judging whether the problem is worth solving at all. No agent decides this.",
    relatedProjectSlug: "aa-matt-whatsapp-agent",
    inUniverse: true,
  },
  {
    id: "specify",
    label: "Specify",
    ordinal: "02",
    summary: "Write the specification the code will be judged against.",
    description:
      "The specification is the artefact that matters most, because it is the thing an AI agent implements and the thing a human reviews against. It states behaviour, boundaries, failure modes and acceptance criteria. If the specification is ambiguous, the implementation will be confidently wrong — so ambiguity is resolved here, on paper, where it is cheap.",
    deliverables: [
      "Functional and non-functional requirements",
      "Acceptance criteria that can be checked, not debated",
      "Explicit non-goals",
      "Open questions resolved before implementation starts",
    ],
    humanControl:
      "Every acceptance criterion is written or approved by a person. This is the control surface for everything downstream.",
    relatedProjectSlug: "gen-z-kids",
    inUniverse: true,
  },
  {
    id: "architect",
    label: "Architect",
    ordinal: "03",
    summary: "Decide the shape of the system, and record why.",
    description:
      "Architecture is a set of decisions with consequences: what runs where, what the boundaries are, what gets to be stateful. Each significant decision is written down with its alternatives and its trade-off, so that six months later the reason is still available — and so an agent working in the codebase inherits the reasoning instead of guessing at it.",
    deliverables: [
      "Component and route structure",
      "Server / client boundaries and data flow",
      "Decision records with the alternatives considered",
      "Failure and fallback behaviour, designed rather than discovered",
    ],
    humanControl:
      "Choosing which trade-off to accept. An agent can list the options; the cost is a human call.",
    relatedProjectSlug: "aa-matt-whatsapp-agent",
    inUniverse: true,
  },
  {
    id: "plan",
    label: "Plan",
    ordinal: "04",
    summary: "Break it into tasks small enough to verify one at a time.",
    description:
      "A large task handed to an agent produces a large unverified diff. A small task with an acceptance check produces something you can actually accept or reject. Work is ordered by dependency, each task carries the check that proves it, and nothing is marked done on the strength of it looking plausible.",
    deliverables: [
      "Ordered task list with dependencies",
      "An acceptance check attached to every task",
      "Deliberate non-goals for this iteration",
    ],
    humanControl:
      "Sequencing and scope. Deciding what is not being built now is as important as deciding what is.",
    inUniverse: false,
  },
  {
    id: "implement",
    label: "Implement",
    ordinal: "05",
    summary: "AI agents write the code; the specification constrains it.",
    description:
      "This is where AI assistance earns its place: an agent working against a precise specification writes a great deal of correct code very quickly. The leverage comes from the preparation, not from the prompting. Review happens continuously and against the spec — not 'does this look fine' but 'does this satisfy the criterion we wrote'.",
    deliverables: [
      "Working code in small, reviewable increments",
      "Tests written alongside, not after",
      "Specification updated whenever reality forced a change",
    ],
    humanControl:
      "Review against written criteria, and the authority to reject. Code that no human understood is not finished code.",
    relatedProjectSlug: "teachers-day-greeting",
    inUniverse: true,
  },
  {
    id: "verify",
    label: "Verify",
    ordinal: "06",
    summary: "Prove it, including the ways it is supposed to fail.",
    description:
      "Verification covers the happy path, the edge cases and the refusals — what the system must decline to do. For an AI feature that means evaluation cases with expected behaviour, including adversarial ones. A number is only reported if a command produced it; 'should be fast' is not a measurement.",
    deliverables: [
      "Automated tests for behaviour and for plumbing",
      "Evaluation cases for AI behaviour, including refusals",
      "Accessibility and keyboard checks actually performed",
      "An honest record of what still fails",
    ],
    humanControl:
      "Defining what 'correct' means, and refusing to ship on a green tick that tested the wrong thing.",
    relatedProjectSlug: "aa-matt-whatsapp-agent",
    inUniverse: true,
  },
  {
    id: "deploy",
    label: "Deploy",
    ordinal: "07",
    summary: "Get it in front of real people, reversibly.",
    description:
      "Shipping is a step in the method, not an event at the end of it. That means a build that is reproducible, configuration kept out of the code, a known way back, and no claim of 'live' until a URL can actually be opened. A demo on a laptop behind a tunnel is a demo; it is described as one.",
    deliverables: [
      "Reproducible production build",
      "Environment configuration documented and secret-free",
      "A rollback path",
      "Honest status: prototype, implemented, or genuinely deployed",
    ],
    humanControl:
      "The decision to ship, and ownership of what happens next.",
    relatedProjectSlug: "digital-frontier-portfolio",
    inUniverse: true,
  },
  {
    id: "improve",
    label: "Improve",
    ordinal: "08",
    summary: "Feed what happened back into the specification.",
    description:
      "What real use reveals goes back into the spec, not just into the code — otherwise the next agent re-introduces the bug the last one fixed. The loop closes here: observation becomes a requirement, the requirement becomes a test, the test becomes a constraint on every future change.",
    deliverables: [
      "Observations from real use",
      "Specification amendments with the reason recorded",
      "Regression tests for anything that went wrong once",
    ],
    humanControl:
      "Deciding what the feedback means. Usage data describes behaviour; it does not decide priorities.",
    inUniverse: false,
  },
];
