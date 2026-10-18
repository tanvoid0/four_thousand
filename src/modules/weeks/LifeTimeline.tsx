import type { LifeEvent } from "../../types";
import { MS_WEEK, fmtDate, parseDate, totalWeeks } from "../../lib/time";

interface Props {
  birth: Date;
  lifespanYears: number;
  now: Date;
  events: LifeEvent[];
}

export default function LifeTimeline({ birth, lifespanYears, now, events }: Props) {
  const totalMs = totalWeeks(lifespanYears) * MS_WEEK;
  const pos = (d: Date) => Math.max(0, Math.min(100, ((d.getTime() - birth.getTime()) / totalMs) * 100));
  const nowPos = pos(now);

  const dots = events
    .filter((e) => e.kind !== "recurring")
    .map((e) => ({ e, p: pos(parseDate(e.date)) }));

  const decades = Array.from({ length: Math.floor(lifespanYears / 10) + 1 }, (_, i) => i * 10);

  return (
    <div className="pt-6">
      <div className="relative h-7">
        {/* track */}
        <div className="absolute top-1/2 h-2.5 w-full -translate-y-1/2 rounded-full bg-[var(--surface-2)]" />
        {/* lived fill */}
        <div
          className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full"
          style={{ width: `${nowPos}%`, background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
        />
        {/* event dots */}
        {dots.map(({ e, p }) => (
          <div
            key={e.id}
            className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p}%` }}
            title={`${e.emoji ? e.emoji + " " : ""}${e.title} · ${fmtDate(parseDate(e.date))}`}
          >
            <span className="block h-3 w-3 rounded-full border-2 border-[var(--bg)]" style={{ background: e.color }} />
          </div>
        ))}
        {/* now marker */}
        <div className="absolute -top-5 bottom-0 -translate-x-1/2" style={{ left: `${nowPos}%` }}>
          <div className="mono mb-0.5 -translate-x-1/2 whitespace-nowrap text-[10px] text-[var(--text)]" style={{ marginLeft: "50%" }}>
            now
          </div>
          <div className="mx-auto h-full w-px bg-[var(--text)]/70" />
        </div>
      </div>
      {/* decade scale */}
      <div className="relative mt-2 h-4">
        {decades.map((d) => (
          <span key={d} className="mono absolute -translate-x-1/2 text-[10px] text-[var(--faint)]" style={{ left: `${(d / lifespanYears) * 100}%` }}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
