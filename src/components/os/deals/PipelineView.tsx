"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Deal, Company, User, Product } from "@prisma/client";
import { Plus, Kanban, List, Flame } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/common/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Avatar } from "@/components/os/ui/Avatar";
import { TemperatureBadge, Badge } from "@/components/os/ui/Badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/os/ui/Select";
import { formatKES } from "@/lib/os/money";
import { timeAgo, daysBetween } from "@/lib/os/dates";
import { PIPELINE_STAGES, STAGE_LABEL } from "@/lib/os/pipeline";
import { updateDealStageAction } from "@/server/actions/deals";
import { CreateDealSheet } from "./CreateDealSheet";
import { LostDealDialog } from "./LostDealDialog";

export type DealWithRelations = Deal & { company: Company; owner: User | null };

const STALL_DAYS = 7;

function isStalled(deal: DealWithRelations): boolean {
  if (deal.stage === "WON" || deal.stage === "LOST") return false;
  return daysBetween(deal.stageEnteredAt) > STALL_DAYS;
}

export function PipelineView({
  initialDeals,
  users,
  products,
  currentUserId,
  openCreateOnLoad,
  canCreate,
}: {
  initialDeals: DealWithRelations[];
  users: User[];
  products: Product[];
  currentUserId: string;
  openCreateOnLoad: boolean;
  canCreate: boolean;
}) {
  const router = useRouter();
  const [deals, setDeals] = useState(initialDeals);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [createOpen, setCreateOpen] = useState(openCreateOnLoad);
  const [dragDealId, setDragDealId] = useState<string | null>(null);
  const [lostTarget, setLostTarget] = useState<DealWithRelations | null>(null);

  const pipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const stalledCount = deals.filter(isStalled).length;

  const byStage = useMemo(() => {
    const map = new Map<string, DealWithRelations[]>();
    for (const s of PIPELINE_STAGES) map.set(s, []);
    for (const d of deals) map.get(d.stage)?.push(d);
    return map;
  }, [deals]);

  async function moveStage(deal: DealWithRelations, stage: string) {
    if (stage === "LOST_TARGET") { setLostTarget(deal); return; }
    if (stage === deal.stage) return;
    setDeals(prev => prev.map(d => (d.id === deal.id ? { ...d, stage, stageEnteredAt: new Date() } : d)));
    try {
      await updateDealStageAction(deal.id, stage);
      if (stage === "WON") toast.success(`${deal.company.name} — deal won! 🎉`);
    } catch {
      toast.error("Couldn't move that deal — reverting");
      setDeals(prev => prev.map(d => (d.id === deal.id ? deal : d)));
    }
  }

  function onDealLost(dealId: string, reason: string) {
    setDeals(prev => prev.map(d => (d.id === dealId ? { ...d, stage: "LOST", lostReason: reason } : d)).filter(d => d.stage !== "LOST"));
  }

  function onCreated(deal: DealWithRelations) {
    setDeals(prev => [deal, ...prev]);
    setCreateOpen(false);
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Deals"
        subtitle={`${deals.length} active · ${formatKES(pipelineValue, { compact: true })} in pipeline${stalledCount ? ` · ${stalledCount} stalled` : ""}`}
        actions={
          <>
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
              {(["kanban", "list"] as const).map(v => {
                const Icon = v === "kanban" ? Kanban : List;
                return (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-colors capitalize"
                    style={{ background: view === v ? "var(--surface)" : "transparent", color: view === v ? "var(--text)" : "var(--text-faint)" }}
                  >
                    <Icon className="w-3.5 h-3.5" /> {v}
                  </button>
                );
              })}
            </div>
            {canCreate && (
              <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
                <Plus className="w-4 h-4" /> New Deal
              </Button>
            )}
          </>
        }
      />

      {/* Desktop kanban */}
      <div className="hidden lg:block mt-6">
        {view === "kanban" ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {PIPELINE_STAGES.map(stage => (
              <StageColumn
                key={stage}
                stage={stage}
                deals={byStage.get(stage) ?? []}
                dragDealId={dragDealId}
                onDragStart={setDragDealId}
                onDrop={(deal) => moveStage(deal, stage)}
                onCardClick={(id) => router.push(`/app/deals/${id}`)}
                onMarkLost={(deal) => setLostTarget(deal)}
              />
            ))}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={() => {
                const deal = deals.find(d => d.id === dragDealId);
                if (deal) setLostTarget(deal);
                setDragDealId(null);
              }}
              className="w-56 shrink-0 rounded-[var(--radius-lg)] border-2 border-dashed flex flex-col items-center justify-center py-10 text-center"
              style={{ borderColor: "var(--border-strong)" }}
            >
              <p className="text-xs font-semibold text-[var(--text-faint)]">Drop here to mark</p>
              <p className="text-xs font-semibold text-[var(--text-faint)]">as Lost</p>
            </div>
          </div>
        ) : (
          <DealListTable deals={deals} onRowClick={(id) => router.push(`/app/deals/${id}`)} onMoveStage={moveStage} />
        )}
      </div>

      {/* Mobile: stage-grouped list */}
      <div className="lg:hidden mt-6 space-y-6">
        {PIPELINE_STAGES.map(stage => {
          const stageDeals = byStage.get(stage) ?? [];
          if (stageDeals.length === 0) return null;
          return (
            <div key={stage}>
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">{STAGE_LABEL[stage]}</span>
                <span className="text-xs text-[var(--text-faint)]">{stageDeals.length}</span>
              </div>
              <div className="space-y-2.5">
                {stageDeals.map(deal => (
                  <MobileDealCard key={deal.id} deal={deal} onClick={() => router.push(`/app/deals/${deal.id}`)} onMoveStage={moveStage} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <CreateDealSheet open={createOpen} onOpenChange={setCreateOpen} users={users} products={products} currentUserId={currentUserId} onCreated={onCreated} />
      <LostDealDialog
        dealId={lostTarget?.id ?? null}
        dealTitle={lostTarget?.title}
        open={!!lostTarget}
        onOpenChange={(v) => !v && setLostTarget(null)}
        onLost={onDealLost}
      />
    </div>
  );
}

function StageColumn({
  stage, deals, dragDealId, onDragStart, onDrop, onCardClick, onMarkLost,
}: {
  stage: string;
  deals: DealWithRelations[];
  dragDealId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (deal: DealWithRelations) => void;
  onCardClick: (id: string) => void;
  onMarkLost: (deal: DealWithRelations) => void;
}) {
  const [over, setOver] = useState(false);
  const stageValue = deals.reduce((s, d) => s + d.value, 0);

  return (
    <div
      className="w-64 shrink-0"
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={() => {
        setOver(false);
        const deal = deals.find(d => d.id === dragDealId) ?? null;
        if (deal) onDrop(deal);
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-[var(--text)]">{STAGE_LABEL[stage]}</span>
        <span className="text-[11px] text-[var(--text-faint)]">{deals.length} · {formatKES(stageValue, { compact: true })}</span>
      </div>
      <div
        className="space-y-2.5 min-h-24 rounded-[var(--radius-lg)] p-1.5 transition-colors"
        style={{ background: over ? "var(--accent-soft)" : "transparent" }}
      >
        {deals.map(deal => (
          <DealCard key={deal.id} deal={deal} draggable onDragStart={() => onDragStart(deal.id)} onClick={() => onCardClick(deal.id)} onMarkLost={() => onMarkLost(deal)} />
        ))}
        {deals.length === 0 && (
          <div className="rounded-[var(--radius-md)] border-2 border-dashed h-16 flex items-center justify-center" style={{ borderColor: "var(--border)" }}>
            <span className="text-[11px] text-[var(--text-faint)]">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DealCard({
  deal, draggable, onDragStart, onClick, onMarkLost,
}: {
  deal: DealWithRelations;
  draggable?: boolean;
  onDragStart?: () => void;
  onClick: () => void;
  onMarkLost: () => void;
}) {
  const stalled = isStalled(deal);
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      className="rounded-[var(--radius-lg)] p-3.5 cursor-pointer transition-shadow hover:shadow-[var(--shadow-sm)]"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-xs font-semibold text-[var(--text)] leading-tight">{deal.company.name}</p>
        <TemperatureBadge temperature={deal.temperature} />
      </div>
      <p className="text-[11px] text-[var(--text-faint)] mb-2.5 line-clamp-2">{deal.title}</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{formatKES(deal.value, { compact: true })}</span>
        {deal.owner && <Avatar name={deal.owner.name} color={deal.owner.avatarColor} size={22} />}
      </div>
      <div className="flex items-center justify-between text-[10px] text-[var(--text-faint)]">
        <span>{deal.nextAction ? deal.nextAction : "No next action"}</span>
        {stalled && (
          <span
            className="flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
            onClick={(e) => { e.stopPropagation(); onMarkLost(); }}
          >
            <Flame className="w-2.5 h-2.5" /> {daysBetween(deal.stageEnteredAt)}d
          </span>
        )}
      </div>
    </div>
  );
}

function MobileDealCard({
  deal, onClick, onMoveStage,
}: {
  deal: DealWithRelations;
  onClick: () => void;
  onMoveStage: (deal: DealWithRelations, stage: string) => void;
}) {
  return (
    <div
      className="rounded-[var(--radius-lg)] p-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div onClick={onClick}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-[var(--text)]">{deal.company.name}</p>
          <TemperatureBadge temperature={deal.temperature} />
        </div>
        <p className="text-xs text-[var(--text-faint)] mb-2">{deal.title}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{formatKES(deal.value, { compact: true })}</span>
          <span className="text-[11px] text-[var(--text-faint)]">{timeAgo(deal.lastContactAt ?? deal.createdAt)}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }} onClick={e => e.stopPropagation()}>
        <Select value={deal.stage} onValueChange={(v) => (v === "LOST" ? onMoveStage(deal, "LOST_TARGET") : onMoveStage(deal, v))}>
          <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PIPELINE_STAGES.map(s => <SelectItem key={s} value={s}>{STAGE_LABEL[s]}</SelectItem>)}
            <SelectItem value="LOST">Mark Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function DealListTable({
  deals, onRowClick, onMoveStage,
}: {
  deals: DealWithRelations[];
  onRowClick: (id: string) => void;
  onMoveStage: (deal: DealWithRelations, stage: string) => void;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--border)" }}>
            {["Company", "Opportunity", "Value", "Owner", "Temp", "Stage", "Days in stage"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deals.map(d => (
            <tr key={d.id} className="border-b last:border-0 cursor-pointer hover:bg-[var(--surface-hover)]" style={{ borderColor: "var(--border)" }} onClick={() => onRowClick(d.id)}>
              <td className="px-4 py-3 font-medium text-[var(--text)]">{d.company.name}</td>
              <td className="px-4 py-3 text-[var(--text-muted)]">{d.title}</td>
              <td className="px-4 py-3 font-bold" style={{ color: "var(--accent)" }}>{formatKES(d.value, { compact: true })}</td>
              <td className="px-4 py-3">{d.owner && <Avatar name={d.owner.name} color={d.owner.avatarColor} size={22} />}</td>
              <td className="px-4 py-3"><TemperatureBadge temperature={d.temperature} /></td>
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <Select value={d.stage} onValueChange={(v) => (v === "LOST" ? onMoveStage(d, "LOST_TARGET") : onMoveStage(d, v))}>
                  <SelectTrigger className="h-8 text-xs w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PIPELINE_STAGES.map(s => <SelectItem key={s} value={s}>{STAGE_LABEL[s]}</SelectItem>)}
                    <SelectItem value="LOST">Mark Lost</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-4 py-3">
                {isStalled(d) ? <Badge tone="danger">{daysBetween(d.stageEnteredAt)}d — stalled</Badge> : <span className="text-xs text-[var(--text-faint)]">{daysBetween(d.stageEnteredAt)}d</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
