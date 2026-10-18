export const MS_DAY = 86_400_000;
export const MS_WEEK = 7 * MS_DAY;
export const WEEKS_PER_ROW = 52;

export function parseDate(iso: string): Date {
  // local midnight, avoids off-by-one from UTC parsing of bare yyyy-mm-dd
  return new Date(`${iso}T00:00:00`);
}

export function toISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function isValidISO(iso: string): boolean {
  const d = parseDate(iso);
  return !Number.isNaN(d.getTime());
}

/** total cells in the grid (rows of 52) */
export function totalWeeks(lifespanYears: number): number {
  return Math.round(lifespanYears) * WEEKS_PER_ROW;
}

/** week index of `when` counted from `birth` (0-based, can be negative/over) */
export function weekIndex(birth: Date, when: Date): number {
  return Math.floor((when.getTime() - birth.getTime()) / MS_WEEK);
}

/** the moment the grid runs out */
export function lifeEnd(birth: Date, lifespanYears: number): Date {
  return new Date(birth.getTime() + totalWeeks(lifespanYears) * MS_WEEK);
}

export function ageOn(birth: Date, when: Date): number {
  let age = when.getFullYear() - birth.getFullYear();
  const m = when.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && when.getDate() < birth.getDate())) age--;
  return age;
}

export interface Span {
  years: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalWeeks: number;
  past: boolean;
}

/** break a millisecond gap into human units */
export function breakdown(ms: number): Span {
  const past = ms < 0;
  let s = Math.floor(Math.abs(ms) / 1000);
  const totalDays = Math.floor(s / 86_400);
  const totalWeeksN = Math.floor(s / 604_800);

  const years = Math.floor(s / (365.25 * 86_400));
  s -= Math.floor(years * 365.25 * 86_400);
  const weeks = Math.floor(s / 604_800);
  s -= weeks * 604_800;
  const days = Math.floor(s / 86_400);
  s -= days * 86_400;
  const hours = Math.floor(s / 3_600);
  s -= hours * 3_600;
  const minutes = Math.floor(s / 60);
  s -= minutes * 60;
  return { years, weeks, days, hours, minutes, seconds: s, totalDays, totalWeeks: totalWeeksN, past };
}

/** next time an annual date lands, on/after `from` */
export function nextOccurrence(dateISO: string, from: Date): Date {
  const d = parseDate(dateISO);
  const occ = new Date(from.getFullYear(), d.getMonth(), d.getDate());
  if (occ.getTime() < from.getTime()) occ.setFullYear(from.getFullYear() + 1);
  return occ;
}

/** the target date a countdown/recurring event points at, relative to now */
export function eventTarget(ev: { date: string; kind: string }, now: Date): Date {
  return ev.kind === "recurring" ? nextOccurrence(ev.date, now) : parseDate(ev.date);
}

export function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
