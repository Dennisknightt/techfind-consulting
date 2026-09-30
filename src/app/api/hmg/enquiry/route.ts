import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/hmg/enquiry";
import { rateLimit } from "@/lib/ratelimit";
import { getClientIp, hashIp } from "@/lib/ip";

/**
 * HMG consultation enquiry. Validates server-side, rate-limits per IP and
 * forwards to HMG_ENQUIRY_WEBHOOK (any JSON webhook: Zapier, Make, n8n, a CRM)
 * when configured. Without a webhook the enquiry is logged and acknowledged so
 * the front end can be demonstrated end to end.
 */
export async function POST(req: NextRequest) {
  const rl = await rateLimit(`hmg-enquiry:${hashIp(getClientIp(req))}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly or use WhatsApp." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] = issue.message;
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields }, { status: 422 });
  }

  const { website, ...lead } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // bot: pretend success

  const hook = process.env.HMG_ENQUIRY_WEBHOOK;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: "hmg-website", receivedAt: new Date().toISOString(), ...lead }),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } catch (err) {
      console.error("[hmg-enquiry] delivery failed", err);
      return NextResponse.json({ ok: false, error: "We could not send your enquiry. Please try WhatsApp or call us." }, { status: 502 });
    }
  } else {
    console.info("[hmg-enquiry] received (no HMG_ENQUIRY_WEBHOOK configured)", { service: lead.service, company: lead.company });
  }
  return NextResponse.json({ ok: true });
}
