import type { Metadata } from "next";
import { pageMeta } from "@/lib/hmg/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverArt } from "@/components/hmg/CoverArt";
import { WhatsAppIcon } from "@/components/hmg/Logo";
import { ShareActions } from "@/components/hmg/ShareActions";
import { Breadcrumbs, CtaBand, InsightCard, JsonLd } from "@/components/hmg/ui";
import { ARTICLE_AUTHOR, ARTICLES, formatDate, getArticle, relatedArticles, servicesForArticle } from "@/lib/hmg/content";
import { abs, CONSULT_HREF, ROUTES, SITE, whatsappLink } from "@/lib/hmg/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  const url = ROUTES.article(a.slug);
  return { ...pageMeta({ title: a.title, description: a.summary, path: url, type: "article", publishedTime: a.published }), authors: [{ name: ARTICLE_AUTHOR }] };
}

export default async function ArticlePage({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const url = ROUTES.article(a.slug);
  const related = relatedArticles(a.slug, 3);
  const svc = servicesForArticle(a.slug)[0];
  const crumbs = [{ name: "Home", href: ROUTES.home }, { name: "Insights", href: ROUTES.insights }, { name: a.title, href: url }];
  return (
    <article className="post">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.summary,
          datePublished: a.published,
          dateModified: a.published,
          articleSection: a.category,
          author: { "@type": "Organization", name: ARTICLE_AUTHOR, url: abs(ROUTES.about) },
          publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: abs("/hmg/logo.svg") } },
          mainEntityOfPage: abs(url),
          image: abs("/hmg/og.png"),
        }}
      />
      <header className="post__head wrap">
        <Breadcrumbs items={crumbs} />
        <p className="meta">
          <span className="meta__cat">{a.category}</span>
          <span aria-hidden="true">·</span>
          <span>{a.readTime} min read</span>
        </p>
        <h1 className="post__h">{a.title}</h1>
        <p className="post__lead">{a.summary}</p>
        <p className="post__by">
          By <strong>{ARTICLE_AUTHOR}</strong> · Published <time dateTime={a.published}>{formatDate(a.published)}</time>
        </p>
      </header>
      <div className="wrap post__cover" role="img" aria-label={`Editorial illustration for: ${a.title}`}>
        <CoverArt kind={a.kind} />
      </div>
      <div className="wrap post__grid">
        <div className="post__body">
          {a.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </section>
          ))}
          <aside className="post__take" aria-labelledby="take-h">
            <h2 id="take-h">Key takeaways</h2>
            <ul>{a.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
          </aside>
          <ShareActions url={abs(url)} title={a.title} />
          <p className="disclaimer">This article is general guidance only and is not individual tax, legal or accounting advice. Rules change; confirm your position with an HMG consultant before acting.</p>
        </div>
        <aside className="post__side" aria-label="Talk to HMG">
          <div className="post__cta">
            <h2>Talk this through with HMG</h2>
            <p>Bring your own numbers. We will show you what they mean and what to do next.</p>
            <Link href={CONSULT_HREF} className="btn btn--primary btn--block">Request a Consultation</Link>
            <a href={whatsappLink(`Hello HMG, I read "${a.title}" and would like to talk.`)} className="btn btn--ghost-light btn--block" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp HMG</a>
            {svc && <Link href={ROUTES.service(svc.slug)} className="post__svc">Related service: {svc.title} →</Link>}
          </div>
        </aside>
      </div>
      <section className="sec sec--tight" aria-labelledby="more-h">
        <div className="wrap">
          <h2 id="more-h" className="subh">Related articles</h2>
          <ul className="igrid">{related.map((r, i) => <InsightCard key={r.slug} a={r} i={i} />)}</ul>
        </div>
      </section>
      <CtaBand />
    </article>
  );
}
