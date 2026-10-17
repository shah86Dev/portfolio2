import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  /** Set for links leaving the site; adds rel and a new tab. */
  external?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 font-display text-caption transition-colors duration-[--dur-fast]";

const variants = {
  primary:
    "bg-signal text-void hover:bg-signal-strong font-medium",
  ghost:
    "border border-line-strong text-ink hover:border-signal-dim hover:bg-surface",
} as const;

/** The site's one call-to-action control. Renders a real link, always. */
export function Cta({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
