export type EventKind = "milestone" | "countdown" | "recurring";

export interface LifeEvent {
  id: string;
  title: string;
  /** ISO date, yyyy-mm-dd */
  date: string;
  kind: EventKind;
  /** hex colour for the grid marker + card accent */
  color: string;
  emoji?: string;
}

export interface Profile {
  name?: string;
  /** ISO date, yyyy-mm-dd */
  birthDate: string;
  /** expected lifespan in years; drives the size of the grid */
  lifespanYears: number;
  events: LifeEvent[];
}
