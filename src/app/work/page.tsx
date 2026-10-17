import type { Metadata } from "next";

import { ProjectCard } from "@/components/work/ProjectCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { projectStatuses, publishedProjects, statusMeanings } from "@/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Every project with its evidence: what was built, what status it is actually at, and what has not been measured.",
  alternates: { canonical: "/work" },
};

export default function WorkIndexPage() {
  const used = projectStatuses.filter((status) =>
    publishedProjects.some((project) => project.status === status),
  );

  return (
    <div className="frame py-16 md:py-24">
      <p className="eyebrow">Selected work</p>
      <h1 className="mt-3 text-h1 text-ink">Projects, with their evidence.</h1>
      <p className="measure mt-6 text-lead text-ink-muted">
        Each case study was written from the project itself. Where an outcome
        has not been measured, the page says so and describes the objective
        instead.
      </p>

      {/* The status vocabulary, stated once, so the badges below mean
          something specific rather than something flattering. */}
      <dl className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {used.map((status) => (
          <div key={status} className="bg-surface p-4">
            <dt>
              <StatusBadge status={status} />
            </dt>
            <dd className="mt-1.5 text-micro text-ink-faint">
              {statusMeanings[status]}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid items-start gap-5 md:grid-cols-2">
        {publishedProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
