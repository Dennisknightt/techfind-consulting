export interface ChangelogEntry {
  id: string;
  date: string; // ISO date
  title: string;
  description: string;
}

/**
 * Real, dated entries for what actually shipped — never a placeholder or a
 * restated feature. Newest first. `LATEST_CHANGELOG_ID` drives the unread
 * indicator (see useChangelogSeen.ts); bump it by adding a new entry here.
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    id: "2026-09-01-whats-new",
    date: "2026-09-01",
    title: "What's New",
    description: "This page — a running, honest record of what changed in Techfind, so nothing ships silently.",
  },
  {
    id: "2026-08-31-proforma-cards",
    date: "2026-08-31",
    title: "Quotation builder redesign",
    description: "The Proforma/Quote builder's sections are now grouped in cards instead of floating labels, matching the rest of the app.",
  },
  {
    id: "2026-08-31-quick-create-colors",
    date: "2026-08-31",
    title: "Quick Create polish",
    description: "Each quick-create action (Lead, Deal, Task, Meeting, Client, Quotation) now has its own color for faster scanning, in the sheet, the desktop menu and ⌘K.",
  },
  {
    id: "2026-08-31-home-quick-actions",
    date: "2026-08-31",
    title: "Quick Actions on Home",
    description: "Every quick-create action is now one tap away directly from the dashboard, not just behind the + button.",
  },
  {
    id: "2026-08-31-deal-next-action-tiles",
    date: "2026-08-31",
    title: "Deal next actions, no more typing",
    description: "The deal record's \"Next Best Action\" is now tap-tiles with date shortcuts, matching leads.",
  },
  {
    id: "2026-08-31-dark-mode",
    date: "2026-08-31",
    title: "Dark mode",
    description: "A real light / dark / system theme toggle, in the top bar and in Settings → Experience.",
  },
  {
    id: "2026-08-31-search-fixes",
    date: "2026-08-31",
    title: "Smarter search",
    description: "Global search (⌘K) is no longer case-sensitive, now covers payments, and lead results open the lead directly instead of the list.",
  },
  {
    id: "2026-08-31-lead-tiles",
    date: "2026-08-31",
    title: "Tap-tile lead management",
    description: "Lead stage, temperature and next action are now tap-tiles instead of dropdowns, with a proper Won flow (value + products) and a structured Lost flow (reason + note), plus a new lead detail page.",
  },
];

export const LATEST_CHANGELOG_ID = CHANGELOG[0].id;
