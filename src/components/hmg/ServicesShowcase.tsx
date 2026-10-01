import Link from "next/link";
import { FEATURED_SERVICES, SERVICES } from "@/lib/hmg/content";
import { ROUTES } from "@/lib/hmg/site";
import { ServiceArt } from "./ServiceMotifs";

/** Two featured services with pictorials, the rest as compact rows — not six identical cards. */
export function ServicesShowcase({ detailed = false }: { detailed?: boolean }) {
  const featured = SERVICES.filter((s) => FEATURED_SERVICES.includes(s.slug));
  const rest = SERVICES.filter((s) => !FEATURED_SERVICES.includes(s.slug));
  return (
    <div className="ssc">
      <ul className="ssc__feat">
        {featured.map((s) => (
          <li key={s.slug}>
            <Link href={ROUTES.service(s.slug)} className="ssf">
              <div className="ssf__art"><ServiceArt motif={s.motif} /></div>
              <div className="ssf__body">
                <h3 className="ssf__t">{s.title}</h3>
                {detailed && <p className="ssf__who">{s.whoFor}</p>}
                <p className="ssf__p"><span>The problem</span>{s.problem}</p>
                <p className="ssf__o"><span>Outcome</span>{s.outcome}</p>
                <span className="ssf__more">Explore service <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="ssc__rows">
        {rest.map((s) => (
          <li key={s.slug}>
            <Link href={ROUTES.service(s.slug)} className="ssr">
              <span className="ssr__art" aria-hidden="true"><ServiceArt motif={s.motif} /></span>
              <span className="ssr__body">
                <span className="ssr__t">{s.title}</span>
                <span className="ssr__p">{s.problem}</span>
                {detailed && <span className="ssr__h">{s.handles.slice(0, 4).map((h) => h.t).join(" · ")}</span>}
              </span>
              <span className="ssr__o">{s.outcome}</span>
              <span className="ssr__go" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
