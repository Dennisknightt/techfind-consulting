# Database

`prisma/schema.prisma`. SQLite for local development (`prisma/dev.db`, gitignored); the schema
is deliberately written to be Postgres-portable for production (Supabase or similar) — no
SQLite-only features are used.

## The string-union "enum" convention

SQLite has no native enum type, and Prisma's cross-database enum support adds friction we don't
need at this stage. Every field that's conceptually an enum is a plain `String` with an
allowed-value list documented in a `///` doc-comment directly above the model, e.g.:

```prisma
/// role: SUPER_ADMIN | MANAGEMENT | SALES | FINANCE | VIEWER
model User {
  role String @default("SALES")
  ...
}
```

The application code is the source of truth for validating these values (see `src/lib/os/*`
for the shared constant arrays — `PIPELINE_STAGES`, `PROJECT_STAGES`, `LOST_REASONS`, etc. —
imported by both the Server Actions that write these fields and the Client Components that
render pickers for them). When migrating to Postgres, these can become native enums if desired;
nothing in the application logic depends on them being strings specifically.

## Domain model, roughly in creation order

```
User ──┬── Session
       └── (owner of) Company, Lead, Deal, Task, Communication, SalesDocument, Project, Payment (recordedBy)

Company ──┬── Contact
          ├── Lead
          ├── Deal ──┬── Meeting
          │          ├── Communication
          │          ├── Task
          │          ├── SalesDocument ──┬── SalesDocumentItem
          │          │                   ├── PaymentSession ── Payment ── Receipt
          │          │                   └── (convertedFrom/convertedTo — proforma → invoice chain)
          │          └── Project ──┬── ProjectUpdate (activity/stage-change log)
          │                        └── Task
          └── ProductFootprint (per Product: NOT_PITCHED | OPPORTUNITY | ACTIVE)

Product ──┬── ProductFootprint
          ├── QuickItem (a saved combo of products at a fixed price)
          └── Package  (same idea, catalogue-level rather than per-user)

Setting (key/value JSON — tax config, active payment provider, currency)
AuditLog (append-only; see docs/SECURITY.md)
Notification
Counter (atomic document/receipt numbering — see below)
```

## Money

Every currency amount is a `Float`. This is a known simplification (binary floating point is
not exact for currency) accepted for this stage of the build; `src/lib/os/money.ts#round2`
rounds to 2dp at every computation boundary to keep drift from compounding. A production
hardening pass would move to integer minor-units (cents) or `Decimal`.

## Atomic numbering

Document numbers (`TF-PF-2026-0087`), receipt numbers (`TF-RCT-2026-0012`) etc. are issued by
`src/server/documents/numbering.ts` via the `Counter` table, incremented inside a
`db.$transaction`, so concurrent proforma creation can never collide on a number — this matters
because these numbers are user-facing on PDFs and must be trustworthy.

## JSON-string list fields

A few fields store a JSON-encoded array in a `String` column rather than a join table, when the
list is small, denormalized, and never queried by its contents from SQL (e.g.
`Deal.productKeys`, `Meeting.productsDiscussed`, `Product.quickPrices`). Always go through
`src/server/json.ts#parseJsonArray` to read them defensively rather than a raw `JSON.parse`.

## Migrations

This stage of the build uses `prisma db push` (schema-sync, no migration history) rather than
`prisma migrate`, appropriate for a fast-moving pre-production build on a disposable SQLite
file. Moving to Postgres for production should switch to `prisma migrate` with a real migration
history before the first production deploy.
