import { useEffect, useRef, useState } from "react";
import { setAccent, theme } from "../theme";

/** theme the whole app to a module's accent while its page is mounted */
export function useAccent(accent?: string, accent2?: string): void {
  useEffect(() => {
    if (!accent) return;
    setAccent(accent, accent2 ?? accent);
    return () => setAccent(theme.accent, theme.accent2);
  }, [accent, accent2]);
}

/** a Date that ticks every `ms` — drives the live countdowns */
export function useNow(ms = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

/** animate an integer from its previous value to `target` once on change */
export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
