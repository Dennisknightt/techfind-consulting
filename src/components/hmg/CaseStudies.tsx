"use client";

import Link from "next/link";
import { useState } from "react";
import { CASE_STUDIES, type CaseStudy } from "@/lib/hmg/credentials";
import { getService } from "@/lib/hmg/content";
import { ROUTES } from "@/lib/hmg/site";

function Study({ c }: { c: CaseStudy }) {
  const [after, setAfter] = useState(false);
  const svc = getService(c.service);
  return (
    <article className="cs">
      <p className="cs__sector">{c.sector}</p>
      <h3 className="cs__t">{c.challenge}</h3>
      <div className="seg seg--2" role="group" aria-label="Before or after HMG">
        <button type="button" aria-pressed={!after} onClick={() => setAfter(false)}>Before</button>
        <button type="button" aria-pressed={after} onClick={() => setAfter(true)}>After</button>
      </div>
      <p key={String(after)} className={`cs__state${after ? " cs__state--after" : ""}`} aria-live="polite">{after ? c.after : c.before}</p>
      <div className="cs__cols">
        <div><h4>What HMG did</h4><ul>{c.did.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div><h4>What changed</h4><ul>{c.changed.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>
      {svc && <Link href={ROUTES.service(svc.slug)} className="tlink">{svc.title} <span aria-hidden="true">→</span></Link>}
    </article>
  );
}

/** Renders only client-approved case studies; nothing at all while none are supplied. */
export function CaseStudies({ service, limit = 3, title = "Recent work" }: { service?: string; limit?: number; title?: string }) {
  const list = CASE_STUDIES.filter((c) => c.approvedByClient && (!service || c.service === service)).slice(0, limit);
  if (!list.length) return null;
  return (
    <section className="sec" aria-labelledby="cs-h">
      <div className="wrap">
        <div className="sec__head"><p className="eyebrow">Case studies</p><h2 id="cs-h" className="mask-h">{title}</h2></div>
        <div className="cs__grid">{list.map((c) => <Study key={c.id} c={c} />)}</div>
      </div>
    </section>
  );
}
