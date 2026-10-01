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

## Enquiry form — destinations
`POST /api/hmg/enquiry` validates (zod; Kenyan and international phone numbers), rate-limits per IP, and checks a honeypot and minimum fill time. It delivers to every configured destination and succeeds if at least one accepts:
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
