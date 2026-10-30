"use client";

import { useState, useTransition } from "react";
import { applicationFileUrl, updateEnquiry } from "@/app/account/enquiries/actions";
import {
  ENQUIRY_CATEGORIES,
  ENQUIRY_STATUSES,
  STATUS_LABEL,
  formatTicket,
  type Enquiry,
  type EnquiryActivity,
  type EnquiryCategory,
  type EnquiryStatus,
} from "@/data/enquiries";
import { whatsappHrefFor } from "@/data/site";
import { IconWhatsApp } from "@/components/Icon";
import { field } from "@/components/fieldClass";

type StatusFilter = EnquiryStatus | "all" | "open";

/**
 * Everything the website collected, by category, newest first.
 *
 * Each enquiry carries a ticket number and a status. Opening an unread one
 * marks it read; from there the team moves it through in progress, on hold
 * and closed, leaving comments as they go, so anyone can see what happened.
 */
export default function EnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  const [category, setCategory] = useState<EnquiryCategory | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [, start] = useTransition();

  const unread = (c: EnquiryCategory | "all") =>
    enquiries.filter((e) => e.status === "unread" && (c === "all" || e.category === c)).length;

  const q = query.trim().toLowerCase();
  const shown = enquiries.filter(
    (e) =>
      (category === "all" || e.category === category) &&
      (status === "all" || (status === "open" ? e.status !== "closed" : e.status === status)) &&
      (!q || matches(e, q))
  );

  const openOne = (e: Enquiry) => {
    const next = open === e.id ? null : e.id;
    setOpen(next);
    // Opening it is reading it.
    if (next && e.status === "unread") start(() => void updateEnquiry(e.id, e.category, { status: "read" }));
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Tab active={category === "all"} count={unread("all")} onClick={() => setCategory("all")}>
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
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ticket number, name, phone or email"
          aria-label="Search enquiries"
          className={`${field} min-w-0 grow basis-60 py-2.5`}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          aria-label="Status"
          className={`${field} w-auto py-2.5`}
        >
          <option value="all">All statuses</option>
          <option value="open">Open (not closed)</option>
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-8 text-center text-body">
          {enquiries.length === 0 ? "Nothing has come in yet." : "Nothing here with those filters."}
        </p>
      ) : (
        <ul aria-label="Enquiries" className="space-y-2.5">
          {shown.map((e) => (
            <li key={e.id}>
              <EnquiryRow enquiry={e} open={open === e.id} onOpen={() => openOne(e)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Search across the ticket number and the contact details. "42" finds PZ-00042. */
function matches(e: Enquiry, q: string) {
  const digits = q.replace(/^pz-?/, "");
  if (e.ticketNo !== null && /^\d+$/.test(digits) && Number(digits) === e.ticketNo) return true;
  return [formatTicket(e.ticketNo), e.name, e.phone, e.email, e.subject, e.location]
    .filter(Boolean)
    .some((v) => v!.toLowerCase().includes(q));
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

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  unread: "bg-brand text-white",
  read: "bg-bg-alt text-body",
  in_progress: "bg-brand-50 text-brand-dark ring-1 ring-brand-100",
  on_hold: "bg-warn-50 text-warn-ink",
  closed: "bg-ok-50 text-ok-ink",
};

function StatusPill({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

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
  onOpen,
}: {
  enquiry: Enquiry;
  open: boolean;
  onOpen: () => void;
}) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const ticket = formatTicket(e.ticketNo);

  const openFile = async (path: string) => {
    setOpening(path);
    const result = await applicationFileUrl(path);
    setOpening(null);
    setFileError(result.error ?? null);
    if (result.url) window.open(result.url, "_blank", "noopener,noreferrer");
  };

  const isUnread = e.status === "unread";

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-surface transition-colors ${
        isUnread ? "border-brand/40 bg-brand-50/30" : "border-line"
      } ${e.status === "closed" ? "opacity-75" : ""}`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span
          aria-hidden
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${isUnread ? "bg-brand" : "bg-line-strong"}`}
        />
        <span className="min-w-0 grow">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {ticket && (
              <span className="font-mono text-[12.5px] font-semibold text-muted">{ticket}</span>
            )}
            <span className={`text-[15px] ${isUnread ? "font-bold text-ink" : "font-semibold text-ink"}`}>
              {e.name || e.email || "Someone"}
            </span>
            <span className="rounded-full bg-bg-alt px-2.5 py-0.5 text-[11.5px] font-semibold text-body">
              {CATEGORY_LABEL[e.category]}
            </span>
            <StatusPill status={e.status} />
          </span>
          <span className="mt-0.5 block truncate text-[13.5px] text-body">
            {[e.subject, e.location, e.phone].filter(Boolean).join(" · ") || "—"}
          </span>
        </span>
        <span className="shrink-0 text-right text-[12.5px] text-muted">
          {when(e.createdAt)}
          {e.activity.some((a) => a.kind === "comment") && (
            <span className="mt-0.5 block">
              {e.activity.filter((a) => a.kind === "comment").length} comment
              {e.activity.filter((a) => a.kind === "comment").length === 1 ? "" : "s"}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="border-t border-line px-4 pb-4 pt-3 text-sm">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            <Detail label="Ticket" value={ticket} />
            <Detail label="Mobile" value={e.phone} />
            <Detail label="Email" value={e.email} />
            <Detail
              label={
                e.category === "professional"
                  ? "Profession"
                  : e.category === "application"
                    ? "Role"
                    : "Needs help with"
              }
              value={e.profession ?? e.subject}
            />
            <Detail
              label={
                e.category === "professional"
                  ? "Areas covered"
                  : e.category === "application"
                    ? "Based in"
                    : "Property location"
              }
              value={e.location}
            />
            <Detail label="Experience" value={e.experience} />
            <Detail label="Company" value={e.employer} />
            <Detail label="Licence / registration" value={e.licence} />
            <Detail label="Availability" value={e.availability} />
            <Detail label="Services offered" value={e.services} />
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
                {opening === e.cvPath
                  ? "Opening…"
                  : `Open ${e.category === "professional" ? "profile" : "CV"}${e.cvName ? ` (${e.cvName})` : ""}`}
              </button>
            )}
            {e.credentialsPath && (
              <button
                type="button"
                onClick={() => openFile(e.credentialsPath!)}
                disabled={opening === e.credentialsPath}
                className="btn-ghost justify-center px-4 py-2.5 text-[13px] disabled:opacity-60"
              >
                {opening === e.credentialsPath ? "Opening…" : "Open credentials"}
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
                href={whatsappHrefFor(
                  e.phone,
                  `Hi ${e.name ?? "there"}, this is PropITZ following up on your enquiry${ticket ? ` (${ticket})` : ""}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost justify-center gap-2 px-4 py-2.5 text-[13px]"
              >
                <IconWhatsApp size={15} className="text-whatsapp" />
                WhatsApp
              </a>
            )}
            {e.email && (
              <a
                href={`mailto:${e.email}${ticket ? `?subject=${encodeURIComponent(`Your PropITZ enquiry ${ticket}`)}` : ""}`}
                className="btn-ghost justify-center px-4 py-2.5 text-[13px]"
              >
                Email
              </a>
            )}
          </div>

          {fileError && <p className="mt-2 text-[13px] text-red-700">{fileError}</p>}

          <Workflow enquiry={e} />
        </div>
      )}
    </div>
  );
}

/** Status, a new comment, and the trail of what has happened so far. */
function Workflow({ enquiry: e }: { enquiry: Enquiry }) {
  const [status, setStatus] = useState<EnquiryStatus>(e.status);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, start] = useTransition();

  // Follow changes made elsewhere (opening it marks it read).
  const [seen, setSeen] = useState(e.status);
  if (seen !== e.status) {
    setSeen(e.status);
    setStatus(e.status);
  }

  const changed = status !== e.status;
  const canSave = (changed || note.trim().length > 0) && !saving;

  const save = () =>
    start(async () => {
      setError(null);
      const result = await updateEnquiry(e.id, e.category, {
        status: changed ? status : undefined,
        note,
      });
      if (result.error) setError(result.error);
      else setNote("");
    });

  return (
    <div className="mt-5 rounded-xl border border-line bg-bg p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint">
            Status
          </span>
          <select
            value={status}
            onChange={(ev) => setStatus(ev.target.value as EnquiryStatus)}
            className={`${field} w-auto py-2.5`}
          >
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        {e.readAt && (
          <p className="pb-3 text-[12px] text-muted">First opened {when(e.readAt)}</p>
        )}
      </div>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint">
          Comment
        </span>
        <textarea
          value={note}
          onChange={(ev) => setNote(ev.target.value)}
          rows={3}
          maxLength={4000}
          placeholder="What happened — a call, a visit, what they need next…"
          className={field}
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className="btn-primary justify-center px-5 py-2.5 text-[13px] disabled:opacity-50"
        >
          {saving ? "Saving…" : changed && note.trim() ? "Save status and comment" : changed ? "Save status" : "Add comment"}
        </button>
        {error && <p className="text-[13px] text-red-700">{error}</p>}
      </div>

      <History activity={e.activity} />
    </div>
  );
}

function History({ activity }: { activity: EnquiryActivity[] }) {
  if (activity.length === 0) {
    return <p className="mt-4 text-[13px] text-muted">No history yet.</p>;
  }

  return (
    <div className="mt-5">
      <p className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint">History</p>
      <ol aria-label="History" className="space-y-2.5 border-l-2 border-line pl-4">
        {[...activity].reverse().map((a) => (
          <li key={a.id} className="relative">
            <span aria-hidden className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-line-strong" />
            {a.kind === "status" ? (
              <p className="text-[13px] text-body">
                {a.fromStatus ? `${STATUS_LABEL[a.fromStatus]} → ` : "Set to "}
                <strong className="font-semibold text-ink">
                  {a.toStatus ? STATUS_LABEL[a.toStatus] : "—"}
                </strong>
              </p>
            ) : (
              <p className="whitespace-pre-wrap rounded-lg bg-surface p-2.5 text-[13.5px] leading-relaxed text-ink ring-1 ring-line">
                {a.body}
              </p>
            )}
            <p className="mt-0.5 text-[12px] text-muted">
              {a.author} · {when(a.createdAt)}
            </p>
          </li>
        ))}
      </ol>
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
