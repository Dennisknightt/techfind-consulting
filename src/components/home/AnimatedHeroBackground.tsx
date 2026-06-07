"use client";

import { useEffect, useRef } from "react";

/* Static particle data — generated once, never re-computed.
   Math.random() must NOT live inside render/JSX or you get
   hydration mismatches and a new random value on every paint. */
const PARTICLES = [
  { w: 5, h: 5, left: "12%",  top: "18%",  opacity: 0.45, dur: 9,  del: 0   },
  { w: 3, h: 3, left: "78%",  top: "32%",  opacity: 0.25, dur: 11, del: 1.2 },
  { w: 4, h: 4, left: "45%",  top: "68%",  opacity: 0.35, dur: 8,  del: 2.1 },
  { w: 5, h: 5, left: "23%",  top: "55%",  opacity: 0.30, dur: 13, del: 0.8 },
  { w: 3, h: 3, left: "65%",  top: "12%",  opacity: 0.40, dur: 10, del: 1.6 },
  { w: 4, h: 4, left: "88%",  top: "72%",  opacity: 0.20, dur: 12, del: 2.8 },
  { w: 5, h: 5, left: "34%",  top: "85%",  opacity: 0.35, dur: 9,  del: 0.4 },
  { w: 3, h: 3, left: "56%",  top: "40%",  opacity: 0.30, dur: 11, del: 3.2 },
  { w: 4, h: 4, left: "8%",   top: "78%",  opacity: 0.25, dur: 14, del: 1.0 },
  { w: 5, h: 5, left: "91%",  top: "25%",  opacity: 0.40, dur: 8,  del: 2.4 },
  { w: 3, h: 3, left: "72%",  top: "90%",  opacity: 0.20, dur: 10, del: 0.6 },
  { w: 4, h: 4, left: "18%",  top: "42%",  opacity: 0.35, dur: 12, del: 3.8 },
  { w: 5, h: 5, left: "50%",  top: "22%",  opacity: 0.45, dur: 9,  del: 1.8 },
  { w: 3, h: 3, left: "38%",  top: "62%",  opacity: 0.25, dur: 11, del: 2.6 },
  { w: 4, h: 4, left: "82%",  top: "48%",  opacity: 0.30, dur: 13, del: 0.2 },
] as const;

const PARTICLE_COLORS = ["var(--accent)", "var(--accent-2)", "var(--highlight)"] as const;

export function AnimatedHeroBackground() {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    /* Single passive listener — no setState, no React re-renders */
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    /* RAF loop: smoothly lerp blobs toward cursor.
       Direct DOM mutation — zero React involvement. */
    const animate = () => {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      if (blob1Ref.current) {
        blob1Ref.current.style.transform =
          `translate(${currentX * 30}px, ${currentY * 30}px)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform =
          `translate(${currentX * -40}px, ${currentY * -40}px)`;
      }
      if (blob3Ref.current) {
        blob3Ref.current.style.transform =
          `translate(${currentX * 25}px, ${currentY * 25}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--bg) 0%, color-mix(in srgb, var(--accent) 5%, var(--bg)) 50%, var(--bg) 100%)",
        }}
      />

      {/* Mouse-tracking blobs — single blur per element, will-change hoisted */}
      <div
        ref={blob1Ref}
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(135deg, var(--accent-glow), transparent)",
          opacity: 0.4,
          filter: "blur(80px)",
          willChange: "transform",
        }}
      />
      <div
        ref={blob2Ref}
        className="absolute -top-1/4 -right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(135deg, var(--accent-2-glow), transparent)",
          opacity: 0.3,
          filter: "blur(80px)",
          willChange: "transform",
        }}
      />
      <div
        ref={blob3Ref}
        className="absolute -bottom-1/4 left-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(34,211,238,0.12), transparent)",
          opacity: 0.3,
          filter: "blur(80px)",
          willChange: "transform",
        }}
      />

      {/* Static grid — no animation on large repaint-causing div */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Glow lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.15 }}
      >
        <defs>
          <linearGradient id="hero-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <line x1="10%" y1="10%" x2="90%" y2="90%" stroke="url(#hero-line-gradient)" strokeWidth="1" />
        <line x1="90%" y1="10%" x2="10%" y2="90%" stroke="url(#hero-line-gradient)" strokeWidth="1" opacity="0.6" />
      </svg>

      {/* Static particles — CSS animation only, no JS per-frame */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width:  p.w + "px",
              height: p.h + "px",
              background: PARTICLE_COLORS[i % 3],
              left: p.left,
              top:  p.top,
              opacity: p.opacity,
              willChange: "transform, opacity",
              animation: `hero-particle ${p.dur}s ease-in-out ${p.del}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
