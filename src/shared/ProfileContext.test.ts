import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { saveProfile } from "../lib/storage";
import { resolve } from "./ProfileContext";

const local = { name: "Local", birthDate: "1990-05-15", lifespanYears: 80, events: [] };

beforeEach(() => {
  const m = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  });
  // blank every VITE_* var so a developer's own .env cannot leak into a case
  for (const k of ["VITE_PROFILE", "VITE_BIRTHDATE", "VITE_NAME", "VITE_LIFESPAN", "VITE_EVENTS"]) vi.stubEnv(k, "");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("resolve", () => {
  it("prefers the profile saved in the browser over env", () => {
    saveProfile(local);
    vi.stubEnv("VITE_BIRTHDATE", "1985-01-01");
    expect(resolve()).toEqual({ profile: local, source: "local" });
  });

  it("uses env when nothing is saved", () => {
    vi.stubEnv("VITE_BIRTHDATE", "1985-01-01");
    expect(resolve()).toMatchObject({ source: "env", profile: { birthDate: "1985-01-01" } });
  });

  it("falls back to a random demo when neither is set", () => {
    expect(resolve().source).toBe("demo");
  });
});
