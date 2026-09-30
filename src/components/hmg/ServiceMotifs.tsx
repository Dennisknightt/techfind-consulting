import type { ServiceMotif } from "@/lib/hmg/content";

/** One bespoke pictorial per service, drawn from documents, ledgers and planes. */
export function ServiceArt({ motif }: { motif: ServiceMotif }) {
  return (
    <svg className="svc-art" viewBox="0 0 320 160" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="160" className="svc-bg" />
      {motif === "tax" && (
        <g>
          <rect x="60" y="26" width="110" height="130" rx="6" className="f-warm" />
          <rect x="74" y="42" width="56" height="6" rx="3" className="f-navy" />
          <rect x="74" y="58" width="80" height="4" rx="2" fill="#092B46" fillOpacity=".25" />
          <rect x="74" y="70" width="70" height="4" rx="2" fill="#092B46" fillOpacity=".25" />
          <rect x="74" y="82" width="76" height="4" rx="2" fill="#092B46" fillOpacity=".25" />
          <g className="svc-stamp"><circle cx="196" cy="98" r="38" fill="none" className="s-teal" strokeWidth="3" /><circle cx="196" cy="98" r="30" fill="none" className="s-teal" strokeWidth="1" strokeDasharray="2 4" /><path d="M180 99l11 11 21-24" fill="none" className="s-teal" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></g>
        </g>
      )}
      {motif === "accounting" && (
        <g>
          <rect x="44" y="28" width="232" height="104" rx="6" className="f-warm" />
          <line x1="160" x2="160" y1="28" y2="132" className="s-navy" strokeOpacity=".3" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} className="svc-row" style={{ ["--i" as string]: i }}>
              <line x1="44" x2="276" y1={52 + i * 20} y2={52 + i * 20} className="s-navy" strokeOpacity=".12" />
              <rect x="56" y={40 + i * 20} width={40 + (i % 3) * 14} height="5" rx="2.5" fill="#092B46" fillOpacity=".5" />
              <rect x="176" y={40 + i * 20} width={30 + ((i + 1) % 3) * 16} height="5" rx="2.5" className="f-teal" />
            </g>
          ))}
          <rect x="44" y="132" width="232" height="3" className="f-navy" />
        </g>
      )}
      {motif === "audit" && (
        <g>
          <rect x="74" y="34" width="90" height="112" rx="6" fill="#092B46" fillOpacity=".18" transform="rotate(-6 119 90)" />
          <rect x="92" y="28" width="90" height="112" rx="6" className="f-warm" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} className="svc-row" style={{ ["--i" as string]: i }}>
              <rect x="104" y={44 + i * 22} width="10" height="10" rx="2" fill="none" className="s-navy" strokeWidth="1.5" />
              <path d={`M106 ${49 + i * 22}l3 3 5-7`} fill="none" className="s-teal" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="122" y={46 + i * 22} width={44 - (i % 2) * 10} height="5" rx="2.5" fill="#092B46" fillOpacity=".4" />
            </g>
          ))}
          <circle cx="230" cy="86" r="34" fill="none" className="s-navy" strokeWidth="6" />
          <line x1="254" y1="112" x2="282" y2="140" className="s-navy" strokeWidth="8" strokeLinecap="round" />
        </g>
      )}
      {motif === "advisory" && (
        <g>
          <line x1="40" x2="290" y1="132" y2="132" className="s-navy" strokeWidth="2" />
          <path d="M40 120 C90 120 100 70 150 76 S220 120 290 44" fill="none" className="s-teal svc-line" strokeWidth="4" strokeLinecap="round" />
          <path d="M40 130 C100 128 120 100 170 104 S240 100 290 90" fill="none" className="s-navy" strokeOpacity=".45" strokeWidth="2" strokeDasharray="3 6" />
          <circle cx="150" cy="76" r="7" className="f-warm s-teal" strokeWidth="3" />
          <circle cx="290" cy="44" r="7" className="f-navy" />
          <rect x="196" y="22" width="60" height="18" rx="9" className="f-navy" />
          <text x="226" y="35" fontSize="10" fontWeight="600" textAnchor="middle" fill="#FBFAF7">Scenario B</text>
        </g>
      )}
      {motif === "payroll" && (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} className="svc-row" style={{ ["--i" as string]: i }}>
              <rect x={56 + i * 18} y={28 + i * 14} width="150" height="92" rx="6" className={i === 2 ? "f-warm" : "f-mint"} stroke="#062E4F" strokeOpacity=".12" />
            </g>
          ))}
          <circle cx="92" cy="86" r="10" className="f-navy" />
          <path d="M76 116c2-12 30-12 32 0" className="f-navy" />
          <rect x="116" y="76" width="72" height="6" rx="3" fill="#092B46" fillOpacity=".55" />
          <rect x="116" y="90" width="50" height="5" rx="2.5" fill="#092B46" fillOpacity=".25" />
          <rect x="236" y="36" width="44" height="44" rx="22" className="f-teal" />
          <path d="M248 58l8 8 14-16" fill="none" stroke="#062E4F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="221" y1="100" x2="290" y2="100" className="s-navy" strokeOpacity=".3" strokeDasharray="2 5" />
        </g>
      )}
      {motif === "health" && (
        <g>
          <circle cx="160" cy="84" r="58" fill="none" className="s-navy" strokeOpacity=".15" strokeWidth="14" />
          <circle cx="160" cy="84" r="58" fill="none" className="s-teal svc-ring" strokeWidth="14" strokeLinecap="round" strokeDasharray="280 400" transform="rotate(-90 160 84)" />
          <text x="160" y="92" textAnchor="middle" fontSize="28" fontWeight="600" className="f-ink" style={{ fontFamily: "var(--font-serif)" }}>A–</text>
          <rect x="246" y="46" width="44" height="6" rx="3" fill="#092B46" fillOpacity=".5" />
          <rect x="246" y="62" width="32" height="6" rx="3" fill="#092B46" fillOpacity=".25" />
          <circle cx="36" cy="52" r="5" className="f-teal" /><circle cx="36" cy="72" r="5" className="f-teal" /><circle cx="36" cy="92" r="5" fill="#E0A63B" />
        </g>
      )}
    </svg>
  );
}
