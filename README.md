# Four Thousand Weeks

> The average human life is about **four thousand weeks**. This is a way to *see* yours.

An open-source, privacy-first web app that draws your whole life as a grid of ~4,000 squares — one per week — marked with the events that matter and a live countdown of the weeks you have left. Clone it, set your birth date, and make it your own.

Inspired by [*Four Thousand Weeks*](https://www.oliverburkeman.com/books) by Oliver Burkeman and the classic ["Your Life in Weeks"](https://waitbutwhy.com/2014/05/life-weeks.html) chart by Tim Urban.

---

## ✨ Features

- **Your life in weeks** — every square is a week; lived weeks fill in, the current week pulses, the rest wait.
- **Life events** — add birthdays, jobs, moves, goals. They appear as coloured markers on the grid and as live countdowns.
- **Live countdowns** — weeks remaining to your life expectancy, plus days/hours to your next event.
- **Three ways to set your data, zero servers** — browser-only, `.env`, or a deployed secret. Nothing is ever uploaded.
- **Random demo mode** — with no data configured, the site shows a fresh random life on every load, clearly flagged as a demo.
- **Extensible** — built as independent "concept" modules so new ideas (e.g. *Atomic Habits*) can be added without touching the rest.

## 🔒 Where your data lives (and how to set it)

Your birth date and events are **never sent anywhere**. The app resolves them in this order:

| Priority | Source | Good for | Visibility |
|---|---|---|---|
| 1 | **Environment variables** (`.env` locally, or Actions secrets on deploy) | A personal build that always boots to your life | As public/private as the site you deploy |
| 2 | **Browser `localStorage`** (⚙ My life → Save) | Trying it out, private to one browser | Only on your machine |
| 3 | **Random demo** | What visitors see on the public repo | Fake data |

**Option A — just use it in your browser:** click **⚙ My life**, enter your details, Save. Done. Private to that browser.

**Option B — pin it with `.env`:** copy `.env.example` to `.env`, set `VITE_BIRTHDATE` (and optionally `VITE_NAME`, `VITE_LIFESPAN`, `VITE_EVENTS`), run the app. It now always boots to your life. `.env` is gitignored.

**Option C — deploy your own:** see *Deploy* below. Keep it a demo, or add Actions secrets to bake your life into your own published site.

> Export/Import JSON is in ⚙ My life — the export is exactly the shape `VITE_PROFILE` expects.

## 🚀 Local development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build       # production build to dist/
npm run preview     # serve the built dist/ locally
npm run typecheck   # tsc --noEmit
```

## 🌐 Deploy to GitHub Pages

1. Push to a GitHub repo.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

The workflow sets the asset base path to `/<your-repo-name>/` for you, so project pages (`https://<user>.github.io/<repo>/`) just work.

- **Deploying to a custom domain or a `<user>.github.io` root repo?** Set `base: '/'` in `vite.config.ts`.
- **Want your deploy to show your real life?** Add any of these as repo secrets (**Settings → Secrets and variables → Actions**): `VITE_BIRTHDATE`, `VITE_NAME`, `VITE_LIFESPAN`, `VITE_EVENTS`, or a full `VITE_PROFILE`. Leave them off to publish the random demo.

## 🧩 Architecture — adding a new concept

Each idea is a self-contained **module** with its own route and UX. The home hub and the router are both generated from one registry, so adding a concept is a two-step job.

```
src/
├── App.tsx                 # router: builds routes from the module registry
├── pages/Home.tsx          # the hub (reads the registry)
├── shared/                 # cross-module layer
│   ├── ProfileContext.tsx  # the life data (birth date + events), shared by any module
│   ├── Layout.tsx          # header, demo banner, footer
│   ├── Settings.tsx        # the profile editor
│   └── ui.tsx              # Card, Reveal, StatCard, Button…
├── lib/                    # time math, storage, env config, demo generator, hooks
└── modules/
    ├── registry.ts         # ← the master list of concepts
    ├── types.ts            # the LifeModule contract
    └── weeks/              # the Four Thousand Weeks module
        └── WeeksPage.tsx
```

To add, say, an *Atomic Habits* module:

1. Create `src/modules/habits/HabitsPage.tsx` with a default-exported component (use `useProfile()` if it needs the birth date, or keep its own state).
2. Flip the existing `habits` entry in `src/modules/registry.ts` to `status: "live"` and give it a `load: () => import("./habits/HabitsPage")`.

That's it — it appears on the hub and gets a route (`#/habits`), lazy-loaded so it never slows the first paint.

## 🛠 Built with

[Vite](https://vite.dev) · [React](https://react.dev) + TypeScript · [Tailwind CSS](https://tailwindcss.com) · [Motion](https://motion.dev) · [React Router](https://reactrouter.com)

## 📄 License

MIT — do whatever you like. A link back is appreciated but not required.
