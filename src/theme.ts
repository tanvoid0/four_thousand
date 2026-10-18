/**
 * THE single source of colour for the whole app.
 * Edit the values here and everything — UI, gauge, timeline, event swatches —
 * recolours. Core tokens are pushed to CSS variables at boot (applyTheme, from
 * main.tsx). The ACCENT is per-module: each concept draws its accent from its
 * book cover (see src/modules/registry.ts), and that accent themes its page.
 */
export const theme = {
  // surfaces — neutral ink, slightly cool
  bg: "#0d0d10",
  bg2: "#141418",
  text: "#ededf0",
  muted: "#9a9aa6",
  faint: "#5b5b67",
  surface: "rgba(255,255,255,0.03)",
  surface2: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.09)",
  borderStrong: "rgba(255,255,255,0.18)",

  // default accent (home / chrome) — drawn from the first book's cover.
  // Module pages override this with their own cover accent.
  accent: "#1fa5c4", // cyan — the sky/water of the Four Thousand Weeks cover
  accent2: "#f0c04c", // gold — the cover's subtitle (gradient partner)
  accentInk: "#06212a", // readable text on an accent fill

  bone: "#e9e7e0", // "ink" for filled weeks in the grid
} as const;

/** curated event palette — "the colour of moments". Modern, balanced. */
export const EVENT_COLORS = [
  "#ff7a5c", // coral
  "#f2b544", // gold
  "#9dce67", // lime
  "#4bb8a9", // teal
  "#5f9ae6", // sky
  "#a98cff", // violet
  "#ef7fb0", // pink
  "#e0995a", // amber
];

export function eventColor(seed = Math.random()): string {
  return EVENT_COLORS[Math.floor(seed * EVENT_COLORS.length) % EVENT_COLORS.length];
}

/** #rrggbb + alpha -> rgba() string */
export function withAlpha(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** push the core tokens onto :root as CSS variables */
export function applyTheme(t: typeof theme = theme): void {
  const r = document.documentElement.style;
  const set: Record<string, string> = {
    "--bg": t.bg,
    "--bg-2": t.bg2,
    "--text": t.text,
    "--muted": t.muted,
    "--faint": t.faint,
    "--surface": t.surface,
    "--surface-2": t.surface2,
    "--border": t.border,
    "--border-strong": t.borderStrong,
    "--bone": t.bone,
    "--cell-lived": t.bone,
    "--cell-future": "rgba(255,255,255,0.06)",
  };
  for (const k in set) r.setProperty(k, set[k]);
  setAccent(t.accent, t.accent2, t.accentInk);
}

/** set the active accent (whole app themes to it) */
export function setAccent(accent: string, accent2: string = accent, ink: string = theme.accentInk): void {
  const r = document.documentElement.style;
  r.setProperty("--accent", accent);
  r.setProperty("--accent-2", accent2);
  r.setProperty("--accent-ink", ink);
  r.setProperty("--accent-soft", withAlpha(accent, 0.14));
  r.setProperty("--cell-current", accent);
}
