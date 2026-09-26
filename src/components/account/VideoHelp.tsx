"use client";

import { useEffect, useRef, useState } from "react";
import { IconClose, IconHelp } from "@/components/Icon";
import { MAX_VIDEOS } from "@/lib/listingVideos";

/* ------------------------------------------------------------------ */
/*  How to prepare a walkthrough video.                                */
/*                                                                     */
/*  The same guidance as docs/listing-video-guide.md, shortened to what */
/*  is needed while standing at the upload box. Kept here rather than   */
/*  linked because the person who needs it is mid-task, and a document  */
/*  they have to go and find is a document they will not read.          */
/* ------------------------------------------------------------------ */

export default function VideoHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="How to prepare a video"
        className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-muted transition-colors hover:text-brand"
      >
        <IconHelp size={15} />
      </button>
      {open && <HelpDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function HelpDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      // The page behind a modal is inert, so a backdrop click arrives on
      // the dialog itself: compare it against the panel's own box.
      onClick={(e) => {
        const box = panel.current?.getBoundingClientRect();
        if (!box) return;
        const outside =
          e.clientX < box.left ||
          e.clientX > box.right ||
          e.clientY < box.top ||
          e.clientY > box.bottom;
        if (outside) dialog.current?.close();
      }}
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/60"
    >
      <div className="grid h-full place-items-center p-4">
        {/* The panel clips to its own radius and the close button is pinned
            to its corner, outside the scrolling area — otherwise it drifts
            down the page as soon as the content is scrolled. */}
        <div
          ref={panel}
          className="relative flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-surface text-left shadow-xl"
        >
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-body backdrop-blur-sm transition-colors hover:bg-bg-alt hover:text-ink"
          >
            <IconClose size={14} />
          </button>

          <div className="overflow-y-auto p-6">
          <h2 className="pr-10 text-lg font-semibold text-ink">
            How to prepare
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-body">
            Videos must be <strong className="text-ink">MP4 (H.264), under 25 MB</strong> —
            about 45–60 seconds once prepared.
          </p>

          <p className="mt-3 rounded-xl bg-bg-alt p-4 text-[13px] leading-relaxed text-body">
            <strong className="text-ink">Almost every clip needs step 2, even an
            MP4 from an Android phone.</strong>{" "}
            Phones record at around 17 Mbps, so 25 MB is only about{" "}
            <strong className="text-ink">12 seconds</strong> of footage. Anything
            long enough to be worth publishing will be too large. Compressing
            removes waste the phone had no reason to avoid — it is not the same
            as lowering quality.
          </p>

          <Step n="1" title="Set the phone to H.264, once">
            iPhone: Settings → Camera → Formats → <strong className="text-ink">Most
            Compatible</strong>. Android: camera settings → video codec →{" "}
            <strong className="text-ink">H.264</strong>. Phones default to HEVC,
            which will not play on many Android phones — including for the
            buyers we send the listing to. On Android the HEVC sits inside an
            .mp4, so the file looks correct and is still refused; the codec is
            what matters, not the extension.
          </Step>

          <Step
            n="2"
            title={
              <>
                Shrink it with HandBrake — free, from{" "}
                <a
                  href="https://handbrake.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand underline underline-offset-2"
                >
                  handbrake.fr
                </a>
              </>
            }
          >
            Drag the file in — <strong className="text-ink">.mov works too</strong>,
            including HEVC, so footage already shot on the old setting is fine.
            First time: Format MP4, tick <strong className="text-ink">Web
            Optimized</strong>, Dimensions → Resolution Limit 1080p, Video →
            H.264 with <strong className="text-ink">Avg Bitrate 2500</strong> and
            2-Pass, Audio → AAC 96. Save that as a preset named “PropITZ Listing
            Video”. After that it is: drag in, pick the preset, Start Encode.
            A 60-second clip lands around 19 MB.
          </Step>

          <p className="mt-4 rounded-xl border border-amber-300/60 bg-amber-50 p-3.5 text-[13px] leading-relaxed text-body">
            <strong className="text-ink">Do not set a maximum file size in the
            camera app.</strong>{" "}
            It stops the recording when the limit is reached rather than
            compressing anything, so you get a walkthrough that cuts off
            mid-room. It would upload cleanly and be useless.
          </p>

          <Step n="3" title="Upload, up to two clips">
            {MAX_VIDEOS} per listing, 25 MB each. Nothing downloads for a buyer
            until they tap play, so a video costs them nothing unless they want
            it.
          </Step>

          <div className="mt-5 rounded-xl bg-bg-alt p-4">
            <p className="text-[13px] font-semibold text-ink">If a file is refused</p>
            <dl className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-body">
              <Reason label="“is not an MP4”">
                still a .mov — run it through HandBrake
              </Reason>
              <Reason label="“could not be decoded”">
                it is HEVC — re-encode as H.264, and fix the phone setting
              </Reason>
              <Reason label="“is NN MB”">
                too large — trim it, or lower the bitrate to 1800
              </Reason>
            </dl>
          </div>

          <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
            Please do not film neighbours, people’s faces, the doors of
            adjacent houses, or vehicle number plates — these videos are
            published on a public page.
          </p>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="text-sm font-semibold text-ink">
        <span className="mr-1.5 font-mono text-[12.5px] text-faint">0{n}</span>
        {title}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-body">{children}</p>
    </div>
  );
}

function Reason({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="inline font-semibold text-ink">{label}</dt>
      <dd className="inline"> — {children}</dd>
    </div>
  );
}
