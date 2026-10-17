import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { getProject, publishedProjects, type Project } from "@/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/work/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { caseStudy } = project;
  const hasOutcomes = caseStudy.outcomes.length > 0;

  return (
    <article className="frame py-12 md:py-20">
      <Link
        href="/work"
        className="inline-flex items-center gap-2 text-caption text-ink-muted transition-colors duration-[--dur-fast] hover:text-signal"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        All work
      </Link>

      {/* ---- Header ------------------------------------------------------ */}
      <header className="mt-8 border-b border-line pb-10">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <StatusBadge status={project.status} withMeaning />
          {project.period ? (
            <span className="font-mono text-micro text-ink-faint">
              {project.period}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 text-h1 text-ink">{project.title}</h1>
        <p className="measure mt-5 text-lead text-ink-muted">{project.summary}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="eyebrow">Technologies used</p>
            <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-xs border border-line px-2 py-0.5 font-mono text-micro text-ink-faint"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {project.liveUrl || project.repoUrl ? (
            <div className="md:col-span-4">
              <p className="eyebrow">Links</p>
              <ul className="mt-3 space-y-2">
                {project.liveUrl ? (
                  <li>
                    <ExternalRef href={project.liveUrl} label="Open the live site" />
                  </li>
                ) : null}
                {project.repoUrl ? (
                  <li>
                    <ExternalRef href={project.repoUrl} label="Source repository" />
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      </header>

      {project.image ? (
        <figure className="mt-10 overflow-hidden rounded-lg border border-line bg-surface-sunken">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(min-width: 1024px) 80vw, 100vw"
            priority
            className="h-auto w-full"
          />
          <figcaption className="border-t border-line px-5 py-3 text-micro text-ink-faint">
            {project.image.alt}
          </figcaption>
        </figure>
      ) : null}

      {/* ---- Evidence ---------------------------------------------------- */}
      <section
        aria-labelledby="evidence-heading"
        className="mt-14 rounded-lg border border-signal-dim/40 bg-signal-wash/30 p-6 sm:p-8"
      >
        <h2 id="evidence-heading" className="text-h4 text-ink">
          What this page is based on
        </h2>
        <p className="mt-2 text-caption text-ink-faint">
          Everything below was written after reading these. Nothing here is
          estimated or recalled.
        </p>
        <dl className="mt-5 space-y-4">
          {project.evidence.map((item) => (
            <div key={item.label}>
              <dt className="font-mono text-micro uppercase tracking-[0.14em] text-signal">
                {item.label}
              </dt>
              <dd className="mt-1 text-caption text-ink-muted">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---- The case study ---------------------------------------------- */}
      <div className="mt-14 space-y-14">
        <Prose heading="Problem and context" id="problem">
          {caseStudy.problem}
        </Prose>

        <Prose heading="Intended users" id="users">
          {caseStudy.users}
        </Prose>

        <Prose heading="The solution" id="solution">
          {caseStudy.solution}
        </Prose>

        <Prose heading="My contribution" id="contribution">
          {caseStudy.contribution}
        </Prose>

        <Listing
          heading="Architecture and technical decisions"
          id="architecture"
          items={caseStudy.architecture}
        />

        <Listing
          heading="Testing and verification"
          id="verification"
          items={caseStudy.verification}
        />

        {hasOutcomes ? (
          <Listing
            heading="Demonstrated outcomes"
            id="outcomes"
            items={caseStudy.outcomes}
          />
        ) : (
          <Listing
            heading="Objectives"
            id="outcomes"
            items={caseStudy.objectives}
            note="No outcomes are listed because none have been measured. These are what the project set out to do."
          />
        )}

        <Listing
          heading="Outstanding work and limitations"
          id="limitations"
          items={caseStudy.limitations}
        />
      </div>

      <Neighbours current={project} />
    </article>
  );
}

/* ------------------------------------------------------------------------ */

function Prose({
  heading,
  id,
  children,
}: {
  heading: string;
  id: string;
  children: string;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="grid gap-x-10 gap-y-4 md:grid-cols-12">
      <h2
        id={`${id}-heading`}
        className="text-h4 text-ink md:col-span-4 lg:col-span-3"
      >
        {heading}
      </h2>
      <p className="measure text-body text-ink-muted md:col-span-8 lg:col-span-9">
        {children}
      </p>
    </section>
  );
}

function Listing({
  heading,
  id,
  items,
  note,
}: {
  heading: string;
  id: string;
  items: string[];
  note?: string;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="grid gap-x-10 gap-y-4 md:grid-cols-12">
      <h2
        id={`${id}-heading`}
        className="text-h4 text-ink md:col-span-4 lg:col-span-3"
      >
        {heading}
      </h2>
      <div className="md:col-span-8 lg:col-span-9">
        {note ? (
          <p className="measure mb-4 border-l border-signal-dim pl-3 text-caption text-ink-faint">
            {note}
          </p>
        ) : null}
        <ul className="measure space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-body text-ink-muted">
              <span
                aria-hidden="true"
                className="mt-[0.7em] h-px w-4 shrink-0 bg-signal-dim"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ExternalRef({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 text-caption text-signal transition-colors duration-[--dur-fast] hover:text-signal-strong"
    >
      {label}
      <ArrowUpRight
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-[--dur-fast] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

function Neighbours({ current }: { current: Project }) {
  const others = publishedProjects.filter((p) => p.slug !== current.slug);
  if (others.length === 0) return null;

  return (
    <nav
      aria-label="Other projects"
      className="mt-20 border-t border-line pt-10"
    >
      <p className="eyebrow">Other projects</p>
      <ul className="mt-5 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {others.map((project) => (
          <li key={project.slug} className="bg-surface">
            <Link
              href={`/work/${project.slug}`}
              className="block h-full p-5 transition-colors duration-[--dur-fast] hover:bg-surface-raised"
            >
              <StatusBadge status={project.status} />
              <span className="mt-2 block font-display text-h4 text-ink">
                {project.title}
              </span>
              <span className="mt-1.5 block text-caption text-ink-faint">
                {project.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
