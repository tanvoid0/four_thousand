import type { LifeEvent, Profile } from "../types";
import { toISO } from "./time";

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));

const NAMES = ["Alex", "Sam", "Jordan", "Riley", "Casey", "Morgan", "Jamie", "Taylor"];

/** build a date `years`+`months` after a birth date */
function after(birth: Date, years: number, months = 0): string {
  return toISO(new Date(birth.getFullYear() + years, birth.getMonth() + months, birth.getDate()));
}

/**
 * A fresh random life every call — reshuffled on each page load so the demo
 * never looks like one real person. Events are plausible and relative to the
 * random birth date.
 */
export function randomDemo(): Profile {
  const age = randInt(24, 68);
  const now = new Date();
  const birth = new Date(now.getFullYear() - age, randInt(0, 11), randInt(1, 28));
  const birthISO = toISO(birth);

  const events: LifeEvent[] = [
    { id: "d1", title: "Started school", date: after(birth, 5), kind: "milestone", color: "#5f9ae6", emoji: "🎒" },
    { id: "d2", title: "Graduated", date: after(birth, randInt(21, 23)), kind: "milestone", color: "#9dce67", emoji: "🎓" },
    { id: "d3", title: "First job", date: after(birth, randInt(22, 26)), kind: "milestone", color: "#f2b544", emoji: "💼" },
    { id: "d4", title: "Moved city", date: after(birth, randInt(27, 34)), kind: "milestone", color: "#ff7a5c", emoji: "📦" },
    { id: "d5", title: "Birthday", date: birthISO, kind: "recurring", color: "#a98cff", emoji: "🎂" },
    { id: "d6", title: "Next holiday", date: toISO(new Date(now.getTime() + randInt(20, 180) * 86_400_000)), kind: "countdown", color: "#4bb8a9", emoji: "🏝️" },
  ];

  return {
    name: pick(NAMES),
    birthDate: birthISO,
    lifespanYears: pick([76, 80, 84, 90]),
    events,
  };
}
