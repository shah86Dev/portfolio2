import { describe, expect, it } from "vitest";

import { universeStages } from "@/content";
import { cycleIndex, nextIndexForKey, placeNodes, stageIndex } from "@/lib/universe";

describe("placeNodes", () => {
  it("returns nothing for a non-positive count", () => {
    expect(placeNodes(0, 10)).toEqual([]);
    expect(placeNodes(-3, 10)).toEqual([]);
  });

  it("places the first node straight up", () => {
    const [first] = placeNodes(6, 100);
    expect(first).toBeDefined();
    expect(first?.x).toBeCloseTo(0, 6);
    expect(first?.y).toBeCloseTo(-100, 6);
  });

  it("spaces nodes evenly around the circle", () => {
    const nodes = placeNodes(6, 100);
    expect(nodes).toHaveLength(6);
    for (const node of nodes) {
      expect(Math.hypot(node.x, node.y)).toBeCloseTo(100, 6);
    }
    const first = nodes[0];
    const second = nodes[1];
    expect(second!.angle - first!.angle).toBeCloseTo((Math.PI * 2) / 6, 6);
  });
});

describe("cycleIndex", () => {
  it("wraps forward past the end", () => {
    expect(cycleIndex(5, 1, 6)).toBe(0);
  });

  it("wraps backward past the start", () => {
    expect(cycleIndex(0, -1, 6)).toBe(5);
  });

  it("handles a negative starting index, as used for 'nothing selected'", () => {
    expect(cycleIndex(-1, 1, 6)).toBe(0);
  });

  it("is safe on an empty list", () => {
    expect(cycleIndex(0, 1, 0)).toBe(0);
  });
});

describe("nextIndexForKey", () => {
  it("moves forward on ArrowRight and ArrowDown", () => {
    expect(nextIndexForKey("ArrowRight", 0, 6)).toBe(1);
    expect(nextIndexForKey("ArrowDown", 0, 6)).toBe(1);
  });

  it("moves backward on ArrowLeft and ArrowUp", () => {
    expect(nextIndexForKey("ArrowLeft", 0, 6)).toBe(5);
    expect(nextIndexForKey("ArrowUp", 3, 6)).toBe(2);
  });

  it("jumps to the ends on Home and End", () => {
    expect(nextIndexForKey("Home", 4, 6)).toBe(0);
    expect(nextIndexForKey("End", 1, 6)).toBe(5);
  });

  it("returns null for keys it does not own, so they are not swallowed", () => {
    expect(nextIndexForKey("Tab", 0, 6)).toBeNull();
    expect(nextIndexForKey("Enter", 0, 6)).toBeNull();
    expect(nextIndexForKey("a", 0, 6)).toBeNull();
  });
});

describe("stageIndex", () => {
  it("finds a real stage", () => {
    const target = universeStages[2];
    expect(target).toBeDefined();
    expect(stageIndex(universeStages, target!.id)).toBe(2);
  });

  it("returns -1 for null or unknown ids", () => {
    expect(stageIndex(universeStages, null)).toBe(-1);
    expect(stageIndex(universeStages, "not-a-stage")).toBe(-1);
  });
});
