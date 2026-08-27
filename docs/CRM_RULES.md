# CRM Rules

The business logic behind the pipeline, permissions, and the sales → delivery handoff — the
rules a new team member (or a future AI session) needs before touching this code.

## Roles and permissions

Defined in `src/server/auth/roles.ts`. Five roles, a flat permission list, checked with
`can(role, permission)`:

| Permission | SUPER_ADMIN | MANAGEMENT | SALES | FINANCE | VIEWER |
|---|---|---|---|---|---|
| `pipeline.write` (leads, deals, stage moves) | ✅ | ✅ | ✅ | | |
| `clients.write` | ✅ | ✅ | ✅ | | |
| `communications.write` | ✅ | ✅ | ✅ | | |
| `documents.write` (quotes/proformas/invoices) | ✅ | ✅ | ✅ | ✅ | |
| `payments.write` (record/reconcile/refund) | ✅ | | | ✅ | |
| `projects.write` | ✅ | ✅ | | ✅ | |
| `settings.write` (catalogue, quick items) | ✅ | | | | |
| `tax.write` (tax config, payment provider) | ✅ | | | | |
| `users.write` (team/roles) | ✅ | | | | |
| `revenue.view` | ✅ | ✅ | | ✅ | |

VIEWER has no write permissions — read-only across the app by construction (no permission
string grants it anything). `tax.write` deliberately gates both tax configuration *and* the
live/mock payment provider switch (`src/server/actions/paymentSettings.ts`) — both are
financially consequential, Super-Admin-only settings, not a Finance-role concern.

## Pipeline stages

`src/lib/os/pipeline.ts#PIPELINE_STAGES`:

```
IDENTIFIED → CONTACTED → INTERESTED → DEMO_BOOKED → DEMO_DONE
→ PROPOSAL → PROFORMA_SENT → DEPOSIT_PENDING → NEGOTIATING → WON
```

`LOST` is a terminal stage reachable from any of the above, always requires a `lostReason`
(`src/components/os/deals/LostDealDialog.tsx`) from a fixed list (`LOST_REASONS`) — never a
free-text-only loss, so lost-reason reporting stays aggregable.

A deal is considered **stalled** (`isStalled` in `PipelineView.tsx`) when it's been in its
current stage more than 7 days — but WON and LOST deals are explicitly excluded from that check:
a deal that's already closed isn't "stalled," it's done. (This exclusion was added after
reviewing seeded data that surfaced the bug: without it, every WON deal older than a week showed
a misleading "stalled" badge.)

## Sales → delivery handoff

`src/server/projects/handoff.ts#handoffToProject`, called from
`src/server/payments/reconcile.ts` the moment a payment clears a document's required deposit
(`paidAmount >= depositRequired`) — this is the single trigger, not a manual "create project"
step:

1. If the paid document has no linked `Deal` (the Quick Proforma Generator supports a walk-up
   sale directly against a company, no deal required — minimal data entry, infer rather than
   ask), a `Deal` is created on the fly, already `WON`, and backfilled onto the document.
2. If the linked deal isn't `WON` yet, it's marked `WON` now.
3. A `Project` is created (idempotent — `Project.dealId` is unique, so a second deposit payment
   on the same deal is a no-op here), stage `DEPOSIT`, carrying the company/deal/document/owner
   context forward with zero re-entry.
4. A `ProjectUpdate` activity-log entry and a `Notification` to the document owner are created.

## Project delivery stages

`src/lib/os/projects.ts#PROJECT_STAGES`:

```
DEPOSIT → REQUIREMENTS → DESIGN → DEVELOPMENT → CLIENT_REVIEW
→ CHANGES → DEPLOYMENT → TRAINING → LIVE → MAINTENANCE
```

Advanced via `src/server/actions/projects.ts#advanceProjectStageAction`, gated on
`projects.write`. Every stage move is logged to `ProjectUpdate`, forming the project's activity
timeline alongside free-text notes.

## Product footprint and upsell recommendations

`ProductFootprint` (`companyId` + `productId` → `NOT_PITCHED | OPPORTUNITY | ACTIVE`, optional
`mrr` for recurring products) is the source for two things:

- The Customer 360 "Recommended Next Product" card (`ClientDetail.tsx#recommendNextProduct`) —
  a small set of hardcoded cross-sell rules (e.g. "has WhatsApp automation but no CRM").
- The Intelligence "Opportunities" section (`src/server/intelligence/rules.ts#getOpportunityItems`)
  — the same kind of rule applied fleet-wide across all clients rather than one at a time.

## Intelligence rules — the "never fabricate" contract

Every function in `src/server/intelligence/rules.ts` and `src/server/intelligence/snapshot.ts`
is written to degrade to an empty result on an empty database, never a fabricated placeholder
number — a genuinely empty CRM should show "nothing urgent," not made-up urgency. This was
verified directly: the Intelligence and Home surfaces were screenshotted against both a fully
seeded database and a genuinely empty one, and the empty state reads as calm and honest rather
than broken.
