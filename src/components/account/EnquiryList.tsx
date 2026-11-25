"use client";

import { useState, useTransition } from "react";
import {
  applicationFileUrl,
  logEntry,
  markSeen,
  transitionEnquiry,
} from "@/app/account/enquiries/actions";
import {
  CALL_OUTCOMES,
  CASE_STATES,
  CLOSURE_LABEL,
  CLOSURE_REASONS,
  ENQUIRY_CATEGORIES,
  OUTCOME_LABEL,
  STATUS_LABEL,
  isCaseCategory,
  permittedMoves,
  type CallOutcome,
  type ClosureReason,
  type Enquiry,
  type EnquiryCategory,
  type EnquiryEvent,
  type EnquiryStatus,
  type Move,
} from "@/data/enquiries";
import { whatsappHrefFor } from "@/data/site";
import { IconWhatsApp } from "@/components/Icon";
import { field } from "@/components/fieldClass";

type StateFilter = EnquiryStatus | "all" | "active";

/**
 * Everything the website collected, by category, newest first.
 *
 * Requests and seller callbacks are cases (Requirements v2.0, sections 11
 * and 16): each has a PRZ reference and moves through the case states,
 * one permitted step at a time, with a reason wherever the step needs
 * one. Everything else is simply open or closed. Every change, note and
 * call lands on the enquiry's timeline.
 */
export default function EnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  const [category, setCategory] = useState<EnquiryCategory | "all">("all");
  const [state, setState] = useState<StateFilter>("active");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [, start] = useTransition();

  const unseen = (c: EnquiryCategory | "all") =>
    enquiries.filter((e) => !e.readAt && (c === "all" || e.category === c)).length;

  const q = query.trim().toLowerCase();
  const shown = enquiries.filter(
    (e) =>
      (category === "all" || e.category === category) &&
      (state === "all" || (state === "active" ? e.status !== "closed" : e.status === state)) &&
      (!q || matches(e, q))
  );

  const openOne = (e: Enquiry) => {
    const next = open === e.id ? null : e.id;
    setOpen(next);
    if (next && !e.readAt) start(() => void markSeen(e.id, e.category));
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Tab active={category === "all"} count={unseen("all")} onClick={() => setCategory("all")}>
          All
        </Tab>
        {ENQUIRY_CATEGORIES.map((c) => (
          <Tab key={c.key} active={category === c.key} count={unseen(c.key)} onClick={() => setCategory(c.key)}>
            {c.label}
          </Tab>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Reference, name, phone or email"
          aria-label="Search enquiries"
          className={`${field} min-w-0 grow basis-60 py-2.5`}
        />
        <select
          value={state}
          onChange={(e) => setState(e.target.value as StateFilter)}
          aria-label="State"
          className={`${field} w-auto py-2.5`}
        >
          <option value="active">Not closed</option>
          <option value="all">All</option>
          {CASE_STATES.map((s) => (
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

/** Search across the reference and contact details. "2611-0042" finds PRZ-2611-0042. */
function matches(e: Enquiry, q: string) {
  return [e.reference, e.name, e.phone, e.email, e.subject, e.location]
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
          title="Not yet opened"
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

/** Muted, and always with its text label (FR-DA-11). */
const STATUS_STYLE: Record<EnquiryStatus, string> = {
  new: "bg-brand text-white",
  open: "bg-brand-50 text-brand-dark ring-1 ring-brand-100",
  contacted: "bg-brand-50 text-brand-dark ring-1 ring-brand-100",
  awaiting_data: "bg-warn-50 text-warn-ink",
  assigned: "bg-accent-50 text-accent-deep",
  in_progress: "bg-accent-50 text-accent-deep",
  completed: "bg-ok-50 text-ok-ink",
  closed: "bg-bg-alt text-body",
};

function StatusPill({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function when(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

/** "3 days", "5 hours" — how long it has sat in its current state. */
function age(iso: string | null) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;
  const h = Math.floor(ms / 3_600_000);
  if (h < 1) return "under an hour";
  if (h < 48) return `${h} hour${h === 1 ? "" : "s"}`;
  const d = Math.floor(h / 24);
  return `${d} days`;
}

function EnquiryRow({ enquiry: e, open, onOpen }: { enquiry: Enquiry; open: boolean; onOpen: () => void }) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const isCase = isCaseCategory(e.category);
  const unseen = !e.readAt;
  const notes = e.events.filter((v) => v.type !== "status_change").length;

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
        unseen ? "border-brand/40 bg-brand-50/30" : "border-line"
      } ${e.status === "closed" ? "opacity-75" : ""}`}
    >
      <button type="button" onClick={onOpen} aria-expanded={open} className="flex w-full items-start gap-3 p-4 text-left">
        <span
          aria-hidden
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${unseen ? "bg-brand" : "bg-line-strong"}`}
        />
        <span className="min-w-0 grow">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {e.reference && <span className="font-mono text-[12.5px] font-semibold text-muted">{e.reference}</span>}
            <span className={`text-[15px] text-ink ${unseen ? "font-bold" : "font-semibold"}`}>
              {e.name || e.email || "Someone"}
            </span>
            <span className="rounded-full bg-bg-alt px-2.5 py-0.5 text-[11.5px] font-semibold text-body">
              {CATEGORY_LABEL[e.category]}
            </span>
            <StatusPill status={e.status} />
            {unseen && <span className="sr-only">Not yet opened</span>}
          </span>
          <span className="mt-0.5 block truncate text-[13.5px] text-body">
            {[e.subject, e.location, e.phone].filter(Boolean).join(" · ") || "—"}
          </span>
        </span>
        <span className="shrink-0 text-right text-[12.5px] text-muted">
          {when(e.createdAt)}
          {isCase && e.status !== "closed" && age(e.statusChangedAt) && (
            <span className="mt-0.5 block">
              {STATUS_LABEL[e.status]} for {age(e.statusChangedAt)}
            </span>
          )}
          {notes > 0 && (
            <span className="mt-0.5 block">
              {notes} {notes === 1 ? "entry" : "entries"}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="border-t border-line px-4 pb-4 pt-3 text-sm">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            <Detail label="Reference" value={e.reference} />
            <Detail label="Mobile" value={e.phone} />
            <Detail label="Email" value={e.email} />
            <Detail
              label={e.category === "professional" ? "Profession" : e.category === "application" ? "Role" : "Needs help with"}
              value={e.profession ?? e.subject}
            />
            <Detail
              label={
                e.category === "professional" ? "Areas covered" : e.category === "application" ? "Based in" : "Property location"
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
            <p className="mt-3 whitespace-pre-wrap rounded-xl bg-bg-alt p-3 leading-relaxed text-body">{e.message}</p>
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
                  `Hi ${e.name ?? "there"}, this is PropITZ following up on your request${e.reference ? ` ${e.reference}` : ""}.`
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
                href={`mailto:${e.email}${e.reference ? `?subject=${encodeURIComponent(`Your PropITZ request ${e.reference}`)}` : ""}`}
                className="btn-ghost justify-center px-4 py-2.5 text-[13px]"
              >
                Email
              </a>
            )}
          </div>

          {fileError && <p className="mt-2 text-[13px] text-red-700">{fileError}</p>}

          <StatePanel enquiry={e} />
          <LogPanel enquiry={e} />
          <Timeline events={e.events} />
        </div>
      )}
    </div>
  );
}

const label = "mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint";

/** The current state, and the next steps the transition table permits. */
function StatePanel({ enquiry: e }: { enquiry: Enquiry }) {
  const isCase = isCaseCategory(e.category);
  const moves = permittedMoves(e.status, isCase, e.resumeStatus);
  const [pick, setPick] = useState<number>(-1);
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState<CallOutcome | "">("");
  const [reason, setReason] = useState<ClosureReason | "">("");
  const [error, setError] = useState<string | null>(null);
  const [saving, start] = useTransition();

  // A new state means a new set of moves.
  const [seen, setSeen] = useState(e.status);
  if (seen !== e.status) {
    setSeen(e.status);
    setPick(-1);
    setNote("");
    setOutcome("");
    setReason("");
  }

  const move: Move | undefined = moves[pick];
  const noteRequired =
    !!move?.note || (move?.closure && (reason === "other" || reason === "transferred"));
  const ready =
    !!move &&
    (!move.outcome || outcome !== "") &&
    (!move.closure || reason !== "") &&
    (!noteRequired || note.trim().length > 0);

  const save = () =>
    move &&
    start(async () => {
      setError(null);
      const result = await transitionEnquiry(e.id, e.category, {
        to: move.to,
        note,
        outcome: outcome || undefined,
        closureReason: reason || undefined,
      });
      if (result.error) setError(result.error);
    });

  const noteLabel = move?.note
    ? move.note
    : move?.closure
      ? reason === "transferred"
        ? "The reference it was transferred or merged into (PRZ-…)"
        : reason === "other"
          ? "Describe the reason"
          : "Note (optional)"
      : "Note (optional)";

  return (
    <div className="mt-5 rounded-xl border border-line bg-bg p-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className={label + " mb-0"}>State</span>
        <StatusPill status={e.status} />
        {e.status === "awaiting_data" && e.resumeStatus && (
          <span className="text-[12.5px] text-muted">paused from {STATUS_LABEL[e.resumeStatus]}</span>
        )}
        {e.statusChangedAt && <span className="text-[12.5px] text-muted">since {when(e.statusChangedAt)}</span>}
      </div>
      {e.status === "closed" && e.closureReason && (
        <p className="mt-2 text-[13px] text-body">
          Closed: <strong className="font-semibold text-ink">{CLOSURE_LABEL[e.closureReason]}</strong>
          {e.closureNote ? ` — ${e.closureNote}` : ""}
        </p>
      )}

      {moves.length > 0 && (
        <div className="mt-4">
          <label className="block">
            <span className={label}>Next step</span>
            <select
              value={pick}
              onChange={(ev) => {
                setPick(Number(ev.target.value));
                setError(null);
              }}
              className={`${field} w-auto max-w-full py-2.5`}
            >
              <option value={-1}>Choose…</option>
              {moves.map((m, i) => (
                <option key={`${m.to}-${i}`} value={i}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          {move?.outcome && (
            <label className="mt-3 block">
              <span className={label}>How the contact went</span>
              <select
                value={outcome}
                onChange={(ev) => setOutcome(ev.target.value as CallOutcome)}
                className={`${field} w-auto py-2.5`}
              >
                <option value="">Choose…</option>
                {CALL_OUTCOMES.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {move?.closure && (
            <label className="mt-3 block">
              <span className={label}>Closure reason</span>
              <select
                value={reason}
                onChange={(ev) => setReason(ev.target.value as ClosureReason)}
                className={`${field} w-auto max-w-full py-2.5`}
              >
                <option value="">Choose…</option>
                {CLOSURE_REASONS.filter((r) => r.key !== "service_completed" || e.status === "completed").map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {move && (
            <label className="mt-3 block">
              <span className={label}>{noteLabel}</span>
              <textarea
                value={note}
                onChange={(ev) => setNote(ev.target.value)}
                rows={2}
                maxLength={4000}
                className={field}
              />
            </label>
          )}

          {move && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={save}
                disabled={!ready || saving}
                className="btn-primary justify-center px-5 py-2.5 text-[13px] disabled:opacity-50"
              >
                {saving ? "Saving…" : `Move to ${STATUS_LABEL[move.to]}`}
              </button>
              {error && <p className="text-[13px] text-red-700">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** A note or a call, added to the timeline without changing the state. */
function LogPanel({ enquiry: e }: { enquiry: Enquiry }) {
  const [type, setType] = useState<"note" | "call">("note");
  const [body, setBody] = useState("");
  const [outcome, setOutcome] = useState<CallOutcome | "">("");
  const [error, setError] = useState<string | null>(null);
  const [saving, start] = useTransition();

  const ready = type === "note" ? body.trim().length > 0 : outcome !== "";

  const save = () =>
    start(async () => {
      setError(null);
      const result = await logEntry(e.id, e.category, { type, body, outcome: outcome || undefined });
      if (result.error) setError(result.error);
      else {
        setBody("");
        setOutcome("");
      }
    });

  return (
    <div className="mt-3 rounded-xl border border-line bg-bg p-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Add to the timeline">
        {(["note", "call"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            aria-pressed={type === t}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${
              type === t ? "bg-ink text-white" : "border border-line-strong bg-surface text-body"
            }`}
          >
            {t === "note" ? "Internal note" : "Log a call"}
          </button>
        ))}
        <span className="text-[12px] text-muted">Internal — the customer never sees these.</span>
      </div>

      {type === "call" && (
        <select
          value={outcome}
          onChange={(ev) => setOutcome(ev.target.value as CallOutcome)}
          aria-label="Call outcome"
          className={`${field} mt-3 w-auto py-2.5`}
        >
          <option value="">How did the call go?</option>
          {CALL_OUTCOMES.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      <textarea
        value={body}
        onChange={(ev) => setBody(ev.target.value)}
        rows={2}
        maxLength={4000}
        aria-label={type === "note" ? "Note" : "Call summary"}
        placeholder={type === "note" ? "What happened, or what the next person should know" : "Summary (optional)"}
        className={`${field} mt-3`}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!ready || saving}
          className="btn-ghost justify-center px-5 py-2.5 text-[13px] disabled:opacity-50"
        >
          {saving ? "Saving…" : type === "note" ? "Add note" : "Log call"}
        </button>
        {error && <p className="text-[13px] text-red-700">{error}</p>}
      </div>
    </div>
  );
}

function Timeline({ events }: { events: EnquiryEvent[] }) {
  if (events.length === 0) return <p className="mt-4 text-[13px] text-muted">Nothing on the timeline yet.</p>;

  return (
    <div className="mt-5">
      <p className={label}>Timeline</p>
      <ol aria-label="Timeline" className="space-y-2.5 border-l-2 border-line pl-4">
        {[...events].reverse().map((v) => (
          <li key={v.id} className="relative">
            <span aria-hidden className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-line-strong" />
            <p className="text-[13px] text-body">
              {v.type === "status_change" ? (
                <>
                  {v.fromStatus ? `${STATUS_LABEL[v.fromStatus]} → ` : ""}
                  <strong className="font-semibold text-ink">{v.toStatus ? STATUS_LABEL[v.toStatus] : "—"}</strong>
                  {v.closureReason && ` · ${CLOSURE_LABEL[v.closureReason]}`}
                </>
              ) : v.type === "call" ? (
                <>
                  <strong className="font-semibold text-ink">Call</strong>
                  {v.callOutcome && ` · ${OUTCOME_LABEL[v.callOutcome]}`}
                </>
              ) : v.type === "data_request" ? (
                <strong className="font-semibold text-ink">Requested from the customer</strong>
              ) : (
                <strong className="font-semibold text-ink">Note</strong>
              )}
            </p>
            {v.body && (
              <p className="mt-1 whitespace-pre-wrap rounded-lg bg-surface p-2.5 text-[13.5px] leading-relaxed text-ink ring-1 ring-line">
                {v.body}
              </p>
            )}
            <p className="mt-0.5 text-[12px] text-muted">
              {v.author}
              {v.authorRole === "lead" ? " (lead)" : ""} · {when(v.createdAt)}
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
