import type { CapabilityGroup } from "./schema";

/**
 * Technical capabilities.
 *
 * `applied`  — used in a project documented on this site; `evidenceSlug`
 *              names that project.
 * `learning` — actively being learned, not yet demonstrated here.
 *
 * No percentages. No proficiency scores. A bar chart claiming "React 87%"
 * is a number nobody measured. (docs/constitution.md §2.1)
 */
export const capabilityGroupsInput: CapabilityGroup[] = [
  {
    id: "frontend",
    title: "Frontend & interactive UI",
    description:
      "Interfaces that stay fast and readable, and keep working when the decorative layer does not.",
    items: [
      { name: "React 19", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "Next.js App Router", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "TypeScript (strict)", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "Tailwind CSS", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "Motion for React", level: "applied", evidenceSlug: "teachers-day-greeting" },
      { name: "React Three Fiber / Three.js", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "WCAG 2.2 / keyboard-first UI", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "WebGL shaders", level: "learning" },
    ],
  },
  {
    id: "backend",
    title: "Backend & API development",
    description:
      "Services that are small, inspectable, and explicit about what they will not do.",
    items: [
      { name: "Python", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "FastAPI", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Webhook integration (Meta Cloud API)", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Webhook signature verification", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "REST API design", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Node.js / server runtimes", level: "learning" },
    ],
  },
  {
    id: "ai",
    title: "AI & agent workflows",
    description:
      "Getting useful behaviour out of models by constraining them, then proving the constraint holds.",
    items: [
      { name: "Google Gemini (text + audio)", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Grounded generation from a fact source", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Evaluation suites for AI behaviour", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Prompt-injection resistance testing", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Human-handoff design", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Speech-to-text and text-to-speech pipelines", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Claude Code / agentic development", level: "applied", evidenceSlug: "gen-z-kids" },
      { name: "Retrieval-augmented generation", level: "learning" },
    ],
  },
  {
    id: "data",
    title: "Databases & data",
    description: "Storing only what has to be stored, in a shape a human can read.",
    items: [
      { name: "SQLite", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "YAML-defined knowledge bases", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Zod schema validation", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "PostgreSQL", level: "learning" },
    ],
  },
  {
    id: "tooling",
    title: "Developer tooling",
    description: "The workflow that makes agent-written code safe to accept.",
    items: [
      { name: "Spec-driven development (Spec-Kit Plus)", level: "applied", evidenceSlug: "gen-z-kids" },
      { name: "Architecture decision records", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "Git", level: "applied", evidenceSlug: "teachers-day-greeting" },
      { name: "ESLint", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "FFmpeg", level: "applied", evidenceSlug: "gen-z-kids" },
      { name: "WSL2 / Linux tooling", level: "applied", evidenceSlug: "gen-z-kids" },
      { name: "uv (Python packaging)", level: "applied", evidenceSlug: "gen-z-kids" },
      { name: "CI pipelines", level: "learning" },
    ],
  },
  {
    id: "testing",
    title: "Testing & deployment",
    description:
      "Evidence that the thing works, and a reversible way to put it in front of people.",
    items: [
      { name: "pytest", level: "applied", evidenceSlug: "aa-matt-whatsapp-agent" },
      { name: "Vitest", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "Playwright", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "Testing Library", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "Vercel", level: "applied", evidenceSlug: "digital-frontier-portfolio" },
      { name: "Containerised deployment", level: "learning" },
    ],
  },
];
