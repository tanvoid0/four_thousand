import type { LifeEvent, Profile } from "../types";
import { isValidISO } from "./time";
import { eventColor } from "../theme";

export const KEY = "four_thousand.profile.v1";

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

/** false when the browser refused the write (private mode / quota) — callers must tell the user */
export function saveProfile(p: Profile): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** hand `text` to the browser as a .json download */
export function downloadJSON(text: string, filename: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportProfile(p: Profile): void {
  downloadJSON(JSON.stringify(p, null, 2), "four-thousand-weeks.json");
}
