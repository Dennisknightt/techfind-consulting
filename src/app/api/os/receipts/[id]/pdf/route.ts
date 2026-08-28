import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getSessionUser } from "@/server/auth/session";
import { db } from "@/server/db";
import { ReceiptPdf } from "@/server/documents/pdf/ReceiptPdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const receipt = await db.receipt.findUnique({
    where: { id },
    include: { company: true, document: true, payment: true },
  });
  if (!receipt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = await renderToBuffer(
    ReceiptPdf({
      number: receipt.number,
      issuedAt: receipt.issuedAt,
      companyName: receipt.company.name,
      amount: receipt.amount,
      method: receipt.method,
      gatewayReference: receipt.payment.gatewayReference,
      documentNumber: receipt.document.number,
      remainingBalance: receipt.document.balance,
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${receipt.number}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
