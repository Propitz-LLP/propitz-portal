import Reveal from "./Reveal";
import { stats } from "@/data/site";

export default function Stats({
  onDark = false,
}: {
  onDark?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-8">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 120}>
          <div className="text-center">
            <div
              className={`font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl ${
                onDark ? "text-white" : "text-brand"
              }`}
            >
              {s.value}
            </div>
            <div
              className={`mt-2 text-xs font-medium sm:text-sm ${
                onDark ? "text-slate-300" : "text-body"
              }`}
            >
              {s.label}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
