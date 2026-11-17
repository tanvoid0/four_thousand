import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Profile } from "../types";
import { coerceProfile, loadProfile, saveProfile } from "./storage";

// the key is private to storage.ts and is the upgrade contract (saved profiles live under it),
// so it is pinned here as a literal on purpose
const KEY = "four_thousand.profile.v1";

const profile: Profile = {
  name: "Sam",
  birthDate: "1990-05-15",
  lifespanYears: 85,
  events: [{ id: "e1", title: "First job", date: "2012-07-01", kind: "milestone", color: "#fbbf24", emoji: "💼" }],
};

beforeEach(() => {
  const m = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("coerceProfile", () => {
  it("accepts a valid export unchanged", () => {
    expect(coerceProfile(profile)).toEqual(profile);
  });

  it("rejects a missing or invalid birthDate", () => {
    expect(coerceProfile({ lifespanYears: 80, events: [] })).toBeNull();
    for (const birthDate of [undefined, null, "", "not-a-date", "1990-13-45", 19900515]) {
      expect(coerceProfile({ ...profile, birthDate }), String(birthDate)).toBeNull();
    }
  });

  // not a clamp: an out-of-range lifespan falls back to the default 80, it does not snap to 1 or 150
  it("keeps lifespan in 1..150, else falls back to 80", () => {
    const life = (lifespanYears: unknown) => coerceProfile({ ...profile, lifespanYears })?.lifespanYears;
    expect([1, 150, 90.4, "90"].map(life)).toEqual([1, 150, 90, 90]);
    expect([0, -5, 151, 200, "abc", undefined].map(life)).toEqual([80, 80, 80, 80, 80, 80]);
  });

  it("drops events with a bad date or shape and keeps the rest", () => {
    const [good] = profile.events;
    const events = [good, { ...good, date: "nope" }, { title: "no date" }, null, "x"];
    expect(coerceProfile({ ...profile, events })?.events).toEqual([good]);
  });
});

describe("loadProfile / saveProfile", () => {
  it("round-trips under the v1 key", () => {
    expect(saveProfile(profile)).toBe(true);
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify(profile));
    expect(loadProfile()).toEqual(profile);
  });

  it("loadProfile returns null instead of throwing on corrupt or unusable JSON", () => {
    for (const raw of ["{not json", "null", "{}"]) {
      localStorage.setItem(KEY, raw);
      expect(loadProfile(), raw).toBeNull();
    }
  });

  it("saveProfile returns false when the browser refuses the write", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(saveProfile(profile)).toBe(false);
  });
});
