"use client";

import Link from "next/link";
import { FileText, Users, Handshake, CheckSquare2, CalendarDays, Building2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/os/ui/DropdownMenu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from "@/components/os/ui/Sheet";
import { Button } from "@/components/os/ui/Button";
import { Plus } from "lucide-react";

export const QUICK_CREATE_ITEMS = [
  { label: "Proforma", sub: "Ready to send in ~30 seconds", href: "/app/quotes/new", icon: FileText },
  { label: "Lead",     sub: "Capture a new prospect",        href: "/app/leads?new=1", icon: Users },
  { label: "Deal",     sub: "Start an opportunity",          href: "/app/deals?new=1", icon: Handshake },
  { label: "Task",     sub: "Something to follow up on",     href: "/app/tasks?new=1", icon: CheckSquare2 },
  { label: "Meeting",  sub: "Schedule time with a client",   href: "/app/meetings?new=1", icon: CalendarDays },
  { label: "Client",   sub: "Onboard a company",             href: "/app/clients?new=1", icon: Building2 },
];

export function QuickCreateMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Quick create</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {QUICK_CREATE_ITEMS.map(({ label, sub, href, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href} className="flex items-start gap-2.5 py-2">
              <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
              <span>
                <span className="block font-medium">{label}</span>
                <span className="block text-xs text-[var(--text-faint)]">{sub}</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function QuickCreateSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick create</SheetTitle>
        </SheetHeader>
        <SheetBody className="space-y-1.5 pb-6">
          {QUICK_CREATE_ITEMS.map(({ label, sub, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 p-3.5 rounded-[var(--radius-lg)]"
              style={{ background: "var(--surface-hover)" }}
            >
              <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0" style={{ background: "var(--accent-soft)" }}>
                <Icon className="w-4.5 h-4.5" style={{ color: "var(--accent)" }} />
              </div>
              <span className="min-w-0">
                <span className="block font-semibold text-sm text-[var(--text)]">{label}</span>
                <span className="block text-xs text-[var(--text-faint)] truncate">{sub}</span>
              </span>
            </Link>
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
