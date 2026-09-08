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

The build still runs `prisma db push` rather than `prisma migrate deploy` — appropriate for a
fast-moving pre-production build where the schema is still settling, but `vercel-build` no longer
passes `--accept-data-loss`: a schema change that would drop a column or table now fails the
build loudly instead of applying it silently. That's a stopgap, not the fix — before this holds
data worth protecting, finish the switch to a real migration history:

1. A baseline migration already exists at `prisma/migrations/20260908000000_init`, generated with
   `prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` against
   the schema as of that date — it was never applied anywhere, only diffed, so generating it
   touched no database.
2. Because every environment's tables already exist (created via `db push`), that migration has
   to be marked as already applied rather than run — once, against each existing database
   (production, and any preview/dev databases worth keeping in sync):
   `DATABASE_URL=<target> npx prisma migrate resolve --applied 20260908000000_init`
3. Only after that baseline step succeeds everywhere, switch `vercel-build` in `package.json` to
   `prisma migrate deploy && prisma db seed && next build`. Doing this before baselining will
   break the next deploy — `migrate deploy` will try to `CREATE TABLE` on tables that already
   exist.
4. From then on, schema changes go through `prisma migrate dev --name <change>` locally (commits
   a reviewable SQL file under `prisma/migrations/`) instead of editing `schema.prisma` and
   letting `db push` sync it live.
