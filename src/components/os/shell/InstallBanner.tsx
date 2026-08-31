"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { Button } from "@/components/os/ui/Button";

const DISMISS_KEY = "techfind_install_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !("MSStream" in window);
}

export function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showIosSteps, setShowIosSteps] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY)) return;

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setVisible(false);
      localStorage.setItem(DISMISS_KEY, "1");
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    const ios = isIOS();
    const timer = setTimeout(() => {
      // Show once we know either Chrome-style install is available, or we're on iOS
      // (where Share → Add to Home Screen is the only real mechanism).
      if (deferred || ios) setVisible(true);
    }, 1400);

    // Re-check shortly after for the beforeinstallprompt race (event can arrive after mount).
    const recheck = setTimeout(() => setVisible(v => v || Boolean(deferred) || ios), 2600);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      clearTimeout(timer);
      clearTimeout(recheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss() {
    setVisible(false);
    setShowIosSteps(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  async function install() {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
        localStorage.setItem(DISMISS_KEY, "1");
      }
      setDeferred(null);
      return;
    }
    if (isIOS()) {
      setShowIosSteps(true);
    }
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
            <ol className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>1</span>
                Tap the <Share className="w-3.5 h-3.5 inline mx-0.5" /> Share icon in Safari
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>2</span>
                Scroll down and tap <strong className="text-[var(--text)]">&ldquo;Add to Home Screen&rdquo;</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>3</span>
                Tap <strong className="text-[var(--text)]">Add</strong> to confirm
              </li>
            </ol>
            <Button size="sm" variant="secondary" onClick={dismiss} className="w-full mt-3.5">Got it</Button>
          </>
        )}
      </div>
    </div>
  );
}
