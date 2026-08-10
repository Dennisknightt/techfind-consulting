"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sun, Home, Scale, Heart, GraduationCap, Hotel, Palette, Building2, Code2, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const industries = [
  { icon: Sun,           label: "Solar Companies",    query: '"Best solar installers Mexico?"' },
  { icon: Home,          label: "Real Estate Firms",  query: '"Top property developers Singapore?"' },
  { icon: Scale,         label: "Law Firms",           query: '"Best corporate law firms London?"' },
  { icon: Heart,         label: "Clinics & Hospitals", query: '"Trusted private hospitals Nairobi?"' },
  { icon: GraduationCap, label: "Schools",             query: '"Top international schools Tokyo?"' },
  { icon: Hotel,         label: "Hotels & Resorts",   query: '"Best business hotels Paris?"' },
  { icon: Palette,       label: "Interior Design",    query: '"Luxury interior designers Nairobi?"' },
  { icon: Building2,     label: "Construction",       query: '"Top construction companies Dubai?"' },
  { icon: Code2,         label: "SaaS Companies",     query: '"Best SaaS software Berlin?"' },
  { icon: Users,         label: "Recruitment Firms",  query: '"Top recruitment agencies Toronto?"' },
];

export function Industries() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="orb orb-cyan animate-orb-3 absolute top-0 left-0 w-72 h-72 opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="inline-block mb-4">
            <span className="section-label">Industries We Serve</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            We Serve Businesses
            <br />
            <span className="gradient-text">Across Every Sector</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] max-w-lg mx-auto"
          >
            If buyers are searching for your service on AI platforms, TechFind can get you recommended.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.04 * i, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="surface surface-hover rounded-2xl p-4 cursor-pointer group relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: "var(--card-hover)" }}>
                  <Icon className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--highlight)] transition-colors" />
                </div>
                <p className="font-semibold text-sm text-[var(--text)] mb-2 leading-snug" style={{ fontFamily: "var(--font-space)" }}>
                  {ind.label}
                </p>
                <p className="text-[10px] text-[var(--muted)] italic leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {ind.query}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="surface rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: "var(--font-space)" }}>
              Don&apos;t see your industry?
            </h3>
            <p className="text-[var(--muted)] text-sm">
              If your customers can ask AI for your service, we can optimise you to be the answer — in any industry, globally.
            </p>
          </div>
          <Link href="/contact" className="btn-secondary whitespace-nowrap group">
            Let&apos;s Talk
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
