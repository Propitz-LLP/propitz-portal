"use client";

import { useEffect, useState } from "react";
import { CAMPAIGN_KEYS, type Campaign } from "@/data/enquiries";

/* ------------------------------------------------------------------ */
/*  Campaign attribution (Requirements v2.0, FR-QT-06).                */
/*                                                                     */
/*  The ad parameters a visitor lands with — utm_*, gclid, fbclid — are */
/*  kept for the browser session, so an enquiry made three pages later */
/*  still records which campaign brought them. First landing wins.     */
/*  Session storage only: nothing persists past the visit, no cookie.  */
/* ------------------------------------------------------------------ */

const KEY = "propitz:campaign";

/** Mounted once in the root layout. Renders nothing. */
export default function CampaignCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      const params = new URLSearchParams(window.location.search);
      const found: Campaign = {};
      for (const k of CAMPAIGN_KEYS) {
        if (k === "landing") continue;
        const v = params.get(k);
        if (v) found[k] = v.slice(0, 150);
      }
      if (Object.keys(found).length === 0) return;
      found.landing = window.location.pathname.slice(0, 200);
      sessionStorage.setItem(KEY, JSON.stringify(found));
    } catch {
      // Storage blocked (private mode, settings): attribution is optional.
    }
  }, []);
  return null;
}

/** A hidden field carrying the session's campaign into a form submission. */
export function CampaignField() {
  const [value, setValue] = useState("");
  useEffect(() => {
    try {
      // Read after mount: session storage does not exist on the server.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(sessionStorage.getItem(KEY) ?? "");
    } catch {
      // As above.
    }
  }, []);
  return <input type="hidden" name="campaign" value={value} />;
}
