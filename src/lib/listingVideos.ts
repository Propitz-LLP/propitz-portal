import { SUPABASE_URL } from "@/lib/supabase/config";

/* ------------------------------------------------------------------ */
/*  Listing videos.                                                    */
/*                                                                     */
/*  Walkthroughs shot and uploaded by the team, stored in the public    */
/*  `listing-videos` bucket (see the 20260929 migration). A listing     */
/*  keeps the object paths in the order they are shown.                 */
/* ------------------------------------------------------------------ */

export const LISTING_VIDEOS_BUCKET = "listing-videos";

/**
 * 25 MB and two clips per listing.
 *
 * The platform refuses anything over 50 MB per file, so this leaves room
 * below a hard limit, and it roughly doubles how many plays fit in the
 * project's bandwidth allowance. A 45–60 second 1080p H.264 clip
 * compresses to this comfortably.
 */
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
export const MAX_VIDEOS = 2;

/**
 * MP4 only. A .mov usually carries HEVC, which Chrome on Android will not
 * play — and the container alone does not tell you the codec, which is
 * why the upload panel also decodes the file before accepting it.
 */
export const ACCEPTED_VIDEO_TYPES = ["video/mp4"];

/** Public URL for a stored object path. */
export function listingVideoUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${LISTING_VIDEOS_BUCKET}/${path}`;
}

/**
 * True when this browser can actually decode the file.
 *
 * `file.type` is the container, not the codec: an HEVC clip and an H.264
 * clip are both "video/mp4" to the picker. Loading the metadata is the
 * only reliable check short of parsing the file, and it is fast because
 * the data is already local.
 */
export function canPlay(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    const done = (ok: boolean) => {
      URL.revokeObjectURL(url);
      video.removeAttribute("src");
      resolve(ok);
    };
    // A file that neither loads nor errors within a few seconds is not
    // something to publish either way.
    const timer = setTimeout(() => done(false), 8000);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      clearTimeout(timer);
      // Audio-only, or a video track the decoder refused.
      done(video.videoWidth > 0 && video.videoHeight > 0);
    };
    video.onerror = () => {
      clearTimeout(timer);
      done(false);
    };
    video.src = url;
  });
}
