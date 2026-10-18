import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { EventKind, LifeEvent, Profile } from "../types";
import { coerceProfile, exportProfile, randomColor } from "../lib/storage";
import { isValidISO } from "../lib/time";
import { EVENT_COLORS } from "../theme";
import { useProfile } from "./ProfileContext";
import { Button } from "./ui";

const SWATCHES = EVENT_COLORS;
const KINDS: { value: EventKind; label: string; hint: string }[] = [
  { value: "milestone", label: "Milestone", hint: "a one-off moment, past or future" },
  { value: "countdown", label: "Countdown", hint: "a fixed future date to count down to" },
  { value: "recurring", label: "Recurring", hint: "repeats every year (birthdays, anniversaries)" },
];

export default function Settings() {
  const { profile, source, settingsOpen, closeSettings, save, resetToDemo } = useProfile();
  const [draft, setDraft] = useState<Profile>(profile);
  const fileRef = useRef<HTMLInputElement>(null);

  // reload the draft from the live profile each time the panel opens
  useEffect(() => {
    if (settingsOpen) setDraft(profile);
  }, [settingsOpen, profile]);

  const valid = isValidISO(draft.birthDate);

  const patch = (p: Partial<Profile>) => setDraft((d) => ({ ...d, ...p }));
  const patchEvent = (id: string, p: Partial<LifeEvent>) =>
    setDraft((d) => ({ ...d, events: d.events.map((e) => (e.id === id ? { ...e, ...p } : e)) }));
  const addEvent = () =>
    setDraft((d) => ({
      ...d,
      events: [
        ...d.events,
        { id: crypto.randomUUID(), title: "", date: new Date().toISOString().slice(0, 10), kind: "milestone", color: randomColor() },
      ],
    }));
  const removeEvent = (id: string) => setDraft((d) => ({ ...d, events: d.events.filter((e) => e.id !== id) }));

  const onImport = async (file: File) => {
    try {
      const p = coerceProfile(JSON.parse(await file.text()));
      if (p) setDraft(p);
      else alert("That file isn't a valid profile export.");
    } catch {
      alert("Couldn't read that file.");
    }
  };

  return (
    <AnimatePresence>
      {settingsOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSettings}
        >
          <motion.div
            className="flex h-full w-full max-w-md flex-col border-l border-[var(--border)] bg-[#0b0b14]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 className="display text-xl font-semibold">Your life</h2>
              <button onClick={closeSettings} className="text-[var(--muted)] hover:text-white" aria-label="Close">
                ✕
              </button>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              {source === "env" && (
                <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--muted)]">
                  This deploy is configured from environment variables. Changes here are saved to this browser only and
                  override the baked-in profile locally.
                </p>
              )}

              <div className="space-y-3">
                <Field label="Name (optional)">
                  <input
                    className="input"
                    value={draft.name ?? ""}
                    placeholder="e.g. Sam"
                    onChange={(e) => patch({ name: e.target.value })}
                  />
                </Field>
                <Field label="Birth date">
                  <input type="date" className="input" value={draft.birthDate} onChange={(e) => patch({ birthDate: e.target.value })} />
                </Field>
                <Field label={`Life expectancy — ${draft.lifespanYears} years`}>
                  <input
                    type="range"
                    min={40}
                    max={120}
                    value={draft.lifespanYears}
                    onChange={(e) => patch({ lifespanYears: Number(e.target.value) })}
                    className="w-full accent-[var(--accent)]"
                  />
                </Field>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Life events</h3>
                  <Button onClick={addEvent}>+ Add</Button>
                </div>
                <div className="space-y-3">
                  {draft.events.length === 0 && <p className="text-xs text-[var(--muted)]">No events yet. Add birthdays, jobs, moves, goals…</p>}
                  {draft.events.map((ev) => (
                    <div key={ev.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                      <div className="flex gap-2">
                        <input
                          className="input w-14 text-center"
                          value={ev.emoji ?? ""}
                          placeholder="🎂"
                          maxLength={2}
                          onChange={(e) => patchEvent(ev.id, { emoji: e.target.value })}
                        />
                        <input
                          className="input flex-1"
                          value={ev.title}
                          placeholder="What happened?"
                          onChange={(e) => patchEvent(ev.id, { title: e.target.value })}
                        />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input type="date" className="input flex-1" value={ev.date} onChange={(e) => patchEvent(ev.id, { date: e.target.value })} />
                        <select
                          className="input"
                          value={ev.kind}
                          onChange={(e) => patchEvent(ev.id, { kind: e.target.value as EventKind })}
                          title={KINDS.find((k) => k.value === ev.kind)?.hint}
                        >
                          {KINDS.map((k) => (
                            <option key={k.value} value={k.value}>
                              {k.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex gap-1.5">
                          {SWATCHES.map((c) => (
                            <button
                              key={c}
                              onClick={() => patchEvent(ev.id, { color: c })}
                              className="h-5 w-5 rounded-full border-2 transition"
                              style={{ background: c, borderColor: ev.color === c ? "#fff" : "transparent" }}
                              aria-label={`colour ${c}`}
                            />
                          ))}
                        </div>
                        <button onClick={() => removeEvent(ev.id)} className="text-xs text-[#fb7185] hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => exportProfile(draft)}>⬇ Export JSON</Button>
                <Button onClick={() => fileRef.current?.click()}>⬆ Import JSON</Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onImport(f);
                    e.target.value = "";
                  }}
                />
              </div>

              <p className="text-xs leading-relaxed text-[var(--muted)]">
                Saved only in this browser — nothing is uploaded. For a permanent personal deploy, set
                <code className="mono mx-1 rounded bg-[var(--surface-2)] px-1">VITE_BIRTHDATE</code>
                in a <code className="mono">.env</code> file or a GitHub Actions secret. See the README.
              </p>
            </div>

            <footer className="flex items-center gap-2 border-t border-[var(--border)] px-5 py-4">
              <Button
                variant="primary"
                disabled={!valid}
                onClick={() => {
                  save(draft);
                  closeSettings();
                }}
                className="flex-1"
              >
                Save to this browser
              </Button>
              <Button variant="danger" onClick={resetToDemo}>
                Reset to demo
              </Button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}
