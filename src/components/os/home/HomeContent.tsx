"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, ArrowRight, Flame, Users, CalendarDays, ListTodo, Wallet, Sparkles, PartyPopper, Clock } from "lucide-react";
import { formatKES } from "@/lib/os/money";
import { Button } from "@/components/os/ui/Button";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/os/motion";
import type { AttentionItem, OpportunityItem } from "@/server/intelligence/rules";

export interface ScheduleItem { id: string; at: Date; label: string }

export interface HomeContentProps {
  firstName: string;
  greeting: string;
  pipelineValue: number;
  newLeads: number;
  hotDeals: number;
  upcomingMeetings: number;
  openTasks: number;
  received: number;
  attention: AttentionItem[];
  opportunities: OpportunityItem[];
  todaySchedule: ScheduleItem[];
}

export function HomeContent({
  firstName, greeting, pipelineValue, newLeads, hotDeals, upcomingMeetings, openTasks, received, attention, opportunities, todaySchedule,
}: HomeContentProps) {
  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <motion.div {...fadeInUp}>
        <p className="os-text-body" style={{ color: "var(--text-muted)" }}>
          {greeting}, {firstName}.
        </p>
        <div className="mt-1 flex items-baseline gap-2 flex-wrap">
          <span className="os-text-hero" style={{ color: "var(--text)" }}>
            {formatKES(pipelineValue, { compact: true })}
          </span>
        </div>
        <p className="os-text-body mt-0.5" style={{ color: "var(--text-muted)" }}>
          Active pipeline
          {attention.length > 0 && <> · <span style={{ color: "var(--text)" }}>{attention.length} deal{attention.length === 1 ? "" : "s"} need{attention.length === 1 ? "s" : ""} you today</span></>}
        </p>

        {/* Secondary signal — small, quiet, never competing with the hero number */}
        <div className="flex flex-wrap gap-2 mt-5">
          <StatPill icon={Flame} label={`${hotDeals} hot`} href="/app/deals" tone="hot" show={hotDeals > 0} />
          <StatPill icon={Users} label={`${newLeads} new lead${newLeads === 1 ? "" : "s"}`} href="/app/leads" show={newLeads > 0} />
          <StatPill icon={CalendarDays} label={`${upcomingMeetings} meeting${upcomingMeetings === 1 ? "" : "s"}`} href="/app/meetings" show={upcomingMeetings > 0} />
          <StatPill icon={ListTodo} label={`${openTasks} follow-up${openTasks === 1 ? "" : "s"}`} href="/app/tasks" show={openTasks > 0} />
          <StatPill icon={Wallet} label={`${formatKES(received, { compact: true })} received`} href="/app/revenue" tone="success" show={received > 0} />
        </div>
      </motion.div>

      {/* What needs your attention */}
      <section className="mt-10">
        <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>What needs your attention</h2>
        {attention.length === 0 ? (
          <motion.div {...fadeInUp} className="py-6">
            <p className="os-text-body font-medium" style={{ color: "var(--success)" }}>
              Nothing urgent — the pipeline is under control.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer} initial="initial" animate="animate"
            className="rounded-[var(--radius-lg)] border divide-y"
            style={{ borderColor: "var(--border)" }}
          >
            {attention.slice(0, 8).map(item => (
              <AttentionRow key={item.id} item={item} />
            ))}
          </motion.div>
        )}
      </section>

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <section className="mt-10">
          <h2 className="os-heading-section mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Sparkles className="w-4 h-4" style={{ color: "var(--accent)" }} /> Opportunities
          </h2>
          <motion.div
            variants={staggerContainer} initial="initial" animate="animate"
            className="rounded-[var(--radius-lg)] border divide-y"
            style={{ borderColor: "var(--border)" }}
          >
            {opportunities.map(item => (
              <OpportunityRow key={item.id} item={item} />
            ))}
          </motion.div>
        </section>
      )}

      {/* Today */}
      {todaySchedule.length > 0 && (
        <section className="mt-10">
          <h2 className="os-heading-section mb-4" style={{ color: "var(--text)" }}>Today</h2>
          <div className="rounded-[var(--radius-lg)] border divide-y" style={{ borderColor: "var(--border)" }}>
            {todaySchedule.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: "var(--border)" }}>
                <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-faint)" }} />
                <span className="os-text-number text-sm w-14 shrink-0" style={{ color: "var(--text)" }}>
                  {item.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="os-text-body" style={{ color: "var(--text)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatPill({
  icon: Icon, label, href, tone, show = true,
}: { icon: typeof Flame; label: string; href: string; tone?: "hot" | "success"; show?: boolean }) {
  if (!show) return null;
  const color = tone === "hot" ? "var(--hot)" : tone === "success" ? "var(--success)" : "var(--text-muted)";
  return (
    <Link
      href={href}
      className="os-press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--surface-hover)]"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", color }}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Link>
  );
}

function AttentionRow({ item }: { item: AttentionItem }) {
  const critical = item.severity === "critical";
  const Icon = critical ? AlertCircle : AlertTriangle;
  const color = critical ? "var(--danger)" : "var(--warning)";
  return (
    <motion.div variants={staggerItem} className="os-row-hover flex items-center gap-3 px-4 py-3">
      <Icon className="w-4 h-4 shrink-0" style={{ color }} />
      <div className="flex-1 min-w-[180px]">
        <p className="os-text-body font-medium" style={{ color: "var(--text)" }}>{item.title}</p>
        <p className="os-text-meta mt-0.5">{item.description}</p>
      </div>
      {item.valueAtRisk ? (
        <span className="os-text-number text-sm shrink-0" style={{ color: "var(--text)" }}>
          {formatKES(item.valueAtRisk, { compact: true })}
        </span>
      ) : null}
      <Button size="sm" variant="secondary" asChild className="shrink-0">
        <Link href={item.actionHref} className="flex items-center gap-1">
          {item.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    </motion.div>
  );
}

function OpportunityRow({ item }: { item: OpportunityItem }) {
  return (
    <motion.div variants={staggerItem} className="os-row-hover flex items-center gap-3 px-4 py-3">
      <PartyPopper className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} />
      <div className="flex-1 min-w-[180px]">
        <p className="os-text-body font-medium" style={{ color: "var(--text)" }}>{item.title}</p>
        <p className="os-text-meta mt-0.5">{item.description}</p>
      </div>
      <span className="os-text-number text-sm shrink-0" style={{ color: "var(--accent)" }}>
        {formatKES(item.potentialValue, { compact: true })}
      </span>
      <Button size="sm" asChild className="shrink-0">
        <Link href={item.actionHref}>{item.actionLabel}</Link>
      </Button>
    </motion.div>
  );
}
