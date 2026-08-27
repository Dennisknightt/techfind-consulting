import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/server/db";
import { getActiveProvider } from "@/server/payments/registry";
import { rateLimit } from "@/lib/ratelimit";
import { hashIp } from "@/lib/ip";
import { writeAudit } from "@/server/audit";
import type { PaymentMethod } from "@/server/payments/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_METHODS: PaymentMethod[] = ["MPESA", "CARD"];

/**
 * Public — a customer, not a Techfind user, calls this from /pay/[token].
 * The amount, currency and document are always read from the server-side
 * PaymentSession; nothing about the charge is trusted from the request
 * body except the method and the phone/contact details needed to place it.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const limited = await rateLimit(`pay-charge:${hashIp(ip)}`, 5, 5 * 60_000);
  if (!limited.allowed) {
    return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429 });
  }

  const session = await db.paymentSession.findUnique({
    where: { token },
    include: { document: { include: { company: true } } },
  });
  if (!session) return NextResponse.json({ error: "Payment link not found" }, { status: 404 });
  if (session.status !== "ACTIVE" || session.expiresAt < new Date()) {
    return NextResponse.json({ error: "This payment link is no longer active" }, { status: 410 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const method = ALLOWED_METHODS.includes(body.method) ? (body.method as PaymentMethod) : null;
  if (!method) return NextResponse.json({ error: "Unsupported payment method" }, { status: 422 });
  if (method === "MPESA" && (typeof body.phone !== "string" || body.phone.replace(/\D/g, "").length < 9)) {
    return NextResponse.json({ error: "Enter a valid phone number" }, { status: 422 });
  }

  const { provider, configuredName, devSafetyOverride } = await getActiveProvider();
  if (!provider.supportedMethods.includes(method)) {
    return NextResponse.json({ error: `${method} isn't supported by the active payment provider` }, { status: 422 });
  }

  const idempotencyKey = `${session.id}:${randomBytes(6).toString("hex")}`;

  const payment = await db.payment.create({
    data: {
      reference: `PAY-${randomBytes(6).toString("hex").toUpperCase()}`,
      sessionId: session.id,
      documentId: session.documentId,
      companyId: session.document.companyId,
      dealId: session.document.dealId,
      amount: session.amountDue, // server-determined — never from the request body
      method,
      gateway: provider.name,
      status: "PENDING",
      idempotencyKey,
    },
  });

  try {
    const result = await provider.createCharge({
      amount: session.amountDue,
      currency: session.currency,
      method,
      reference: idempotencyKey,
      phone: typeof body.phone === "string" ? body.phone : undefined,
      email: session.document.company.email ?? undefined,
      name: session.document.company.name,
      returnUrl: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/pay/${token}` : undefined,
    });

    await db.payment.update({
      where: { id: payment.id },
      data: { gatewayReference: result.gatewayReference, status: result.status, gatewayRaw: JSON.stringify(result.raw).slice(0, 8000) },
    });

    await writeAudit({ action: "PAYMENT_CHARGE_INITIATED", entityType: "Payment", entityId: payment.id, after: { method, provider: provider.name, devSafetyOverride } });

    return NextResponse.json({
      paymentId: payment.id,
      status: result.status,
      redirectUrl: result.redirectUrl,
      provider: provider.name,
      simulated: configuredName !== provider.name, // true when the dev-safety guard swapped the live provider out
    });
  } catch (err) {
    await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED", notes: err instanceof Error ? err.message.slice(0, 500) : "Charge failed" } });
    console.error("[pay/charge] provider error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Couldn't start this payment. Please try again." }, { status: 502 });
  }
}
