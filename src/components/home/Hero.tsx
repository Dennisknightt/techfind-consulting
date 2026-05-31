"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Brain, Globe2, TrendingUp } from "lucide-react";
import { GradientOrb } from "@/components/ui/GradientOrb";

const aiPlatforms = ["ChatGPT", "Gemini", "Claude", "Perplexity", "Google AI"];

const floatingBubbles = [
  { text: "Best solar company in Nairobi?", delay: 0, x: "-5%", y: "30%" },
  { text: "Top law firms in East Africa?", delay: 1.5, x: "75%", y: "20%" },
  { text: "AI-powered HR software Kenya?", delay: 3, x: "80%", y: "65%" },
];

const stats = [
  { icon: Globe2, value: "80%", label: "of buyers now use AI for research" },
  { icon: Brain, value: "3x", label: "more leads from AI-cited brands" },
  { icon: TrendingUp, value: "92%", label: "B2B decisions start with an AI query" },
];

export function Hero() {
  const [platformIndex, setPlatformIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setPlatformIndex((i) => (i + 1) % aiPlatforms.length);
        setIsVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <GradientOrb color="blue" size="xl" className="absolute -top-32 -left-32 opacity-40" animationDelay={0} />
      <GradientOrb color="violet" size="xl" className="absolute -bottom-32 -right-32 opacity-30" animationDelay={1} />
      <GradientOrb color="cyan" size="md" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" animationDelay={2} />

      {/* Floating AI bubbles */}
      {floatingBubbles.map((bubble, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 + i * 0.3, duration: 0.6 }}
          className="absolute hidden lg:block"
          style={{ left: bubble.x, top: bubble.y }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: bubble.delay }}
            className="glass border border-blue-500/20 rounded-xl px-4 py-2.5 max-w-[220px] backdrop-blur-xl"
          >
            <div className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <p className="text-xs text-white/60 leading-relaxed">{bubble.text}</p>
            </div>
          </motion.div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass border border-blue-500/30 rounded-full px-4 py-2 mb-8 text-xs text-blue-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          The Future of Business Discovery is Here
          <span className="text-white/30">→</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 leading-[0.95]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Get Your Business
          <br />
          <span className="gradient-text text-glow">Recommended by AI.</span>
        </motion.h1>

        {/* Platform rotator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6 h-8"
        >
          <span className="text-white/30 text-sm">Appearing on</span>
          <motion.span
            key={platformIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-semibold text-blue-400 glass border border-blue-500/30 px-3 py-1 rounded-full"
          >
            {aiPlatforms[platformIndex]}
          </motion.span>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          TechFind Consulting helps brands rank, appear, and get cited across ChatGPT,
          Gemini, Claude, Perplexity, and Google AI search experiences.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/ai-visibility-audit"
            className="group relative flex items-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-base hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10">Book AI Visibility Audit</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <Link
            href="/ai-engine-optimization"
            className="group flex items-center gap-2.5 px-7 py-4 rounded-full glass border border-white/10 text-white/70 hover:text-white hover:border-blue-500/40 font-medium text-base transition-all duration-300"
          >
            <Play className="w-4 h-4 text-blue-400" />
            See How AEO Works
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02, y: -2 }}
              className="glass border border-white/5 rounded-2xl p-5 text-center group"
            >
              <Icon className="w-5 h-5 text-blue-400 mx-auto mb-2 group-hover:text-cyan-400 transition-colors" />
              <div className="text-2xl font-black gradient-text mb-1" style={{ fontFamily: "var(--font-syne)" }}>
                {value}
              </div>
              <div className="text-xs text-white/40 leading-snug">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
