"use client";

import type { Product } from "@prisma/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from "@/components/os/ui/Sheet";
import { WonPanel, LostPanel } from "./LeadTiles";

export function WonSheet({ open, onOpenChange, leadId, leadValue, products, onWon }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  leadId: string | null;
  leadValue: number;
  products: Product[];
  onWon: (leadId: string, dealId: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="sm:max-w-lg sm:mx-auto sm:left-0 sm:right-0">
        <SheetHeader><SheetTitle>Mark Won</SheetTitle></SheetHeader>
        <SheetBody>
          {leadId && (
            <WonPanel leadId={leadId} defaultValue={leadValue} products={products} onWon={dealId => onWon(leadId, dealId)} />
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

export function LostSheet({ open, onOpenChange, leadId, onLost }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  leadId: string | null;
  onLost: (leadId: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="sm:max-w-lg sm:mx-auto sm:left-0 sm:right-0">
        <SheetHeader><SheetTitle>Mark Lost</SheetTitle></SheetHeader>
        <SheetBody>
          {leadId && <LostPanel leadId={leadId} onLost={() => onLost(leadId)} />}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
