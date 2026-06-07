"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { QualData } from "./AuditFlow";

interface Props { onSubmit: (data: QualData) => void; }

const questions: Array<{
  key: keyof QualData;
  label: string;
  options: { value: string; label: string }[];
}> = [
  {
    key: "isDecisionMaker",
    label: "Are you the owner, founder, or marketing decision maker?",
    options: [
      { value: "yes", label: "Yes, I make marketing decisions" },
      { value: "no",  label: "No, I'm researching for someone else" },
    ],
  },
  {
    key: "budget",
    label: "What is your monthly marketing budget?",
    options: [
      { value: "under500",  label: "Under $500/month" },
      { value: "$1k-$3k",   label: "$1,000 – $3,000/month" },
      { value: "$3k-$10k",  label: "$3,000 – $10,000/month" },
      { value: "$10k+",     label: "$10,000+/month" },
    ],
  },
  {
    key: "currentMarketing",
    label: "Do you currently invest in SEO, ads, or content marketing?",
    options: [
      { value: "yes_all",  label: "Yes — SEO + paid ads + content" },
      { value: "yes_some", label: "Yes — some of these" },
      { value: "no",       label: "No, not currently" },
    ],
  },
  {
    key: "timeline",
    label: "How soon do you want to start improving AI visibility?",
    options: [
      { value: "immediately", label: "Immediately — I'm ready now" },
      { value: "1-3months",   label: "Within 1–3 months" },
      { value: "3-6months",   label: "3–6 months from now" },
      { value: "justlooking", label: "Just exploring options" },
    ],
  },
  {
    key: "revenue",
    label: "What is your approximate annual business revenue?",
    options: [
      { value: "under100k",   label: "Under $100,000" },
      { value: "100k-500k",   label: "$100K – $500K" },
      { value: "500k-2m",     label: "$500K – $2M" },
      { value: "2m+",         label: "$2M+" },
    ],
  },
];

export function AuditQualification({ onSubmit }: Props) {
  const [answers, setAnswers] = useState<Partial<QualData>>({});
  const [current, setCurrent] = useState(0);

  function select(key: keyof QualData, value: string) {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 350);
    } else {
      setTimeout(() => onSubmit(updated as QualData), 350);
    }
  }

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="orb orb-accent animate-orb absolute top-0 left-0 w-[400px] h-[400px] opacity-20" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--muted)]">Question {current + 1} of {questions.length}</span>
            <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
              {Math.round(progress)}% done
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "var(--border)" }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${progress}%` }}
              style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question card */}
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="surface rounded-3xl p-8"
        >
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--border-accent)" }}>
              Question {current + 1}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text)] leading-snug"
              style={{ fontFamily: "var(--font-space)" }}>
              {q.label}
            </h2>
          </div>

          <div className="space-y-3">
            {q.options.map(opt => {
              const selected = answers[q.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => select(q.key, opt.value)}
                  className="w-full text-left px-5 py-4 rounded-2xl flex items-center gap-3 transition-all"
                  style={{
                    background: selected ? "var(--accent-glow)" : "var(--card-hover)",
                    border: `1px solid ${selected ? "var(--border-accent)" : "var(--border)"}`,
                    color: selected ? "var(--accent)" : "var(--text)",
                  }}
                >
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{ borderColor: selected ? "var(--accent)" : "var(--border)" }}>
                    {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />}
                  </div>
                  <span className="text-sm font-medium">{opt.label}</span>
                  {selected && <CheckCircle2 className="w-4 h-4 ml-auto" style={{ color: "var(--accent)" }} />}
                </button>
              );
            })}
          </div>

          {current === questions.length - 1 && answers[q.key] && (
            <button
              onClick={() => onSubmit(answers as QualData)}
              className="btn-primary w-full justify-center mt-5"
            >
              See My Results
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        <p className="text-center text-xs text-[var(--muted)] mt-4 opacity-60">
          Your answers help us tailor the right growth strategy for your business
        </p>
      </div>
    </section>
  );
}
