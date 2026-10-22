/* ------------------------------------------------------------------ */
/*  Tamil Nadu stamp duty and registration fee rates.                  */
/*                                                                     */
/*  V1 covers standard Sale / Conveyance deeds only.                   */
/*                                                                     */
/*  Each rate is a history: every entry says from when it applies and  */
/*  which Government order set it. When a rate changes, ADD an entry   */
/*  — never edit an old one — so the record of what applied when, and  */
/*  on whose authority, stays here. An entry may be added ahead of its */
/*  start date; the calculator switches over on that date (the page    */
/*  re-renders daily, see app/resources/[slug]/page.tsx).              */
/*                                                                     */
/*  VERIFY BEFORE EVERY PRODUCTION RELEASE against the current Tamil   */
/*  Nadu Government / TNREGINET position, then update RATES_CHECKED.   */
/*  `npm run test:rates` fails once that date is six months old.       */
/* ------------------------------------------------------------------ */

/** One rate, in force from `from` until the next entry's `from`. */
export type DatedRate = {
  /** A fraction of the applicable value: 0.02 is 2%. */
  rate: number;
  /** First day it applies, YYYY-MM-DD (Indian date). */
  from: string;
  /** The Government order or notification that set it. */
  order: string;
};

export type DatedConcession = DatedRate & {
  /** Applies to properties valued at or below this, in rupees. */
  maxValue: number;
};

/** Stamp duty on a Sale / Conveyance, on market value. */
export const STAMP_DUTY: DatedRate[] = [
  {
    rate: 0.07,
    from: "2012-03-27",
    order: "Revision w.e.f. 27.03.2012, confirmed in G.O.Ms.No.69, CT&R (J2), dated 07.07.2023",
  },
];

/** Registration fee on a Sale / Conveyance, on market value. */
export const REGISTRATION_FEE: DatedRate[] = [
  {
    rate: 0.04,
    from: "2017-06-08",
    order: "Registration fee revision w.e.f. 08.06.2017",
  },
  {
    rate: 0.02,
    from: "2023-04-01",
    order: "G.O.(Ms.) No.34, CT&R (J2), dated 30.03.2023",
  },
];

/**
 * Where every purchaser is a woman, the registration fee falls by `rate`
 * (percentage points) for properties valued up to `maxValue`.
 */
export const WOMEN_CONCESSION: DatedConcession[] = [
  {
    rate: 0.01,
    maxValue: 10_00_000,
    // Announced in the Tamil Nadu Budget 2025-26; taken as applying from
    // the start of that financial year.
    from: "2025-04-01",
    order: "G.O. Ms. No. 77, CT&R (J2), dated 29.03.2025 (Gazette Extraordinary No. 147)",
  },
];

/** Where the figures were checked. */
export const RATES_REFERENCE =
  "Tamil Nadu Stamp Duty & Registration Fee Structure (tnswp.com) and TNREGINET";

/** When the rates were last confirmed, YYYY-MM-DD. Update after each verification. */
export const RATES_CHECKED = "2026-10-22";

/* ------------------------------------------------------------------ */

/** Today's date in India, YYYY-MM-DD — rates change at Indian midnight. */
export function indianDate(at: Date = new Date()): string {
  return at.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** The entry in force on `date`, or undefined before the first one. */
export function inForce<T extends DatedRate>(history: T[], date: string): T | undefined {
  let current: T | undefined;
  for (const entry of history) {
    if (entry.from <= date && (!current || entry.from >= current.from)) current = entry;
  }
  return current;
}

export type SaleDeedRates = {
  /** The date the rates are for, YYYY-MM-DD. */
  date: string;
  stampDuty: number;
  registrationFee: number;
  /** Percentage points off the fee; 0 when no concession is in force. */
  womenConcession: number;
  womenConcessionMaxValue: number;
  /** The orders behind the figures above, for the citation. */
  orders: string[];
  /** RATES_CHECKED, as "October 2026". */
  checked: string;
};

/**
 * Every rate a sale deed attracts on `date`. Plain data, so a server
 * component can resolve it and hand it to the calculator.
 */
export function saleDeedRatesOn(date: string = indianDate()): SaleDeedRates {
  const stamp = inForce(STAMP_DUTY, date);
  const fee = inForce(REGISTRATION_FEE, date);
  if (!stamp || !fee) throw new Error(`No sale deed rates in force on ${date}`);
  const women = inForce(WOMEN_CONCESSION, date);

  return {
    date,
    stampDuty: stamp.rate,
    registrationFee: fee.rate,
    womenConcession: women?.rate ?? 0,
    womenConcessionMaxValue: women?.maxValue ?? 0,
    orders: [stamp.order, fee.order, ...(women ? [women.order] : [])],
    checked: new Date(`${RATES_CHECKED}T00:00:00Z`).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
  };
}
