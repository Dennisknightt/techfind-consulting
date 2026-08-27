"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from "@/components/os/ui/Sheet";
import { MOBILE_MORE_NAV } from "./nav";

export function MoreSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>More</SheetTitle>
        </SheetHeader>
        <SheetBody className="grid grid-cols-3 gap-3 pb-6">
          {MOBILE_MORE_NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => onOpenChange(false)}
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-[var(--radius-lg)] text-center"
              style={{ background: "var(--surface-hover)" }}
            >
              <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <span className="text-xs font-medium text-[var(--text)]">{label}</span>
            </Link>
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
