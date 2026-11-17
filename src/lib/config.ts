import type { Profile } from "../types";
import { coerceProfile } from "./storage";

/**
 * Build-time profile, baked from environment variables so a fork can show its
 * owner's real life without anyone touching the browser. Set these in a local
 * `.env` file or as GitHub Actions secrets (see .env.example and the README):
 *
 *   VITE_PROFILE    full JSON export (wins if present)
 *   VITE_BIRTHDATE  yyyy-mm-dd      \
 *   VITE_NAME       display name     |  minimal setup
 *   VITE_LIFESPAN   years (def. 80)  |
 *   VITE_EVENTS     JSON array      /
 *
 * Returns null when nothing is configured — the app then shows a random demo.
 * A profile saved in the browser outranks these vars (see resolve() in ProfileContext).
 */
export function envProfile(): Profile | null {
  const env = import.meta.env;

  if (env.VITE_PROFILE) {
    try {
      const p = coerceProfile(JSON.parse(env.VITE_PROFILE));
      if (p) return p;
    } catch {
      /* malformed — fall through to the field vars */
    }
  }

  if (env.VITE_BIRTHDATE) {
    let events: unknown = [];
    try {
      events = env.VITE_EVENTS ? JSON.parse(env.VITE_EVENTS) : [];
    } catch {
      events = [];
    }
    return coerceProfile({
      name: env.VITE_NAME,
      birthDate: env.VITE_BIRTHDATE,
      lifespanYears: env.VITE_LIFESPAN,
      events,
    });
  }

  return null;
}
