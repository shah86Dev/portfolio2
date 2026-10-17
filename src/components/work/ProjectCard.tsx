import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Project } from "@/content";

interface Props {
  project: Project;
  /** The leading card runs wider, so its screenshot gets a shallower crop. */
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: Props) {
  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface",
        "transition-colors duration-[--dur-base] hover:border-line-strong hover:bg-surface-raised",
      ].join(" ")}
    >
      {project.image ? (
        <div
          className={[
            "relative overflow-hidden border-b border-line bg-surface-sunken",
            featured ? "aspect-[21/9]" : "aspect-[16/10]",
          ].join(" ")}
        >
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(min-width: 768px) 60vw, 100vw"
            className="h-full w-full object-cover object-top opacity-85 transition-opacity duration-[--dur-base] group-hover:opacity-100"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusBadge status={project.status} />
          {project.period ? (
            <span className="font-mono text-micro text-ink-faint">
              {project.period}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-h3 text-ink">
          <Link
            href={`/work/${project.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-caption text-ink-muted">
          {project.summary}
        </p>

        <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-1.5">
          {project.stack.slice(0, 5).map((tech) => (
            <li
              key={tech}
              className="rounded-xs border border-line px-2 py-0.5 font-mono text-micro text-ink-faint"
            >
              {tech}
            </li>
          ))}
          {project.stack.length > 5 ? (
            <li className="px-1 py-0.5 font-mono text-micro text-ink-faint">
              +{project.stack.length - 5}
            </li>
          ) : null}
        </ul>

        <p className="mt-6 inline-flex items-center gap-1.5 text-caption text-signal">
          Read the case study
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-[--dur-fast] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </p>
      </div>
    </article>
  );
}
