import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { publishedProjects } from "@/content";

export function Work() {
  return (
    <Section
      id="work"
      eyebrow="02 — Selected work"
      title="Evidence, not claims."
      lead="Each case study was written from the project itself — its source, its tests, its README — and says plainly what is built, what is not, and what has never been measured."
    >
      {/* items-start: a card without a screenshot should end where its
          content ends, rather than being stretched to match a taller
          neighbour and leaving a void. */}
      <div className="grid items-start gap-5 md:grid-cols-2">
        {publishedProjects.map((project, index) => (
          <Reveal
            key={project.slug}
            delay={index * 0.05}
            className={index === 0 ? "md:col-span-2" : undefined}
          >
            <ProjectCard project={project} featured={index === 0} />
          </Reveal>
        ))}
      </div>

      <p className="mt-8">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-caption text-signal transition-colors duration-[--dur-fast] hover:text-signal-strong"
        >
          See all {publishedProjects.length} projects with their evidence
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-[--dur-fast] group-hover:translate-x-0.5"
          />
        </Link>
      </p>
    </Section>
  );
}
