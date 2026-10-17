import Link from "next/link";
import { ArrowUpRight, UserCheck } from "lucide-react";

import type { MethodStage } from "@/content";

interface Props {
  stage: MethodStage | null;
  /** id of the rail button that controls this panel, for aria-labelledby. */
  labelledBy: string | undefined;
  panelId: string;
  /**
   * slug → title for published projects, passed down from a Server
   * Component. See the note on `projectTitles` in src/content/index.ts.
   */
  projectTitles: Record<string, string>;
}

/**
 * The content revealed by selecting a node.
 *
 * This is real DOM, outside the canvas, and is the tabpanel of the node rail.
 * Nothing in the 3D scene is required to read it.
 */
export function UniverseDetailPanel({
  stage,
  labelledBy,
  panelId,
  projectTitles,
}: Props) {
  const slug = stage?.relatedProjectSlug;
  const projectTitle = slug ? projectTitles[slug] : undefined;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
      className="flex h-full min-h-[22rem] flex-col rounded-lg border border-line bg-surface/70 p-6 backdrop-blur-sm sm:p-8"
    >
      {stage === null ? (
        <div className="flex flex-1 flex-col justify-center">
          <p className="eyebrow">Overview</p>
          <p className="mt-3 text-lead text-ink-muted">
            Six stages turn an idea into a product that someone can actually
            use. Choose one to see what it produces — and what stays a human
            decision.
          </p>
          <p className="mt-6 text-caption text-ink-faint">
            Use the controls to the left, or the arrow keys once one is focused.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-micro tracking-[0.14em] text-signal">
              {stage.ordinal}
            </span>
            <h3 className="text-h3 text-ink">{stage.label}</h3>
          </div>

          <p className="mt-2 text-lead text-ink">{stage.summary}</p>

          <p className="mt-5 text-body text-ink-muted">{stage.description}</p>

          <div className="mt-7">
            <p className="eyebrow">What it produces</p>
            <ul className="mt-3 space-y-2">
              {stage.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-caption text-ink-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] h-px w-4 shrink-0 bg-signal-dim"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-md border border-signal-dim/50 bg-signal-wash/50 p-4">
            <p className="flex items-center gap-2 eyebrow text-signal">
              <UserCheck aria-hidden="true" className="h-3.5 w-3.5" />
              Human control
            </p>
            <p className="mt-2 text-caption text-ink-muted">
              {stage.humanControl}
            </p>
          </div>

          {slug && projectTitle ? (
            <Link
              href={`/work/${slug}`}
              className="group mt-6 inline-flex items-center gap-2 self-start text-caption text-signal transition-colors duration-[--dur-fast] hover:text-signal-strong"
            >
              <span>
                See this stage in{" "}
                <span className="underline underline-offset-4">
                  {projectTitle}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-[--dur-fast] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          ) : null}
        </>
      )}
    </div>
  );
}
