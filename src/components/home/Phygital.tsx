import Image from "next/image";
import { IMG } from "@/data/site";
import { phygital } from "@/data/home";
import { IconPerson, IconScreen } from "@/components/Icon";

/**
 * PropITZ's own "phygital" positioning: the platform and the people are
 * one offer, not two. Built on the photograph that shows both halves.
 */
export default function Phygital() {
  return (
    <section className="section mt-16 border-y border-line bg-surface">
      <div className="container-px">
        <div className="mb-10 max-w-[62ch]">
          <span className="kicker mb-3.5">Phygital support model</span>
          <h2 className="text-[clamp(28px,3.5vw,40px)] leading-[1.14]">
            A platform you can use, and people you can meet.
          </h2>
          <p className="mt-3.5 text-[17px] leading-[1.6] text-body">
            Everything that is faster online stays online. Everything that needs a
            person standing in the right queue gets a person.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-card)]">
            <Image
              src={`${IMG}/2026/04/A2.jpeg`}
              alt="PropITZ staff working with customers in the office and at a site"
              width={1024}
              height={687}
              className="h-[260px] w-full object-cover sm:h-[400px]"
            />
          </div>

          <div className="flex flex-col gap-4.5">
            <div className="rounded-[20px] border border-line bg-bg p-6">
              <div className="mb-3.5 flex items-center gap-3">
                <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-brand-50 text-brand">
                  <IconScreen size={19} />
                </span>
                <p className="text-[17px] font-bold text-ink">Online</p>
              </div>
              <div className="flex flex-col gap-2.5">
                {phygital.online.map((t) => (
                  <p key={t} className="text-sm leading-[1.5] text-body">
                    {t}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-line bg-bg p-6">
              <div className="mb-3.5 flex items-center gap-3">
                <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-accent-50 text-accent-dark">
                  <IconPerson size={19} />
                </span>
                <p className="text-[17px] font-bold text-ink">On the ground</p>
              </div>
              <div className="flex flex-col gap-2.5">
                {phygital.ground.map((t) => (
                  <p key={t} className="text-sm leading-[1.5] text-body">
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
