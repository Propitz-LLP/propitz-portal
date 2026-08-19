import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { posts, getPost } from "@/data/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${post.image})` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-brand-dark/70" aria-hidden />
        <div className="container-px relative py-20 sm:py-24">
          <nav className="mb-4 flex items-center gap-2 text-sm text-slate-300">
            <Link href="/" className="hover:text-brand-light">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-brand-light">Blog</Link>
          </nav>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-light">
            {post.date} · {post.author}
          </span>
          <h1 className="mt-3 max-w-3xl text-3xl text-white sm:text-4xl">{post.title}</h1>
        </div>
      </section>

      <article className="section">
        <div className="container-px max-w-3xl">
          <Reveal className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-brand-50">
            <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 768px" priority />
          </Reveal>

          <div className="prose-content max-w-none">
            {post.body.map((block, i) => (
              <Reveal key={i} delay={i * 60}>
                {block.heading && <h2>{block.heading}</h2>}
                {block.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {block.list && (
                  <ul>
                    {block.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>

          <p className="mt-10 rounded-2xl bg-surface p-5 text-xs leading-relaxed text-body ring-1 ring-line">
            This article is informational and does not constitute legal, tax or
            financial advice. Propitz facilitates guidance and coordination and
            connects users with independent professionals.
          </p>
        </div>
      </article>

      {/* More posts */}
      <section className="section bg-surface">
        <div className="container-px">
          <h2 className="text-2xl text-ink">Continue reading</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card group flex overflow-hidden hover:-translate-y-1">
                <div className="relative aspect-square w-32 shrink-0 overflow-hidden bg-brand-50">
                  <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="128px" />
                </div>
                <div className="flex flex-col justify-center p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand">{p.date}</span>
                  <h3 className="mt-1 text-base font-semibold leading-snug text-ink group-hover:text-brand">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
