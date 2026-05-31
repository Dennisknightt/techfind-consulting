"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const [hovering, setHovering] = useState(false);

  const springConfig = { damping: 28, stiffness: 320 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 18);
      cursorY.set(e.clientY - 18);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!(t.tagName === "A" || t.tagName === "BUTTON" || t.closest("a") || t.closest("button")));
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 pointer-events-none z-[9999] rounded-full border hidden md:block"
        style={{
          x: springX,
          y: springY,
          borderColor: "var(--accent)",
          opacity: 0.4,
          scale: hovering ? 1.7 : 1,
        }}
        animate={{ scale: hovering ? 1.7 : 1 }}
        transition={{ type: "spring", damping: 18, stiffness: 200 }}
      />
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-[9999] rounded-full hidden md:block"
        style={{ x: dotX, y: dotY, background: "var(--accent)" }}
      />
    </>
  );
}
