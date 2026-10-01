"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ClipboardCheck, Compass, FileWarning, Repeat, ShieldCheck, Users, Wallet, type LucideIcon } from "lucide-react";
import { getService, SITUATIONS } from "@/lib/hmg/content";
import { CONSULT_HREF, ROUTES, whatsappLink } from "@/lib/hmg/site";

type SitId = (typeof SITUATIONS)[number]["id"];

const ICONS: Record<SitId, LucideIcon> = {
  kra: FileWarning,
  books: BookOpen,
  audit: ClipboardCheck,
  cash: Wallet,
  payroll: Users,
  check: ShieldCheck,
  ongoing: Repeat,
  unsure: Compass,
};

/** Pick what is happening (multi-select) → the relevant HMG services, with the reason for each. */
export function SituationSelector({ headingId = "sit-h" }: { headingId?: string }) {
  const [sel, setSel] = useState<SitId[]>([]);

  function toggle(id: SitId) {
    setSel((cur) => {
      if (id === "unsure") return cur.includes("unsure") ? [] : ["unsure"];
      const base = cur.filter((x) => x !== "unsure");
      return base.includes(id) ? base.filter((x) => x !== id) : [...base, id];
    });
  }

  const picked = SITUATIONS.filter((s) => sel.includes(s.id));
  const recs: { slug: string; reasons: string[] }[] = [];
  for (const s of picked) for (const slug of s.services) {
    const r = recs.find((x) => x.slug === slug);
    if (r) r.reasons.push(s.why); else recs.push({ slug, reasons: [s.why] });
  }
  const unsure = sel.includes("unsure");

  return (
    <div className="sit">
      <div className="sit__ask">
        <p className="sit__hint" id={`${headingId}-hint`}>Select everything that applies — you can choose more than one.</p>
        <div className="sit__tiles" role="group" aria-labelledby={headingId} aria-describedby={`${headingId}-hint`}>
          {SITUATIONS.map((s) => {
            const Icon = ICONS[s.id];
            const on = sel.includes(s.id);
            return (
              <button key={s.id} type="button" className="sit__tile" aria-pressed={on} onClick={() => toggle(s.id)}>
                <span className="sit__icon" aria-hidden="true"><Icon size={22} strokeWidth={1.8} /></span>
                <span className="sit__label">{s.label}</span>
                <span className="sit__check" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="sit__out" aria-live="polite">
        {!sel.length && (
          <div className="sit__empty">
            <p className="sit__empty-t">Your recommendation will appear here.</p>
            <p>Choose one or more situations above.</p>
          </div>
        )}
        {unsure && (
          <div className="sit__rec sit__rec--lead" key="unsure">
            <p className="sit__k">Recommended first step</p>
            <h3 className="sit__t">Start with a consultation</h3>
            <p className="sit__why">Tell us what is going on. A consultant will look at your situation and point you to the right service — or a combination.</p>
            <div className="sit__actions">
              <Link href={CONSULT_HREF} className="btn btn--primary">Request a Consultation</Link>
              <a href={whatsappLink()} className="btn btn--ghost-light" target="_blank" rel="noopener noreferrer">WhatsApp HMG</a>
            </div>
          </div>
        )}
        {recs.length > 0 && (
          <ul className="sit__recs" key={recs.map((r) => r.slug).join()}>
            {recs.map((r, i) => {
              const s = getService(r.slug)!;
              return (
                <li key={r.slug} className={`sit__rec${i === 0 ? " sit__rec--lead" : ""}`} style={{ ["--k" as string]: i }}>
                  <p className="sit__k">{i === 0 ? "Recommended service" : "Also relevant"}</p>
                  <h3 className="sit__t">{s.title}</h3>
                  <p className="sit__why">{[...new Set(r.reasons)].join(" ")}</p>
                  <p className="sit__o"><span>Expected outcome</span>{s.outcome}</p>
                  <div className="sit__actions">
                    <Link href={ROUTES.service(s.slug)} className={i === 0 ? "btn btn--ghost-light" : "btn btn--sm btn--ghost"}>Explore service</Link>
                    <Link href={`${ROUTES.contact}?need=${s.slug}#consultation`} className={i === 0 ? "btn btn--primary" : "btn btn--sm btn--primary"}>Request a Consultation</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
