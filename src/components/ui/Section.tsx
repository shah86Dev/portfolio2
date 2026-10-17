import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  /** Small mono label above the heading, e.g. "02 — How I think". */
  eyebrow: string;
  title: string;
  /** Optional standfirst beneath the heading. */
  lead?: string;
  children: ReactNode;
  /** Removes the top divider where two sections should read as one block. */
  seamless?: boolean;
}

/**
 * The editorial frame every section shares: a hairline rule, a mono eyebrow,
 * a display heading, an optional standfirst, then content.
 *
 * Keeping this in one place is what makes the page feel like one document
 * rather than a stack of components.
 */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  seamless = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={seamless ? "py-20 md:py-28" : "border-t border-line py-20 md:py-28"}
    >
      <div className="frame">
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={`${id}-heading`} className="mt-3 text-h2 text-ink">
              {title}
            </h2>
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            {lead ? (
              <p className="measure text-lead text-ink-muted">{lead}</p>
            ) : null}
            <div className={lead ? "mt-10" : undefined}>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
