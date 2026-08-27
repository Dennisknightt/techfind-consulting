/**
 * /api/communications
 *
 * GET — list all logged communications across every lead (admin only;
 *        requires ADMIN_SECRET header when configured). Used to build
 *        the Communications inbox, sorted most-recent first.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllCommunications } from "@/lib/store";
import { isAuthorizedAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ communications: getAllCommunications() });
}
