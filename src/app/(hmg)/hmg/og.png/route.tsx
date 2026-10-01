import { ImageResponse } from "next/og";

// Stable social-sharing image at /hmg/og.png (1200×630), rendered once at build time.
export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#062E4F", color: "#FBFAF7", padding: 80, position: "relative", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#092B46", border: "2px solid #45C1AD", display: "flex" }} />
          HMG Group Africa
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 88, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>Financial clarity.</span>
          <span style={{ color: "#45C1AD" }}>Confident growth.</span>
        </div>
        <div style={{ fontSize: 28, color: "#B9EADB", display: "flex" }}>Tax · Accounting · Audit · Advisory — Nairobi</div>
        <div style={{ position: "absolute", right: 80, bottom: 0, width: 300, height: 420, borderRadius: "150px 150px 0 0", background: "#45C1AD", opacity: 0.9, display: "flex" }} />
        <div style={{ position: "absolute", right: 200, bottom: 0, width: 120, height: 230, borderRadius: "60px 60px 0 0", background: "#B9EADB", display: "flex" }} />
      </div>
    ),
    size,
  );
}
