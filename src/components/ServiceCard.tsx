import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/data/services";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card group flex flex-col overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-16px_rgba(15,118,110,0.35)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-brand-50">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {service.icon && (
          <span className="absolute bottom-0 left-5 flex h-14 w-14 translate-y-1/2 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-line">
            <Image src={service.icon} alt="" width={28} height={28} className="h-7 w-7" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 pt-10">
        <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-brand">
          {service.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-body">{service.short}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          View Details
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
