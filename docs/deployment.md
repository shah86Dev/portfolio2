# Deploying to Vercel

**This site has not been deployed.** The code is on GitHub; no Vercel project
exists yet. Everything below is the preparation that has been done and the
exact steps left. Nothing here claims a deployment that has not happened.

---

## What is already true

| Check | State |
|-------|-------|
| Production build succeeds locally | ✅ `npm run build`, 11 routes, all prerendered |
| Required environment variables | **None.** The site builds and runs with an empty environment |
| Secrets in the repository | None. There is no `.env`, and the only variable is public by design |
| `.gitignore` | Covers `node_modules`, `.next`, `.env*`, `.vercel`, test output, raw Lighthouse reports |
| Rendering mode | Fully static. Every route is prerendered at build time |
| Vercel config file | Not needed. Vercel detects Next.js and uses the right settings |
| Asset paths | All local, all root-relative. No remote image host is configured or required |

## Step 1 — Put the code on GitHub ✅ done

Done on 2026-10-17. Git 2.55.0.5 was installed via
`winget install --id Git.Git -e`, and the repository was pushed to:

**<https://github.com/shah86Dev/portfolio2>** — branch `main`, first commit
`1d73810`, 68 files, 453 KiB.

`npm run verify` passed before the push, so what is on GitHub builds.

Two things to be aware of about that push:

- The commit author is `Shahzaib <shahzaib8620@gmail.com>`, set per-repository
  (not globally). If that address is not registered on the GitHub account, the
  commit will not be attributed to it — add it under GitHub → Settings →
  Emails, or change `git config user.email` and amend.
- The contact email in `src/content/site.config.ts` is now in a **public**
  repository, and it stays in the git history even if the file changes later.

## Step 2 — Import into Vercel

1. Sign in at <https://vercel.com> **with GitHub**, as `shah86Dev`. Signing in
   with email instead will not show the repository.
2. **Add New → Project**. Find `shah86Dev/portfolio2` and click **Import**.
   If it is not listed, use **Adjust GitHub App Permissions** and grant Vercel
   access to that repository.
3. Vercel detects Next.js. Leave every build setting as detected:
   - Framework preset: **Next.js**
   - Root directory: `./`
   - Build command: `next build`
   - Output directory: *(leave empty — Vercel handles it)*
   - Install command: `npm install`
   - Node version: 22.x or later (the default is correct; this project sets no
     `engines` field, so Vercel picks its current default)
4. Do **not** add any environment variable yet — see step 3 for why.
5. **Deploy.** Expect roughly 2–4 minutes for a cold first build.

The first deployment gives you a URL like `https://portfolio2.vercel.app`. The
site works fully at that URL; only its metadata will point at localhost until
step 3.

**What the build does:** installs all dependencies including dev ones (Vercel
does this by default), then runs `next build`. Nothing else runs — tests and
Lighthouse are not part of the build. The `lighthouse` devDependency adds about
19 MB to the install and a few seconds; harmless, but it can be removed if you
would rather keep builds lean, since it is only used by hand.

## Step 3 — Set the public URL

Until `NEXT_PUBLIC_SITE_URL` is set, canonical URLs, `sitemap.xml`,
`robots.txt` and the Open Graph image all fall back to
`http://localhost:3000`. The site works, but search engines and link previews
will be wrong.

This is why the first deploy runs without it: you do not know the URL until
Vercel has given you one.

In **Project → Settings → Environment Variables → Add New**:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SITE_URL` | the deployment's own origin, no trailing slash — e.g. `https://portfolio2.vercel.app` | **Production** only |

Then **Deployments → latest → ⋯ → Redeploy**. `NEXT_PUBLIC_*` values are
compiled into the output at build time, so an existing deployment will never
pick up a new value — saving the variable alone changes nothing.

Leave it unset for Preview deployments. Previews get a different URL every
time, so a fixed value there would be wrong more often than right; unset, they
fall back to localhost metadata, which nobody indexes anyway.

Verify it took effect by opening `/robots.txt` on the deployed site: the
`Sitemap:` line should name your domain, not `localhost:3000`.

> This variable is public by design: it is the address of your own website.
> Never put a secret in a `NEXT_PUBLIC_*` variable — they are compiled into
> the JavaScript the browser downloads.

## Step 4 — Custom domain (when you have one)

1. **Project → Settings → Domains → Add**, enter the domain.
2. At your registrar, add the records Vercel shows:
   - apex (`example.com`): `A` → `76.76.21.21`
   - subdomain (`www`): `CNAME` → `cname.vercel-dns.com`
   *(Use whatever Vercel displays — these change.)*
3. Wait for DNS to propagate; Vercel issues the TLS certificate.
4. Update `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy.
5. Update `emailSubject` in `src/content/site.config.ts` if it mentions the
   old domain.

## How deployments work after that

- **Push to `main`** → production deployment.
- **Push any other branch, or open a pull request** → preview deployment at
  its own URL, with the production one untouched.
- **Rollback**: Deployments tab → pick a previous one → **Promote to
  Production**. This is the "known way back" the constitution asks for, and it
  is why no build step depends on local state.

## Before every deployment

```bash
npm run verify
```

Type-check, lint, unit tests, production build. Vercel will run the build
anyway, but failing locally is faster and cheaper than failing in CI.

Optionally, against a real browser:

```bash
npx playwright install chromium   # once
npm run test:e2e
```

## After deploying

1. Open the production URL and check the hero renders.
2. Open `https://your-domain.com/sitemap.xml` — every published project should
   be listed with the right origin.
3. Open `https://your-domain.com/robots.txt` — the `Sitemap:` line should point
   at your domain, not localhost.
4. Paste the URL into a social preview debugger to confirm the OG image.
5. Run Lighthouse against the production URL. The scores in
   `docs/constitution.md` §6 were measured on 2026-10-16 **against a local
   production build, not a deployment** — no real network, no TLS, no CDN, no
   cold start. This is the point at which you find out the production numbers.
   Record them next to the localhost ones rather than replacing them, and note
   the date; `docs/lighthouse-summary.md` has the method and the command.
6. If a project becomes genuinely live, set its `status` to `deployed` **and**
   give it a `liveUrl`. The build fails if you do one without the other.

## Things that would change this setup

- **A working contact form.** It would need a Route Handler, a mail provider,
  a server-side secret and spam protection — and the constitution forbids
  shipping a form before its delivery has been tested.
- **Remote images.** Would need `images.remotePatterns` in `next.config.ts`.
- **Analytics.** Deliberately absent. Vercel Analytics is one toggle away, but
  it is a privacy decision, not a technical one.
