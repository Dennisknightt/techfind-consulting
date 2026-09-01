# Changelog

Entries correspond to the phase commits on `claude/techfind-crm-communications-yzv90r`. See
`docs/ROADMAP.md` for what's ahead.

## Phase 11 — Team management, catalogue management, VIEWER UI cleanup

Closes the three remaining items from the Phase 9/10 known-gaps list.

- **Team management UI** (`src/server/actions/team.ts`, `src/components/os/settings/TeamSettings.tsx`,
  Settings → Team). `users.write` (SUPER_ADMIN only) can now: invite a teammate (name, email,
  phone, role — there's no email sending yet, see `docs/INTEGRATIONS.md`, so this generates a
  one-time temporary password shown once in a dialog for the admin to share out of band, the
  same way the seeded team's own passwords work), change anyone's role via an inline select,
  deactivate/reactivate via a switch, and reset a member's password (which also invalidates
  their existing sessions). Everyone else sees the same roster read-only.
  Two lockout guards worth calling out: an admin can't deactivate their own account, and neither
  a role change nor a deactivation can remove the last active SUPER_ADMIN — both return a plain
  error instead of leaving the org with no one who can manage it.
- **Product catalogue management UI** (`src/server/actions/catalogue.ts`,
  `src/components/os/settings/CatalogueSettings.tsx`, Settings → Catalogue). `settings.write`
  (SUPER_ADMIN only) can edit each product's quick prices and quick-chip/active flags inline, and
  fully create/edit/delete Quick Items and Packages (each backed by a product-key picker). Base
  products themselves (key/category/name) stay seeded, not created here — a genuinely new
  product line touches the Quick Proforma Generator's category grouping and was out of scope.
- **Hid (not just correctly rejected) the primary write buttons from the VIEWER role**:
  - The single global "Quick Create" menu (topbar dropdown + mobile FAB) now filters its six
    entries — Proforma, Lead, Deal, Task, Meeting, Client — by `can(role, permission)`; the
    mobile FAB itself disappears entirely when a role can create nothing.
  - Each list page's own "New X" button (Clients, Leads, Deals, Tasks, Meetings,
    Quotes & Proformas) is now conditional on the matching permission, threaded down from a
    `can(user.role, ...)` check made server-side in each page.
  - `/app/quotes/new` (the full Proforma Generator, a page that's *entirely* a write flow) now
    checks `documents.write` itself and renders a plain "you don't have access" screen instead of
    the generator — closing the gap where a VIEWER without the button could still reach it by
    typing the URL directly. New shared component: `src/components/os/common/NoAccess.tsx`.
  - `LeadsView`'s "Convert to Deal" button and `ClientDetail`'s "New Deal" / "Create Opportunity"
    / "Meeting" quick actions are gated the same way.
  - The Communications composer (a persistent input, not a button) follows the app's existing
    disabled-with-explanation convention instead (matching `TaxSettings`/`PaymentProviderSettings`):
    a VIEWER still sees the thread but the composer is replaced with a one-line note instead of a
    non-functional input.
  - **Deliberately left as server-enforcement-only** (not hidden): Kanban drag-and-drop stage
    moves, the per-task "complete" checkbox, and other inline detail-page editors (deal owner
    reassignment, next-action fields). These are dense, per-row interactions rather than a single
    discrete "New X" button, and hiding them cleanly would mean disabling drag or replacing
    checkboxes across several already-complex views — a larger UI pass than this one. A VIEWER
    who tries still gets a correct rejection (a toast, not a crash); it's just not pre-hidden.
    Flagged here rather than left silently unaddressed.
- Verified live in a real headless-browser run against a built (`next build && next start`)
  instance with the seeded team: a SALES user sees every "New X" button and the topbar Create
  menu; a VIEWER sees none of them, gets the NoAccess screen on a direct `/app/quotes/new` visit,
  and sees the read-only Team/Catalogue banners; a SUPER_ADMIN can create a teammate through the
  full dialog flow (temp password reveal included) and the new member appears in the roster
  immediately, and the Catalogue's three sections render and are editable.

## Phase 10 — Real login for the marketing site's admin panel

- Closed the highest-priority known gap from Phase 9: `/admin` (the Revenue Engine panel) had no
  login of its own and relied on an `ADMIN_SECRET` header token the admin UI never actually sent.
- `src/app/(marketing)/admin/layout.tsx` now calls `getSessionUser()` — the same CRM session
  check used everywhere else — and requires role `SUPER_ADMIN`. No session → redirect to
  `/login?next=/admin`; wrong role → an in-page "you don't have access" screen (not a redirect
  loop, since they're already authenticated).
- `loginAction`/`LoginForm`/`LoginPage` gained a validated `next` redirect target (defaults to
  `/app`, restricted to internal paths — no open redirect) so signing in from `/login?next=/admin`
  lands back on `/admin` instead of always bouncing to the CRM.
- `src/lib/adminAuth.ts#isAuthorizedAdmin` (header-token check) replaced with
  `requireAdminUser()` (session + role check); every admin verb on `/api/leads`,
  `/api/leads/[id]`, `/api/leads/[id]/communications`, and `/api/communications` now uses it.
  Browser `fetch()` calls from `useLeads.ts`/`useCommunications.ts` needed no changes — same-origin
  requests already carry the session cookie, unlike the old header token they never sent.
- `ADMIN_SECRET` removed entirely: from `src/lib/config.ts`, `.env.example`, and the metrics
  endpoint's config dump.
- Added a sign-out control to `AdminShell`'s sidebar (desktop + mobile), showing the signed-in
  admin's name, reusing the existing `logoutAction`.
- Verified live in a real browser: an unauthenticated visit to `/admin` redirects to
  `/login?next=%2Fadmin`; logging in as a non-`SUPER_ADMIN` user and visiting `/admin` shows the
  Unauthorized screen (not a crash, not a redirect loop); logging in as a `SUPER_ADMIN` lands
  back on `/admin` with the leads/communications data loading correctly.

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
