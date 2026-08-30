"use client";

import { useEffect, useRef, useState } from "react";
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  findCountry,
  isValidMobile,
  mobileError,
} from "@/lib/phone";
import { field, fieldError } from "./fieldClass";

/**
 * Country selector + national number input, posting `country` and `mobile`.
 * Shared by the register and profile forms so both validate identically.
 *
 * The error only appears once something has been typed, and `onInvalidChange`
 * lets the parent disable its submit button while the number is malformed.
 */
export default function MobileField({
  defaultCountry = DEFAULT_COUNTRY,
  defaultValue = "",
  onInvalidChange,
}: {
  defaultCountry?: string;
  defaultValue?: string;
  onInvalidChange?: (invalid: boolean) => void;
}) {
  const [country, setCountry] = useState(defaultCountry);
  const [mobile, setMobile] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Re-seed from the props whenever the saved values change — i.e. after a
  // successful save, so the field shows what the server actually stored
  // (normalised) rather than the text that was typed. Adjusting state during
  // render is React's documented alternative to a remount here; remounting a
  // controlled <select> mid-action can leave its DOM value on the wrong
  // option, which would misreport the user's saved country.
  const [seed, setSeed] = useState({ country: defaultCountry, mobile: defaultValue });
  if (seed.country !== defaultCountry || seed.mobile !== defaultValue) {
    setSeed({ country: defaultCountry, mobile: defaultValue });
    setCountry(defaultCountry);
    setMobile(defaultValue);
  }

  // React can leave a controlled <select> sitting on a stale option when the
  // surrounding tree is re-rendered by a server action, which would show the
  // user a different country from the one actually saved — and submit it on
  // the next save. Assert the DOM value against state after every render.
  useEffect(() => {
    const el = selectRef.current;
    if (el && el.value !== country) el.value = country;
  });

  const invalid = mobile.length > 0 && !isValidMobile(mobile, country);
  const selected = findCountry(country);

  // Mirror the check into native form validity so the browser blocks
  // submission too (including via the Enter key), not just the button.
  const sync = (value: string, iso: string) => {
    const bad = value.length > 0 && !isValidMobile(value, iso);
    inputRef.current?.setCustomValidity(bad ? mobileError(iso) : "");
    onInvalidChange?.(bad);
  };

  const placeholder =
    selected.min === selected.max
      ? `${selected.min} digits`
      : `${selected.min}–${selected.max} digits`;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        Mobile Number
      </label>
      <div className="flex items-stretch">
        <select
          ref={selectRef}
          name="country"
          aria-label="Country dialling code"
          className="w-[7.5rem] shrink-0 rounded-l-xl border border-r-0 border-line bg-slate-50 px-2 py-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            sync(mobile, e.target.value);
          }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.iso} +{c.dial}
            </option>
          ))}
        </select>
        <input
          ref={inputRef}
          name="mobile"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel-national"
          aria-invalid={invalid}
          className={`${field} rounded-l-none ${invalid ? fieldError : ""}`}
          placeholder={placeholder}
          value={mobile}
          onChange={(e) => {
            // Keep only phone-ish characters so the field can't drift far
            // from what we accept; the shared validator has the final say.
            const next = e.target.value.replace(/[^\d\s+()-]/g, "");
            setMobile(next);
            sync(next, country);
          }}
        />
      </div>
      {invalid && (
        <p className="mt-1.5 text-sm text-red-600">{mobileError(country)}</p>
      )}
    </div>
  );
}
