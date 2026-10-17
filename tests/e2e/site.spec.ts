import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * End-to-end checks for the acceptance criteria in docs/specification.md §6.
 */

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message: ConsoleMessage) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test.describe("home route", () => {
  test("renders the hero and reaches the contact section (AC-1)", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /explore projects/i })).toBeVisible();
    await expect(page.locator("#contact")).toBeAttached();

    expect(errors, `console errors: ${errors.join(" | ")}`).toEqual([]);
  });

  test("has exactly one h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("the skip link is the first thing a keyboard reaches (AC-3)", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /skip to main content/i })).toBeFocused();
  });
});

test.describe("engineering universe", () => {
  test("every node can be selected with the keyboard (AC-2, AC-3)", async ({ page }) => {
    await page.goto("/");

    const tablist = page.getByRole("tablist", {
      name: /stages of the engineering universe/i,
    });
    await expect(tablist).toBeVisible();

    const tabs = tablist.getByRole("tab");
    await expect(tabs).toHaveCount(6);

    // Activate the first node, then walk the whole ring with the arrow keys.
    await tabs.first().click();
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

    for (let i = 1; i < 6; i += 1) {
      await page.keyboard.press("ArrowRight");
      await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "true");

      const panel = page.locator("[role='tabpanel']").first();
      await expect(panel).toContainText(/What it produces/i);
      await expect(panel).toContainText(/Human control/i);
    }

    // And wraps back to the start.
    await page.keyboard.press("ArrowRight");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  });

  test("reset view returns to the overview state", async ({ page }) => {
    await page.goto("/");
    const tabs = page
      .getByRole("tablist", { name: /stages of the engineering universe/i })
      .getByRole("tab");

    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");

    await page.getByRole("button", { name: /reset view/i }).click();

    for (let i = 0; i < 6; i += 1) {
      await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "false");
    }
  });
});

test.describe("revealed content is actually painted", () => {
  /**
   * Playwright's visibility check ignores opacity, and `toContainText` reads
   * the DOM whether or not anything is drawn. A bug that left every
   * `.reveal` block at `opacity: 0` therefore passed the whole suite while
   * most of the site was invisible in a real browser. These assertions look
   * at computed opacity instead.
   */
  test("every reveal block reaches full opacity once scrolled to", async ({ page }) => {
    await page.goto("/");

    const count = await page.locator(".reveal").count();
    expect(count, "the page should use the reveal wrapper").toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const block = page.locator(".reveal").nth(i);
      await block.scrollIntoViewIfNeeded();
      await expect
        .poll(
          () => block.evaluate((el) => Number(getComputedStyle(el).opacity)),
          { message: `.reveal #${i} never became opaque`, timeout: 5000 },
        )
        .toBeGreaterThan(0.99);
    }
  });

  test("the universe is painted, not merely present", async ({ page }) => {
    await page.goto("/");
    const tablist = page.getByRole("tablist", {
      name: /stages of the engineering universe/i,
    });
    await tablist.scrollIntoViewIfNeeded();
    await expect
      .poll(() => tablist.evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBeGreaterThan(0.99);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the page renders fully with motion disabled (AC-4)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#about")).toContainText(/specification/i);
    await expect(page.locator("#capabilities")).toBeAttached();

    // With motion disabled, revealed content must be opaque immediately —
    // not waiting on a transition that will never run.
    const first = page.locator(".reveal").first();
    await expect
      .poll(() => first.evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBeGreaterThan(0.99);
  });
});

test.describe("case studies", () => {
  test("every project card leads to a complete case study (AC-5)", async ({ page }) => {
    await page.goto("/work");

    const links = page.locator("article a[href^='/work/']");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    const hrefs = new Set<string>();
    for (let i = 0; i < count; i += 1) {
      const href = await links.nth(i).getAttribute("href");
      if (href) hrefs.add(href);
    }

    const required = [
      /^Problem and context$/i,
      /^Intended users$/i,
      /^The solution$/i,
      /^My contribution$/i,
      /^Architecture and technical decisions$/i,
      /^Testing and verification$/i,
      /^(Demonstrated outcomes|Objectives)$/i,
      /^Outstanding work and limitations$/i,
      /^What this page is based on$/i,
    ];

    for (const href of hrefs) {
      const response = await page.goto(href);
      expect(response?.status(), href).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      for (const heading of required) {
        await expect(
          page.getByRole("heading", { name: heading }),
          `${href} is missing ${heading}`,
        ).toBeVisible();
      }
    }
  });

  test("an unknown project returns the 404 page", async ({ page }) => {
    const response = await page.goto("/work/not-a-real-project");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /that page is not here/i }),
    ).toBeVisible();
  });
});

test.describe("content integrity", () => {
  test("no placeholder text is rendered anywhere (AC-6)", async ({ page }) => {
    for (const route of ["/", "/work"]) {
      await page.goto(route);
      const text = await page.locator("body").innerText();
      expect(text, `${route} rendered a placeholder`).not.toContain("TODO:");
    }
  });

  test("every internal link resolves", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page.locator("a[href^='/']").evaluateAll((nodes) =>
      Array.from(
        new Set(
          nodes.map((node) => (node as HTMLAnchorElement).getAttribute("href") ?? "/"),
        ),
      ),
    );

    for (const href of hrefs) {
      const target = href.split("#")[0] || "/";
      const response = await request.get(target);
      expect(response.status(), `${href} is broken`).toBeLessThan(400);
    }
  });

  test("external links are safe", async ({ page }) => {
    await page.goto("/");
    const unsafe = await page.locator("a[target='_blank']").evaluateAll((nodes) =>
      nodes
        .filter((node) => {
          const rel = node.getAttribute("rel") ?? "";
          return !rel.includes("noopener") || !rel.includes("noreferrer");
        })
        .map((node) => (node as HTMLAnchorElement).href),
    );
    expect(unsafe).toEqual([]);
  });
});

test.describe("seo", () => {
  test("sitemap lists the published routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("/work");
  });

  test("robots.txt points at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Sitemap:");
  });
});
