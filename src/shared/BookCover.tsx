import { useState } from "react";
import type { BookCover as Cover } from "../modules/types";

interface Props {
  title: string;
  subtitle?: string;
  author: string;
  cover: Cover;
  accent: string;
  accent2?: string;
  className?: string;
}

/** A small book cover. Shows the real jacket when cover.image resolves,
 *  otherwise a designed cover in the same palette. The accent is drawn here. */
export default function BookCover({ title, subtitle, author, cover, accent, accent2, className = "" }: Props) {
  const [imgOk, setImgOk] = useState(Boolean(cover.image));
  // make a repo-relative path (e.g. "/covers/x.jpg") honour the Vite base path,
  // so it resolves under GitHub Pages' /<repo>/ too; leave full URLs untouched.
  const src =
    cover.image && (/^https?:\/\//.test(cover.image) ? cover.image : import.meta.env.BASE_URL + cover.image.replace(/^\//, ""));
  const showImage = src && imgOk;

  return (
    <div
      className={`relative aspect-[2/3] shrink-0 overflow-hidden rounded-[2px] rounded-r-md ${className}`}
      style={{ background: cover.bg, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6), 0 2px 6px -2px rgba(0,0,0,0.4)" }}
      aria-label={`${title} by ${author}`}
    >
      {showImage ? (
        <img src={src} alt={`${title} cover`} className="h-full w-full object-cover" onError={() => setImgOk(false)} />
      ) : (
        <div className="flex h-full flex-col p-[9%]" style={{ color: cover.ink }}>
          <span className="display text-[clamp(11px,2.7vw,16px)] font-bold leading-[1.05]">{title}</span>
          {subtitle && (
            <span className="mt-[6%] text-[clamp(7px,1.5vw,9px)] font-semibold leading-tight" style={{ color: accent2 ?? accent }}>
              {subtitle}
            </span>
          )}
          <span className="mt-auto text-[clamp(7px,1.5vw,9px)] font-medium opacity-80">{author}</span>
        </div>
      )}
      {/* spine shadow + page sheen */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[7%]" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.3), transparent)" }} />
      <span className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(255,255,255,0.16), transparent 32%)" }} />
    </div>
  );
}
