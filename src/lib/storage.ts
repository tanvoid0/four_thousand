import type { LifeEvent, Profile } from "../types";
import { isValidISO } from "./time";
import { eventColor } from "../theme";

const KEY = "four_thousand.profile.v1";

/** event colours live in the single theme source */
export const randomColor = eventColor;

function coerceEvent(raw: unknown): LifeEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.date !== "string" || !isValidISO(r.date)) return null;
  const kind = r.kind === "countdown" || r.kind === "recurring" ? r.kind : "milestone";
  return {
    id: typeof r.id === "string" ? r.id : crypto.randomUUID(),
    title: typeof r.title === "string" && r.title.trim() ? r.title : "Untitled",
    date: r.date,
    kind,
    color: typeof r.color === "string" ? r.color : randomColor(),
    emoji: typeof r.emoji === "string" ? r.emoji : undefined,
  };
}

/** Turn arbitrary parsed JSON into a valid Profile, or null if unusable. */
export function coerceProfile(raw: unknown): Profile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.birthDate !== "string" || !isValidISO(r.birthDate)) return null;
  const lifespan = Number(r.lifespanYears);
  return {
    name: typeof r.name === "string" && r.name.trim() ? r.name : undefined,
    birthDate: r.birthDate,
    lifespanYears: lifespan >= 1 && lifespan <= 150 ? Math.round(lifespan) : 80,
    events: Array.isArray(r.events)
      ? r.events.map(coerceEvent).filter((e): e is LifeEvent => e !== null)
      : [],
  };
}

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? coerceProfile(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode / quota — the app still works for this session */
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function exportProfile(p: Profile): void {
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "four-thousand-weeks.json";
  a.click();
  URL.revokeObjectURL(url);
}
