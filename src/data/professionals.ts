/* ------------------------------------------------------------------ */
/*  Shape of the professionals list.                                   */
/*                                                                     */
/*  Split from the fetching in lib/professionals.ts because the form is */
/*  a client component: anything it imports must not reach for          */
/*  next/headers through the Supabase server client.                    */
/* ------------------------------------------------------------------ */

import { specialists } from "./marketplace";

export type Professional = {
  id: string;
  /** Matches a key in `specialists`. */
  trade: string;
  name: string;
  firm: string;
  phone: string;
  email: string;
  areas: string;
  registration: string;
  /** Internal notes. Never published. */
  notes: string;
  active: boolean;
  /** Shown on the public Property Professionals tab when true. */
  published: boolean;
  /** Their agreement to being shown publicly. Required before publishing. */
  publicConsent: boolean;
  /** One or two lines shown publicly. Phone and email never are. */
  publicNote: string;
  /** Years in practice, shown publicly when set. */
  experienceYears: number | null;
  createdBy: string | null;
};

/** What a visitor sees on the marketplace: no phone, no email, no notes. */
export type PublicProfessional = {
  id: string;
  trade: string;
  name: string;
  firm: string;
  areas: string;
  registration: string;
  publicNote: string;
  experienceYears: number | null;
};

/** Trade keys the database will accept, taken from the public cards. */
export const TRADES = specialists.map((s) => ({ key: s.key, label: s.label }));

export function tradeLabel(key: string) {
  return TRADES.find((t) => t.key === key)?.label ?? key;
}
