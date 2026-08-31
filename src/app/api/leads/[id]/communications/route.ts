/**
 * /api/leads/[id]/communications
 *
 * GET  — list the communication thread for one lead (oldest → newest).
 * POST — log a new communication (email sent, call made, note, etc.)
 *        against that lead.
 */

import { NextRequest, NextResponse } from "next/server";
import { getLead } from "@/lib/store";
import {
  addCommunication,
  getCommunicationsForLead,
  type CommChannel,
  type CommDirection,
} from "@/lib/store";
import { requireAdminUser } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHANNELS: CommChannel[] = ["email", "call", "linkedin", "sms", "note"];
const DIRECTIONS: CommDirection[] = ["outbound", "inbound"];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!getLead(id)) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  const thread = getCommunicationsForLead(id).slice().reverse(); // oldest → newest
  return NextResponse.json({ communications: thread });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const lead = getLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const channel = typeof b.channel === "string" ? (b.channel as CommChannel) : "note";
  const direction = typeof b.direction === "string" ? (b.direction as CommDirection) : "outbound";
  const text = typeof b.body === "string" ? b.body.trim() : "";

  if (!CHANNELS.includes(channel)) {
    return NextResponse.json({ error: "Invalid channel" }, { status: 422 });
  }
  if (!DIRECTIONS.includes(direction)) {
    return NextResponse.json({ error: "Invalid direction" }, { status: 422 });
  }
  if (!text) {
    return NextResponse.json({ error: "Message body is required" }, { status: 422 });
  }
  if (text.length > 5000) {
    return NextResponse.json({ error: "Message body too long" }, { status: 422 });
  }

  const comm = addCommunication({
    leadId: id,
    channel,
    direction,
    subject: typeof b.subject === "string" ? b.subject.slice(0, 200) : undefined,
    body: text,
    author: typeof b.author === "string" ? b.author.slice(0, 100) : undefined,
  });

  return NextResponse.json({ communication: comm }, { status: 201 });
}
