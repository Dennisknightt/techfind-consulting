import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/hmg/enquiry";
import { rateLimit } from "@/lib/ratelimit";
import { getClientIp, hashIp } from "@/lib/ip";

/**
 * HMG consultation / callback enquiry.
 *
 * INTEGRATION POINT: set HMG_ENQUIRY_WEBHOOK to any HTTPS endpoint that accepts
 * JSON (Zapier, Make, n8n, a CRM inbound webhook, or an email relay). Each lead
 * is POSTed there. Without it the endpoint returns 503 "not_configured" and the
 * form tells the visitor to use WhatsApp or phone — it never fakes success.
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

  const hook = process.env.HMG_ENQUIRY_WEBHOOK;
  if (!hook) {
    console.warn("[hmg-enquiry] HMG_ENQUIRY_WEBHOOK is not set — enquiry not delivered", { service: lead.service, source: lead.source });
    return NextResponse.json(
      { ok: false, code: "not_configured", error: "Online enquiries are not connected yet." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ site: "hmg-group-africa", receivedAt: new Date().toISOString(), ...lead }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch (err) {
    console.error("[hmg-enquiry] delivery failed", err);
    return NextResponse.json({ ok: false, code: "delivery_failed", error: "We could not send your request." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
