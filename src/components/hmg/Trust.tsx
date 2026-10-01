import Image from "next/image";
import { OPTIONAL, VERIFIED } from "@/lib/hmg/credentials";

/** Verified facts, text-led (no cards); optional credentials appear only when supplied. */
export function TrustFacts({ heading = "The facts behind HMG" }: { heading?: string }) {
  const facts: { k: string; v: string; d?: string }[] = [
    { k: "Founded", v: `Nairobi, ${VERIFIED.founded}` },
    { k: "Office", v: "Akai Plaza", d: "Garden Estate Road, Nairobi" },
    { k: "Serving", v: VERIFIED.reach, d: "Businesses across Kenya and Africa" },
    { k: "Service lines", v: String(VERIFIED.serviceLines), d: "Tax, accounting, audit, advisory, payroll and health checks" },
  ];
  if (OPTIONAL.combinedExperience) facts.push({ k: "Team experience", v: OPTIONAL.combinedExperience });
  OPTIONAL.numbers.forEach((n) => facts.push({ k: n.label, v: n.value }));
  const creds = [...OPTIONAL.registrations.map((r) => `${r.body} — ${r.detail}`), ...OPTIONAL.affiliations];
  return (
    <section className="trust" aria-labelledby="trust-h">
      <div className="wrap trust__wrap">
        <h2 id="trust-h" className="trust__h">{heading}</h2>
        <dl className="trust__grid">
          {facts.map((f) => (
            <div key={f.k} className="trust__item"><dt>{f.k}</dt><dd>{f.v}</dd>{f.d && <dd className="trust__note">{f.d}</dd>}</div>
          ))}
        </dl>
        <p className="trust__who">Working with individuals, startups, SMEs, corporations and NGOs.</p>
        {creds.length > 0 && (
          <div className="trust__creds"><h3>Registrations and affiliations</h3><ul>{creds.map((c) => <li key={c}>{c}</li>)}</ul></div>
        )}
        {OPTIONAL.industries.length > 0 && (
          <div className="trust__creds"><h3>Industries served</h3><ul className="tags">{OPTIONAL.industries.map((c) => <li key={c}>{c}</li>)}</ul></div>
        )}
        {OPTIONAL.testimonials.length > 0 && (
          <ul className="quotes">
            {OPTIONAL.testimonials.map((t) => (
              <li key={t.name}><blockquote>“{t.quote}”</blockquote><p>{t.name}, {t.role}, {t.company}</p></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/** Renders nothing until real team members are supplied in credentials.ts. */
export function TeamSection({ limit, title = "The people behind your numbers." }: { limit?: number; title?: string } = {}) {
  if (OPTIONAL.team.length === 0) return null;
  const team = limit ? OPTIONAL.team.slice(0, limit) : OPTIONAL.team;
  return (
    <section className="sec" aria-labelledby="team-h">
      <div className="wrap">
        <div className="sec__head"><p className="eyebrow">Leadership and team</p><h2 id="team-h" className="mask-h">{title}</h2></div>
        <ul className="team">
          {team.map((m) => (
            <li key={m.name} className="team__card">
              {m.photo && <Image src={m.photo} alt={`${m.name}, ${m.role} at HMG Group Africa`} width={480} height={480} sizes="(max-width: 700px) 100vw, 320px" className="team__photo" />}
              <h3>{m.name}</h3>
              <p className="team__role">{m.role}</p>
              {m.expertise && <p className="team__x">{m.expertise}</p>}
              {m.qualification && <p className="team__q">{m.qualification}</p>}
              <p>{m.profile}</p>
              {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer">{m.name} on LinkedIn</a>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
