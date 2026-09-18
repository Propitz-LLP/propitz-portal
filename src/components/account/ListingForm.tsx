"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveListing, type FormState } from "@/app/account/listings/actions";
import type { ManagedListing } from "@/lib/listings";
import { BADGE_SLOTS, propertyTypes } from "@/data/marketplace";
import { field } from "@/components/fieldClass";

const initial: FormState = {};

/** The vocabulary already in use, offered as suggestions rather than a fixed list. */
const BADGE_SUGGESTIONS = [
  "EC clear",
  "EC pending",
  "Patta verified",
  "Patta transfer pending",
  "Patta N/A",
  "CMDA approved",
  "DTCP approved",
  "RERA registered",
  "Adangal verified",
  "Conversion pending",
  "Tax current",
];

const label = "mb-1.5 block text-sm font-medium text-ink";

/**
 * Add or edit one listing.
 *
 * Badges are typed rather than picked from a fixed list, because the
 * wording carries meaning a checkbox would flatten: "EC pending" and
 * "EC clear" are the same document at two very different stages.
 */
export default function ListingForm({ listing }: { listing?: ManagedListing }) {
  const [state, action, pending] = useActionState(saveListing, initial);
  const badges = listing?.badges ?? [];

  return (
    <form action={action}>
      {listing && <input type="hidden" name="id" value={listing.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>Title</label>
          <input
            name="title"
            required
            defaultValue={listing?.title}
            className={field}
            placeholder="Residential plot, approved layout"
          />
        </div>

        <div>
          <label className={label}>Property type</label>
          <select
            name="kind"
            defaultValue={listing?.kind ?? "plot"}
            className={field}
          >
            {propertyTypes
              .filter((t) => t.key !== "all")
              .map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className={label}>Verification status</label>
          <select
            name="status"
            defaultValue={listing?.status ?? "review"}
            className={field}
          >
            <option value="review">In review — documents still being read</option>
            <option value="verified">Verified — an advocate has read the chain</option>
          </select>
        </div>

        <div>
          <label className={label}>Price</label>
          <input
            name="price"
            required
            defaultValue={listing?.price}
            className={field}
            placeholder="₹48.5 L"
          />
        </div>

        <div>
          <label className={label}>Size and rate</label>
          <input
            name="unit"
            defaultValue={listing?.unit}
            className={field}
            placeholder="₹2,634 / sq.ft · 1,842 sq.ft"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label}>Locality</label>
          <input
            name="locality"
            required
            defaultValue={listing?.locality}
            className={field}
            placeholder="Sholinganallur, OMR"
          />
        </div>
      </div>

      <fieldset className="mt-6 border-t border-line pt-5">
        <legend className="sr-only">Document badges</legend>
        <p className="text-sm font-medium text-ink">Document badges</p>
        <p className="mt-1 text-[13px] leading-[1.5] text-body">
          These are the whole proposition, so only mark a document clear once
          it has actually been read. Leave a row blank to skip it.
        </p>

        <datalist id="badge-suggestions">
          {BADGE_SUGGESTIONS.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>

        <div className="mt-4 space-y-3">
          {Array.from({ length: BADGE_SLOTS }, (_, i) => (
            <div key={i} className="flex flex-wrap gap-3">
              <input
                name={`badgeLabel${i}`}
                list="badge-suggestions"
                defaultValue={badges[i]?.label ?? ""}
                className={`${field} min-w-0 grow`}
                placeholder={i === 0 ? "EC clear" : "Add another badge"}
              />
              <select
                name={`badgeTone${i}`}
                defaultValue={badges[i]?.tone ?? "ok"}
                className={`${field} w-full sm:w-56`}
              >
                <option value="ok">Clear — green</option>
                <option value="warn">Being read — amber</option>
                <option value="none">Not applicable — grey</option>
              </select>
            </div>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 flex items-start gap-3 border-t border-line pt-5 text-sm text-body">
        <input
          type="checkbox"
          name="published"
          defaultChecked={listing ? listing.published : true}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-brand,#0f766e)]"
        />
        <span>
          <b className="font-semibold text-ink">Show on the marketplace.</b>{" "}
          Uncheck to keep the listing here without it appearing publicly.
        </span>
      </label>

      {state.error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary justify-center py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : listing ? "Save changes" : "Add listing"}
        </button>
        <Link
          href="/account/listings"
          className="text-sm font-semibold text-body underline underline-offset-4 hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
