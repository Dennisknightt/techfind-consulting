"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronRight } from "lucide-react";

type MotionEffect =
  | "none"
  | "floating-shapes"
  | "orbiting-circles"
  | "wave-animation"
  | "morphing-blobs"
  | "particle-stream"
  | "rotating-elements"
  | "dancing-elements"
  | "all";

const motionEffects: Record<MotionEffect, {
  name: string;
  description: string;
  css: string;
  jsx: string;
  intensity: "subtle" | "moderate" | "dynamic";
  complexity: "simple" | "medium" | "complex";
}> = {
  none: {
    name: "No Motion",
    description: "Static background only",
    css: "/* No animation */",
    jsx: "/* No elements */",
    intensity: "subtle",
    complexity: "simple",
  },
  "floating-shapes": {
    name: "Floating Shapes",
    description: "Geometric shapes floating smoothly across screen",
    css: `@keyframes float-smooth {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-40px) translateX(20px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}

.shape-float { animation: float-smooth 8s ease-in-out infinite; }
.shape-float-2 { animation: float-slow 10s ease-in-out infinite 1s; }
.shape-float-3 { animation: float-smooth 12s ease-in-out infinite 2s reverse; }`,
    jsx: `<motion.div className="absolute w-32 h-32 rounded-full shape-float"
  style={{ background: "var(--accent-glow)", filter: "blur(40px)" }} />
<motion.div className="absolute w-24 h-24 shape-float-2"
  style={{ background: "var(--accent-2-glow)", filter: "blur(50px)" }} />
<motion.div className="absolute w-40 h-40 rounded-3xl shape-float-3"
  style={{ background: "var(--orb-3)", filter: "blur(60px)" }} />`,
    intensity: "moderate",
    complexity: "simple",
  },
  "orbiting-circles": {
    name: "Orbiting Circles",
    description: "Elements orbiting around a central point",
    css: `@keyframes orbit-1 {
  0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
}

@keyframes orbit-2 {
  0% { transform: rotate(0deg) translateX(140px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
}

@keyframes orbit-3 {
  0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
}

.orbit-1 { animation: orbit-1 20s linear infinite; }
.orbit-2 { animation: orbit-2 26s linear infinite reverse; }
.orbit-3 { animation: orbit-3 16s linear infinite; }`,
    jsx: `<div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2">
  <div className="absolute inset-0 rounded-full border border-[var(--border)] opacity-20" />
  <motion.div className="absolute w-4 h-4 rounded-full orbit-1 top-0 left-1/2 -translate-x-1/2"
    style={{ background: "var(--accent)" }} />
  <motion.div className="absolute w-3 h-3 rounded-full orbit-2 top-1/2 right-0 -translate-y-1/2"
    style={{ background: "var(--accent-2)" }} />
  <motion.div className="absolute w-4 h-4 rounded-full orbit-3 bottom-0 left-1/2 -translate-x-1/2"
    style={{ background: "var(--highlight)" }} />
</div>`,
    intensity: "dynamic",
    complexity: "medium",
  },
  "wave-animation": {
    name: "Wave Animation",
    description: "Undulating wave patterns flowing across background",
    css: `@keyframes wave {
  0%, 100% { transform: translateY(0px); }
  25% { transform: translateY(-20px); }
  50% { transform: translateY(0px); }
  75% { transform: translateY(20px); }
}

@keyframes wave-delay-1 {
  0%, 100% { transform: translateY(0px); }
  25% { transform: translateY(-15px); }
  50% { transform: translateY(0px); }
  75% { transform: translateY(15px); }
}

.wave-line { animation: wave 6s ease-in-out infinite; }
.wave-line-2 { animation: wave-delay-1 6s ease-in-out infinite 0.5s; }
.wave-line-3 { animation: wave 6s ease-in-out infinite 1s; }`,
    jsx: `<div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
  <div className="w-96 h-1 wave-line" style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
  <div className="w-96 h-1 wave-line-2" style={{ background: "linear-gradient(90deg, transparent, var(--accent-2), transparent)" }} />
  <div className="w-96 h-1 wave-line-3" style={{ background: "linear-gradient(90deg, transparent, var(--highlight), transparent)" }} />
</div>`,
    intensity: "moderate",
    complexity: "simple",
  },
  "morphing-blobs": {
    name: "Morphing Blobs",
    description: "Organic shapes that morph and shift",
    css: `@keyframes morph-1 {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}

@keyframes morph-2 {
  0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  50% { border-radius: 70% 30% 46% 46% / 30% 30% 60% 70%; }
}

@keyframes morph-3 {
  0%, 100% { border-radius: 50% 50% 50% 50%; }
  50% { border-radius: 25% 75% 75% 25% / 75% 25% 25% 75%; }
}

.blob-1 { animation: morph-1 8s ease-in-out infinite; }
.blob-2 { animation: morph-2 10s ease-in-out infinite 1s; }
.blob-3 { animation: morph-3 12s ease-in-out infinite 0.5s; }`,
    jsx: `<motion.div className="absolute w-48 h-48 blob-1 top-1/4 left-1/4"
  style={{ background: "var(--accent-glow)", filter: "blur(50px)" }} />
<motion.div className="absolute w-56 h-56 blob-2 bottom-1/4 right-1/4"
  style={{ background: "var(--accent-2-glow)", filter: "blur(60px)" }} />
<motion.div className="absolute w-40 h-40 blob-3 top-1/3 right-1/3"
  style={{ background: "var(--orb-3)", filter: "blur(70px)" }} />`,
    intensity: "moderate",
    complexity: "medium",
  },
  "particle-stream": {
    name: "Particle Stream",
    description: "Flowing particles like wind or energy",
    css: `@keyframes particle-flow {
  0% { transform: translateX(-100px) translateY(0px) scale(1); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(400px) translateY(50px) scale(0); opacity: 0; }
}

@keyframes particle-flow-2 {
  0% { transform: translateX(-50px) translateY(100px) scale(1); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(350px) translateY(150px) scale(0); opacity: 0; }
}

.particle { animation: particle-flow 4s ease-in infinite; }
.particle-2 { animation: particle-flow-2 4.5s ease-in infinite 0.5s; }`,
    jsx: `<div className="absolute inset-0 overflow-hidden">
  {[...Array(8)].map((_, i) => (
    <motion.div key={i} className="absolute w-2 h-2 rounded-full particle"
      style={{
        background: ["var(--accent)", "var(--accent-2)", "var(--highlight)"][i % 3],
        left: \`\${i * 12}%\`,
        top: \`\${i * 10}%\`,
      }} />
  ))}
</div>`,
    intensity: "dynamic",
    complexity: "medium",
  },
  "rotating-elements": {
    name: "Rotating Elements",
    description: "Elements that rotate and spin smoothly",
    css: `@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes spin-wobble {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
}

.rotate-slow { animation: spin-slow 20s linear infinite; }
.rotate-reverse { animation: spin-reverse 24s linear infinite; }
.rotate-wobble { animation: spin-wobble 8s ease-in-out infinite; }`,
    jsx: `<motion.div className="absolute top-1/3 left-1/3 w-32 h-32 rotate-slow"
  style={{ border: "2px solid var(--border-accent)" }} />
<motion.div className="absolute top-1/2 right-1/4 w-24 h-24 rotate-reverse"
  style={{ border: "1px solid var(--accent)" }} />
<motion.div className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full rotate-wobble"
  style={{ border: "1px solid var(--accent-2)", opacity: 0.5 }} />`,
    intensity: "moderate",
    complexity: "simple",
  },
  "dancing-elements": {
    name: "Dancing Elements",
    description: "Elements that dance and bounce rhythmically",
    css: `@keyframes dance-1 {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-30px) translateX(20px) rotate(15deg); }
  50% { transform: translateY(0px) translateX(40px) rotate(0deg); }
  75% { transform: translateY(20px) translateX(10px) rotate(-15deg); }
}

@keyframes dance-2 {
  0%, 100% { transform: translateX(0px) scaleY(1); }
  50% { transform: translateX(-20px) scaleY(1.2); }
}

@keyframes dance-3 {
  0%, 100% { transform: rotate(0deg) translateY(0px); }
  50% { transform: rotate(360deg) translateY(-40px); }
}

.dance-1 { animation: dance-1 6s ease-in-out infinite; }
.dance-2 { animation: dance-2 4s ease-in-out infinite 0.5s; }
.dance-3 { animation: dance-3 5s ease-in-out infinite 1s; }`,
    jsx: `<motion.div className="absolute w-16 h-16 dance-1 top-1/4 left-1/4 rounded-xl"
  style={{ background: "var(--accent-glow)" }} />
<motion.div className="absolute w-12 h-12 dance-2 top-1/3 right-1/3 rounded-full"
  style={{ background: "var(--accent-2-glow)" }} />
<motion.div className="absolute w-20 h-20 dance-3 bottom-1/4 left-1/3 rounded-lg"
  style={{ background: "var(--orb-3)" }} />`,
    intensity: "dynamic",
    complexity: "medium",
  },
  all: {
    name: "All Motion Effects",
    description: "Everything combined into a dynamic, orchestrated experience",
    css: `/* All animations combined */`,
    jsx: `/* All elements together */`,
    intensity: "dynamic",
    complexity: "complex",
  },
};

export function ObjectsInMotionDemo() {
  const [selected, setSelected] = useState<MotionEffect>("floating-shapes");
  const [copied, setCopied] = useState(false);

  const effect = motionEffects[selected];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(effect.css + "\n\n" + effect.jsx);
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
            Objects in Motion
          </h1>
          <p className="text-[var(--muted)] max-w-2xl mx-auto text-lg">
            Dynamic animated elements that add energy and visual interest to your backgrounds
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
              {/* Background */}
              <div className="absolute inset-0" style={{ background: "var(--bg)" }}>
                {/* Add motion elements based on selection */}
                {(selected === "floating-shapes" || selected === "all") && (
                  <>
                    <motion.div
                      animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
                      transition={{ duration: 8, repeat: Infinity }}
                      className="absolute w-32 h-32 rounded-full"
                      style={{ background: "var(--accent-glow)", filter: "blur(40px)", top: "20%", left: "15%" }}
                    />
                    <motion.div
                      animate={{ y: [0, -30, 0] }}
                      transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                      className="absolute w-24 h-24"
                      style={{ background: "var(--accent-2-glow)", filter: "blur(50px)", bottom: "20%", right: "20%" }}
                    />
                  </>
                )}

                {(selected === "orbiting-circles" || selected === "all") && (
                  <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 rounded-full border border-[var(--border)] opacity-20" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute w-4 h-4 rounded-full bg-[var(--accent)] top-0 left-1/2 -translate-x-1/2" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute w-3 h-3 rounded-full bg-[var(--accent-2)] right-0 top-1/2 -translate-y-1/2" />
                    </motion.div>
                  </div>
                )}

                {(selected === "wave-animation" || selected === "all") && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="w-96 h-1"
                      style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                    />
                    <motion.div
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
                      className="w-96 h-1"
                      style={{ background: "linear-gradient(90deg, transparent, var(--accent-2), transparent)" }}
                    />
                  </div>
                )}

                {(selected === "morphing-blobs" || selected === "all") && (
                  <>
                    <motion.div
                      animate={{ borderRadius: ["60% 40% 30% 70%", "30% 60% 70% 40%", "60% 40% 30% 70%"] }}
                      transition={{ duration: 8, repeat: Infinity }}
                      className="absolute w-48 h-48"
                      style={{ background: "var(--accent-glow)", filter: "blur(50px)", top: "20%", left: "10%" }}
                    />
                    <motion.div
                      animate={{ borderRadius: ["40% 60% 70% 30%", "70% 30% 46% 46%", "40% 60% 70% 30%"] }}
                      transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                      className="absolute w-56 h-56"
                      style={{ background: "var(--accent-2-glow)", filter: "blur(60px)", bottom: "10%", right: "10%" }}
                    />
                  </>
                )}

                {(selected === "particle-stream" || selected === "all") && (
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ x: 400, y: 50, scale: 0, opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: ["var(--accent)", "var(--accent-2)", "var(--highlight)"][i % 3],
                          left: `${i * 15}%`,
                          top: "50%",
                        }}
                      />
                    ))}
                  </div>
                )}

                {(selected === "rotating-elements" || selected === "all") && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute w-32 h-32 top-1/3 left-1/3"
                      style={{ border: "2px solid var(--border-accent)" }}
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                      className="absolute w-24 h-24 top-1/2 right-1/4"
                      style={{ border: "1px solid var(--accent)" }}
                    />
                  </>
                )}

                {(selected === "dancing-elements" || selected === "all") && (
                  <>
                    <motion.div
                      animate={{
                        y: [0, -30, 0, 20, 0],
                        x: [0, 20, 40, 10, 0],
                        rotate: [0, 15, 0, -15, 0],
                      }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="absolute w-16 h-16 rounded-xl top-1/4 left-1/4"
                      style={{ background: "var(--accent-glow)" }}
                    />
                    <motion.div
                      animate={{ x: [0, -20, 0], scaleY: [1, 1.2, 1] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                      className="absolute w-12 h-12 rounded-full top-1/3 right-1/3"
                      style={{ background: "var(--accent-2-glow)" }}
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
                  <div className="text-3xl font-bold mb-2 text-[var(--text)]" style={{ fontFamily: "var(--font-outfit)" }}>
                    {effect.name}
                  </div>
                  <p className="text-[var(--muted)] text-xs">
                    {effect.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--text)] mb-4">Motion Options</h3>
            {(Object.entries(motionEffects) as [MotionEffect, typeof motionEffects[MotionEffect]][]).map(
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
                  <div className="flex gap-2">
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-full"
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
                      {data.intensity}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[rgba(148,163,184,0.1)] text-[var(--muted)]">
                      {data.complexity}
                    </span>
                  </div>
                </motion.button>
              )
            )}
          </div>
        </div>

        {/* Code Display */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="surface rounded-2xl p-6 mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text)]">Implementation Code</h3>
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
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-[var(--muted)] mb-2">CSS Animation</p>
              <pre className="bg-[var(--card-hover)] rounded-lg p-4 overflow-x-auto">
                <code className="text-xs text-[var(--muted)] leading-relaxed font-mono">
                  {effect.css}
                </code>
              </pre>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--muted)] mb-2">JSX Component</p>
              <pre className="bg-[var(--card-hover)] rounded-lg p-4 overflow-x-auto">
                <code className="text-xs text-[var(--muted)] leading-relaxed font-mono">
                  {effect.jsx}
                </code>
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
        >
          {[
            {
              icon: "⚡",
              title: "Best for Hero Sections",
              options: ["Floating Shapes", "Orbiting Circles"],
              why: "Creates immediate visual impact without overwhelming content",
            },
            {
              icon: "🌊",
              title: "Best for Flow",
              options: ["Wave Animation", "Particle Stream"],
              why: "Guides viewer's eye through page with directional movement",
            },
            {
              icon: "🎨",
              title: "Best for Premium Feel",
              options: ["Morphing Blobs", "Rotating Elements"],
              why: "Organic, sophisticated animations that feel premium",
            },
            {
              icon: "💃",
              title: "Best for Energy",
              options: ["Dancing Elements", "All Combined"],
              why: "Fun, dynamic energy that makes page feel alive",
            },
          ].map((rec, i) => (
            <div key={i} className="surface rounded-xl p-4">
              <div className="text-2xl mb-2">{rec.icon}</div>
              <p className="font-semibold text-sm text-[var(--text)] mb-2">{rec.title}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {rec.options.map((opt) => (
                  <span key={opt} className="text-[10px] px-2 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent)]">
                    {opt}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-[var(--muted)]">{rec.why}</p>
            </div>
          ))}
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <p className="font-semibold text-sm text-[var(--text)] mb-2">⚙️ Performance</p>
            <p className="text-[10px] text-[var(--muted)]">All effects use GPU-accelerated transforms. Minimal CPU impact with smooth 60fps</p>
          </div>
          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <p className="font-semibold text-sm text-[var(--text)] mb-2">🎯 Best Placement</p>
            <p className="text-[10px] text-[var(--muted)]">Use behind hero text, section backgrounds, or as accent elements alongside content</p>
          </div>
          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <p className="font-semibold text-sm text-[var(--text)] mb-2">⚡ Customization</p>
            <p className="text-[10px] text-[var(--muted)]">Adjust duration, scale, colors, and opacity to match your brand and desired intensity</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
