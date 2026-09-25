import { useEffect, useRef, useState } from "react";

const BOOT = [
  "POST /boot → kernel_init ................. OK",
  "mount /portfolio ......................... OK",
  "link topology [4/4] ...................... OK",
  "calibrate cursor + field ................. OK",
  "render pipeline ....................... READY",
];
const WORD = "SYSTEM SCHEMA";
const GLYPHS = "!<>-_\\/[]{}—=+*^?#0123456789";

/** Full-screen boot loader: decode-in title, segmented progress, staged log, wipe exit. */
export function Loader() {
  const [p, setP] = useState(0);
  const [gone, setGone] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [word, setWord] = useState("");
  const wordRef = useRef("");

  // scramble-decode the title
  useEffect(() => {
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame++;
      const resolved = Math.floor(frame / 3);
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

  // staged boot log
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setLines((s) => [...s, BOOT[i]]);
      i++;
      if (i >= BOOT.length) clearInterval(id);
    }, 380);
    return () => clearInterval(id);
  }, []);

  // eased progress
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.max(1.5, (100 - v) * 0.07));
      setP(Math.floor(v));
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => setGone(true), 500);
      }
    }, 40);
    return () => clearInterval(id);
  }, []);

  const segs = 28;
  const filled = Math.round((p / 100) * segs);

  return (
    <div className="loader" data-done={p >= 100} data-gone={gone} aria-hidden={gone}>
      <div className="boot-frame relative w-[min(88vw,560px)] px-6 py-8">
        <span className="boot-corner tl" />
        <span className="boot-corner tr" />
        <span className="boot-corner bl" />
        <span className="boot-corner br" />

        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.35em] text-muted-foreground">
          <span><span className="text-primary">core_system</span> v4.0</span>
          <span>secure_boot</span>
        </div>

        <div className="mt-8 text-center">
          <div className="font-display text-[clamp(1.6rem,6vw,3rem)] font-bold uppercase tracking-[-0.02em] text-foreground">
            {word || "​"}<span className="blinking-cursor text-primary" />
          </div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
            compiling portfolio
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between font-mono">
          <span className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">progress</span>
          <span className="font-display text-4xl font-light tabular-nums text-foreground">
            {p}<span className="text-primary">%</span>
          </span>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: segs }, (_, i) => (
            <span
              key={i}
              className="h-1.5 flex-1 transition-colors duration-150"
              style={{
                background: i < filled ? "var(--primary)" : "color-mix(in oklab, var(--border) 70%, transparent)",
                boxShadow: i < filled ? "0 0 8px color-mix(in oklab, var(--primary) 40%, transparent)" : "none",
              }}
            />
          ))}
        </div>

        <div className="mt-7 min-h-[6.5rem] space-y-1.5 font-mono text-[10px] leading-relaxed">
          {lines.map((l, i) => (
            <div
              key={i}
              className={`boot-line ${i === lines.length - 1 && p < 100 ? "text-foreground" : "text-muted-foreground/70"}`}
            >
              <span className="text-primary">[{String(i * 38 + 12).padStart(3, "0")}]</span> {l}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 inset-x-0 text-center font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60">
        schema.online — do not power off
      </div>
    </div>
  );
}
