import { Component, type ReactNode } from "react";
import { KEY, downloadJSON } from "../lib/storage";
import { Button, Card } from "./ui";

/** the saved profile exactly as stored, so even JSON the app would reject stays recoverable; null = nothing stored (or storage blocked) */
function savedRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/**
 * Wraps the whole app so a render crash or a failed lazy chunk (a stale tab after a redeploy) shows this
 * instead of a blank page. Read-only on purpose: it must never clear or write the saved profile.
 */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  // a flag rather than the error itself: `throw undefined` would otherwise slip past the `if`
  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const raw = savedRaw();
    return (
      <div role="alert" className="mx-auto max-w-md px-4 py-24">
        <Card className="p-6 text-center">
          <h1 className="display text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Reloading usually fixes it.{" "}
            {raw === null ? "Nothing is saved in this browser, so there is no data to download." : "Your saved data is untouched."}
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reload
            </Button>
            <Button disabled={raw === null} onClick={() => raw && downloadJSON(raw, "four-thousand-weeks-backup.json")}>
              Download my data
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}
