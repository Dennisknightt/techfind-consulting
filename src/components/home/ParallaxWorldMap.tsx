"use client";

import { useEffect, useState } from "react";

export function ParallaxWorldMap() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [blur, setBlur] = useState(0);
  const [opacity, setOpacity] = useState(0.95);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll position
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollTop / docHeight;

      // Set progress (0 to 1)
      const progress = Math.min(scrolled * 2, 1);
      setScrollProgress(progress);

      // Very subtle blur increase as you scroll (0 to 5px only)
      setBlur(progress * 5);

      // Only slightly decrease opacity as you scroll (0.95 to 0.80)
      setOpacity(0.95 - progress * 0.15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" style={{ zIndex: -1 }}>
      {/* World Map Background - Very Clear */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url(/world-map-bg.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: opacity,
          transition: "opacity 0.1s ease-out",
        }}
      />

      {/* Minimal Glass Overlay - Very Light and Clear */}
      <div
        className="absolute inset-0 backdrop-blur"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(7, 11, 20, ${0.08 + scrollProgress * 0.12}),
            rgba(10, 74, 107, ${0.05 + scrollProgress * 0.1})
          )`,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          transition: "background 0.1s ease-out",
        }}
      />

      {/* Very Subtle Accent Glow - Barely visible */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 80% 60% at 50% 40%,
            rgba(123, 58, 237, ${0.02 + scrollProgress * 0.03}),
            transparent 70%
          )`,
          transition: "background 0.1s ease-out",
        }}
      />

      {/* Gentle light wash from top */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(255, 255, 255, ${0.01 + scrollProgress * 0.02}) 0%,
            transparent 50%,
            rgba(0, 0, 0, ${0.03 + scrollProgress * 0.05}) 100%
          )`,
        }}
      />

      {/* Subtle accent glow that barely changes on scroll */}
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(
            circle,
            rgba(123, 58, 237, ${0.03 + scrollProgress * 0.04}),
            transparent 70%
          )`,
          transform: `translate(0, ${scrollProgress * 20}px)`,
          transition: "all 0.1s ease-out",
        }}
      />

      {/* Bottom subtle accent glow */}
      <div
        className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(
            circle,
            rgba(59, 130, 246, ${0.02 + scrollProgress * 0.03}),
            transparent 70%
          )`,
          transform: `translate(0, ${scrollProgress * -15}px)`,
          transition: "all 0.1s ease-out",
        }}
      />
    </div>
  );
}
