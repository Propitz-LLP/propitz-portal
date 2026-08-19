import Link from "next/link";
import Image from "next/image";
import { site, nav } from "@/data/site";
import { services } from "@/data/services";

export default function Footer() {
  return (
    <footer className="dark-grid mt-auto text-slate-300">
      <div className="container-px grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1.3fr]">
        {/* Brand */}
        <div className="lg:pr-8">
          <Link href="/" className="inline-flex items-center">
            <Image src={site.logo} alt="Propitz" width={160} height={46} className="h-10 w-auto brightness-0 invert" unoptimized />
          </Link>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-slate-400">
            {site.description}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="mt-5 space-y-3.5 text-[15px]">
            {nav
              .filter((n) => n.label !== "Services")
              .map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-slate-400 transition-colors hover:text-accent">
                    {n.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold text-white">Our Services</h4>
          <ul className="mt-5 space-y-3.5 text-[15px]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-slate-400 transition-colors hover:text-accent">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold text-white">Subscribe Newsletter</h4>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-400">
            Subscribe to receive the latest updates, insights, and project news.
          </p>
          <form className="mt-6 flex items-center gap-2 rounded-full bg-white/5 p-1.5 ring-1 ring-white/10">
            <input
              type="email"
              required
              placeholder="Enter Your E-mail"
              className="w-full bg-transparent px-4 py-2 text-[15px] text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-transform hover:scale-105"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px py-6 text-center text-sm text-slate-400">
          © 2026 Propitz.com All Right Reserved. Designed &amp; Developed by{" "}
          <a href={site.developerCredit.url} target="_blank" rel="noopener noreferrer" className="text-brand hover:text-accent">
            {site.developerCredit.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
