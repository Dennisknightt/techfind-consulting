# Roadmap

## Shipped (Phases 1–9)

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

## Deliberately not built yet

See `docs/SECURITY.md` "Known gaps" and `docs/INTEGRATIONS.md` for the specifics. In priority
order for a next pass:

1. **A real login for the marketing site's `/admin` panel.** Currently gated only by an
   API-level token that the admin UI itself doesn't send — the panel is not safely usable in
   production until this exists. Highest priority of anything left.
2. **Hide (not just correctly reject) write actions from the VIEWER role in the CRM UI** — a
   UX polish pass using the already-safe client-side `can(role, permission)` check.
3. **Team management UI** — `users.write` exists in the permission matrix and is enforced
   nowhere yet because there's no UI to invite/edit teammates or change roles. Settings → Team
   is currently a "Coming Soon" placeholder.
4. **Product catalogue management UI** — same story for `settings.write`; quick items, quick
   prices, and packages are seeded/edited by hand today, not through Settings → Catalogue.
5. **Real WhatsApp Cloud API / email sending** — see `docs/INTEGRATIONS.md`.
6. **A real `prisma migrate` history on Postgres**, replacing the `prisma db push` schema-sync
   still in use — the provider itself moved to Postgres already (required for the first Vercel
   deploy, since SQLite cannot run there), but migrations, not just the provider, should be
   real and reviewable before this holds data worth protecting (see `docs/DATABASE.md`).
7. **Money as integer minor-units or `Decimal`** instead of `Float`, before transaction volume
   makes floating-point drift a real (rather than theoretical) concern.
8. **Refunds** — `PaymentProvider.refund()` exists in the interface and both providers
   implement it, but there's no UI action that calls it yet.
9. **`eslint.config.mjs` predates a version mismatch** — the installed `eslint-config-next`
   (15.5.18) ships its `core-web-vitals`/`typescript` entrypoints in the legacy `extends: [...]`
   shape, not a flat-config array, so `npx eslint .` errors either way (module-path mismatch as
   currently committed, or a `not iterable` crash if the import path is "corrected" to
   `core-web-vitals.js` — tried and reverted during the Phase 9 pass). `next build`'s own lint
   step swallows this without failing the build, so it's silent in practice, but real linting
   needs the config bridged properly (`@eslint/eslintrc`'s `FlatCompat`, or an
   `eslint-config-next` upgrade) before it can be trusted again.
