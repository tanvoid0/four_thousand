import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Profile } from "../types";
import { envProfile } from "../lib/config";
import { clearProfile, loadProfile, saveProfile } from "../lib/storage";
import { randomDemo } from "../lib/demo";

/** where the active profile came from */
export type ProfileSource = "env" | "local" | "demo";

interface Ctx {
  profile: Profile;
  source: ProfileSource;
  isDemo: boolean;
  /** persist to this browser and switch to personal mode */
  save: (p: Profile) => void;
  /** forget the saved profile and drop back to a fresh random demo */
  resetToDemo: () => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const ProfileCtx = createContext<Ctx | null>(null);

function resolve(): { profile: Profile; source: ProfileSource } {
  const fromEnv = envProfile();
  if (fromEnv) return { profile: fromEnv, source: "env" };
  const fromLocal = loadProfile();
  if (fromLocal) return { profile: fromLocal, source: "local" };
  return { profile: randomDemo(), source: "demo" };
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  // resolved once per page load — so the demo reshuffles on every reload
  const [{ profile, source }, setState] = useState(resolve);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const save = useCallback((p: Profile) => {
    saveProfile(p);
    setState({ profile: p, source: "local" });
  }, []);

  const resetToDemo = useCallback(() => {
    clearProfile();
    setState({ profile: randomDemo(), source: "demo" });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      profile,
      source,
      isDemo: source === "demo",
      save,
      resetToDemo,
      settingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [profile, source, settingsOpen, save, resetToDemo],
  );

  return <ProfileCtx.Provider value={value}>{children}</ProfileCtx.Provider>;
}

export function useProfile(): Ctx {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}
