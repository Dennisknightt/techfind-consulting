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

  const todayStart = now.startOf("day").toDate();
  const todayEnd = now.endOf("day").toDate();
  const [todayMeetings, todayTasks] = await Promise.all([
    db.meeting.findMany({
      where: { status: "SCHEDULED", scheduledAt: { gte: todayStart, lte: todayEnd } },
      include: { company: true },
      orderBy: { scheduledAt: "asc" },
    }),
    db.task.findMany({
      where: { status: "OPEN", dueAt: { gte: todayStart, lte: todayEnd } },
      orderBy: { dueAt: "asc" },
    }),
  ]);
  const todaySchedule = [
    ...todayMeetings.map(m => ({ id: `mtg-${m.id}`, at: m.scheduledAt, label: `Meeting · ${m.company.name}` })),
    ...todayTasks.map(t => ({ id: `task-${t.id}`, at: t.dueAt ?? todayEnd, label: `Follow-up · ${t.title}` })),
  ].sort((a, b) => a.at.getTime() - b.at.getTime());

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
      todaySchedule={todaySchedule}
    />
  );
}
