import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center">
      <div className="container-px text-center">
        <span className="eyebrow">404</span>
        <h1 className="mt-4 text-4xl text-ink">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-body">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get
          you back on track.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
