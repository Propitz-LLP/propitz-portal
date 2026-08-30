/* ------------------------------------------------------------------ */
/*  International mobile number helpers                               */
/*  Shared by the register form (instant feedback) and the sign-up     */
/*  server action (the actual validation boundary).                    */
/*                                                                     */
/*  Numbers are stored in E.164 ("+971501234567") so they are portable */
/*  and unambiguous; the UI splits them into country + national parts. */
/* ------------------------------------------------------------------ */

export type Country = {
  /** ISO 3166-1 alpha-2 code — the stable key we store against. */
  iso: string;
  name: string;
  /** Dial code without the leading "+". */
  dial: string;
  /** Valid length range for the national (subscriber) part. */
  min: number;
  max: number;
  /** Optional digit grouping, used for display only. */
  groups?: number[];
  /**
   * Optional regex character class for the first digit of a mobile number,
   * e.g. "[6-9]" for India. Set only where the allocation is well known and
   * stable — omitted countries are validated on length alone.
   */
  starts?: string;
};

/**
 * India first (the primary market), then the countries NRI buyers actually
 * call from, then the rest alphabetically. Lengths are for the national
 * part, excluding the dial code.
 */
export const COUNTRIES: Country[] = [
  { iso: "IN", name: "India", dial: "91", min: 10, max: 10, groups: [5, 5], starts: "[6-9]" },
  { iso: "AE", name: "United Arab Emirates", dial: "971", min: 8, max: 9, groups: [2, 3, 4], starts: "5" },
  { iso: "SA", name: "Saudi Arabia", dial: "966", min: 8, max: 9, groups: [2, 3, 4], starts: "5" },
  { iso: "US", name: "United States", dial: "1", min: 10, max: 10, groups: [3, 3, 4], starts: "[2-9]" },
  { iso: "GB", name: "United Kingdom", dial: "44", min: 9, max: 10, groups: [4, 6], starts: "7" },
  { iso: "SG", name: "Singapore", dial: "65", min: 8, max: 8, groups: [4, 4], starts: "[89]" },
  { iso: "AU", name: "Australia", dial: "61", min: 9, max: 9, groups: [3, 3, 3], starts: "4" },
  { iso: "CA", name: "Canada", dial: "1", min: 10, max: 10, groups: [3, 3, 4], starts: "[2-9]" },
  { iso: "QA", name: "Qatar", dial: "974", min: 8, max: 8, groups: [4, 4], starts: "[3567]" },
  { iso: "KW", name: "Kuwait", dial: "965", min: 8, max: 8, groups: [4, 4], starts: "[569]" },
  { iso: "OM", name: "Oman", dial: "968", min: 8, max: 8, groups: [4, 4], starts: "[79]" },
  { iso: "BH", name: "Bahrain", dial: "973", min: 8, max: 8, groups: [4, 4], starts: "[3]" },
  { iso: "MY", name: "Malaysia", dial: "60", min: 9, max: 10 },
  { iso: "NZ", name: "New Zealand", dial: "64", min: 8, max: 10, starts: "2" },
  { iso: "AR", name: "Argentina", dial: "54", min: 10, max: 11 },
  { iso: "AT", name: "Austria", dial: "43", min: 7, max: 12 },
  { iso: "BD", name: "Bangladesh", dial: "880", min: 10, max: 10, starts: "1" },
  { iso: "BE", name: "Belgium", dial: "32", min: 8, max: 9, starts: "4" },
  { iso: "BR", name: "Brazil", dial: "55", min: 10, max: 11 },
  { iso: "CH", name: "Switzerland", dial: "41", min: 9, max: 9, starts: "7" },
  { iso: "CL", name: "Chile", dial: "56", min: 9, max: 9 },
  { iso: "CN", name: "China", dial: "86", min: 11, max: 11, starts: "1" },
  { iso: "CO", name: "Colombia", dial: "57", min: 10, max: 10 },
  { iso: "CZ", name: "Czechia", dial: "420", min: 9, max: 9 },
  { iso: "DE", name: "Germany", dial: "49", min: 7, max: 11, starts: "1" },
  { iso: "DK", name: "Denmark", dial: "45", min: 8, max: 8 },
  { iso: "EG", name: "Egypt", dial: "20", min: 9, max: 10, starts: "1" },
  { iso: "ES", name: "Spain", dial: "34", min: 9, max: 9, starts: "[67]" },
  { iso: "FI", name: "Finland", dial: "358", min: 6, max: 10 },
  { iso: "FJ", name: "Fiji", dial: "679", min: 7, max: 7 },
  { iso: "FR", name: "France", dial: "33", min: 9, max: 9, starts: "[67]" },
  { iso: "HK", name: "Hong Kong", dial: "852", min: 8, max: 8, groups: [4, 4], starts: "[569]" },
  { iso: "ID", name: "Indonesia", dial: "62", min: 9, max: 12, starts: "8" },
  { iso: "IE", name: "Ireland", dial: "353", min: 7, max: 9, starts: "8" },
  { iso: "IL", name: "Israel", dial: "972", min: 8, max: 9, starts: "5" },
  { iso: "IT", name: "Italy", dial: "39", min: 9, max: 10, starts: "3" },
  { iso: "JO", name: "Jordan", dial: "962", min: 8, max: 9, starts: "7" },
  { iso: "JP", name: "Japan", dial: "81", min: 9, max: 10, starts: "[789]" },
  { iso: "KE", name: "Kenya", dial: "254", min: 9, max: 9, starts: "[17]" },
  { iso: "KR", name: "South Korea", dial: "82", min: 9, max: 10, starts: "1" },
  { iso: "LK", name: "Sri Lanka", dial: "94", min: 9, max: 9, starts: "7" },
  { iso: "MU", name: "Mauritius", dial: "230", min: 7, max: 8, starts: "5" },
  { iso: "MV", name: "Maldives", dial: "960", min: 7, max: 7, starts: "[79]" },
  { iso: "MX", name: "Mexico", dial: "52", min: 10, max: 10 },
  { iso: "NG", name: "Nigeria", dial: "234", min: 8, max: 10, starts: "[7-9]" },
  { iso: "NL", name: "Netherlands", dial: "31", min: 9, max: 9, starts: "6" },
  { iso: "NO", name: "Norway", dial: "47", min: 8, max: 8 },
  { iso: "NP", name: "Nepal", dial: "977", min: 9, max: 10, starts: "9" },
  { iso: "PH", name: "Philippines", dial: "63", min: 9, max: 10, starts: "9" },
  { iso: "PK", name: "Pakistan", dial: "92", min: 10, max: 10, starts: "3" },
  { iso: "PL", name: "Poland", dial: "48", min: 9, max: 9, starts: "[4-8]" },
  { iso: "PT", name: "Portugal", dial: "351", min: 9, max: 9, starts: "9" },
  { iso: "RU", name: "Russia", dial: "7", min: 10, max: 10, starts: "9" },
  { iso: "SE", name: "Sweden", dial: "46", min: 7, max: 9 },
  { iso: "TH", name: "Thailand", dial: "66", min: 8, max: 9, starts: "[689]" },
  { iso: "TR", name: "Turkey", dial: "90", min: 10, max: 10, starts: "5" },
  { iso: "TW", name: "Taiwan", dial: "886", min: 9, max: 9, starts: "9" },
  { iso: "VN", name: "Vietnam", dial: "84", min: 9, max: 10 },
  { iso: "ZA", name: "South Africa", dial: "27", min: 9, max: 9, starts: "[6-8]" },
];

export const DEFAULT_COUNTRY = "IN";

/** E.164 allows at most 15 digits including the country code. */
const E164_MAX = 15;

export function findCountry(iso: string | undefined): Country {
  return (
    COUNTRIES.find((c) => c.iso === iso) ??
    COUNTRIES.find((c) => c.iso === DEFAULT_COUNTRY)!
  );
}

/**
 * Reduces whatever the user typed to bare national digits. Tolerates the
 * common paste shapes — "+971 50 123 4567", "00971501234567", "0501234567"
 * — by stripping the country dial code and any trunk zero.
 */
export function normalizeMobile(input: string, iso: string): string {
  const country = findCountry(iso);
  let digits = input.replace(/\D/g, "");

  // International prefix typed as 00, e.g. "00971…".
  if (digits.startsWith("00")) digits = digits.slice(2);

  // A leading copy of the selected dial code, but only when what remains is
  // still a plausible national number — otherwise a number that legitimately
  // starts with those digits would get truncated.
  if (digits.startsWith(country.dial)) {
    const rest = digits.slice(country.dial.length);
    if (rest.length >= country.min && rest.length <= country.max) digits = rest;
  }

  // Domestic trunk prefix.
  if (digits.length > country.min && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
}

export function isValidMobile(input: string, iso: string): boolean {
  const country = findCountry(iso);
  const n = normalizeMobile(input, iso);
  if (
    n.length < country.min ||
    n.length > country.max ||
    country.dial.length + n.length > E164_MAX
  ) {
    return false;
  }
  return country.starts ? new RegExp(`^${country.starts}`).test(n) : true;
}

/** Stored form: E.164, e.g. "+919876543210". */
export function toE164(input: string, iso: string): string {
  const country = findCountry(iso);
  return `+${country.dial}${normalizeMobile(input, iso)}`;
}

/**
 * Display form, e.g. "+91 98765 43210" or "+971 501234567". Matches the
 * stored number back to a country by longest dial code, so numbers saved
 * under any country still read correctly.
 */
export function formatMobile(stored: string): string {
  const digits = stored.replace(/\D/g, "");

  const match = [...COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => {
      if (!digits.startsWith(c.dial)) return false;
      const rest = digits.length - c.dial.length;
      return rest >= c.min && rest <= c.max;
    });

  if (!match) return stored;

  const national = digits.slice(match.dial.length);
  const total = match.groups?.reduce((a, b) => a + b, 0);

  // Only apply the grouping when the length is exactly what it describes.
  if (!match.groups || total !== national.length) {
    return `+${match.dial} ${national}`;
  }

  const parts: string[] = [];
  let i = 0;
  for (const size of match.groups) {
    parts.push(national.slice(i, i + size));
    i += size;
  }
  return `+${match.dial} ${parts.join(" ")}`;
}

/**
 * Splits a stored E.164 number back into the parts the form edits. Prefers
 * the country recorded at sign-up, since dial codes alone are ambiguous
 * (+1 is both US and Canada); falls back to matching the longest dial code.
 */
export function splitE164(
  stored: string | undefined,
  savedIso?: string
): { iso: string; national: string } {
  const digits = (stored ?? "").replace(/\D/g, "");
  if (!digits) return { iso: savedIso ?? DEFAULT_COUNTRY, national: "" };

  const saved = COUNTRIES.find((c) => c.iso === savedIso);
  const match =
    saved && digits.startsWith(saved.dial)
      ? saved
      : [...COUNTRIES]
          .sort((a, b) => b.dial.length - a.dial.length)
          .find((c) => {
            if (!digits.startsWith(c.dial)) return false;
            const rest = digits.length - c.dial.length;
            return rest >= c.min && rest <= c.max;
          });

  if (!match) return { iso: savedIso ?? DEFAULT_COUNTRY, national: digits };
  return { iso: match.iso, national: digits.slice(match.dial.length) };
}

export function mobileError(iso: string): string {
  const c = findCountry(iso);
  const len =
    c.min === c.max ? `${c.min}-digit` : `${c.min}–${c.max} digit`;
  const base = `Enter a valid ${len} ${c.name} mobile number`;

  if (!c.starts) return `${base}.`;

  // "[6-9]" -> "6–9", "[89]" -> "8 or 9", "5" -> "5".
  const set = c.starts.replace(/[[\]]/g, "");
  const reads = set.includes("-")
    ? set.replace("-", "–")
    : set.split("").join(" or ");

  return `${base} (starting ${reads}).`;
}
