"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuditForm } from "./AuditForm";
import { AuditAnalyzing } from "./AuditAnalyzing";
import { AuditResults } from "./AuditResults";
import { AuditQualification } from "./AuditQualification";
import { AuditBooking } from "./AuditBooking";
import { AuditNurture } from "./AuditNurture";

export type AuditData = {
  websiteUrl:  string;
  companyName: string;
  email:       string;
  industry:    string;
  country:     string;
  phone?:      string;
  /** Cloudflare Turnstile token (optional) */
  _token?:    string;
  /** Page-load timestamp — used server-side for bot timing check */
  _loadedAt?: number;
  /** Honeypot value — always empty for real users */
  _hp?:       string;
};

export type AuditScores = {
  overall:      number;
  technical:    number;
  entity:       number;
  authority:    number;
  aiReadiness:  number;
  opportunities: number;
};

export type QualData = {
  isDecisionMaker:  string;
  budget:           string;
  currentMarketing: string;
  timeline:         string;
  revenue:          string;
};

export type Step = "form" | "analyzing" | "results" | "qualification" | "booking" | "nurture";

function generateScores(data: AuditData): AuditScores {
  const seed = data.websiteUrl.length + data.companyName.length;
  const base = 28 + (seed % 22);
  return {
    overall:       base,
    technical:     Math.min(99, base + 3 + (seed % 12)),
    entity:        Math.max(10, base - 8 + (seed % 10)),
    authority:     Math.max(10, base - 5 + (seed % 15)),
    aiReadiness:   Math.max(10, base - 12 + (seed % 18)),
    opportunities: 12 + (seed % 9),
  };
}

function qualifyLead(qual: QualData): boolean {
  const budgetOk   = ["$1k-$3k", "$3k-$10k", "$10k+"].includes(qual.budget);
  const decisionOk = qual.isDecisionMaker === "yes";
  const timelineOk = ["immediately", "1-3months"].includes(qual.timeline);
  return budgetOk && decisionOk && timelineOk;
}

async function submitLead(
  data:      AuditData,
  scores:    AuditScores,
  qual:      QualData,
  qualified: boolean,
): Promise<void> {
  try {
    await fetch("/api/leads", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Core audit data
        companyName:  data.companyName,
        websiteUrl:   data.websiteUrl,
        email:        data.email,
        industry:     data.industry,
        country:      data.country,
        phone:        data.phone,

        // Bot-detection fields (empty for real users who reached this step)
        _hp: "",

        // Scores
        overallScore:     scores.overall,
        technicalScore:   scores.technical,
        entityScore:      scores.entity,
        authorityScore:   scores.authority,
        aiReadinessScore: scores.aiReadiness,
        opportunities:    scores.opportunities,

        // Qualification
        isDecisionMaker:  qual.isDecisionMaker,
        budget:           qual.budget,
        currentMarketing: qual.currentMarketing,
        timeline:         qual.timeline,
        revenue:          qual.revenue,
        qualified,
      }),
    });
  } catch {
    // Fail silently — the user has already seen their results.
    // The lead not saving should not break their experience.
  }
}

export function AuditFlow() {
  const [step,       setStep]       = useState<Step>("form");
  const [auditData,  setAuditData]  = useState<AuditData | null>(null);
  const [scores,     setScores]     = useState<AuditScores | null>(null);
  const [formError,  setFormError]  = useState<string | null>(null);

  /**
   * Called when the user submits the initial audit form.
   * Runs the /api/audit/check pre-flight first.
   * If rate-limited or duplicate, shows an error in the form.
   * If OK, starts the analysis animation.
   */
  async function handleFormSubmit(data: AuditData) {
    setFormError(null);

    try {
      const res = await fetch("/api/audit/check", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:      data.email,
          websiteUrl: data.websiteUrl,
          _hp:        data._hp ?? "",
          _token:     data._token,
          _loadedAt:  data._loadedAt,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as Record<string, unknown>;
        const msg  = typeof json.message === "string" ? json.message : null;

        // On duplicate — treat as success (they already submitted, results would be the same)
        if (res.status === 409) {
          setFormError(msg ?? "We already received this request. You don't need to submit it again.");
          return;
        }

        setFormError(
          msg ?? "You've made several requests recently. Please try again shortly."
        );
        return;
      }
    } catch {
      // Network error — fail open so genuine users aren't blocked
      // The /api/leads endpoint enforces limits independently
    }

    // Pre-check passed (or network failed open) — proceed to analysis
    setAuditData(data);
    setStep("analyzing");
    setTimeout(() => {
      setScores(generateScores(data));
      setStep("results");
    }, 3800);
  }

  async function handleQualSubmit(qual: QualData) {
    const qualified = qualifyLead(qual);
    if (auditData && scores) {
      await submitLead(auditData, scores, qual, qualified);
    }
    setStep(qualified ? "booking" : "nurture");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuditForm onSubmit={handleFormSubmit} serverError={formError} />
          </motion.div>
        )}
        {step === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuditAnalyzing url={auditData?.websiteUrl ?? ""} />
          </motion.div>
        )}
        {step === "results" && scores && auditData && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuditResults scores={scores} data={auditData} onContinue={() => setStep("qualification")} />
          </motion.div>
        )}
        {step === "qualification" && (
          <motion.div key="qual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuditQualification onSubmit={handleQualSubmit} />
          </motion.div>
        )}
        {step === "booking" && auditData && scores && (
          <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuditBooking data={auditData} scores={scores} />
          </motion.div>
        )}
        {step === "nurture" && auditData && scores && (
          <motion.div key="nurture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuditNurture data={auditData} scores={scores} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
