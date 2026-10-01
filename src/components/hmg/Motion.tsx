"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One small controller drives scroll-linked behaviour with plain DOM APIs.
 *
 * Content is visible by default. On mount, only [data-reveal] elements that sit
 * BELOW the current viewport are marked `.rv` (hidden state); they are revealed
 * well before they enter the screen (positive rootMargin) with short transitions,
 * so fast scrolling never lands on blank space. If JS or IntersectionObserver
 * fails, nothing is ever hidden.
 *
 *   [data-reveal]       .rv → .is-in
 *   [data-scroll-path]  sets --p (0..1) and toggles .is-active on [data-step]
 *   [data-loop]         .is-live only while on screen (pauses looping CSS)
 *   [data-magnetic]     small pointer nudge on fine-pointer devices
 *   --sp                page scroll progress for the header hairline
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = "IntersectionObserver" in window;
    const cleanups: Array<() => void> = [];
    const vh = window.innerHeight;

    // --- reveals (below the fold only) ---
    if (!reduced && hasIO) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              // Arrived by a fast jump (already deep in view)? Show it almost instantly.
              if (e.boundingClientRect.top < window.innerHeight * 0.8) e.target.classList.add("rv-fast");
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px 12% 0px" },
      );
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.getBoundingClientRect().top > vh * 1.02) {
          el.classList.add("rv");
          io.observe(el);
        }
      });
      // Safety net: anything still pending once it is on screen is shown at once.
      const sweep = () => {
        document.querySelectorAll<HTMLElement>(".rv:not(.is-in)").forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("rv-fast", "is-in");
        });
      };
      window.addEventListener("scrollend", sweep);
      cleanups.push(() => {
        io.disconnect();
        window.removeEventListener("scrollend", sweep);
      });
    }

    // --- looping animations: live only while visible ---
    if (!reduced && hasIO) {
      const lio = new IntersectionObserver((entries) => {
        for (const e of entries) e.target.classList.toggle("is-live", e.isIntersecting);
      });
      document.querySelectorAll<HTMLElement>("[data-loop]").forEach((el) => lio.observe(el));
      cleanups.push(() => lio.disconnect());
    }

    // --- scroll progress + scroll path, one rAF-throttled listener ---
    const paths = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-path]"));
    const wide = window.matchMedia("(min-width: 900px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight;
      const max = document.documentElement.scrollHeight - h;
      document.documentElement.style.setProperty("--sp", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : "0");
      for (const root of paths) {
        const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
        let p = 1;
        if (reduced) {
          steps.forEach((s) => s.classList.add("is-active"));
        } else if (wide.matches) {
          const r = root.getBoundingClientRect();
          p = Math.min(1, Math.max(0, (h * 0.85 - r.top) / (r.height * 0.8)));
          steps.forEach((s, i) => s.classList.toggle("is-active", p >= i / Math.max(1, steps.length - 1) - 0.06));
        } else {
          const y = h * 0.72;
          const a = steps[0]?.getBoundingClientRect().top ?? 0;
          const b = steps[steps.length - 1]?.getBoundingClientRect().top ?? 1;
          p = b > a ? Math.min(1, Math.max(0, (y - a) / (b - a))) : 1;
          steps.forEach((s) => s.classList.toggle("is-active", s.getBoundingClientRect().top < y));
        }
        root.style.setProperty("--p", p.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    });

    // --- magnetic buttons (fine pointers only) ---
    if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      let current: HTMLElement | null = null;
      const move = (e: PointerEvent) => {
        const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
        if (el !== current) {
          if (current) current.style.transform = "";
          current = el;
        }
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = `translate(${(dx * 8).toFixed(1)}px, ${(dy * 6).toFixed(1)}px)`;
      };
      document.addEventListener("pointermove", move, { passive: true });
      cleanups.push(() => {
        document.removeEventListener("pointermove", move);
        if (current) current.style.transform = "";
      });
    }

    return () => cleanups.forEach((c) => c());
  }, [pathname]);

  return null;
}
