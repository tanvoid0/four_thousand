import { Link } from "react-router-dom";
import { useProfile } from "../../shared/ProfileContext";
import { useAccent, useNow } from "../../lib/hooks";
import { ageOn, breakdown, fmtInt, lifeEnd, parseDate, totalWeeks, weekIndex } from "../../lib/time";
import { findModule } from "../registry";
import { Card } from "../../shared/ui";
import BookCover from "../../shared/BookCover";
import LifeGauge from "./LifeGauge";
import LifeTimeline from "./LifeTimeline";
import WeeksGrid from "./WeeksGrid";
import Events from "./Events";

const mod = findModule("weeks")!;

function Chip({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5">
      <div className="eyebrow">{label}</div>
      <div className="mono mt-1 text-2xl font-bold">
        {value}
        {suffix ? <span className="ml-1 text-sm font-medium text-[var(--muted)]">{suffix}</span> : null}
      </div>
    </div>
  );
}

function Ticker({ birth, lifespanYears, now }: { birth: Date; lifespanYears: number; now: Date }) {
  const s = breakdown(lifeEnd(birth, lifespanYears).getTime() - now.getTime());
  if (s.past) return <div className="text-sm text-[var(--muted)]">Past the {lifespanYears}-year mark — every week now is borrowed.</div>;
  const units: [number, string][] = [
    [s.totalDays, "days"],
    [s.hours, "hrs"],
    [s.minutes, "min"],
    [s.seconds, "sec"],
  ];
  return (
    <div>
      <div className="eyebrow mb-2">counting down to age {lifespanYears}</div>
      <div className="flex items-end gap-3">
        {units.map(([v, l], i) => (
          <div key={l} className="flex items-end gap-3">
            <div className="flex flex-col items-center">
              <span className="mono text-xl font-bold tabular-nums sm:text-2xl">{String(v).padStart(2, "0")}</span>
              <span className="eyebrow mt-0.5">{l}</span>
            </div>
            {i < units.length - 1 && <span className="mono -mt-3 text-xl text-[var(--faint)]">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WeeksPage() {
  const { profile, isDemo } = useProfile();
  useAccent(mod.accent, mod.accent2);
  const now = useNow();
  const birth = parseDate(profile.birthDate);
  const total = totalWeeks(profile.lifespanYears);
  const lived = Math.max(0, Math.min(total, weekIndex(birth, now)));
  const age = Math.max(0, ageOn(birth, now));

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-5">
        <div>
          <Link to="/" className="eyebrow transition-colors hover:text-[var(--muted)]">
            ← All concepts
          </Link>
          <h1 className="display mt-3 text-3xl font-semibold sm:text-4xl">
            {isDemo ? "A life" : profile.name ? `${profile.name}'s life` : "Your life"} in weeks
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
            {mod.tagline} Every moment that mattered, placed in the life it belongs to.
          </p>
        </div>
        <BookCover
          title={mod.title}
          subtitle={mod.subtitle}
          author={mod.author}
          cover={mod.cover}
          accent={mod.accent}
          accent2={mod.accent2}
          className="w-[76px] rotate-2 sm:w-24"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="grid place-items-center p-5">
          <LifeGauge birth={birth} lifespanYears={profile.lifespanYears} now={now} />
        </Card>
        <div className="grid content-start gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Chip label="Weeks lived" value={fmtInt(lived)} />
            <Chip label="Current age" value={String(age)} suffix="yrs" />
          </div>
          <Card className="p-5">
            <Ticker birth={birth} lifespanYears={profile.lifespanYears} now={now} />
          </Card>
        </div>
      </div>

      <Card className="p-5 pt-4">
        <div className="eyebrow">your life, birth to {profile.lifespanYears}</div>
        <LifeTimeline birth={birth} lifespanYears={profile.lifespanYears} now={now} events={profile.events} />
      </Card>

      <Events birth={birth} now={now} events={profile.events} />

      <details className="group rounded-xl border border-[var(--border)]">
        <summary className="cursor-pointer list-none px-5 py-3.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]">
          <span className="eyebrow">▸ view all {fmtInt(total)} weeks</span>
        </summary>
        <div className="border-t border-[var(--border)] p-5">
          <WeeksGrid birth={birth} lifespanYears={profile.lifespanYears} now={now} events={profile.events} />
        </div>
      </details>
    </div>
  );
}
