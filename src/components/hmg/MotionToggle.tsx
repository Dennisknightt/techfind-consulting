"use client";

import { useEffect, useState } from "react";

const KEY = "hmg-motion";

/**
 * Lets visitors stop the looping animations (WCAG 2.2.2). Adds `motion-paused`
 * to <html>; looping CSS only runs without it. Hidden when the OS already asks
 * for reduced motion, since nothing loops then.
 */
export function MotionToggle({ className = "" }: { className?: string }) {
  const [paused, setPaused] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setPaused(document.documentElement.classList.contains("motion-paused"));
    const sync = () => setPaused(document.documentElement.classList.contains("motion-paused"));
    window.addEventListener("hmg-motion", sync);
    return () => window.removeEventListener("hmg-motion", sync);
  }, []);

  if (!shown) return null;

  const toggle = () => {
    const next = !paused;
    document.documentElement.classList.toggle("motion-paused", next);
    try { localStorage.setItem(KEY, next ? "paused" : "on"); } catch {}
    window.dispatchEvent(new Event("hmg-motion"));
  };

  return (
    <button type="button" className={`mtoggle ${className}`} aria-pressed={paused} onClick={toggle}>
      <span className="mtoggle__ico" aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
      {paused ? "Play animations" : "Pause animations"}
    </button>
  );
}
