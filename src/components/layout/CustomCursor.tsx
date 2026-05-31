"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const isHoveringRef = useRef(false);
  const scaleRef = useRef(1);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "hover"
      ) {
        isHoveringRef.current = true;
      } else {
        isHoveringRef.current = false;
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] rounded-full border border-blue-500/40 hidden md:block"
        style={{ x: springX, y: springY }}
        animate={{
          scale: isHoveringRef.current ? 1.8 : 1,
          borderColor: isHoveringRef.current
            ? "rgba(124, 58, 237, 0.6)"
            : "rgba(59, 130, 246, 0.4)",
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-sm" />
      </motion.div>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-[9999] rounded-full bg-blue-400 hidden md:block"
        style={{ x: dotX, y: dotY }}
      />
    </>
  );
}
