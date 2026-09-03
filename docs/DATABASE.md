# Database

`prisma/schema.prisma`. **PostgreSQL** — required in any deployed environment, since Vercel's
serverless functions have no persistent local disk and cannot serve a file-based SQLite
database. Local development can point `DATABASE_URL` at either a local Postgres instance or the
same hosted database used elsewhere; the schema itself was written from the start to avoid
SQLite-only features, so the switch from the SQLite-based earlier local dev setup was a
one-line provider change with no field-level migration needed.

## Migrations

Schema changes are real, reviewable Prisma migrations under `prisma/migrations/` — not
`prisma db push`. The history starts at `20260901051741_init`, a baseline generated with
`prisma migrate dev --name init` against an empty database and diffed against the schema as it
stood after Phase 10; every schema change from here on is its own migration, committed alongside
the code that needs it.

- **Local dev**: `npm run db:migrate` (`prisma migrate dev`) after changing `schema.prisma` —
  generates and applies a new migration, prompting for a name.
- **Deploying** (also what `vercel-build` runs): `npm run db:deploy` (`prisma migrate deploy`)
  — applies any migrations not yet recorded in `_prisma_migrations`, no prompts, safe to run on
  every deploy.
- **Full reset** (dev only — drops the database): `npm run db:reset` (`prisma migrate reset`),
  which reapplies every migration from scratch and then runs the seed script automatically.
- `npm run db:seed` runs the seed script standalone against whatever migrations are already
  applied.

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

Every currency amount is a Prisma `Decimal` stored as Postgres `numeric(12,2)` — exact, no
binary floating-point drift. That exactness lives only in the database column, though: the rest
of the app is written against plain `number` (`formatKES`, `round2`, arithmetic, and Client
Component props, which can't receive a `Prisma.Decimal` instance anyway since it isn't a plain
serializable value). `src/server/db.ts` bridges the two with a Prisma Client Extension — a
`result` transform on every money field, on the single shared `db` export — that calls
`.toNumber()` on the way out of every query, so nowhere else in the codebase ever sees a
`Decimal` object. Writes are unaffected: Prisma already accepts a plain `number` for a `Decimal`
column on `create`/`update`.

Two things to know if you touch a money field:

- **Aggregates bypass the extension.** `db.payment.aggregate({ _sum: { amount: true } })` still
  returns a real `Prisma.Decimal` for `_sum.amount` (confirmed at runtime, not just inferred) —
  Prisma's `result` extensions only transform normal query results, not `aggregate`/`groupBy`
  output. Every aggregate call site in the codebase wraps the sum in `Number(...)` explicitly
  (`src/app/(os)/app/page.tsx`, `src/app/(os)/app/revenue/page.tsx`,
  `src/server/intelligence/snapshot.ts`) — do the same for any new one.
- **Raw `@prisma/client` model types still say `Decimal`.** They're generated from the schema,
  not from the extended client, so a composite prop type built directly from e.g. `import type
  { Deal } from "@prisma/client"` would claim `value: Decimal` even though it's really a
  `number` at runtime. `src/lib/os/moneyTypes.ts` exports the corrected aliases
  (`DealMoney`, `PaymentMoney`, `SalesDocumentMoney`, etc.) — use those instead of the raw model
  type anywhere a money field is part of a prop type, action signature, or local composite type.

`src/lib/os/money.ts#round2` still rounds to 2dp at every JS-side computation boundary
(`documentMath.ts`, payment reconciliation) — that safety net didn't go away, it's just now
backed by exact storage on write instead of `float8`.

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
