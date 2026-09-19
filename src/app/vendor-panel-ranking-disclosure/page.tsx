import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";
import { vendorPanelDisclosure, VENDOR_PANEL_PATH } from "@/data/vendorPanel";

export const metadata: Metadata = pageMetadata({
  title: "Vendor Panel & Ranking Disclosure",
  description:
    "How professionals are admitted to the PropITZ Recommended Vendor Panel, what listing fees do and do not buy, and how professionals are ranked.",
  path: VENDOR_PANEL_PATH,
});

export default function VendorPanelDisclosurePage() {
  return <LegalPage doc={vendorPanelDisclosure} />;
}
