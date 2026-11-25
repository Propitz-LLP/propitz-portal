"use client";

import { useState, useTransition } from "react";
import {
  applicationFileUrl,
  logEntry,
  markSeen,
  setOwner,
  setPriority,
  transitionEnquiry,
  type LogType,
} from "@/app/account/enquiries/actions";
import { useQueryState } from "@/components/marketplace/useQueryState";
import {
  CALL_OUTCOMES,
  CASE_STATES,
  CLOSURE_LABEL,
  CLOSURE_REASONS,
  ENQUIRY_CATEGORIES,
  ORIGINS,
  ORIGIN_LABEL,
  OUTCOME_LABEL,
  PRIORITIES,
  PRIORITY_LABEL,
  STATUS_LABEL,
  isCaseCategory,
  permittedMoves,
  type CallOutcome,
  type ClosureReason,
  type ConsoleViewer,
  type Enquiry,
  type EnquiryCategory,
  type EnquiryEvent,
  type EnquiryStatus,
  type Move,
  type Origin,
  type Priority,
  type TeamMember,
} from "@/data/enquiries";
import { whatsappHrefFor } from "@/data/site";
import { IconWhatsApp } from "@/components/Icon";
import { field } from "@/components/fieldClass";
import { awaitingMs, formatDuration } from "@/lib/enquiryReports";

type StateFilter = EnquiryStatus | "all" | "active";
type Queue = "all" | "unassigned" | "mine" | "callbacks";
type Sort = "newest" | "priority" | "stale";

type Filters = {
  category: EnquiryCategory | "all";
  state: StateFilter;
  queue: Queue;
  priority: Priority | "all";
  origin: Origin | "all";
  sort: Sort;
  q: string;
};

const CATEGORY_KEYS = ENQUIRY_CATEGORIES.map((c) => c.key) as string[];
const STATE_KEYS = ["all", "active", "open", ...CASE_STATES.map((s) => s.key)] as string[];
const PRIORITY_RANK: Record<Priority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

/** Filters live in the URL, so a view can be bookmarked or shared (FR-CS-02). */
const readFilters = (p: URLSearchParams): Filters => {
  const pick = <T extends string>(k: string, allowed: readonly string[], fallback: T) =>
    (allowed.includes(p.get(k) ?? "") ? p.get(k) : fallback) as T;
  return {
    category: pick("type", CATEGORY_KEYS, "all"),
    state: pick("state", STATE_KEYS, "active"),
    queue: pick("queue", ["unassigned", "mine", "callbacks"], "all"),
    priority: pick("priority", PRIORITIES.map((x) => x.key), "all"),
    origin: pick("origin", ORIGINS.map((x) => x.key), "all"),
    sort: pick("sort", ["priority", "stale"], "newest"),
    q: (p.get("q") ?? "").slice(0, 100),
  };
};

const writeFilters = (f: Filters): Record<string, string> => {
  const out: Record<string, string> = {};
  if (f.category !== "all") out.type = f.category;
  if (f.state !== "active") out.state = f.state;
  if (f.queue !== "all") out.queue = f.queue;
  if (f.priority !== "all") out.priority = f.priority;
  if (f.origin !== "all") out.origin = f.origin;
  if (f.sort !== "newest") out.sort = f.sort;
  if (f.q) out.q = f.q;
  return out;
};

/**
 * Everything the website collected, by category, newest first.
 *
 * Requests and seller callbacks are cases (Requirements v2.0, sections 11
 * and 16): each has a PRZ reference and moves through the case states,
 * one permitted step at a time, with a reason wherever the step needs
 * one. Everything else is simply open or closed. Every change, note and
 * call lands on the enquiry's timeline.
 */
export default function EnquiryList({
  enquiries,
  viewer,
  team,
}: {
  enquiries: Enquiry[];
  viewer: ConsoleViewer;
  team: TeamMember[];
}) {
  const [filters, setFilters] = useQueryState(readFilters, writeFilters, []);
  const { category, state, queue, priority, origin, sort } = filters;
  const set = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });
  const [open, setOpen] = useState<string | null>(null);
  const [, start] = useTransition();
  const me = viewer.email.toLowerCase();

  const unseen = (c: EnquiryCategory | "all") =>
    enquiries.filter((e) => !e.readAt && (c === "all" || e.category === c)).length;

  const inQueue = (e: Enquiry, key: Queue) =>
    key === "all" ||
    (key === "callbacks"
      ? !!e.callbackDue
      : isCaseCategory(e.category) && (key === "unassigned" ? !e.ownerEmail : e.ownerEmail === me));

  const q = filters.q.trim().toLowerCase();
  const shown = enquiries
    .filter(
      (e) =>
        (category === "all" || e.category === category) &&
        (state === "all" || (state === "active" ? e.status !== "closed" : e.status === state)) &&
        inQueue(e, queue) &&
        (priority === "all" || e.priority === priority) &&
        (origin === "all" || e.origin === origin) &&
        (!q || matches(e, q))
    )
    .sort((a, b) =>
      // Callbacks: soonest (or most overdue) first, whatever the sort says.
      queue === "callbacks"
        ? (a.callbackDue ?? "").localeCompare(b.callbackDue ?? "")
        : sort === "priority"
        ? PRIORITY_RANK[a.priority ?? "normal"] - PRIORITY_RANK[b.priority ?? "normal"] ||
          b.createdAt.localeCompare(a.createdAt)
        : sort === "stale"
          ? a.lastActivityAt.localeCompare(b.lastActivityAt)
          : b.createdAt.localeCompare(a.createdAt)
    );

  const openOne = (e: Enquiry) => {
    const next = open === e.id ? null : e.id;
    setOpen(next);
    if (next && !e.readAt) start(() => void markSeen(e.id, e.category));
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Tab active={category === "all"} count={unseen("all")} onClick={() => set({ category: "all" })}>
          All
        </Tab>
        {ENQUIRY_CATEGORIES.map((c) => (
          <Tab key={c.key} active={category === c.key} count={unseen(c.key)} onClick={() => set({ category: c.key })}>
            {c.label}
          </Tab>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="flex w-full flex-wrap gap-2" role="group" aria-label="Queue">
          {(
            [
              ["all", "Everything"],
              ["unassigned", "Unassigned"],
              ["mine", "My cases"],
              ["callbacks", "Callbacks"],
            ] as const
          ).map(([key, text]) => (
            <button
              key={key}
              type="button"
              onClick={() => set({ queue: key })}
              aria-pressed={queue === key}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${
                queue === key ? "bg-ink text-white" : "border border-line-strong bg-surface text-body"
              }`}
            >
              {text}
              {key !== "all" && (
                <span className="ml-1.5 opacity-70">
                  {enquiries.filter((e) => e.status !== "closed" && isCaseCategory(e.category) && inQueue(e, key)).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={filters.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Reference, name, phone or email"
          aria-label="Search enquiries"
          className={`${field} min-w-0 grow basis-60 py-2.5`}
        />
        <select
          value={state}
          onChange={(e) => set({ state: e.target.value as StateFilter })}
          aria-label="State"
          className={`${field} w-auto py-2.5`}
        >
          <option value="active">Not closed</option>
          <option value="all">All states</option>
          {CASE_STATES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => set({ priority: e.target.value as Filters["priority"] })}
          aria-label="Priority"
          className={`${field} w-auto py-2.5`}
        >
          <option value="all">Any priority</option>
          {PRIORITIES.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          value={origin}
          onChange={(e) => set({ origin: e.target.value as Filters["origin"] })}
          aria-label="Came in by"
          className={`${field} w-auto py-2.5`}
        >
          <option value="all">Any source</option>
          {ORIGINS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => set({ sort: e.target.value as Sort })}
          aria-label="Sort"
          className={`${field} w-auto py-2.5`}
        >
          <option value="newest">Newest first</option>
          <option value="priority">Priority first</option>
          <option value="stale">Longest without activity</option>
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
              <EnquiryRow enquiry={e} open={open === e.id} onOpen={() => openOne(e)} viewer={viewer} team={team} />
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

/** How a pending callback reads, and how urgent it looks. */
function describeCallback(due: string): { text: string; tone: "overdue" | "today" | "later" } {
  const at = new Date(due);
  const now = new Date();
  const time = at.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const day = at.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const today = at.toDateString() === now.toDateString();
  if (at.getTime() < now.getTime()) return { text: `Callback overdue · ${today ? time : day}`, tone: "overdue" };
  if (today) return { text: `Callback today · ${time}`, tone: "today" };
  return { text: `Callback ${day} · ${time}`, tone: "later" };
}

/** A callback still to make: amber when due today, red once overdue. */
function CallbackBadge({ due }: { due: string }) {
  const { text, tone } = describeCallback(due);
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${
        tone === "overdue" ? "bg-red-50 text-red-700 ring-1 ring-red-200" : tone === "today" ? "bg-warn-50 text-warn-ink" : "bg-bg-alt text-body"
      }`}
    >
      {text}
    </span>
  );
}

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

/** "priya" from priya@propitz.com — enough to tell the team apart. */
const who = (email: string | null) => (email ? email.split("@")[0] : null);

function EnquiryRow({
  enquiry: e,
  open,
  onOpen,
  viewer,
  team,
}: {
  enquiry: Enquiry;
  open: boolean;
  onOpen: () => void;
  viewer: ConsoleViewer;
  team: TeamMember[];
}) {
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
            {(e.priority === "urgent" || e.priority === "high") && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${
                  e.priority === "urgent" ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-warn-50 text-warn-ink"
                }`}
              >
                {PRIORITY_LABEL[e.priority]}
              </span>
            )}
            {e.callbackDue && <CallbackBadge due={e.callbackDue} />}
            {unseen && <span className="sr-only">Not yet opened</span>}
          </span>
          <span className="mt-0.5 block truncate text-[13.5px] text-body">
            {[e.subject, e.location, e.phone].filter(Boolean).join(" · ") || "—"}
          </span>
          {isCase && (
            <span className="mt-0.5 block text-[12.5px] text-muted">
              {e.ownerEmail ? `Owner: ${who(e.ownerEmail)}` : "Unassigned"}
              {e.origin && e.origin !== "web_form" ? ` · ${ORIGIN_LABEL[e.origin]}` : ""}
            </span>
          )}
        </span>
        <span className="shrink-0 text-right text-[12.5px] text-muted">
          {when(e.createdAt)}
          {isCase && e.status !== "closed" && age(e.statusChangedAt) && (
            <span className="mt-0.5 block">
              {STATUS_LABEL[e.status]} for {age(e.statusChangedAt)}
            </span>
          )}
          {isCase && e.status !== "closed" && (
            <span className="mt-0.5 block">Last activity {age(e.lastActivityAt) ?? "just now"} ago</span>
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
            <Detail label="Came in by" value={e.origin ? ORIGIN_LABEL[e.origin] : null} />
            <Detail label="Opened by" value={e.createdBy} />
            <Detail
              label="Campaign"
              value={
                e.campaign
                  ? [e.campaign.utm_source, e.campaign.utm_medium, e.campaign.utm_campaign].filter(Boolean).join(" / ") ||
                    (e.campaign.gclid ? "Google Ads" : e.campaign.fbclid ? "Facebook / Instagram" : null)
                  : null
              }
            />
            <Detail label="Landed on" value={e.campaign?.landing ?? null} />
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

          {isCase && <OwnerPanel enquiry={e} viewer={viewer} team={team} />}
          <StatePanel enquiry={e} />
          <LogPanel enquiry={e} />
          <Timeline events={e.events} />
        </div>
      )}
    </div>
  );
}

const label = "mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint";

/**
 * Owner and priority (FR-QT-06, FR-CS-05). Anyone may claim an unassigned
 * case; only a lead assigns, reassigns or releases, giving a reason when
 * the case already had an owner. Anyone may change the priority.
 */
function OwnerPanel({ enquiry: e, viewer, team }: { enquiry: Enquiry; viewer: ConsoleViewer; team: TeamMember[] }) {
  const me = viewer.email.toLowerCase();
  const [owner, setOwnerPick] = useState(e.ownerEmail ?? "");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, start] = useTransition();

  const [seen, setSeen] = useState(e.ownerEmail);
  if (seen !== e.ownerEmail) {
    setSeen(e.ownerEmail);
    setOwnerPick(e.ownerEmail ?? "");
    setReason("");
  }

  const run = (fn: () => Promise<{ error?: string }>) =>
    start(async () => {
      setError(null);
      const result = await fn();
      if (result.error) setError(result.error);
    });

  const changed = (owner || null) !== e.ownerEmail;
  const needsReason = changed && !!e.ownerEmail;

  return (
    <div className="mt-5 rounded-xl border border-line bg-bg p-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className={label + " mb-0"}>Owner</span>
        <span className="text-[13.5px] text-ink">{e.ownerEmail ?? "Unassigned"}</span>
        {!e.ownerEmail && (
          <button
            type="button"
            disabled={saving}
            onClick={() => run(() => setOwner(e.id, me))}
            className="btn-ghost justify-center px-4 py-1.5 text-[12.5px] disabled:opacity-50"
          >
            Claim
          </button>
        )}
        <span className="ml-auto flex items-center gap-2">
          <span className={label + " mb-0"}>Priority</span>
          <select
            value={e.priority ?? "normal"}
            disabled={saving}
            onChange={(ev) => run(() => setPriority(e.id, ev.target.value as Priority))}
            aria-label="Case priority"
            className={`${field} w-auto py-1.5`}
          >
            {PRIORITIES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </span>
      </div>

      {viewer.isLead && (
        <div className="mt-3 flex flex-wrap items-end gap-2.5">
          <label className="block">
            <span className={label}>Assign to</span>
            <select
              value={owner}
              onChange={(ev) => setOwnerPick(ev.target.value)}
              className={`${field} w-auto max-w-full py-2`}
            >
              <option value="">Nobody (unassigned)</option>
              {team.map((t) => (
                <option key={t.email} value={t.email}>
                  {t.email}
                  {t.role === "admin" ? " (lead)" : ""}
                </option>
              ))}
            </select>
          </label>
          {needsReason && (
            <input
              value={reason}
              onChange={(ev) => setReason(ev.target.value)}
              placeholder="Reason for the change"
              aria-label="Reason for the change"
              maxLength={4000}
              className={`${field} min-w-0 grow basis-52 py-2`}
            />
          )}
          <button
            type="button"
            disabled={!changed || (needsReason && !reason.trim()) || saving}
            onClick={() => run(() => setOwner(e.id, owner || null, reason))}
            className="btn-ghost justify-center px-4 py-2 text-[12.5px] disabled:opacity-50"
          >
            Save owner
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-[13px] text-red-700">{error}</p>}
    </div>
  );
}

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
      {isCase && <WaitingLine enquiry={e} />}
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

/**
 * Time spent waiting on the customer, kept apart from the team’s own time
 * (FR-QT-10). Shown once a case has ever paused.
 */
function WaitingLine({ enquiry: e }: { enquiry: Enquiry }) {
  const ms = awaitingMs(e);
  if (ms <= 0) return null;
  return (
    <p className="mt-2 text-[12.5px] text-muted">
      Waiting on the customer: {formatDuration(ms)} in total{e.status === "awaiting_data" ? ", and counting" : ""}.
      Not counted against the team.
    </p>
  );
}

const LOG_TYPES = [
  { key: "note", label: "Internal note" },
  { key: "call", label: "Log a call" },
  { key: "meeting", label: "Office meeting" },
  { key: "site_visit", label: "Site visit" },
  { key: "callback", label: "Schedule a callback" },
] as const;

/**
 * Add to the timeline without changing the state (FR-MS-01/08): a note, a
 * call, an office meeting, a site visit, or a callback to make. Calls,
 * meetings and visits take a duration and the next action.
 */
function LogPanel({ enquiry: e }: { enquiry: Enquiry }) {
  const [type, setType] = useState<LogType>("note");
  const [body, setBody] = useState("");
  const [outcome, setOutcome] = useState<CallOutcome | "">("");
  const [duration, setDuration] = useState("");
  const [next, setNext] = useState("");
  const [when, setWhen] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, start] = useTransition();

  const timed = type === "call" || type === "meeting" || type === "site_visit";
  const ready =
    type === "call" ? outcome !== "" : type === "callback" ? when !== "" : body.trim().length > 0;

  const save = () =>
    start(async () => {
      setError(null);
      const result = await logEntry(e.id, e.category, {
        type,
        body,
        outcome: outcome || undefined,
        durationMinutes: timed && duration ? Number(duration) : null,
        nextAction: timed ? next : undefined,
        scheduledFor: type === "callback" ? when : undefined,
      });
      if (result.error) setError(result.error);
      else {
        setBody("");
        setOutcome("");
        setDuration("");
        setNext("");
        setWhen("");
      }
    });

  return (
    <div className="mt-3 rounded-xl border border-line bg-bg p-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Add to the timeline">
        {LOG_TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setType(t.key)}
            aria-pressed={type === t.key}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${
              type === t.key ? "bg-ink text-white" : "border border-line-strong bg-surface text-body"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-muted">Internal — the customer never sees these.</p>

      <div className="mt-3 flex flex-wrap gap-2.5">
        {type === "call" && (
          <select
            value={outcome}
            onChange={(ev) => setOutcome(ev.target.value as CallOutcome)}
            aria-label="Call outcome"
            className={`${field} w-auto py-2.5`}
          >
            <option value="">How did the call go?</option>
            {CALL_OUTCOMES.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        )}
        {timed && (
          <input
            type="number"
            min={1}
            max={720}
            value={duration}
            onChange={(ev) => setDuration(ev.target.value)}
            placeholder="Minutes"
            aria-label="Duration in minutes"
            className={`${field} w-32 py-2.5`}
          />
        )}
        {type === "callback" && (
          <input
            type="datetime-local"
            value={when}
            onChange={(ev) => setWhen(ev.target.value)}
            aria-label="Call back at"
            className={`${field} w-auto py-2.5`}
          />
        )}
      </div>

      <textarea
        value={body}
        onChange={(ev) => setBody(ev.target.value)}
        rows={2}
        maxLength={4000}
        aria-label="Summary"
        placeholder={
          type === "note"
            ? "What happened, or what the next person should know"
            : type === "call"
              ? "Summary (optional)"
              : type === "callback"
                ? "Why, or what to cover (optional)"
                : "Who was there and what was agreed"
        }
        className={`${field} mt-3`}
      />
      {timed && (
        <input
          value={next}
          onChange={(ev) => setNext(ev.target.value)}
          maxLength={500}
          placeholder="Next action (optional)"
          aria-label="Next action"
          className={`${field} mt-2.5`}
        />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!ready || saving}
          className="btn-ghost justify-center px-5 py-2.5 text-[13px] disabled:opacity-50"
        >
          {saving ? "Saving…" : type === "callback" ? "Schedule callback" : "Add to timeline"}
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
              ) : v.type === "call" || v.type === "meeting" || v.type === "site_visit" ? (
                <>
                  <strong className="font-semibold text-ink">
                    {v.type === "call" ? "Call" : v.type === "meeting" ? "Office meeting" : "Site visit"}
                  </strong>
                  {v.callOutcome && ` · ${OUTCOME_LABEL[v.callOutcome]}`}
                  {v.durationMinutes && ` · ${v.durationMinutes} min`}
                </>
              ) : v.type === "callback" ? (
                <>
                  <strong className="font-semibold text-ink">Callback scheduled</strong>
                  {v.scheduledFor && ` for ${when(v.scheduledFor)}`}
                </>
              ) : v.type === "owner_change" ? (
                <strong className="font-semibold text-ink">
                  {!v.fromValue && v.toValue === v.author.toLowerCase()
                    ? "Claimed"
                    : v.toValue
                      ? `${v.fromValue ? `Reassigned from ${who(v.fromValue)} to` : "Assigned to"} ${who(v.toValue)}`
                      : `Released from ${who(v.fromValue) ?? "—"} — now unassigned`}
                </strong>
              ) : v.type === "priority_change" ? (
                <>
                  Priority{" "}
                  {v.fromValue && v.fromValue in PRIORITY_LABEL ? `${PRIORITY_LABEL[v.fromValue as Priority]} → ` : ""}
                  <strong className="font-semibold text-ink">
                    {v.toValue && v.toValue in PRIORITY_LABEL ? PRIORITY_LABEL[v.toValue as Priority] : v.toValue}
                  </strong>
                </>
              ) : v.type === "created" ? (
                <strong className="font-semibold text-ink">
                  Opened by the team
                  {v.toValue && v.toValue in ORIGIN_LABEL ? ` · ${ORIGIN_LABEL[v.toValue as Origin]}` : ""}
                </strong>
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
            {v.nextAction && <p className="mt-1 text-[13px] text-body">Next: {v.nextAction}</p>}
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
