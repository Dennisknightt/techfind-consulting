# Database

`prisma/schema.prisma`. **PostgreSQL** — required in any deployed environment, since Vercel's
serverless functions have no persistent local disk and cannot serve a file-based SQLite
database. Local development can point `DATABASE_URL` at either a local Postgres instance or the
same hosted database used elsewhere; the schema itself was written from the start to avoid
SQLite-only features, so the switch from the SQLite-based earlier local dev setup was a
one-line provider change with no field-level migration needed.

## The string-union "enum" convention

The schema still avoids native Postgres enums by choice, not necessity (this convention
predates the Postgres switch, from when SQLite — which has no enum type — was the only
provider, and there was no reason to give it up once Postgres was adopted: it keeps adding a
new allowed value a plain code + docs change, no schema migration). Every field that's
conceptually an enum is a plain `String` with an
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
render pickers for them). These could become native Postgres enums if desired; nothing in the
application logic depends on them being strings specifically.

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
`prisma migrate` — appropriate for a fast-moving pre-production build where the schema is still
settling. Before relying on this in a real production environment with data worth protecting,
switch to `prisma migrate` with a real, committed migration history (`prisma migrate dev` locally
to generate migrations, `prisma migrate deploy` in the deploy pipeline) so schema changes are
reviewable and reversible rather than a silent sync.

**Confirmed failure mode:** `db push --accept-data-loss` makes the database match *exactly* the
schema of whatever commit is currently building — including dropping columns that commit doesn't
know about. Pushing several commits to the branch in quick succession queues multiple Vercel
builds against the *same* shared database; if an older build's `db push` step finishes after a
newer build's, it silently drops whatever the newer build added; the older build still reports
success, so nothing in the deploy log flags it. This has actually happened (a newly-added
`Company.status` column vanished this way, surfacing as a runtime `P2022` "column does not
exist" error on a page that had deployed fine minutes earlier). Until this moves to `prisma
migrate`, avoid pushing multiple commits with schema changes back to back — let one finish
deploying before pushing the next.
