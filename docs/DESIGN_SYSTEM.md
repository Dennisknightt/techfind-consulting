# Design System

The OS shares the public site's brand identity (violet/blue, the same type stack) but is its
own visual system underneath — a dense, premium SaaS interior (closer to Linear/Stripe/Attio)
rather than the marketing site's motion-heavy landing-page feel. Tokens live in
`src/app/(os)/globals.css`, scoped to the `(os)` route group only.

## Tokens

All color, radius, and shadow values are CSS custom properties on `:root` (light) and `.dark`
(dark mode), never hardcoded hex in components — every OS component reads `var(--...)` so a
token change propagates everywhere and dark mode is "free."

- **Surfaces**: `--bg`, `--surface`, `--surface-hover`, `--surface-sunken` — a 4-step elevation
  scale used instead of ad-hoc opacity/shadow combinations.
- **Text**: `--text`, `--text-muted`, `--text-faint` — three weights of emphasis, no fourth.
- **Brand**: `--accent` (violet) / `--accent-2` (blue), each with a `-soft` background tint
  variant for badges/highlights rather than a full-saturation fill.
- **Semantic**: `--success`, `--warning`, `--danger`, `--info`, each with a `-soft` variant —
  used for document status, payment status, and the Home "Needs Attention" severity coloring.
- **Domain-specific**: `--hot` / `--warm` / `--cold` for lead/deal temperature — a dedicated
  scale rather than overloading the semantic colors, since "hot" isn't "danger."
- **Radius**: `--radius-sm` (0.5rem) through `--radius-xl` (1.25rem) — never an arbitrary
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
in particular `--accent` shifts to a slightly desaturated, brighter violet (`#8B5CF6` vs
`#6D28D9`) because the light-mode accent reads as muddy on a dark surface at the same
saturation. `-soft` variants get higher opacity in dark mode for the same reason.

## What's deliberately *not* here

No Storybook, no component playground, no visual regression tooling — components are verified
in-context (Playwright screenshots against real seeded/live data during each phase) rather than
in isolation, matching the product's "no vanity, only real" philosophy applied to the build
process itself.
