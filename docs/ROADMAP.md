# Roadmap

## Shipped (Phases 1–12)

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
12. A real `prisma migrate` history on Postgres (replacing `prisma db push`), every currency
    field migrated from `Float` to `Decimal(12,2)`, a working Refunds action on `/app/payments`,
    and `eslint.config.mjs` bridged so `npx eslint .` actually runs. See `docs/CHANGELOG.md`,
    `docs/DATABASE.md` and `docs/PAYMENTS.md`.

## Deliberately not built yet

See `docs/SECURITY.md` "Known gaps" and `docs/INTEGRATIONS.md` for the specifics.

1. **Real WhatsApp Cloud API / email sending** — see `docs/INTEGRATIONS.md`. Needs real
   credentials this environment doesn't have; also blocks a real invite-by-email flow for Team
   management, which currently hands back a one-time temporary password instead.
