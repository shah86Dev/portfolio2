"use client";

import dynamic from "next/dynamic";
import { useCallback, useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

import type { MethodStage } from "@/content";
import {
  useCompactExperience,
  useHasBeenVisible,
  useIsOnScreen,
  usePrefersReducedMotion,
  useWebGLSupport,
} from "@/lib/hooks";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { UniverseDetailPanel } from "./UniverseDetailPanel";
import { UniverseDiagram } from "./UniverseDiagram";
import { UniverseRail } from "./UniverseRail";

/**
 * The 3D bundle lives behind this boundary and nowhere else. `ssr: false`
 * keeps `three` out of the server render; the dynamic import keeps it out of
 * the initial JavaScript payload of every route.
 */
const UniverseScene = dynamic(() => import("./UniverseScene"), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

interface Props {
  stages: MethodStage[];
  /** slug → title, passed in so this island never imports the content graph. */
  projectTitles: Record<string, string>;
}

export function EngineeringUniverse({ stages, projectTitles }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [resetToken, setResetToken] = useState(0);
  const [sceneFailed, setSceneFailed] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const idBase = useId();
  const panelId = `${idBase}-panel`;
  const tabId = useCallback((index: number) => `${idBase}-tab-${index}`, [idBase]);

  const webgl = useWebGLSupport();
  const compact = useCompactExperience();
  const reducedMotion = usePrefersReducedMotion();
  const nearViewport = useHasBeenVisible(stageRef);
  const onScreen = useIsOnScreen(stageRef);

  // Phones get the 2D universe on purpose: it is lighter, sharper and easier
  // to tap than a scene a mid-range phone would render badly.
  const use3D = webgl === "ok" && !compact && !sceneFailed;

  // Animate only when motion is welcome AND the scene is actually in view.
  // Off-screen, the frameloop drops to `demand` and the canvas stops
  // rendering entirely.
  const animate = !reducedMotion && onScreen;

  const activeStage = activeIndex >= 0 ? (stages[activeIndex] ?? null) : null;

  const diagram = (
    <UniverseDiagram
      stages={stages}
      activeIndex={activeIndex}
      onSelect={setActiveIndex}
      animate={animate}
    />
  );

  const handleReset = () => {
    setActiveIndex(-1);
    setResetToken((token) => token + 1);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
      {/* ---- Visual stage + rail ---------------------------------------- */}
      <div className="lg:col-span-7 xl:col-span-8">
        <div
          ref={stageRef}
          className="relative overflow-hidden rounded-lg border border-line bg-surface-sunken"
          // Reserving the box before anything mounts avoids layout shift.
          // The square aspect keeps the ring circular; the cap stops it
          // swallowing a phone screen while still leaving the diagram large
          // enough to read.
          style={{ aspectRatio: "1 / 1", maxHeight: "min(82vw, 34rem)" }}
        >
          <div aria-hidden="true" className="absolute inset-0 grid-field opacity-40" />

          <div className="absolute inset-0 mask-fade-edges">
            {use3D ? (
              nearViewport ? (
                <SceneErrorBoundary
                  fallback={diagram}
                  onError={() => setSceneFailed(true)}
                >
                  <UniverseScene
                    stages={stages}
                    activeIndex={activeIndex}
                    onSelect={setActiveIndex}
                    animate={animate}
                    resetToken={resetToken}
                  />
                </SceneErrorBoundary>
              ) : (
                <StageSkeleton />
              )
            ) : (
              diagram
            )}
          </div>

          {/* Caption over the canvas. Ordinary DOM, deliberately: nothing
              readable is rendered inside the WebGL context. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 p-3">
            <p className="inline-flex items-baseline gap-2 bg-void/60 px-2 py-1 backdrop-blur-sm">
              <span className="font-mono text-micro tracking-[0.14em] text-signal">
                {activeStage ? activeStage.ordinal : "—"}
              </span>
              <span className="font-display text-caption text-ink">
                {activeStage ? activeStage.label : "Overview"}
              </span>
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
            <p className="eyebrow whitespace-nowrap bg-void/70 px-2 py-1 backdrop-blur-sm">
              {webgl === "checking"
                ? "Preparing"
                : use3D
                  ? "Interactive · 3D"
                  : "Interactive · diagram"}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-sm border border-line bg-void/80 px-2.5 py-1.5 font-mono text-micro uppercase tracking-[0.14em] text-ink-muted backdrop-blur-sm transition-colors duration-[--dur-fast] hover:border-signal-dim hover:text-ink"
            >
              <RotateCcw aria-hidden="true" className="h-3 w-3" />
              Reset view
            </button>
          </div>
        </div>

        <div className="mt-4">
          <UniverseRail
            stages={stages}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            panelId={panelId}
            tabId={tabId}
          />
        </div>
      </div>

      {/* ---- Detail panel ------------------------------------------------ */}
      <div className="lg:col-span-5 xl:col-span-4">
        <UniverseDetailPanel
          stage={activeStage}
          labelledBy={activeIndex >= 0 ? tabId(activeIndex) : undefined}
          panelId={panelId}
          projectTitles={projectTitles}
        />
      </div>
    </div>
  );
}

function StageSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        aria-hidden="true"
        className="h-28 w-28 rotate-45 border border-line-strong"
      />
      <span className="sr-only">Loading the interactive universe…</span>
    </div>
  );
}
