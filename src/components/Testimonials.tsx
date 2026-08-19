import Image from "next/image";
import { testimonials, clientAvatars } from "@/data/site";

function Star() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.slice(0, 3).map((t, i) => (
        <div key={t.name} className="flex flex-col rounded-3xl bg-white p-8 shadow-[var(--shadow-card)]">
          <div className="flex items-start justify-between">
            <div className="flex gap-1 text-brand">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} />
              ))}
            </div>
            <span className="font-serif text-6xl leading-none text-black/10">&rdquo;</span>
          </div>
          <p className="mt-6 flex-1 leading-relaxed text-body">&ldquo;{t.quote}&rdquo;</p>
          <div className="mt-8 flex items-center gap-3 border-t border-line pt-6">
            <span className="relative h-11 w-11 overflow-hidden rounded-full">
              <Image src={clientAvatars[i % clientAvatars.length]} alt={t.name} fill className="object-cover" unoptimized />
            </span>
            <div>
              <p className="font-semibold text-ink">{t.name}</p>
              <p className="text-sm text-body">{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
