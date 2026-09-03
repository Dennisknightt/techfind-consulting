# Security

This document reflects an actual audit pass performed before shipping (Phase 9), not an
aspirational checklist — see the "Known gaps" section at the bottom for what wasn't fully
closed.

## Authentication

Session-cookie based, not JWT. `src/server/auth/session.ts`: bcrypt-hashed passwords,
DB-backed sessions (`Session` table, not a signed stateless token, so a session can be revoked
server-side). Cookie is `httpOnly`, `secure` in production, `sameSite: lax`, 30-day expiry
enforced server-side on every read (`getSessionUser` checks both `session.expiresAt` and
`user.active` — deactivating a user or an admin invalidating a session takes effect
immediately, not just at next password check).

## Authorization

Every Server Action re-authenticates and, where the action is a mutation, re-authorizes via
`requirePermission(permission)` (`src/server/auth/guard.ts`) — the permission matrix lives in
`src/server/auth/roles.ts`, documented in full in `docs/CRM_RULES.md`. A component can hide a
button for a role that shouldn't see it; only the Server Action's own check is what actually
enforces it, and that's deliberate — the client is never the security boundary.

**This was audited and a real gap was found and fixed**: several Server Actions
(clients/deals/leads/tasks/meetings/communications/documents) checked only
`requireUserOrThrow()` — "is this a logged-in user" — without the follow-up `requirePermission`
check, meaning the VIEWER role (documented as read-only) could actually create/edit/delete
records through those actions. Every write action across those files now calls
`requirePermission(...)` with the permission appropriate to what it does; two new permissions
(`tasks.write`, `meetings.write`) were added to the matrix since tasks and meetings didn't
previously have one.

## Payments

The most safety-critical part of the app — see `docs/PAYMENTS.md` in full. In short: a payment
is only ever marked successful by directly re-verifying with the gateway
(`src/server/payments/reconcile.ts#confirmPayment`), never by trusting a client request body or
a webhook's claimed status. The charge amount is always read server-side from
`PaymentSession.amountDue`. A dev-safety guard (`src/server/payments/registry.ts`) makes it
structurally impossible for a non-production environment to place a real charge unless
`ALLOW_LIVE_PAYMENTS_IN_DEV=true` is explicitly set.

## Public (unauthenticated) surface

Exactly three route groups don't require a session:

- `/api/os/pay/[token]/{charge,status}` — the customer checkout. Rate-limited
  (`src/lib/ratelimit.ts`), scoped strictly to the `PaymentSession` the token identifies. The
  charge endpoint's rate-limit key previously derived the client IP with its own inline,
  spoofable header read instead of the vetted `src/lib/ip.ts#getClientIp` (which only trusts a
  known ordered list of proxy headers, falling back to `x-forwarded-for` last) — fixed to use
  the shared helper.
- `/api/webhooks/payments/intasend` — the gateway webhook. Optionally verifies IntaSend's
  "challenge" secret (`INTASEND_WEBHOOK_CHALLENGE`) before doing anything else, as
  defense-in-depth; the actual safety property (never crediting on an unverified claim) comes
  from `confirmPayment`'s re-check, not the challenge, so this remains safe even before that env
  var is configured.
- `/api/leads`, `/api/leads/[id]`, `/api/leads/[id]/communications`, `/api/communications` — the
  **marketing site's** lead-capture and admin endpoints (a separate, older subsystem from the
  CRM described elsewhere in these docs — its data lives in `src/lib/store.ts`, not Prisma).
  `POST /api/leads` is the public audit/qualification form submission, protected by payload-size
  limits, input validation, a honeypot field, and layered IP/email/phone rate limiting. Every
  other verb on these routes is admin-only, gated by `src/lib/adminAuth.ts#requireAdminUser` — a
  real session check (same `getSessionUser()` the CRM itself uses) requiring role `SUPER_ADMIN`,
  not a shared secret. `/admin` (the panel these endpoints feed) enforces the identical check in
  its own layout, so a browser session and the API calls it makes are gated by the same rule.

  **Two real bugs were found and fixed in an earlier pass, before the real login existed**: (1)
  `PATCH`/`DELETE /api/leads/[id]` and both verbs on `/api/leads/[id]/communications` had **no
  auth check at all** — anyone who knew or guessed a lead id could edit, delete, or inject into a
  lead's communication thread. (2) The token check these routes originally had (`ADMIN_SECRET`
  via an `x-admin-token` header) was **fail-open**: written as `if (expected && token !==
  expected)`, so an unset secret silently skipped the check entirely. Both are moot now — the
  token scheme was removed outright in favor of the session/role check described above, which
  fails closed by construction (no session or wrong role ⇒ `null` ⇒ rejected).

## Audit trail

`src/server/audit.ts#writeAudit` — append-only `AuditLog` rows (actor, action, entity, before/
after snapshot, ip). Never throws into the caller (a logging failure must never block the
mutation it's logging). Called from every sensitive mutation: client/deal/lead/task/meeting/
communication/document writes, payment confirmation, tax/payment-provider setting changes,
project stage advances and handoffs.

## Secrets

Real credentials (`INTASEND_SECRET_KEY`, `NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY`, `SESSION_SECRET`,
etc.) live only in `.env`, which is gitignored and was confirmed absent from this project's git
history. `.env.example` documents every variable the app reads, with a placeholder value, so a
new environment can be configured without guessing.

## Known gaps (not closed in this pass)

- **VIEWER-role users still see write buttons in the CRM UI** (New Client, New Deal, etc.) that
  the server correctly rejects on click (with a toast, not a crash — verified) rather than the
  UI hiding them up front. Not a security issue (the server enforcement is what actually
  matters, and it's correct), but a rough edge worth polishing: components would need to check
  `can(user.role, permission)` (already safe to call client-side — `roles.ts` has no
  `"server-only"` guard) before rendering their primary actions.
- **Amounts are `Float`, not integer minor-units or `Decimal`** — see `docs/DATABASE.md`. Not a
  currently-exploitable issue (all computation goes through `round2`), but worth hardening
  before scaling transaction volume.
