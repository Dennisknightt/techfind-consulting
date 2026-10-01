"use client";

import { useEffect, useRef, useState } from "react";

/* All figures are fictional and illustrative. */

type TabId = "cash" | "tax" | "payroll" | "compliance";
const TABS: { id: TabId; label: string }[] = [
  { id: "cash", label: "Cash flow" },
  { id: "tax", label: "Tax" },
  { id: "payroll", label: "Payroll" },
  { id: "compliance", label: "Compliance" },
];

const READ: Record<TabId, { happening: string; attention: string; action: string; hmg: string }> = {
  cash: {
    happening: "Cash is healthy today at KES 420k, but payroll, rent and a supplier batch all fall in weeks 5–7.",
    attention: "Week 7 drops to KES 140k — below the KES 200k minimum buffer — while two invoices are still unpaid.",
    action: "Collect the two overdue invoices before week 5 and move the supplier batch by one week.",
    hmg: "Maintains a rolling 13-week forecast and flags pressure points before they arrive.",
  },
  compliance: {
    happening: "VAT is filed and the Tax Compliance Certificate is valid.",
    attention: "PAYE is due in 6 days, two suppliers have not issued eTIMS invoices, and the annual return is still in draft.",
    action: "Approve payroll this week, request compliant invoices from both suppliers and sign off the annual return.",
    hmg: "Keeps a compliance calendar for every tax head and prepares each filing ahead of its date.",
  },
  tax: {
    happening: "Four tax payments fall due in the next 100 days, totalling over KES 1.3 million.",
    attention: "PAYE (KES 412k) lands in 6 days and VAT (KES 268k) in 17 — close together in a tight month.",
    action: "Reserve cash for both now and refresh the profit projection before instalment tax is due.",
    hmg: "Tracks each obligation with its amount and preparation date, so tax is planned rather than found.",
  },
  payroll: {
    happening: "This month’s payroll for 14 staff is four of five steps ready.",
    attention: "A leaver’s final dues are not yet calculated, so the run cannot be approved.",
    action: "Confirm the leaver’s last working day and approve the run by Thursday.",
    hmg: "Prepares payroll and statutory deductions from the data you approve, and reconciles every return.",
  },
};

/* ---------- visuals ---------- */
const CUR = [420, 400, 380, 330, 290, 230, 140, 190, 260, 330, 380, 410, 450];
const PLAN = [420, 410, 400, 380, 360, 330, 260, 280, 320, 370, 410, 440, 480];
const px = (i: number) => 24 + i * 29.3;
const py = (v: number) => 150 - (v / 500) * 128;
const line = (a: number[]) => a.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");

function CashVisual() {
  const [plan, setPlan] = useState(false);
  const s = plan ? PLAN : CUR;
  const low = s[6] < 200;
  return (
    <div className="cd__vis">
      <svg key={String(plan)} viewBox="0 0 400 156" className="cd__chart" role="img" aria-label={`Illustrative 13-week cash balance. Week 7 is KES ${s[6]} thousand, ${low ? "below" : "above"} the KES 200 thousand buffer.`}>
        <defs>
          <linearGradient id="cd-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#45C1AD" stopOpacity=".28" /><stop offset="1" stopColor="#45C1AD" stopOpacity="0" /></linearGradient>
        </defs>
        <rect x="24" y={py(200)} width="352" height={150 - py(200)} fill="#E0A63B" fillOpacity=".1" />
        <line x1="24" x2="376" y1={py(200)} y2={py(200)} stroke="#8A5A00" strokeDasharray="4 4" strokeOpacity=".7" />
        <path d={`${line(s)} L${px(12)} 150 L${px(0)} 150 Z`} fill="url(#cd-g)" />
        <path d={line(s)} fill="none" stroke="#0E7C6B" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <g className="cd__mark" style={{ transform: `translate(${px(6)}px, ${py(s[6])}px)` }}>
          <circle r="11" fill={low ? "#E0A63B" : "#45C1AD"} fillOpacity=".3" />
          <circle r="5.5" fill="#FBFAF7" stroke={low ? "#B97A00" : "#0E7C6B"} strokeWidth="3" />
        </g>
      </svg>
      <div className="cd__axis" aria-hidden="true"><span>Week 1</span><span>Week 13</span></div>
      <ul className="cd__legend">
        <li><span className="cd__key cd__key--buf" aria-hidden="true" /><span>Minimum buffer: KES 200k</span></li>
        <li><span className={`cd__key ${low ? "cd__key--low" : "cd__key--ok"}`} aria-hidden="true" /><span>Week 7: <strong>KES {s[6]}k</strong> {low ? "(below buffer)" : "(above buffer)"}</span></li>
      </ul>
      <div className="seg seg--2" role="group" aria-label="Scenario">
        <button type="button" aria-pressed={!plan} onClick={() => setPlan(false)}>As it stands</button>
        <button type="button" aria-pressed={plan} onClick={() => setPlan(true)}>With HMG’s plan</button>
      </div>
      <p className="cd__note" aria-live="polite">{plan ? "Acting early keeps week 7 at KES 260k, above the buffer." : "Without action, week 7 falls below the buffer."}</p>
    </div>
  );
}

const ROWS = [
  { id: "tcc", label: "Tax Compliance Certificate", state: "Valid", open: false },
  { id: "vat", label: "VAT returns", state: "Filed on time", open: false },
  { id: "paye", label: "PAYE return", state: "Due in 6 days", done: "Filed", open: true },
  { id: "etims", label: "eTIMS supplier invoices", state: "2 missing", done: "Received", open: true },
  { id: "annual", label: "Annual return", state: "Awaiting approval", done: "Approved", open: true },
] as const;

function ComplianceVisual() {
  const [done, setDone] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const left = ROWS.filter((r) => r.open && !done.includes(r.id)).length;
  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (left === 0) return setDone([]);
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ROWS.filter((r) => r.open && !done.includes(r.id)).forEach((r, i) => {
      timers.current.push(window.setTimeout(() => setDone((d) => (d.includes(r.id) ? d : [...d, r.id])), instant ? 0 : (i + 1) * 450));
    });
  }
  return (
    <div className="cd__vis">
      <div className="cd__status">
        <p className={`pill ${left ? "pill--warn" : "pill--ok"}`} role="status">
          <span className="pill__dot" aria-hidden="true" />
          <span key={left ? "w" : "o"} className="pill__txt">{left ? `Attention required · ${left} open` : "Up to date"}</span>
        </p>
        <button type="button" className="btn btn--sm btn--ghost" onClick={run}>{left ? "Show it resolved" : "Reset"}</button>
      </div>
      <ul className="cd__list">
        {ROWS.map((r) => {
          const ok = !r.open || done.includes(r.id);
          return (
            <li key={r.id} className={ok ? "is-ok" : ""}>
              <span className="cd__mk" aria-hidden="true">
                {ok ? (
                  <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  "!"
                )}
              </span>
              <span className="cd__lbl">{r.label}</span>
              <span className="cd__st">{r.open && ok ? r.done : r.state}<span className="sr-only">{ok ? " — complete" : " — needs attention"}</span></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const OBL = [
  { id: "paye", name: "PAYE", days: 6, amount: "KES 412,000", prep: "Approve payroll journals" },
  { id: "vat", name: "VAT", days: 17, amount: "KES 268,000", prep: "Match sales to eTIMS" },
  { id: "inst", name: "Instalment tax", days: 41, amount: "KES 650,000", prep: "Refresh profit projection" },
  { id: "annual", name: "Annual return", days: 96, amount: "To be computed", prep: "Close the year-end books" },
];

function ObligationsVisual() {
  const [k, setK] = useState(0);
  const o = OBL[k];
  return (
    <div className="cd__vis">
      <div className="ob" role="group" aria-label="Upcoming tax obligations">
        <span className="ob__rail" aria-hidden="true" />
        {OBL.map((x, j) => (
          <button key={x.id} type="button" className={`ob__pt${j === k ? " is-on" : ""}${x.days <= 7 ? " is-soon" : ""}`} aria-pressed={j === k} onClick={() => setK(j)}>
            <span className="ob__dot" aria-hidden="true" />
            <span className="ob__n">{x.name}</span>
            <span className="ob__d">{x.days} days</span>
          </button>
        ))}
      </div>
      <dl key={o.id} className="ob__detail" aria-live="polite">
        <div><dt>Obligation</dt><dd>{o.name}</dd></div>
        <div><dt>Due in</dt><dd>{o.days} days</dd></div>
        <div><dt>Amount</dt><dd>{o.amount}</dd></div>
        <div><dt>Prepare</dt><dd>{o.prep}</dd></div>
      </dl>
    </div>
  );
}

const PAY = ["Joiners and changes captured", "Allowances confirmed", "Variances reviewed", "Statutory deductions calculated", "Leaver final dues calculated"];

function PayrollVisual() {
  const [done, setDone] = useState(false);
  const n = done ? 5 : 4;
  return (
    <div className="cd__vis">
      <div className="cd__status">
        <p className={`pill ${done ? "pill--ok" : "pill--warn"}`} role="status">
          <span className="pill__dot" aria-hidden="true" />
          <span key={String(done)} className="pill__txt">{done ? "Ready to approve" : "4 of 5 steps ready"}</span>
        </p>
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setDone((d) => !d)}>{done ? "Reset" : "Complete last step"}</button>
      </div>
      <div className="pay__bar" aria-hidden="true"><span style={{ transform: `scaleX(${n / 5})` }} /></div>
      <ul className="cd__list">
        {PAY.map((t, i) => {
          const ok = i < 4 || done;
          return (
            <li key={t} className={ok ? "is-ok" : ""}>
              <span className="cd__mk" aria-hidden="true">{ok ? <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg> : "!"}</span>
              <span className="cd__lbl">{t}</span>
              <span className="cd__st">{ok ? "Done" : "Outstanding"}<span className="sr-only">{ok ? " — complete" : " — needs attention"}</span></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const VIS: Record<TabId, () => React.JSX.Element> = { cash: CashVisual, tax: ObligationsVisual, payroll: PayrollVisual, compliance: ComplianceVisual };

export function ClarityDemo() {
  const [tab, setTab] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function onKey(e: React.KeyboardEvent) {
    const n = TABS.length;
    let next = tab;
    if (e.key === "ArrowRight") next = (tab + 1) % n;
    else if (e.key === "ArrowLeft") next = (tab - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setTab(next);
    refs.current[next]?.focus();
  }
  return (
    <div className="cd">
      <div className="cd__tabs" role="tablist" aria-label="Insight examples" onKeyDown={onKey}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`cd-tab-${t.id}`}
            aria-selected={tab === i}
            aria-controls={`cd-panel-${t.id}`}
            tabIndex={tab === i ? 0 : -1}
            className="cd__tab"
            onClick={(e) => { setTab(i); e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" }); }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {TABS.map((t, i) => {
        const V = VIS[t.id];
        const r = READ[t.id];
        return (
          <div key={t.id} role="tabpanel" id={`cd-panel-${t.id}`} aria-labelledby={`cd-tab-${t.id}`} hidden={tab !== i} className="cd__panel" tabIndex={0}>
            <dl className="cd__read cd__read--primary">
              <div className="cd__r cd__r--h"><dt><span className="cd__num">1</span>What is happening</dt><dd>{r.happening}</dd></div>
              <div className="cd__r cd__r--a"><dt><span className="cd__num">2</span>What needs attention</dt><dd>{r.attention}</dd></div>
              <div className="cd__r cd__r--n"><dt><span className="cd__num">3</span>Recommended next action</dt><dd>{r.action}</dd></div>
            </dl>
            <div className="cd__left">
              <p className="cd__ill">Illustrative example · fictional figures</p>
              <V />
            </div>
            <dl className="cd__read cd__read--secondary">
              <div className="cd__r cd__r--m"><dt><span className="cd__num">4</span>How HMG helps</dt><dd>{r.hmg}</dd></div>
            </dl>
            <details className="cd__more">
              <summary>View full explanation</summary>
              <dl className="cd__read">
                <div className="cd__r cd__r--m"><dt><span className="cd__num">4</span>How HMG helps</dt><dd>{r.hmg}</dd></div>
              </dl>
            </details>
          </div>
        );
      })}
    </div>
  );
}
