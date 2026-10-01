import Image from "next/image";
import { OPTIONAL, VERIFIED } from "@/lib/hmg/credentials";

/** Verified facts plus optional credentials; anything empty is simply not rendered. */
export function TrustFacts({ heading = "The facts behind HMG" }: { heading?: string }) {
  const facts: { k: string; v: string; d: string }[] = [
    { k: "Established", v: String(VERIFIED.founded), d: "Founded in Nairobi" },
    { k: "Office", v: "Nairobi", d: VERIFIED.office },
    { k: "Services", v: `${VERIFIED.serviceLines} service lines`, d: "Tax, accounting, audit support, advisory, payroll and health checks" },
    { k: "Who we serve", v: "Individuals to NGOs", d: VERIFIED.audiences.join(", ") },
  ];
  if (OPTIONAL.combinedExperience) facts.push({ k: "Team experience", v: OPTIONAL.combinedExperience, d: "Combined professional experience" });
  if (OPTIONAL.geographicReach) facts.push({ k: "Reach", v: OPTIONAL.geographicReach, d: "Where we actively serve clients" });
  OPTIONAL.numbers.forEach((n) => facts.push({ k: n.label, v: n.value, d: "" }));

  const creds = [...OPTIONAL.registrations.map((r) => `${r.body} — ${r.detail}`), ...OPTIONAL.affiliations];
  return (
    <section className="trust" aria-labelledby="trust-h">
      <div className="wrap">
        <h2 id="trust-h" className="trust__h">{heading}</h2>
        <dl className="trust__grid">
          {facts.map((f) => (
            <div key={f.k} className="trust__item"><dt>{f.k}</dt><dd>{f.v}</dd>{f.d && <p>{f.d}</p>}</div>
          ))}
        </dl>
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
export function TeamSection() {
  if (OPTIONAL.team.length === 0) return null;
  return (
    <section className="sec" aria-labelledby="team-h">
      <div className="wrap">
        <div className="sec__head"><p className="eyebrow">Leadership and team</p><h2 id="team-h" className="mask-h">The people behind your numbers.</h2></div>
        <ul className="team">
          {OPTIONAL.team.map((m) => (
            <li key={m.name} className="team__card">
              {m.photo && <Image src={m.photo} alt={`${m.name}, ${m.role} at HMG Group Africa`} width={480} height={480} sizes="(max-width: 700px) 100vw, 320px" className="team__photo" />}
              <h3>{m.name}</h3>
              <p className="team__role">{m.role}</p>
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
