import { expect, test, type ConsoleMessage } from "@playwright/test";

/**
 * The WebGL path, exercised for real.
 *
 * The rest of the suite proves the site works *without* WebGL. This proves
 * the 3D scene itself mounts, responds and unmounts cleanly — it exists
 * because a console `NotFoundError` from a DOM portal inside the canvas got
 * through a suite that only ever ran the 2D fallback.
 *
 * Skipped rather than failed where the runner has no GPU or software
 * rasteriser, since that is an environment fact, not a regression.
 */
test.describe("3D universe", () => {
  test.skip(
    ({ viewport }) => !viewport || viewport.width < 768,
    "the 3D scene is served only to wide, fine-pointer viewports",
  );

  test("mounts, responds and logs nothing", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message: ConsoleMessage) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");

    const hasWebGL = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    });
    test.skip(!hasWebGL, "no WebGL in this environment");

    // The stage reports the 3D path and a real canvas appears.
    await expect(page.getByText("Interactive · 3D")).toBeVisible();
    await expect(page.locator("#universe canvas")).toBeVisible({ timeout: 15_000 });

    const tabs = page
      .getByRole("tablist", { name: /stages of the engineering universe/i })
      .getByRole("tab");

    // Selecting a node updates the DOM caption drawn over the canvas.
    await tabs.nth(4).click();
    await expect(page.locator("#universe").getByText("Verify").first()).toBeVisible();

    await page.getByRole("button", { name: /reset view/i }).click();
    await expect(page.locator("#universe").getByText("Overview").first()).toBeVisible();

    // Navigating away unmounts the canvas; this is where the portal used to
    // throw.
    await page.getByRole("link", { name: /^All work$/i }).first().click().catch(async () => {
      await page.goto("/work");
    });
    await page.waitForLoadState("networkidle");

    expect(errors, `console errors: ${errors.join(" | ")}`).toEqual([]);
  });
});
