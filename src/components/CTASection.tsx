import { site } from "@/data/site";
import { THEME_IMG } from "@/data/site";
import Reveal from "./Reveal";

export default function CTASection({
  heading = "Tell us what you are trying to do",
}: {
  heading?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${THEME_IMG}/2.jpeg)` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 to-brand/85" aria-hidden />
      <div className="container-px relative py-16 sm:py-20">
        <Reveal className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <h2 className="text-2xl text-white sm:text-3xl">{heading}</h2>
            <p className="mt-3 text-slate-100">
              We explain the steps, organise what is required and coordinate the
              right professionals, online where it is faster and in person where
              it matters.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={`tel:${site.phoneDigits}`} className="btn-accent">
              Call us
            </a>
            <a
              href={site.queryForm}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Start a request
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
