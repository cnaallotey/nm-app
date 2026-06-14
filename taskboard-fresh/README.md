# TaskBoard

Hybrid community / freelance task board. Post a task (paid or community),
**apply** for one yourself, or **nominate** someone else. Posters accept an
applicant/nominee, the task runs to completion, then both parties review each
other. No in-app payments. See `implementation.md` and `design-system.md` for
the full product, architecture and UI spec.

## Monorepo layout

```
/
├── apps/
│   ├── web/   ← Next.js 16 (App Router) + Tailwind v4 frontend
│   └── api/   ← Express + TypeScript + Prisma backend
├── package.json     ← npm workspaces + concurrently
├── .env.example     ← copy to .env (single shared env file)
├── design-system.md
└── implementation.md
```

> Architecture note: `implementation.md` specifies a **Pages Router** frontend.
> The scaffold is **App Router / Next 16 / Tailwind v4**, so frontend specifics
> are adapted (route handlers instead of `pages/api`, server components instead
> of `getServerSideProps`, CSS-first Tailwind theme instead of
> `tailwind.config.js`). The product behaviour and design spec are unchanged.

## Status — Phase 1 complete (Infrastructure)

- [x] Monorepo + npm workspaces + `concurrently` dev script
- [x] `apps/web`: moved, Tailwind v4 design tokens (`app/globals.css`),
      Plus Jakarta Sans, dev proxy to the API. **Builds & lints offline.**
- [x] `apps/api`: Express bootstrap, error/auth/admin middleware, route
      skeletons, Prisma schema + seed + raw SQL extras (FTS, rating trigger)
- [ ] Phases 2–6 (auth plumbing → core features → admin/polish)

### ⚠️ Deferred dependency install

Phase 1 was built with the **npm registry offline**. The web app's deps were
already installed (it builds today); everything else is written but not yet
installed. When the network is back, run once from the repo root:

```bash
npm install                       # installs all workspace deps
npm install --workspace=apps/web  # React Query, Zustand, RHF, lucide-react, …
```

### Auth0 & Resend are stubbed

Both are off by default (`.env`: `AUTH_MODE=stub`, `EMAIL_MODE=stub`):

- **Auth**: the acting user is resolved from the `x-dev-user` request header
  (falls back to `DEV_DEFAULT_USERNAME`, default `alice`). No JWT needed.
  Flip `AUTH_MODE=auth0` + fill the `AUTH0_*` vars to enable real Auth0 — no
  call-site changes.
- **Email**: messages are logged to the console. Flip `EMAIL_MODE=resend` +
  set `RESEND_API_KEY` to actually send.

## Waitlist (ships independently — pre-launch)

A minimal branded capture page at `/` ([app/page.tsx](apps/web/app/page.tsx) +
[app/_components/waitlist-form.tsx](apps/web/app/_components/waitlist-form.tsx))
posts to [app/api/waitlist/route.ts](apps/web/app/api/waitlist/route.ts). It
lives entirely in `apps/web` with **no backend dependency** — deploy
`apps/web` to Vercel on its own to launch the waitlist before the app is built.

Signups go into a **Resend audience**. To go live: create an audience in the
Resend dashboard, then set `RESEND_API_KEY` and `RESEND_AUDIENCE_ID`. Until
both are set the handler stub-logs and still returns success, so the flow is
fully testable offline / in dev with no credentials.

## Getting started

```bash
cp .env.example .env              # then set DATABASE_URL to a real Postgres
npm install                       # (needs network — see deferred install above)
npm run db:migrate                # create tables
psql "$DATABASE_URL" -f apps/api/prisma/sql/extras.sql   # FTS + rating trigger
npm run db:seed                   # 3 users (alice=admin), 2 tasks, etc.
npm run dev                       # web :3000  ·  api :4000  (concurrently)
```

Web: http://localhost:3000 · API health: http://localhost:4000/api/health

## Useful scripts (repo root)

| Script | What it does |
|---|---|
| `npm run dev` | Run API + web together |
| `npm run build` | Build API then web |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Seed dev data |
| `npm run db:generate` | `prisma generate` |
