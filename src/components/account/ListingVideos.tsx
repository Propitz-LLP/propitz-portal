"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ACCEPTED_VIDEO_TYPES,
  canPlay,
  LISTING_VIDEOS_BUCKET,
  listingVideoUrl,
  MAX_VIDEOS,
  MAX_VIDEO_BYTES,
} from "@/lib/listingVideos";
import { IconClose } from "@/components/Icon";
import VideoHelp from "@/components/account/VideoHelp";

/**
 * Listing walkthrough videos: up to two, uploaded as they are chosen.
 *
 * Same shape as the photo panel — paths travel with the form in a hidden
 * field and removing a clip deletes the object, so an abandoned form does
 * not leave files behind. The difference is the check before upload: the
 * browser decodes the file first, because a clip that plays on the
 * uploader's Mac and not on a buyer's Android phone is worse than one
 * that was never accepted.
 */
export default function ListingVideos({ initial }: { initial: string[] }) {
  const [paths, setPaths] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);

    const room = MAX_VIDEOS - paths.length;
    if (room <= 0) {
      setError(`That is the limit of ${MAX_VIDEOS} videos.`);
      return;
    }

    const chosen = Array.from(files).slice(0, room);
    const tooBig = chosen.find((f) => f.size > MAX_VIDEO_BYTES);
    if (tooBig) {
      setError(
        `${tooBig.name} is ${(tooBig.size / 1048576).toFixed(0)} MB. Compress it under 25 MB first.`
      );
      return;
    }
    const wrongType = chosen.find((f) => !ACCEPTED_VIDEO_TYPES.includes(f.type));
    if (wrongType) {
      setError(`${wrongType.name} is not an MP4. Convert it first — .mov files are usually HEVC, which many phones cannot play.`);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const added: string[] = [];

    for (const file of chosen) {
      if (!(await canPlay(file))) {
        setError(
          `${file.name} could not be decoded in the browser — it is most likely HEVC. Re-encode it as H.264 MP4.`
        );
        break;
      }

      const path = `${crypto.randomUUID()}.mp4`;
      const { error: uploadError } = await supabase.storage
        .from(LISTING_VIDEOS_BUCKET)
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
          // The name is a UUID and the object is never overwritten, so it
          // can be cached for a year. Repeat viewers then cost nothing.
          cacheControl: "31536000",
        });

      if (uploadError) {
        setError(
          uploadError.message.includes("row-level security")
            ? "Your account is not allowed to upload listing videos."
            : `Could not upload ${file.name}: ${uploadError.message}`
        );
        break;
      }
      added.push(path);
    }

    if (added.length) setPaths((p) => [...p, ...added]);
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  const remove = async (path: string) => {
    setPaths((p) => p.filter((x) => x !== path));
    // Best effort: the row no longer references it either way.
    await createClient().storage.from(LISTING_VIDEOS_BUCKET).remove([path]);
  };

  return (
    <fieldset className="mt-6 border-t border-line pt-5">
      <legend className="sr-only">Videos</legend>
      <p className="flex items-center text-sm font-medium text-ink">
        Videos
        <VideoHelp />
      </p>
      <p className="mt-1 text-[13px] leading-[1.5] text-body">
        Up to {MAX_VIDEOS} clips, 25 MB each — about 45–60 seconds at 1080p.
        MP4 (H.264) only — tap the help icon for how to prepare one.
        Nothing downloads for a buyer until they tap play.
      </p>

      <input type="hidden" name="videos" value={paths.join(",")} />

      {paths.length > 0 && (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {paths.map((path) => (
            <li key={path} className="relative overflow-hidden rounded-xl ring-1 ring-line">
              <video
                src={listingVideoUrl(path)}
                controls
                preload="metadata"
                className="aspect-video w-full bg-ink object-cover"
              />
              <button
                type="button"
                onClick={() => remove(path)}
                aria-label="Remove video"
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink/75 text-white transition-colors hover:bg-ink"
              >
                <IconClose size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={input}
        type="file"
        accept={ACCEPTED_VIDEO_TYPES.join(",")}
        multiple
        disabled={busy || paths.length >= MAX_VIDEOS}
        onChange={(e) => pick(e.target.files)}
        className="mt-4 block w-full text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark disabled:opacity-60"
      />

      {busy && <p className="mt-2 text-[13px] text-body">Uploading… large files take a moment.</p>}
      {error && <p className="mt-2 text-[13px] text-red-700">{error}</p>}
    </fieldset>
  );
}
