import Link from "next/link";

/**
 * Short notice beside the submit button of request forms (legal pack, Part III).
 *
 * `variant="application"` swaps in the careers wording: an applicant is not
 * asking for a service, so authorising us to "scope the service and
 * coordinate professionals" would describe something they never agreed to.
 */
export default function FormPrivacyNotice({
  className = "",
  variant = "request",
}: {
  className?: string;
  variant?: "request" | "application";
}) {
  if (variant === "application") {
    return (
      <p className={`text-[12.5px] leading-[1.55] text-muted ${className}`}>
        By submitting this application, you authorise PropITZ to use the
        information provided to assess your application, contact you about
        relevant employment or professional opportunities, and retain your
        profile in accordance with our{" "}
        <Link href="/privacy-policy" className="font-semibold text-brand underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    );
  }

  return (
    <p className={`text-[12.5px] leading-[1.55] text-muted ${className}`}>
      By submitting this request, you authorise PropITZ to use the information to
      respond, scope the service and coordinate relevant professionals where
      needed. See{" "}
      <Link href="/privacy-policy" className="font-semibold text-brand underline-offset-4 hover:underline">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
