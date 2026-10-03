# HMG Group Africa site (`/hmg`)

A multi-page corporate site in its own route group (`src/app/(hmg)`), separate from the Techfind marketing site and the OS.

## Routes
| Route | Notes |
|---|---|
| `/hmg` | Home: hero, outcomes, services preview, clarity demo (tabs), why HMG, verified facts, process, 3 featured insights, CTA + callback form |
| `/hmg/about` | Story, mission, philosophy, process, team (data-driven), who we serve, Nairobi office, relationships |
| `/hmg/services` | Guided service selector + all services |
| `/hmg/services/[slug]` | 6 static pages: problems, what HMG handles, outcomes, process, FAQs (+ FAQPage schema), related insights |
| `/hmg/insights`, `/hmg/insights/[slug]` | Filterable library; articles with date, author, share, related, disclaimer, Article + Breadcrumb schema |
| `/hmg/contact` | Contact ways, map link, full callback form |
| `/hmg/privacy` | Privacy notice |
| `/hmg/sitemap.xml`, `/robots.txt`, `/hmg/og.png` | SEO + social image |

## Where things live
- Content: `src/lib/hmg/content.ts` (services, articles, process, outcomes) · contact/routes: `src/lib/hmg/site.ts` · per-page metadata: `src/lib/hmg/meta.ts`
- Credibility content and placeholders: `src/lib/hmg/credentials.ts`
- Components: `src/components/hmg/*` · styles: `src/app/(hmg)/hmg.css`

## Motion rules
Content never depends on JavaScript or IntersectionObserver to be visible. The only entrance is one CSS group animation (320 ms, never below 35% opacity), enabled by a `js` class set inline in `<head>`. Without JS, or with reduced motion, everything renders static. There is no route-level fade. Looping decoration pauses off-screen.

## Ink motion language
- Hero: "Confident growth." (`TypeInk.tsx`) is typed behind a pen caret while ink rises into outlined letters; an ink underline follows and the illustration's growth line draws in step. Screen readers get one sr-only copy of the headline.
- Inner page titles ink in on arrival; section headings ink in, eyebrow rules draw and cards rise as they scroll into view (CSS scroll-driven animations — no JS, tied to scroll position, never below 35% opacity).
- Primary buttons fill with ink on hover.
- All of it is disabled without JS (`.js` class), under prefers-reduced-motion, and in browsers without scroll-timeline support.

## Looping motion (Before HMG → After HMG)
- Home hero (`HeroArt.tsx`): a 10 s loop. A jagged amber cash line, flagged ledger rows, short bars and "Before HMG · 3 items flagged" turn into the rising teal line, rows ticked in sequence, grown bars and "After HMG · books reconciled".
- Problem section (`ProblemStatement.tsx`): a Before/After HMG panel cycles tax status, books, cash and next step. Screen readers get both states as text. Marked illustrative.
- Every inner page hero and CTA band: a travelling data point along the hairline (`Pulse` in `ui.tsx`).
- Service hero art: stamp pulse, rows shimmer, line or ring redraws. Clarity demo: the week-7 marker breathes. Why HMG: the sun drifts. Contact: a soft halo on Start.
- Rules:
  - A loop runs only while on screen (`[data-loop]` → `.is-live` via `Motion.tsx`; the hero has its own observer).
  - Loops use transform and opacity only.
  - With no JS, reduced motion or paused, the static "after" state shows.
- "Pause animations" (`MotionToggle.tsx`) sits in the hero corner and the footer. It sets `html.motion-paused`, which is remembered in localStorage (`hmg-motion`). Hovering or focusing the Before/After panel holds it.

## Brand
- Logo: HMG's supplied logo, cleaned to transparent PNGs in `public/hmg/brand/` — `hmg-logo.png` (navy/slate, for light backgrounds), `hmg-logo-white.png` (for navy), `hmg-mark.png`, favicons and apple-touch icon. The tagline in the supplied file reads "ADVSORY" (typo), so the site uses the mark + wordmark without it; request a corrected master/SVG from HMG.
- Colours sampled from the logo: navy `#0A2A47` (primary, buttons, headings) and slate `#5A6066` (secondary text, labels, "Confident growth."). Teal/mint remain only inside illustrations and financial charts as a data accent.

## Homepage flow
Hero → navy problem statement → verified trust → interactive service selector (multi-select situations → recommended services) → services showcase (two featured + compact rows) → financial-clarity demo (Cash flow / Tax / Payroll / Compliance) → case studies* → team preview* → Why HMG → featured insights (one lead + two) → consultation CTA.
*Rendered only when HMG supplies approved content in `credentials.ts` (`CASE_STUDIES`, `OPTIONAL.team`).

## Contact qualification flow
`EnquiryFlow.tsx`: opening screen → needs (multi) → client type → situation (multi, "Something else" reveals text) → urgency → contact channels → details → review (with edit links) → "Request My Consultation". Step changes are announced and focus moves to each step heading; answers persist when going back. `?need=<service-slug>` preselects a service. Success (only after server confirmation) shows reference number, services, contact preference, hours and a WhatsApp action.

## Enquiry form — destinations
`POST /api/hmg/enquiry` validates (zod), rate-limits per IP, checks a honeypot and minimum fill time, and builds a structured CRM lead: reference number, services, primary service, assigned team (KRA notices/urgent issues route to Tax & KRA), client type, situation, urgency, `urgent` flag + `priority`, follow-up `dueBy` (business days in EAT by urgency; urgent = within hours), follow-up task text and a notify block. It delivers to every configured destination and succeeds if at least one accepts:
- `HMG_ENQUIRY_WEBHOOK` — JSON POST to HMG's CRM inbound webhook or Zapier/Make/n8n
- `RESEND_API_KEY` + `HMG_ENQUIRY_TO` (comma-separated; optional `HMG_ENQUIRY_FROM`) — email via Resend

With neither set, it returns 503 and the form says nothing was sent, keeps the visitor's answers, and offers WhatsApp/phone. Success is shown only after the server confirms delivery. Enquiry contents are never logged or put in URLs.

## Analytics
`Analytics.tsx` pushes only `consultation_request`, `form_submit_success`, `whatsapp_click`, `phone_click` and `email_click` (with the page path, no personal data) to `window.dataLayer`. Add a GTM/GA4 tag to consume them; nothing is sent without one.

## Environment
- `NEXT_PUBLIC_HMG_URL` — canonical origin (defaults to the Vercel host; `hmggroup.africa` currently redirects to an unrelated site).
- Enquiry destinations above.

## Content HMG must supply (hidden until provided — never invented)
All in `src/lib/hmg/credentials.ts`:
- `OPTIONAL.team` — real photo, full name, role, short profile, verified qualification, LinkedIn URL. The About team section is hidden while empty.
- `OPTIONAL.registrations`, `affiliations`, `combinedExperience`, `industries`, `geographicReach`, `numbers`, `testimonials` (with written permission).
- `AUTHORISATIONS.licensedAuditPractice` — set only if HMG holds an ICPAK practising licence; switches audit copy from "statutory audit support / management assurance reviews" to "statutory audits / assurance engagements".
- `AUTHORISATIONS.licensedTaxAgent` — set only if HMG is a KRA-licensed tax agent; switches dispute copy to "objections and representation".
- Official Facebook URL (`SITE.social.facebook` in `site.ts`).
