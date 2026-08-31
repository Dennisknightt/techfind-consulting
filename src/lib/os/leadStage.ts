/**
 * Shared vocabulary for the lead tile system — one place for stage/
 * temperature/next-action/lost-reason labels and icons, and the derived
 * "attention status" calculation, so the leads list, lead detail page,
 * Home's Do Next section and any future surface never drift out of sync.
 */

export const LEAD_STAGES = [
  "NEW", "CONTACTED", "QUALIFIED", "DEMO_BOOKED", "DEMO_DONE", "PROPOSAL_SENT", "NEGOTIATING",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export const STAGE_META: Record<LeadStage, { label: string }> = {
  NEW: { label: "New" },
  CONTACTED: { label: "Contacted" },
  QUALIFIED: { label: "Qualified" },
  DEMO_BOOKED: { label: "Demo Booked" },
  DEMO_DONE: { label: "Demo Done" },
  PROPOSAL_SENT: { label: "Proposal Sent" },
  NEGOTIATING: { label: "Negotiating" },
};

/** "Legacy" lost-ish statuses written before `lostReason` existed on Lead — never written by new code, but still real data to display correctly. */
const LEGACY_LOST_STATUSES = ["DISQUALIFIED", "ALREADY_HAS_SYSTEM"];

export function isLeadWon(status: string): boolean {
  return status === "CONVERTED";
}

export function isLeadLost(status: string): boolean {
  return status === "LOST" || LEGACY_LOST_STATUSES.includes(status);
}

export function isLeadOpen(status: string): boolean {
  return !isLeadWon(status) && !isLeadLost(status);
}

export function stageLabel(status: string): string {
  if (isLeadWon(status)) return "Won";
  if (isLeadLost(status)) return "Lost";
  return STAGE_META[status as LeadStage]?.label ?? status;
}

export const TEMPERATURES = ["HOT", "WARM", "COLD", "NURTURE"] as const;
export type Temperature = (typeof TEMPERATURES)[number];

export const TEMPERATURE_META: Record<Temperature, { label: string; icon: string; tone: "hot" | "warm" | "cold" | "neutral" }> = {
  HOT: { label: "Hot", icon: "🔥", tone: "hot" },
  WARM: { label: "Warm", icon: "🟠", tone: "warm" },
  COLD: { label: "Cold", icon: "🔵", tone: "cold" },
  NURTURE: { label: "Nurture", icon: "⚪", tone: "neutral" },
};

export { NEXT_ACTION_TYPES, NEXT_ACTION_META } from "./nextAction";
export type { NextActionType } from "./nextAction";

export const LOST_REASONS = [
  "TOO_EXPENSIVE", "NOT_READY", "NO_BUDGET", "NO_RESPONSE", "COMPETITOR",
  "DIDNT_SEE_VALUE", "BUILT_INTERNALLY", "POSTPONED", "NOT_INTERESTED", "ALREADY_HAS_SYSTEM", "OTHER",
] as const;
export type LostReason = (typeof LOST_REASONS)[number];

export const LOST_REASON_LABEL: Record<LostReason, string> = {
  TOO_EXPENSIVE: "Too Expensive",
  NOT_READY: "Not Ready",
  NO_BUDGET: "No Budget",
  NO_RESPONSE: "No Response",
  COMPETITOR: "Competitor",
  DIDNT_SEE_VALUE: "Didn't See Value",
  BUILT_INTERNALLY: "Built Internally",
  POSTPONED: "Postponed",
  NOT_INTERESTED: "Not Interested",
  ALREADY_HAS_SYSTEM: "Already Has System",
  OTHER: "Other",
};

/** Normalizes a legacy status value into the reason it really represented. */
export function legacyLostReason(status: string): LostReason | null {
  if (status === "DISQUALIFIED") return "NOT_INTERESTED";
  if (status === "ALREADY_HAS_SYSTEM") return "ALREADY_HAS_SYSTEM";
  return null;
}

export type AttentionLevel = "OVERDUE" | "TODAY" | "WAITING" | "ON_TRACK" | "NONE";

export const ATTENTION_META: Record<AttentionLevel, { label: string; icon: string; tone: "danger" | "warning" | "info" | "success" | "neutral" }> = {
  OVERDUE: { label: "Overdue", icon: "🔴", tone: "danger" },
  TODAY: { label: "Today", icon: "🟠", tone: "warning" },
  WAITING: { label: "Waiting", icon: "🟡", tone: "info" },
  ON_TRACK: { label: "On Track", icon: "🟢", tone: "success" },
  NONE: { label: "No Next Step", icon: "⚪", tone: "neutral" },
};

/** Purely derived from real data — never stored, so it can never drift from the truth. */
export function getAttentionLevel(lead: { status: string; nextActionType: string | null; nextActionDue: Date | null }): AttentionLevel {
  if (!isLeadOpen(lead.status)) return "NONE";
  if (lead.nextActionType === "WAIT") return "WAITING";
  if (!lead.nextActionDue) return "NONE";

  const now = new Date();
  const due = new Date(lead.nextActionDue);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  if (startOfDueDay < startOfToday) return "OVERDUE";
  if (startOfDueDay.getTime() === startOfToday.getTime()) return "TODAY";
  return "ON_TRACK";
}
