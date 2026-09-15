import Link from "next/link";
import { heroImage, heroVideo, site } from "@/data/site";
import { intents, registrationWalkthrough as walk } from "@/data/home";
import RegionLine from "@/components/RegionLine";
import {
  IconAdvisory,
  IconArrow,
  IconBuy,
  IconCheck,
  IconDeed,
  IconDoc,
  IconPlay,
  IconSell,
  IconVerify,
  IconWhatsApp,
} from "@/components/Icon";

const intentIcon: Record<string, (p: { size?: number; className?: string }) => React.ReactElement> = {
  buy: IconBuy,
  sell: IconSell,
  verify: IconVerify,
  register: IconDeed,
  documents: IconDoc,
  services: IconAdvisory,
};

/**
 * The hero asks one question — what do you need help with — and answers
 * the most common one with a worked example. The primary action is a
 * structured request so intake arrives classified; WhatsApp sits beside it
 * as the channel many customers prefer.
 */
export default function IntentHero() {
  return (
    <section className="container-px pt-12 sm:pt-14">
      {/* headline + the showreel from the live site */}
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-13">
        <div>
          <RegionLine />
          <h1 className="text-[clamp(34px,6vw,58px)] leading-[1.06]">
            Property in Tamil Nadu,{" "}
            <em className="italic text-brand">without the guesswork.</em>
          </h1>
          <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.62] text-body">
            Tell us what you are trying to do. We explain the steps, organise what
            is required, coordinate the right professionals and stay with the
            process until completion.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={site.queryForm}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-3 py-3.5 text-[15.5px]"
            >
              Start a request
              <IconArrow size={16} />
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi PropITZ, I need help with a property.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost gap-2.5 py-3.5 text-[15.5px]"
            >
              <IconWhatsApp size={18} className="text-whatsapp" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-card)]">
          <video
            className="h-[300px] w-full object-cover sm:h-[396px]"
            autoPlay
            muted
            loop
            playsInline
            poster={heroImage}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-navy/85 px-3 py-1.5 text-xs font-semibold text-white">
            <IconPlay size={12} />
            Showreel
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent px-5 pb-4 pt-6">
            <p className="text-sm font-semibold text-white">
              Online where it is faster. In person where it matters.
            </p>
          </div>
        </div>
      </div>

      {/* the six problem-led intents */}
      <p className="mt-11 mb-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-faint">
        What do you need help with?
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {intents.map((i) => {
          const Icon = intentIcon[i.key];
          const active = i.key === "register";
          return (
            <Link
              key={i.key}
              href={i.href}
              className={`rounded-[20px] border p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${
                active
                  ? "border-[1.5px] border-brand bg-brand-50"
                  : "border-line bg-surface hover:border-brand"
              }`}
            >
              <span
                className={`mb-3 grid h-[42px] w-[42px] place-items-center rounded-xl ${
                  active ? "bg-brand text-white" : "bg-brand-50 text-brand"
                }`}
              >
                <Icon size={21} />
              </span>
              <p className="text-[15.5px] font-bold text-ink">{i.label}</p>
              <p className="ta text-[12.5px] leading-[1.35] text-muted">{i.ta}</p>
            </Link>
          );
        })}
      </div>

      {/* worked example for the most common journey */}
      <div className="mt-4 rounded-[28px] border-[1.5px] border-brand bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-7">
        <div className="mb-5 flex items-start gap-4 border-b border-line pb-5">
          <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[13px] bg-brand text-white">
            <IconDeed size={23} />
          </span>
          <div>
            <h3 className="text-2xl font-semibold">{walk.title}</h3>
            <p className="mt-1 text-sm leading-[1.55] text-body">{walk.summary}</p>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          <ol className="flex flex-col">
            {walk.steps.map((s, n) => (
              <li
                key={s.title}
                className="flex gap-3.5 border-b border-line py-3 last:border-b-0"
              >
                <span
                  className={`mt-0.5 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full font-mono text-xs font-medium ${
                    n === walk.steps.length - 1
                      ? "bg-accent text-white"
                      : "bg-brand-50 text-brand"
                  }`}
                >
                  {n + 1}
                </span>
                <p className="text-sm leading-[1.5] text-body">
                  <b className="block font-semibold text-ink">{s.title}</b>
                  {s.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="rounded-2xl bg-bg-alt p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.07em] text-faint">
              Bring these with you
            </p>
            <ul className="flex flex-col">
              {walk.checklist.map((d) => (
                <li key={d} className="flex items-center gap-2.5 py-1.5 text-[13px] text-body">
                  <IconCheck size={15} className="shrink-0 text-ok" />
                  {d}
                </li>
              ))}
            </ul>
            <Link
              href="/contact-us"
              className="btn-dark mt-4 w-full justify-center gap-2 py-3 text-[13.5px]"
            >
              Get my checklist
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
