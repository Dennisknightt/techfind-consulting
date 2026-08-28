/**
 * Pipeline stage/reason constants — kept in a plain (non "use server") module
 * so Client Components can import them directly. A "use server" file may
 * only export async functions across the server/client boundary; a plain
 * array export from one silently breaks at runtime on the client.
 */

export const PIPELINE_STAGES = [
  "IDENTIFIED", "CONTACTED", "INTERESTED", "DEMO_BOOKED", "DEMO_DONE",
  "PROPOSAL", "PROFORMA_SENT", "DEPOSIT_PENDING", "NEGOTIATING", "WON",
] as const;

export const POST_WON_STAGES = ["IMPLEMENTATION", "LIVE", "MAINTENANCE", "UPSELL"] as const;

export const LOST_REASONS = [
  "Too Expensive", "No Budget", "Competitor", "No Response",
  "Not Ready", "Didn't See Value", "Building Internally", "Other",
] as const;

export const STAGE_LABEL: Record<string, string> = {
  IDENTIFIED: "Identified", CONTACTED: "Contacted", INTERESTED: "Interested",
  DEMO_BOOKED: "Demo Booked", DEMO_DONE: "Demo Done", PROPOSAL: "Proposal / Quote",
  PROFORMA_SENT: "Proforma Sent", DEPOSIT_PENDING: "Deposit Pending",
  NEGOTIATING: "Negotiating", WON: "WON", LOST: "Lost",
};
