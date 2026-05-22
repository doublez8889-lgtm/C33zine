import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByIssue,
} from "@/lib/articles";
import { getIssueBySlug } from "@/lib/issues";
import ArticleCard from "@/components/ArticleCard";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  const url = `/article/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }],
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      section: article.category,
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();
  const issue = getIssueBySlug(article.issue);
  const relatedArticles = getArticlesByIssue(article.issue)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    inLanguage: "zh-CN",
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "C33",
      url: "https://c33zine.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://c33zine.com/article/${article.slug}`,
    },
    articleSection: article.category,
    isPartOf: issue
      ? {
          "@type": "PublicationIssue",
          issueNumber: issue.number,
          datePublished: `${issue.year}`,
          isPartOf: {
            "@type": "Periodical",
            name: "C33",
            issn: undefined,
          },
        }
      : undefined,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Folio header — like a printed running header */}
      <div className="border-b border-black">
        <div className="px-4 md:px-8 h-9 flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.18em]">
          <Link
            href={`/issue/${article.issue}`}
            className="hover:underline underline-offset-4"
          >
            C33 — Issue N° {article.issue}
          </Link>
          <span className="hidden md:inline font-display italic normal-case tracking-normal">
            {article.category}
          </span>
          <span>
            {issue ? `${issue.season} ${issue.year}` : ""}
          </span>
        </div>
      </div>

      {/* Title block — centered, Vogue-style */}
      <header className="px-6 md:px-10 pt-16 md:pt-24 pb-12 md:pb-16 text-center border-b border-black">
        <div className="max-w-[820px] mx-auto">
          <div className="font-sans text-[10px] uppercase tracking-[0.22em] mb-6">
            — {article.category} —
          </div>
          <h1 className="font-display font-medium text-[40px] md:text-[72px] leading-[1.02] tracking-[-0.02em] mb-8 md:mb-10">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="font-display italic text-[20px] md:text-[24px] leading-[1.4] max-w-[640px] mx-auto mb-10">
              {article.excerpt}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-sans text-[11px] uppercase tracking-[0.18em]">
            <span>Par {article.author}</span>
            {article.date && <span>· {article.date}</span>}
            {issue && (
              <span>
                · {issue.season} {issue.year}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="px-6 md:px-10 py-12 md:py-20">
        <div className="max-w-prose mx-auto prose-c33">
          <MDXRemote source={article.content} />
        </div>
      </div>

      {/* Continuer la lecture — same-issue articles, for internal linking */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-black px-6 md:px-10 py-12 md:py-16">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <div className="font-sans text-[10px] uppercase tracking-[0.22em] mb-2">
                — Continuer la lecture / 继续阅读 —
              </div>
              {issue && (
                <div className="font-display italic text-[15px] text-neutral-600">
                  Dans le numéro {issue.number} · {issue.season} {issue.year}
                </div>
              )}
            </div>
            {relatedArticles.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
            <div className="border-t border-black" />
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="px-6 md:px-10 pb-16 border-t border-black pt-8">
        <div className="max-w-prose mx-auto flex justify-between items-baseline">
          <Link
            href={`/issue/${article.issue}`}
            className="font-sans text-[11px] uppercase tracking-[0.18em] hover:underline underline-offset-4"
          >
            ← Retour au sommaire
          </Link>
          <span className="font-display italic text-[14px]">返回当期目录</span>
        </div>
      </div>
    </article>
  );
}
