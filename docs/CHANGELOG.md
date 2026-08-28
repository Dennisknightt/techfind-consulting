# Changelog

Entries correspond to the phase commits on `claude/techfind-crm-communications-yzv90r`. See
`docs/ROADMAP.md` for what's ahead.

## Phase 9 — Docs, security pass, final QA

- Full documentation set added under `docs/` (this file and its siblings).
- Real security audit performed; fixed:
  - VIEWER role could mutate data through several Server Actions that checked authentication
    but not authorization (`clients.ts`, `deals.ts`, `leads.ts`, `tasks.ts`, `meetings.ts`,
    `communications.ts`, `documents.ts`) — every write action now enforces the correct
    permission; added `tasks.write` and `meetings.write` to the RBAC matrix.
  - Two marketing-site lead endpoints (`PATCH`/`DELETE /api/leads/[id]`, both verbs on
    `/api/leads/[id]/communications`) had no auth check at all.
  - The existing admin-token check on marketing-site endpoints was fail-open on an unset
    `ADMIN_SECRET`; now fails closed via a shared `isAuthorizedAdmin` helper.
  - The public payment-charge endpoint derived the client IP with an inline, spoofable header
    read instead of the vetted shared helper — fixed, closing a rate-limit bypass.
  - Added optional IntaSend webhook "challenge" verification as defense-in-depth (the actual
    anti-fraud guarantee was already the reconciliation design, not the webhook).
  - `requirePermission`'s thrown error message changed from a bare `"FORBIDDEN"` to a
    user-facing sentence, since several components surface it directly via `toast.error`.
- `Home`/`Intelligence` "Needs Attention" cards fixed to show `KES` consistently (a local
  formatter in `rules.ts` used Intl's currency symbol, which renders `Ksh` — replaced with the
  shared `formatKES`).
- Pipeline board's stalled-deal detection fixed to exclude `WON`/`LOST` deals — a closed deal
  isn't "stalled."

## Phase 8 — Demo data infrastructure

- Built a full Kenyan demo-data generator (companies, contacts, leads, deals, proformas,
  invoices, payments, projects, communications, meetings, tasks, product footprint) and
  verified it end-to-end against every surface in the app.
- Per explicit instruction, reverted to shipping with **no** seeded demo data — the generator
  stays in history but `seedDemoData` is a documented no-op; the app starts genuinely empty
  (users, product catalogue, and settings only).

## Phase 7 — Intelligence + Prepare with Claude

- Business snapshot aggregation (pipeline funnel, revenue, projects, top clients, team
  performance) — every query degrades to zero on an empty database rather than fabricating data.
- Intelligence page combining the snapshot with the existing Home rule engine.
- "Prepare with Claude": a real markdown export of the business snapshot, copy/download, no
  external API call required.

## Phase 6 — Projects + sales-to-project handoff

- Expanded the `Project` model (owner, target/live dates, linked document, `ProjectUpdate`
  activity log); added `Task.projectId`.
- Deposit-triggered handoff (`src/server/projects/handoff.ts`) — including inferring a `Deal`
  for a walk-up sale that never had one, so the Quick Proforma Generator's fast path still
  produces a project.
- 10-stage delivery pipeline, Projects list + detail pages, cross-linked from Deal detail.

## Phase 5 — Payments

- Provider-agnostic gateway abstraction (Mock default everywhere but production, real IntaSend
  behind the same interface), dev-safety guard, public checkout, webhook + polling
  reconciliation that never trusts a claimed status/amount, receipts, Revenue Control Centre.

## Phase 4 — Documents

- Quick Proforma Generator, Quotes/Proformas/Invoices, real PDF generation with embedded QR
  payment links, atomic document numbering.

## Phase 3 — Communications

- Unified inbox across WhatsApp/Email/Website/Call/Meta/TikTok/Referral/Note, tied to
  companies/contacts/deals.

## Phase 2 — Core CRM

- Home dashboard, Leads, Deals/Pipeline (Kanban with stalled-deal detection and governed
  lost-reason capture), Clients (Customer 360), Tasks, Meetings.

## Phase 1 — Foundation

- Route-group split between the marketing site and the OS, database schema, session-cookie
  auth with RBAC, PWA shell, desktop/mobile app navigation, welcome experience.
