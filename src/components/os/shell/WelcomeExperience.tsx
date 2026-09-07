"use client";

import { useEffect, useState } from "react";
import { playSonicLogo } from "@/lib/os/sonicLogo";

const SESSION_KEY = "techfind_welcomed_v1";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function WelcomeExperience({
  firstName,
  soundEnabled,
  volume,
}: {
  firstName: string;
  soundEnabled: boolean;
  volume: number;
}) {
  const [phase, setPhase] = useState<"hidden" | "logo" | "greeting" | "out">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Note: React Strict Mode double-invokes effects in dev (mount → cleanup
    // → mount). Marking sessionStorage here (rather than only at the very
    // end) would let the throwaway first pass "consume" the guard while its
    // own timers get cancelled by cleanup, leaving the real second pass
    // permanently skipped and the overlay stuck. Only write the flag once
    // the sequence actually completes, so a cancelled pass leaves no trace.
    setPhase("logo");
    if (soundEnabled) playSonicLogo(volume);

    const t1 = setTimeout(() => setPhase("greeting"), 550);
    const t2 = setTimeout(() => setPhase("out"), 1750);
    const t3 = setTimeout(() => {
      setPhase("hidden");
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 2150);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center transition-opacity duration-300"
      style={{
        background: "var(--bg)",
        opacity: phase === "out" ? 0 : 1,
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
    >
      <div className="flex flex-col items-center gap-5 text-center px-6">
        <img
          src="/os-icons/icon-256.png"
          alt="Techfind"
          className="w-14 h-14 rounded-2xl transition-all duration-500"
          style={{
            boxShadow: "var(--shadow-glow)",
            transform: phase === "logo" ? "scale(0.85)" : "scale(1)",
            opacity: 1,
          }}
        />

        <p
          className="text-xl font-semibold text-[var(--text)] transition-all duration-500"
          style={{
            fontFamily: "var(--font-space)",
            opacity: phase === "greeting" || phase === "out" ? 1 : 0,
            transform: phase === "greeting" || phase === "out" ? "translateY(0)" : "translateY(6px)",
          }}
        >
          {greeting()}, {firstName}.
        </p>
      </div>
    </div>
  );
}
