/**
 * /api/communications
 *
 * GET — list all logged communications across every lead (admin only;
 *        requires a logged-in SUPER_ADMIN session). Used to build
 *        the Communications inbox, sorted most-recent first.
 */

import { NextResponse } from "next/server";
import { getAllCommunications } from "@/lib/store";
import { requireAdminUser } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ communications: getAllCommunications() });
}
