"use client";

import Link from "next/link";
import { useState } from "react";
import { ARTICLES, INSIGHT_CATEGORIES } from "@/lib/hmg/content";
import { CoverArt } from "./CoverArt";
import { Eyebrow, Lines } from "./Lines";

export function InsightsSection() {
  const [cat, setCat] = useState<(typeof INSIGHT_CATEGORIES)[number]>("All");
  const [open, setOpen] = useState<string | null>(null);
  const list = cat === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === cat);
  return (
    <section className="sec sec--warm" id="insights" aria-labelledby="insights-h">
      <div className="wrap">
        <div className="sec__head">
          <Eyebrow>Insights</Eyebrow>
          <Lines id="insights-h" lines={["Practical thinking for", "Kenyan finance leaders."]} />
          <p className="sec__lead" data-reveal>
            Short, useful reads on compliance, cash and growth — written to be acted on, not filed away.
          </p>
        </div>

        <div className="chips" role="group" aria-label="Filter articles by topic">
          {INSIGHT_CATEGORIES.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => { setCat(c); setOpen(null); }}>
              {c}
            </button>
          ))}
        </div>

        <ul className="art-grid" key={cat}>
          {list.map((a, i) => {
            const isOpen = open === a.slug;
            const url = `/hmg/insights/${a.slug}`;
            return (
              <li key={a.slug} className={`art${i === 0 && cat === "All" ? " art--feature" : ""}${isOpen ? " art--open" : ""}`} style={{ ["--i" as string]: i }}>
                <article className="art__card">
                  <Link href={url} className="art__cover" tabIndex={-1} aria-hidden="true">
                    <CoverArt kind={a.kind} />
                  </Link>
                  <div className="art__body">
                    <p className="art__meta">
                      <span className="art__cat">{a.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{a.readTime} min read</span>
                    </p>
                    <h3 className="art__title"><Link href={url}>{a.title}</Link></h3>
                    <p className="art__sum">{a.summary}</p>
                    <div className="art__actions">
                      <button type="button" className="art__peek" aria-expanded={isOpen} aria-controls={`prev-${a.slug}`} onClick={() => setOpen(isOpen ? null : a.slug)}>
                        {isOpen ? "Hide preview" : "Quick preview"}
                        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <Link href={url} className="art__more">Read article <span aria-hidden="true">→</span></Link>
                    </div>
                    <div className="art__preview" id={`prev-${a.slug}`} role="region" aria-label={`Preview: ${a.title}`}>
                      <div>
                        <p>{a.sections[0].paragraphs[0]}</p>
                        <ul>
                          {a.takeaways.map((t) => <li key={t}>{t}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        <p className="sr-only" aria-live="polite">
          Showing {list.length} article{list.length === 1 ? "" : "s"}
        </p>
      </div>
    </section>
  );
}
