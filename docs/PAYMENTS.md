# Payments

## Provider abstraction

`src/server/payments/provider.ts` defines the `PaymentProvider` interface every gateway
implements: `createCharge`, `checkStatus`, `refund`. The application never talks to a specific
gateway's SDK outside its provider implementation — nothing about IntaSend leaks into the
checkout UI, the reconciliation logic, or the Revenue Control Centre. This means adding a
second real provider (Pesapal, Flutterwave, Stripe, whatever comes next) is a new file
implementing the same interface plus a registry entry, not a rewrite.

Two implementations exist today:

- **`mockProvider.ts`** — the default everywhere except production. No external calls. Simulates
  the full lifecycle deterministically: `createCharge` returns `PENDING`, and `checkStatus`
  flips it to `SUCCESSFUL` once 2.5 seconds have passed. This makes the entire commercial chain
  (proforma → checkout → poll → reconciled → receipt → project) genuinely clickable and testable
  with zero external credentials.
- **`intasendProvider.ts`** — the real integration, via the `intasend-node` SDK. Supports M-Pesa
  STK push and card charges. IntaSend's API responses are untyped; field extraction is
  defensive (`pick()` over a list of possible key paths) and status mapping never guesses a
  success — anything not explicitly recognized as a success/failure/cancellation state maps to
  `PENDING`, never `SUCCESSFUL`.

## The dev-safety guard

`src/server/payments/registry.ts#getActiveProvider` resolves which provider is actually used:

```
configured = Setting["payment_provider"].active   (defaults to, and is currently, "MOCK";
                                                     can be set to "INTASEND")
isProd     = NODE_ENV === "production"
override   = ALLOW_LIVE_PAYMENTS_IN_DEV === "true"

resolved = (configured !== "MOCK" && !isProd && !override) ? "MOCK" : configured
```

In plain terms: **a non-mock provider only ever actually runs in production**, or if someone
has explicitly set `ALLOW_LIVE_PAYMENTS_IN_DEV=true` in the environment. This exists specifically
so that development and automated testing — including an AI agent clicking through the checkout
flow — can never trigger a real charge, no matter what the configured provider setting says.
The Settings → Payment Provider screen surfaces `devSafetyOverride` explicitly so a human can
see when this guard is active, and the public checkout page shows an honest "Test environment —
simulating provider response" notice under the same condition.

**Before ever enabling `ALLOW_LIVE_PAYMENTS_IN_DEV`, or deploying with `NODE_ENV=production`
and a real provider configured, confirm real credentials are what's actually wanted for that
run.** There is no other gate.

## Reconciliation — the trust boundary

`src/server/payments/reconcile.ts#confirmPayment` is the **only** place a `Payment` is ever
marked `SUCCESSFUL`. It is called from two paths — the customer's status-polling request
(`/api/os/pay/[token]/status`) and the gateway's webhook — and both paths do the same thing:
they re-check the payment's status **directly against the provider's own `checkStatus` call**.
Neither path trusts:

- a client-supplied amount or status (the charge amount is always read server-side from
  `PaymentSession.amountDue`, never from the request body — see
  `/api/os/pay/[token]/charge/route.ts`),
- the webhook payload's claimed status (it's used only to identify *which* payment to
  re-verify, never to directly credit it — see `/api/webhooks/payments/intasend/route.ts`).

`confirmPayment` is idempotent (`if (payment.status === "SUCCESSFUL") return payment` at the
top), so it's safe to call it repeatedly from both paths without double-crediting a document.

On a real success, `applySuccessfulPayment` runs once: increments the document's paid amount,
recomputes balance/status, advances the linked deal to `WON` if the deposit is now met (without
ever regressing an already-`WON` deal), triggers the sales→project handoff
(`docs/CRM_RULES.md`), issues a `Receipt`, and notifies the document owner.

## Public payment endpoints

`/api/os/pay/[token]/charge` and `/api/os/pay/[token]/status` are the only unauthenticated
endpoints in the app besides the webhook. Both are rate-limited (`src/lib/ratelimit.ts` +
`hashIp`) and scoped strictly to the `PaymentSession` identified by the URL token — a token
never exposes another session's payments.

## Receipts and the Revenue Control Centre

Every successful payment gets exactly one `Receipt` (PDF via
`src/server/documents/pdf/ReceiptPdf.tsx`), numbered atomically
(`src/server/documents/numbering.ts#nextReceiptNumber`). `/app/revenue` reads directly from
`Payment`/`SalesDocument` — received today/all-time, expected (outstanding balances on sent
proformas), overdue, and recurring revenue from `ProductFootprint.mrr` — no separate
denormalized "revenue" table to keep in sync.
