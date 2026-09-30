import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverArt } from "@/components/hmg/CoverArt";
import { ARTICLES, getArticle } from "@/lib/hmg/content";
import { CONSULT_HREF, SITE, whatsappLink } from "@/lib/hmg/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  const url = `/hmg/insights/${a.slug}`;
  return {
    title: a.title,
    description: a.summary,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: a.title, description: a.summary },
  };
}

export default async function ArticlePage({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const related = ARTICLES.filter((x) => x.slug !== a.slug && (x.category === a.category || x.kind !== a.kind)).slice(0, 2);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.summary,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/hmg/insights/${a.slug}`,
  };
  return (
    <article className="post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <header className="post__head wrap">
        <nav aria-label="Breadcrumb" className="post__crumb">
          <Link href="/hmg#insights">← All insights</Link>
        </nav>
        <p className="art__meta">
          <span className="art__cat">{a.category}</span>
          <span aria-hidden="true">·</span>
          <span>{a.readTime} min read</span>
        </p>
        <h1 className="post__h">{a.title}</h1>
        <p className="post__lead">{a.summary}</p>
      </header>
      <div className="wrap post__cover" role="img" aria-label={`Editorial illustration for: ${a.title}`}>
        <CoverArt kind={a.kind} />
      </div>
      <div className="wrap post__grid">
        <div className="post__body">
          {a.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}
          <aside className="post__take" aria-labelledby="take-h">
            <h2 id="take-h">Key takeaways</h2>
            <ul>
              {a.takeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </aside>
          <p className="fine">General guidance only, not individual tax, legal or accounting advice. Regulations change; confirm your position with an HMG consultant.</p>
        </div>
        <aside className="post__side">
          <div className="post__cta">
            <h2>Talk this through with HMG</h2>
            <p>Bring your own numbers. We will show you what they mean and what to do next.</p>
            <Link href={CONSULT_HREF} className="btn btn--primary btn--block">Book a Consultation</Link>
            <a href={whatsappLink(`Hello HMG, I read "${a.title}" and would like to talk.`)} className="btn btn--ghost-light btn--block" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
          </div>
        </aside>
      </div>
      <section className="wrap post__more" aria-labelledby="more-h">
        <h2 id="more-h">Keep reading</h2>
        <ul className="post__more-list">
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/hmg/insights/${r.slug}`}>
                <span className="art__cat">{r.category} · {r.readTime} min</span>
                <span className="post__more-t">{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
