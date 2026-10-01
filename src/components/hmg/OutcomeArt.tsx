/** Three restrained graphics for the outcome trio. */
export function OutcomeArt({ id }: { id: "comply" | "understand" | "decide" }) {
  return (
    <svg className="oart" viewBox="0 0 120 72" aria-hidden="true" focusable="false">
      {id === "comply" && (
        <g>
          <rect x="16" y="10" width="62" height="54" rx="6" className="f-warm" stroke="#062E4F" strokeOpacity=".2" />
          <rect x="16" y="10" width="62" height="12" rx="6" className="f-navy" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={23 + (i % 4) * 13} y={28 + Math.floor(i / 4) * 14} width="9" height="8" rx="2" fill={i === 5 ? "#45C1AD" : "#092B46"} fillOpacity={i === 5 ? 1 : 0.12} />
          ))}
          <circle cx="92" cy="46" r="16" className="f-teal oart__pop" />
          <path d="M85 46l5 5 9-10" fill="none" stroke="#062E4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="oart__draw" />
        </g>
      )}
      {id === "understand" && (
        <g>
          <line x1="12" x2="108" y1="60" y2="60" className="s-navy" strokeOpacity=".3" />
          {[18, 34, 50, 66, 82, 98].map((x, i) => (
            <rect key={x} x={x - 5} y={60 - [16, 24, 20, 32, 28, 40][i]} width="10" height={[16, 24, 20, 32, 28, 40][i]} rx="2" fill={i === 5 ? "#45C1AD" : "#B9EADB"} className="oart__bar" style={{ ["--i" as string]: i }} />
          ))}
          <path d="M18 40 L34 32 L50 36 L66 24 L82 28 L98 14" fill="none" className="s-navy oart__draw" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
          <circle cx="98" cy="14" r="3.5" className="f-navy" />
        </g>
      )}
      {id === "decide" && (
        <g>
          <path d="M14 36 H48" className="s-navy" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48 36 C62 36 62 16 78 16 H96" fill="none" className="s-teal oart__draw" strokeWidth="3" strokeLinecap="round" pathLength={1} />
          <path d="M48 36 C62 36 62 56 78 56 H92" fill="none" stroke="#092B46" strokeOpacity=".25" strokeWidth="2" strokeDasharray="3 5" strokeLinecap="round" />
          <circle cx="48" cy="36" r="6" className="f-warm s-navy" strokeWidth="2.5" />
          <path d="M94 10 l8 6 -8 6" fill="none" className="s-teal" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}
