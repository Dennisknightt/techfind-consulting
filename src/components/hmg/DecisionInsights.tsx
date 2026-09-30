"use client";

import { useState } from "react";
import type { InsightTag } from "@/lib/hmg/content";
import { Eyebrow, Lines } from "./Lines";
import { CashGraphic, ComplianceGraphic, ExpenseGraphic, PayrollGraphic, RiskGraphic, TaxGraphic } from "./InsightGraphics";

const TAGS: { id: "all" | InsightTag; label: string }[] = [
  { id: "all", label: "All insights" },
  { id: "happening", label: "What is happening" },
  { id: "attention", label: "What needs attention" },
  { id: "next", label: "What to do next" },
];

const CARDS: { id: string; tag: InsightTag; title: string; finding: string; decision: string; Graphic: () => React.JSX.Element }[] = [
  { id: "tax", tag: "attention", title: "Tax obligations approaching", finding: "PAYE falls due in 6 days and needs KES 412,000 in the account.", decision: "Approve this month’s payroll journals today and schedule the payment.", Graphic: TaxGraphic },
  { id: "cash", tag: "happening", title: "Cash-flow movement", finding: "Inflows trail payments in week 7, a shortfall of about KES 380,000.", decision: "Chase the two largest open invoices before week 5.", Graphic: CashGraphic },
  { id: "expense", tag: "attention", title: "Expense pressure", finding: "Logistics is 12% over budget while other lines hold steady.", decision: "Re-quote the two highest-cost routes this month.", Graphic: ExpenseGraphic },
  { id: "payroll", tag: "next", title: "Payroll readiness", finding: "Four of five steps are complete; leaver calculations are outstanding.", decision: "Finish the leaver calculations before Friday’s approval.", Graphic: PayrollGraphic },
  { id: "compliance", tag: "happening", title: "Compliance status", finding: "Certificate valid and VAT filed; PAYE due soon and two eTIMS gaps.", decision: "Ask the two suppliers for compliant invoices this week.", Graphic: ComplianceGraphic },
  { id: "risk", tag: "attention", title: "Risks requiring attention", finding: "An unreconciled main bank account ranks highest this month.", decision: "Reconcile that account first, then add a second approver.", Graphic: RiskGraphic },
];

const TAG_LABEL: Record<InsightTag, string> = { happening: "What is happening", attention: "Needs attention", next: "What to do next" };

export function DecisionInsights() {
  const [tag, setTag] = useState<"all" | InsightTag>("all");
  return (
    <section className="sec sec--cream" id="decisions" aria-labelledby="decisions-h">
      <div className="wrap">
        <div className="sec__head sec__head--wide">
          <Eyebrow>Decision insights</Eyebrow>
          <Lines id="decisions-h" lines={["Know what is happening.", "Know what needs attention.", "Know what to do next."]} className="mask-h--lg" />
          <p className="sec__lead" data-reveal>
            Reports should end with a decision. This is the kind of clear, plain-language view HMG builds for business owners.
          </p>
        </div>

        <div className="chips" role="group" aria-label="Filter insights">
          {TAGS.map((t) => (
            <button key={t.id} type="button" className="chip" aria-pressed={tag === t.id} onClick={() => setTag(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <ul className="dec-grid">
          {CARDS.map((c, i) => {
            const dim = tag !== "all" && c.tag !== tag;
            return (
              <li key={c.id} className={`dec${dim ? " dec--dim" : ""}`} data-reveal style={{ ["--i" as string]: i % 3 }}>
                <div className="dec__top">
                  <span className={`tag tag--${c.tag}`}>{TAG_LABEL[c.tag]}</span>
                  <span className="dec__ill">Illustrative</span>
                </div>
                <h3 className="dec__title">{c.title}</h3>
                <div className="dec__graphic">
                  <c.Graphic />
                </div>
                <p className="dec__finding">{c.finding}</p>
                <p className="dec__decision">
                  <span>Decision</span>
                  {c.decision}
                </p>
              </li>
            );
          })}
        </ul>
        <p className="fine">All figures and dates above are fictional, shown only to illustrate how HMG presents insights. Amounts in Kenya shillings (KES).</p>
      </div>
    </section>
  );
}
