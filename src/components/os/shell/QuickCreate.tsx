"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Users, Handshake, CheckSquare2, CalendarDays, Building2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/os/ui/DropdownMenu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from "@/components/os/ui/Sheet";
import { Button } from "@/components/os/ui/Button";
import { Plus } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/os/motion";

// Each action gets its own tone so the list scans by color, not just by
// re-reading labels — a document is violet, a person is info-blue, revenue
// is success-green, and so on. `soft` is the matching pre-mixed background.
export const QUICK_CREATE_ITEMS = [
  { label: "Proforma", sub: "Ready to send in ~30 seconds", href: "/app/quotes/new", icon: FileText, color: "var(--accent)", soft: "var(--accent-soft)" },
  { label: "Lead",     sub: "Capture a new prospect",        href: "/app/leads?new=1", icon: Users, color: "var(--info)", soft: "var(--info-soft)" },
  { label: "Deal",     sub: "Start an opportunity",          href: "/app/deals?new=1", icon: Handshake, color: "var(--success)", soft: "var(--success-soft)" },
  { label: "Task",     sub: "Something to follow up on",     href: "/app/tasks?new=1", icon: CheckSquare2, color: "var(--warning)", soft: "var(--warning-soft)" },
  { label: "Meeting",  sub: "Schedule time with a client",   href: "/app/meetings?new=1", icon: CalendarDays, color: "var(--accent-2)", soft: "var(--accent-2-soft)" },
  { label: "Client",   sub: "Onboard a company",             href: "/app/clients?new=1", icon: Building2, color: "var(--cold)", soft: "color-mix(in srgb, var(--cold) 14%, transparent)" },
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
        {QUICK_CREATE_ITEMS.map(({ label, sub, href, icon: Icon, color }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href} className="flex items-start gap-2.5 py-2">
              <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
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
        <SheetBody className="pb-6">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-1.5">
            {QUICK_CREATE_ITEMS.map(({ label, sub, href, icon: Icon, color, soft }) => (
              <motion.div key={href} variants={staggerItem}>
                <Link
                  href={href}
                  onClick={() => onOpenChange(false)}
                  className="os-card-hover os-press flex items-center gap-3 p-3.5 rounded-[var(--radius-lg)] border"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0" style={{ background: soft }}>
                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <span className="min-w-0">
                    <span className="block font-semibold text-sm text-[var(--text)]">{label}</span>
                    <span className="block text-xs text-[var(--text-faint)] truncate">{sub}</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
