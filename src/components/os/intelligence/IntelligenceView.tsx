"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Star, Copy, Download, TrendingUp, FolderKanban, Trophy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Badge } from "@/components/os/ui/Badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter } from "@/components/os/ui/Sheet";
import { formatKES } from "@/lib/os/money";
import { prepareClaudeBriefingAction } from "@/server/actions/intelligence";
import type { AttentionItem, OpportunityItem } from "@/server/intelligence/rules";
import type { IntelligenceSnapshot } from "@/server/intelligence/snapshot";

export function IntelligenceView({
  snapshot, attention, opportunities,
}: {
  snapshot: IntelligenceSnapshot;
  attention: AttentionItem[];
  opportunities: OpportunityItem[];
}) {
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);

  async function prepare() {
    setBriefingOpen(true);
    setLoading(true);
    try {
      const text = await prepareClaudeBriefingAction();
      setBriefing(text);
    } catch {
      toast.error("Couldn't prepare the briefing");
      setBriefingOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function copyBriefing() {
    navigator.clipboard.writeText(briefing);
    toast.success("Briefing copied — paste it into Claude");
  }

  function downloadBriefing() {
    const blob = new Blob([briefing], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `techfind-briefing-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const activeProjects = snapshot.projects.filter(b => b.count > 0 && b.stage !== "LIVE" && b.stage !== "MAINTENANCE").reduce((s, b) => s + b.count, 0);

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <PageHeader
        title="Intelligence"
        subtitle="What Techfind's data is telling you to do next"
        actions={
          <Button onClick={prepare} className="gap-1.5">
            <Sparkles className="w-4 h-4" /> Prepare with Claude
          </Button>
        }
      />

      {/* Snapshot stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <Stat label="Open Pipeline" value={formatKES(snapshot.pipelineValue, { compact: true })} icon={TrendingUp} />
        <Stat label="Received This Month" value={formatKES(snapshot.revenue.receivedThisMonth, { compact: true })} icon={Trophy} />
        <Stat label="Expected" value={formatKES(snapshot.revenue.expected, { compact: true })} icon={ArrowRight} />
        <Stat label="Projects In Delivery" value={String(activeProjects)} icon={FolderKanban} />
      </div>

      {/* Pipeline funnel */}
      <Section title="Pipeline Health">
        <div className="space-y-1.5">
          {snapshot.pipeline.filter(b => b.count > 0).map(b => (
            <div key={b.stage} className="flex items-center gap-3">
              <span className="text-xs w-28 shrink-0 text-[var(--text-faint)]">{b.label}</span>
              <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: "var(--surface-hover)" }}>
                <div
                  className="h-full rounded-full flex items-center justify-end px-2"
                  style={{ width: `${Math.max(6, (b.value / Math.max(1, snapshot.pipelineValue)) * 100)}%`, background: "var(--accent)" }}
                >
                  <span className="text-[10px] font-bold text-white">{b.count}</span>
                </div>
              </div>
              <span className="text-xs w-20 text-right font-semibold text-[var(--text)]">{formatKES(b.value, { compact: true })}</span>
            </div>
          ))}
          {snapshot.pipeline.every(b => b.count === 0) && <Empty text="No open opportunities yet." />}
        </div>
        {snapshot.stalledDealCount > 0 && (
          <p className="text-xs mt-3" style={{ color: "var(--danger)" }}>
            ⚠️ {snapshot.stalledDealCount} deal{snapshot.stalledDealCount === 1 ? "" : "s"} stalled more than 7 days in stage.
          </p>
        )}
      </Section>

      {/* Needs attention */}
      <Section title="Needs Attention">
        {attention.length === 0 ? (
          <Empty text="Nothing urgent — the pipeline is under control." success />
        ) : (
          <div className="space-y-2">
            {attention.map(item => (
              <div key={item.id} className="flex items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 flex-wrap" style={{ background: "var(--surface-hover)" }}>
                <span>{item.severity === "critical" ? "🔴" : "🟠"}</span>
                <div className="flex-1 min-w-[180px]">
                  <p className="text-sm font-medium text-[var(--text)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-faint)]">{item.description}</p>
                </div>
                {item.valueAtRisk ? <span className="text-xs font-bold text-[var(--text)]">{formatKES(item.valueAtRisk, { compact: true })}</span> : null}
                <Link href={item.actionHref} className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  {item.actionLabel} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <Section title="Opportunities" icon={Star}>
          <div className="space-y-2">
            {opportunities.map(item => (
              <div key={item.id} className="flex items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 flex-wrap" style={{ background: "var(--accent-soft)" }}>
                <div className="flex-1 min-w-[180px]">
                  <p className="text-sm font-medium text-[var(--text)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.description}</p>
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{formatKES(item.potentialValue, { compact: true })}</span>
                <Link href={item.actionHref} className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  {item.actionLabel} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Top clients + team performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5">Top Clients</p>
          <div className="space-y-2">
            {snapshot.topClients.length === 0 && <Empty text="No won deals yet." />}
            {snapshot.topClients.map(c => (
              <Link key={c.companyId} href={`/app/clients/${c.companyId}`} className="flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)]" style={{ background: "var(--surface-hover)" }}>
                <span className="text-sm text-[var(--text)]">{c.name}</span>
                <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{formatKES(c.lifetimeValue, { compact: true })}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5">Team Performance</p>
          <div className="space-y-2">
            {snapshot.teamPerformance.length === 0 && <Empty text="No won deals yet." />}
            {snapshot.teamPerformance.map(t => (
              <div key={t.userId} className="flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                <span className="text-sm text-[var(--text)]">{t.name}</span>
                <Badge tone="success">{t.wonCount} won · {formatKES(t.wonValue, { compact: true })}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sheet open={briefingOpen} onOpenChange={setBriefingOpen}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" style={{ color: "var(--accent)" }} /> Prepare with Claude</SheetTitle>
            <SheetDescription>A snapshot of Techfind&rsquo;s pipeline, revenue and delivery — ready to paste into a Claude conversation.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            {loading ? (
              <p className="text-sm text-[var(--text-faint)]">Preparing…</p>
            ) : (
              <pre className="text-xs whitespace-pre-wrap leading-relaxed text-[var(--text)] font-mono">{briefing}</pre>
            )}
          </SheetBody>
          <SheetFooter>
            <Button variant="secondary" size="sm" onClick={downloadBriefing} disabled={loading} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download .md
            </Button>
            <Button size="sm" onClick={copyBriefing} disabled={loading} className="gap-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }) {
  return (
    <div className="rounded-[var(--radius-lg)] p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <Icon className="w-3.5 h-3.5 mb-2" style={{ color: "var(--text-faint)" }} />
      <p className="text-lg font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>{value}</p>
      <p className="text-xs text-[var(--text-faint)] mt-0.5">{label}</p>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-2.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />}
        {title}
      </p>
      {children}
    </div>
  );
}

function Empty({ text, success }: { text: string; success?: boolean }) {
  if (success) {
    return (
      <div className="rounded-[var(--radius-lg)] p-5 text-center" style={{ background: "var(--success-soft)", border: "1px solid var(--border)" }}>
        <p className="text-sm font-semibold" style={{ color: "var(--success)" }}>{text}</p>
      </div>
    );
  }
  return <p className="text-xs text-[var(--text-faint)] px-1">{text}</p>;
}
