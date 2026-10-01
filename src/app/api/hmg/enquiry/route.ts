import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/hmg/enquiry";
import type { z } from "zod";

type EnquiryData = z.output<typeof enquirySchema>;
import { rateLimit } from "@/lib/ratelimit";
import { getClientIp, hashIp } from "@/lib/ip";

/**
 * HMG consultation / callback enquiry.
 *
 * DESTINATIONS (see deliver() below): a CRM/automation webhook and/or email via
 * Resend. With neither configured the endpoint returns 503 "not_configured" and
 * the form offers WhatsApp or phone — it never reports success without delivery.
 *
 * Spam protection: honeypot field, minimum fill time and per-IP rate limit.
 */
export async function POST(req: NextRequest) {
  const rl = await rateLimit(`hmg-enquiry:${hashIp(getClientIp(req))}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, code: "rate_limited", error: "Too many requests. Please try again shortly, or use WhatsApp." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid", error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message;
    return NextResponse.json({ ok: false, code: "invalid", error: "Please check the highlighted fields.", fields }, { status: 422 });
  }

  const { website, elapsed, ...lead } = parsed.data;
  // Bots: filled the hidden field or submitted implausibly fast. Drop silently.
  if (website || elapsed < 2500) return NextResponse.json({ ok: true });

  const destinations = await deliver(lead);
  if (destinations === "none") {
    console.warn("[hmg-enquiry] no delivery destination configured — enquiry not delivered");
    return NextResponse.json({ ok: false, code: "not_configured", error: "Online enquiries are not connected yet." }, { status: 503 });
  }
  if (destinations === "failed") {
    return NextResponse.json({ ok: false, code: "delivery_failed", error: "We could not send your request." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

type Lead = Omit<EnquiryData, "website" | "elapsed">;

/**
 * Delivers to every configured destination; succeeds if at least one accepts.
 *  - HMG_ENQUIRY_WEBHOOK: JSON POST (CRM inbound webhook, Zapier, Make, n8n…)
 *  - RESEND_API_KEY + HMG_ENQUIRY_TO (+ optional HMG_ENQUIRY_FROM): email via Resend
 * Enquiry contents are never logged.
 */
async function deliver(lead: Lead): Promise<"ok" | "failed" | "none"> {
  const jobs: Promise<boolean>[] = [];
  const hook = process.env.HMG_ENQUIRY_WEBHOOK;
  if (hook) {
    jobs.push(
      fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ site: "hmg-group-africa", receivedAt: new Date().toISOString(), ...lead }),
        signal: AbortSignal.timeout(8000),
      }).then((r) => r.ok, () => false),
    );
  }
  const key = process.env.RESEND_API_KEY;
  const to = process.env.HMG_ENQUIRY_TO;
  if (key && to) {
    const lines = [
      `Name: ${lead.name}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email || "—"}`,
      `Company: ${lead.company || "—"}`,
      `Service: ${lead.service}`,
      `Source: ${lead.source} form`,
      "",
      lead.message || "(no description)",
    ];
    jobs.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: process.env.HMG_ENQUIRY_FROM ?? "HMG Website <onboarding@resend.dev>",
          to: to.split(",").map((x) => x.trim()),
          reply_to: lead.email || undefined,
          subject: `Callback request: ${lead.service} — ${lead.name}`,
          text: lines.join("\n"),
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
