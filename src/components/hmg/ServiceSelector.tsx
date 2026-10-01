"use client";

import Link from "next/link";
import { useState } from "react";
import { SERVICES } from "@/lib/hmg/content";
import { CONSULT_HREF, ROUTES, whatsappLink } from "@/lib/hmg/site";

/** A simple guided selector: pick the situation that fits, get the matching service. */
export function ServiceSelector() {
  const [pick, setPick] = useState<string | null>(null);
  const s = SERVICES.find((x) => x.slug === pick);
  return (
    <div className="sel">
      <fieldset className="sel__q">
        <legend className="sel__legend">Which of these sounds most like your situation?</legend>
        <div className="sel__opts">
          {SERVICES.map((x) => (
            <label key={x.slug} className={`sel__opt${pick === x.slug ? " is-on" : ""}`}>
              <input type="radio" name="situation" value={x.slug} checked={pick === x.slug} onChange={() => setPick(x.slug)} />
              <span className="sel__radio" aria-hidden="true" />
              {x.selector}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sel__out" aria-live="polite">
        {s ? (
          <div key={s.slug} className="sel__card">
            <p className="sel__k">We recommend</p>
            <h3 className="sel__t">{s.title}</h3>
            <p className="sel__d">{s.lead}</p>
            <p className="sel__o"><span>Outcome</span>{s.outcome}</p>
            <div className="sel__actions">
              <Link href={CONSULT_HREF} className="btn btn--primary">Book a Consultation</Link>
              <Link href={ROUTES.service(s.slug)} className="btn btn--ghost">About this service</Link>
            </div>
            <a className="sel__wa" href={whatsappLink(`Hello HMG, I'd like help with ${s.title}.`)} target="_blank" rel="noopener noreferrer">Or ask on WhatsApp →</a>
          </div>
        ) : (
          <div className="sel__empty">
            <p>Choose an option to see the service that fits best.</p>
            <p className="sel__empty-s">Not sure? Book a consultation and we will work it out with you.</p>
          </div>
        )}
      </div>
    </div>
  );
}
