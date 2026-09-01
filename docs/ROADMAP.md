# Roadmap

## Shipped (Phases 1–11)

1. Architecture, database schema, design system, session auth + RBAC, PWA shell, app navigation.
2. Home (Dennis Control Centre), Clients, Leads, Deals/Pipeline (Kanban), Tasks, Meetings.
3. Universal Communications hub (WhatsApp/Email/Website/Call/Meta/TikTok/Referral/Note).
4. Quick Proforma Generator, Quotes/Proformas/Invoices, real PDF generation with QR-coded
   payment links.
5. Payment gateway abstraction (Mock + IntaSend), public checkout, webhook reconciliation,
   receipts, Revenue Control Centre.
6. Projects and the deposit-triggered sales → delivery handoff.
7. Intelligence surface and "Prepare with Claude" exports.
8. Demo-data seeding infrastructure (kept as a documented no-op — the app ships genuinely empty
   of sample business data, by explicit instruction).
9. Documentation, a real security audit and remediation pass, final regression QA.
10. A real login for the marketing site's `/admin` panel — the previous `ADMIN_SECRET` header
    token (which the admin UI itself never sent) is gone; `/admin` and the endpoints it calls
    (`/api/leads*`, `/api/communications`) now require a session-authenticated `SUPER_ADMIN`
    user, the same session mechanism the CRM app itself uses. See `docs/SECURITY.md`.
11. Team management UI (Settings → Team: invite, change role, deactivate/reactivate, reset
    password), Product catalogue management UI (Settings → Catalogue: quick prices, quick
    items, packages), and hiding (not just correctly rejecting) the primary write buttons in
    the CRM UI from the VIEWER role. See `docs/CHANGELOG.md`.

## Deliberately not built yet

See `docs/SECURITY.md` "Known gaps" and `docs/INTEGRATIONS.md` for the specifics. In priority
order for a next pass:

1. **Real WhatsApp Cloud API / email sending** — see `docs/INTEGRATIONS.md`. Also blocks a real
   invite-by-email flow for Team management, which currently hands back a one-time temporary
   password instead.
2. **A real `prisma migrate` history on Postgres**, replacing the `prisma db push` schema-sync
   still in use — the provider itself moved to Postgres already (required for the first Vercel
   deploy, since SQLite cannot run there), but migrations, not just the provider, should be
   real and reviewable before this holds data worth protecting (see `docs/DATABASE.md`).
3. **Money as integer minor-units or `Decimal`** instead of `Float`, before transaction volume
   makes floating-point drift a real (rather than theoretical) concern.
4. **Refunds** — `PaymentProvider.refund()` exists in the interface and both providers
   implement it, but there's no UI action that calls it yet.
5. **`eslint.config.mjs` predates a version mismatch** — the installed `eslint-config-next`
   (15.5.18) ships its `core-web-vitals`/`typescript` entrypoints in the legacy `extends: [...]`
   shape, not a flat-config array, so `npx eslint .` errors either way (module-path mismatch as
   currently committed, or a `not iterable` crash if the import path is "corrected" to
   `core-web-vitals.js` — tried and reverted during the Phase 9 pass). `next build`'s own lint
   step swallows this without failing the build, so it's silent in practice, but real linting
   needs the config bridged properly (`@eslint/eslintrc`'s `FlatCompat`, or an
   `eslint-config-next` upgrade) before it can be trusted again.
