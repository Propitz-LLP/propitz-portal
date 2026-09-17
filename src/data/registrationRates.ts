/* ------------------------------------------------------------------ */
/*  Tamil Nadu stamp duty and registration fee rates.                  */
/*                                                                     */
/*  V1 covers standard Sale / Conveyance deeds only. Rates are kept    */
/*  here as configuration so they can change without touching the      */
/*  calculator.                                                        */
/*                                                                     */
/*  VERIFY BEFORE EVERY PRODUCTION RELEASE against the current Tamil   */
/*  Nadu Government / TNREGINET position, then update `checked`.       */
/* ------------------------------------------------------------------ */

export const saleDeedRates = {
  /** Stamp duty, as a fraction of the applicable value. */
  stampDuty: 0.07,
  /** Registration fee, as a fraction of the applicable value. */
  registrationFee: 0.04,
  /**
   * Concession for conveyances where every purchaser is a woman: the
   * registration fee falls by this many percentage points, for properties
   * valued up to `womenConcessionMaxValue`.
   */
  womenConcession: 0.01,
  womenConcessionMaxValue: 10_00_000,
  /** The notification the concession comes from. */
  womenConcessionSource:
    "G.O. Ms. No. 77, Commercial Taxes and Registration (J2), dated 29 March 2025",
  /** Where the rates were taken from. */
  source:
    "Tamil Nadu Budget 2025-26 and Tamil Nadu Government Gazette Extraordinary No. 147, G.O. Ms. No. 77, dated 29 March 2025",
  /** When the rates were last confirmed. Update after each verification. */
  checked: "September 2026",
};
