"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/hmg/content";
import { CONSULT_HREF } from "@/lib/hmg/site";
import Link from "next/link";
import { ServiceArt } from "./ServiceMotifs";
import { Eyebrow, Lines } from "./Lines";

export function Services() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="sec sec--warm" id="services" aria-labelledby="services-h">
      <div className="wrap">
        <div className="sec__head">
          <Eyebrow>Services</Eyebrow>
          <Lines id="services-h" lines={["Six ways we bring", "clarity to your business."]} />
          <p className="sec__lead" data-reveal>
            Each service stands on its own. Together they give you one trusted view of your finances and one team that knows your story.
          </p>
        </div>
        <ul className="svc-grid">
          {SERVICES.map((s, i) => {
            const isOpen = open === s.id;
            return (
              <li key={s.id} className={`svc${isOpen ? " svc--open" : ""}`} data-reveal style={{ ["--i" as string]: i % 3 }}>
                <div className="svc__art">
                  <ServiceArt motif={s.motif} />
                  <span className="svc__num">0{i + 1}</span>
                </div>
                <div className="svc__body">
                  <h3 className="svc__title">{s.title}</h3>
                  <p className="svc__sum">{s.summary}</p>
                  <div className="svc__outcome">
                    <span className="svc__outcome-k">Outcome</span>
                    <span className="svc__outcome-v">{s.outcome}</span>
                  </div>
                  <button
                    type="button"
                    className="svc__toggle"
                    aria-expanded={isOpen}
                    aria-controls={`svc-${s.id}`}
                    onClick={() => setOpen(isOpen ? null : s.id)}
                  >
                    {isOpen ? "Hide what’s included" : "What’s included"}
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <div className="svc__more" id={`svc-${s.id}`} role="region" aria-label={`${s.title} details`}>
                    <div>
                      <ul className="svc__list">
                        {s.includes.map((x, k) => (
                          <li key={x} style={{ ["--k" as string]: k }}>{x}</li>
                        ))}
                      </ul>
                      <Link href={CONSULT_HREF} className="svc__link">
                        Discuss this service →
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
