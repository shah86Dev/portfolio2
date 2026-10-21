import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Regression tests for the site's public origin.
 *
 * These exist because of a real incident: the first Vercel deployment went
 * out with `NEXT_PUBLIC_SITE_URL` unset, so every canonical URL, the sitemap,
 * robots.txt and the Open Graph image advertised `http://localhost:3000`.
 * Nothing failed loudly — the site looked fine and every link preview was
 * broken. (docs/constitution.md §2, and the "Improve" stage in method.ts:
 * anything that went wrong once gets a test.)
 */
async function resolve(): Promise<string> {
  vi.resetModules();
  const mod = await import("@/content/site.config");
  return mod.siteConfigInput.siteUrl;
}

/** Clears every variable the resolver consults, so each case starts clean. */
function clearAll() {
  for (const key of [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",
    "VERCEL_PROJECT_PRODUCTION_URL",
    "NEXT_PUBLIC_VERCEL_URL",
    "VERCEL_URL",
  ]) {
    vi.stubEnv(key, "");
  }
}

describe("site URL resolution", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers an explicit NEXT_PUBLIC_SITE_URL over anything Vercel provides", async () => {
    clearAll();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://shahzaib.dev");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio2.vercel.app");
    expect(await resolve()).toBe("https://shahzaib.dev");
  });

  it("falls back to the Vercel production domain and adds the scheme", async () => {
    clearAll();
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio2.vercel.app");
    expect(await resolve()).toBe("https://portfolio2.vercel.app");
  });

  it("falls back to the per-deployment URL, which is right for previews", async () => {
    clearAll();
    vi.stubEnv("VERCEL_URL", "portfolio2-git-branch-shah86dev.vercel.app");
    expect(await resolve()).toBe("https://portfolio2-git-branch-shah86dev.vercel.app");
  });

  it("never reports localhost when a Vercel domain is available", async () => {
    clearAll();
    vi.stubEnv("NEXT_PUBLIC_VERCEL_URL", "portfolio2-pi-six-98.vercel.app");
    expect(await resolve()).not.toContain("localhost");
  });

  it("strips trailing slashes so joined paths never double up", async () => {
    clearAll();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://shahzaib.dev///");
    expect(await resolve()).toBe("https://shahzaib.dev");
  });

  it("leaves an already-qualified value alone", async () => {
    clearAll();
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "https://portfolio2.vercel.app");
    expect(await resolve()).toBe("https://portfolio2.vercel.app");
  });

  it("uses localhost only when nothing at all is configured", async () => {
    clearAll();
    expect(await resolve()).toBe("http://localhost:3000");
  });

  it("always produces a parseable absolute origin", async () => {
    clearAll();
    vi.stubEnv("VERCEL_URL", "portfolio2.vercel.app");
    const url = new URL(await resolve());
    expect(url.protocol).toBe("https:");
    expect(url.pathname).toBe("/");
  });
});
