"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Star, Clock, Users, ArrowRight, Trophy } from "lucide-react";
import type { AuditData, AuditScores } from "./AuditFlow";

interface Props { data: AuditData; scores: AuditScores; }

/* ── Load Calendly widget script once ─────────────────────────── */
function useCalendlyScript() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.getElementById("calendly-script-public")) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.id    = "calendly-script-public";
    script.src   = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);
  return ready;
}

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
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  const calendlyReady = useCalendlyScript();

  useEffect(() => {
    const saved = localStorage.getItem("tf_calendly_url");
    if (saved) setCalendlyUrl(saved);
  }, []);

  const prefillUrl = calendlyUrl
    ? `${calendlyUrl}?name=${encodeURIComponent(data.companyName)}&email=${encodeURIComponent(data.email)}&a1=${scores.overall}`
    : null;

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
            Hi {data.companyName.split(" ")[0]} — based on your score of{" "}
            <strong style={{ color: "#ef4444" }}>{scores.overall}/100</strong>,
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

          {/* Calendly embed — real if URL is set, placeholder otherwise */}
          {prefillUrl && calendlyReady ? (
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div
                className="calendly-inline-widget"
                data-url={prefillUrl}
                style={{ minWidth: "100%", height: 700 }}
              />
            </div>
          ) : prefillUrl ? (
            /* Script still loading — show spinner */
            <div className="rounded-2xl flex items-center justify-center p-10"
              style={{ background: "var(--card-hover)", border: "1px solid var(--border)", height: 200 }}>
              <p className="text-sm text-[var(--muted)]">Loading calendar…</p>
            </div>
          ) : (
            /* No Calendly URL configured yet */
            <div
              className="rounded-2xl flex flex-col items-center justify-center p-10 text-center"
              style={{ background: "var(--card-hover)", border: "1px dashed var(--border)" }}
            >
              <Calendar className="w-12 h-12 mb-4" style={{ color: "var(--accent)" }} />
              <h4 className="font-bold text-[var(--text)] mb-2">Schedule Your Strategy Call</h4>
              <p className="text-sm text-[var(--muted)] mb-5 max-w-xs">
                We&apos;ll reach out to {data.email} within 24 hours to confirm a time that works for you.
              </p>
              <a
                href={`mailto:${data.email}?subject=Your Free AEO Strategy Call — ${data.companyName}`}
                className="btn-primary group inline-flex"
              >
                Confirm via Email
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          )}
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
