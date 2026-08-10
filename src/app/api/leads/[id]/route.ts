import { NextRequest, NextResponse } from "next/server";
import { updateLead, deleteLead } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* PATCH /api/leads/[id] — update stage, grade, notes, meeting info */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patch = await req.json();
  const updated = updateLead(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ lead: updated });
}

/* DELETE /api/leads/[id] */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteLead(id);
  if (!deleted) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
