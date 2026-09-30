# HMG Group Africa site (`/hmg`)

A standalone corporate site for HMG Group Africa living in its own route group so it never shares chrome, fonts or CSS with the Techfind marketing site or the OS.

- Routes: `src/app/(hmg)/hmg/*` → `/hmg`, `/hmg/insights/[slug]`, `/hmg/privacy`, `/hmg/sitemap.xml`, OG image.
- Root layout + tokens: `src/app/(hmg)/layout.tsx`, `src/app/(hmg)/hmg.css` (brand palette, Fraunces + Figtree).
- Components: `src/components/hmg/*` (illustrations are hand-built SVG; `Motion.tsx` is the only scroll/animation controller, no animation library).
- Content and contact details: `src/lib/hmg/content.ts`, `src/lib/hmg/site.ts` (change `HMG_BASE` and move the route folder to serve from a domain root).
- Enquiry form → `POST /api/hmg/enquiry` (zod-validated, rate-limited, honeypot). Set `HMG_ENQUIRY_WEBHOOK` to forward leads to a CRM/Zapier/Make URL; without it submissions are logged only.
- `NEXT_PUBLIC_HMG_URL` sets the canonical origin used in metadata, sitemap and JSON-LD.
- `src/app/robots.ts` is deployment-wide: it blocks `/app`, `/admin`, `/api`, `/login`, `/pay` and points to the HMG sitemap.
- Decision-insight figures are fictional and labelled "Illustrative"; LinkedIn/Facebook URLs in `site.ts` should be confirmed.

## Motion and interaction layer
- `InsightLab.tsx`: six interactive illustrative widgets (compliance status, cash-flow trend with scenario + week slider, obligations timeline, tax-readiness checklist, health overview, concern-driven attention panel). Everything works without animation; values snap under reduced motion.
- `Motion.tsx`: reveals, counters, scroll-linked process path, magnetic buttons, scroll-progress hairline, and `[data-loop]` which pauses looping animations when off-screen. `HeroArt.tsx` cycles its live signal chip only while on screen and the tab is visible.
- `FloatActions.tsx`: WhatsApp button (desktop) / contextual action bar (phones); hides over the contact section and the open menu.
- `useActiveSection.ts`: drives the active nav item. `(hmg)/template.tsx`: page-enter transition.
