import Link from "next/link";
import { getCurrentIssue } from "@/lib/issues";
import { getArticlesByIssue } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default function HomePage() {
  const issue = getCurrentIssue();
  const articles = getArticlesByIssue(issue.slug);

  return (
    <div>
      {/* COVER — Vogue-style centered masthead over a full-bleed image plate */}
      <section className="border-b border-black">
        <div className="relative">
          {/* Cover plate */}
          <div
            aria-hidden
            className="aspect-[4/5] md:aspect-[16/10] w-full bg-black"
          />
          {/* Overlay copy */}
          <div className="absolute inset-0 flex flex-col items-center justify-between text-white py-10 md:py-16 px-6 md:px-12 text-center">
            {/* top metadata */}
            <div className="w-full flex justify-between items-start font-sans text-[10px] uppercase tracking-[0.22em]">
              <span>N° {issue.number}</span>
              <span className="hidden md:block">
                {issue.season} · {issue.year}
              </span>
              <span>€ 18</span>
            </div>

            {/* center stack */}
            <div className="flex flex-col items-center">
              <div className="font-display italic text-[12px] md:text-[14px] tracking-[0.1em] mb-4 md:mb-6">
                — Premier Numéro —
              </div>
              <h2 className="font-display font-medium text-[44px] md:text-[88px] leading-[0.95] tracking-[-0.02em] mb-6 md:mb-10">
                代号 / 距离
              </h2>
              <p className="font-display italic text-[14px] md:text-[18px] leading-[1.4] max-w-[520px]">
                Sur la fabrique des récits — entre Paris et Shanghai, ce que
                le nom transporte, ce que la distance déforme.
              </p>
            </div>

            {/* bottom metadata */}
            <div className="w-full flex justify-between items-end font-sans text-[10px] uppercase tracking-[0.22em]">
              <span>France / Chine</span>
              <Link
                href={`/issue/${issue.slug}`}
                className="hidden md:inline underline underline-offset-4 decoration-1"
              >
                Lire le numéro →
              </Link>
              <span>Printemps 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* EDITOR'S DECK — large italic standfirst, classical fashion-magazine style */}
      <section className="border-b border-black">
        <div className="px-6 md:px-10 py-16 md:py-24 max-w-[920px] mx-auto text-center">
          <div className="font-sans text-[10px] uppercase tracking-[0.22em] mb-8">
            — Édito —
          </div>
          <p className="font-display italic font-medium text-[24px] md:text-[36px] leading-[1.3] tracking-[-0.01em]">
            C33 décode les logiques de l&apos;industrie de la mode et des
            récits de marque,{" "}
            <span className="not-italic font-display font-medium">
              à travers la distance et le lien
            </span>{" "}
            entre la France et la Chine.
          </p>
          <div className="mt-10 max-w-[640px] mx-auto font-serif text-[17px] md:text-[18px] leading-[1.85] text-neutral-700">
            解码时尚产业与品牌叙事的逻辑——
            在中国与法国之间的距离里,在两种凝视、两种翻译、
            两种欲望之间。
          </div>
          <div className="mt-12 font-sans text-[10px] uppercase tracking-[0.22em]">
            — Yifei Zhang, directrice de la publication —
          </div>
        </div>
      </section>

      {/* SOMMAIRE — Table of contents */}
      <section className="border-b border-black">
        <div className="px-6 md:px-10 py-14 md:py-20">
          {/* Section header */}
          <div className="text-center mb-10 md:mb-16">
            <div className="font-sans text-[10px] uppercase tracking-[0.22em] mb-4">
              — Sommaire / 目录 —
            </div>
            <h2 className="font-display text-[42px] md:text-[64px] leading-[1] tracking-[-0.01em]">
              Numéro 01
            </h2>
            <div className="font-display italic mt-4 text-[15px] md:text-[17px]">
              {String(articles.length).padStart(2, "0")} pièces · Printemps 2026
            </div>
          </div>

          {/* Articles list */}
          <div className="max-w-[1100px] mx-auto">
            {articles.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
            {/* placeholders */}
            {Array.from({ length: Math.max(0, 6 - articles.length) }).map(
              (_, i) => {
                const realIdx = articles.length + i;
                const folio = String((realIdx + 1) * 12 + 8).padStart(3, "0");
                return (
                  <div
                    key={`ph-${i}`}
                    className="border-t border-black grid grid-cols-12 gap-3 md:gap-6 py-7 md:py-9 items-baseline opacity-40"
                  >
                    <span className="col-span-2 md:col-span-1 font-display text-[18px] md:text-[22px] italic">
                      {String(realIdx + 1).padStart(2, "0")}.
                    </span>
                    <span className="col-span-10 md:col-span-2 font-sans text-[10px] uppercase tracking-[0.18em]">
                      À paraître
                    </span>
                    <h3 className="col-span-12 md:col-span-6 font-display italic font-medium text-[24px] md:text-[32px] leading-[1.15]">
                      À paraître / 待发布
                    </h3>
                    <span className="col-span-9 md:col-span-2 font-sans text-[11px] uppercase tracking-[0.16em] md:text-right">
                      —
                    </span>
                    <span className="col-span-3 md:col-span-1 font-display text-[14px] text-right">
                      p. {folio}
                    </span>
                  </div>
                );
              },
            )}
            <div className="border-t border-black" />
          </div>
        </div>
      </section>

      {/* SECTIONS — like Vogue's "Features / Agenda" navigation */}
      <section>
        <div className="px-6 md:px-10 py-16 md:py-24 text-center">
          <div className="font-sans text-[10px] uppercase tracking-[0.22em] mb-10">
            — Rubriques —
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-[1000px] mx-auto">
            {[
              { fr: "Édito", cn: "卷首" },
              { fr: "Observations", cn: "观察" },
              { fr: "Entretiens", cn: "对谈" },
              { fr: "Archives", cn: "档案" },
            ].map((r) => (
              <div
                key={r.fr}
                className="border border-black aspect-square flex flex-col items-center justify-center p-4"
              >
                <div className="font-display text-[22px] md:text-[28px] tracking-tight">
                  {r.fr}
                </div>
                <div className="font-serif mt-2 text-[14px]">{r.cn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
