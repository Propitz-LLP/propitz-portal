import Link from "next/link";

export default function PageHero({
  title,
  subtitle,
  image,
  crumb,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  crumb?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-brand-dark/70" aria-hidden />
      <div className="container-px relative pb-16 pt-32 sm:pb-24 sm:pt-40">
        <nav className="mb-4 flex items-center gap-2 text-sm text-slate-300">
          <Link href="/" className="hover:text-brand-light">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-white">{crumb ?? title}</span>
        </nav>
        <h1 className="max-w-3xl text-4xl text-white sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
