"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { listingImageUrl } from "@/lib/listingImages";
import { IconChevron, IconImage } from "./Icon";

/** Nothing to subscribe to: this only distinguishes server from browser. */
const subscribeNever = () => () => {};

/**
 * The photos on a listing card, as an endless carousel.
 *
 * A scroll-snap strip rather than a scripted slider: swiping, trackpads and
 * keyboard scrolling all work natively, and the first photo is visible
 * before any JavaScript runs.
 *
 * Looping is done with a copy of the last photo before the first and a copy
 * of the first after the last. Scrolling onto a copy looks like wrapping
 * around; once the scroll settles the strip jumps to the real one, which is
 * invisible because the two frames are identical. The copies are added
 * after mount, so the server still renders the real first photo and nothing
 * flickers on hydration.
 */
export default function ListingGallery({
  images,
  title,
  /** "cover" crops to fill a card; "contain" shows the whole photo. */
  fit = "cover",
  /** Cards reveal the arrows on hover; the popup always shows them. */
  alwaysShowControls = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw",
}: {
  images: string[];
  title: string;
  fit?: "cover" | "contain";
  alwaysShowControls?: boolean;
  sizes?: string;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [index, setIndex] = useState(0);

  const many = images.length > 1;
  // The copies exist only once this is running in the browser, so the
  // server still renders the real first photo.
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);
  const looped = mounted && many;

  // With copies in place the real first photo sits one frame in.
  const offset = looped ? 1 : 0;
  const slides = looped
    ? [images[images.length - 1], ...images, images[0]]
    : images;

  const jumpTo = useCallback((frame: number, smooth: boolean) => {
    const el = strip.current;
    if (!el) return;
    el.scrollTo({ left: frame * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Start on the real first photo, and stay put when the card is resized.
  useLayoutEffect(() => {
    if (!looped) return;
    jumpTo(index + 1, false);
    // `index` is deliberately not a dependency: this is only for mount and resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [looped, jumpTo]);

  useEffect(() => {
    if (!looped) return;
    const onResize = () => jumpTo(index + offset, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [looped, index, offset, jumpTo]);

  if (images.length === 0) {
    // No photo yet — the placeholder keeps the card honest.
    return (
      <div className="grid h-full place-items-center">
        <IconImage size={38} className="text-line-strong" />
      </div>
    );
  }

  const onScroll = () => {
    const el = strip.current;
    if (!el) return;
    const frame = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    const real = looped ? (frame - 1 + images.length) % images.length : frame;
    setIndex(real);

    if (!looped) return;
    // Once the scroll stops on a copy, swap to the real frame it shows.
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      if (frame === 0) jumpTo(images.length, false);
      else if (frame === images.length + 1) jumpTo(1, false);
    }, 120);
  };

  const arrowVisibility = alwaysShowControls
    ? "grid"
    : "hidden sm:grid sm:opacity-0 sm:group-hover/gallery:opacity-100";

  /** Step or jump; past either end it wraps, because the copies are there. */
  const go = (to: number) => jumpTo(looped ? to + 1 : Math.max(0, Math.min(images.length - 1, to)), true);

  return (
    <div className="group/gallery relative h-full">
      <div
        ref={strip}
        onScroll={onScroll}
        role="group"
        aria-label={`Photos of ${title}`}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((path, i) => (
          <div key={`${path}-${i}`} className="relative h-full w-full shrink-0 snap-center">
            <Image
              src={listingImageUrl(path)}
              alt={i === offset ? title : `${title} — photo ${((i - offset + images.length) % images.length) + 1}`}
              fill
              className={fit === "contain" ? "object-contain" : "object-cover"}
              sizes={sizes}
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          {/* Arrows: always there for a mouse, out of the way until hover. */}
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(index - 1)}
            className={`absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition-opacity hover:bg-white ${arrowVisibility}`}
          >
            <IconChevron size={12} className="rotate-90" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(index + 1)}
            className={`absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition-opacity hover:bg-white ${arrowVisibility}`}
          >
            <IconChevron size={12} className="-rotate-90" />
          </button>

          <div className="absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5">
            {images.map((path, i) => (
              <button
                key={path}
                type="button"
                aria-label={`Photo ${i + 1} of ${images.length}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
