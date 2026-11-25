import {
  CLOSURE_LABEL,
  ORIGIN_LABEL,
  isCaseCategory,
  type ClosureReason,
  type Enquiry,
} from "@/data/enquiries";

/* ------------------------------------------------------------------ */
/*  Case measures (Requirements v2.0, FR-QT-10 and FR-CS-16).          */
/*                                                                     */
/*  Pure functions over the enquiries already fetched for the console, */
/*  so the reports page and the case panel agree to the minute. Time   */
/*  waiting on the customer (Awaiting data) is tracked on its own and  */
/*  left out of resolution time, so delay caused by the customer is    */
/*  visible and not counted against the team.                          */
/* ------------------------------------------------------------------ */

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** Time spent in Awaiting data so far, including a pause still running. */
export function awaitingMs(e: Enquiry, now: number = Date.now()): number {
  let total = 0;
  let since: number | null = null;
  for (const v of e.events) {
    if (v.type !== "status_change") continue;
    const at = new Date(v.createdAt).getTime();
    if (v.toStatus === "awaiting_data") since = at;
    else if (v.fromStatus === "awaiting_data" && since !== null) {
      total += at - since;
      since = null;
    }
  }
  if (since !== null && e.status === "awaiting_data") total += now - since;
  return total;
}

/** "under an hour", "5 h", "2.5 days". */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < HOUR) return "under an hour";
  if (ms < 2 * DAY) return `${Math.round(ms / HOUR)} h`;
  const d = ms / DAY;
  return `${d < 10 ? d.toFixed(1).replace(/\.0$/, "") : Math.round(d)} days`;
}

function median(xs: number[]) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function percentile(xs: number[], p: number) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)];
}

/** Counts by label, largest first. */
function tally(labels: string[]): { label: string; count: number }[] {
  const m = new Map<string, number>();
  for (const l of labels) m.set(l, (m.get(l) ?? 0) + 1);
  return [...m.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

function campaignLabel(e: Enquiry) {
  if (e.origin && e.origin !== "web_form") return `Team-created · ${ORIGIN_LABEL[e.origin]}`;
  const c = e.campaign;
  if (!c) return "No campaign";
  if (c.utm_source || c.utm_campaign) return [c.utm_source, c.utm_campaign].filter(Boolean).join(" · ");
  if (c.gclid) return "Google Ads";
  if (c.fbclid) return "Facebook / Instagram";
  return "No campaign";
}

export type Period = 30 | 90 | 365 | "all";

export type CaseReport = ReturnType<typeof caseReport>;

/**
 * Everything the reports page shows. `period` limits the flow measures
 * (received, contacted, closed) to cases created in it; the snapshot
 * measures (open, ageing, workload) are always as of now.
 */
export function caseReport(all: Enquiry[], period: Period, now: number = Date.now()) {
  const cases = all.filter((e) => isCaseCategory(e.category));
  const since = period === "all" ? 0 : now - period * DAY;
  const inPeriod = cases.filter((e) => new Date(e.createdAt).getTime() >= since);
  const open = cases.filter((e) => e.status !== "closed");

  // --- first contact: from creation to the first move out of New
  const firstContact: number[] = [];
  for (const e of inPeriod) {
    const left = e.events.find((v) => v.type === "status_change" && v.fromStatus === "new");
    if (left) firstContact.push(new Date(left.createdAt).getTime() - new Date(e.createdAt).getTime());
  }

  // --- resolution: creation to first closure, less time waiting on the customer
  const resolution: number[] = [];
  const everClosed = inPeriod.filter((e) => e.events.some((v) => v.type === "status_change" && v.toStatus === "closed"));
  for (const e of everClosed) {
    const closed = e.events.find((v) => v.type === "status_change" && v.toStatus === "closed")!;
    const closedAt = new Date(closed.createdAt).getTime();
    resolution.push(Math.max(0, closedAt - new Date(e.createdAt).getTime() - awaitingMs(e, closedAt)));
  }

  // --- reopening
  const reopened = everClosed.filter((e) => e.events.some((v) => v.type === "status_change" && v.fromStatus === "closed"));
  const reopenReasons = reopened
    .flatMap((e) =>
      e.events
        .filter((v) => v.type === "status_change" && v.fromStatus === "closed" && v.body)
        .map((v) => ({ reference: e.reference, reason: v.body!, at: v.createdAt }))
    )
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5);

  // --- the oldest enquiry nobody has contacted yet
  const uncontacted = cases.filter((e) => e.status === "new").sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const oldestNew = uncontacted[0] ?? null;

  const awaiting = cases.filter((e) => e.status === "awaiting_data");
  const longestAwaiting = awaiting.reduce<Enquiry | null>(
    (worst, e) => (!worst || (e.statusChangedAt ?? "") < (worst.statusChangedAt ?? "") ? e : worst),
    null
  );

  const BUCKETS = [
    { label: "Under a day", max: DAY },
    { label: "1–3 days", max: 3 * DAY },
    { label: "3–7 days", max: 7 * DAY },
    { label: "1–4 weeks", max: 30 * DAY },
    { label: "Over a month", max: Infinity },
  ];
  const ageing = BUCKETS.map((b, i) => ({
    label: b.label,
    count: open.filter((e) => {
      const age = now - new Date(e.createdAt).getTime();
      return age < b.max && age >= (i ? BUCKETS[i - 1].max : 0);
    }).length,
  }));

  const waitedMs = inPeriod.reduce((sum, e) => sum + awaitingMs(e, now), 0);

  return {
    received: inPeriod.length,
    openNow: open.length,
    newNow: uncontacted.length,
    oldestNew: oldestNew
      ? { reference: oldestNew.reference, name: oldestNew.name, ageMs: now - new Date(oldestNew.createdAt).getTime() }
      : null,
    awaitingNow: awaiting.length,
    longestAwaiting: longestAwaiting
      ? { reference: longestAwaiting.reference, ageMs: now - new Date(longestAwaiting.statusChangedAt ?? longestAwaiting.createdAt).getTime() }
      : null,
    firstContact: { median: median(firstContact), p90: percentile(firstContact, 90), count: firstContact.length },
    resolution: { median: median(resolution), p90: percentile(resolution, 90), count: resolution.length },
    waitedMs,
    byCategory: tally(inPeriod.map((e) => (e.category === "seller" ? "Sell callbacks" : "Requests"))),
    byOrigin: tally(inPeriod.map((e) => ORIGIN_LABEL[e.origin ?? "web_form"])),
    byCampaign: tally(inPeriod.map(campaignLabel)),
    byNeed: tally(inPeriod.map((e) => e.subject ?? "Not stated")),
    closureReasons: tally(
      inPeriod
        .filter((e) => e.status === "closed" && e.closureReason)
        .map((e) => CLOSURE_LABEL[e.closureReason as ClosureReason])
    ),
    reopen: { closed: everClosed.length, reopened: reopened.length, reasons: reopenReasons },
    ageing,
    workload: tally(open.map((e) => (e.ownerEmail ? e.ownerEmail.split("@")[0] : "Unassigned"))),
  };
}
