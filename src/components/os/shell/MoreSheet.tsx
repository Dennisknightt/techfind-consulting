"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from "@/components/os/ui/Sheet";
import { SECONDARY_NAV, SECONDARY_NAV_GROUPS } from "./nav";

export function MoreSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>All modules</SheetTitle>
        </SheetHeader>
        <SheetBody className="pb-8 space-y-6">
          {SECONDARY_NAV_GROUPS.map(group => {
            const items = SECONDARY_NAV.filter(item => item.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <p className="os-text-meta font-semibold uppercase tracking-wider px-1 mb-2">{group}</p>
                <div className="rounded-[var(--radius-lg)] border divide-y" style={{ borderColor: "var(--border)" }}>
                  {items.map(({ label, href, icon: Icon, description }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => onOpenChange(false)}
                      className="os-row-hover os-press flex items-center gap-3 px-4 py-3"
                    >
                      <div
                        className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
                        style={{ background: "var(--surface-hover)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="os-text-body font-medium" style={{ color: "var(--text)" }}>{label}</p>
                        <p className="os-text-meta mt-0.5 truncate">{description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--text-faint)" }} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
