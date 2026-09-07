"use client";

/**
 * The universal ~5-10s Quick Update panel — stage, temperature and next
 * action in one place, reachable from a lead card or the lead detail page.
 * Every tile persists immediately (see LeadTiles.tsx); this sheet is just a
 * frame around them, it holds no state of its own that isn't already real.
 */

import type { Lead } from "@prisma/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from "@/components/os/ui/Sheet";
import { Label } from "@/components/os/ui/Input";
import { StageTiles, TemperatureTiles, NextActionPanel } from "./LeadTiles";
import { isLeadOpen } from "@/lib/os/leadStage";

export function QuickUpdateSheet({ open, onOpenChange, lead, onUpdated }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lead: Lead | null;
  onUpdated: (id: string, patch: Partial<Lead>) => void;
}) {
  if (!lead) return null;
  const open_ = isLeadOpen(lead.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="sm:max-w-lg sm:mx-auto sm:left-0 sm:right-0">
        <SheetHeader>
          <SheetTitle>{lead.name}</SheetTitle>
        </SheetHeader>
        <SheetBody className="space-y-6">
          {!open_ ? (
            <p className="os-text-body" style={{ color: "var(--text-muted)" }}>
              This lead is {lead.status === "CONVERTED" ? "already Won" : "closed"} — reopen it from the lead page to keep working it.
            </p>
          ) : (
            <>
              <div>
                <Label>Stage</Label>
                <div className="mt-1.5">
                  <StageTiles leadId={lead.id} status={lead.status} onUpdated={p => onUpdated(lead.id, p)} />
                </div>
              </div>
              <div>
                <Label>Temperature</Label>
                <div className="mt-1.5">
                  <TemperatureTiles leadId={lead.id} temperature={lead.temperature} onUpdated={p => onUpdated(lead.id, p)} />
                </div>
              </div>
              <div>
                <Label>Next action</Label>
                <div className="mt-1.5">
                  <NextActionPanel
                    leadId={lead.id}
                    nextActionType={lead.nextActionType}
                    nextActionDue={lead.nextActionDue}
                    nextAction={lead.nextAction}
                    onUpdated={p => onUpdated(lead.id, p)}
                  />
                </div>
              </div>
            </>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
