"use client";

import { motion } from "framer-motion";
import { FinalCTA } from "@/components/home/FinalCTA";
import { BookOpen, Clock, ArrowUpRight } from "lucide-react";

const articles = [
  { tag: "AEO Guide",  title: "What is AI Engine Optimization? The Complete 2025 Guide",   excerpt: "AEO is the practice of making your business discoverable by AI systems. This guide covers everything you need to know about optimizing for ChatGPT, Gemini, and Perplexity.", readTime: "12 min read", date: "May 2025" },
  { tag: "Strategy",   title: "How African Businesses Can Win the AI Discovery Race",        excerpt: "African businesses are uniquely positioned to capture AI visibility in their markets — but most aren't taking advantage. Here's the strategic playbook.", readTime: "8 min read",  date: "April 2025" },
  { tag: "Technical",  title: "Structured Data for AI: Beyond Basic Schema Markup",          excerpt: "Most businesses only implement basic schema. Here's how to use advanced structured data to become a trusted signal for AI knowledge graphs.", readTime: "10 min read", date: "March 2025" },
  { tag: "Case Study", title: "How We Got a Nairobi Law Firm to Appear in ChatGPT in 90 Days", excerpt: "A step-by-step breakdown of the exact AEO strategy we used to take Kariuki & Associates from AI-invisible to AI-recommended.", readTime: "15 min read", date: "February 2025" },
  { tag: "Automation", title: "The WhatsApp AI Agent Stack: What We Use and Why",            excerpt: "Inside our preferred tech stack for building WhatsApp AI agents that qualify leads, answer questions, and close sales at scale.", readTime: "9 min read",  date: "January 2025" },
  { tag: "Research",   title: "AI Search Behaviour in Africa: 2025 Data Report",             excerpt: "Original research on how buyers across Kenya, Nigeria, South Africa, and Ghana are using AI tools to discover and evaluate businesses.", readTime: "20 min read", date: "December 2024" },
];

export function InsightsPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="orb orb-blue animate-orb absolute top-0 right-1/4 w-80 h-80 opacity-20" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-8">
            <span className="section-label"><BookOpen className="w-3.5 h-3.5" />Knowledge & Research</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[var(--text)]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            AEO <span className="gradient-text">Insights</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] text-lg max-w-xl mx-auto"
          >
            Guides, research, and case studies on AI Engine Optimization — from the team that does it for a living.
          </motion.p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="surface surface-hover rounded-2xl p-6 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}
                  >
                    {a.tag}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all" />
                </div>
                <h2
                  className="font-bold text-[var(--text)] text-base mb-3 leading-snug group-hover:text-[var(--accent)] transition-colors"
                  style={{ fontFamily: "var(--font-space)" }}
                >
                  {a.title}
                </h2>
                <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">{a.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--muted)] opacity-60">
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{a.readTime}</span>
                  <span>{a.date}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
