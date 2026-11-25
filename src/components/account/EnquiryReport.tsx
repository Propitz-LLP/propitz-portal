import { formatDuration, type CaseReport } from "@/lib/enquiryReports";

/**
 * The enquiry reports (Requirements v2.0, FR-CS-16, the parts that need
 * no SLA targets yet). Display only: the page fetches and computes.
 */
export default function EnquiryReport({ r, periodLabel }: { r: CaseReport; periodLabel: string }) {
  return (
    <>
      {/* Now: the numbers that say whether the queue is being worked. */}
      <h2 className="mb-3 text-lg text-ink">Right now</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile
          label="Oldest uncontacted"
          value={r.oldestNew ? formatDuration(r.oldestNew.ageMs) : "None"}
          note={r.oldestNew ? `${r.oldestNew.reference ?? ""} · ${r.newNow} still new` : "Every case has been contacted"}
          lead
        />
        <Tile label="Open cases" value={String(r.openNow)} note="Not closed" />
        <Tile
          label="Waiting on the customer"
          value={String(r.awaitingNow)}
          note={r.longestAwaiting ? `Longest ${formatDuration(r.longestAwaiting.ageMs)} · ${r.longestAwaiting.reference ?? ""}` : "None paused"}
        />
        <Tile
          label="Unassigned"
          value={String(r.workload.find((w) => w.label === "Unassigned")?.count ?? 0)}
          note="Open cases with no owner"
        />
      </div>

      <h2 className="mb-3 mt-10 text-lg text-ink">Cases received in the last {periodLabel}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Received" value={String(r.received)} note="Requests and callbacks" />
        <Tile
          label="Time to first contact"
          value={r.firstContact.median === null ? "—" : formatDuration(r.firstContact.median)}
          note={
            r.firstContact.p90 === null
              ? "No case contacted yet"
              : `Median · 9 in 10 within ${formatDuration(r.firstContact.p90)}`
          }
        />
        <Tile
          label="Time to close"
          value={r.resolution.median === null ? "—" : formatDuration(r.resolution.median)}
          note={r.resolution.count ? `Median of ${r.resolution.count}, less customer waiting` : "None closed yet"}
        />
        <Tile
          label="Reopened"
          value={r.reopen.closed ? `${Math.round((r.reopen.reopened / r.reopen.closed) * 100)}%` : "—"}
          note={`${r.reopen.reopened} of ${r.reopen.closed} closed cases`}
        />
      </div>
      <p className="mt-3 text-[13px] text-muted">
        Time spent waiting on customers in this period: {formatDuration(r.waitedMs)} in total. It is not
        counted in the time to close.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <BarList title="By type" rows={r.byCategory} />
        <BarList title="By source" rows={r.byOrigin} />
        <BarList title="By campaign" rows={r.byCampaign} />
        <BarList title="What they need" rows={r.byNeed} />
        <BarList title="Closure reasons" rows={r.closureReasons} empty="No case closed in this period." />
        <BarList title="Open cases by age" rows={r.ageing} keepOrder />
        <BarList title="Open cases by owner" rows={r.workload} />
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-[15px] font-semibold text-ink">Why cases were reopened</h3>
          {r.reopen.reasons.length === 0 ? (
            <p className="mt-3 text-[13.5px] text-muted">No reopened cases in this period.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {r.reopen.reasons.map((x) => (
                <li key={`${x.reference}-${x.at}`} className="text-[13.5px] text-body">
                  <span className="font-mono text-[12.5px] text-muted">{x.reference}</span> — {x.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-8 text-[13px] text-muted">
        Response and resolution targets per service, and breach counts, follow once the targets are agreed.
      </p>
    </>
  );
}

/** One headline number. `lead` marks the figure the page leads with. */
function Tile({ label, value, note, lead = false }: { label: string; value: string; note: string; lead?: boolean }) {
  return (
    <div className={`rounded-2xl border bg-surface p-4 ${lead ? "border-brand/40" : "border-line"}`}>
      <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint">{label}</p>
      <p className={`mt-1 font-semibold text-ink ${lead ? "text-3xl" : "text-2xl"}`}>{value}</p>
      <p className="mt-1 text-[12.5px] text-muted">{note}</p>
    </div>
  );
}

/**
 * A ranked list: name, bar and figure per row, bars on one baseline, one
 * hue. Every figure is printed, so the bar is never the only way to read
 * it. `keepOrder` keeps a natural order (age bands) instead of ranking.
 */
function BarList({
  title,
  rows,
  empty = "Nothing in this period.",
  keepOrder = false,
}: {
  title: string;
  rows: { label: string; count: number }[];
  empty?: string;
  keepOrder?: boolean;
}) {
  const list = keepOrder ? rows : [...rows].sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...list.map((r) => r.count));
  const total = list.reduce((s, r) => s + r.count, 0);
  const shown = list.slice(0, 8);
  const rest = list.slice(8).reduce((s, r) => s + r.count, 0);
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {total === 0 ? (
        <p className="mt-3 text-[13.5px] text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {[...shown, ...(rest ? [{ label: "Other", count: rest }] : [])].map((r) => (
            <li
              key={r.label}
              title={`${r.label}: ${r.count} (${Math.round((r.count / total) * 100)}%)`}
              className="grid grid-cols-[minmax(0,13rem)_1fr_auto] items-center gap-3 text-[13px]"
            >
              <span className="truncate text-body">{r.label}</span>
              <span className="h-2 overflow-hidden rounded-r bg-bg-alt" aria-hidden>
                <span
                  className="block h-full rounded-r bg-brand"
                  style={{ width: `${r.count ? Math.max(2, (r.count / max) * 100) : 0}%` }}
                />
              </span>
              <span className="w-8 text-right font-mono text-ink">{r.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
