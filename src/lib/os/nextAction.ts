/**
 * Shared "next action" vocabulary — used by both Lead and Deal records so
 * the tile UI (and its labels/icons) never drifts between the two.
 */

export const NEXT_ACTION_TYPES = ["CALL", "WHATSAPP", "EMAIL", "DEMO", "PROPOSAL", "FOLLOW_UP", "WAIT"] as const;
export type NextActionType = (typeof NEXT_ACTION_TYPES)[number];

export const NEXT_ACTION_META: Record<NextActionType, { label: string; icon: string }> = {
  CALL: { label: "Call", icon: "📞" },
  WHATSAPP: { label: "WhatsApp", icon: "💬" },
  EMAIL: { label: "Email", icon: "📧" },
  DEMO: { label: "Demo", icon: "🖥️" },
  PROPOSAL: { label: "Send Proposal", icon: "📄" },
  FOLLOW_UP: { label: "Follow Up", icon: "🔁" },
  WAIT: { label: "Wait", icon: "⏳" },
};
