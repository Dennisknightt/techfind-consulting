import type { Metadata } from "next";
import dayjs from "dayjs";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { getAttentionItems, getOpportunityItems } from "@/server/intelligence/rules";
import { HomeContent } from "@/components/os/home/HomeContent";

export const metadata: Metadata = { title: "Home — Techfind" };

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function HomePage() {
  const user = await requireUser();
  const now = dayjs();

  const [newLeads, hotDeals, upcomingMeetings, openTasks, activeDeals, attention, opportunities] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: now.subtract(7, "day").toDate() } } }),
    db.deal.count({ where: { temperature: "HOT", stage: { notIn: ["WON", "LOST"] } } }),
    db.meeting.count({ where: { status: "SCHEDULED", scheduledAt: { gte: now.toDate() } } }),
    db.task.count({ where: { status: "OPEN", OR: [{ dueAt: { lte: now.toDate() } }, { dueAt: null }] } }),
    db.deal.findMany({ where: { stage: { notIn: ["WON", "LOST"] } }, select: { value: true } }),
    getAttentionItems(),
    getOpportunityItems(),
  ]);

  const pipelineValue = activeDeals.reduce((s, d) => s + d.value, 0);
  const received = await db.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESSFUL" } });

  return (
    <HomeContent
      firstName={user.name.split(" ")[0]}
      greeting={greeting()}
      pipelineValue={pipelineValue}
      newLeads={newLeads}
      hotDeals={hotDeals}
      upcomingMeetings={upcomingMeetings}
      openTasks={openTasks}
      received={received._sum.amount ?? 0}
      attention={attention}
      opportunities={opportunities}
    />
  );
}
