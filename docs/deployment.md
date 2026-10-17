# Deploying to Vercel

**This site has not been deployed.** Everything below is the preparation that
has been done and the exact steps left for you. Nothing here claims a
deployment that has not happened.

---

## What is already true

| Check | State |
|-------|-------|
| Production build succeeds locally | ✅ `npm run build`, 11 routes, all prerendered |
| Required environment variables | **None.** The site builds and runs with an empty environment |
| Secrets in the repository | None. There is no `.env`, and the only variable is public by design |
| `.gitignore` | Covers `node_modules`, `.next`, `.env*`, `.vercel`, test output |
| Rendering mode | Fully static. Every route is prerendered at build time |
| Vercel config file | Not needed. Vercel detects Next.js and uses the right settings |
| Asset paths | All local, all root-relative. No remote image host is configured or required |

## Prerequisite: git

`git` is **not installed on this machine** — `git --version` is not a
recognised command, and this directory is not a repository. Install it from
<https://git-scm.com/download/win>, reopen your terminal, then continue.

## Step 1 — Put the code on GitHub

```bash
git init
git add .
git commit -m "Shahzaib portfolio: The Digital Frontier"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Before the first commit, confirm nothing private is going up:

```bash
git status --short
```

You should see no `.env`, no `node_modules`, no `.next`.

## Step 2 — Import into Vercel

1. Sign in at <https://vercel.com> with the same GitHub account.
2. **Add New → Project**, then import the repository.
3. Vercel detects Next.js. Leave every build setting as detected:
   - Framework preset: **Next.js**
   - Build command: `next build`
   - Output directory: *(leave empty — Vercel handles it)*
   - Install command: `npm install`
   - Node version: 22 or later
4. Do **not** add any environment variable yet.
5. **Deploy.**

The first deployment gives you a URL like
`https://your-repo.vercel.app`. The site works fully at that URL.

## Step 3 — Set the public URL

Until `NEXT_PUBLIC_SITE_URL` is set, canonical URLs, `sitemap.xml`,
`robots.txt` and the Open Graph image all fall back to
`http://localhost:3000`. The site works, but search engines and link previews
will be wrong.

In **Project → Settings → Environment Variables**:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` (no trailing slash) | Production |

Then **redeploy** — `NEXT_PUBLIC_*` values are baked in at build time, so an
existing deployment will not pick it up.

Leave it unset for Preview deployments, or set it to the preview URL if you
want correct metadata there too.

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
