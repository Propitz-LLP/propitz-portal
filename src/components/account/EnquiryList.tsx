"use client";

import { useState, useTransition } from "react";
import { applicationFileUrl, setRead } from "@/app/account/enquiries/actions";
import {
  ENQUIRY_CATEGORIES,
  type Enquiry,
  type EnquiryCategory,
} from "@/data/enquiries";
import { whatsappHrefFor } from "@/data/site";
import { IconWhatsApp } from "@/components/Icon";

/**
 * Everything the website collected, by category, newest first.
 *
 * Unread is the default view: an enquiry counts as read once someone on
 * the team opens it, and can be marked unread again to hand it over.
 */
export default function EnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  const [category, setCategory] = useState<EnquiryCategory | "all">("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const unread = (c: EnquiryCategory | "all") =>
    enquiries.filter((e) => !e.readAt && (c === "all" || e.category === c)).length;

  const shown = enquiries.filter(
    (e) => (category === "all" || e.category === category) && (!unreadOnly || !e.readAt)
  );

  const openOne = (e: Enquiry) => {
    const next = open === e.id ? null : e.id;
    setOpen(next);
    // Opening it is reading it.
    if (next && !e.readAt) start(() => void setRead(e.id, e.category, true));
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Tab
          active={category === "all"}
          count={unread("all")}
          onClick={() => setCategory("all")}
        >
          All
        </Tab>
        {ENQUIRY_CATEGORIES.map((c) => (
          <Tab
            key={c.key}
            active={category === c.key}
            count={unread(c.key)}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </Tab>
        ))}
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-body">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-brand)]"
          />
          Unread only
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-8 text-center text-body">
          {enquiries.length === 0
            ? "Nothing has come in yet."
            : "Nothing here with those filters."}
        </p>
      ) : (
        <ul aria-label="Enquiries" className="space-y-2.5">
          {shown.map((e) => (
            <li key={e.id}>
              <EnquiryRow
                enquiry={e}
                open={open === e.id}
                busy={pending}
                onOpen={() => openOne(e)}
                onToggleRead={() =>
                  start(() => void setRead(e.id, e.category, !e.readAt))
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Tab({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
        active ? "bg-brand text-white" : "border border-line-strong bg-surface text-body hover:border-brand"
      }`}
    >
      {children}
      {count > 0 && (
        <span
          className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11.5px] ${
            active ? "bg-white/25 text-white" : "bg-brand text-white"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

const CATEGORY_LABEL = Object.fromEntries(
  ENQUIRY_CATEGORIES.map((c) => [c.key, c.label])
) as Record<EnquiryCategory, string>;

function when(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function EnquiryRow({
  enquiry: e,
  open,
  busy,
  onOpen,
  onToggleRead,
}: {
  enquiry: Enquiry;
  open: boolean;
  busy: boolean;
  onOpen: () => void;
  onToggleRead: () => void;
}) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [opening, setOpening] = useState<string | null>(null);

  const openFile = async (path: string) => {
    setOpening(path);
    const result = await applicationFileUrl(path);
    setOpening(null);
    setFileError(result.error ?? null);
    if (result.url) window.open(result.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-surface transition-colors ${
        e.readAt ? "border-line" : "border-brand/40 bg-brand-50/30"
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span
          aria-hidden
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${e.readAt ? "bg-line-strong" : "bg-brand"}`}
        />
        <span className="min-w-0 grow">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`text-[15px] ${e.readAt ? "font-semibold text-ink" : "font-bold text-ink"}`}>
              {e.name || e.email || "Someone"}
            </span>
            <span className="rounded-full bg-bg-alt px-2.5 py-0.5 text-[11.5px] font-semibold text-body">
              {CATEGORY_LABEL[e.category]}
            </span>
            {!e.readAt && (
              <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11.5px] font-semibold text-white">
                New
              </span>
            )}
          </span>
          <span className="mt-0.5 block truncate text-[13.5px] text-body">
            {[e.subject, e.location, e.phone].filter(Boolean).join(" · ") || "—"}
          </span>
        </span>
        <span className="shrink-0 text-[12.5px] text-muted">{when(e.createdAt)}</span>
      </button>

      {open && (
        <div className="border-t border-line px-4 pb-4 pt-3 text-sm">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            <Detail label="Mobile" value={e.phone} />
            <Detail label="Email" value={e.email} />
            <Detail label={e.category === "application" ? "Role" : "Needs help with"} value={e.subject} />
            <Detail label={e.category === "application" ? "Based in" : "Property location"} value={e.location} />
            <Detail label="Experience" value={e.experience} />
            <Detail label="Preferred contact" value={e.channel} />
            <Detail label="Call at" value={e.callTime} />
            <Detail label="From page" value={e.page} />
          </dl>

          {e.message && (
            <p className="mt-3 whitespace-pre-wrap rounded-xl bg-bg-alt p-3 leading-relaxed text-body">
              {e.message}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {e.cvPath && (
              <button
                type="button"
                onClick={() => openFile(e.cvPath!)}
                disabled={opening === e.cvPath}
                className="btn-dark justify-center px-4 py-2.5 text-[13px] disabled:opacity-60"
              >
                {opening === e.cvPath ? "Opening…" : `Open CV${e.cvName ? ` (${e.cvName})` : ""}`}
              </button>
            )}
            {e.coverPath && (
              <button
                type="button"
                onClick={() => openFile(e.coverPath!)}
                disabled={opening === e.coverPath}
                className="btn-ghost justify-center px-4 py-2.5 text-[13px] disabled:opacity-60"
              >
                {opening === e.coverPath ? "Opening…" : "Open cover letter"}
              </button>
            )}
            {e.phone && (
              <a
                href={whatsappHrefFor(e.phone, `Hi ${e.name ?? "there"}, this is PropITZ following up on your enquiry.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost justify-center gap-2 px-4 py-2.5 text-[13px]"
              >
                <IconWhatsApp size={15} className="text-whatsapp" />
                WhatsApp
              </a>
            )}
            {e.email && (
              <a href={`mailto:${e.email}`} className="btn-ghost justify-center px-4 py-2.5 text-[13px]">
                Email
              </a>
            )}
            <button
              type="button"
              onClick={onToggleRead}
              disabled={busy}
              className="ml-auto text-[13px] font-semibold text-brand disabled:opacity-60"
            >
              {e.readAt ? "Mark unread" : "Mark read"}
            </button>
          </div>

          {fileError && <p className="mt-2 text-[13px] text-red-700">{fileError}</p>}
          {e.readAt && (
            <p className="mt-2 text-[12px] text-muted">Read {when(e.readAt)}</p>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint">{label}</dt>
      <dd className="text-body">{value}</dd>
    </div>
  );
}
