"use client";

import { useState } from "react";
import { whatsappHref } from "@/data/site";
import { regions } from "@/data/regions";
import { useRegion } from "./RegionProvider";
import { IconCheck, IconPin, IconSearch, IconWhatsApp } from "./Icon";

/**
 * Pick a location: type an area or pincode, use the device location, or tap
 * one of the three centres.
 *
 * Anything typed is accepted and shown. If we have no centre there we say
 * so and point at the nearest one — coverage is information, not a failure.
 */
export default function RegionSelector({ showLabel = true }: { showLabel?: boolean }) {
  const { location, centre, status, chooseRegion, detect, search } = useRegion();
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
    setQuery("");
  };

  return (
    <div className="min-w-0">
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        {showLabel && (
          <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
            <IconPin size={13} />
            Your location
          </p>
        )}
        <button
          type="button"
          onClick={detect}
          disabled={status === "locating"}
          className="text-[12px] font-semibold text-brand transition-colors hover:text-brand-dark disabled:opacity-60"
        >
          {status === "locating" ? "Locating…" : "Use my location"}
        </button>
      </div>

      <form onSubmit={submit} className="mb-2.5 flex items-center gap-2">
        <span className="flex min-h-[40px] grow items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 focus-within:border-brand">
          <IconSearch size={15} className="shrink-0 text-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Area or pincode"
            aria-label="Set your location by area name or pincode"
            className="w-full min-w-0 bg-transparent py-2 text-[13px] text-ink placeholder:text-faint focus:outline-none"
          />
        </span>
        <button
          type="submit"
          className="min-h-[40px] shrink-0 rounded-full bg-ink px-4 text-[13px] font-semibold text-white transition-colors hover:bg-navy"
        >
          Set
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5">
        {regions.map((r) => {
          const on = location.served && r.key === centre.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => chooseRegion(r.key)}
              aria-pressed={on}
              className={
                on
                  ? "inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-brand px-4 text-[13px] font-semibold text-white"
                  : "inline-flex min-h-[40px] items-center rounded-full border border-line-strong bg-surface px-4 text-[13px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
              }
            >
              {on && <IconCheck size={13} />}
              {r.name}
            </button>
          );
        })}
      </div>

      {status === "denied" && (
        <p className="mt-2 text-[12px] text-muted">
          We could not read your location — set it above instead.
        </p>
      )}
      {status === "unsupported" && (
        <p className="mt-2 text-[12px] text-muted">
          This browser cannot share a location — set it above instead.
        </p>
      )}

      <div className="mt-2.5 text-[12.5px] leading-[1.5] text-muted">
        <p className="mb-1 text-ink">
          Showing: <b className="font-semibold">{location.label}</b>
        </p>

        {location.served ? (
          centre.address ? (
            <p>
              Walk in: {centre.address}{" "}
              <a
                href={centre.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centre.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand"
              >
                Directions
              </a>
            </p>
          ) : (
            <p className="flex flex-wrap items-center gap-1.5">
              Coordinator support across {centre.name} —
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-brand"
              >
                <IconWhatsApp size={12} />
                message us to arrange
              </a>
            </p>
          )
        ) : (
          <p className="flex flex-wrap items-center gap-1.5">
            No PropITZ centre here yet — nearest is {centre.name}
            {typeof location.km === "number" ? `, about ${location.km} km away` : ""}.
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-brand"
            >
              <IconWhatsApp size={12} />
              Ask us if we can help
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
