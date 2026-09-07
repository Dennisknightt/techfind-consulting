"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody } from "@/components/os/ui/Sheet";
import { Button } from "@/components/os/ui/Button";
import { RequestPaymentButton } from "@/components/os/payments/RequestPaymentButton";
import { formatKES } from "@/lib/os/money";

export interface OwingDoc {
  id: string;
  number: string;
  balance: number;
  paidAmount: number;
  companyName: string;
}

/**
 * The Money view's answer to "who owes us, and can I ask them right now" —
 * the aggregate line plus a sheet where each outstanding invoice gets its
 * own one-tap Request. There's no silent bulk-send: WhatsApp has no
 * server-side send API here, so each request is still a deliberate tap,
 * just without leaving this screen or re-finding the client.
 */
export function OutstandingClientsCallout({ docs }: { docs: OwingDoc[] }) {
  const [open, setOpen] = useState(false);
  if (docs.length === 0) return null;

  const clientCount = new Set(docs.map(d => d.companyName)).size;
  const total = docs.reduce((s, d) => s + d.balance, 0);

  return (
    <>
      <div className="mt-6 rounded-[var(--radius-lg)] p-4 flex items-center justify-between gap-3 flex-wrap" style={{ background: "var(--warning-soft)" }}>
        <p className="text-sm" style={{ color: "var(--warning)" }}>
          <strong>{clientCount} client{clientCount === 1 ? "" : "s"}</strong> owe <strong>{formatKES(total, { compact: true })}</strong>
        </p>
        <Button size="sm" onClick={() => setOpen(true)}>Request Payments</Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Outstanding balances</SheetTitle>
            <SheetDescription>Send a request to each — one tap, nothing goes out silently.</SheetDescription>
          </SheetHeader>
          <SheetBody className="space-y-2">
            {docs.map(d => (
              <div key={d.id} className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[var(--radius-md)]" style={{ background: "var(--surface-hover)" }}>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{d.companyName}</p>
                  <p className="os-text-meta">{d.number} · {formatKES(d.balance, { compact: true })}</p>
                </div>
                <RequestPaymentButton documentId={d.id} label={d.paidAmount > 0 ? "Balance" : "Request"} size="sm" variant="secondary" />
              </div>
            ))}
          </SheetBody>
        </SheetContent>
      </Sheet>
    </>
  );
}
