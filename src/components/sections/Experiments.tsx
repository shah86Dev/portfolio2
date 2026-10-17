import { FlaskConical } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { experiments } from "@/content";

export function Experiments() {
  return (
    <Section
      id="experiments"
      eyebrow="05 — Current experiments"
      title="Open questions I am working on."
      lead="Unfinished on purpose. Each of these has a status line that says where it actually is, including the ones where the honest answer is that nothing has been measured yet."
    >
      <ul className="space-y-px overflow-hidden rounded-lg border border-line bg-line">
        {experiments.map((experiment, index) => (
          <li key={experiment.id} className="bg-surface p-6 sm:p-7">
            <Reveal delay={index * 0.04}>
              <div className="grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h3 className="flex items-start gap-2.5 text-h4 text-ink">
                    <FlaskConical
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-signal"
                    />
                    {experiment.title}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5 pl-6.5">
                    {experiment.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-xs border border-line px-2 py-0.5 font-mono text-micro text-ink-faint"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-8">
                  <p className="text-caption text-ink-muted">
                    {experiment.description}
                  </p>
                  <p className="mt-3 border-l border-signal-dim pl-3 font-mono text-micro text-ink-faint">
                    Status: {experiment.status}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
