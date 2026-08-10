"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    q: "What is AI Engine Optimization (AEO) and how does it work?",
    a: "AI Engine Optimization (AEO) is the process of optimizing your business content, structure, and authority so that AI systems like ChatGPT, Gemini, Claude, and Perplexity recommend you in their generated answers. Unlike SEO which targets Google's search index, AEO targets AI language models by ensuring your content is authoritative, current, well-structured, and highly relevant to user queries. When someone asks an AI system a question related to your industry, AEO ensures your business appears in the response."
  },
  {
    q: "Why should my business invest in AEO instead of traditional SEO?",
    a: "Both AEO and SEO are important, but they serve different purposes. SEO gets you in Google search results (declining as AI takes share). AEO gets you directly recommended by AI systems, which is increasingly where buyers start their research. 73% of B2B buyers now use AI for research. If you're not in those AI answers, you're losing significant visibility and leads. AEO provides faster results (30-90 days vs 6-12 months for SEO) and converts better because the recommendation comes from an AI system the user already trusts."
  },
  {
    q: "How long does it take to see results from AEO?",
    a: "Initial results vary by industry and competition. Most clients see their first AI citations within 30-60 days. Significant visibility across multiple AI platforms typically takes 4-6 months. The fastest results come from competitive niches with less established players. Conservative estimates: Week 1-4 (technical optimization), Month 1-3 (initial citations), Month 3-6 (sustained visibility across platforms). We track progress with transparent monthly reports showing citation frequency, platforms mentioning you, and traffic impact."
  },
  {
    q: "Which AI platforms does TechFind's AEO optimization cover?",
    a: "We optimize for all major AI platforms: ChatGPT (most popular, 100M+ weekly users), Google Gemini (integrated into Google Search), Claude (fastest-growing), Perplexity (high-intent search), Bing Copilot, and Google AI Overviews (AI answers in traditional Google results). Our methodology ensures consistent optimization across all platforms because they use different training data and citation criteria. Cross-platform visibility is critical because users ask different questions on different platforms."
  },
  {
    q: "What's included in an AI Visibility Audit?",
    a: "Our comprehensive AI Visibility Audit includes: (1) Current audit across 5+ AI platforms to see where you're cited, (2) Competitor benchmark showing how you compare to direct competitors, (3) Content gap analysis identifying which topics and queries you're missing, (4) Authority assessment reviewing your citations, backlinks, and domain strength, (5) Technical SEO audit ensuring proper structure and indexing, (6) Structured data review checking schema implementation, (7) Prioritized action plan with ROI estimates, (8) Implementation roadmap with timelines. The audit becomes your optimization blueprint."
  },
  {
    q: "How does AI Business Automation improve conversions?",
    a: "AI Business Automation uses AI agents to handle customer interactions, qualification, and sales. Real results: One e-commerce client achieved 68% WhatsApp conversion (up from 12%) with an AI agent that instantly answers questions, qualifies buyers, and facilitates purchases 24/7. A legal firm reduced case intake time by 60% with an AI agent that gathers case details before attorney consultation. Common implementations include: WhatsApp AI agents (instant responses), Chatbots (24/7 lead qualification), Knowledge base AI (instant answers), CRM integration (seamless sales handoff). Average improvement: 40-80% faster lead response, 3x more qualified leads, 50-70% conversion improvement."
  },
  {
    q: "What metrics do you track to measure AEO success?",
    a: "We provide transparent tracking of: AI Citation Frequency (how often you appear in AI answers monthly), Platform Distribution (which AI systems mention you most), Query Coverage (what topics/searches trigger your citation), AI-Attributed Traffic (visits originating from AI recommendations), Lead Quality (conversion rate of AI-sourced leads), Cost Per Acquisition (from AI sources vs other channels), Month-over-Month Growth (trending data). Monthly reports show progress across all metrics with comparisons to benchmarks. This data directly shows ROI of your AEO investment."
  },
  {
    q: "How is AEO different from traditional SEO and content marketing?",
    a: "SEO targets Google's index with keywords and backlinks (1-2 month lag, declining visibility as AI grows). AEO targets AI language models with authoritative, well-structured, current content (2-4 week lag, growing visibility). Content Marketing builds thought leadership over time (6+ months for results, harder to measure). AEO combines the best of both: fast implementation (weeks not months), measurable results (trackable citations), and future-proof positioning (in growing AI discovery channels). The three work together: SEO gets you in Google, AEO gets you in AI answers, Content Marketing builds long-term authority. Smart strategy uses all three."
  },
  {
    q: "Can you guarantee AI rankings or citations?",
    a: "No legitimate AEO agency can guarantee specific rankings or citation frequency - AI systems are constantly evolving and market competition changes daily. However, we guarantee: (1) 100% transparency on all metrics we track, (2) Monthly reporting on every citationwe detect, (3) Complete technical implementation within 30 days, (4) Content optimization to our proven standards, (5) Regular strategy adjustments based on performance data. What we promise: A systematic approach to improve your AEO metrics, clear metrics to measure progress, and expert guidance. Results depend on your industry, competition, and existing authority. We've achieved top AI recommendation status for clients in 15+ industries."
  },
  {
    q: "What industries have you optimized for AEO and what were the results?",
    a: "We have proven AEO success across diverse industries globally: Solar Energy (SolarMax Mexico - 2% to 89% AI visibility, +298% leads), Legal Services (Marchetti & Webb London - 0 to 51/month ChatGPT citations, +195% enquiries), E-Commerce (Moda Brasil São Paulo - 71% WhatsApp AI conversion rate), Real Estate (Pinnacle Properties Sydney - 4% to 82% AI visibility for APAC), Healthcare (AfyaPlus Wellness Nairobi - 0 to 88% AI mention rate, +420% patient enquiries), B2B SaaS (Operata Berlin - 3 to 120 monthly AI citations). Success factors across industries: (1) Authority in your niche, (2) Current, detailed content, (3) Proper technical structure, (4) Strong entity optimization. We tailor the approach to your industry's specific AI discovery patterns globally."
  },
  {
    q: "How much does AEO optimization cost and what's the ROI?",
    a: "Pricing: AI Visibility Starter ($900/month) includes audit, optimization strategy, technical fixes, quarterly reviews. AEO Growth Partner ($1,200/month) includes everything in Starter plus 3-month full implementation, monthly citation tracking, content optimization, ongoing strategy adjustments. Custom enterprise pricing available. ROI typically: Month 1 ($900 cost, $0 direct benefit), Month 2-3 ($1,800-2,700 cost, first AI citations emerging), Month 4-6 ($3,600-5,400 total cost, significant lead volume). Average client sees 3-5x ROI within 6 months based on lead quality and conversion improvements. One solar client in Mexico: $5,400 investment → $250K revenue uplift in 6 months. Another e-commerce brand in Brazil: $3,900 investment → $58K monthly revenue increase within 3 weeks."
  }
];

export function OptimizedFAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-28 overflow-hidden" style={{ background: "var(--bg-2)" }} ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="section-label mb-4 inline-block">
            AI Engine Optimization Questions
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--text)]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Everything You Need to Know About
            <br />
            <span className="gradient-text">Getting Found by AI</span>
          </h2>
          <p className="text-[var(--muted)] max-w-2xl mx-auto">
            Learn how AI Engine Optimization works, how long it takes, and how much it costs.
            Get answers to the questions our clients ask most.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqData.map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left rounded-xl border px-6 py-4 flex items-center justify-between gap-4 transition-all duration-200 group"
                style={{
                  background: open === i ? "var(--card-hover)" : "var(--card)",
                  borderColor: open === i ? "var(--border-accent)" : "var(--border)",
                }}
              >
                <span className="font-semibold text-[var(--text)] text-sm leading-snug">{q}</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
                     style={{ background: open === i ? "var(--accent)" : "transparent", border: `1px solid ${open === i ? "var(--accent)" : "var(--border)"}` }}>
                  {open === i
                    ? <Minus className="w-3.5 h-3.5 text-white" />
                    : <Plus className="w-3.5 h-3.5 text-[var(--muted)]" />
                  }
                </div>
              </button>

              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 pt-3 text-sm text-[var(--muted)] leading-relaxed bg-[var(--card-hover)] border-l-2 border-[var(--accent)]">
                    {a}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-xl border border-[var(--border-accent)]"
          style={{ background: "linear-gradient(135deg, var(--accent-glow), var(--accent-2-glow))" }}
        >
          <h3 className="font-bold text-[var(--text)] mb-2">Still have questions?</h3>
          <p className="text-sm text-[var(--muted)] mb-4">
            Our AEO specialists are ready to discuss your specific situation and create a custom optimization strategy.
          </p>
          <a href="/audit" className="btn-primary text-sm inline-block">
            Run a Free Audit
          </a>
        </motion.div>
      </div>
    </section>
  );
}
