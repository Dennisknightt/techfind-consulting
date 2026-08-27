# Techfind Consulting

Two things live in this repository:

- **The public marketing site** (`src/app/(marketing)/*`) — TechFind Consulting's AEO/AI-search
  agency site.
- **Techfind Revenue OS** (`src/app/(os)/*`, mounted at `/login` and `/app/*`) — the internal
  CRM/communications/sales/invoicing/payments/projects/business-intelligence operating system
  the team actually runs the business on.

Start with **`docs/ARCHITECTURE.md`** for how the two fit together in one Next.js app, then:

| Doc | What's in it |
|---|---|
| `docs/ARCHITECTURE.md` | Route groups, layering, the Server Action pattern, PWA |
| `docs/DATABASE.md` | Schema conventions, the domain model, money/JSON-field notes |
| `docs/DESIGN_SYSTEM.md` | Tokens, type, the OS component layer |
| `docs/CRM_RULES.md` | Roles/permissions, pipeline stages, the sales → delivery handoff |
| `docs/PAYMENTS.md` | The gateway abstraction, dev-safety guard, reconciliation |
| `docs/INTEGRATIONS.md` | What's real, what's stubbed, how to connect the rest |
| `docs/SECURITY.md` | Auth, the audit findings and fixes, known gaps |
| `docs/ROADMAP.md` | What's shipped, what's deliberately not built yet |
| `docs/CHANGELOG.md` | Phase-by-phase build history |

## Getting started

```bash
npm install
cp .env.example .env         # fill in real values — see .env.example for what each one does
npx prisma db push           # sync the schema to a local SQLite dev.db
npx prisma db seed           # users + product catalogue + settings (no demo business data)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the marketing site, or
[http://localhost:3000/app](http://localhost:3000/app) for the OS (redirects to `/login`).
Seeded team accounts all use the password from `SEED_DEFAULT_PASSWORD` in `.env`
(`techfind2026` if unset) — see `prisma/seed/users.ts` for the account list and roles.

## Payments — read this before touching `/app/quotes` or `/pay/[token]`

Outside `NODE_ENV=production`, payments always run against a safe, no-external-calls mock
provider regardless of what's configured in Settings → Payment Provider — see
`docs/PAYMENTS.md`. Never set `ALLOW_LIVE_PAYMENTS_IN_DEV=true` unless you specifically intend
a real charge to fire.

## Stack

Next.js 15 (App Router) · Prisma 6 · SQLite (dev) · Tailwind v4 · Radix primitives ·
`@react-pdf/renderer` · `intasend-node`.
