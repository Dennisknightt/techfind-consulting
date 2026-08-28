import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { getSessionUser } from "@/server/auth/session";
import { db } from "@/server/db";
import { DocumentPdf } from "@/server/documents/pdf/DocumentPdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const doc = await db.salesDocument.findUnique({
    where: { id },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
      company: true,
      contact: true,
      paymentSessions: { where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = doc.paymentSessions[0];
  const paymentUrl = session ? `${baseUrl}/pay/${session.token}` : undefined;
  const qrDataUrl = paymentUrl ? await QRCode.toDataURL(paymentUrl, { margin: 1, width: 240 }) : undefined;

  const buffer = await renderToBuffer(
    DocumentPdf({
      type: doc.type,
      number: doc.number,
      createdAt: doc.createdAt,
      validUntil: doc.validUntil,
      company: { name: doc.company.name, phone: doc.company.phone, email: doc.company.email },
      contactName: doc.contact?.name ?? null,
      items: doc.items.map(i => ({ label: i.label, description: i.description, quantity: i.quantity, unitPrice: i.unitPrice, amount: i.amount })),
      subtotal: doc.subtotal,
      discount: doc.discount,
      taxLabel: "VAT",
      taxMode: doc.taxMode,
      taxAmount: doc.taxAmount,
      total: doc.total,
      depositRequired: doc.depositRequired,
      balance: doc.balance,
      paymentTermsLabel: doc.paymentTermsLabel,
      notes: doc.notes,
      terms: doc.terms,
      paymentUrl,
      qrDataUrl,
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc.number}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
