"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ACCEPTED_IMAGE_TYPES,
  LISTING_IMAGES_BUCKET,
  listingImageUrl,
  MAX_IMAGES,
  MAX_IMAGE_BYTES,
} from "@/lib/listingImages";
import { IconClose } from "@/components/Icon";

/**
 * Listing photos: pick several, see them straight away, drop the ones you
 * do not want, and set which is the cover.
 *
 * Files upload to the listing-images bucket as they are chosen (only
 * contributors may write there), and the resulting object paths travel with
 * the form in a hidden field. Removing a photo also deletes the object, so
 * an abandoned form does not leave files behind.
 */
export default function ListingImages({ initial }: { initial: string[] }) {
  const [paths, setPaths] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);

    const room = MAX_IMAGES - paths.length;
    if (room <= 0) {
      setError(`That is the limit of ${MAX_IMAGES} photos.`);
      return;
    }

    const chosen = Array.from(files).slice(0, room);
    const tooBig = chosen.find((f) => f.size > MAX_IMAGE_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is larger than 5 MB. Please use a smaller photo.`);
      return;
    }
    const wrongType = chosen.find((f) => !ACCEPTED_IMAGE_TYPES.includes(f.type));
    if (wrongType) {
      setError(`${wrongType.name} is not a JPEG, PNG, WebP or AVIF image.`);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const added: string[] = [];

    for (const file of chosen) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(LISTING_IMAGES_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        setError(
          uploadError.message.includes("row-level security")
            ? "Your account is not allowed to upload listing photos."
            : `Could not upload ${file.name}: ${uploadError.message}`
        );
        break;
      }
      added.push(path);
    }

    if (added.length) setPaths((p) => [...p, ...added]);
    if (files.length > room) setError(`Only ${room} more photo${room === 1 ? "" : "s"} could be added.`);
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  const remove = async (path: string) => {
    setPaths((p) => p.filter((x) => x !== path));
    // Best effort: the row no longer references it either way.
    await createClient().storage.from(LISTING_IMAGES_BUCKET).remove([path]);
  };

  const makeCover = (path: string) =>
    setPaths((p) => [path, ...p.filter((x) => x !== path)]);

  return (
    <fieldset className="mt-6 border-t border-line pt-5">
      <legend className="sr-only">Photos</legend>
      <p className="text-sm font-medium text-ink">Photos</p>
      <p className="mt-1 text-[13px] leading-[1.5] text-body">
        Up to {MAX_IMAGES} photos, 5 MB each. The first one is the cover shown
        on the marketplace card.
      </p>

      <input type="hidden" name="images" value={paths.join(",")} />

      {paths.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {paths.map((path, i) => (
            <li key={path} className="group relative overflow-hidden rounded-xl ring-1 ring-line">
              <div className="relative aspect-4/3 bg-bg-alt">
                <Image src={listingImageUrl(path)} alt="" fill className="object-cover" sizes="200px" />
              </div>
              <button
                type="button"
                onClick={() => remove(path)}
                aria-label="Remove photo"
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink/75 text-white transition-colors hover:bg-ink"
              >
                <IconClose size={13} />
              </button>
              {i === 0 ? (
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeCover(path)}
                  className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-ink hover:bg-white"
                >
                  Make cover
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <input
        ref={input}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        disabled={busy || paths.length >= MAX_IMAGES}
        onChange={(e) => pick(e.target.files)}
        className="mt-4 block w-full text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark disabled:opacity-60"
      />

      {busy && <p className="mt-2 text-[13px] text-body">Uploading…</p>}
      {error && <p className="mt-2 text-[13px] text-red-700">{error}</p>}
    </fieldset>
  );
}
