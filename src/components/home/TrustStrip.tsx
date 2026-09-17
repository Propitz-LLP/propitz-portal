import { trustStats } from "@/data/home";

/** Verified numbers under the hero. Figures come from data/home.ts. */
export default function TrustStrip() {
  return (
    <section className="container-px mt-9">
      <div className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-3">
        {trustStats.map((s) => (
          <div key={s.value + s.strong} className="bg-surface px-6 py-5">
            <p className="font-display text-[32px] leading-none font-semibold text-brand">
              {s.value}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-[1.4] text-muted">
              {s.label} <b className="font-semibold text-body">{s.strong}</b>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
