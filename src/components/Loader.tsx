import { useEffect, useRef, useState } from "react";

const WORD = "RISHIK RVR";
const GLYPHS = "!<>-_\\/[]{}—=+*^?#0123456789";

/** Full-screen boot loader: decode-in title, segmented progress, wipe exit. */
export function Loader() {
  const [p, setP] = useState(0);
  const [gone, setGone] = useState(false);
  const [word, setWord] = useState("");
  const wordRef = useRef("");

  // scramble-decode the title
  useEffect(() => {
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame++;
      const resolved = Math.floor(frame / 2);
      const out = WORD.split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < resolved) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      wordRef.current = out;
      setWord(out);
      if (resolved <= WORD.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // eased progress — fast, ~1000ms
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.max(4, (100 - v) * 0.14));
      setP(Math.floor(v));
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => setGone(true), 350);
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  const segs = 24;
  const filled = Math.round((p / 100) * segs);

  return (
    <div className="loader" data-done={p >= 100} data-gone={gone} aria-hidden={gone}>
      <div className="boot-frame relative w-[min(88vw,520px)] px-6 py-10">
        <span className="boot-corner tl" />
        <span className="boot-corner tr" />
        <span className="boot-corner bl" />
        <span className="boot-corner br" />

        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.35em] text-muted-foreground">
          <span><span className="text-primary">rvr</span> · 2026</span>
          <span>loading</span>
        </div>

        <div className="mt-10 text-center">
          <div className="font-display text-[clamp(1.6rem,6vw,2.8rem)] font-bold uppercase tracking-[-0.02em] text-foreground">
            {word || "​"}<span className="blinking-cursor text-primary" />
          </div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
            loading portfolio
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between font-mono">
          <span className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">progress</span>
          <span className="font-display text-3xl font-light tabular-nums text-foreground">
            {p}<span className="text-primary">%</span>
          </span>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: segs }, (_, i) => (
            <span
              key={i}
              className="h-1.5 flex-1 transition-colors duration-100"
              style={{
                background: i < filled ? "var(--primary)" : "color-mix(in oklab, var(--border) 70%, transparent)",
                boxShadow: i < filled ? "0 0 8px color-mix(in oklab, var(--primary) 40%, transparent)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 inset-x-0 text-center font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60">
        rishik rvr — computer science
      </div>
    </div>
  );
}
