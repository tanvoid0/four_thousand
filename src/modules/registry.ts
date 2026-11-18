import type { LifeModule } from "./types";

/**
 * The master list of concept modules. Each one's `accent` is taken from its
 * book cover, so the page themes to the book.
 *
 * To add a new one (e.g. a different book):
 *   1. create src/modules/<id>/<Name>Page.tsx exporting a default component
 *   2. add an entry below (status "live" + a `load` importing it)
 * To use a real cover image, set `cover.image` to a file in /public.
 */
export const MODULES: LifeModule[] = [
  {
    id: "weeks",
    path: "weeks",
    title: "Four Thousand Weeks",
    subtitle: "Time Management for Mortals",
    author: "Oliver Burkeman",
    tagline: "Your whole life is about four thousand weeks. See where you are in it, and what's left.",
    accent: "#1fa5c4", // cyan — sky & water of the cover
    accent2: "#f0c04c", // gold — the cover's subtitle
    // jacket image is not bundled (publisher artwork); the designed fallback cover shows.
    cover: { bg: "linear-gradient(180deg,#3fb6d6,#1c93b4 58%,#14728d)", ink: "#ffffff", image: "/covers/four-thousand-weeks.jpg" },
    status: "live",
    load: () => import("./weeks/WeeksPage"),
  },
  {
    id: "habits",
    path: "habits",
    title: "Atomic Habits",
    subtitle: "An Easy & Proven Way to Build Good Habits",
    author: "James Clear",
    tagline: "Track streaks and compounding 1% gains. Watch small, boring days stack into something large.",
    accent: "#e8b53a", // the pale-gold Atomic Habits jacket
    accent2: "#5fb87a",
    cover: { bg: "#f3eccf", ink: "#20201a", image: "/covers/atomic-habits.jpg" },
    status: "soon",
  },
];

export const liveModules = () => MODULES.filter((m) => m.status === "live");
export const findModule = (path: string) => MODULES.find((m) => m.path === path);
