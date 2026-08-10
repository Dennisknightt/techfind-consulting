import { NextRequest, NextResponse } from "next/server";
import { getAllLeads, saveLead, gradeFromScore, stageFromQualification } from "@/lib/store";
import type { Lead } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* GET /api/leads — return all leads */
export async function GET() {
  const leads = getAllLeads();
  return NextResponse.json({ leads });
}

/* POST /api/leads — create a new lead from audit submission */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const qualified: boolean = body.qualified ?? false;

    const lead: Lead = {
      id,
      createdAt: new Date().toISOString(),

      companyName:    body.companyName    ?? "Unknown",
      websiteUrl:     body.websiteUrl     ?? "",
      email:          body.email          ?? "",
      industry:       body.industry       ?? "",
      country:        body.country        ?? "",
      phone:          body.phone,

      overallScore:    body.overallScore    ?? 0,
      technicalScore:  body.technicalScore  ?? 0,
      entityScore:     body.entityScore     ?? 0,
      authorityScore:  body.authorityScore  ?? 0,
      aiReadinessScore: body.aiReadinessScore ?? 0,
      opportunities:   body.opportunities   ?? 0,

      isDecisionMaker:  body.isDecisionMaker,
      budget:           body.budget,
      currentMarketing: body.currentMarketing,
      timeline:         body.timeline,
      revenue:          body.revenue,
      qualified,

      grade: gradeFromScore(body.overallScore ?? 0),
      stage: stageFromQualification(qualified, body.budget),
    };

    saveLead(lead);
    return NextResponse.json({ lead }, { status: 201 });
  } catch (err) {
    console.error("POST /api/leads error:", err);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
