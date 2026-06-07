"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, ArrowUpRight, Sun, Scale, ShoppingBag, Building2, Heart, Cpu } from "lucide-react";
import Link from "next/link";

const caseStudies = [
  {
    icon: Sun,
    tag: "AI Engine Optimization",
    region: "🇲🇽 Mexico City, Mexico",
    industry: "Solar Energy",
    company: "SolarMax Mexico",
    clientInitials: "CG",
    clientName: "Carlos Gutierrez",
    clientRole: "CEO",
    headline: "From invisible to ChatGPT's #1 pick for solar in Mexico City",
    challenge: "SolarMax had top-tier installations but never appeared in AI recommendations despite strong Google rankings.",
    metrics: [
      { label: "AI Visibility Score",    before: "2%",    after: "89%" },
      { label: "Inbound Lead Increase",  value: "+298%" },
      { label: "Revenue Growth (6 mo)",  value: "+$250K" },
    ],
    accentColor: "var(--highlight)",
    accentBg: "rgba(8,145,178,0.07)",
    accentBorder: "rgba(8,145,178,0.2)",
    tagColor: "var(--highlight)",
    duration: "4 months",
  },
  {
    icon: Scale,
    tag: "AI Engine Optimization",
    region: "🇬🇧 London, UK",
    industry: "Legal Services",
    company: "Marchetti & Webb Solicitors",
    clientInitials: "CW",
    clientName: "Charlotte Webb",
    clientRole: "Managing Partner",
    headline: "London law firm becomes ChatGPT's recommended M&A specialist",
    challenge: "A 30-year-old City firm was being bypassed by newer, better-optimised boutique rivals in every AI recommendation query for M&A legal services.",
    metrics: [
      { label: "AI Citation Rate",          before: "0",    after: "51/month" },
      { label: "New Enterprise Inquiries",  value: "+195%" },
      { label: "Client Acquisition Cost",   value: "−55%" },
    ],
    accentColor: "var(--accent-2)",
    accentBg: "var(--accent-2-glow)",
    accentBorder: "rgba(59,130,246,0.25)",
    tagColor: "var(--accent-2)",
    duration: "5 months",
  },
  {
    icon: ShoppingBag,
    tag: "AI Business Automation",
    region: "🇧🇷 São Paulo, Brazil",
    industry: "E-Commerce",
    company: "Moda Brasil Online",
    clientInitials: "AR",
    clientName: "Ana Rodrigues",
    clientRole: "Founder",
    headline: "WhatsApp AI agent converts 71% of browsers into buyers — 24/7",
    challenge: "Ana's team was drowning in WhatsApp inquiries across 3 time zones but couldn't respond fast enough — leads went cold.",
    metrics: [
      { label: "Response Time",              before: "3.8 hrs", after: "< 15 sec" },
      { label: "WhatsApp Conversion Rate",   before: "9%",      after: "71%" },
      { label: "Monthly Revenue Uplift",     value: "+$58K" },
    ],
    accentColor: "var(--accent)",
    accentBg: "var(--accent-glow)",
    accentBorder: "var(--border-accent)",
    tagColor: "var(--accent)",
    duration: "3 weeks",
  },
  {
    icon: Building2,
    tag: "AI Engine Optimization",
    region: "🇦🇺 Sydney, Australia",
    industry: "Commercial Real Estate",
    company: "Pinnacle Properties Group",
    clientInitials: "LC",
    clientName: "Liam Carter",
    clientRole: "CEO",
    headline: "Sydney's top commercial broker dominates Perplexity & Gemini in APAC",
    challenge: "International investors searching for commercial real estate advisors in Asia-Pacific were missing Pinnacle despite their market leadership.",
    metrics: [
      { label: "AI Visibility (APAC queries)", before: "4%",  after: "82%" },
      { label: "International Enquiries",      value: "+268%" },
      { label: "Deal Pipeline Value",         value: "+$3.2M" },
    ],
    accentColor: "#f59e0b",
    accentBg: "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.2)",
    tagColor: "#f59e0b",
    duration: "6 months",
  },
  {
    icon: Heart,
    tag: "AI Engine Optimization",
    region: "🇺🇸 Austin, TX — USA",
    industry: "Healthcare",
    company: "ClearMind Wellness Clinics",
    clientInitials: "RT",
    clientName: "Dr. Rachel Torres",
    clientRole: "Founder",
    headline: "Mental health clinic chain becomes ChatGPT's top recommendation in Texas",
    challenge: "With 12 clinic locations across Texas, ClearMind had zero AI presence — potential patients searching ChatGPT for therapy providers never saw their name.",
    metrics: [
      { label: "AI Mention Rate",       before: "0",    after: "88%" },
      { label: "New Patient Enquiries", value: "+420%" },
      { label: "Cost Per Acquisition",  value: "−71%" },
    ],
    accentColor: "#10b981",
    accentBg: "rgba(16,185,129,0.07)",
    accentBorder: "rgba(16,185,129,0.2)",
    tagColor: "#10b981",
    duration: "5 months",
  },
  {
    icon: Cpu,
    tag: "AI Engine Optimization",
    region: "🇩🇪 Berlin, Germany",
    industry: "B2B SaaS",
    company: "Operata GmbH",
    clientInitials: "TK",
    clientName: "Tobias Krause",
    clientRole: "VP Marketing",
    headline: "German HR software brand cited by AI across 7 European markets",
    challenge: "Despite strong product-market fit, Operata was absent from AI answers when European HR directors asked about workforce management software.",
    metrics: [
      { label: "AI Citations (EU queries)", before: "3",   after: "120/mo" },
      { label: "Trial Sign-ups",            value: "+310%" },
      { label: "CAC Reduction",             value: "−48%" },
    ],
    accentColor: "var(--accent)",
    accentBg: "var(--accent-glow)",
    accentBorder: "var(--border-accent)",
    tagColor: "var(--accent)",
    duration: "7 months",
  },
];

export function CaseStudies() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <section className="relative py-28 overflow-hidden section-tinted-2" ref={ref}>
      <div className="orb orb-accent animate-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] opacity-15" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="inline-block mb-4">
            <span className="section-label">Client Results</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-geist)" }}
          >
            Real Results Across
            <br />
            <span className="gradient-text">Every Continent</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] max-w-xl mx-auto"
          >
            From Nairobi to New York, Singapore to Berlin — TechFind drives measurable AI visibility for businesses worldwide.
          </motion.p>
        </div>

        {/* Region pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {["🌍 Africa", "🌎 Americas", "🌏 Asia-Pacific", "🌐 Europe"].map((r) => (
            <span key={r} className="surface rounded-full px-4 py-1.5 text-xs font-medium text-[var(--muted)]">
              {r}
            </span>
          ))}
        </motion.div>

        {/* Case study grid — 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {caseStudies.map((cs, i) => {
            const Icon = cs.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
                className="surface surface-hover rounded-3xl overflow-hidden cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: cs.accentBg, border: `1px solid ${cs.accentBorder}` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cs.accentColor }} />
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: cs.accentBg, color: cs.tagColor, border: `1px solid ${cs.accentBorder}` }}
                    >
                      {cs.tag}
                    </span>
                  </div>

                  {/* Region badge */}
                  <div className="mb-3">
                    <span className="text-xs text-[var(--muted)] font-medium">{cs.region}</span>
                    <span className="mx-2 text-[var(--border)] text-xs">·</span>
                    <span className="text-xs text-[var(--muted)]">{cs.industry}</span>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${["#7C3AED", "#3B82F6", "#22D3EE", "#EC4899", "#F59E0B", "#10B981"][cs.clientInitials.charCodeAt(0) % 6]}, ${["#5B21B6", "#1E40AF", "#0891B2", "#BE185D", "#D97706", "#047857"][cs.clientInitials.charCodeAt(1) % 6]})`,
                      }}
                    >
                      {cs.clientInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[var(--text)]">{cs.clientName}</p>
                      <p className="text-[10px] text-[var(--muted)]">{cs.clientRole}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--muted)] font-medium mb-2.5">{cs.company}</p>
                  <h3
                    className="font-bold text-[var(--text)] text-sm leading-snug mb-3"
                    style={{ fontFamily: "var(--font-geist)" }}
                  >
                    {cs.headline}
                  </h3>
                  <p className="text-[var(--muted)] text-xs leading-relaxed mb-4">{cs.challenge}</p>

                  <div className="space-y-2 mb-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    {cs.metrics.map((m, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <span className="text-[var(--muted)] text-xs">{m.label}</span>
                        <div className="flex items-center gap-1.5">
                          {m.before && (
                            <>
                              <span className="text-xs text-[var(--muted)] line-through opacity-40">{m.before}</span>
                              <span className="text-[var(--muted)] text-[10px] opacity-30">→</span>
                              <span className="text-xs font-bold text-[var(--text)]">{m.after}</span>
                            </>
                          )}
                          {m.value && (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                              <TrendingUp className="w-3 h-3" />{m.value}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--muted)] text-xs">{cs.duration}</span>
                    <ArrowUpRight className="w-4 h-4 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
          className="text-center"
        >
          <Link href="/case-studies" className="btn-secondary group inline-flex">
            View All Case Studies
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
