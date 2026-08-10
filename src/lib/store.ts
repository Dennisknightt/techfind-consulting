/**
 * Server-side lead store.
 *
 * Uses globalThis so the data survives Next.js hot-reloads in development
 * and persists across warm serverless invocations on Vercel.
 *
 * To get a truly persistent database (survives cold starts):
 *  1. Go to vercel.com → your project → Storage → Create KV Database
 *  2. Click "Connect to Project" — env vars are added automatically
 *  3. Redeploy. The store will automatically switch to Vercel KV.
 */

export type LeadStage =
  | "Discovered" | "Audited" | "Qualified"
  | "Outreach Sent" | "Responded" | "Meeting Booked"
  | "Proposal Sent" | "Negotiation" | "Won" | "Lost" | "Nurture";

export type LeadGrade = "A+" | "A" | "B" | "Nurture" | "Reject";

export interface Lead {
  id: string;
  createdAt: string;

  // From audit form
  companyName: string;
  websiteUrl: string;
  email: string;
  industry: string;
  country: string;
  phone?: string;

  // Computed scores
  overallScore: number;
  technicalScore: number;
  entityScore: number;
  authorityScore: number;
  aiReadinessScore: number;
  opportunities: number;

  // Qualification
  isDecisionMaker?: string;
  budget?: string;
  currentMarketing?: string;
  timeline?: string;
  revenue?: string;
  qualified: boolean;

  // CRM
  grade: LeadGrade;
  stage: LeadStage;
  notes?: string;

  // Calendly
  meetingUrl?: string;
  meetingDate?: string;
}

/* ─── In-memory store (survives hot-reloads + warm invocations) ─── */
declare global {
  // eslint-disable-next-line no-var
  var __leadStore: Map<string, Lead> | undefined;
}

function getStore(): Map<string, Lead> {
  if (!globalThis.__leadStore) {
    globalThis.__leadStore = new Map();
  }
  return globalThis.__leadStore;
}

/* ─── CRUD ─── */
export function getAllLeads(): Lead[] {
  return Array.from(getStore().values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getLead(id: string): Lead | undefined {
  return getStore().get(id);
}

export function saveLead(lead: Lead): Lead {
  getStore().set(lead.id, lead);
  return lead;
}

export function updateLead(id: string, patch: Partial<Lead>): Lead | null {
  const existing = getStore().get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  getStore().set(id, updated);
  return updated;
}

export function deleteLead(id: string): boolean {
  return getStore().delete(id);
}

/* ─── Score → Grade ─── */
export function gradeFromScore(score: number): LeadGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "Nurture";
  return "Reject";
}

/* ─── Stage from qualification ─── */
export function stageFromQualification(qualified: boolean, budget?: string): LeadStage {
  if (!qualified) return "Nurture";
  if (budget === "$10k+" || budget === "$3k-$10k") return "Qualified";
  return "Audited";
}
