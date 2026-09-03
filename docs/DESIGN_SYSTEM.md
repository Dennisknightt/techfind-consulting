# Design System

Full visual overhaul (see IMPLEMENTATION note below): the OS moved off the public site's
violet/blue onto its own fuchsia/indigo identity — the two apps no longer share a brand palette,
each keeps its own token set in its own route group. The OS remains a dense, premium SaaS
interior (closer to Linear/Stripe/Attio) rather than the marketing site's motion-heavy
landing-page feel. Tokens live in
`src/app/(os)/globals.css`, scoped to the `(os)` route group only.

## Tokens

All color, radius, and shadow values are CSS custom properties on `:root` (light) and `.dark`
(dark mode), never hardcoded hex in components — every OS component reads `var(--...)` so a
token change propagates everywhere and dark mode is "free."

- **Surfaces**: `--bg`, `--surface`, `--surface-hover`, `--surface-sunken` — a 4-step elevation
  scale used instead of ad-hoc opacity/shadow combinations.
- **Text**: `--text`, `--text-muted`, `--text-faint` — three weights of emphasis, no fourth.
- **Brand**: `--accent` (fuchsia) / `--accent-2` (indigo), each with a `-soft` background tint
  variant for badges/highlights rather than a full-saturation fill — chosen to be visually
  distinct from every semantic color (success/warning/danger/info) and from the hot/warm/cold
  lead-temperature scale, so no token collides with another in meaning.
- **Semantic**: `--success`, `--warning`, `--danger`, `--info`, each with a `-soft` variant —
  used for document status, payment status, and the Home "Needs Attention" severity coloring.
- **Domain-specific**: `--hot` / `--warm` / `--cold` for lead/deal temperature — a dedicated
  scale rather than overloading the semantic colors, since "hot" isn't "danger."
- **Radius**: `--radius-sm` (0.375rem) through `--radius-xl` (1.125rem) — never an arbitrary
  Tailwind radius class in an OS component.
- **Shadow**: `--shadow-xs` through `--shadow-lg`, plus `--shadow-glow` for the accent-colored
  glow used sparingly (primary CTAs, the command palette).

## Type

`font-space` (Space Grotesk — headings, stat numbers, anything that should feel like a number
you'd want to read at a glance) and the default sans stack for body/UI text. Money and counts
consistently use `font-space` so scanning a dense page (Home, Revenue, Intelligence) for the
big numbers is fast.

## Component layer

`src/components/os/ui/*` — a small owned set (Button, Input, Select, Dialog, Sheet, Tabs,
Badge, Avatar, DropdownMenu, Switch, Skeleton, Separator, Card), built on Radix primitives for
behavior/accessibility with all visual styling coming from the token set above. Not a generic
design-system package — every primitive here exists because an OS screen needed it, and each
carries only the variants actually used (see `Button`'s `variant`/`size` unions).

## Patterns used consistently across list pages

Every list surface (Leads, Deals, Clients, Projects) follows the same shape: a `PageHeader`
(title + subtitle + primary action), a search input + filter chip row directly beneath it, an
empty state with a centered icon + one-line explanation of *why* it's empty and what fills it,
and cards/rows using `--surface` + a 1px `--border` rather than heavier card shadows — shadow is
reserved for hover/elevation feedback, not resting state.

## Dark mode

Every token is redefined under `.dark` with adjusted contrast (not just inverted lightness) —
in particular `--accent` shifts to a brighter fuchsia (`#E879F9` vs light mode's `#C026D3`)
because the light-mode accent reads as muddy on a dark surface at the same saturation. `-soft`
variants get higher opacity in dark mode for the same reason. In practice this is currently
unreachable in the running app — `(os)/layout.tsx` sets `defaultTheme="light"` with
`enableSystem={false}` and there's no in-app toggle — kept ready for one, not wasted work.

## Known inconsistency: the Revenue Engine admin portal

`(marketing)/admin/*` (the SUPER_ADMIN-only "Revenue Engine" panel) physically lives in the
`(marketing)` route group and so reads the *marketing* site's tokens, not the OS's — it's
functionally a dense internal data tool, not a brand/landing page, so this is a real mismatch.
Not fixed in the OS's own redesign pass since it can't reach OS tokens without importing across
route groups; addressed instead in the marketing site's own redesign (below) by picking a
restrained accent pairing rather than leaning into the landing page's full brand treatment. The
underlying architectural mismatch (two token systems, one route group) is unchanged — only the
values on both sides are now closer in weight.

## Marketing site (`(marketing)` route group)

Tokens live in `src/app/(marketing)/globals.css`, entirely separate from the OS's — the two apps
share zero brand color by design (see the OS overhaul note above). Palette: `--accent` emerald
(`#059669` light / `#10B981` dark), `--accent-2` amber (`#D97706` light / `#F59E0B` dark),
`--highlight` sky (`#0EA5E9` light / `#38BDF8` dark) — distinct from both the OS's fuchsia/indigo
and every techfind-saas-core vertical accent, and picked to still read calmly on the dense
Revenue Engine admin tables rather than only working for the landing page's hero treatment.

Unlike the OS and saas-core (both light-locked), this app has a real, user-facing dark mode
toggle (`ThemeProvider` in `src/components/layout/ThemeProvider.tsx`, `defaultTheme="dark"`,
`enableSystem`) — dark is actually the *default* experience here, so both palettes were verified
in-browser, not just the light one.

The motion architecture (Lenis smooth scroll, the custom `cursor:none` ring/dot cursor, GSAP-
style scroll reveals, ambient orbs, the animated gradient border, marquee, particle streams) is
unchanged — every animated utility class in `globals.css` reads its color from the token set
above (`var(--accent)`, `var(--accent-2)`, `var(--highlight)`), so the redesign is a token swap
that cascades through the existing effects rather than a rebuild of them. `Navbar`, `Footer`, and
the shared motion widgets (`AnimatedCounter`, `MagneticButton`, `TextReveal`, `GradientOrb`) were
already fully token-driven and needed no direct edits — `GradientOrb`'s hardcoded Tailwind
classes were the one exception, updated to match. Hardcoded hex elsewhere in `src/components/home/`
(testimonial/case-study avatar gradients, the world-map node colors, real third-party AI-platform
brand colors in `AiPlatformLogo`) is deliberate per-item variety or genuine external branding, not
this site's identity, and was left alone — same convention as `channels.ts` in the OS.

## What's deliberately *not* here

No Storybook, no component playground, no visual regression tooling — components are verified
in-context (Playwright screenshots against real seeded/live data during each phase) rather than
in isolation, matching the product's "no vanity, only real" philosophy applied to the build
process itself.
