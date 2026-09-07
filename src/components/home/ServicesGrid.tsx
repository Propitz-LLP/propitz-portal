import Link from "next/link";
import { servicesDetail } from "@/data/home";

/** All eight services at a glance — deliberately no "see all" link. */
export default function ServicesGrid() {
  return (
    <section className="section container-px">
      <div className="mb-9 max-w-[62ch]">
        <span className="kicker mb-3.5">Services</span>
        <h2 className="text-[clamp(28px,3.5vw,40px)] leading-[1.14]">
          Eight services, each a named step.
        </h2>
        <p className="mt-3.5 text-[17px] leading-[1.6] text-body">
          We explain what has to happen, prepare you for it, and bring in the
          verified professional who performs it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {servicesDetail.map((s) => (
          <Link
            key={s.n}
            href={s.href}
            className="group rounded-[20px] border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--shadow-soft)]"
          >
            <p className="mb-3.5 font-mono text-xs font-medium text-faint">{s.n}</p>
            <p className="text-base font-bold leading-[1.3] text-ink group-hover:text-brand">
              {s.title}
            </p>
            <p className="ta mt-0.5 mb-3 text-[12.5px] text-muted">{s.ta}</p>
            <p className="text-[13.5px] leading-[1.5] text-body">{s.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
