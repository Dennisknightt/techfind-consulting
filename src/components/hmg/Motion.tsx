"use client";

import { useEffect } from "react";

/**
 * One small controller drives every scroll-linked behaviour on the page, using
 * plain DOM + IntersectionObserver so no animation library ships to the client:
 *   [data-reveal]       fades/slides in once, adds .is-in
 *   [data-count]        counts up (data-from → data-to) when visible
 *   [data-scroll-path]  sets --p (0..1) and toggles .is-active on [data-step]
 *   [data-magnetic]     nudges toward the pointer on fine-pointer devices
 * With prefers-reduced-motion, everything resolves to its final state.
 */
export function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    // --- reveals ---
    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (reduced || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
      );
      reveals.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    // --- counters ---
    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    if (!reduced && "IntersectionObserver" in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target as HTMLElement;
            cio.unobserve(el);
            const from = Number(el.dataset.from ?? 0);
            const to = Number(el.dataset.count);
            const t0 = performance.now();
            const dur = 1500;
            const tick = (t: number) => {
              const k = Math.min(1, (t - t0) / dur);
              const eased = 1 - Math.pow(1 - k, 3);
              el.textContent = String(Math.round(from + (to - from) * eased));
              if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        },
        { threshold: 0.6 },
      );
      counters.forEach((el) => {
        el.textContent = el.dataset.from ?? "0";
        cio.observe(el);
      });
      cleanups.push(() => cio.disconnect());
    }

    // --- scroll path ---
    const paths = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-path]"));
    if (paths.length) {
      const wide = window.matchMedia("(min-width: 900px)");
      let raf = 0;
      const update = () => {
        raf = 0;
        const vh = window.innerHeight;
        for (const root of paths) {
          const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
          const r = root.getBoundingClientRect();
          let p: number;
          if (reduced) {
            p = 1;
            steps.forEach((s) => s.classList.add("is-active"));
          } else if (wide.matches) {
            p = Math.min(1, Math.max(0, (vh * 0.78 - r.top) / (r.height * 0.9)));
            const p2 = Math.min(1, p * 1.12);
            steps.forEach((s, i) => s.classList.toggle("is-active", p2 >= i / (steps.length - 1) - 0.04));
            p = p2;
          } else {
            const first = steps[0]?.getBoundingClientRect();
            const last = steps[steps.length - 1]?.getBoundingClientRect();
            const y = vh * 0.65;
            if (first && last) {
              const a = first.top + 14;
              const b = last.top + 14;
              p = Math.min(1, Math.max(0, (y - a) / (b - a)));
            } else p = 0;
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
    }

    // --- magnetic buttons (fine pointers only) ---
    if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      let current: HTMLElement | null = null;
      const reset = (el: HTMLElement | null) => {
        if (el) el.style.transform = "";
      };
      const move = (e: PointerEvent) => {
        const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
        if (el !== current) {
          reset(current);
          current = el;
        }
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = `translate(${(dx * 10).toFixed(1)}px, ${(dy * 8).toFixed(1)}px)`;
      };
      document.addEventListener("pointermove", move, { passive: true });
      cleanups.push(() => {
        document.removeEventListener("pointermove", move);
        reset(current);
      });
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
