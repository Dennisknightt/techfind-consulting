"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Database, Cpu, Workflow, Briefcase, ArrowRight, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

const roles = [
  { icon: Cpu,      title: "AI Engineers",             desc: "LLM integration, prompt engineering, RAG systems",  available: 12 },
  { icon: Code2,    title: "Software Developers",       desc: "Full-stack, mobile, API, and cloud development",    available: 24 },
  { icon: Database, title: "Data Engineers",            desc: "Pipelines, warehouses, analytics, and BI systems",  available: 8  },
  { icon: Workflow, title: "Automation Specialists",    desc: "n8n, Make, Zapier, and custom workflow builders",   available: 6  },
  { icon: Briefcase,title: "Fractional CTOs",           desc: "Senior tech leadership for growing businesses",     available: 4  },
];

const features = [
  "All talent is pre-vetted and tested",
  "Global team with world-class standards",
  "Available for short-term and long-term",
  "Managed and accountable to TechFind",
  "Plug directly into client projects",
];

export function TalentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="orb orb-accent animate-orb absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: cards */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-7">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}
              >
                <Users className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">Division</div>
                <div className="font-bold text-[var(--text)]" style={{ fontFamily: "var(--font-space)" }}>TechFind Talent</div>
              </div>
            </div>

            <div className="space-y-3">
              {roles.map((role, i) => {
                const Icon = role.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.08 + i * 0.08 }}
                    whileHover={{ x: 4 }}
                    className="surface surface-hover rounded-2xl p-4 flex items-center gap-4 group cursor-pointer"
                    style={{ borderColor: "var(--border-accent)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}
                    >
                      <Icon className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-[var(--text)] mb-0.5" style={{ fontFamily: "var(--font-space)" }}>
                        {role.title}
                      </h4>
                      <p className="text-[var(--muted)] text-xs">{role.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-[var(--muted)] mb-0.5">available</div>
                      <div className="text-lg font-bold text-[var(--accent)]" style={{ fontFamily: "var(--font-space)" }}>
                        {role.available}+
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 pt-3 pl-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[var(--muted)]">54+ vetted professionals available now</span>
            </motion.div>
          </motion.div>

          {/* Right */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-block mb-6"
            >
              <span className="section-label">TechFind Talent Division</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[var(--text)]"
              style={{ fontFamily: "var(--font-space)" }}
            >
              Need Implementation
              <br />
              <span className="gradient-text-violet">Talent?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-[var(--muted)] text-lg leading-relaxed mb-6"
            >
              When clients need hands-on technical execution, our Talent Division provides access
              to a curated network of vetted AI engineers, developers, and automation specialists.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="text-[var(--muted)] leading-relaxed mb-8"
            >
              This is an extension for clients who want TechFind to both strategise and execute.
              Every hire is managed, accountable, and held to our quality standards.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-3 mb-8"
            >
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  {f}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Link href="/talent" className="btn-secondary group inline-flex">
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
