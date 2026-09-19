import Link from "next/link";

/** Short notice beside the submit button of request forms (legal pack, Part III). */
export default function FormPrivacyNotice({ className = "" }: { className?: string }) {
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
