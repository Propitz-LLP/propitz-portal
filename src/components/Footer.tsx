import Link from "next/link";
import Image from "next/image";
import { site, nav, whatsappHref } from "@/data/site";
import { services } from "@/data/services";
import { IconWhatsApp } from "@/components/Icon";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="dark-grid mt-auto text-slate-300">
      <div className="container-px grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1.2fr_1.2fr]">
        {/* Brand */}
        <div className="lg:pr-8">
          <Link href="/" className="inline-flex items-center">
            <Image src={site.logo} alt="PropITZ" width={478} height={813} className="h-[80px] w-auto lg:h-[100px]" unoptimized />
          </Link>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-slate-400">
            {site.description}
          </p>

          {/* Contact details. The number is WhatsApp only, never a call line. */}
          <div className="mt-7 flex flex-col gap-2.5 text-[15px]">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-white transition-colors hover:text-accent"
            >
              <IconWhatsApp size={16} />
              WhatsApp {site.whatsappDisplay}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-slate-300 transition-colors hover:text-accent"
            >
              {site.email}
            </a>
            <p className="max-w-xs leading-relaxed text-slate-400">{site.address}</p>
          </div>
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

        {/* Newsletter: stored as a lead in Supabase. */}
        <div>
          <h4 className="text-lg font-semibold text-white">Property updates</h4>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-400">
            Occasional guides on registration, documents and property rules in Tamil Nadu.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px py-6 text-center text-sm text-slate-400">
          © 2026 PropITZ, operated by {site.legalEntity}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
