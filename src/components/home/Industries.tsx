"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sun, Home, Scale, Heart, GraduationCap, Hotel,
  Palette, Building2, Code2, Users, ArrowRight,
} from "lucide-react";
import Link from "next/link";

const industries = [
  { icon: Sun, label: "Solar Companies", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", query: '"Best solar installers Kenya?"' },
  { icon: Home, label: "Real Estate Firms", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", query: '"Top property developers Nairobi?"' },
  { icon: Scale, label: "Law Firms", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", query: '"Best corporate law firm East Africa?"' },
  { icon: Heart, label: "Clinics & Hospitals", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", query: '"Trusted private hospital in Kenya?"' },
  { icon: GraduationCap, label: "Schools", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", query: '"Top international schools Nairobi?"' },
  { icon: Hotel, label: "Hotels & Resorts", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", query: '"Best business hotels in Nairobi?"' },
  { icon: Palette, label: "Interior Design", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", query: '"Luxury interior designers Kenya?"' },
  { icon: Building2, label: "Construction", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", query: '"Top construction companies Kenya?"' },
  { icon: Code2, label: "SaaS Companies", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", query: '"Best SaaS HR software Africa?"' },
  { icon: Users, label: "Recruitment Firms", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", query: '"Top recruitment agencies Kenya?"' },
];

export function Industries() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-600/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4"
          >
            Industries We Serve
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            We Serve Businesses
            <br />
            <span className="gradient-text">Across Every Sector</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-lg mx-auto"
          >
            If buyers are searching for your service on AI platforms, TechFind can get you recommended.
          </motion.p>
        </div>

        {/* Industry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
          {industries.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`group relative glass border ${industry.border} rounded-2xl p-4 cursor-pointer overflow-hidden`}
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 ${industry.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-xl ${industry.bg} border ${industry.border} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${industry.color}`} />
                  </div>
                  <p
                    className="font-semibold text-sm text-white mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {industry.label}
                  </p>
                  <p className="text-[10px] text-white/30 italic leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                    {industry.query}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="glass border border-white/5 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-syne)" }}>
              Don&apos;t see your industry?
            </h3>
            <p className="text-white/50 text-sm">
              If your customers can ask AI for your service, we can optimize you to be the answer.
              We work with businesses in any industry globally.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full glass border border-white/10 hover:border-blue-500/30 text-white/70 hover:text-white transition-all whitespace-nowrap group"
          >
            Let&apos;s Talk
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
