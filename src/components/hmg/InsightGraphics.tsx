/** Six management-insight graphics. All data is fictional and illustrative. */

export function TaxGraphic() {
  const items = [
    { x: 30, label: "PAYE", days: "6 days", warn: true },
    { x: 120, label: "VAT", days: "17 days", warn: false },
    { x: 210, label: "Instalment", days: "41 days", warn: false },
    { x: 300, label: "Annual return", days: "96 days", warn: false },
  ];
  return (
    <svg className="ig" viewBox="0 0 340 150" role="img" aria-label="Timeline of upcoming tax obligations: PAYE in 6 days, VAT in 17 days, instalment tax in 41 days and the annual return in 96 days">
      <line x1="30" x2="300" y1="60" y2="60" className="s-navy" strokeOpacity=".2" strokeWidth="2" />
      <line x1="30" x2="300" y1="60" y2="60" className="s-teal ig-draw" pathLength={1} strokeWidth="2" />
      {items.map((it, i) => (
        <g key={it.label} className="ig-pop" style={{ ["--i" as string]: i }}>
          <circle cx={it.x} cy="60" r={it.warn ? 10 : 7} fill={it.warn ? "#E0A63B" : "#FBFAF7"} className={it.warn ? "" : "s-teal"} strokeWidth="3" />
          <text x={it.x} y="100" textAnchor="middle" fontSize="11" fontWeight="600" className="f-ink">{it.label}</text>
          <text x={it.x} y="117" textAnchor="middle" fontSize="11" fill={it.warn ? "#8A5A00" : "#3F5A70"} fontWeight={it.warn ? 700 : 500}>{it.days}</text>
        </g>
      ))}
    </svg>
  );
}

export function CashGraphic() {
  return (
    <svg className="ig" viewBox="0 0 340 150" role="img" aria-label="Cash-flow line across 13 weeks with a dip in week 7 marked for attention">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#45C1AD" stopOpacity=".3" /><stop offset="1" stopColor="#45C1AD" stopOpacity="0" /></linearGradient>
      </defs>
      {[30, 70, 110].map((y) => <line key={y} x1="10" x2="330" y1={y} y2={y} className="s-navy" strokeOpacity=".08" />)}
      <path className="ig-fade" d="M10 60 L60 50 L110 70 L160 112 L210 96 L260 60 L330 38 V130 H10Z" fill="url(#cg)" />
      <path className="s-teal ig-draw" pathLength={1} d="M10 60 L60 50 L110 70 L160 112 L210 96 L260 60 L330 38" fill="none" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <g className="ig-pop" style={{ ["--i" as string]: 3 }}>
        <circle cx="160" cy="112" r="9" fill="#E0A63B" fillOpacity=".3" />
        <circle cx="160" cy="112" r="5" fill="#E0A63B" />
        <text x="160" y="136" textAnchor="middle" fontSize="11" fontWeight="700" fill="#8A5A00">Week 7 dip</text>
      </g>
      <text x="10" y="146" fontSize="10" fill="#3F5A70">Wk 1</text>
      <text x="330" y="146" fontSize="10" textAnchor="end" fill="#3F5A70">Wk 13</text>
    </svg>
  );
}

export function ExpenseGraphic() {
  const rows = [
    { label: "Logistics", v: 112, over: true },
    { label: "Payroll", v: 84, over: false },
    { label: "Marketing", v: 62, over: false },
    { label: "Utilities", v: 48, over: false },
  ];
  return (
    <svg className="ig" viewBox="0 0 340 150" role="img" aria-label="Expense bars against budget: logistics is 12 percent over budget, other categories within budget">
      <line x1="210" x2="210" y1="12" y2="136" className="s-navy" strokeDasharray="3 4" strokeOpacity=".5" />
      <text x="210" y="10" fontSize="9" textAnchor="middle" fill="#3F5A70">Budget</text>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x="10" y={40 + i * 30} fontSize="11" fontWeight="600" className="f-ink">{r.label}</text>
          <rect x="84" y={29 + i * 30} width="240" height="14" rx="7" fill="#092B46" fillOpacity=".06" />
          <rect className={`ig-bar ${r.over ? "f-amber" : "f-teal"}`} style={{ ["--i" as string]: i, width: r.v * 2 }} x="84" y={29 + i * 30} height="14" rx="7" />
        </g>
      ))}
      <text x="322" y="22" fontSize="10" textAnchor="end" fontWeight="700" fill="#8A5A00">+12%</text>
    </svg>
  );
}

export function PayrollGraphic() {
  return (
    <svg className="ig" viewBox="0 0 340 150" role="img" aria-label="Payroll readiness: four of five steps complete; leaver calculations still outstanding">
      <g transform="translate(14 14)">
        <circle cx="56" cy="56" r="46" fill="none" className="s-navy" strokeOpacity=".1" strokeWidth="12" />
        <circle cx="56" cy="56" r="46" fill="none" className="s-teal ig-ring" strokeWidth="12" strokeLinecap="round" strokeDasharray="231 289" transform="rotate(-90 56 56)" />
        <text x="56" y="62" textAnchor="middle" fontSize="26" fontWeight="600" className="f-ink" style={{ fontFamily: "var(--font-serif)" }}>4/5</text>
      </g>
      {[
        ["Changes locked", true],
        ["Variances reviewed", true],
        ["Approvals signed", true],
        ["Returns prepared", true],
        ["Leaver calculations", false],
      ].map(([t, ok], i) => (
        <g key={t as string} className="ig-pop" style={{ ["--i" as string]: i }}>
          <circle cx="152" cy={30 + i * 22} r="7" fill={ok ? "#45C1AD" : "#E0A63B"} />
          {ok ? <path d={`M148.5 ${30 + i * 22}l2.5 2.5 4-5`} fill="none" stroke="#062E4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> : <rect x="151" y={25 + i * 22} width="2" height="6" fill="#062E4F" />}
          <text x="168" y={34 + i * 22} fontSize="12" fontWeight={ok ? 500 : 700} className="f-ink">{t as string}</text>
        </g>
      ))}
    </svg>
  );
}

export function ComplianceGraphic() {
  const rows = [
    ["Tax Compliance Certificate", "Valid", "ok"],
    ["VAT returns", "Filed", "ok"],
    ["PAYE returns", "Due soon", "warn"],
    ["eTIMS invoices", "2 gaps", "warn"],
  ];
  return (
    <svg className="ig" viewBox="0 0 340 150" role="img" aria-label="Compliance status: certificate valid, VAT filed, PAYE due soon, eTIMS two gaps">
      {rows.map(([a, b, s], i) => (
        <g key={a} className="ig-pop" style={{ ["--i" as string]: i }}>
          <rect x="6" y={10 + i * 34} width="328" height="28" rx="8" fill="#092B46" fillOpacity=".05" />
          <circle cx="24" cy={24 + i * 34} r="6" fill={s === "ok" ? "#45C1AD" : "#E0A63B"} />
          <text x="40" y={28 + i * 34} fontSize="12" fontWeight="500" className="f-ink">{a}</text>
          <text x="322" y={28 + i * 34} textAnchor="end" fontSize="12" fontWeight="700" fill={s === "ok" ? "#0E7C6B" : "#8A5A00"}>{b}</text>
        </g>
      ))}
    </svg>
  );
}

export function RiskGraphic() {
  const risks = [
    { t: "Unreconciled bank account", w: 210, c: "#C2543A" },
    { t: "Supplier invoices without eTIMS", w: 160, c: "#E0A63B" },
    { t: "Single approver on payments", w: 110, c: "#E0A63B" },
    { t: "Late debtor follow-up", w: 70, c: "#45C1AD" },
  ];
  return (
    <svg className="ig" viewBox="0 0 340 150" role="img" aria-label="Ranked financial risks: unreconciled bank account is highest, followed by supplier invoices without eTIMS, single approver on payments and late debtor follow-up">
      {risks.map((r, i) => (
        <g key={r.t}>
          <text x="6" y={22 + i * 34} fontSize="11.5" fontWeight="600" className="f-ink">{i + 1}. {r.t}</text>
          <rect x="6" y={29 + i * 34} width="328" height="6" rx="3" fill="#092B46" fillOpacity=".07" />
          <rect className="ig-bar" style={{ ["--i" as string]: i, width: r.w }} x="6" y={29 + i * 34} height="6" rx="3" fill={r.c} />
        </g>
      ))}
    </svg>
  );
}
