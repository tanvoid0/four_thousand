import { Link } from "react-router-dom";
import { MODULES } from "../modules/registry";
import { useProfile } from "../shared/ProfileContext";
import { GITHUB_URL } from "../shared/Layout";
import { Badge, Button, Card, Reveal } from "../shared/ui";
import BookCover from "../shared/BookCover";

export default function Home() {
  const { openSettings, isDemo, profile } = useProfile();

  return (
    <div className="space-y-16">
      <Reveal className="pt-6 text-center">
        <div className="eyebrow">An almanac of your time</div>
        <h1 className="display mx-auto mt-5 max-w-3xl text-5xl font-semibold leading-[1.03] sm:text-7xl">
          See your life, <span className="text-[var(--accent)]">one week</span> at a time.
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[var(--muted)]">
          Great books about time and habits, turned into something you can actually look at. Each concept takes its
          colour from its cover. Start with your four thousand weeks.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/weeks">
            <Button variant="primary">Open the weeks grid →</Button>
          </Link>
          <Button onClick={openSettings}>{isDemo ? "Set up my life" : "Edit my life"}</Button>
        </div>
      </Reveal>

      <section>
        <Reveal className="eyebrow mb-4">The shelf</Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {MODULES.map((m, i) => {
            const live = m.status === "live";
            const inner = (
              <Card
                className={`group flex h-full gap-4 p-4 transition-[border-color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${live ? "hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]" : "opacity-55"}`}
              >
                <BookCover title={m.title} subtitle={m.subtitle} author={m.author} cover={m.cover} accent={m.accent} accent2={m.accent2} className="w-16 self-start sm:w-[72px]" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <span className="mono text-xs text-[var(--faint)]">{String(i + 1).padStart(2, "0")}</span>
                    <Badge color={live ? m.accent : undefined}>{live ? "Live" : "Soon"}</Badge>
                  </div>
                  <h3 className="display mt-1.5 text-lg font-semibold leading-tight">{m.title}</h3>
                  <p className="text-xs text-[var(--faint)]">{m.author}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">{m.tagline}</p>
                </div>
              </Card>
            );
            return (
              <Reveal key={m.id} delay={i * 0.05} className="h-full">
                {live ? (
                  <Link to={`/${m.path}`} className="block h-full">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      <section>
        <Reveal className="mb-5">
          <h2 className="display text-2xl font-semibold">Make it yours</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {isDemo
              ? "Right now this is a random demo life. Three ways to make it real — none of them touch a server:"
              : `You're set up${profile.name ? ` as ${profile.name}` : ""}. Here's how it's stored, and how to share it:`}
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          <HowCard step="01" title="In your browser">
            Hit <b className="text-[var(--text)]">My life</b> and enter your birth date and events. Saved to this browser only —
            private, nothing uploaded. <button onClick={openSettings} className="text-[var(--accent)] underline-offset-4 hover:underline">Open it →</button>
          </HowCard>
          <HowCard step="02" title="Pin it with .env">
            Clone the repo, set <code className="mono rounded bg-[var(--surface-2)] px-1 text-[var(--text)]">VITE_BIRTHDATE</code> in a{" "}
            <code className="mono">.env</code> file, and every build boots straight to your life.
          </HowCard>
          <HowCard step="03" title="Fork & deploy">
            Fork it, drop your details into a GitHub Actions secret, and publish your own copy to GitHub Pages in minutes.{" "}
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-[var(--accent)] underline-offset-4 hover:underline">Read the setup →</a>
          </HowCard>
        </div>
      </section>
    </div>
  );
}

function HowCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mono mb-3 text-xs text-[var(--accent)]">{step}</div>
      <h3 className="display font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{children}</p>
    </Card>
  );
}
