"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from "@/components/os/ui/Sheet";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["⌘", "K"], label: "Search or jump anywhere" },
  { keys: ["C"], label: "Quick create" },
  { keys: ["?"], label: "Show this list" },
  { keys: ["Esc"], label: "Close any panel" },
  { keys: ["↑", "↓"], label: "Move through a list" },
  { keys: ["↵"], label: "Select the highlighted item" },
];

export function ShortcutsHelpSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="sm:max-w-md sm:mx-auto sm:left-0 sm:right-0">
        <SheetHeader>
          <SheetTitle>Keyboard shortcuts</SheetTitle>
        </SheetHeader>
        <SheetBody className="space-y-1 pb-8">
          {SHORTCUTS.map(({ keys, label }) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              <span className="os-text-body" style={{ color: "var(--text)" }}>{label}</span>
              <span className="flex items-center gap-1 shrink-0">
                {keys.map(k => (
                  <kbd
                    key={k}
                    className="min-w-[1.5rem] text-center text-[11px] font-semibold px-1.5 py-0.5 rounded border"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface-hover)" }}
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </div>
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
