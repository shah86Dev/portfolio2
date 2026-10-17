import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/content";

const principles = [
  {
    title: "The specification is the product brief",
    body: "Before anything is built, the behaviour, the boundaries and the acceptance criteria are written down. An agent implements against that; a human reviews against that.",
  },
  {
    title: "AI writes the code, the spec constrains it",
    body: "The leverage is in the preparation, not the prompting. A precise specification turns a fast typist into a fast engineer; a vague one just produces wrong code quickly.",
  },
  {
    title: "Verification is part of the build, not after it",
    body: "Tests, evaluation cases and refusal cases are written alongside the feature. A number is only reported when a command produced it.",
  },
  {
    title: "It has to work on an ordinary device",
    body: "Keyboard-only, motion disabled, WebGL unavailable, mid-range phone. A product that needs a good laptop to work is a demo.",
  },
] as const;

export function About() {
  return (
    <Section
      id="about"
      eyebrow="01 — How I think"
      title="Structure first, then speed."
      lead="I build software with AI coding agents doing most of the typing. That only works when the thinking in front of them is sharp — so the specification, not the code, is the artefact I spend the most care on."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          {siteConfig.bio.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 32)} delay={index * 0.04}>
              <p className="text-body text-ink-muted">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <ul className="space-y-px overflow-hidden rounded-md border border-line bg-line">
          {principles.map((principle, index) => (
            <li key={principle.title} className="bg-surface p-5 sm:p-6">
              <Reveal delay={index * 0.04}>
                <h3 className="flex items-baseline gap-3 text-h4 text-ink">
                  <span className="font-mono text-micro tracking-[0.14em] text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {principle.title}
                </h3>
                <p className="mt-2 pl-8 text-caption text-ink-muted">
                  {principle.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
