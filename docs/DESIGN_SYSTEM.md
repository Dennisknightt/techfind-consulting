# Design System

This app is the Techfind Revenue OS only — the public marketing site (formerly the `(marketing)`
route group: the GSAP/Lenis motion landing pages, the AI-service pages, the audit funnel) has
been removed. `src/app/(os)` is now the entire app, so `/` redirects straight to `/login`
(`src/app/(os)/page.tsx`). Tokens live in `src/app/(os)/globals.css`, a dense, premium SaaS
interior (closer to Linear/Stripe/Attio), fuchsia/indigo accent.

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

## The Revenue Engine admin portal, and its compatibility token aliases

`/admin` (the SUPER_ADMIN-only "Revenue Engine" panel — prospect discovery/audit, lead scoring,
outreach, proposals, CRM pipeline, communications, calendar booking, settings) used to live in
the marketing route group and read the *marketing* site's tokens, which was a real mismatch for
what's functionally a dense internal data tool. Now that the marketing site is gone, it's been
ported into `src/app/(os)/admin/*` unchanged, restyled onto the OS's own tokens rather than
rewritten. Its ~2,600 lines of JSX use a handful of token names the marketing site had that the
OS didn't (`--card`, `--card-hover`, `--muted`, `--border-accent`, `--accent-glow`) — rather than
rewrite every reference, `globals.css` defines these as aliases onto the canonical OS tokens
(`--surface`, `--surface-hover`, `--text-muted`, `--accent-soft` twice) in both `:root` and
`.dark`. The admin portal now genuinely reads the OS's fuchsia/indigo accent instead of the old
marketing palette — no new component should introduce fresh usage of the alias names; use the
canonical ones above instead.

## Sign-in screen

`/login` is a split screen: a dark brand panel (`src/components/os/auth/AuthBrandPanel.tsx` —
always `#0D0B15`, drifting fuchsia/indigo aurora, a faux "this month" pipeline card) beside the
form (`src/components/os/auth/LoginForm.tsx`). The panel is pure server markup + the `auth-*`
keyframes in `globals.css` — no Framer on this route, so it ships the smallest JS of any page.
Below `lg` the panel is hidden and a compact wordmark sits above the form. Form field ids/names
(`email`, `password`, `remember`, `next`) and the `primeSonicLogo()` submit hook are unchanged
from the previous design. Direction came from the theme-factory skill's "Midnight Galaxy"
preset (deep purple base, lavender/silver highlights), remapped onto the OS's own accent tokens.

## What's deliberately *not* here

No Storybook, no component playground, no visual regression tooling — components are verified
in-context (Playwright screenshots against real seeded/live data during each phase) rather than
in isolation, matching the product's "no vanity, only real" philosophy applied to the build
process itself.
