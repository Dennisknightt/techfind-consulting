import { MessageCircle, Mail, Globe, Phone, Facebook, Music2, Share2, StickyNote } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CHANNELS = ["WHATSAPP", "EMAIL", "WEBSITE", "CALL", "META", "TIKTOK", "REFERRAL", "NOTE"] as const;
export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_META: Record<Channel, { label: string; icon: LucideIcon; color: string }> = {
  WHATSAPP: { label: "WhatsApp", icon: MessageCircle, color: "#0F9D63" },
  EMAIL: { label: "Email", icon: Mail, color: "#2563EB" },
  WEBSITE: { label: "Website", icon: Globe, color: "#0891B2" },
  CALL: { label: "Call", icon: Phone, color: "#7C3AED" },
  META: { label: "Meta", icon: Facebook, color: "#1D4ED8" },
  TIKTOK: { label: "TikTok", icon: Music2, color: "#111827" },
  REFERRAL: { label: "Referral", icon: Share2, color: "#D97706" },
  NOTE: { label: "Note", icon: StickyNote, color: "#64748B" },
};
