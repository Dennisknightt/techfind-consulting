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
  websiteUrl: string;
  companyName: string;
  email: string;
  industry: string;
  country: string;
  phone?: string;
};

export type AuditScores = {
  overall: number;
  technical: number;
  entity: number;
  authority: number;
  aiReadiness: number;
  opportunities: number;
};

export type QualData = {
  isDecisionMaker: string;
  budget: string;
  currentMarketing: string;
  timeline: string;
  revenue: string;
};

export type Step = "form" | "analyzing" | "results" | "qualification" | "booking" | "nurture";

function generateScores(data: AuditData): AuditScores {
  // Deterministic score generation based on domain characteristics
  const seed = data.websiteUrl.length + data.companyName.length;
  const base = 28 + (seed % 22); // 28–49 base (most businesses have low scores)
  return {
    overall:    base,
    technical:  Math.min(99, base + 3 + (seed % 12)),
    entity:     Math.max(10, base - 8 + (seed % 10)),
    authority:  Math.max(10, base - 5 + (seed % 15)),
    aiReadiness: Math.max(10, base - 12 + (seed % 18)),
    opportunities: 12 + (seed % 9), // 12–20
  };
}

function qualifyLead(qual: QualData): boolean {
  const budgetOk = ["$1k-$3k", "$3k-$10k", "$10k+"].includes(qual.budget);
  const decisionOk = qual.isDecisionMaker === "yes";
  const timelineOk = ["immediately", "1-3months"].includes(qual.timeline);
  return budgetOk && decisionOk && timelineOk;
}

export function AuditFlow() {
  const [step, setStep] = useState<Step>("form");
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [scores, setScores] = useState<AuditScores | null>(null);

  function handleFormSubmit(data: AuditData) {
    setAuditData(data);
    setStep("analyzing");
    setTimeout(() => {
      setScores(generateScores(data));
      setStep("results");
    }, 3800);
  }

  function handleQualSubmit(qual: QualData) {
    if (qualifyLead(qual)) {
      setStep("booking");
    } else {
      setStep("nurture");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuditForm onSubmit={handleFormSubmit} />
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
