"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Database, Cpu, Workflow, Briefcase, ArrowRight, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

const roles = [
  { icon: Cpu, title: "AI Engineers", desc: "LLM integration, prompt engineering, RAG systems", available: 12 },
  { icon: Code2, title: "Software Developers", desc: "Full-stack, mobile, API, and cloud development", available: 24 },
  { icon: Database, title: "Data Engineers", desc: "Pipelines, warehouses, analytics, and BI systems", available: 8 },
  { icon: Workflow, title: "Automation Specialists", desc: "n8n, Make, Zapier, and custom workflow builders", available: 6 },
  { icon: Briefcase, title: "Fractional CTOs", desc: "Senior tech leadership for growing businesses", available: 4 },
];

const features = [
  "All talent is pre-vetted and tested",
  "Africa-based with global standards",
  "Available for short-term and long-term",
  "Managed and accountable to TechFind",
  "Plug directly into client projects",
];

export function TalentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-transparent" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Talent cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            {/* Header label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <div className="text-xs text-violet-400 font-medium tracking-widest uppercase">Division</div>
                <div className="font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>TechFind Talent</div>
              </div>
            </div>

            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="group glass border border-violet-500/15 rounded-2xl p-4 flex items-center gap-4 hover:border-violet-500/30 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-white mb-0.5" style={{ fontFamily: "var(--font-syne)" }}>
                      {role.title}
                    </h4>
                    <p className="text-white/40 text-xs">{role.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-white/20 mb-0.5">available</div>
                    <div className="text-lg font-black text-violet-400" style={{ fontFamily: "var(--font-syne)" }}>
                      {role.available}+
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Live indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 pt-2 pl-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/30">54+ vetted professionals available now</span>
            </motion.div>
          </motion.div>

          {/* Right: Description */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-2 text-violet-400 text-xs font-medium border border-violet-500/30 bg-violet-500/10 rounded-full px-3 py-1.5 mb-6"
            >
              <Users className="w-3.5 h-3.5" />
              TechFind Talent Division
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Need Implementation
              <br />
              <span className="text-violet-400">Talent?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg leading-relaxed mb-6"
            >
              When clients need hands-on technical execution, our TechFind Talent Division provides
              access to a curated network of vetted AI engineers, developers, and automation specialists.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="text-white/50 leading-relaxed mb-8"
            >
              This is not our primary offering — it&apos;s an extension for clients who want TechFind to
              both strategize and execute. Every hire is managed, accountable, and held to our quality standards.
            </motion.p>

            {/* Feature list */}
            <motion.ul
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-3 mb-8"
            >
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/60">
                  <CheckCircle className="w-4 h-4 text-violet-400 shrink-0" />
                  {f}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/talent"
                className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full glass border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/50 transition-all group"
              >
                View Talent Division
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
