"use client";

import { useRef } from "react";

import type { MethodStage } from "@/content";
import { nextIndexForKey } from "@/lib/universe";

interface Props {
  stages: MethodStage[];
  activeIndex: number;
  onSelect: (index: number) => void;
  panelId: string;
  tabId: (index: number) => string;
}

/**
 * The accessible control for the Engineering Universe.
 *
 * This rail — not the canvas — is what a keyboard or screen-reader user
 * operates. It implements the tabs pattern: a roving tabindex, arrow-key
 * traversal, Home/End, and `aria-selected` on the active node. The 3D scene
 * and the SVG diagram are both visual mirrors of this state.
 */
export function UniverseRail({
  stages,
  activeIndex,
  onSelect,
  panelId,
  tabId,
}: Props) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusIndex = (index: number) => {
    onSelect(index);
    refs.current[index]?.focus();
  };

  // Which button is reachable with Tab. With nothing selected it is the first.
  const rovingIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div
      role="tablist"
      aria-label="Stages of the Engineering Universe"
      aria-orientation="horizontal"
      className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3 lg:grid-cols-6"
      onKeyDown={(event) => {
        const next = nextIndexForKey(event.key, rovingIndex, stages.length);
        if (next === null) return;
        event.preventDefault();
        focusIndex(next);
      }}
    >
      {stages.map((stage, index) => {
        const selected = index === activeIndex;
        return (
          <button
            key={stage.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={tabId(index)}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={index === rovingIndex ? 0 : -1}
            onClick={() => onSelect(index)}
            className={[
              "group relative flex flex-col items-start gap-1 px-3 py-3.5 text-left",
              "transition-colors duration-[--dur-fast] outline-offset-[-2px]",
              selected
                ? "bg-signal-wash text-ink"
                : "bg-surface text-ink-muted hover:bg-surface-raised hover:text-ink",
            ].join(" ")}
          >
            {/* State is signalled by a bar and by aria-selected, never by
                colour alone. */}
            <span
              aria-hidden="true"
              className={[
                "absolute inset-x-0 top-0 h-px transition-colors duration-[--dur-fast]",
                selected ? "bg-signal" : "bg-transparent",
              ].join(" ")}
            />
            <span className="font-mono text-micro tracking-[0.14em] text-ink-faint group-aria-selected:text-signal">
              {stage.ordinal}
            </span>
            <span className="font-display text-caption leading-tight">
              {stage.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
