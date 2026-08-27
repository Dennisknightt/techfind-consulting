/**
 * /api/communications
 *
 * GET — list all logged communications across every lead (admin only;
 *        requires ADMIN_SECRET header when configured). Used to build
 *        the Communications inbox, sorted most-recent first.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllCommunications } from "@/lib/store";
import { cfg } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token    = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token") ?? "";
  const expected = cfg.admin.secret;
  if (expected && token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ communications: getAllCommunications() });
}
