import "server-only";
import { db } from "@/server/db";
import dayjs from "dayjs";
import { formatKES } from "@/lib/os/money";

/**
 * Rule-based "what needs attention / where's the money" engine.
 *
 * Every rule here degrades gracefully: the tables it reads (SalesDocument,
 * Payment, ProductFootprint) are empty until Phases 4/5/8 populate them, so
 * a rule simply returns no cards rather than fabricating data — see
 * ACTION-FIRST DESIGN RULE / "never pretend" in the product brief. Once
 * those phases land, these same functions start surfacing real results
 * with no further changes. Phase 7 (Intelligence) extends this file rather
 * than replacing it.
 */

export interface AttentionItem {
  id: string;
  severity: "critical" | "warning";
  title: string;
  description: string;
  valueAtRisk?: number;
  actionLabel: string;
  actionHref: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  potentialValue: number;
  actionLabel: string;
  actionHref: string;
}

const STALE_DEMO_DAYS = 2;
const STALL_DAYS = 7;
const AVG_CRM_PRICE = 150_000;
const AVG_WHATSAPP_PRICE = 50_000;

export async function getAttentionItems(): Promise<AttentionItem[]> {
  const items: AttentionItem[] = [];
  const now = dayjs();

  // Demo done, no follow-up recorded
  const staleDemos = await db.deal.findMany({
    where: {
      stage: "DEMO_DONE",
      OR: [{ lastContactAt: null }, { lastContactAt: { lt: now.subtract(STALE_DEMO_DAYS, "day").toDate() } }],
    },
    include: { company: true },
    take: 10,
  });
  for (const d of staleDemos) {
    const days = d.lastContactAt ? now.diff(d.lastContactAt, "day") : now.diff(d.stageEnteredAt, "day");
    items.push({
      id: `demo-${d.id}`,
      severity: days > STALL_DAYS ? "critical" : "warning",
      title: d.company.name,
      description: `Demo completed ${days} day${days === 1 ? "" : "s"} ago. No follow-up has been recorded.`,
      valueAtRisk: d.value,
      actionLabel: "Follow Up",
      actionHref: `/app/deals/${d.id}`,
    });
  }

  // Proposal ready but proforma not yet sent
  const proposalsStuck = await db.deal.findMany({
    where: { stage: "PROPOSAL", stageEnteredAt: { lt: now.subtract(STALE_DEMO_DAYS, "day").toDate() } },
    include: { company: true },
    take: 10,
  });
  for (const d of proposalsStuck) {
    items.push({
      id: `proposal-${d.id}`,
      severity: "warning",
      title: d.company.name,
      description: "Proposal agreed. Proforma has not been sent.",
      valueAtRisk: d.value,
      actionLabel: "Create Proforma",
      actionHref: `/app/quotes/new?deal=${d.id}`,
    });
  }

  // Overdue next actions on active deals
  const overdueDeals = await db.deal.findMany({
    where: { nextActionDue: { lt: now.toDate() }, stage: { notIn: ["WON", "LOST"] } },
    include: { company: true },
    take: 10,
  });
  for (const d of overdueDeals) {
    items.push({
      id: `overdue-${d.id}`,
      severity: "critical",
      title: d.company.name,
      description: `"${d.nextAction ?? "Follow-up"}" was due ${now.diff(d.nextActionDue, "day")} day(s) ago.`,
      valueAtRisk: d.value,
      actionLabel: "Follow Up",
      actionHref: `/app/deals/${d.id}`,
    });
  }

  // Cold / stale leads
  const coldLeads = await db.lead.findMany({
    where: {
      status: { in: ["NEW", "CONTACTED"] },
      OR: [{ temperature: "COLD" }, { createdAt: { lt: now.subtract(5, "day").toDate() } }],
    },
  });
  if (coldLeads.length > 0) {
    const atRisk = coldLeads.reduce((s, l) => s + l.value, 0);
    items.push({
      id: "cold-leads",
      severity: "critical",
      title: `${coldLeads.length} lead${coldLeads.length === 1 ? "" : "s"} going cold`,
      description: atRisk > 0 ? `${formatKES(atRisk)} potential revenue at risk.` : "Follow up before they go quiet for good.",
      valueAtRisk: atRisk,
      actionLabel: "Review & Follow Up",
      actionHref: "/app/leads",
    });
  }

  // Unassigned leads
  const unassigned = await db.lead.count({ where: { ownerId: null, status: { notIn: ["CONVERTED", "DISQUALIFIED"] } } });
  if (unassigned > 0) {
    items.push({
      id: "unassigned-leads",
      severity: "warning",
      title: `${unassigned} lead${unassigned === 1 ? "" : "s"} unassigned`,
      description: "No one owns these yet — they'll stall without an owner.",
      actionLabel: "Assign",
      actionHref: "/app/leads",
    });
  }

  // Payments overdue — empty until Phase 5 populates Payment/SalesDocument
  const overduePayments = await db.salesDocument.findMany({
    where: { type: "PROFORMA", status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] }, validUntil: { lt: now.toDate() } },
    include: { company: true },
    take: 10,
  });
  for (const doc of overduePayments) {
    items.push({
      id: `payment-${doc.id}`,
      severity: "critical",
      title: doc.company.name,
      description: `${formatKES(doc.balance)} expected but overdue.`,
      valueAtRisk: doc.balance,
      actionLabel: "WhatsApp Reminder",
      actionHref: `/app/payments`,
    });
  }

  return items.sort((a, b) => (b.valueAtRisk ?? 0) - (a.valueAtRisk ?? 0));
}

export async function getOpportunityItems(): Promise<OpportunityItem[]> {
  const items: OpportunityItem[] = [];

  const whatsappActive = await db.productFootprint.findMany({
    where: { product: { key: "whatsapp" }, status: "ACTIVE" },
    select: { companyId: true },
  });
  if (whatsappActive.length > 0) {
    const companyIds = whatsappActive.map(f => f.companyId);
    const withoutCrm = await db.productFootprint.findMany({
      where: { companyId: { in: companyIds }, product: { key: "crm" }, status: { not: "NOT_PITCHED" } },
      select: { companyId: true },
    });
    const withoutCrmIds = new Set(withoutCrm.map(f => f.companyId));
    const candidateCount = companyIds.filter(id => !withoutCrmIds.has(id)).length;
    if (candidateCount > 0) {
      items.push({
        id: "whatsapp-no-crm",
        title: `${candidateCount} existing WhatsApp clients don't use Techfind CRM`,
        description: "They're generating leads with no structured place to manage them.",
        potentialValue: candidateCount * AVG_CRM_PRICE,
        actionLabel: "Review Clients",
        actionHref: "/app/clients",
      });
    }
  }

  const websiteActive = await db.productFootprint.findMany({
    where: { product: { key: "website" }, status: "ACTIVE" },
    select: { companyId: true },
  });
  if (websiteActive.length > 0) {
    const companyIds = websiteActive.map(f => f.companyId);
    const withWhatsapp = await db.productFootprint.findMany({
      where: { companyId: { in: companyIds }, product: { key: "whatsapp" }, status: { not: "NOT_PITCHED" } },
      select: { companyId: true },
    });
    const withWhatsappIds = new Set(withWhatsapp.map(f => f.companyId));
    const candidateCount = companyIds.filter(id => !withWhatsappIds.has(id)).length;
    if (candidateCount > 0) {
      items.push({
        id: "website-no-whatsapp",
        title: `${candidateCount} website clients haven't been offered WhatsApp Automation`,
        description: "They already trust Techfind for their site — this is a natural next step.",
        potentialValue: candidateCount * AVG_WHATSAPP_PRICE,
        actionLabel: "Create Opportunities",
        actionHref: "/app/clients",
      });
    }
  }

  return items;
}
