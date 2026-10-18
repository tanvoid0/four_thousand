import { useEffect, useState } from "react";
import { fmtInt, totalWeeks, weekIndex } from "../../lib/time";
import { useCountUp } from "../../lib/hooks";

interface Props {
  birth: Date;
  lifespanYears: number;
  now: Date;
}

const R = 92;
const C = 2 * Math.PI * R;

export default function LifeGauge({ birth, lifespanYears, now }: Props) {
  const total = totalWeeks(lifespanYears);
  const lived = Math.max(0, Math.min(total, weekIndex(birth, now)));
  const left = total - lived;
  const frac = lived / total;
  const pct = Math.round(frac * 100);
  const weeks = useCountUp(left);

  // animate the arc from empty to its value on mount
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(frac));
    return () => cancelAnimationFrame(id);
  }, [frac]);

  return (
    <div className="relative grid place-items-center">
      <svg viewBox="0 0 220 220" className="w-full max-w-[260px] -rotate-90">
        <defs>
          <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="15" />
        <circle
          cx="110"
          cy="110"
          r={R}
          fill="none"
          stroke="url(#gauge)"
          strokeWidth="15"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - shown)}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.23,1,0.32,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="eyebrow">weeks left</span>
        <span className="display text-5xl font-semibold leading-none text-[var(--accent)] sm:text-6xl">{fmtInt(weeks)}</span>
        <span className="mono mt-2 text-xs text-[var(--muted)]">{pct}% of life lived</span>
      </div>
    </div>
  );
}
