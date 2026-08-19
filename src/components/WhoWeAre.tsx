"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { whoWeAre, site, clientAvatars, IMG } from "@/data/site";

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

export default function WhoWeAre() {
  const [active, setActive] = useState(0);
  const item = whoWeAre[active];

  return (
    <div className="mt-10">
      {/* Tabs */}
      <div className="flex flex-col border-b border-line sm:flex-row sm:gap-10">
        {whoWeAre.map((w, i) => (
          <button
            key={w.key}
            type="button"
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 border-b-2 px-1 pb-4 text-[17px] font-semibold transition-colors ${
              i === active
                ? "border-brand text-ink"
                : "border-transparent text-body hover:text-ink"
            }`}
          >
            <Image src={w.icon} alt="" width={22} height={22} className="h-5 w-5" unoptimized />
            {w.tab}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        {/* Left content */}
        <div>
          <h3 className="text-2xl text-ink">{item.heading}</h3>
          <p className="mt-4 max-w-xl leading-relaxed text-body">{item.text}</p>

          <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {item.items.map((it) => (
              <div key={it.label} className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ring-line">
                  <Image src={it.icon} alt="" width={26} height={26} className="h-6 w-6" unoptimized />
                </span>
                <span className="text-[17px] font-semibold leading-tight text-ink">{it.label}</span>
              </div>
            ))}
          </div>

          <div className="my-8 h-px w-full bg-line" />

          <div className="flex flex-wrap items-center gap-8">
            <Link href="/contact-us" className="btn-dark pr-3">
              Contact Us
              <span className="btn-arrow bg-white/15">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0116 0M4 12v3a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zm16 0v3a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2z" />
                </svg>
              </span>
              <div>
                <p className="text-sm text-body">Call Us Now!</p>
                <a href={`tel:${site.phoneDigits}`} className="text-lg font-semibold text-ink">
                  {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right media */}
        <div className="relative grid grid-cols-2 gap-5">
          <div className="relative col-span-1 h-[440px] overflow-hidden rounded-3xl">
            <Image src={`${IMG}/2026/03/9.jpg`} alt="Property facilitation" fill className="object-cover" unoptimized />
          </div>
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {clientAvatars.slice(0, 4).map((a, i) => (
                    <span key={i} className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
                      <Image src={a} alt="" fill className="object-cover" unoptimized />
                    </span>
                  ))}
                </div>
                <span className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-ink">+</span>
              </div>
              <div className="mt-3 flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="mt-2 text-[15px] text-body">Our 5k+ Satisfice Client</p>
            </div>
            <div className="relative h-[240px] overflow-hidden rounded-3xl">
              <Image src={`${IMG}/2026/03/10.jpg`} alt="Client meeting" fill className="object-cover" unoptimized />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Star() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
  );
}
