"use client";

import { useState } from "react";
import { saleDeedRates as rates } from "@/data/registrationRates";

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const pct = (f: number) => `${+(f * 100).toFixed(2)}%`;

/**
 * Stamp duty and registration fee for a standard Sale / Conveyance deed in
 * Tamil Nadu. Every rate comes from data/registrationRates.ts.
 */
export default function RegistrationFeeCalculator() {
  const [value, setValue] = useState("5000000");
  const [allWomen, setAllWomen] = useState(false);

  const amount = Number(value);
  const valid = value.trim() !== "" && Number.isFinite(amount) && amount > 0;

  const concession = allWomen && valid && amount <= rates.womenConcessionMaxValue;
  const feeRate = rates.registrationFee - (concession ? rates.womenConcession : 0);
  const stamp = valid ? amount * rates.stampDuty : 0;
  const fee = valid ? amount * feeRate : 0;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-faint">Free tool</p>
      <h2 className="mt-1 text-2xl text-ink">Stamp duty &amp; registration fee calculator</h2>
      <p className="mt-1.5 text-sm text-body">For a standard sale deed (conveyance) in Tamil Nadu.</p>

      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Applicable property value (₹)</span>
        <input
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-mono text-base text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <span className="mt-1.5 block text-[13px] text-muted">
          {valid ? inr(amount) : "Enter the value"} · the value the Sub-Registrar
          applies, usually the higher of the guideline value and the sale price.
        </span>
      </label>

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-body">
        <input
          type="checkbox"
          checked={allWomen}
          onChange={(e) => setAllWomen(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        <span>
          All purchasers are women
          <span className="block text-[13px] text-muted">
            The registration fee falls by {pct(rates.womenConcession)} for properties
            valued up to {inr(rates.womenConcessionMaxValue)}, subject to the notification conditions.
          </span>
        </span>
      </label>

      <dl className="mt-5 overflow-hidden rounded-2xl ring-1 ring-line">
        <div className="flex items-baseline justify-between gap-3 bg-surface px-4 py-3">
          <dt className="text-sm text-body">Stamp duty ({pct(rates.stampDuty)})</dt>
          <dd className="font-mono text-[15px] font-medium text-ink">{inr(stamp)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-line bg-surface px-4 py-3">
          <dt className="text-sm text-body">
            Registration fee ({pct(feeRate)})
            {concession && <span className="ml-2 rounded-full bg-ok-50 px-2 py-0.5 text-[11px] font-semibold text-ok-ink">women concession</span>}
          </dt>
          <dd className="font-mono text-[15px] font-medium text-ink">{inr(fee)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-line bg-brand-50 px-4 py-3.5">
          <dt className="font-semibold text-ink">Estimated total</dt>
          <dd className="font-mono text-lg font-semibold text-brand-dark">{inr(stamp + fee)}</dd>
        </div>
      </dl>

      {allWomen && valid && !concession && (
        <p className="mt-3 text-[13px] text-muted">
          The concession applies only up to {inr(rates.womenConcessionMaxValue)}, so the standard fee is shown.
        </p>
      )}

      <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
        An estimate, subject to current Government rules. It covers stamp duty and
        registration fee only, not other charges. Rates last checked {rates.checked}.
        Source: {rates.source}. Always confirm on TNREGINET or with the Sub-Registrar
        before you pay.
      </p>
    </div>
  );
}
