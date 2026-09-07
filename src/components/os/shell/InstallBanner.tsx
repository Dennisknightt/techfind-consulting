"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/os/ui/Button";
import { useInstallPrompt, isStandalone } from "@/lib/os/useInstallPrompt";
import { IosInstallSteps } from "./IosInstallSteps";

const DISMISS_KEY = "techfind_install_dismissed";

export function InstallBanner() {
  const { canPromptInstall, isIOS, installed, promptInstall } = useInstallPrompt();
  const [visible, setVisible] = useState(false);
  const [showIosSteps, setShowIosSteps] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY)) return;

    // Show once we know either Chrome-style install is available, or we're on iOS
    // (where Share → Add to Home Screen is the only real mechanism). Re-checked
    // shortly after for the beforeinstallprompt race (event can arrive after mount).
    const timer = setTimeout(() => { if (canPromptInstall || isIOS) setVisible(true); }, 1400);
    const recheck = setTimeout(() => setVisible(v => v || canPromptInstall || isIOS), 2600);

    return () => { clearTimeout(timer); clearTimeout(recheck); };
  }, [canPromptInstall, isIOS]);

  useEffect(() => {
    if (installed) { setVisible(false); localStorage.setItem(DISMISS_KEY, "1"); }
  }, [installed]);

  function dismiss() {
    setVisible(false);
    setShowIosSteps(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  async function install() {
    if (canPromptInstall) {
      const outcome = await promptInstall();
      if (outcome === "accepted") { setVisible(false); localStorage.setItem(DISMISS_KEY, "1"); }
      return;
    }
    if (isIOS) setShowIosSteps(true);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[260] w-[calc(100vw-2rem)] max-w-sm os-animate-in"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 4.25rem)" }}
    >
      <div
        className="rounded-[var(--radius-xl)] p-4 border"
        style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}
      >
        {!showIosSteps ? (
          <>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
                style={{ background: "var(--accent)" }}
              >
                <Download className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--text)]">Take Techfind with you.</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                  Install Techfind for faster access to customers, leads, payments and today&rsquo;s priorities.
                </p>
              </div>
              <button onClick={dismiss} className="shrink-0 text-[var(--text-faint)] hover:text-[var(--text)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3.5">
              <Button size="sm" onClick={install} className="flex-1">Install Techfind</Button>
              <Button size="sm" variant="ghost" onClick={dismiss}>Maybe Later</Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <p className="text-sm font-bold text-[var(--text)]">Add Techfind to your Home Screen</p>
              <button onClick={dismiss} className="shrink-0 text-[var(--text-faint)] hover:text-[var(--text)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3"><IosInstallSteps /></div>
            <Button size="sm" variant="secondary" onClick={dismiss} className="w-full mt-3.5">Got it</Button>
          </>
        )}
      </div>
    </div>
  );
}
