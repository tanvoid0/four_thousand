import { motion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

export function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] ${className}`} style={style}>
      {children}
    </div>
  );
}

/** fades + rises into view once — the scroll-reveal rhythm */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="eyebrow rounded-full border px-2 py-0.5"
      style={{ borderColor: color ? `${color}55` : "var(--border)", color: color ?? "var(--muted)", letterSpacing: "0.1em" }}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "ghost",
  type = "button",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-[var(--accent-ink)] font-semibold hover:brightness-105"
      : variant === "danger"
        ? "border border-[color-mix(in_srgb,#e2884a_40%,transparent)] text-[var(--accent)] hover:bg-[var(--accent-soft)]"
        : "border border-[var(--border)] text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3.5 py-2 text-sm transition-[transform,background-color,border-color,filter] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
