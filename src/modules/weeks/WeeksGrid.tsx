import { useMemo, useRef, useState } from "react";
import type { LifeEvent } from "../../types";
import { MS_WEEK, ageOn, fmtDate, parseDate, totalWeeks, weekIndex } from "../../lib/time";

interface Props {
  birth: Date;
  lifespanYears: number;
  now: Date;
  events: LifeEvent[];
}

interface Marker {
  color: string;
  items: LifeEvent[];
}

interface Tip {
  week: number;
  x: number;
  y: number;
}

export default function WeeksGrid({ birth, lifespanYears, now, events }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  const total = totalWeeks(lifespanYears);
  const currentWeek = weekIndex(birth, now);

  const markers = useMemo(() => {
    const m = new Map<number, Marker>();
    const add = (idx: number, ev: LifeEvent) => {
      if (idx < 0 || idx >= total) return;
      const entry = m.get(idx) ?? { color: ev.color, items: [] };
      entry.items.push(ev);
      entry.color = ev.color;
      m.set(idx, entry);
    };
    for (const ev of events) {
      if (ev.kind === "recurring") {
        const d = parseDate(ev.date);
        for (let y = 0; y <= lifespanYears; y++) {
          add(weekIndex(birth, new Date(birth.getFullYear() + y, d.getMonth(), d.getDate())), ev);
        }
      } else {
        add(weekIndex(birth, parseDate(ev.date)), ev);
      }
    }
    return m;
  }, [events, birth, lifespanYears, total]);

  const cells = useMemo(() => {
    const out: React.ReactNode[] = [];
    for (let i = 0; i < total; i++) {
      const mk = markers.get(i);
      const current = i === currentWeek;
      const lived = i < currentWeek;
      const cls = `cell${current ? " current" : lived ? " lived" : ""}${mk ? " event" : ""}`;
      const style: React.CSSProperties = { ["--i" as string]: i };
      if (mk) {
        style.color = mk.color;
        if (!current) style.background = mk.color;
      }
      out.push(<div key={i} className={cls} style={style} data-week={i} />);
    }
    return out;
  }, [total, currentWeek, markers]);

  const onMove = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    const w = el.dataset.week;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (w === undefined || !rect) {
      setTip(null);
      return;
    }
    setTip({ week: Number(w), x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const tipData = tip
    ? (() => {
        const date = new Date(birth.getTime() + tip.week * MS_WEEK);
        return { age: ageOn(birth, date), date: fmtDate(date), items: markers.get(tip.week)?.items ?? [] };
      })()
    : null;

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between text-xs text-[var(--muted)]">
        <span>Each row is one year · each square is one week</span>
        <span className="mono">{total.toLocaleString()} weeks</span>
      </div>

      <div ref={wrapRef} className="relative overflow-x-auto pb-1" onMouseMove={onMove} onMouseLeave={() => setTip(null)}>
        <div className="week-grid">{cells}</div>

        {tip && tipData && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg border border-[var(--border)] bg-[#12121c] px-3 py-2 text-xs shadow-xl"
            style={{ left: tip.x, top: tip.y - 8 }}
          >
            <div className="mono text-[var(--muted)]">
              Week {(tip.week + 1).toLocaleString()} · age {tipData.age}
            </div>
            <div className="font-medium">{tipData.date}</div>
            {tipData.items.map((ev) => (
              <div key={ev.id} className="mt-0.5" style={{ color: ev.color }}>
                {ev.emoji ? `${ev.emoji} ` : ""}
                {ev.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
