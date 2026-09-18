"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";
import { requestHref } from "@/data/leads";
import { freeTools, servicesDetail } from "@/data/home";
import { propertyTypes } from "@/data/marketplace";
import AuthNav from "@/components/AuthNav";
// --- Location picker (disabled) ----------------------------------------
// The location pill and its picker are commented out of the header rather
// than deleted, so they can be switched back on. To re-enable: restore
// these imports and the two blocks marked below (the desktop pill in the
// main bar, and the picker in the mobile drawer). The components
// themselves are untouched in src/components/, and RegionProvider still
// powers the read-only <RegionLine /> on the home hero.
// import RegionSelector from "@/components/RegionSelector";
// import RegionBadge from "@/components/RegionBadge";
// -----------------------------------------------------------------------
import {
  IconArrow,
  IconCheck,
  IconChevron,
  IconClose,
  IconMenu,
  IconPerson,
  IconScreen,
} from "@/components/Icon";

const simpleNav = [
  { label: "Marketplace", href: "/property-marketplace" },
  { label: "Contact", href: "/contact-us" },
  { label: "About", href: "/about-us" },
];

/**
 * In-flow header with a mega-menu.
 *
 * The menu is what keeps every service within two clicks of any page:
 * open Services, pick one. It carries all eight services, the marketplace
 * entry points and the free tools in a single panel.
 */
export default function Header() {
  const pathname = usePathname();

  // Menus are tied to the path they were opened on, so a route change
  // closes them without a state-setting effect.
  const [drawerFor, setDrawerFor] = useState<string | null>(null);
  const [megaFor, setMegaFor] = useState<string | null>(null);
  const drawerOpen = drawerFor === pathname;
  const megaOpen = megaFor === pathname;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="relative z-50">
      {/* main bar */}
      <div className="border-b border-line bg-bg">
        <div className="container-px flex h-[96px] items-center gap-6 lg:h-[120px]">
          <Link href="/" aria-label="PropITZ home" className="shrink-0">
            <Image src={site.logo} alt="PropITZ" width={478} height={813} className="h-[80px] w-auto lg:h-[100px]" priority />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <button
              type="button"
              aria-expanded={megaOpen}
              onClick={() => setMegaFor(megaOpen ? null : pathname)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                megaOpen || isActive("/services")
                  ? "bg-brand-50 font-semibold text-brand"
                  : "text-body hover:bg-bg-alt hover:text-ink"
              }`}
            >
              Services
              <IconChevron size={11} className={megaOpen ? "rotate-180" : ""} />
            </button>
            {simpleNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive(n.href)
                    ? "bg-brand-50 font-semibold text-brand"
                    : "font-medium text-body hover:bg-bg-alt hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            {/*
              Location pill (disabled). Restore the import above to re-enable.
              <RegionBadge className="hidden sm:block" />
            */}
            <div className="hidden lg:block">
              <AuthNav />
            </div>
            <Link
              href={requestHref()}
              className="hidden items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:inline-flex"
            >
              Start a Request
              <IconArrow size={15} />
            </Link>
            <button
              type="button"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerFor(drawerOpen ? null : pathname)}
              className="grid h-[46px] w-[46px] place-items-center rounded-xl border border-line-strong text-ink lg:hidden"
            >
              {drawerOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* desktop mega-menu */}
      {megaOpen && (
        <div className="absolute inset-x-0 top-full hidden lg:block">
          <div className="container-px">
            <div className="mt-3 rounded-3xl border border-line bg-surface p-7 shadow-[var(--shadow-pop)]">
              <div className="grid grid-cols-[2.15fr_1fr_1fr] gap-8">
                <div>
                  <p className="mb-3.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
                    Property services
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {servicesDetail.map((s) => (
                      <Link
                        key={s.n}
                        href={s.href}
                        onClick={() => setMegaFor(null)}
                        className="flex gap-3 rounded-[10px] px-2.5 py-2 transition-colors hover:bg-bg-alt"
                      >
                        <span className="pt-0.5 font-mono text-[11.5px] text-faint">{s.n}</span>
                        <span>
                          <span className="block text-[13.5px] font-semibold leading-[1.35] text-ink">
                            {s.title}
                          </span>
                          <span className="ta block text-xs text-muted">{s.ta}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-l border-line pl-8">
                  <p className="mb-3.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
                    Marketplace
                  </p>
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href="/property-marketplace"
                      onClick={() => setMegaFor(null)}
                      className="rounded-[10px] bg-accent-50 px-2.5 py-2 text-[13.5px] font-semibold text-ink"
                    >
                      Browse all listings
                    </Link>
                    {propertyTypes
                      .filter((t) => t.key !== "all")
                      .map((t) => (
                        <Link
                          key={t.key}
                          href="/property-marketplace"
                          onClick={() => setMegaFor(null)}
                          className="rounded-[10px] px-2.5 py-2 text-[13.5px] text-body transition-colors hover:bg-bg-alt hover:text-brand"
                        >
                          {t.label}
                        </Link>
                      ))}
                    <Link
                      href="/property-marketplace"
                      onClick={() => setMegaFor(null)}
                      className="flex items-center gap-1.5 rounded-[10px] px-2.5 py-2 text-[13.5px] font-semibold text-ok"
                    >
                      <IconCheck size={14} />
                      Verified only
                    </Link>
                  </div>
                </div>

                <div className="border-l border-line pl-8">
                  <p className="mb-3.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
                    Free tools
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {freeTools.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        onClick={() => setMegaFor(null)}
                        className="rounded-[10px] px-2.5 py-2 text-[13.5px] text-body transition-colors hover:bg-bg-alt hover:text-brand"
                      >
                        {t.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-line pt-4">
                    <p className="mb-2.5 text-[13px] text-muted">Not sure where to start?</p>
                    <Link
                      href="/contact-us"
                      onClick={() => setMegaFor(null)}
                      className="btn-dark w-full justify-center gap-2 py-3 text-[13.5px]"
                    >
                      Tell us what you need
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3.5 border-t border-line pt-5">
                <span className="flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-2 text-[13px] font-semibold text-brand">
                  <IconScreen size={16} />
                  Every service can be started online
                </span>
                <span className="flex items-center gap-2 rounded-full bg-accent-50 px-3.5 py-2 text-[13px] font-semibold text-accent-deep">
                  <IconPerson size={16} />
                  and finished with a coordinator beside you
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* mobile drawer */}
      {drawerOpen && (
        <div className="border-b border-line bg-bg lg:hidden">
          <div className="container-px py-5">
            <p className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.09em] text-faint">
              Property services
            </p>
            <div className="mb-6 flex flex-col gap-0.5">
              {servicesDetail.map((s) => (
                <Link
                  key={s.n}
                  href={s.href}
                  onClick={() => setDrawerFor(null)}
                  className="flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-1.5 transition-colors hover:bg-bg-alt"
                >
                  <span className="font-mono text-xs text-faint">{s.n}</span>
                  <span>
                    <span className="block text-sm font-semibold leading-[1.3] text-ink">
                      {s.title}
                    </span>
                    <span className="ta block text-xs text-muted">{s.ta}</span>
                  </span>
                </Link>
              ))}
            </div>

            <p className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.09em] text-faint">
              Marketplace
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              <Link
                href="/property-marketplace"
                onClick={() => setDrawerFor(null)}
                className="inline-flex min-h-[44px] items-center rounded-full border border-accent bg-accent-50 px-4 text-[13px] font-semibold text-accent-deep"
              >
                Browse all
              </Link>
              {propertyTypes
                .filter((t) => t.key !== "all")
                .map((t) => (
                  <Link
                    key={t.key}
                    href="/property-marketplace"
                    onClick={() => setDrawerFor(null)}
                    className="chip-filter"
                  >
                    {t.label}
                  </Link>
                ))}
            </div>

            <p className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.09em] text-faint">
              Free tools
            </p>
            <div className="mb-6 flex flex-col gap-0.5">
              {freeTools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  onClick={() => setDrawerFor(null)}
                  className="flex min-h-[48px] items-center rounded-xl px-3 text-sm text-body transition-colors hover:bg-bg-alt"
                >
                  {t.label}
                </Link>
              ))}
            </div>

            <div className="mb-6 flex flex-col gap-0.5 border-t border-line pt-4">
              {simpleNav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setDrawerFor(null)}
                  className="flex min-h-[48px] items-center rounded-xl px-3 text-[15px] font-semibold text-ink transition-colors hover:bg-bg-alt"
                >
                  {n.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <AuthNav variant="mobile" />
              </div>
            </div>

            {/*
              Location picker (disabled). Restore the import above to re-enable.
              <div className="mb-5 rounded-2xl border border-line bg-surface p-4">
                <RegionSelector />
              </div>
            */}

            <div className="mb-5 rounded-2xl border border-line bg-surface p-4">
              <div className="mb-2 flex items-center gap-2.5">
                <IconScreen size={17} className="text-brand" />
                <IconPerson size={17} className="text-accent-dark" />
                <p className="text-[13.5px] font-bold text-ink">Online, then in person</p>
              </div>
              <p className="text-[13px] leading-[1.5] text-body">
                Start any service here. Meet us at our office in Perungudi, Chennai
                when the step needs a person.
              </p>
            </div>

            <Link
              href={requestHref()}
              onClick={() => setDrawerFor(null)}
              className="btn-primary w-full justify-center gap-3 py-3.5 text-[15px]"
            >
              Start a Request
              <IconArrow size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
