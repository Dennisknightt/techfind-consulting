"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

export function CustomCursor() {
  const cursorX  = useMotionValue(-100);
  const cursorY  = useMotionValue(-100);
  const dotX     = useMotionValue(-100);
  const dotY     = useMotionValue(-100);
  const hovering = useRef(false);
  const ringRef  = useRef<HTMLDivElement>(null);

  const springConfig = { damping: 28, stiffness: 320 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    /* Single mousemove listener — passive, no setState, no re-renders.
       Hover detection via composedPath instead of a separate mouseover
       event that fires hundreds of times per second. */
    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 18);
      cursorY.set(e.clientY - 18);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);

      const isHovering = !!(
        (e.target as HTMLElement)?.closest?.("a, button, [role='button'], [data-hover]")
      );

      if (isHovering !== hovering.current) {
        hovering.current = isHovering;
        if (ringRef.current) {
          ringRef.current.style.scale = isHovering ? "1.7" : "1";
          ringRef.current.style.opacity = isHovering ? "0.7" : "0.4";
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      {/* Ring — no Framer animate prop; scale driven by direct DOM ref */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 pointer-events-none z-[9999] rounded-full border hidden md:block"
        style={{
          x: springX,
          y: springY,
          borderColor: "var(--accent)",
          opacity: 0.4,
          transition: "scale 0.18s ease, opacity 0.18s ease",
        }}
      />
      {/* Dot — instant, no spring needed */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-[9999] rounded-full hidden md:block"
        style={{ x: dotX, y: dotY, background: "var(--accent)" }}
      />
    </>
  );
}
