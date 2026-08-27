import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guard";
import { getAttentionItems, getOpportunityItems } from "@/server/intelligence/rules";
import { getIntelligenceSnapshot } from "@/server/intelligence/snapshot";
import { IntelligenceView } from "@/components/os/intelligence/IntelligenceView";

export const metadata: Metadata = { title: "Intelligence — Techfind" };

export default async function IntelligencePage() {
  await requireUser();
  const [snapshot, attention, opportunities] = await Promise.all([
    getIntelligenceSnapshot(),
    getAttentionItems(),
    getOpportunityItems(),
  ]);

  return <IntelligenceView snapshot={snapshot} attention={attention} opportunities={opportunities} />;
}
