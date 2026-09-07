import { MessageCircle, Mail, Globe, Phone, Facebook, Music2, Share2, StickyNote } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CHANNELS = ["WHATSAPP", "EMAIL", "WEBSITE", "CALL", "META", "TIKTOK", "REFERRAL", "NOTE"] as const;
export type Channel = (typeof CHANNELS)[number];

// Colors are theme tokens, not raw hex — several of these are near-black or
// near-white in one theme's palette (TikTok's brand mark especially), so a
// fixed hex reads fine in light mode and disappears entirely against a dark
// surface. Tying each to the matching CSS var keeps the same look today and
// stays legible once dark mode is toggled on.
export const CHANNEL_META: Record<Channel, { label: string; icon: LucideIcon; color: string }> = {
  WHATSAPP: { label: "WhatsApp", icon: MessageCircle, color: "var(--success)" },
  EMAIL: { label: "Email", icon: Mail, color: "var(--accent-2)" },
  WEBSITE: { label: "Website", icon: Globe, color: "var(--info)" },
  CALL: { label: "Call", icon: Phone, color: "var(--accent)" },
  META: { label: "Meta", icon: Facebook, color: "var(--accent-2)" },
  TIKTOK: { label: "TikTok", icon: Music2, color: "var(--text)" },
  REFERRAL: { label: "Referral", icon: Share2, color: "var(--warning)" },
  NOTE: { label: "Note", icon: StickyNote, color: "var(--cold)" },
};
