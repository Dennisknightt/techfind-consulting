"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle, ArrowRight, Flame, Users, CalendarDays, ListTodo, Wallet,
  Sparkles, PartyPopper, Clock, ShieldCheck, Handshake,
} from "lucide-react";
import { formatKES } from "@/lib/os/money";
import { Button } from "@/components/os/ui/Button";
import { QuickActionTile } from "@/components/os/common/QuickActionTile";
import { QUICK_CREATE_ITEMS } from "@/components/os/shell/QuickCreate";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/os/motion";
import type { AttentionItem, OpportunityItem } from "@/server/intelligence/rules";

export interface ScheduleItem { id: string; at: Date; label: string }

export interface HomeContentProps {
  firstName: string;
  greeting: string;
  pipelineValue: number;
  activeDealsCount: number;
  newLeads: number;
  hotDeals: number;
  upcomingMeetings: number;
  openTasks: number;
  received: number;
  attention: AttentionItem[];
  opportunities: OpportunityItem[];
  todaySchedule: ScheduleItem[];
}

function openCommandPalette() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
}

export function HomeContent({
  firstName, greeting, pipelineValue, activeDealsCount, newLeads, hotDeals, upcomingMeetings, openTasks, received, attention, opportunities, todaySchedule,
}: HomeContentProps) {
  const needsYou = attention.length + opportunities.length;

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <motion.div {...fadeInUp}>
        <p className="os-heading-section" style={{ color: "var(--text)" }}>{greeting}, {firstName}.</p>
        <p className="os-text-body mt-1" style={{ color: "var(--text-muted)" }}>
          {needsYou === 0 ? "Business is running smoothly." : `Business is running smoothly. ${needsYou} thing${needsYou === 1 ? "" : "s"} need${needsYou === 1 ? "s" : ""} you.`}
        </p>

        <div className="mt-6 flex items-end gap-8 flex-wrap">
          <div>
            <p className="os-text-hero" style={{ color: "var(--text)" }}>{formatKES(pipelineValue, { compact: true })}</p>
            <p className="os-text-meta mt-1">Active pipeline</p>
          </div>
          {activeDealsCount > 0 && (
            <div className="pb-1">
              <p className="os-text-number text-3xl" style={{ color: "var(--text)" }}>{activeDealsCount}</p>
              <p className="os-text-meta mt-1">deal{activeDealsCount === 1 ? "" : "s"}</p>
            </div>
          )}
        </div>

        {/* Big tappable summary rows — the "what do I do right now" entry points */}
        <div className="mt-6 space-y-2">
          {attention.length > 0 && (
            <SummaryRow
              icon={ShieldCheck}
              label="Needs your attention"
              count={attention.length}
              href={attention[0].actionHref}
              filled
            />
          )}
          {opportunities.length > 0 && (
            <SummaryRow icon={AlertTriangle} label="Opportunities to act on" count={opportunities.length} href={opportunities[0].actionHref} />
          )}
          <SummaryRow icon={Handshake} label="Pipeline" href="/app/deals" arrow />
          <SummaryRow icon={Sparkles} label="Ask Techfind" onClick={openCommandPalette} arrow />
        </div>

        {/* Secondary signal — small, quiet, never competing with the hero number */}
        <div className="flex flex-wrap gap-2 mt-5">
          <StatPill icon={Flame} label={`${hotDeals} hot`} href="/app/deals" tone="hot" show={hotDeals > 0} />
          <StatPill icon={Users} label={`${newLeads} new lead${newLeads === 1 ? "" : "s"}`} href="/app/leads" show={newLeads > 0} />
          <StatPill icon={CalendarDays} label={`${upcomingMeetings} meeting${upcomingMeetings === 1 ? "" : "s"}`} href="/app/meetings" show={upcomingMeetings > 0} />
          <StatPill icon={ListTodo} label={`${openTasks} follow-up${openTasks === 1 ? "" : "s"}`} href="/app/tasks" show={openTasks > 0} />
          <StatPill icon={Wallet} label={`${formatKES(received, { compact: true })} received`} href="/app/revenue" tone="success" show={received > 0} />
        </div>
      </motion.div>

      {/* Quick access — every common "add something" one tap away, never buried behind a menu */}
      <section className="mt-8">
        <h2 className="os-heading-section mb-3" style={{ color: "var(--text)" }}>Quick Actions</h2>
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {QUICK_CREATE_ITEMS.map(({ label, href, icon }) => (
            <motion.div key={href} variants={staggerItem}>
              <QuickActionTile icon={icon} label={label === "Proforma" ? "Quotation" : label} href={href} />
            </motion.div>
          ))}
        </motion.div>
      </section>

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

function SummaryRow({
  icon: Icon, label, count, href, onClick, filled, arrow,
}: {
  icon: typeof Flame;
  label: string;
  count?: number;
  href?: string;
  onClick?: () => void;
  filled?: boolean;
  arrow?: boolean;
}) {
  const content = (
    <>
      <Icon className="w-4 h-4 shrink-0" style={{ color: filled ? "white" : "var(--text-muted)" }} />
      <span className="os-text-body font-medium flex-1 text-left" style={{ color: filled ? "white" : "var(--text)" }}>
        {label}
      </span>
      {typeof count === "number" && (
        <span
          className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full text-xs font-bold"
          style={filled ? { background: "rgba(255,255,255,0.2)", color: "white" } : { background: "var(--surface-hover)", color: "var(--text)" }}
        >
          {count}
        </span>
      )}
      {arrow && <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--text-faint)" }} />}
    </>
  );

  const className = "os-press flex items-center gap-3 w-full rounded-[var(--radius-lg)] px-4 py-3.5 transition-colors";
  const style: React.CSSProperties = filled
    ? { background: "var(--accent)" }
    : { background: "var(--surface)", border: "1px solid var(--border)" };

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {content}
    </button>
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
  const color = critical ? "var(--danger)" : "var(--accent-2)";
  return (
    <motion.div variants={staggerItem} className="os-row-hover flex items-center gap-3 px-4 py-3">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <div className="flex-1 min-w-[180px]">
        <p className="os-text-body font-medium" style={{ color: "var(--text)" }}>{item.title}</p>
        <p className="os-text-meta mt-0.5">{item.description}</p>
      </div>
      {item.valueAtRisk ? (
        <span className="os-text-number text-sm shrink-0" style={{ color: "var(--text)" }}>
          {formatKES(item.valueAtRisk, { compact: true })}
        </span>
      ) : null}
      <Button
        size="sm" variant="outline" asChild
        className="shrink-0 rounded-full border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)]"
      >
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
