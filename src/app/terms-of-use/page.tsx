import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";
import { termsOfUse } from "@/data/legal";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms for using the PropITZ website and account: what PropITZ does and does not do, marketplace listings, fees and acceptable use.",
  path: "/terms-of-use",
});

export default function TermsOfUsePage() {
  return <LegalPage doc={termsOfUse} />;
}
