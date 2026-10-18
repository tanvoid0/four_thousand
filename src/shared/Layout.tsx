import { Link, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useProfile } from "./ProfileContext";
import Settings from "./Settings";

export const GITHUB_URL = "https://github.com/tanvoid0/four_thousand";

function Mark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className="shrink-0">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" fill="var(--bone)" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" fill="var(--accent)" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" fill="var(--bone)" opacity="0.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" fill="var(--bone)" opacity="0.26" />
    </svg>
  );
}

function NavLink({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const cls =
    "rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-[color,border-color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[var(--border-strong)] hover:text-[var(--text)]";
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export default function Layout() {
  const { isDemo, openSettings } = useProfile();
  const { pathname } = useLocation();

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <Mark />
            <span className="display text-[15px] font-semibold tracking-tight">Four Thousand Weeks</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <NavLink onClick={openSettings}>My life</NavLink>
            <NavLink href={GITHUB_URL}>GitHub</NavLink>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isDemo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-b border-[var(--border)]"
            style={{ background: "var(--accent-soft)" }}
          >
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
              <span className="flex items-center gap-2 text-[var(--muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                <span>
                  <strong className="font-semibold text-[var(--text)]">Demo</strong> — a random life, reshuffled on every visit. Not real
                  data.
                </span>
              </span>
              <button
                onClick={openSettings}
                className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
              >
                Make it yours →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mx-auto max-w-5xl px-4 py-10">
        <Outlet />
      </motion.main>

      <footer className="mt-10 border-t border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-[var(--muted)]">
          <p className="mb-3 max-w-xl leading-relaxed">
            An open project you can clone and make your own. Your data stays in your browser, or in your own build — never on a
            server.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[var(--faint)]">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-[var(--text)]">
              Source & setup on GitHub
            </a>
            <span>After “Four Thousand Weeks” by Oliver Burkeman · life-grid idea popularised by Tim Urban</span>
          </div>
        </div>
      </footer>

      <Settings />
    </div>
  );
}
