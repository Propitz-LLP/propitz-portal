import Link from "next/link";
import { vendorPanelSummary, VENDOR_PANEL_PATH } from "@/data/vendorPanel";

/**
 * The public "how professionals are selected and shown" disclosure, for
 * the pages that present professionals. Full text lives on its own page.
 */
export default function VendorPanelNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-bg-alt p-5 ${className}`}>
      <p className="text-sm font-semibold text-ink">{vendorPanelSummary.heading}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-body">{vendorPanelSummary.text}</p>
      <Link
        href={VENDOR_PANEL_PATH}
        className="mt-2 inline-block py-1 text-sm font-semibold text-brand underline-offset-4 hover:underline"
      >
        Read the Vendor Panel &amp; Ranking Disclosure
      </Link>
    </div>
  );
}
