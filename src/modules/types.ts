import type { ComponentType } from "react";

export interface BookCover {
  /** cover background */
  bg: string;
  /** cover text/ink */
  ink: string;
  /** optional real cover image (path in /public or a URL); overrides the designed cover */
  image?: string;
}

/**
 * A concept/book view. Add one by dropping a folder under src/modules and
 * appending an entry to src/modules/registry.ts — the home hub and the router
 * both read the registry, so nothing else needs touching.
 */
export interface LifeModule {
  id: string;
  /** URL segment, e.g. "weeks" -> #/weeks */
  path: string;
  title: string;
  subtitle?: string;
  author: string;
  tagline: string;
  /** accent drawn from the book cover — themes the whole module page */
  accent: string;
  /** gradient partner for the accent (gauge/timeline) */
  accent2: string;
  cover: BookCover;
  /** "live" renders; "soon" shows on the hub as coming-up and has no route */
  status: "live" | "soon";
  /** lazy-loaded page; omit for "soon" modules */
  load?: () => Promise<{ default: ComponentType }>;
}
