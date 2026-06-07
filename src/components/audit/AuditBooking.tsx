"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Star, Clock, Users, ArrowRight, Trophy } from "lucide-react";
import type { AuditData, AuditScores } from "./AuditFlow";

interface Props { data: AuditData; scores: AuditScores; }

const included = [
  "Review your full AI Visibility Report",
  "Identify your top 3 competitor gaps",
  "Design a 90-day AEO action plan",
  "Recommend the right package for your goals",
  "Answer all your questions live",
];

const reviews = [
  { name: "Marcus T.", role: "HVAC Business Owner", text: "Within 3 months we were showing up in ChatGPT searches. Our lead volume doubled.", stars: 5 },
  { name: "Sarah K.", role: "Law Firm Partner",     text: "TechFind completely changed how clients find us. The AI audit was eye-opening.", stars: 5 },
];

export function AuditBooking({ data, scores }: Props) {
  return (
    <section className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="orb orb-accent animate-pulse-glow absolute top-0 left-0 w-[500px] h-[500px] opacity-20" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Qualified badge */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: "#10b98122", border: "1px solid #10b98144" }}>
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">You qualify for a free Strategy Call</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text)] mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
            Book Your AI Visibility
            <br />
            <span className="gradient-text">Strategy Call</span>
          </h2>
          <p className="text-[var(--muted)] max-w-lg mx-auto">
            Hi {data.companyName.split(" ")[0]} — based on your score of <strong style={{ color: "#ef4444" }}>{scores.overall}/100</strong>,
            you have significant revenue being left on the table. Let&apos;s fix that.
          </p>
        </motion.div>

        {/* Call details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="surface rounded-3xl p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ background: "var(--card-hover)", border: "1px solid var(--border)" }}>
              <Clock className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
              <span className="text-[var(--muted)]">30 minutes</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ background: "var(--card-hover)", border: "1px solid var(--border)" }}>
              <Users className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
              <span className="text-[var(--muted)]">1-on-1 with an AEO strategist</span>
            </div>
          </div>

          <h3 className="font-bold text-[var(--text)] mb-4">What we&apos;ll cover on the call:</h3>
          <div className="space-y-2.5 mb-7">
            {included.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-[var(--muted)]">{item}</span>
              </div>
            ))}
          </div>

          {/* Calendly embed placeholder */}
          <div
            className="rounded-2xl flex flex-col items-center justify-center p-10 text-center"
            style={{ background: "var(--card-hover)", border: "1px dashed var(--border)" }}
          >
            <Calendar className="w-12 h-12 mb-4" style={{ color: "var(--accent)" }} />
            <h4 className="font-bold text-[var(--text)] mb-2">Calendar Booking</h4>
            <p className="text-sm text-[var(--muted)] mb-5 max-w-xs">
              Connect your Calendly or Google Calendar to activate live booking.
              Qualified leads land directly in your calendar.
            </p>
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group inline-flex"
            >
              Connect Calendly
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {reviews.map((r, i) => (
            <div key={i} className="surface rounded-2xl p-5">
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[var(--muted)] italic mb-3">&ldquo;{r.text}&rdquo;</p>
              <div>
                <p className="text-xs font-semibold text-[var(--text)]">{r.name}</p>
                <p className="text-xs text-[var(--muted)]">{r.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
