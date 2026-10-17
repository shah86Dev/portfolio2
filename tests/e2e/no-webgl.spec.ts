import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * The site with WebGL taken away (specification NFR-7, AC-2).
 *
 * Rather than relying on a Chromium launch flag, every WebGL context request
 * is refused in the page itself. That is deterministic, works in any browser
 * project, and reproduces exactly what the app's own probe sees on a machine
 * whose driver is blocklisted.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
        return null;
      }
      return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
});

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message: ConsoleMessage) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("the universe still works in full without WebGL", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await page.goto("/");

  const tabs = page
    .getByRole("tablist", { name: /stages of the engineering universe/i })
    .getByRole("tab");
  await expect(tabs).toHaveCount(6);

  // Every node is still reachable, and still reveals its content.
  for (let i = 0; i < 6; i += 1) {
    await tabs.nth(i).click();
    await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "true");
    const panel = page.locator("[role='tabpanel']").first();
    await expect(panel).toContainText(/What it produces/i);
    await expect(panel).toContainText(/Human control/i);
  }

  // The stage reports the diagram, not a broken canvas.
  await expect(page.getByText(/Interactive · diagram/i)).toBeVisible();

  // And the rest of the page is untouched.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#contact")).toBeAttached();

  expect(errors, `console errors: ${errors.join(" | ")}`).toEqual([]);
});

test("no placeholder content appears without WebGL either", async ({ page }) => {
  await page.goto("/");
  const text = await page.locator("body").innerText();
  expect(text).not.toContain("TODO:");
});
