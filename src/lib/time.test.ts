import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { ageOn, lifeEnd, nextOccurrence, parseDate, toISO, totalWeeks, weekIndex, weekStart } from "./time";

// births are local midnight (parseDate) and the week math counts calendar days, so build dates the same way
const BIRTH = new Date(2000, 0, 1);

describe("weekIndex", () => {
  it("is 0 at birth and ticks over at local midnight a week later", () => {
    expect(weekIndex(BIRTH, BIRTH)).toBe(0);
    expect(weekIndex(BIRTH, new Date(2000, 0, 7, 23, 59, 59, 999))).toBe(0);
    expect(weekIndex(BIRTH, new Date(2000, 0, 8))).toBe(1);
  });
});

describe("lifeEnd", () => {
  it("is 80 rows of 52 weeks after birth", () => {
    expect(totalWeeks(80)).toBe(4160);
    expect(toISO(lifeEnd(BIRTH, 80))).toBe("2079-09-23");
  });
});

// CI runs in UTC, which has no DST, so DST bugs are invisible there: run these in real DST zones whatever the machine is set to
const HOME_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

describe.each(["America/New_York", "Europe/London"])("across a DST change in %s", (tz) => {
  beforeAll(() => {
    vi.stubEnv("TZ", tz);
  });
  afterAll(() => {
    vi.stubEnv("TZ", HOME_TZ);
  });

  it("weekIndex counts calendar days, not blocks of 24h", () => {
    // fails loudly if the zone switch did not take, instead of passing vacuously
    expect(new Date(2024, 3, 1).getTimezoneOffset()).not.toBe(new Date(2024, 0, 1).getTimezoneOffset());
    // spring-forward in between: the two local midnights are 91 days apart on the calendar but 91 * 24h - 1h on the clock
    expect(weekIndex(new Date(2024, 0, 1), new Date(2024, 3, 1))).toBe(13);
  });

  it("lifeEnd and weekStart land on local midnight whichever way DST moved the clock", () => {
    expect(lifeEnd(new Date(2000, 0, 1), 80)).toEqual(new Date(2079, 8, 23)); // winter birth, summer end
    expect(weekStart(new Date(2024, 6, 1), 26)).toEqual(new Date(2024, 11, 30)); // summer birth, winter week
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

  it("looks for the next leap day, not the next Mar 1, once a non-leap year's Mar 1 has passed", () => {
    expect(next("2000-02-29", "2023-02-28")).toBe("2023-03-01");
    expect(next("2000-02-29", "2023-03-01")).toBe("2023-03-01"); // the day itself counts
    expect(next("2000-02-29", "2023-03-02")).toBe("2024-02-29");
    expect(next("2000-02-29", "2024-02-29")).toBe("2024-02-29");
  });
});
