"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return; // Admin has its own fixed scroll container

    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let rafId: number;

    const initLenis = async () => {
      try {
        const { default: Lenis } = await import("lenis");
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        } as ConstructorParameters<typeof Lenis>[0]);

        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {
        // Native scroll fallback
      }
    };

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, [isAdmin]);

  return <>{children}</>;
}
