"use client";

/**
 * CustomCursor — pure DOM + requestAnimationFrame implementation.
 *
 * Design principles:
 *  • Zero React state → zero re-renders → no flicker from React lifecycle
 *  • Zero Framer Motion → no spring race conditions, no transform conflicts
 *  • rAF lerp loop → smooth trailing ring, GPU-composited via translate3d
 *  • opacity:0 initially → JS reveals after confirming a real mouse exists
 *  • (hover:hover) and (pointer:fine) check → strict mouse-only detection,
 *    never fires on hybrid touch+mouse or touch-only devices
 *  • Runs on every pathname change → clean listener lifecycle on each route
 *  • willChange:transform → dedicated compositor layer, no layout thrashing
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Linear interpolation — drives the ring's trailing motion */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* Selector that counts as an "interactive" element for ring expansion */
const INTERACTIVE =
  "a, button, [role='button'], input, select, textarea, label, summary, [data-hover]";

export function CustomCursor() {
  const pathname = usePathname();

  useEffect(() => {
    /* ── 1. Guard: skip on admin pages ─────────────────────────── */
    if (pathname?.startsWith("/admin")) return;

    /* ── 2. Guard: skip on touch / stylus devices ───────────────── */
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    /* ── 3. Get DOM nodes (rendered below, never unmount) ──────── */
    const ring = document.getElementById("tf-cursor-ring") as HTMLDivElement | null;
    const dot  = document.getElementById("tf-cursor-dot")  as HTMLDivElement | null;
    if (!ring || !dot) return;

    /* ── 4. Reveal cursor elements ─────────────────────────────── */
    ring.style.opacity = "0.6";
    dot.style.opacity  = "1";

    /* ── 5. Animation state (plain vars — no closures over stale state) */
    let mouseX = -200, mouseY = -200; // where cursor currently is
    let ringX  = -200, ringY  = -200; // where ring currently is (lerped)
    let ringW  = 36;                   // ring diameter
    let isHover = false;
    let rafId: number;

    /* ── 6. rAF loop — runs every frame, drives ring position ─── */
    function tick() {
      ringX = lerp(ringX, mouseX, 0.14);
      ringY = lerp(ringY, mouseY, 0.14);
      ring!.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    /* ── 7. mousemove — updates targets, dot is instant ─────────── */
    function onMove(e: MouseEvent) {
      const cx = e.clientX;
      const cy = e.clientY;

      /* Dot: no lag — set transform directly */
      dot!.style.transform = `translate3d(${cx - 3}px,${cy - 3}px,0)`;

      /* Ring target: offset by half its diameter so it centres on cursor */
      mouseX = cx - ringW / 2;
      mouseY = cy - ringW / 2;

      /* Ring expansion on interactive elements */
      const hovering = !!(e.target as HTMLElement)?.closest?.(INTERACTIVE);
      if (hovering !== isHover) {
        isHover = hovering;
        ringW = hovering ? 54 : 36;
        ring!.style.width  = ringW + "px";
        ring!.style.height = ringW + "px";
        ring!.style.opacity = hovering ? "0.9" : "0.6";
        /* Re-centre immediately after size change */
        mouseX = cx - ringW / 2;
        mouseY = cy - ringW / 2;
      }
    }

    /* ── 8. mouseleave — park elements off-screen ───────────────── */
    function onLeave() {
      mouseX = -200;
      mouseY = -200;
      dot!.style.transform = `translate3d(-200px,-200px,0)`;
      isHover = false;
      ringW = 36;
      ring!.style.width   = "36px";
      ring!.style.height  = "36px";
      ring!.style.opacity = "0.6";
    }

    /* ── 9. Attach listeners ────────────────────────────────────── */
    window.addEventListener("mousemove",  onMove,  { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    /* ── 10. Cleanup on route change / unmount ──────────────────── */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      /* Hide while re-initialising on next pathname */
      if (ring) ring.style.opacity = "0";
      if (dot)  dot.style.opacity  = "0";
    };
  }, [pathname]); // Re-run on EVERY route change for clean listener lifecycle

  /*
   * Render two static divs. They live in the root layout and
   * never unmount — JS drives them entirely via direct DOM mutation.
   * opacity:0 initial state prevents any flash at (-200,-200) before
   * the effect runs.
   */
  return (
    <>
      <div
        id="tf-cursor-ring"
        aria-hidden="true"
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         36,
          height:        36,
          borderRadius:  "50%",
          border:        "1.5px solid var(--accent)",
          opacity:       0,
          pointerEvents: "none",
          zIndex:        9999,
          transform:     "translate3d(-200px,-200px,0)",
          willChange:    "transform",
          transition:    "width 0.15s ease, height 0.15s ease, opacity 0.15s ease",
        }}
      />
      <div
        id="tf-cursor-dot"
        aria-hidden="true"
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         6,
          height:        6,
          borderRadius:  "50%",
          background:    "var(--accent)",
          opacity:       0,
          pointerEvents: "none",
          zIndex:        9999,
          transform:     "translate3d(-200px,-200px,0)",
          willChange:    "transform",
        }}
      />
    </>
  );
}
