# Architecture

Techfind Revenue OS is a Next.js 15 App Router application: one codebase serving both the
public marketing site and the internal CRM/revenue operating system ("the OS").

## Route groups

The app root splits into two independent route groups, each with its own root layout:

- `src/app/(marketing)/*` — the public site (Navbar, Footer, Lenis smooth-scroll, custom
  cursor). URLs are unaffected by the group (`(marketing)` doesn't appear in the path).
- `src/app/(os)/*` — the OS, mounted at `/login` and `/app/*`. Its own root layout renders a
  fixed sidebar (desktop) / bottom nav (mobile) shell instead of the marketing chrome — the two
  layouts would otherwise fight over scroll and cursor behavior, which is why they're split
  rather than conditionally rendered from one layout.

Within `(os)`, `src/app/(os)/app/*` is the authenticated app; `src/app/(os)/login` and
`src/app/(os)/pay/[token]` are the two entry points that don't require a session — the former
because you don't have one yet, the latter because it's the customer-facing checkout link sent
in a proforma/invoice, not a staff surface.

## Layers

- **`src/app/**/page.tsx`** — Server Components. Fetch data with Prisma directly, enforce auth
  via `requireUser()`, pass plain data down to a client component.
- **`src/components/os/**`** — Client Components (`"use client"`). Own local UI state, call
  Server Actions for every mutation, never talk to the database directly.
- **`src/server/actions/*.ts`** — `"use server"` files. The only place mutations happen. Every
  action re-checks auth (`requireUserOrThrow` / `requirePermission`) — a component never
  proves the user is allowed to do something, the action does. See `docs/CRM_RULES.md` for
  the permission matrix.
- **`src/server/*`** (non-`actions`) — plain server-only modules: `db.ts` (the Prisma
  singleton), `auth/`, `payments/`, `documents/`, `projects/`, `intelligence/`, `audit.ts`.
  Marked `import "server-only"` so an accidental client import fails at build time rather than
  leaking server code into the bundle.
- **`src/lib/os/*`** — plain, framework-agnostic modules importable from *both* server and
  client code (pipeline/project stage constants, money formatting, date helpers, the tax/
  deposit math). Deliberately has no `"server-only"` guard and no async functions mixed with
  constant exports — see the "Server/Client Action Export Rule" below, which is why this
  split exists in the first place.
- **`src/app/api/**/route.ts`** — the only two categories of route handler in this app: the
  public payment surface (`/api/os/pay/[token]/{charge,status}`, rate-limited, never trusts a
  client-supplied amount) and the IntaSend webhook receiver. Everything else is a Server
  Action, not a REST endpoint.

## A hard constraint that shaped several files

A `"use server"` file may only export **async functions** across the server/client boundary —
a plain constant or object export from such a file silently breaks (imports as `undefined`) the
moment a Client Component imports it, with no build-time error. This is why pipeline stages
(`src/lib/os/pipeline.ts`), project stages (`src/lib/os/projects.ts`) and document math
(`src/lib/os/documentMath.ts`) live in plain modules rather than alongside the Server Actions
that use the same constants — they need to be importable from both sides of that boundary.

## Request flow for a mutation (the shape every Server Action follows)

1. Client component calls the action with plain, already-validated-on-the-client data (client
   validation is UX, never trust).
2. Action re-authenticates (`requireUserOrThrow`) and re-authorizes (`requirePermission` where
   the action is sensitive).
3. Action re-reads whatever it needs from the database — it never trusts a value the client
   claims about server-owned state (an amount, a balance, another user's id) unless that value
   is itself just being *set* by an authorized actor.
4. Action writes, then calls `writeAudit(...)` for anything worth an audit trail (see
   `docs/SECURITY.md`).
5. Action calls `revalidatePath(...)` for every path whose cached data the write just changed.

## Payments and the sales → delivery pipeline

See `docs/PAYMENTS.md` for the gateway abstraction and reconciliation model, and
`docs/CRM_RULES.md` for how a paid deposit triggers `src/server/projects/handoff.ts` to spin
up a `Project`, carrying the deal/document/company context forward without re-entry.

## PWA

`public/os-manifest.webmanifest` + `public/os-sw.js`, a service worker registered with scope
`/app` only (never the marketing site, `/login`, or the public `/pay/[token]` checkout).
Navigations are network-first with an offline fallback shell (`public/os-offline.html`); only
a handful of static, non-sensitive assets (icons, the manifest, the offline shell) are
cache-first. No API route, Server Action, or page response body is ever written to a Cache —
CRM records, balances, and payment state must always be fresh, and nothing financial or
customer-identifying should persist in the cache. See `docs/SECURITY.md`.
