import "server-only";
import { db } from "@/server/db";
import dayjs from "dayjs";
import { PIPELINE_STAGES, STAGE_LABEL } from "@/lib/os/pipeline";
import { PROJECT_STAGES, PROJECT_STAGE_LABEL } from "@/lib/os/projects";

/**
 * Aggregate read-only business snapshot for the Intelligence surface and
 * the "Prepare with Claude" export. Every query degrades gracefully to
 * zero/empty on a fresh database — no fabricated numbers.
 */

export interface StageBucket {
  stage: string;
  label: string;
  count: number;
  value: number;
}

export interface TopClient {
  companyId: string;
  name: string;
  lifetimeValue: number;
  dealCount: number;
}

export interface IntelligenceSnapshot {
  pipeline: StageBucket[];
  pipelineValue: number;
  stalledDealCount: number;
  revenue: {
    receivedThisWeek: number;
    receivedThisMonth: number;
    receivedAllTime: number;
    expected: number;
    recurringMonthly: number;
  };
  projects: StageBucket[];
  projectsOverdue: number;
  topClients: TopClient[];
  teamPerformance: { userId: string; name: string; wonCount: number; wonValue: number }[];
}

const STALL_DAYS = 7;

export async function getIntelligenceSnapshot(): Promise<IntelligenceSnapshot> {
  const now = dayjs();

  const [openDeals, wonDeals, payments, expectedAgg, recurringAgg, companies, projects, users] = await Promise.all([
    db.deal.findMany({ where: { stage: { notIn: ["WON", "LOST"] } }, select: { stage: true, value: true, stageEnteredAt: true } }),
    db.deal.findMany({ where: { stage: "WON" }, select: { ownerId: true, value: true, owner: { select: { name: true } } } }),
    db.payment.findMany({ where: { status: "SUCCESSFUL" }, select: { amount: true, paidAt: true } }),
    db.salesDocument.aggregate({ _sum: { balance: true }, where: { type: "PROFORMA", status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] } } }),
    db.productFootprint.aggregate({ _sum: { mrr: true }, where: { status: "ACTIVE" } }),
    db.company.findMany({ include: { deals: { where: { stage: "WON" }, select: { value: true } } } }),
    db.project.findMany({ select: { stage: true, targetLiveDate: true } }),
    db.user.findMany({ where: { active: true }, select: { id: true, name: true } }),
  ]);

  const pipeline: StageBucket[] = PIPELINE_STAGES.map(stage => {
    const inStage = openDeals.filter(d => d.stage === stage);
    return { stage, label: STAGE_LABEL[stage] ?? stage, count: inStage.length, value: inStage.reduce((s, d) => s + d.value, 0) };
  });
  const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0);
  const stalledDealCount = openDeals.filter(d => now.diff(d.stageEnteredAt, "day") > STALL_DAYS).length;

  const receivedThisWeek = payments.filter(p => p.paidAt && dayjs(p.paidAt).isAfter(now.subtract(7, "day"))).reduce((s, p) => s + p.amount, 0);
  const receivedThisMonth = payments.filter(p => p.paidAt && dayjs(p.paidAt).isAfter(now.startOf("month"))).reduce((s, p) => s + p.amount, 0);
  const receivedAllTime = payments.reduce((s, p) => s + p.amount, 0);

  const projectBuckets: StageBucket[] = PROJECT_STAGES.map(stage => {
    const inStage = projects.filter(p => p.stage === stage);
    return { stage, label: PROJECT_STAGE_LABEL[stage] ?? stage, count: inStage.length, value: 0 };
  });
  const projectsOverdue = projects.filter(p => p.targetLiveDate && dayjs(p.targetLiveDate).isBefore(now) && p.stage !== "LIVE" && p.stage !== "MAINTENANCE").length;

  const topClients: TopClient[] = companies
    .map(c => ({ companyId: c.id, name: c.name, lifetimeValue: c.deals.reduce((s, d) => s + d.value, 0), dealCount: c.deals.length }))
    .filter(c => c.lifetimeValue > 0)
    .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
    .slice(0, 5);

  const teamMap = new Map<string, { userId: string; name: string; wonCount: number; wonValue: number }>();
  for (const u of users) teamMap.set(u.id, { userId: u.id, name: u.name, wonCount: 0, wonValue: 0 });
  for (const d of wonDeals) {
    if (!d.ownerId) continue;
    const entry = teamMap.get(d.ownerId);
    if (entry) { entry.wonCount += 1; entry.wonValue += d.value; }
  }
  const teamPerformance = [...teamMap.values()].filter(t => t.wonCount > 0).sort((a, b) => b.wonValue - a.wonValue);

  return {
    pipeline,
    pipelineValue,
    stalledDealCount,
    revenue: {
      receivedThisWeek,
      receivedThisMonth,
      receivedAllTime,
      expected: expectedAgg._sum.balance ?? 0,
      recurringMonthly: recurringAgg._sum.mrr ?? 0,
    },
    projects: projectBuckets,
    projectsOverdue,
    topClients,
    teamPerformance,
  };
}
