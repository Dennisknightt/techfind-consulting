"use client";

import { motion } from "framer-motion";
import { AeoServices } from "@/components/home/AeoServices";
import { Process } from "@/components/home/Process";
import { Pricing } from "@/components/home/Pricing";

const faqs = [
  { q: "What is AI Engine Optimization (AEO)?",            a: "AEO is the practice of optimizing your business to be discovered, understood, and recommended by AI systems like ChatGPT, Gemini, Perplexity, and Google AI. It combines entity optimization, structured data, authority content, and citation building." },
  { q: "How is AEO different from SEO?",                   a: "SEO optimizes for traditional search engines (Google rankings). AEO optimizes for AI language models that generate conversational answers. AEO focuses on entity recognition, knowledge graphs, structured data, and being cited by authoritative sources — not keyword rankings." },
  { q: "How long does it take to see results?",            a: "Most clients see measurable improvements in their AI visibility within 60-90 days. Full AI recommendation status typically develops over 3-6 months, depending on your industry competitiveness and starting baseline." },
  { q: "Which AI platforms do you optimize for?",          a: "We optimize for ChatGPT, Google Gemini, Perplexity, Claude AI, Google SGE, Microsoft Copilot, and all major AI search platforms. Our approach is platform-agnostic — good AEO works across all AI systems." },
  { q: "Do I need to change my website?",                  a: "In most cases, we add to your existing website rather than rebuild it. We implement structured data, improve content architecture, and add entity signals — this typically doesn't require a full rebuild." },
];

export function AeoDetails() {
  return (
    <div>
      {/* Why AEO */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-4xl font-bold text-[var(--text)] mb-6" style={{ fontFamily: "var(--font-space)" }}>
                Why AEO Matters{" "}
                <span className="gradient-text">Right Now</span>
              </h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>The way people discover businesses is fundamentally changing. Over 1 billion people now use AI tools monthly for research and recommendations. When they ask ChatGPT or Gemini for a recommendation, the AI doesn&apos;t show a list of links — it gives a direct answer with specific companies it trusts.</p>
                <p>Businesses that are structured, cited, and understood by AI get those recommendations. Businesses that aren&apos;t — regardless of how good their product is — are invisible.</p>
                <p>AEO is the bridge between your business and AI discovery. It&apos;s not about gaming algorithms — it&apos;s about making your business truly legible to the AI systems that your customers are using.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {[
                { stat: "1B+",   label: "monthly AI search users globally",         color: "var(--accent-2)" },
                { stat: "67%",   label: "of buyers trust AI recommendations over ads", color: "var(--accent)" },
                { stat: "3×",    label: "higher intent from AI-referred leads",      color: "var(--highlight)" },
                { stat: "2025",  label: "the year AI becomes the default search interface", color: "var(--accent)" },
              ].map(({ stat, label, color }, i) => (
                <div key={i} className="surface rounded-2xl p-5 flex items-center gap-5">
                  <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-space)", color }}>{stat}</span>
                  <span className="text-[var(--muted)] text-sm">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <AeoServices />
      <Process />

      {/* FAQ */}
      <section className="relative py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--text)] mb-4" style={{ fontFamily: "var(--font-space)" }}>
              AEO <span className="gradient-text">FAQ</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="surface rounded-2xl p-6"
              >
                <h3 className="font-bold text-[var(--text)] mb-3" style={{ fontFamily: "var(--font-space)" }}>{faq.q}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />
    </div>
  );
}
