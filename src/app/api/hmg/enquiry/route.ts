import { NextRequest, NextResponse } from "next/server";
import { CHANNELS, labelOf, NEEDS, PROFILES, qualifySchema, SITUATION_OPTS, URGENCY, type QualifyData } from "@/lib/hmg/enquiry";
import { rateLimit } from "@/lib/ratelimit";
import { getClientIp, hashIp } from "@/lib/ip";

/**
 * Consultation qualification endpoint.
 *
 * Builds a structured CRM lead (reference number, services, assigned team,
 * urgency flag, priority, follow-up due date) and delivers it to every
 * configured destination; succeeds only if at least one accepts:
 *   HMG_ENQUIRY_WEBHOOK                       → JSON lead for HMG's CRM / automation
 *                                               (create lead, assign, follow-up task, notify)
 *   RESEND_API_KEY + HMG_ENQUIRY_TO (+FROM)   → consultant notification email
 * With neither configured it returns 503 and never reports success.
 * Spam protection: honeypot, minimum fill time, per-IP rate limit.
 * Enquiry contents are never logged.
 */
export async function POST(req: NextRequest) {
  const rl = await rateLimit(`hmg-enquiry:${hashIp(getClientIp(req))}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
  }
  const parsed = qualifySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    return NextResponse.json({ ok: false, code: "invalid", fields }, { status: 422 });
  }
  const data = parsed.data;
  if (data.website || data.elapsed < 4000) return NextResponse.json({ ok: true, reference: makeReference() }); // bot: drop silently

  const lead = buildLead(data);
  const result = await deliver(lead);
  if (result === "none") {
    console.warn("[hmg-enquiry] no delivery destination configured — lead not delivered");
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }
  if (result === "failed") return NextResponse.json({ ok: false, code: "delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true, reference: lead.reference, urgent: lead.lead.urgent });
}

function makeReference() {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HMG-${ymd}-${rnd}`;
}

/** Adds business days (Mon–Fri) in East Africa Time; 0 = within a few hours, same working day. */
function followUpDue(businessDays: number) {
  const eat = (t: number) => new Date(t + 3 * 3600 * 1000);
  let t = Date.now();
  if (businessDays === 0) return new Date(t + 4 * 3600 * 1000).toISOString();
  let added = 0;
  while (added < businessDays) {
    t += 24 * 3600 * 1000;
    const day = eat(t).getUTCDay();
    if (day !== 0 && day !== 6) added++;
  }
  return new Date(t).toISOString();
}

function buildLead(d: QualifyData) {
  const needs = d.needs.map((id) => NEEDS.find((n) => n.id === id)!);
  const urgent = d.urgency === "48h" || d.needs.includes("urgent") || d.situation.includes("kra");
  // A KRA notice / urgent issue always routes to the Tax & KRA team first.
  const primary = needs.find((n) => n.id === "urgent") ?? needs.find((n) => n.id !== "unsure") ?? needs[0];
  const urgency = URGENCY.find((u) => u.id === d.urgency)!;
  const channels = d.channels.map((c) => labelOf(CHANNELS, c));
  return {
    type: "lead",
    source: "hmg-website/contact-qualification",
    reference: makeReference(),
    createdAt: new Date().toISOString(),
    contact: { name: d.name, phone: d.phone, email: d.email || null, company: d.company || null, preferredChannels: channels },
    lead: {
      services: needs.map((n) => n.label),
      primaryService: primary.label,
      assignedTeam: primary.team,
      clientType: labelOf(PROFILES, d.profile),
      situation: d.situation.map((s) => labelOf(SITUATION_OPTS, s)),
      otherDetail: d.other || null,
      urgency: urgency.label,
      urgent,
      priority: urgent ? "high" : "normal",
    },
    followUp: {
      dueBy: followUpDue(urgent ? 0 : urgency.followUpBusinessDays),
      task: `Contact ${d.name} by ${channels[0]} about ${primary.label}`,
    },
    notify: { team: primary.team, urgent },
  };
}
type Lead = ReturnType<typeof buildLead>;

async function deliver(lead: Lead): Promise<"ok" | "failed" | "none"> {
  const jobs: Promise<boolean>[] = [];
  const hook = process.env.HMG_ENQUIRY_WEBHOOK;
  if (hook) {
    jobs.push(
      fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(lead), signal: AbortSignal.timeout(8000) }).then((r) => r.ok, () => false),
    );
  }
  const key = process.env.RESEND_API_KEY;
  const to = process.env.HMG_ENQUIRY_TO;
  if (key && to) {
    const c = lead.contact, l = lead.lead;
    const text = [
      `Reference: ${lead.reference}`,
      `Priority: ${l.priority.toUpperCase()}${l.urgent ? " (urgent)" : ""} · follow up by ${new Date(lead.followUp.dueBy).toLocaleString("en-GB", { timeZone: "Africa/Nairobi" })} EAT`,
      `Assigned team: ${l.assignedTeam}`,
      "",
      `Name: ${c.name}`, `Phone: ${c.phone}`, `Email: ${c.email ?? "—"}`, `Company: ${c.company ?? "—"}`,
      `Contact by: ${c.preferredChannels.join(", ")}`,
      "",
      `Services: ${l.services.join(", ")}`, `Client type: ${l.clientType}`, `Situation: ${l.situation.join("; ")}`,
      l.otherDetail ? `Details: ${l.otherDetail}` : "", `Urgency: ${l.urgency}`,
    ].filter((x) => x !== "").join("\n");
    jobs.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: process.env.HMG_ENQUIRY_FROM ?? "HMG Website <onboarding@resend.dev>",
          to: to.split(",").map((x) => x.trim()),
          reply_to: c.email ?? undefined,
          subject: `${l.urgent ? "[URGENT] " : ""}${lead.reference} · ${l.primaryService} · ${c.name}`,
          text,
        }),
        signal: AbortSignal.timeout(8000),
      }).then((r) => r.ok, () => false),
    );
  }
  if (!jobs.length) return "none";
  const results = await Promise.all(jobs);
  if (!results.some(Boolean)) console.error("[hmg-enquiry] all destinations failed");
  return results.some(Boolean) ? "ok" : "failed";
}
