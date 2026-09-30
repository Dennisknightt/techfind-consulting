"use client";

import Link from "next/link";
import { useState } from "react";
import { ARTICLES, INSIGHT_CATEGORIES } from "@/lib/hmg/content";
import { CoverArt } from "./CoverArt";
import { Eyebrow, Lines } from "./Lines";

export function InsightsSection() {
  const [cat, setCat] = useState<(typeof INSIGHT_CATEGORIES)[number]>("All");
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
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        <ul className="art-grid" key={cat}>
          {list.map((a, i) => (
            <li key={a.slug} className={`art${i === 0 && cat === "All" ? " art--feature" : ""}`} style={{ ["--i" as string]: i }}>
              <Link href={`/hmg/insights/${a.slug}`} className="art__link">
                <div className="art__cover">
                  <CoverArt kind={a.kind} />
                </div>
                <div className="art__body">
                  <p className="art__meta">
                    <span className="art__cat">{a.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{a.readTime} min read</span>
                  </p>
                  <h3 className="art__title">{a.title}</h3>
                  <p className="art__sum">{a.summary}</p>
                  <span className="art__more">
                    Read article <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="sr-only" aria-live="polite">
          Showing {list.length} article{list.length === 1 ? "" : "s"}
        </p>
      </div>
    </section>
  );
}
