import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Stable social-sharing image at /hmg/og.png (1200×630), rendered once at build time, with HMG's logo.
export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

export async function GET() {
  const logo = await readFile(path.join(process.cwd(), "public/hmg/brand/hmg-logo-white.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0A2A47", color: "#FFFFFF", padding: 80 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={330} height={125} alt="" />
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>Financial clarity.</span>
          <span style={{ color: "#C9D0D7", fontStyle: "italic" }}>Confident growth.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#C9D0D7" }}>Nairobi-based · Kenyan regulatory expertise · Serving businesses across Kenya and Africa</div>
      </div>
    ),
    size,
  );
}
