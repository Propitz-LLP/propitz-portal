"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Human verification (Cloudflare Turnstile).                         */
/*                                                                     */
/*  Drop <TurnstileField /> inside a form; it posts a token the server  */
/*  checks in lib/turnstile.ts before anything is saved. Most visitors  */
/*  never see it — the widget only appears when Cloudflare wants an     */
/*  interaction.                                                        */
/*                                                                     */
/*  With no site key set, TURNSTILE_ENABLED is false, this renders      */
/*  nothing and the server check passes: a missing key must never block */
/*  a real enquiry.                                                     */
/* ------------------------------------------------------------------ */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Forms start their "is this a person" state from this. */
export const TURNSTILE_ENABLED = SITE_KEY.length > 0;

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Options = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  "timeout-callback": () => void;
  appearance: "always" | "execute" | "interaction-only";
  action?: string;
  theme: "light" | "dark" | "auto";
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Options) => string | undefined;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

/** Loads the Cloudflare script once, however many forms are on the page. */
let loading: Promise<void> | null = null;

function loadTurnstile() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const fail = (why: string) => {
      loading = null; // let a later form try again
      reject(new Error(why));
    };
    // A blocked request can hang instead of erroring — an ad blocker or a
    // corporate proxy black-holing Cloudflare. Give up rather than leave
    // the visitor looking at a submit button that never becomes clickable.
    const timer = setTimeout(() => fail("Turnstile script timed out"), 10000);

    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      clearTimeout(timer);
      fail("Turnstile script did not load");
    };
    document.head.appendChild(script);
  });
  return loading;
}

export default function TurnstileField({
  /** The form's action is running. When it finishes, the spent token is replaced. */
  pending = false,
  /** Lets the form disable its submit button until the check has passed. */
  onVerifiedChange,
  /** Which form this was, so the Cloudflare dashboard is readable. */
  action,
  /** Match the surrounding card — the footer form sits on a dark panel. */
  theme = "light",
}: {
  pending?: boolean;
  onVerifiedChange?: (verified: boolean) => void;
  action?: string;
  theme?: "light" | "dark";
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  // Kept in a ref so Cloudflare's callbacks always reach the current form
  // without the widget being torn down and re-rendered on every change.
  const notify = useRef(onVerifiedChange);
  useEffect(() => {
    notify.current = onVerifiedChange;
  });

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!TURNSTILE_ENABLED) return;
    let removed = false;
    // Captured now: by the time the cleanup runs, the ref may already
    // point somewhere else (or nowhere).
    const container = box.current;

    // The widget could not answer. The form stays locked, because the
    // server refuses a submission with no token and telling someone to
    // send it anyway would only walk them into that rejection. They get
    // an explanation and a retry instead — these failures are usually
    // transient, and a reset clears most of them.
    const giveUp = () => {
      setFailed(true);
      notify.current?.(false);
    };

    loadTurnstile()
      .then(() => {
        if (removed || !container || !window.turnstile) return;
        const id = window.turnstile.render(container, {
          sitekey: SITE_KEY,
          action,
          appearance: "interaction-only",
          theme,
          callback: () => {
            setFailed(false);
            notify.current?.(true);
          },
          "expired-callback": () => notify.current?.(false),
          // The challenge went stale before it was answered; start a new one
          // rather than leaving the visitor with nothing to click.
          "timeout-callback": () => {
            if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
          },
          // Cloudflare is unreachable or blocked.
          "error-callback": giveUp,
        });
        // A bad site key, or a widget that refused to mount.
        if (!id) giveUp();
        widget.current = id ?? null;
      })
      .catch(giveUp);

    return () => {
      removed = true;
      const id = widget.current;
      widget.current = null;
      if (!id || !window.turnstile) return;
      // React can take the container out of the document before this runs —
      // on a hot reload, or when the form is replaced by its thank-you
      // panel. Cloudflare then cannot find the widget and warns about it,
      // so only ask for a removal that can actually happen.
      if (!container?.isConnected) return;
      try {
        window.turnstile.remove(id);
      } catch {
        // Removed from under us anyway. Nothing is leaked.
      }
    };
  }, [action, theme]);

  // A token is single use. Once the action has finished and the form is
  // still on screen — i.e. it came back with an error — ask for a fresh one
  // so the next attempt is not rejected for reusing the last token.
  const wasPending = useRef(pending);
  useEffect(() => {
    if (wasPending.current && !pending && widget.current && window.turnstile) {
      window.turnstile.reset(widget.current);
    }
    wasPending.current = pending;
  }, [pending]);

  if (!TURNSTILE_ENABLED) return null;

  const retry = () => {
    setFailed(false);
    notify.current?.(false);
    // No widget to reset means the script itself never arrived; only a
    // fresh page load will fetch it again.
    if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
    else window.location.reload();
  };

  return (
    <div className="mt-4">
      <div ref={box} />
      {failed && (
        <p className="mt-2 text-[13px] text-red-700">
          We could not verify your browser, so this form cannot be sent yet.{" "}
          <button
            type="button"
            onClick={retry}
            className="font-semibold underline underline-offset-2"
          >
            Try again
          </button>
          . If it keeps failing, an ad blocker or privacy extension is usually
          the cause — or just message us on WhatsApp.
        </p>
      )}
    </div>
  );
}
