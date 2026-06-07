import type { Metadata } from "next";
import { AuditFlow } from "@/components/audit/AuditFlow";

export const metadata: Metadata = {
  title: "Free AI Visibility Audit | TechFind Consulting",
  description:
    "Get your free AI Visibility Score in 60 seconds. Find out how ChatGPT, Claude, Gemini & Perplexity see your brand — and where you're losing leads to competitors.",
};

export default function AuditPage() {
  return <AuditFlow />;
}
