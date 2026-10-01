"use client";

import { useState } from "react";
import { ARTICLES, INSIGHT_CATEGORIES } from "@/lib/hmg/content";
import { InsightCardClient } from "./InsightCardClient";

export function InsightsLibrary() {
  const [cat, setCat] = useState<(typeof INSIGHT_CATEGORIES)[number]>("All");
  const list = cat === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === cat);
  return (
    <>
      <div className="chips" role="group" aria-label="Filter articles by topic">
        {INSIGHT_CATEGORIES.map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c === "All" ? "All topics" : c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Showing {list.length} article{list.length === 1 ? "" : "s"}</p>
      <ul className="igrid igrid--swap" key={cat}>
        {list.map((a, i) => (
          <InsightCardClient key={a.slug} a={a} i={i} />
        ))}
      </ul>
    </>
  );
}
