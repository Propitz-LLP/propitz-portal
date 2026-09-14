/* ------------------------------------------------------------------ */
/*  Shape of the private specialist roster.                            */
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
  notes: string;
  active: boolean;
  createdBy: string | null;
};

/** Trade keys the database will accept, taken from the public cards. */
export const TRADES = specialists.map((s) => ({ key: s.key, label: s.label }));

export function tradeLabel(key: string) {
  return TRADES.find((t) => t.key === key)?.label ?? key;
}
