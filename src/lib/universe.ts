import type { MethodStage } from "@/content";

/**
 * Pure geometry and selection logic for the Engineering Universe.
 *
 * Kept free of React and of three.js so that both the 3D scene and the SVG
 * fallback can share it — and so it can be unit-tested without a browser.
 */

export interface NodePlacement {
  /** Index in the stage array. */
  index: number;
  /** Angle in radians, measured from straight up, going clockwise. */
  angle: number;
  /** Unit-circle position scaled by `radius`. */
  x: number;
  y: number;
}

/**
 * Places `count` nodes evenly on a circle, starting at the top.
 *
 * `y` grows downward, matching SVG coordinates. The 3D scene negates it.
 */
export function placeNodes(count: number, radius: number): NodePlacement[] {
  if (count <= 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    return {
      index,
      angle,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });
}

/** Moves a selection index by `delta`, wrapping at both ends. */
export function cycleIndex(current: number, delta: number, length: number): number {
  if (length <= 0) return 0;
  return (((current + delta) % length) + length) % length;
}

/**
 * Maps a keyboard event key to the next selection index.
 * Returns `null` when the key is not a navigation key, so the caller knows
 * not to call `preventDefault`.
 */
export function nextIndexForKey(
  key: string,
  current: number,
  length: number,
): number | null {
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return cycleIndex(current, 1, length);
    case "ArrowLeft":
    case "ArrowUp":
      return cycleIndex(current, -1, length);
    case "Home":
      return 0;
    case "End":
      return Math.max(0, length - 1);
    default:
      return null;
  }
}

/** Index of a stage by id, or -1. */
export function stageIndex(stages: MethodStage[], id: string | null): number {
  if (id === null) return -1;
  return stages.findIndex((stage) => stage.id === id);
}
