"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { designs } from "@/data/designs";

/**
 * Floating control shown on every /designs page so you can hop between the
 * five designs (or back to the gallery / live site). The gallery embeds each
 * design in an <iframe> with `?preview=1`, which hides this control so the
 * thumbnails stay clean.
 */
export default function DesignSwitcher() {
  const pathname = usePathname();
  const isPreview = useSearchParams().get("preview") === "1";

  if (isPreview) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex justify-center px-3">
      <div className="pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/15 bg-slate-900/85 p-1.5 pl-2 text-sm text-white shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
        <Link
          href="/designs"
          className={`shrink-0 rounded-full px-3 py-1.5 font-medium transition-colors ${
            pathname === "/designs"
              ? "bg-white text-slate-900"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          Gallery
        </Link>
        <span className="mx-1 h-4 w-px shrink-0 bg-white/15" />
        {designs.map((d) => {
          const active = pathname === `/designs/${d.slug}`;
          return (
            <Link
              key={d.slug}
              href={`/designs/${d.slug}`}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-medium transition-colors ${
                active ? "bg-white text-slate-900" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full ring-1 ring-white/30"
                style={{
                  background: `linear-gradient(135deg, ${d.swatch[0]}, ${
                    d.swatch[d.swatch.length - 1]
                  })`,
                }}
              />
              {d.name}
            </Link>
          );
        })}
        <span className="mx-1 h-4 w-px shrink-0 bg-white/15" />
        <Link
          href="/"
          className="shrink-0 rounded-full px-3 py-1.5 font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          Exit ↗
        </Link>
      </div>
    </div>
  );
}
