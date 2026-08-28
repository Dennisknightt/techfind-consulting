import { NextRequest, NextResponse } from "next/server";

/**
 * Host-based separation between the marketing site and the CRM (Techfind
 * Revenue OS), once a dedicated CRM domain is configured.
 *
 * Both still live in one Next.js app/deployment (see docs/ARCHITECTURE.md
 * for why — shared build, shared design tokens where they overlap, one
 * thing to deploy) but should never visually "mix": the marketing domain
 * must never render CRM pages, and the CRM domain must never render
 * marketing pages, each keeping its own URL.
 *
 * The CRM's hostname is whatever NEXT_PUBLIC_APP_URL points at (the same
 * variable already used to build payment links — one source of truth,
 * see .env.example). Until that's set to a real custom domain, this is a
 * no-op everywhere, and raw *.vercel.app deployment URLs and localhost are
 * always a no-op too — separation only applies once real custom domains
 * are wired up, so it never gets in the way of testing against a preview
 * URL or local dev (whose default NEXT_PUBLIC_APP_URL is itself
 * http://localhost:3000, per .env.example).
 */

const CRM_PATH_PREFIXES = ["/login", "/app", "/pay"];

function isCrmPath(pathname: string): boolean {
  return CRM_PATH_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`));
}

function crmHostname(): string | null {
  const raw = process.env.NEXT_PUBLIC_APP_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname;

  if (hostname.endsWith(".vercel.app") || hostname === "localhost" || hostname === "127.0.0.1") {
    return NextResponse.next();
  }

  const crmHost = crmHostname();
  if (!crmHost) return NextResponse.next(); // not configured — nothing to enforce yet

  const { pathname, search } = req.nextUrl;
  const onCrmHost = hostname === crmHost;
  const pathIsCrm = isCrmPath(pathname);

  if (onCrmHost) {
    if (pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = "/app"; // requireUser() sends unauthenticated visitors on to /login itself
      return NextResponse.rewrite(url);
    }
    if (!pathIsCrm && !pathname.startsWith("/api/")) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Any other (marketing) host: send CRM-only paths over to the CRM host
  // instead of rendering them here — e.g. someone pastes a /pay/[token]
  // link with the wrong host, or types /login into the marketing domain.
  if (pathIsCrm) {
    return NextResponse.redirect(new URL(pathname + search, `https://${crmHost}`));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|os-manifest.webmanifest|os-sw.js|os-offline.html|os-icons/).*)",
  ],
};
