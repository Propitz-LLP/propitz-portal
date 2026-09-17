"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  CHANNELS,
  REQUIREMENTS,
  type LeadSource,
  type LeadState,
} from "@/data/leads";

const text = (formData: FormData, key: string, max: number) =>
  String(formData.get(key) ?? "").trim().slice(0, max);

/** At least ten digits, so a typo like "98765" is caught before it is stored. */
const looksLikePhone = (value: string) => value.replace(/\D/g, "").length >= 10;

/**
 * Store one website lead in Supabase.
 *
 * Every form posts here with a hidden `source`. Validation is per source,
 * because each form asks for different things. The table only accepts
 * inserts, so nothing submitted can be read back through the public key.
 */
export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  // Bots fill every field; people never see this one.
  if (text(formData, "company", 100)) return { ok: true };

  const source = text(formData, "source", 20) as LeadSource;
  const name = text(formData, "name", 120);
  const phone = text(formData, "phone", 30);
  const email = text(formData, "email", 200).toLowerCase();
  const location = text(formData, "location", 200);
  const message = text(formData, "message", 2000);
  const page = text(formData, "page", 200);

  const row: Record<string, string | null> = {
    source,
    name: name || null,
    phone: phone || null,
    email: email || null,
    property_location: location || null,
    message: message || null,
    page: page || null,
    requirement: null,
    preferred_channel: null,
    preferred_call_time: null,
  };

  switch (source) {
    case "request": {
      const requirement = text(formData, "requirement", 120);
      const channel = text(formData, "channel", 20);
      if (!name) return { error: "Please enter your name." };
      if (!looksLikePhone(phone)) return { error: "Please enter a valid mobile number." };
      if (!REQUIREMENTS.some((r) => r.label === requirement))
        return { error: "Please choose what you need help with." };
      if (!location) return { error: "Please tell us where the property is." };
      if (!CHANNELS.includes(channel as (typeof CHANNELS)[number]))
        return { error: "Please choose how we should contact you." };
      if (channel === "Email" && !email.includes("@"))
        return { error: "Please add your email address so we can reply by email." };
      row.requirement = requirement;
      row.preferred_channel = channel;
      break;
    }
    case "seller": {
      const hour = text(formData, "hour", 2);
      const minute = text(formData, "minute", 2);
      const ampm = text(formData, "ampm", 2);
      if (!name) return { error: "Please enter your name." };
      if (!looksLikePhone(phone)) return { error: "Please enter a valid mobile number." };
      if (!/^(1[0-2]|[1-9])$/.test(hour) || !/^[0-5]\d$/.test(minute) || !/^(AM|PM)$/.test(ampm))
        return { error: "Please choose a time for us to call you." };
      row.requirement = "Selling a property";
      row.preferred_channel = "Call";
      row.preferred_call_time = `${hour}:${minute} ${ampm}`;
      break;
    }
    case "checklist": {
      if (!name) return { error: "Please enter your name." };
      if (!looksLikePhone(phone)) return { error: "Please enter a valid mobile number." };
      row.requirement = "Property purchase / registration checklist";
      break;
    }
    case "newsletter": {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { error: "Please enter a valid email address." };
      break;
    }
    default:
      return { error: "Something went wrong. Please try again." };
  }

  // A visitor who asked for the checklist still gets it if saving fails;
  // only the lead is lost, and the failure is logged.
  const fallback: LeadState =
    source === "checklist"
      ? { ok: true }
      : { error: "We could not save your details just now. Please try again, or message us on WhatsApp." };

  if (!isSupabaseConfigured) {
    console.error("leads: Supabase is not configured; lead not saved");
    return fallback;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert(row);

  if (error) {
    // Most likely the leads table has not been created yet.
    console.error("leads: insert failed —", error.message);
    return fallback;
  }

  return { ok: true };
}
