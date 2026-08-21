"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";
import AuthNav from "@/components/AuthNav";

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="absolute inset-x-0 top-0 z-50 pt-4 sm:pt-6 lg:pt-[60px]">
      <div className="mx-auto w-full px-5 sm:px-8 lg:px-[35px]">
        <div className="flex h-16 items-center justify-between gap-4 rounded-full bg-white px-5 shadow-[0_14px_40px_-18px_rgba(4,6,24,0.28)] sm:h-[74px] sm:px-7 lg:h-[100px] lg:px-9">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src={site.logo}
              alt="Propitz"
              width={150}
              height={44}
              className="h-9 w-auto sm:h-10 lg:h-11"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 text-[15px] font-medium transition-colors ${
                      isActive(item.href) ? "text-brand" : "text-ink hover:text-brand"
                    }`}
                  >
                    {item.label}
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <div className="invisible absolute left-0 top-full w-[24rem] translate-y-3 rounded-2xl bg-brand p-2 opacity-0 shadow-[var(--shadow-card)] ring-1 ring-brand-dark/40 transition-all duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[15px] font-medium transition-colors ${
                    isActive(item.href) ? "text-brand" : "text-ink hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right action */}
          <div className="hidden items-center gap-5 lg:flex">
            <AuthNav />
            <a
              href={site.queryForm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-brand py-2.5 pl-6 pr-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Submit Your Query
              <span className="btn-arrow bg-white/15">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-line lg:hidden"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="container-px lg:hidden">
          <div className="mt-3 space-y-1 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
            {nav.map((item) =>
              item.children ? (
                <div key={item.href}>
                  <button
                    type="button"
                    onClick={() => setServicesOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-ink"
                  >
                    {item.label}
                    <svg className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {servicesOpen && (
                    <div className="ml-3 space-y-1 border-l border-line pl-3">
                      <Link href={item.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-brand">
                        All Services
                      </Link>
                      {item.children.map((c) => (
                        <Link key={c.href} href={c.href} className="block rounded-lg px-3 py-2 text-sm text-body">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive(item.href) ? "text-brand" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-2 border-t border-line pt-2">
              <AuthNav variant="mobile" />
            </div>
            <a
              href={site.queryForm}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-3 w-full justify-center"
            >
              Submit Your Query
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
