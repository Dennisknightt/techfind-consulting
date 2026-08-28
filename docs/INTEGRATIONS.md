# Integrations

What's real today, what's stubbed, and how to connect the rest — without redesigning anything,
per the product's own build constraint: every integration point is a real interface with a
working mock behind it, not a TODO.

## Payments — IntaSend (real, live-capable)

`src/server/payments/intasendProvider.ts`, via the `intasend-node` SDK. Supports M-Pesa STK
push and card charges today. Configured via `INTASEND_SECRET_KEY` and
`NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY` in `.env`. See `docs/PAYMENTS.md` for the abstraction
that makes this swappable, and the dev-safety guard that keeps it from ever firing outside
production without an explicit opt-in.

Adding a second real gateway (Pesapal, Flutterwave, a card processor) means: implement
`PaymentProvider` (`src/server/payments/provider.ts`) in a new file, register it in
`src/server/payments/registry.ts`, add its name to the Settings → Payment Provider picker. Not
a rewrite of checkout, reconciliation, receipts, or the Revenue Control Centre — none of that
code knows which gateway is active.

## WhatsApp — communications channel, not yet API-connected

Communications logging (`src/server/actions/communications.ts`) supports a `WHATSAPP` channel
today, and outbound "quick replies" use `wa.me` deep links (opens the user's own WhatsApp with
a pre-filled message) — genuinely functional, no credentials needed, matches how a small team
actually uses WhatsApp day to day. What's not connected yet: the WhatsApp Cloud API, so inbound
messages aren't captured automatically and outbound sends aren't sent *from* the app itself.
`WHATSAPP_CLOUD_API_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` are reserved in `.env.example`. Wiring
this up would mean: a webhook receiver (mirroring the payment webhook's pattern — verify, then
call into the existing `logCommunicationAction` data shape) plus a send call from the compose
box already in `CommunicationsHub.tsx`.

## M-Pesa direct (Daraja) — not needed; covered via IntaSend

M-Pesa STK push already works end-to-end through IntaSend rather than a direct Safaricom Daraja
integration — one less credential set to manage. `MPESA_*` variables are reserved in
`.env.example` only for a future scenario where going direct to Daraja (better rates at scale,
no intermediary) becomes worth the added integration surface.

## Email — reserved, not built

`EMAIL_SMTP_URL` reserved for transactional email (proforma/invoice/receipt delivery, meeting
confirmations). Today, documents are shared via their PDF download link and WhatsApp, which
covers the primary Kenyan SMB workflow this product targets; email is a natural next channel
once volume asks for it, following the same "log as a Communication" pattern as WhatsApp.

## Calendar — reserved, not built

`GOOGLE_CALENDAR_CLIENT_ID`/`SECRET` reserved for two-way sync of `Meeting` records with a real
calendar. Meetings are fully modeled and schedulable in-app today (`src/server/actions/
meetings.ts`); what's missing is the sync, not the data model.

## "Prepare with Claude" — no API call, by design

`src/server/intelligence/briefing.ts` assembles a real markdown snapshot of the business
(pipeline, revenue, projects, attention items, opportunities) entirely from Techfind's own
data — no `ANTHROPIC_API_KEY` required, because the export itself, ready to paste into any
Claude conversation, is the deliverable. `ANTHROPIC_API_KEY` is reserved in `.env.example` for
a future in-app version that calls the API directly (e.g. to generate the interpretation
rather than just the data), which is additive to, not a replacement for, the current export.

## What every stub above has in common

Each one already has: a real data model, a real UI surface exercising that data (not a mockup),
and a genuinely working fallback that needs no external credentials — WhatsApp via `wa.me`
links, payments via the MOCK provider, meetings without calendar sync, documents without email.
Connecting the real service is additive wiring behind an existing interface, never a redesign.
