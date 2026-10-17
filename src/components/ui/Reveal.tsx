"use client";

import { useRef, type ReactNode } from "react";

import { useHasBeenVisible } from "@/lib/hooks";

interface Props {
  children: ReactNode;
  /** Stagger in seconds. Keep small — this must never delay reading. */
  delay?: number;
  className?: string;
}

/**
 * A short entrance for content as it comes into view.
 *
 * An IntersectionObserver sets `data-shown`; the CSS transition on `.reveal`
 * in globals.css does the rest. No animation library for one effect.
 *
 * Reduced motion and the no-JavaScript case are handled in CSS rather than
 * here, which is what makes this safe:
 *
 *  - `@media (prefers-reduced-motion: reduce)` forces `.reveal` to
 *    `opacity: 1`, so a visitor who wants no motion sees content immediately
 *    whatever this component does.
 *  - the `<noscript>` rule in the root layout does the same when no
 *    JavaScript runs.
 *
 * An earlier version branched on the reduced-motion hook and returned a div
 * *without* the ref. Because the hook's server snapshot is `true`, the first
 * client render took that branch, the observer effect ran against a null ref,
 * and it never re-ran once the snapshot flipped — leaving every revealed
 * block on the page stranded at `opacity: 0`. The element and its ref are now
 * unconditional, and the preference is handled only in CSS.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useHasBeenVisible(ref, "-80px");

  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      data-shown={shown ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
