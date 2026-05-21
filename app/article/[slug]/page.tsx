import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { getIssueBySlug } from "@/lib/issues";

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
  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }],
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();
  const issue = getIssueBySlug(article.issue);

  return (
    <article>
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
