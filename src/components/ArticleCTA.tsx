import Link from "next/link";
import { articleCtas, fallbackCta } from "@/data/articleCtas";
import { IconArrow } from "@/components/Icon";

/** The service that solves what the article just explained. */
export default function ArticleCTA({ slug }: { slug: string }) {
  const cta = articleCtas[slug] ?? fallbackCta;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-5 rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100 sm:p-7">
      <div className="min-w-0 grow basis-72">
        <p className="text-lg font-bold text-ink">{cta.question}</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-body">{cta.text}</p>
      </div>
      <Link href={cta.href} className="btn-primary shrink-0 gap-3 py-3.5 text-[15px]">
        {cta.action}
        <IconArrow size={16} />
      </Link>
    </div>
  );
}
