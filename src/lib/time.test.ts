import { describe, expect, it } from "vitest";
import { ageOn, lifeEnd, nextOccurrence, parseDate, toISO, totalWeeks, weekIndex } from "./time";

// weekIndex / lifeEnd are plain ms arithmetic, so a UTC birth keeps them identical in every timezone
const BIRTH = new Date("2000-01-01T00:00:00Z");
const WEEK = 7 * 86_400_000;

describe("weekIndex", () => {
  it("is 0 at birth and ticks over on the exact week boundary", () => {
    expect(weekIndex(BIRTH, BIRTH)).toBe(0);
    expect(weekIndex(BIRTH, new Date(BIRTH.getTime() + WEEK - 1))).toBe(0);
    expect(weekIndex(BIRTH, new Date(BIRTH.getTime() + WEEK))).toBe(1);
  });
});

describe("lifeEnd", () => {
  it("is 80 rows of 52 weeks after birth", () => {
    expect(totalWeeks(80)).toBe(4160);
    expect(lifeEnd(BIRTH, 80).toISOString()).toBe("2079-09-23T00:00:00.000Z");
  });
});

describe("ageOn", () => {
  it("is still the old age the day before a birthday", () => {
    const birth = parseDate("1990-05-15");
    expect(ageOn(birth, parseDate("2020-05-14"))).toBe(29);
    expect(ageOn(birth, parseDate("2020-05-15"))).toBe(30);
  });
});

describe("nextOccurrence", () => {
  const next = (iso: string, from: string) => toISO(nextOccurrence(iso, parseDate(from)));

  it("puts a Feb 29 event on Mar 1 in a non-leap year, and on Feb 29 in a leap year", () => {
    expect(next("2000-02-29", "2023-01-15")).toBe("2023-03-01");
    expect(next("2000-02-29", "2024-01-15")).toBe("2024-02-29");
  });
});
