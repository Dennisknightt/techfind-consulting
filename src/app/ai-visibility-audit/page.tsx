import type { Metadata } from "next";
import { AuditPage } from "@/components/pages/AuditPage";

export const metadata: Metadata = {
  title: "AI Visibility Audit | TechFind Consulting",
  description:
    "Book your AI Visibility Audit and discover how ChatGPT, Gemini, and Perplexity currently see your brand — with a full gap analysis and AEO strategy.",
};

export default function AuditPageRoute() {
  return <AuditPage />;
}
