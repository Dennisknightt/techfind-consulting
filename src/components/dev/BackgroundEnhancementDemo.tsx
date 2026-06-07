"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Copy, Check } from "lucide-react";

type Enhancement =
  | "none"
  | "grain"
  | "breathing-gradient"
  | "radial-light"
  | "animated-grid"
  | "orb-halos"
  | "all";

const enhancements: Record<Enhancement, {
  name: string;
  description: string;
  css: string;
  intensity: "subtle" | "moderate" | "noticeable";
}> = {
  none: {
    name: "Current (No Enhancement)",
    description: "Your current background setup",
    css: "/* Current styles only */",
    intensity: "subtle",
  },
  grain: {
    name: "Grain Texture Overlay",
    description: "Adds fine-grain texture for visual depth (2% opacity)",
    css: `.grain-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  z-index: 1;
}`,
    intensity: "subtle",
  },
  "breathing-gradient": {
    name: "Gradient Breathing",
    description: "Subtle color shifts (12s cycle, accent colors +1-2%)",
    css: `@keyframes gradient-breathe {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.section-breathe {
  background: linear-gradient(-45deg,
    var(--bg),
    color-mix(in srgb, var(--accent) 2%, var(--bg)),
    color-mix(in srgb, var(--accent-2) 1%, var(--bg)),
    var(--bg)
  );
  background-size: 400% 400%;
  animation: gradient-breathe 12s ease infinite;
}`,
    intensity: "subtle",
  },
  "radial-light": {
    name: "Radial Light Source",
    description: "Moving light that orbits (16s cycle, 6% opacity)",
    css: `@keyframes light-shift {
  0%, 100%  { transform: translate(0, 0) scale(1); }
  25%       { transform: translate(80px, -80px) scale(1.1); }
  50%       { transform: translate(-100px, 120px) scale(0.9); }
  75%       { transform: translate(60px, 60px) scale(1.05); }
}

.bg-light-source {
  position: fixed;
  width: 600px; height: 600px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.06;
  animation: light-shift 16s ease-in-out infinite;
  pointer-events: none;
  filter: blur(60px);
}`,
    intensity: "moderate",
  },
  "animated-grid": {
    name: "Animated Grid",
    description: "Grid pattern that subtly shifts (20s cycle, 30% opacity)",
    css: `@keyframes grid-shift {
  0%   { background-position: 0 0; }
  100% { background-position: 64px 64px; }
}

.animated-grid {
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 64px 64px;
  animation: grid-shift 20s linear infinite;
  opacity: 0.3;
}`,
    intensity: "moderate",
  },
  "orb-halos": {
    name: "Enhanced Orb Halos",
    description: "Multi-layer glow on orbs (atmospheric effect)",
    css: `.orb-enhanced {
  border-radius: 9999px;
  pointer-events: none;
  filter: blur(80px);
  box-shadow:
    0 0 100px var(--accent-glow),
    0 0 200px color-mix(in srgb, var(--accent) 5%, transparent),
    inset 0 0 80px var(--accent-glow);
  will-change: transform;
}`,
    intensity: "moderate",
  },
  all: {
    name: "All Enhancements Combined",
    description: "Grain + Breathing + Light + Grid + Orb Halos",
    css: `/* All of the above combined */`,
    intensity: "noticeable",
  },
};

export function BackgroundEnhancementDemo() {
  const [selected, setSelected] = useState<Enhancement>("none");
  const [copied, setCopied] = useState(false);

  const enhancement = enhancements[selected];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancement.css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 text-[var(--text)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Background Enhancement Preview
          </h1>
          <p className="text-[var(--muted)] max-w-2xl mx-auto text-lg">
            Explore subtle ways to make backgrounds more interesting without overwhelming the content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Preview */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative surface rounded-3xl overflow-hidden h-[500px]"
            >
              {/* Background preview with selected enhancement */}
              <div
                className="absolute inset-0"
                style={{
                  background: "var(--bg)",
                  ...(selected === "breathing-gradient" && {
                    background: "linear-gradient(-45deg, var(--bg), color-mix(in srgb, var(--accent) 2%, var(--bg)), color-mix(in srgb, var(--accent-2) 1%, var(--bg)), var(--bg))",
                    backgroundSize: "400% 400%",
                    animation: "gradient-breathe 12s ease infinite",
                  }),
                }}
              >
                {/* Grain overlay */}
                {(selected === "grain" || selected === "all") && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                      opacity: 0.02,
                    }}
                  />
                )}

                {/* Radial light */}
                {(selected === "radial-light" || selected === "all") && (
                  <motion.div
                    animate={{
                      x: [0, 80, -100, 60, 0],
                      y: [0, -80, 120, 60, 0],
                    }}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
                      opacity: 0.06,
                      filter: "blur(60px)",
                      top: "10%",
                      left: "20%",
                    }}
                  />
                )}

                {/* Animated grid */}
                {(selected === "animated-grid" || selected === "all") && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
                      backgroundSize: "64px 64px",
                      opacity: 0.3,
                      animation: "grid-shift 20s linear infinite",
                    }}
                  />
                )}

                {/* Orbs with enhanced halos */}
                {(selected === "orb-halos" || selected === "all") && (
                  <>
                    <motion.div
                      animate={{ y: [-20, 20, -20] }}
                      transition={{ duration: 14, repeat: Infinity }}
                      className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
                      style={{
                        background: "var(--orb-1)",
                        filter: "blur(80px)",
                        boxShadow:
                          "0 0 100px var(--accent-glow), 0 0 200px color-mix(in srgb, var(--accent) 5%, transparent), inset 0 0 80px var(--accent-glow)",
                      }}
                    />
                    <motion.div
                      animate={{ y: [20, -20, 20] }}
                      transition={{ duration: 18, repeat: Infinity }}
                      className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none"
                      style={{
                        background: "var(--orb-2)",
                        filter: "blur(80px)",
                        boxShadow:
                          "0 0 120px var(--accent-2-glow), 0 0 220px color-mix(in srgb, var(--accent-2) 5%, transparent), inset 0 0 80px var(--accent-2-glow)",
                      }}
                    />
                  </>
                )}
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold mb-4 text-[var(--text)]" style={{ fontFamily: "var(--font-outfit)" }}>
                    {selected === "none" ? "Current" : "Enhanced"}
                  </div>
                  <p className="text-[var(--muted)] text-sm">
                    {enhancement.name}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--text)] mb-4">Enhancement Options</h3>
            {(Object.entries(enhancements) as [Enhancement, typeof enhancements[Enhancement]][]).map(
              ([key, data]) => (
                <motion.button
                  key={key}
                  onClick={() => setSelected(key)}
                  whileHover={{ x: 4 }}
                  className="w-full text-left surface rounded-xl p-4 transition-all group"
                  style={{
                    borderColor: selected === key ? "var(--border-accent)" : "var(--border)",
                    background: selected === key ? "var(--card-hover)" : "var(--card)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-sm text-[var(--text)]">{data.name}</p>
                      <p className="text-xs text-[var(--muted)] mt-1">{data.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-1 rounded-full inline-block"
                    style={{
                      background:
                        data.intensity === "subtle"
                          ? "rgba(124, 58, 237, 0.1)"
                          : data.intensity === "moderate"
                            ? "rgba(59, 130, 246, 0.1)"
                            : "rgba(34, 211, 238, 0.1)",
                      color:
                        data.intensity === "subtle"
                          ? "var(--accent)"
                          : data.intensity === "moderate"
                            ? "var(--accent-2)"
                            : "var(--highlight)",
                    }}
                  >
                    {data.intensity === "subtle" ? "Subtle" : data.intensity === "moderate" ? "Moderate" : "Noticeable"}
                  </span>
                </motion.button>
              )
            )}
          </div>
        </div>

        {/* CSS Code Display */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="surface rounded-2xl p-6 mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text)]">CSS Code</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: copied ? "rgba(16, 185, 129, 0.1)" : "var(--accent-glow)",
                color: copied ? "#10b981" : "var(--text)",
              }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="bg-[var(--card-hover)] rounded-lg p-4 overflow-x-auto">
            <code className="text-xs text-[var(--muted)] leading-relaxed font-mono">
              {enhancement.css}
            </code>
          </pre>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              icon: "✨",
              title: "Best for Subtlety",
              desc: "Grain Texture + Breathing Gradient",
              why: "Adds visual interest without movement distraction",
            },
            {
              icon: "🌊",
              title: "Best for Depth",
              desc: "Radial Light + Enhanced Orb Halos",
              why: "Creates atmospheric, layered effect",
            },
            {
              icon: "⚡",
              title: "Best for Tech Feel",
              desc: "Animated Grid + Breathing Gradient",
              why: "Subtle motion with geometric precision",
            },
          ].map((rec, i) => (
            <div key={i} className="surface rounded-xl p-4">
              <div className="text-2xl mb-2">{rec.icon}</div>
              <p className="font-semibold text-sm text-[var(--text)] mb-1">{rec.title}</p>
              <p className="text-xs text-[var(--accent)] font-medium mb-2">{rec.desc}</p>
              <p className="text-[10px] text-[var(--muted)]">{rec.why}</p>
            </div>
          ))}
        </motion.div>

        {/* Implementation Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-xl border"
          style={{ borderColor: "var(--border-accent)", background: "color-mix(in srgb, var(--accent) 2%, var(--bg))" }}
        >
          <h4 className="font-semibold text-[var(--text)] mb-2">Next Steps</h4>
          <ul className="text-sm text-[var(--muted)] space-y-2">
            <li>✅ Click enhancements to preview in real-time</li>
            <li>✅ Copy CSS code and add to globals.css</li>
            <li>✅ Apply classes to sections where you want effects</li>
            <li>✅ Adjust opacity/timing values to match your taste</li>
          </ul>
        </motion.div>
      </div>

      <style>{`
        @keyframes gradient-breathe {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes grid-shift {
          0%   { background-position: 0 0; }
          100% { background-position: 64px 64px; }
        }
      `}</style>
    </div>
  );
}
