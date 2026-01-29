# CreatorFlow365 — .com Purchase & Launch Readiness

**Use this doc to get the site ready for a .com purchase and launch.**

---

## 1. Before You Buy the Domain

### Decide on the domain
- **Recommended:** `creatorflow365.com` (matches Open Graph and branding in the app).
- Check availability at your registrar or via Vercel (Settings → Domains → Add → type name; Vercel can sell it).

### Have these ready
- [ ] **Vercel project** — App deployed and building successfully.
- [ ] **Neon production DB** — `DATABASE_URL` (pooler) for production.
- [ ] **Session secret** — `SESSION_SECRET` generated and stored somewhere safe.
- [ ] **Gumroad links** — Plan and credit product URLs (or placeholders) in env or `lib/gumroad-config.ts`.

---

## 2. Buy the Domain

### Option A: Buy through Vercel (simplest)
1. Vercel Dashboard → your project → **Settings** → **Domains**.
2. **Add** → enter `creatorflow365.com` (or your choice).
3. If available, **Buy** and complete purchase; Vercel configures DNS and SSL.

### Option B: Buy elsewhere (Namecheap, GoDaddy, etc.)
1. Buy the domain at your registrar.
2. Add it in Vercel: **Settings** → **Domains** → **Add** → enter domain.
3. Follow Vercel’s DNS instructions (A record + CNAME for `www`).  
   **Full steps:** see `DOMAIN_SETUP_STEPS.md`.

---

## 3. Set Production Environment Variables

In **Vercel** → project → **Settings** → **Environment Variables**, set these for **Production** (and Preview if you use a custom preview domain):

| Variable | Example / notes |
|----------|------------------|
| `DATABASE_URL` | Neon production pooler URL |
| `SESSION_SECRET` | Long random string (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| **`NEXT_PUBLIC_SITE_URL`** | **`https://creatorflow365.com`** (or your .com). Used for reset links, Open Graph, sitemap. |
| `NODE_ENV` | `production` (Vercel usually sets this) |

### If you use Instagram
- `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`, `NEXT_PUBLIC_INSTAGRAM_APP_ID`
- **`INSTAGRAM_REDIRECT_URI`** = **`https://creatorflow365.com/api/instagram/auth/callback`** (must match your Facebook app settings)

### Optional (as needed)
- `CRON_SECRET` (for scheduled jobs)
- `CLOUDINARY_*` (uploads)
- Gumroad URLs via env or keep defaults in `lib/gumroad-config.ts`

---

## 4. After Domain Is Connected

### In your codebase (already done)
- **Password reset** uses `NEXT_PUBLIC_SITE_URL` (or `VERCEL_URL`) so reset links point to your .com.
- **Open Graph** in `app/layout.tsx` uses `NEXT_PUBLIC_SITE_URL` for the canonical URL.
- **Sitemap** at `/sitemap.xml` uses `NEXT_PUBLIC_SITE_URL`; `public/robots.txt` points to it.

### In Vercel
- [ ] Domain shows **Valid Configuration** (and SSL when issued).
- [ ] Production env vars set, including **`NEXT_PUBLIC_SITE_URL=https://yourdomain.com`**.
- [ ] Redeploy after adding/changing env vars so they’re baked into the build.

### Quick checks
- [ ] `https://yourdomain.com` loads.
- [ ] `https://www.yourdomain.com` redirects to non-www (or vice versa), per Vercel.
- [ ] Login / signup / password reset flow (reset link should use your .com).
- [ ] `/tools`, `/pricing`, `/privacy`, `/terms` load.
- [ ] `/sitemap.xml` exists and uses your .com in URLs.

---

## 5. Launch Checklist (high level)

- [ ] **Domain** — .com purchased and connected in Vercel; SSL valid.
- [ ] **Env** — `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `SESSION_SECRET` set for production.
- [ ] **Auth** — Signup, login, forgot-password work on production URL.
- [ ] **Payments** — Gumroad (or other) links point to correct products; pricing page matches.
- [ ] **Legal** — Privacy and Terms pages present and linked (e.g. in footer).
- [ ] **SEO** — `robots.txt` and `/sitemap.xml` live; Open Graph uses your .com.

For a longer technical and legal checklist, see **`PRODUCTION_READINESS.md`**.

---

## 6. Reference

| Doc | Purpose |
|-----|--------|
| **`DOMAIN_SETUP_STEPS.md`** | Step-by-step DNS and Vercel domain setup (if not buying through Vercel). |
| **`VERCEL_DEPLOYMENT_CHECKLIST.md`** | Full Vercel deploy + env vars. |
| **`PRODUCTION_READINESS.md`** | Security, legal, SEO, and performance checklist. |

---

*Last updated: January 2026*
