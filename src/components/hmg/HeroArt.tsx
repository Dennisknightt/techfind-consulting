/**
 * Hero composition: an arched "window" onto business progress, a ledger sheet
 * and ascending planes. Purely geometric; illustrative figures only.
 */
export function HeroArt() {
  const rows = Array.from({ length: 7 });
  return (
    <svg
      className="hero-art"
      viewBox="0 0 560 640"
      role="img"
      aria-label="Illustration: an arched window with a rising teal line chart, a ledger sheet showing reconciled entries and three ascending bars"
    >
      <defs>
        <linearGradient id="ha-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#45C1AD" stopOpacity=".38" />
          <stop offset="1" stopColor="#45C1AD" stopOpacity="0" />
        </linearGradient>
        <clipPath id="ha-arch">
          <path d="M70 640V250a210 210 0 0 1 420 0v390Z" />
        </clipPath>
      </defs>

      {/* sun disc */}
      <circle className="f-mint ha" style={{ ["--d" as string]: "0.35s" }} cx="448" cy="112" r="74" />
      <circle className="s-teal ha ha-ring" style={{ ["--d" as string]: "0.6s" }} cx="448" cy="112" r="96" fill="none" strokeWidth="1" strokeDasharray="2 7" />

      {/* arch */}
      <path className="f-navy ha ha-rise" style={{ ["--d" as string]: "0.15s" }} d="M70 640V250a210 210 0 0 1 420 0v390Z" />
      <g clipPath="url(#ha-arch)">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1="70" x2="490" y1={120 + i * 70} y2={120 + i * 70} stroke="#FBFAF7" strokeOpacity=".08" />
        ))}
        <path className="ha-fade" style={{ ["--d" as string]: "1.5s" }} d="M70 500 L150 452 L225 470 L300 360 L375 300 L450 190 L490 150 V640 H70Z" fill="url(#ha-area)" />
        <path
          className="ha-draw"
          style={{ ["--d" as string]: "0.9s" }}
          pathLength={1}
          d="M70 500 L150 452 L225 470 L300 360 L375 300 L450 190 L490 150"
          fill="none"
          stroke="#45C1AD"
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {[
          [150, 452],
          [300, 360],
          [450, 190],
        ].map(([x, y], i) => (
          <g key={i} className="ha-pop" style={{ ["--d" as string]: `${1.6 + i * 0.2}s` }}>
            <circle cx={x} cy={y} r="11" fill="#45C1AD" fillOpacity=".25" />
            <circle cx={x} cy={y} r="5.5" fill="#FBFAF7" stroke="#45C1AD" strokeWidth="3" />
          </g>
        ))}
        <g className="ha-fade" style={{ ["--d" as string]: "2.1s" }}>
          <rect x="262" y="150" width="172" height="34" rx="17" fill="#FBFAF7" />
          <circle cx="280" cy="167" r="5" fill="#45C1AD" />
          <text x="292" y="171.5" fontSize="12" fontWeight="600" fill="#092B46">Cash position: clear</text>
        </g>
      </g>

      {/* ledger sheet */}
      <g className="ha ha-slide" style={{ ["--d" as string]: "0.7s" }}>
        <g transform="rotate(-3 130 500)">
          <rect x="14" y="396" width="262" height="216" rx="8" className="f-cream" />
          <rect x="14" y="396" width="262" height="36" rx="8" className="f-warm" />
          <text x="30" y="419" fontSize="11" fontWeight="700" letterSpacing="1.6" className="f-ink">GENERAL LEDGER</text>
          <text x="262" y="419" fontSize="10" textAnchor="end" fill="#3F5A70">Illustrative</text>
          {rows.map((_, i) => {
            const y = 454 + i * 22;
            return (
              <g key={i}>
                <line x1="30" x2="260" y1={y + 8} y2={y + 8} stroke="#092B46" strokeOpacity=".12" strokeDasharray="1 3" />
                <rect x="30" y={y - 4} width={[70, 54, 86, 62, 76, 48, 66][i]} height="6" rx="3" fill="#092B46" fillOpacity=".55" />
                <rect x={200 - (i % 3) * 8} y={y - 4} width={44 + (i % 3) * 8} height="6" rx="3" fill="#092B46" fillOpacity=".3" />
                {i % 2 === 0 && <path d={`M${252} ${y - 2} l3 3 l6 -7`} fill="none" stroke="#0E7C6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
              </g>
            );
          })}
          <rect x="30" y="592" width="230" height="1.5" className="f-navy" />
        </g>
      </g>

      {/* ascending planes */}
      {[
        { x: 400, h: 70, c: "f-mint", d: "1.1s" },
        { x: 434, h: 110, c: "f-teal", d: "1.25s" },
        { x: 468, h: 160, c: "f-cream", d: "1.4s" },
      ].map((b) => (
        <rect key={b.x} className={`${b.c} ha ha-rise`} style={{ ["--d" as string]: b.d }} x={b.x} y={640 - b.h} width="28" height={b.h} rx="6" />
      ))}
      <line x1="0" x2="560" y1="639" y2="639" className="s-navy" strokeWidth="2" />
    </svg>
  );
}
