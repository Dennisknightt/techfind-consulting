import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, Flame, CalendarDays, ListTodo, TrendingUp, Clock, Wallet, Star } from "lucide-react";
import dayjs from "dayjs";
import { requireUser } from "@/server/auth/guard";
import { db } from "@/server/db";
import { getAttentionItems, getOpportunityItems } from "@/server/intelligence/rules";
import { formatKES } from "@/lib/os/money";
import { Button } from "@/components/os/ui/Button";

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
  const [expected, received] = await Promise.all([
    db.salesDocument.aggregate({ _sum: { balance: true }, where: { type: "PROFORMA", status: { in: ["SENT", "VIEWED", "PARTIALLY_PAID"] } } }),
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESSFUL" } }),
  ]);

  const stats = [
    { label: "New Leads", value: newLeads, icon: Users, href: "/app/leads" },
    { label: "Hot Opportunities", value: hotDeals, icon: Flame, href: "/app/deals" },
    { label: "Meetings", value: upcomingMeetings, icon: CalendarDays, href: "/app/meetings" },
    { label: "Follow-ups", value: openTasks, icon: ListTodo, href: "/app/tasks" },
    { label: "Pipeline", value: formatKES(pipelineValue, { compact: true }), icon: TrendingUp, href: "/app/deals" },
    { label: "Expected", value: formatKES(Number(expected._sum.balance ?? 0), { compact: true }), icon: Clock, href: "/app/revenue" },
    { label: "Received", value: formatKES(Number(received._sum.amount ?? 0), { compact: true }), icon: Wallet, href: "/app/revenue" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>
        {greeting()}, {user.name.split(" ")[0]}.
      </h1>
      <p className="text-sm text-[var(--text-muted)] mt-1">Here&rsquo;s where Techfind needs you today.</p>

      {/* Compact metrics — deliberately small, actions come first */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-6">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="rounded-[var(--radius-lg)] p-3 transition-colors hover:bg-[var(--surface-hover)]" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Icon className="w-3.5 h-3.5 mb-2" style={{ color: "var(--text-faint)" }} />
            <p className="text-base font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>{value}</p>
            <p className="text-[10px] text-[var(--text-faint)] mt-0.5 leading-tight">{label}</p>
          </Link>
        ))}
      </div>

      {/* Needs Your Attention */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-[var(--text)] mb-3">Needs Your Attention</h2>
        {attention.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] p-6 text-center" style={{ background: "var(--success-soft)", border: "1px solid var(--border)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--success)" }}>Nothing urgent — the pipeline is under control.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {attention.slice(0, 8).map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-[var(--radius-lg)] p-4 flex-wrap"
                style={{ background: "var(--surface)", border: `1px solid ${item.severity === "critical" ? "var(--danger)" : "var(--border)"}` }}
              >
                <span className="text-lg shrink-0">{item.severity === "critical" ? "🔴" : "🟠"}</span>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-faint)] mt-0.5">{item.description}</p>
                </div>
                {item.valueAtRisk ? (
                  <span className="text-sm font-bold shrink-0" style={{ color: "var(--text)" }}>{formatKES(item.valueAtRisk, { compact: true })}</span>
                ) : null}
                <Button size="sm" variant="secondary" asChild className="shrink-0">
                  <Link href={item.actionHref} className="flex items-center gap-1">{item.actionLabel} <ArrowRight className="w-3.5 h-3.5" /></Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-bold text-[var(--text)] mb-3 flex items-center gap-1.5"><Star className="w-4 h-4" style={{ color: "var(--accent)" }} /> Opportunities</h2>
          <div className="space-y-2.5">
            {opportunities.map(item => (
              <div key={item.id} className="flex items-center gap-4 rounded-[var(--radius-lg)] p-4 flex-wrap" style={{ background: "var(--accent-soft)", border: "1px solid var(--border-strong)" }}>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.description}</p>
                </div>
                <span className="text-sm font-bold shrink-0" style={{ color: "var(--accent)" }}>{formatKES(item.potentialValue, { compact: true })}</span>
                <Button size="sm" asChild className="shrink-0">
                  <Link href={item.actionHref}>{item.actionLabel}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Money expected today */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-[var(--text)] mb-3">Money Expected Today</h2>
        <div className="rounded-[var(--radius-lg)] p-6 text-center border border-dashed" style={{ borderColor: "var(--border-strong)" }}>
          <p className="text-xs text-[var(--text-faint)]">Once proformas go out and payments start coming in, today&rsquo;s expected and received money will show up here automatically.</p>
        </div>
      </div>
    </div>
  );
}
