"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, Check } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from "@/components/os/ui/Sheet";
import { useInstallPrompt, isStandalone } from "@/lib/os/useInstallPrompt";
import { useHasUnseenChangelog } from "@/lib/os/useChangelogSeen";
import { IosInstallSteps } from "./IosInstallSteps";
import { SECONDARY_NAV, SECONDARY_NAV_GROUPS } from "./nav";

export function MoreSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const unseenChangelog = useHasUnseenChangelog();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>All modules</SheetTitle>
        </SheetHeader>
        <SheetBody className="pb-8 space-y-6">
          <AppModule />

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
                        <p className="os-text-body font-medium flex items-center gap-1.5" style={{ color: "var(--text)" }}>
                          {label}
                          {href === "/app/whats-new" && unseenChangelog && (
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--danger)" }} />
                          )}
                        </p>
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

/**
 * A permanent "App" module, always reachable from the same place as every
 * other module — rather than only a transient banner someone can dismiss
 * once and never see the install option again.
 */
function AppModule() {
  const { canPromptInstall, isIOS, installed, promptInstall } = useInstallPrompt();
  const [iosSteps, setIosSteps] = useState(false);
  const alreadyInstalled = installed || isStandalone();

  async function handleClick() {
    if (alreadyInstalled) return;
    if (canPromptInstall) { await promptInstall(); return; }
    if (isIOS) { setIosSteps(true); return; }
    toast.info("Open this page in Chrome or Samsung Internet to install the app");
  }

  return (
    <div>
      <p className="os-text-meta font-semibold uppercase tracking-wider px-1 mb-2">App</p>
      {iosSteps ? (
        <div className="rounded-[var(--radius-lg)] border p-4" style={{ borderColor: "var(--border)" }}>
          <IosInstallSteps />
          <button onClick={() => setIosSteps(false)} className="text-xs font-semibold mt-3.5" style={{ color: "var(--accent)" }}>
            Back
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={alreadyInstalled}
          className="os-row-hover os-press flex items-center gap-3 w-full px-4 py-3 rounded-[var(--radius-lg)] border text-left disabled:opacity-70"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
            style={{ background: alreadyInstalled ? "var(--success-soft)" : "var(--surface-hover)" }}
          >
            {alreadyInstalled ? (
              <Check className="w-4 h-4" style={{ color: "var(--success)" }} />
            ) : (
              <Download className="w-4 h-4" style={{ color: "var(--accent)" }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="os-text-body font-medium" style={{ color: "var(--text)" }}>
              {alreadyInstalled ? "App installed" : "Install App"}
            </p>
            <p className="os-text-meta mt-0.5 truncate">
              {alreadyInstalled ? "You're using the installed version" : "Add Techfind to your home screen"}
            </p>
          </div>
          {!alreadyInstalled && <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--text-faint)" }} />}
        </button>
      )}
    </div>
  );
}
