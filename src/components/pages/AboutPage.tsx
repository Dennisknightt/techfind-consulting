"use client";

import { motion } from "framer-motion";
import { FinalCTA } from "@/components/home/FinalCTA";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Zap, Globe2, Target, Heart } from "lucide-react";

const values = [
  { icon: Target,  title: "Results Over Vanity",    desc: "We measure success in AI mentions, citations, and leads — not impressions or rankings that don't convert." },
  { icon: Zap,     title: "Speed of AI",             desc: "The AI landscape moves fast. We move faster — constantly updating our methods as AI platforms evolve." },
  { icon: Globe2,  title: "Global Expertise. Local Impact.", desc: "Serving businesses worldwide from every continent. Every business deserves world-class AI strategy, regardless of location." },
  { icon: Heart,   title: "Client Success = Our Success", desc: "We don't just sell a service. We become invested in your AI visibility as if it were our own brand on the line." },
];

const team = [
  { name: "Kelvin Wachira",  title: "Co-Founder & CEO",              specialty: "AEO Strategy · AI Architecture", avatar: "KW" },
  { name: "Amira Salim",     title: "Head of AI Optimization",       specialty: "Entity Optimization · Schema",   avatar: "AS" },
  { name: "Brian Odhiambo",  title: "Lead AI Engineer",              specialty: "Automation · AI Integration",    avatar: "BO" },
  { name: "Cynthia Mwenda",  title: "Head of Content & Authority",   specialty: "AI Content · Digital PR",       avatar: "CM" },
];

export function AboutPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="orb orb-accent animate-orb absolute -top-20 -left-20 w-[500px] h-[500px] opacity-25" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-8">
            <span className="section-label"><Globe2 className="w-3.5 h-3.5" />AI Engine Optimization Experts · Global</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-[var(--text)]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            We Started Because
            <br />
            <span className="gradient-text">No One Else Would</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] text-lg max-w-2xl mx-auto leading-relaxed"
          >
            In 2023, we watched exceptional businesses worldwide lose opportunities because AI systems had no idea they existed. We built TechFind to fix that, everywhere.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 50,  suffix: "+",        label: "Brands Optimized" },
            { value: 94,  suffix: "%",        label: "Avg. AI Visibility Improvement" },
            { value: 12,  suffix: "+",        label: "Industries Served" },
            { value: 3,   suffix: " markets", label: "Active Markets" },
          ].map(({ value, suffix, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl font-bold gradient-text mb-2" style={{ fontFamily: "var(--font-space)" }}>
                <AnimatedCounter end={value} suffix={suffix} />
              </div>
              <p className="text-[var(--muted)] text-sm">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="surface rounded-3xl p-10"
          >
            <h2 className="text-3xl font-bold text-[var(--text)] mb-6" style={{ fontFamily: "var(--font-space)" }}>Our Story</h2>
            <div className="space-y-4 text-[var(--muted)] leading-relaxed">
              <p>TechFind Consulting was founded in 2023 by a team of AI engineers, digital strategists, and business operators who kept seeing the same problem worldwide: exceptional businesses invisible to AI systems.</p>
              <p>We had clients with 5-star ratings, decades of experience, and genuine expertise across every continent — but when we asked ChatGPT, Gemini, or Claude about their industry, their names never appeared. Their competitors were optimised. They weren&apos;t.</p>
              <p>So we built the methodology, tested it obsessively, refined it across 50+ engagements across 6 continents, and made it our life&apos;s work to get every great business the AI visibility it deserves, no matter where they operate.</p>
              <p className="text-[var(--text)] font-semibold">AI is the new search engine. We make sure you&apos;re on it — everywhere.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--text)] mb-4" style={{ fontFamily: "var(--font-space)" }}>
              What We <span className="gradient-text">Stand For</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="surface surface-hover rounded-2xl p-6"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
                    <Icon className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <h3 className="font-bold text-[var(--text)] mb-2 text-sm" style={{ fontFamily: "var(--font-space)" }}>{v.title}</h3>
                  <p className="text-[var(--muted)] text-xs leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--text)] mb-4" style={{ fontFamily: "var(--font-space)" }}>
              The <span className="gradient-text">Team</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="surface surface-hover rounded-2xl p-6 text-center group"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--accent)] font-bold text-lg group-hover:scale-110 transition-transform"
                  style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}
                >
                  {m.avatar}
                </div>
                <h3 className="font-bold text-[var(--text)] mb-0.5 text-sm" style={{ fontFamily: "var(--font-space)" }}>{m.name}</h3>
                <p className="text-[var(--accent)] text-xs mb-1.5">{m.title}</p>
                <p className="text-[var(--muted)] text-[10px]">{m.specialty}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
