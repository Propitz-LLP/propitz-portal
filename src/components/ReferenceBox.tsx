/**
 * The case reference on a thank-you screen (Requirements v2.0, FR-QT-02):
 * what the customer quotes from now on, so it is the thing to see.
 */
export default function ReferenceBox({ reference }: { reference: string }) {
  return (
    <div className="mt-4 rounded-2xl bg-brand-50 px-5 py-4 ring-1 ring-brand-100">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-brand-dark">Your reference</p>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-wide text-ink">{reference}</p>
      <p className="mt-1 text-[13px] text-body">
        Please quote it whenever you contact us.{" "}
        <a href={`/request-status?ref=${reference}`} className="font-semibold text-brand underline-offset-4 hover:underline">
          Check its status
        </a>{" "}
        any time with your reference and mobile number.
      </p>
    </div>
  );
}
