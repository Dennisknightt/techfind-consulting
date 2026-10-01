import Link from "next/link";
import type { Article } from "@/lib/hmg/content";
import { formatDate } from "@/lib/hmg/content";
import { ROUTES } from "@/lib/hmg/site";
import { CoverArt } from "./CoverArt";

/** Same markup as the server InsightCard, without reveal hooks (used inside client filters). */
export function InsightCardClient({ a, i }: { a: Article; i: number }) {
  return (
    <li className="icard" style={{ ["--i" as string]: i }}>
      <Link href={ROUTES.article(a.slug)} className="icard__link">
        <div className="icard__cover"><CoverArt kind={a.kind} /></div>
        <div className="icard__body">
          <p className="meta">
            <span className="meta__cat">{a.category}</span>
            <span aria-hidden="true">·</span>
            <span>{a.readTime} min read</span>
            <span aria-hidden="true">·</span>
            <time dateTime={a.published}>{formatDate(a.published)}</time>
          </p>
          <h2 className="icard__title">{a.title}</h2>
          <p className="icard__sum">{a.summary}</p>
          <span className="icard__more">Read article <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </li>
  );
}
