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

/** UTC day number of `d`'s calendar day: day math on it can't be skewed by a DST hour, unlike dividing local-time ms */
function dayNum(d: Date): number {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MS_DAY;
}

/** week index of `when` counted from `birth` (0-based, can be negative/over) */
export function weekIndex(birth: Date, when: Date): number {
  return Math.floor((dayNum(when) - dayNum(birth)) / 7);
}

/** local midnight on the first day of week `week` (0-based) counted from `birth`: whole calendar days, so DST can't move it */
export function weekStart(birth: Date, week: number): Date {
  return new Date(birth.getFullYear(), birth.getMonth(), birth.getDate() + week * 7);
}

/** the moment the grid runs out */
export function lifeEnd(birth: Date, lifespanYears: number): Date {
  return weekStart(birth, totalWeeks(lifespanYears));
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
  // rebuilt per year: a Feb 29 rolls to Mar 1 in a non-leap year, and moving that Mar 1 forward would never find the next Feb 29
  const inYear = (y: number) => new Date(y, d.getMonth(), d.getDate());
  const occ = inYear(from.getFullYear());
  return occ.getTime() < from.getTime() ? inYear(from.getFullYear() + 1) : occ;
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
