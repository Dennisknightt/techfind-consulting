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
Content is visible by default. `Motion.tsx` marks only below-the-fold `[data-reveal]` elements as pending (`.rv`), reveals them before they reach the screen, and shows anything reached by a fast jump almost instantly. With JS disabled or reduced motion, nothing is hidden. Looping animations pause off-screen.

## Enquiry form — integration point
`POST /api/hmg/enquiry` validates (zod), rate-limits, and checks a honeypot and minimum fill time. Set **`HMG_ENQUIRY_WEBHOOK`** (Zapier/Make/n8n/CRM JSON webhook) to deliver leads. Without it the endpoint returns 503 and the form says so, offering WhatsApp (pre-filled with the visitor's details) and phone. It never shows a false success.

## Environment
- `NEXT_PUBLIC_HMG_URL` — canonical origin (defaults to the Vercel host; `hmggroup.africa` currently redirects to an unrelated site).
- `HMG_ENQUIRY_WEBHOOK` — lead delivery.
- `NEXT_PUBLIC_HMG_SHOW_PLACEHOLDERS=1` — preview empty credibility slots while editing.

## Content HMG must supply (not invented)
- Team: names, roles, profiles, qualifications, photos (`public/hmg/team/`), LinkedIn links
- Professional registrations (e.g. ICPAK, KRA tax agent) and qualifications
- Whether HMG holds the licence to sign statutory audits (`PENDING.signsStatutoryAudits`) — audit copy changes automatically
- Industries served, client testimonials with written permission
- Official Facebook URL (`SITE.social.facebook`; hidden until set)
