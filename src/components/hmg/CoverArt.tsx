import type { InsightKind } from "@/lib/hmg/content";

/** Editorial cover illustrations for each insight topic. */
export function CoverArt({ kind }: { kind: InsightKind }) {
  return (
    <svg className="cover-art" viewBox="0 0 400 240" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" className={`cover-bg cover-bg--${kind}`} />
      {kind === "kra" && (
        <g>
          <rect x="120" y="36" width="150" height="190" rx="8" className="f-warm" />
          <rect x="140" y="60" width="70" height="8" rx="4" className="f-navy" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x="140" y={88 + i * 16} width={108 - i * 12} height="5" rx="2.5" fill="#092B46" fillOpacity=".25" />)}
          <circle cx="262" cy="170" r="44" className="f-teal" />
          <path d="M242 171l14 14 28-32" fill="none" stroke="#062E4F" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {kind === "etims" && (
        <g>
          <path d="M130 30h140v190l-14-10-14 10-14-10-14 10-14-10-14 10-14-10-14 10-14-10-14 10Z" className="f-warm" />
          <rect x="148" y="52" width="60" height="7" rx="3.5" className="f-navy" />
          {[0, 1, 2].map((i) => <rect key={i} x="148" y={76 + i * 14} width={104 - i * 18} height="5" rx="2.5" fill="#092B46" fillOpacity=".25" />)}
          {Array.from({ length: 25 }).map((_, i) => {
            const x = i % 5, y = Math.floor(i / 5);
            return (x * 3 + y * 7) % 4 !== 0 ? <rect key={i} x={170 + x * 12} y={130 + y * 12} width="10" height="10" rx="1.5" className="f-navy" /> : null;
          })}
        </g>
      )}
      {kind === "planning" && (
        <g>
          <rect x="90" y="44" width="220" height="156" rx="10" className="f-warm" />
          <rect x="90" y="44" width="220" height="32" rx="10" className="f-navy" />
          {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={106 + (i % 5) * 40} y={90 + Math.floor(i / 5) * 26} width="26" height="16" rx="3" fill={i === 8 || i === 13 ? "#45C1AD" : "#092B46"} fillOpacity={i === 8 || i === 13 ? 1 : 0.1} />)}
          <path d="M310 60 C360 60 370 150 320 190" fill="none" className="s-teal" strokeWidth="4" strokeDasharray="1 9" strokeLinecap="round" />
        </g>
      )}
      {kind === "cashflow" && (
        <g>
          {[70, 110, 150, 190].map((y) => <line key={y} x1="40" x2="360" y1={y} y2={y} stroke="#FBFAF7" strokeOpacity=".12" />)}
          <path d="M40 160 C90 160 100 90 150 100 S220 180 270 120 S330 60 360 70" fill="none" className="s-teal" strokeWidth="5" strokeLinecap="round" />
          <path d="M40 180 C100 170 150 170 210 150 S320 130 360 120" fill="none" stroke="#FBFAF7" strokeOpacity=".5" strokeWidth="2" strokeDasharray="3 7" />
          <circle cx="210" cy="152" r="9" fill="#FBFAF7" className="s-teal" strokeWidth="4" />
        </g>
      )}
      {kind === "payroll" && (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${96 + i * 22} ${44 + i * 22})`}>
              <rect width="170" height="110" rx="8" className={i === 2 ? "f-warm" : "f-mint"} stroke="#062E4F" strokeOpacity=".15" />
            </g>
          ))}
          <circle cx="172" cy="116" r="14" className="f-navy" /><path d="M148 152c3-18 45-18 48 0" className="f-navy" />
          <rect x="204" y="106" width="60" height="7" rx="3.5" fill="#092B46" fillOpacity=".6" />
          <rect x="204" y="122" width="40" height="6" rx="3" fill="#092B46" fillOpacity=".25" />
          <circle cx="300" cy="64" r="26" className="f-teal" /><path d="M289 65l8 8 14-16" fill="none" stroke="#062E4F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {kind === "controls" && (
        <g>
          {[150, 112, 74].map((s, i) => <rect key={s} x={200 - s / 2} y={120 - s / 2} width={s} height={s} rx="8" fill="none" stroke={i === 2 ? "#45C1AD" : "#FBFAF7"} strokeOpacity={i === 2 ? 1 : 0.4 + i * 0.1} strokeWidth="3" />)}
          <circle cx="200" cy="120" r="14" className="f-teal" />
          <rect x="197" y="124" width="6" height="16" rx="3" className="f-teal" />
          {[[60, 50], [340, 50], [60, 190], [340, 190]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill="#FBFAF7" fillOpacity=".5" />)}
        </g>
      )}
      {kind === "audit" && (
        <g>
          <rect x="106" y="50" width="150" height="150" rx="8" fill="#FBFAF7" fillOpacity=".3" transform="rotate(-6 181 125)" />
          <rect x="126" y="40" width="150" height="160" rx="8" className="f-warm" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="144" y={62 + i * 34} width="16" height="16" rx="3" fill="none" className="s-navy" strokeWidth="2" />
              <path d={`M148 ${70 + i * 34}l4 4 7-9`} fill="none" className="s-teal" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="172" y={66 + i * 34} width={80 - (i % 2) * 20} height="6" rx="3" fill="#092B46" fillOpacity=".35" />
            </g>
          ))}
        </g>
      )}
      {kind === "growth" && (
        <g>
          <path d="M70 220V140a40 40 0 0 1 80 0v80Z" className="f-mint" />
          <path d="M150 220V100a40 40 0 0 1 80 0v120Z" className="f-teal" />
          <path d="M230 220V60a40 40 0 0 1 80 0v160Z" className="f-warm" />
          <circle cx="330" cy="50" r="22" fill="#FBFAF7" fillOpacity=".3" />
        </g>
      )}
      <line x1="0" x2="400" y1="239" y2="239" stroke="#FBFAF7" strokeOpacity=".3" strokeWidth="2" />
    </svg>
  );
}
