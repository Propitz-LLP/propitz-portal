import { SUPABASE_URL } from "@/lib/supabase/config";

/* ------------------------------------------------------------------ */
/*  Listing photos.                                                    */
/*                                                                     */
/*  Stored in the public `listing-images` bucket; a listing keeps the   */
/*  object paths, cover first. Only contributors may upload (see the    */
/*  20260921 migration), and the public page reads them by URL.         */
/* ------------------------------------------------------------------ */

export const LISTING_IMAGES_BUCKET = "listing-images";

/** Most phone photos are several MB; anything larger is a mistake. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES = 10;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Public URL for a stored object path. */
export function listingImageUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${LISTING_IMAGES_BUCKET}/${path}`;
}
