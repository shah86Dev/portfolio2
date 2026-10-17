import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { capabilityGroups, getProject } from "@/content";

export function Capabilities() {
  return (
    <Section
      id="capabilities"
      eyebrow="04 — Technical capabilities"
      title="What I have actually used."
      lead="Marked applied where it was used in a project documented on this site — the link goes to that project. Marked learning where it is not yet demonstrated here. No percentages, because nobody measured one."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {capabilityGroups.map((group, index) => (
          <Reveal key={group.id} delay={index * 0.04}>
            <div className="flex h-full flex-col rounded-lg border border-line bg-surface p-6">
              <h3 className="text-h4 text-ink">{group.title}</h3>
              <p className="mt-2 text-caption text-ink-faint">
                {group.description}
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                {group.items.map((item) => {
                  const evidence = item.evidenceSlug
                    ? getProject(item.evidenceSlug)
                    : undefined;

                  return (
                    <li
                      key={item.name}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <span className="text-caption text-ink-muted">
                        {evidence ? (
                          <Link
                            href={`/work/${evidence.slug}`}
                            className="underline decoration-line-strong underline-offset-4 transition-colors duration-[--dur-fast] hover:text-ink hover:decoration-signal"
                            title={`Used in ${evidence.title}`}
                          >
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )}
                      </span>
                      <span
                        className={[
                          "shrink-0 font-mono text-micro uppercase tracking-[0.14em]",
                          item.level === "applied"
                            ? "text-signal"
                            : "text-ink-faint",
                        ].join(" ")}
                      >
                        {item.level}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
