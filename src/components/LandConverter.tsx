"use client";

import { useState } from "react";

/**
 * Land area converter.
 *
 * Only units with a fixed, standard definition are offered. Hectares and
 * ares are included because Tamil Nadu Patta and Chitta records state extent
 * in them. Local units whose size varies by district, such as the kuzhi,
 * are deliberately left out: a wrong conversion here would mislead someone
 * comparing a real listing.
 */
const UNITS = [
  { key: "sqft", label: "Square feet", short: "sq ft", sqft: 1 },
  { key: "sqm", label: "Square metres", short: "sq m", sqft: 10.7639104 },
  { key: "sqyd", label: "Square yards", short: "sq yd", sqft: 9 },
  { key: "cent", label: "Cents", short: "cent", sqft: 435.6 },
  { key: "ground", label: "Grounds", short: "ground", sqft: 2400 },
  { key: "are", label: "Ares", short: "are", sqft: 1076.39104 },
  { key: "acre", label: "Acres", short: "acre", sqft: 43560 },
  { key: "hectare", label: "Hectares", short: "ha", sqft: 107639.104 },
] as const;

type UnitKey = (typeof UNITS)[number]["key"];

function format(n: number) {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  const digits = abs >= 1000 ? 0 : abs >= 1 ? 2 : 4;
  return n.toLocaleString("en-IN", { maximumFractionDigits: digits });
}

export default function LandConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState<UnitKey>("ground");

  const amount = Number(value);
  const valid = value.trim() !== "" && Number.isFinite(amount) && amount >= 0;
  const base = UNITS.find((u) => u.key === from)!;
  const sqft = valid ? amount * base.sqft : NaN;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-faint">
        Free tool
      </p>
      <h2 className="mt-1 text-2xl text-ink">Land area converter</h2>

      <div className="mt-5 flex flex-wrap gap-3">
        <label className="min-w-0 grow basis-40">
          <span className="sr-only">Area</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-mono text-base text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="grow basis-40 sm:grow-0">
          <span className="sr-only">Unit</span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value as UnitKey)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:w-48"
          >
            {UNITS.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!valid && (
        <p className="mt-3 text-sm text-red-700">Enter an area of zero or more.</p>
      )}

      <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2">
        {UNITS.filter((u) => u.key !== from).map((u) => (
          <div key={u.key} className="flex items-baseline justify-between gap-3 bg-surface px-4 py-3">
            <dt className="text-sm text-body">{u.label}</dt>
            <dd className="font-mono text-[15px] font-medium text-ink">
              {format(sqft / u.sqft)} <span className="text-xs text-muted">{u.short}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        Standard definitions: 1 ground = 2,400 sq ft, 1 cent = 435.6 sq ft,
        1 acre = 100 cents, 1 hectare = 100 ares. Local units such as the
        kuzhi vary by district and are not included. Always confirm the extent
        against the survey records.
      </p>
    </div>
  );
}
