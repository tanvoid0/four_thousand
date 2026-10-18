import type { LifeEvent } from "../../types";
import { MS_DAY, ageOn, breakdown, eventTarget, fmtDate, parseDate } from "../../lib/time";
import { Badge, Button, Card } from "../../shared/ui";
import { useProfile } from "../../shared/ProfileContext";

interface Props {
  birth: Date;
  now: Date;
  events: LifeEvent[];
}

const KIND_LABEL: Record<string, string> = { milestone: "Milestone", countdown: "Countdown", recurring: "Yearly" };

export default function Events({ birth, now, events }: Props) {
  const { openSettings } = useProfile();

  const withTarget = events
    .map((ev) => ({ ev, target: eventTarget(ev, now) }))
    .sort((a, b) => a.target.getTime() - b.target.getTime());

  const upcoming = withTarget.filter((t) => t.target.getTime() >= now.getTime());
  const next = upcoming[0];

  if (events.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-[var(--muted)]">No life events yet.</p>
        <div className="mt-3">
          <Button variant="primary" onClick={openSettings}>
            Add your first event
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {next && <NextUp ev={next.ev} target={next.target} now={now} />}

      <div className="grid gap-2 sm:grid-cols-2">
        {withTarget.map(({ ev, target }) => {
          const future = target.getTime() >= now.getTime();
          const days = Math.round((target.getTime() - now.getTime()) / MS_DAY);
          return (
            <Card key={ev.id} className="flex items-center gap-3 p-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg" style={{ background: `${ev.color}22` }}>
                {ev.emoji || "•"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{ev.title}</span>
                  <Badge color={ev.color}>{KIND_LABEL[ev.kind]}</Badge>
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {ev.kind === "recurring" ? `Next: ${fmtDate(target)}` : `${fmtDate(parseDate(ev.date))} · age ${ageOn(birth, parseDate(ev.date))}`}
                </div>
              </div>
              <div className="mono shrink-0 text-right text-xs">
                {future ? (
                  <span style={{ color: ev.color }}>in {days.toLocaleString()}d</span>
                ) : (
                  <span className="text-[var(--muted)]">{Math.abs(days).toLocaleString()}d ago</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function NextUp({ ev, target, now }: { ev: LifeEvent; target: Date; now: Date }) {
  const s = breakdown(target.getTime() - now.getTime());
  return (
    <Card className="flex flex-col items-center gap-3 p-5 sm:flex-row sm:justify-between" style={{ borderColor: `${ev.color}55` }}>
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl text-2xl" style={{ background: `${ev.color}22` }}>
          {ev.emoji || "⭐"}
        </span>
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--muted)]">Up next</div>
          <div className="text-lg font-semibold">{ev.title}</div>
          <div className="text-xs text-[var(--muted)]">{fmtDate(target)}</div>
        </div>
      </div>
      <div className="mono text-right" style={{ color: ev.color }}>
        <span className="text-3xl font-bold tabular-nums">{s.totalDays}</span>
        <span className="ml-1 text-sm">days</span>
        <div className="text-xs text-[var(--muted)]">
          {String(s.hours).padStart(2, "0")}:{String(s.minutes).padStart(2, "0")}:{String(s.seconds).padStart(2, "0")}
        </div>
      </div>
    </Card>
  );
}
