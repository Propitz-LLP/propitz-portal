import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import SellerForm from "@/components/SellerForm";
import { IconCheck } from "@/components/Icon";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Sell Your Property in Chennai & Tamil Nadu",
  description:
    "Planning to sell a property in Tamil Nadu? Tell PropITZ when to call and we will explain the documents, checks and steps involved before you list.",
};

const steps = [
  "We call you at the time you choose",
  "We understand the property and what you want from the sale",
  "We explain which documents and checks a buyer will expect",
  "We set out the next steps and how PropITZ can support them",
];

export default function SellPage() {
  return (
    <>
      <PageHero
        title="Sell a property"
        crumb="Sell"
        subtitle="Tell us when to call. We will explain what a sale in Tamil Nadu involves before you commit to anything."
        image={`${IMG}/8.jpg`}
      />

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[22rem_1fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="How it starts"
              title="A callback, not a sales pitch"
            />
            <ol className="mt-6 space-y-3">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed text-body">{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex items-start gap-2.5 text-sm leading-relaxed text-body">
              <IconCheck size={16} className="mt-0.5 shrink-0 text-ok" />
              Pricing is quoted after a scope review. There is nothing to pay to request a callback.
            </p>
          </div>

          <SellerForm />
        </div>
      </section>
    </>
  );
}
