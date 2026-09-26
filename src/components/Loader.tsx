import { useEffect, useState } from "react";

/** Brief editorial title card with a single, quiet progress gesture. */
export function Loader() {
  const [p, setP] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.max(5, (100 - v) * 0.16));
      setP(Math.floor(v));
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => setGone(true), 300);
      }
    }, 28);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="loader" data-done={p >= 100} data-gone={gone} aria-hidden={gone}>
      <div className="loader-title relative flex w-full max-w-2xl flex-col items-center px-8 text-center">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Selected work · 2026</p>
        <h1 className="font-display text-5xl font-light leading-none text-foreground sm:text-7xl md:text-8xl">
          Rishik <span className="font-normal italic text-primary">RVR</span>
        </h1>
        <div className="mt-14 w-full max-w-xs">
          <div className="h-px overflow-hidden bg-border">
            <div className="h-full bg-foreground transition-[width] duration-150 ease-out" style={{ width: `${p}%` }} />
          </div>
          <div className="mt-4 flex justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
            <span>Loading portfolio</span>
            <span className="tabular-nums text-foreground">{p}%</span>
          </div>
        </div>
      </div>
      <p className="absolute bottom-8 left-8 hidden font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 sm:block">Portfolio — 2026</p>
      <p className="absolute bottom-8 right-8 hidden font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 sm:block">Vizianagaram, India</p>
    </div>
  );
}
