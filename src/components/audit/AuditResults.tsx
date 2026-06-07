"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, TrendingUp, Eye, Brain, Shield, Zap } from "lucide-react";
import type { AuditData, AuditScores } from "./AuditFlow";

interface Props {
  scores: AuditScores;
  data: AuditData;
  onContinue: () => void;
}

const scoreColor = (v: number) =>
  v >= 70 ? "#10b981" : v >= 50 ? "#f59e0b" : "#ef4444";

const scoreLabel = (v: number) =>
  v >= 70 ? "Good" : v >= 50 ? "Needs Work" : "Critical";

const issues = [
  "Missing FAQ schema markup across service pages",
  "Weak entity signals — AI can't identify your core offerings",
  "Poor structured data for local business presence",
  "Limited authority content for AI citation",
  "Competitor outranking you in 3 AI platforms",
  "No clear brand definition in knowledge graphs",
  "Low E-E-A-T signals for AI trust scoring",
  "Missing industry-specific terminology clusters",
  "Incomplete NAP consistency across citations",
  "Weak AI-readable 'About' and service page copy",
  "No review schema for social proof signals",
  "Outdated backlink profile reducing authority",
  "Missing FAQ-style Q&A content format",
  "Low semantic keyword density for AI engines",
  "No thought leadership or citation-worthy assets",
  "Competitor gap: 4 keywords where rivals appear",
  "Perplexity & Gemini do not recognise your brand",
];

const platforms = [
  { name: "ChatGPT",    visible: false },
  { name: "Claude",     visible: false },
  { name: "Gemini",     visible: false },
  { name: "Perplexity", visible: false },
];

function ScoreCard({ label, value, icon: Icon, delay }: { label: string; value: number; icon: React.ElementType; delay: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const dur = 1200;
    const steps = 60;
    const inc = value / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(value, cur + inc);
      setDisplayed(Math.round(cur));
      if (cur >= value) clearInterval(id);
    }, dur / steps);
    return () => clearInterval(id);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="surface rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
        <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-end gap-2 mb-2.5">
        <span className="text-4xl font-bold" style={{ color: scoreColor(displayed), fontFamily: "var(--font-space)" }}>
          {displayed}
        </span>
        <span className="text-[var(--muted)] text-sm mb-1">/100</span>
        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${scoreColor(displayed)}22`, color: scoreColor(displayed) }}>
          {scoreLabel(displayed)}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${displayed}%` }}
          style={{ background: scoreColor(displayed) }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export function AuditResults({ scores, data, onContinue }: Props) {
  const [overallDisplayed, setOverallDisplayed] = useState(0);
  useEffect(() => {
    const dur = 1800;
    const steps = 90;
    const inc = scores.overall / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(scores.overall, cur + inc);
      setOverallDisplayed(Math.round(cur));
      if (cur >= scores.overall) clearInterval(id);
    }, dur / steps);
    return () => clearInterval(id);
  }, [scores.overall]);

  const shownIssues = issues.slice(0, scores.opportunities);

  return (
    <section className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Audit Complete for {data.companyName}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text)] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
            Your AI Visibility Score
          </h2>
          <p className="text-[var(--muted)]">Here&apos;s how AI platforms currently see your brand</p>
        </motion.div>

        {/* Overall score ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="surface rounded-3xl p-8 mb-6 text-center"
          style={{ border: `2px solid ${scoreColor(scores.overall)}44` }}
        >
          <div className="relative w-40 h-40 mx-auto mb-5">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="10" />
              <motion.circle
                cx="60" cy="60" r="52" fill="none"
                stroke={scoreColor(scores.overall)} strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 52}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 52 * (1 - scores.overall / 100)}` }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold" style={{ color: scoreColor(overallDisplayed), fontFamily: "var(--font-space)" }}>
                {overallDisplayed}
              </span>
              <span className="text-xs text-[var(--muted)]">/ 100</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-[var(--text)] mb-1">Overall AI Visibility Score</h3>
          <p className="text-[var(--muted)] text-sm max-w-md mx-auto">
            {scores.overall < 40
              ? "Your business is largely invisible to AI search engines. Competitors are capturing your leads."
              : scores.overall < 60
              ? "You have some AI presence, but significant opportunities remain. Your competitors likely outperform you."
              : "Decent visibility, but there are clear gaps keeping you from dominating AI recommendations."}
          </p>

          {/* Platform visibility */}
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            {platforms.map(p => (
              <div key={p.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                style={{ background: "var(--card-hover)", border: "1px solid var(--border)" }}>
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[var(--muted)]">{p.name}: Not found</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sub-score cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ScoreCard label="Technical SEO"       value={scores.technical}   icon={Zap}          delay={0.3} />
          <ScoreCard label="Entity Optimization" value={scores.entity}      icon={Brain}        delay={0.4} />
          <ScoreCard label="Authority"           value={scores.authority}   icon={Shield}       delay={0.5} />
          <ScoreCard label="AI Readiness"        value={scores.aiReadiness} icon={TrendingUp}   delay={0.6} />
        </div>

        {/* Opportunities preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="surface rounded-3xl p-7 mb-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#ef444422" }}>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text)]">
                We found <span className="text-red-400">{scores.opportunities} opportunities</span> to improve your visibility
              </h3>
              <p className="text-xs text-[var(--muted)]">Inside ChatGPT, Claude, Gemini and Perplexity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
            {shownIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                style={{ background: "var(--card-hover)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span className="text-xs text-[var(--muted)]">{issue}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
            <Eye className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} />
            <p className="text-xs" style={{ color: "var(--accent)" }}>
              <strong>Full detailed report</strong> — including competitor gaps, keyword opportunities, and a 90-day fix plan — available after a brief strategy call.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="text-center"
        >
          <p className="text-[var(--muted)] text-sm mb-4">
            Answer 5 quick questions to see if you qualify for a free strategy call.
          </p>
          <button onClick={onContinue} className="btn-primary text-base px-10 py-4 group inline-flex">
            See My Full Report & Fix Plan
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <p className="text-xs text-[var(--muted)] mt-3 opacity-60">Takes 60 seconds · No commitment</p>
        </motion.div>
      </div>
    </section>
  );
}
