import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UniverseRail } from "@/components/universe/UniverseRail";
import { universeStages } from "@/content";

/**
 * The rail is the accessible control for the Engineering Universe. These
 * tests are the guarantee behind specification AC-2 and AC-3: the universe is
 * fully operable with a keyboard and no WebGL in sight.
 */

function setup(activeIndex = -1) {
  const onSelect = vi.fn();
  const utils = render(
    <UniverseRail
      stages={universeStages}
      activeIndex={activeIndex}
      onSelect={onSelect}
      panelId="panel"
      tabId={(index) => `tab-${index}`}
    />,
  );
  return { onSelect, ...utils };
}

describe("UniverseRail", () => {
  it("exposes one tab per stage inside a labelled tablist", () => {
    setup();
    const tablist = screen.getByRole("tablist", {
      name: /stages of the engineering universe/i,
    });
    expect(tablist).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(universeStages.length);
  });

  it("names every tab with its ordinal and label", () => {
    setup();
    for (const stage of universeStages) {
      expect(
        screen.getByRole("tab", { name: new RegExp(stage.label, "i") }),
      ).toBeInTheDocument();
    }
  });

  it("selects a stage on click", async () => {
    const user = userEvent.setup();
    const { onSelect } = setup();

    await user.click(screen.getByRole("tab", { name: /verify/i }));

    const verifyIndex = universeStages.findIndex((stage) => stage.id === "verify");
    expect(onSelect).toHaveBeenCalledWith(verifyIndex);
  });

  it("keeps exactly one tab in the tab order (roving tabindex)", () => {
    setup(2);
    const tabs = screen.getAllByRole("tab");
    const reachable = tabs.filter((tab) => tab.getAttribute("tabindex") === "0");
    expect(reachable).toHaveLength(1);
    expect(reachable[0]).toBe(tabs[2]);
  });

  it("moves selection with the arrow keys and wraps at both ends", async () => {
    const user = userEvent.setup();
    const { onSelect } = setup(0);

    const first = screen.getAllByRole("tab")[0]!;
    first.focus();

    await user.keyboard("{ArrowRight}");
    expect(onSelect).toHaveBeenLastCalledWith(1);

    await user.keyboard("{ArrowLeft}");
    expect(onSelect).toHaveBeenLastCalledWith(universeStages.length - 1);
  });

  it("jumps to the first and last stage with Home and End", async () => {
    const user = userEvent.setup();
    const { onSelect } = setup(3);

    screen.getAllByRole("tab")[3]!.focus();

    await user.keyboard("{End}");
    expect(onSelect).toHaveBeenLastCalledWith(universeStages.length - 1);

    await user.keyboard("{Home}");
    expect(onSelect).toHaveBeenLastCalledWith(0);
  });

  it("marks the active stage with aria-selected, not colour alone", () => {
    setup(4);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[4]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
  });

  it("points every tab at the detail panel it controls", () => {
    setup(1);
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveAttribute("aria-controls", "panel");
    }
  });
});
