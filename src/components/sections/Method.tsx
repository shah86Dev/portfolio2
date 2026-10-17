"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, UserCheck } from "lucide-react";

import type { MethodStage } from "@/content";
import { nextIndexForKey } from "@/lib/universe";

interface Props {
  stages: MethodStage[];
  /** slug → title, passed in so this island never imports the content graph. */
  projectTitles: Record<string, string>;
}

/**
 * The Engineering Method.
 *
 * Reads the same `method.ts` as the Engineering Universe, so the eight stages
 * here and the six nodes up in the hero can never drift apart. The first
 * stage is selected by default — unlike the universe, there is no useful
 * "overview" state for a linear process.
 */
export function Method({ stages, projectTitles }: Props) {
  const [active, setActive] = useState(0);
  const idBase = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = `${idBase}-panel`;
  const tabId = (index: number) => `${idBase}-tab-${index}`;

  const stage = stages[active];
  const slug = stage?.relatedProjectSlug;
  const projectTitle = slug ? projectTitles[slug] : undefined;

  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="border-t border-line py-20 md:py-28"
    >
      <div className="frame">
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <p className="eyebrow">03 — Engineering method</p>
            <h2 id="method-heading" className="mt-3 text-h2 text-ink">
              From idea to production.
            </h2>
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <p className="measure text-lead text-ink-muted">
              Eight stages. AI agents do most of the implementation; the
              specification, the review, the tests and the acceptance criteria
              are what keep that useful instead of merely fast.
            </p>
          </div>
        </div>

        <div className="mt-12">
          {/* Stage selector — a horizontal process rail that wraps on narrow
              screens rather than scrolling out of reach. */}
          <div
            role="tablist"
            aria-label="Stages of the engineering method"
            className="flex flex-wrap gap-px overflow-hidden rounded-md border border-line bg-line"
            onKeyDown={(event) => {
              const next = nextIndexForKey(event.key, active, stages.length);
              if (next === null) return;
              event.preventDefault();
              setActive(next);
              refs.current[next]?.focus();
            }}
          >
            {stages.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    refs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(index)}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  className={[
                    "relative min-w-[7.5rem] flex-1 px-3 py-4 text-left transition-colors duration-[--dur-fast] outline-offset-[-2px]",
                    selected
                      ? "bg-signal-wash text-ink"
                      : "bg-surface text-ink-muted hover:bg-surface-raised hover:text-ink",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-x-0 top-0 h-px",
                      selected ? "bg-signal" : "bg-transparent",
                    ].join(" ")}
                  />
                  {/* On the signal-washed selected tab, ink-faint falls to
                      4.22:1 — under the 4.5:1 floor. The signal colour reads
                      at 9.0:1 there and matches the rail in the hero. */}
                  <span
                    className={[
                      "block font-mono text-micro tracking-[0.14em]",
                      selected ? "text-signal" : "text-ink-faint",
                    ].join(" ")}
                  >
                    {item.ordinal}
                  </span>
                  <span className="mt-1 block font-display text-caption">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {stage ? (
            <div
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId(active)}
              tabIndex={0}
              className="mt-5 grid gap-8 rounded-lg border border-line bg-surface p-6 sm:p-8 lg:grid-cols-12"
            >
              <div className="lg:col-span-7">
                <h3 className="text-h3 text-ink">{stage.summary}</h3>
                <p className="mt-4 text-body text-ink-muted">
                  {stage.description}
                </p>

                <div className="mt-6 rounded-md border border-signal-dim/50 bg-signal-wash/50 p-4">
                  <p className="flex items-center gap-2 eyebrow text-signal">
                    <UserCheck aria-hidden="true" className="h-3.5 w-3.5" />
                    What a human stays responsible for
                  </p>
                  <p className="mt-2 text-caption text-ink-muted">
                    {stage.humanControl}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <p className="eyebrow">What this stage produces</p>
                <ul className="mt-3 space-y-2.5">
                  {stage.deliverables.map((item) => (
                    <li key={item} className="flex gap-3 text-caption text-ink-muted">
                      <span
                        aria-hidden="true"
                        className="mt-[0.55em] h-px w-4 shrink-0 bg-signal-dim"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {slug && projectTitle ? (
                  <Link
                    href={`/work/${slug}`}
                    className="group mt-6 inline-flex items-center gap-2 text-caption text-signal transition-colors duration-[--dur-fast] hover:text-signal-strong"
                  >
                    <span className="underline underline-offset-4">
                      {projectTitle}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-[--dur-fast] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
