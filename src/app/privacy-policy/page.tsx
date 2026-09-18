import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What personal data PropITZ collects through its website, how it is used and shared, and how to access, correct or delete it.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <LegalPage doc={privacyPolicy} />;
}
