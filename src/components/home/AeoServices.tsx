"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Search,
  Database,
  FileCode2,
  PenLine,
  Star,
  Newspaper,
  BarChart3,
  Trophy,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Search,
    title: "AI Visibility Audit",
    description:
      "Deep analysis of how AI systems currently perceive, understand, and cite your brand — with a detailed gap report.",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    glow: "group-hover:shadow-blue-500/20",
    tag: "Start Here",
  },
  {
    icon: Database,
    title: "Entity Optimization",
    description:
      "Structure your business identity so AI systems understand who you are, what you do, and why you're trustworthy.",
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    icon: FileCode2,
    title: "Structured Data & Schema",
    description:
      "Implement advanced schema markup that feeds machine-readable signals directly to AI crawlers and knowledge graphs.",
    color: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: PenLine,
    title: "Authority Content",
    description:
      "Create AI-citation-ready content — comprehensive, structured articles that AI engines pull from as authoritative sources.",
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: Star,
    title: "Review & Reputation Signals",
    description:
      "Optimize your review profile and reputation data so AI engines surface your business with confidence scores.",
    color: "from-yellow-500/20 to-orange-500/10",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
    glow: "group-hover:shadow-yellow-500/20",
  },
  {
    icon: Newspaper,
    title: "Digital PR & Citations",
    description:
      "Secure mentions, citations, and backlinks in publications that AI systems treat as authoritative references.",
    color: "from-pink-500/20 to-pink-600/10",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
    glow: "group-hover:shadow-pink-500/20",
  },
  {
    icon: BarChart3,
    title: "AI Search Monitoring",
    description:
      "Track how your brand appears across ChatGPT, Gemini, Perplexity, and Claude with monthly monitoring dashboards.",
    color: "from-indigo-500/20 to-indigo-600/10",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
    glow: "group-hover:shadow-indigo-500/20",
  },
  {
    icon: Trophy,
    title: "Competitive AI Ranking Reports",
    description:
      "Know exactly where competitors rank in AI responses vs. your brand, and what's driving the gap.",
    color: "from-orange-500/20 to-red-500/10",
    border: "border-orange-500/20",
    iconColor: "text-orange-400",
    glow: "group-hover:shadow-orange-500/20",
  },
];

export function AeoServices() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4"
          >
            Core Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Everything You Need to
            <br />
            <span className="gradient-text">Dominate AI Search</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            A complete AI Engine Optimization system — from audit to ongoing monitoring.
          </motion.p>
        </div>

        {/* Service grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative group cursor-pointer glass border ${service.border} rounded-2xl p-5 hover:shadow-xl ${service.glow} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
              >
                {/* Card bg gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                />

                <div className="relative z-10">
                  {service.tag && (
                    <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {service.tag}
                    </span>
                  )}

                  <div
                    className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors`}
                  >
                    <Icon className={`w-5 h-5 ${service.iconColor}`} />
                  </div>

                  <h3
                    className="font-bold text-white text-sm mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors">
                    {service.description}
                  </p>
                </div>

                {/* Hover arrow */}
                <motion.div
                  animate={{ opacity: hoveredIndex === i ? 1 : 0, x: hoveredIndex === i ? 0 : -4 }}
                  className="absolute bottom-4 right-4"
                >
                  <ArrowRight className={`w-4 h-4 ${service.iconColor}`} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link
            href="/ai-engine-optimization"
            className="inline-flex items-center gap-2 text-sm font-medium px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 group"
          >
            Explore Full AEO Service
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
