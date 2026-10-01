"use client";

import { useEffect } from "react";

/**
 * Small enhancement layer. It never controls whether content is visible.
 *   [data-loop]  gets .is-live only while on screen, so looping CSS pauses off-screen
 *   --sp         page scroll progress (0..1) for the header hairline
 */
export function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    if (!reduced && "IntersectionObserver" in window) {
      const lio = new IntersectionObserver((entries) => {
        for (const e of entries) e.target.classList.toggle("is-live", e.isIntersecting);
      });
      const observe = () => document.querySelectorAll<HTMLElement>("[data-loop]").forEach((el) => lio.observe(el));
      observe();
      const mo = new MutationObserver(observe); // pick up elements on client-side navigation
      mo.observe(document.getElementById("main") ?? document.body, { childList: true, subtree: true });
      cleanups.push(() => { lio.disconnect(); mo.disconnect(); });
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--sp", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : "0");
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    });

    return () => cleanups.forEach((c) => c());
  }, []);
  return null;
}
