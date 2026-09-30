"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow, Lines } from "./Lines";
import { useTween } from "./useTween";

/* All figures in this file are fictional and illustrative. */

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function LabCard({ tag, tagLabel, title, hint, className = "", children }: { tag: "happening" | "attention" | "next"; tagLabel: string; title: string; hint: string; className?: string; children: React.ReactNode }) {
  return (
    <article className={`lab__card ${className}`} data-reveal data-loop>
      <div className="lab__top">
        <span className={`tag tag--${tag}`}>{tagLabel}</span>
        <span className="lab__ill">Illustrative</span>
      </div>
      <h3 className="lab__title">{title}</h3>
      <p className="lab__hint">{hint}</p>
      {children}
    </article>
  );
}

/* ───────── 1. Compliance status ───────── */
const ROWS = [
  { id: "tcc", label: "Tax Compliance Certificate", state: "Valid to December", open: false },
  { id: "vat", label: "VAT returns", state: "Filed on time", open: false },
  { id: "paye", label: "PAYE return", state: "Due in 6 days", done: "Filed and paid", open: true },
  { id: "etims", label: "eTIMS supplier invoices", state: "2 suppliers non-compliant", done: "Suppliers compliant", open: true },
  { id: "annual", label: "Annual return", state: "Draft awaiting approval", done: "Approved and scheduled", open: true },
] as const;

function Compliance() {
  const [done, setDone] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);
  const openLeft = ROWS.filter((r) => r.open && !done.includes(r.id)).length;
  const allDone = openLeft === 0;
  const cleared = ROWS.length - openLeft;

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (allDone) return setDone([]);
    ROWS.filter((r) => r.open && !done.includes(r.id)).forEach((r, i) => {
      timers.current.push(window.setTimeout(() => setDone((d) => (d.includes(r.id) ? d : [...d, r.id])), reduced() ? 0 : (i + 1) * 850));
    });
  }
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const C = 2 * Math.PI * 34;

  return (
    <LabCard tag="attention" tagLabel="Needs attention" title="Compliance status" hint="Resolve each item, or let HMG clear them in sequence." className="lab__card--compliance">
      <div className="comp__head">
        <svg viewBox="0 0 84 84" width="84" height="84" aria-hidden="true" className="comp__ring">
          <circle cx="42" cy="42" r="34" fill="none" className="s-navy" strokeOpacity=".1" strokeWidth="8" />
          <circle cx="42" cy="42" r="34" fill="none" className={allDone ? "s-teal" : "comp__arc-warn"} strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - cleared / ROWS.length)} transform="rotate(-90 42 42)" style={{ transition: "stroke-dashoffset .8s var(--ease), stroke .4s" }} />
          <text x="42" y="47" textAnchor="middle" fontSize="15" fontWeight="700" className="f-ink">{cleared}/{ROWS.length}</text>
        </svg>
        <div>
          <p className={`pill ${allDone ? "pill--ok" : "pill--warn"}`} role="status" aria-live="polite">
            <span className="pill__dot" aria-hidden="true" />
            <span key={String(allDone)} className="pill__txt">{allDone ? "Up to date" : `Attention required · ${openLeft} open`}</span>
          </p>
          <button type="button" className="btn btn--sm btn--ghost" onClick={run}>{allDone ? "Reset demo" : "Clear open items"}</button>
        </div>
      </div>
      <ul className="comp__list">
        {ROWS.map((r) => {
          const resolved = !r.open || done.includes(r.id);
          return (
            <li key={r.id} className={`comp__row${resolved ? " is-ok" : ""}`}>
              <span className="comp__mark" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="comp__txt">
                <strong>{r.label}</strong>
                <span>{r.open && resolved ? r.done : r.state}</span>
              </span>
              {r.open && (
                <button type="button" className="comp__btn" aria-pressed={resolved} onClick={() => toggle(r.id)} aria-label={`${resolved ? "Reopen" : "Mark resolved"}: ${r.label}`}>
                  {resolved ? "Undo" : "Resolve"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </LabCard>
  );
}

/* ───────── 2. Cash-flow trend ───────── */
const CUR = [420, 400, 380, 330, 290, 230, 140, 190, 260, 330, 380, 410, 450];
const ACT = [420, 410, 400, 380, 360, 330, 260, 280, 320, 370, 410, 440, 480];
const NOTES: Record<number, string> = {
  3: "Payroll, PAYE and VAT all leave the account in the same fortnight.",
  5: "Rent and quarterly insurance fall due while receipts slow down.",
  6: "A supplier batch lands while two large invoices are still unpaid.",
  7: "The two late invoices arrive and cash starts to recover.",
};
const BUFFER = 200;
const px = (i: number) => 20 + i * 30;
const py = (v: number) => 165 - (v / 500) * 140;
const line = (a: number[]) => a.map((v, i) => `${i ? "L" : "M"}${px(i)} ${py(v).toFixed(1)}`).join(" ");

function CashFlow() {
  const [w, setW] = useState(6);
  const [plan, setPlan] = useState(false);
  const series = plan ? ACT : CUR;
  const v = series[w];
  const prev = w > 0 ? series[w - 1] : v;
  const delta = v - prev;
  const below = v < BUFFER;
  const svgRef = useRef<SVGSVGElement>(null);

  function pick(e: React.PointerEvent) {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 400;
    setW(Math.max(0, Math.min(12, Math.round((x - 20) / 30))));
  }
  const why = NOTES[w] ?? "Routine receipts and payments — no unusual movements.";
  const area = `${line(series)} L${px(12)} 165 L${px(0)} 165 Z`;

  return (
    <LabCard tag="happening" tagLabel="What is happening" title="Cash-flow trend" hint="Drag across the chart or use the slider. Switch to see the effect of acting early." className="lab__card--cash">
      <div className="seg" role="group" aria-label="Scenario">
        <button type="button" aria-pressed={!plan} onClick={() => setPlan(false)}>As it stands</button>
        <button type="button" aria-pressed={plan} onClick={() => setPlan(true)}>With HMG’s plan</button>
      </div>
      <svg ref={svgRef} className="cash__svg" viewBox="0 0 400 180" onPointerDown={pick} onPointerMove={(e) => e.pointerType === "mouse" && pick(e)} role="img" aria-label={`Cash balance over 13 weeks. Week ${w + 1}: KES ${v} thousand.${below ? " Below the KES 200 thousand buffer." : ""}`}>
        <defs>
          <linearGradient id="cash-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#45C1AD" stopOpacity=".3" /><stop offset="1" stopColor="#45C1AD" stopOpacity="0" /></linearGradient>
        </defs>
        <rect x="20" y={py(BUFFER)} width="360" height={165 - py(BUFFER)} fill="#E0A63B" fillOpacity=".12" />
        <line x1="20" x2="380" y1={py(BUFFER)} y2={py(BUFFER)} stroke="#8A5A00" strokeDasharray="4 4" strokeOpacity=".7" />
        <text x="378" y={py(BUFFER) + 14} textAnchor="end" fontSize="10" fontWeight="600" fill="#8A5A00">Minimum buffer · KES 200k</text>
        <path key={`a${plan}`} d={area} fill="url(#cash-g)" className="cash__area" />
        <path key={`l${plan}`} d={line(series)} fill="none" className="s-teal cash__line" pathLength={1} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        {!plan && <path d={line(ACT)} fill="none" stroke="#092B46" strokeOpacity=".25" strokeWidth="2" strokeDasharray="2 6" />}
        <g className="cash__marker" style={{ transform: `translate(${px(w)}px, ${py(v)}px)` }}>
          <line x1="0" x2="0" y1="0" y2={165 - py(v)} stroke="#092B46" strokeOpacity=".25" />
          <circle r="11" fill={below ? "#E0A63B" : "#45C1AD"} fillOpacity=".3" />
          <circle r="5.5" fill="#FBFAF7" stroke={below ? "#B97A00" : "#0E7C6B"} strokeWidth="3" />
        </g>
        <text x="20" y="178" fontSize="10" fill="#3F5A70">Wk 1</text>
        <text x="380" y="178" fontSize="10" textAnchor="end" fill="#3F5A70">Wk 13</text>
      </svg>
      <label className="cash__range">
        <span>Week {w + 1}</span>
        <input type="range" min={1} max={13} value={w + 1} onChange={(e) => setW(Number(e.target.value) - 1)} aria-valuetext={`Week ${w + 1}: KES ${v} thousand`} />
      </label>
      <div className="cash__read" aria-live="polite">
        <p className="cash__fig">
          <strong>KES {v}k</strong>
          <span className={delta < 0 ? "neg" : "pos"}>{delta === 0 ? "—" : `${delta < 0 ? "−" : "+"}${Math.abs(delta)}k vs last week`}</span>
          {below && <span className="pill pill--warn pill--sm">Below buffer</span>}
        </p>
        <p className="cash__why">
          <span>What changed:</span> {plan && w >= 5 && w <= 7 ? "Two invoices are collected early and the supplier batch moves a week, so cash stays above the buffer." : why}
        </p>
      </div>
    </LabCard>
  );
}

/* ───────── 3. Upcoming obligations ───────── */
const OBL = [
  { id: "paye", name: "PAYE return", days: 6, amount: "KES 412,000", prep: "Approve payroll journals", decision: "Confirm the cash is reserved and approve the payroll run." },
  { id: "vat", name: "VAT return", days: 17, amount: "KES 268,000", prep: "Match sales to eTIMS", decision: "Chase missing supplier invoices so input VAT can be claimed." },
  { id: "inst", name: "Instalment tax", days: 41, amount: "KES 650,000", prep: "Refresh the profit projection", decision: "Decide whether to hold or adjust the instalment based on the latest projection." },
  { id: "annual", name: "Annual return", days: 96, amount: "To be computed", prep: "Close the books for year-end", decision: "Book the audit-readiness review before year-end." },
] as const;

function Obligations() {
  const [i, setI] = useState(0);
  const o = OBL[i];
  return (
    <LabCard tag="attention" tagLabel="Needs attention" title="Upcoming obligations" hint="Select a date to see the amount and the decision it needs." className="lab__card--obl">
      <div className="obl__track">
        <span className="obl__base" aria-hidden="true" />
        <span className="obl__fill" aria-hidden="true" />
        <span className="obl__today" aria-hidden="true"><i /><em>Today</em></span>
        {OBL.map((x, k) => (
          <button key={x.id} type="button" className={`obl__pt${k === i ? " is-on" : ""}${x.days <= 7 ? " is-soon" : ""}`} style={{ left: `${Math.sqrt(x.days / 100) * 94 + 3}%` }} aria-pressed={k === i} aria-label={`${x.name}, due in ${x.days} days`} onClick={() => setI(k)}>
            <span className="obl__dot" />
            <span className="obl__d">{x.days}d</span>
          </button>
        ))}
      </div>
      <div key={o.id} className="obl__panel" aria-live="polite">
        <p className="obl__name">{o.name} <span>· due in {o.days} days</span></p>
        <dl>
          <div><dt>Amount</dt><dd>{o.amount}</dd></div>
          <div><dt>Prepare</dt><dd>{o.prep}</dd></div>
        </dl>
        <p className="obl__dec"><span>Decision</span>{o.decision}</p>
      </div>
    </LabCard>
  );
}

/* ───────── 4. Tax readiness ───────── */
const READY = [
  "Books reconciled to month-end",
  "Supplier invoices eTIMS-compliant",
  "PAYE and VAT filed to date",
  "Instalment tax calculated",
  "Fixed-asset register updated",
  "Director loan accounts reviewed",
];

function Readiness() {
  const [on, setOn] = useState<boolean[]>([true, true, false, true, false, false]);
  const n = on.filter(Boolean).length;
  const pct = useTween(Math.round((n / READY.length) * 100));
  const next = READY.find((_, k) => !on[k]);
  const C = 2 * Math.PI * 40;
  const status = n === READY.length ? "Ready to file" : pct >= 67 ? "Nearly there" : "Work needed";
  return (
    <LabCard tag="next" tagLabel="What to do next" title="Tax readiness" hint="Tick what is done. The score and next step update as you go." className="lab__card--ready">
      <div className="ready__top">
        <svg viewBox="0 0 100 100" width="104" height="104" aria-hidden="true">
          <circle cx="50" cy="50" r="40" fill="none" className="s-navy" strokeOpacity=".1" strokeWidth="9" />
          <circle cx="50" cy="50" r="40" fill="none" className="s-teal" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - n / READY.length)} transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset .8s var(--ease)" }} />
          <text x="50" y="57" textAnchor="middle" fontSize="22" fontWeight="600" className="f-ink" style={{ fontFamily: "var(--font-serif)" }}>{pct}%</text>
        </svg>
        <div aria-live="polite">
          <p className="ready__status">{status}</p>
          <p className="ready__next">{next ? <>Next: <strong>{next}</strong></> : "Everything on the checklist is in place."}</p>
        </div>
      </div>
      <ul className="ready__list">
        {READY.map((t, k) => (
          <li key={t}>
            <label className={on[k] ? "is-on" : ""}>
              <input type="checkbox" checked={on[k]} onChange={() => setOn((s) => s.map((x, j) => (j === k ? !x : x)))} />
              <span className="ready__box" aria-hidden="true"><svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              {t}
            </label>
          </li>
        ))}
      </ul>
    </LabCard>
  );
}

/* ───────── 5. Financial-health overview ───────── */
const HEALTH = [
  { id: "cash", label: "Cash", score: 72, trend: +4, read: "Healthy, with a dip ahead.", why: ["2.4 months of costs in reserve", "Week-7 dip flagged in the forecast", "Two invoices overdue beyond 30 days"], next: "Collect the two overdue invoices." },
  { id: "tax", label: "Tax", score: 58, trend: -6, read: "Exposure is building.", why: ["PAYE due within a week", "Two suppliers missing eTIMS invoices", "Instalment projection is out of date"], next: "Refresh the projection and fix the supplier invoices." },
  { id: "payroll", label: "Payroll", score: 88, trend: +2, read: "Accurate and on schedule.", why: ["Four of five monthly steps complete", "Returns reconcile to the payroll report", "One leaver calculation outstanding"], next: "Finish the leaver calculation." },
  { id: "controls", label: "Controls", score: 49, trend: -3, read: "Gaps that need closing.", why: ["Main bank account not reconciled", "Single approver on payments", "No approval limits defined"], next: "Reconcile the main account, then add a second approver." },
  { id: "growth", label: "Growth", score: 76, trend: +5, read: "Margins support expansion.", why: ["Gross margin steady at target", "Budget reviewed this quarter", "Funding pack not yet prepared"], next: "Prepare a lender-ready funding pack." },
] as const;

function Health() {
  const [k, setK] = useState(0);
  const h = HEALTH[k];
  const score = useTween(h.score, 600);
  const overall = Math.round(HEALTH.reduce((s, x) => s + x.score, 0) / HEALTH.length);
  return (
    <LabCard tag="happening" tagLabel="What is happening" title="Financial-health overview" hint="Select a category to see why it scores the way it does." className="lab__card--health">
      <p className="health__overall">Overall <strong>{overall}</strong><span>/100</span></p>
      <div className="health__bars" role="group" aria-label="Health categories">
        {HEALTH.map((x, j) => (
          <button key={x.id} type="button" className={`hbar${j === k ? " is-on" : ""}${x.score < 60 ? " is-low" : ""}`} aria-pressed={j === k} onClick={() => setK(j)}>
            <span className="hbar__l">{x.label}</span>
            <span className="hbar__t"><span className="hbar__f" style={{ ["--w" as string]: x.score / 100 }} /></span>
            <span className="hbar__n">{x.score}</span>
          </button>
        ))}
      </div>
      <div key={h.id} className="health__panel" aria-live="polite">
        <p className="health__read"><strong>{h.label} · {score}</strong> <span className={h.trend < 0 ? "neg" : "pos"}>{h.trend < 0 ? "▼" : "▲"} {Math.abs(h.trend)} this quarter</span></p>
        <p className="health__say">{h.read}</p>
        <ul>{h.why.map((w) => <li key={w}>{w}</li>)}</ul>
        <p className="health__next"><span>Next</span>{h.next}</p>
      </div>
    </LabCard>
  );
}

/* ───────── 6. What needs attention? ───────── */
const CONCERNS = [
  { id: "filings", label: "Late filings", items: [["PAYE and VAT dates have no named owner", "high"], ["Annual return still in draft", "med"], ["Compliance certificate renews in 60 days", "low"]], decision: "Give every statutory date an owner and an internal deadline.", hmg: "Builds your compliance calendar and files on your behalf." },
  { id: "cash", label: "Tight cash", items: [["Week-7 shortfall against your buffer", "high"], ["Two invoices overdue by 30+ days", "high"], ["Supplier terms not renegotiated", "low"]], decision: "Collect the two invoices and re-time the supplier batch.", hmg: "Runs a 13-week forecast and updates it every week." },
  { id: "payroll", label: "Payroll errors", items: [["Leaver calculation outstanding", "med"], ["Returns not reconciled to payroll report", "med"], ["No approval record for last run", "low"]], decision: "Lock changes before each run and reconcile every return.", hmg: "Processes payroll and files each statutory return." },
  { id: "audit", label: "Audit coming", items: [["Bank reconciliations stop at June", "high"], ["Fixed-asset register not updated", "med"], ["Loan agreements not filed", "low"]], decision: "Reconcile every account to date before auditors arrive.", hmg: "Runs an audit-readiness review with a ranked fix list." },
  { id: "growth", label: "Fast growth", items: [["Margin per order not measured", "high"], ["Budget last reviewed 9 months ago", "med"], ["No funding pack ready", "med"]], decision: "Measure margin per order before adding capacity.", hmg: "Models steady, strong and slow scenarios for the board." },
] as const;

function Attention() {
  const [k, setK] = useState(0);
  const c = CONCERNS[k];
  return (
    <LabCard tag="attention" tagLabel="Needs attention" title="What needs attention?" hint="Pick the concern closest to your business." className="lab__card--attn">
      <div className="chips chips--inner" role="group" aria-label="Business concern">
        {CONCERNS.map((x, j) => (
          <button key={x.id} type="button" className="chip chip--sm" aria-pressed={j === k} onClick={() => setK(j)}>{x.label}</button>
        ))}
      </div>
      <div key={c.id} className="attn__panel" aria-live="polite">
        <ol className="attn__list">
          {c.items.map(([t, sev], j) => (
            <li key={t} style={{ ["--k" as string]: j }}>
              <span className={`sev sev--${sev}`}>{sev === "high" ? "High" : sev === "med" ? "Medium" : "Low"}</span>
              {t}
            </li>
          ))}
        </ol>
        <p className="health__next"><span>Decision to make</span>{c.decision}</p>
        <p className="attn__hmg"><span>How HMG helps</span>{c.hmg}</p>
      </div>
    </LabCard>
  );
}

export function InsightLab() {
  return (
    <section className="sec sec--cream" id="decisions" aria-labelledby="decisions-h">
      <div className="wrap">
        <div className="sec__head sec__head--wide">
          <Eyebrow>Decision insights</Eyebrow>
          <Lines id="decisions-h" lines={["Know what is happening.", "Know what needs attention.", "Know what to do next."]} className="mask-h--lg" />
          <p className="sec__lead" data-reveal>
            Reports should end with a decision. Try these: tap, slide and select. Each one shows how HMG turns numbers into the next move.
          </p>
        </div>
        <div className="lab">
          <Compliance />
          <CashFlow />
          <Obligations />
          <Readiness />
          <Health />
          <Attention />
        </div>
        <p className="fine">All figures, dates and scores are fictional and illustrative, shown only to demonstrate how HMG presents insights. Amounts are in Kenya shillings (KES).</p>
      </div>
    </section>
  );
}
