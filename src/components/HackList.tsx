import { useEffect, useRef, useState } from "react";
import h1 from "@/assets/hack-1.jpg";
import h2 from "@/assets/hack-2.jpg";
import h3 from "@/assets/hack-3.jpg";
import h4 from "@/assets/hack-4.jpg";

export const HACKS = [
  { date: "2026.03", name: "HackMIT", project: "Edge inference for drones", result: "1st place", tags: ["ml", "edge"], img: h1 },
  { date: "2025.10", name: "ETHGlobal", project: "Private voting on-chain", result: "finalist", tags: ["zk", "web3"], img: h2 },
  { date: "2025.06", name: "Smart India Hackathon", project: "Grid fault detector", result: "winner", tags: ["iot", "signals"], img: h3 },
  { date: "2025.02", name: "HackerEarth Sprint", project: "Code-review copilot", result: "top 10", tags: ["llm", "devtools"], img: h4 },
];

/** Editorial hover list with a lerped floating preview that replaces the cursor. */
export function HackList() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [hoverable, setHoverable] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setHoverable(true);
    let mx = 0, my = 0, x = 0, y = 0, vx = 0, raf = 0;
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const nx = x + (mx - x) * 0.14;
      vx = nx - x;
      x = nx;
      y += (my - y) * 0.14;
      const tilt = Math.max(-12, Math.min(12, vx * 0.6));
      if (cardRef.current)
        cardRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
    };
    loop();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);

  useEffect(() => {
    document.body.dataset.cursorHidden = active !== null && hoverable ? "true" : "false";
    return () => { document.body.dataset.cursorHidden = "false"; };
  }, [active, hoverable]);

  const cur = active !== null ? HACKS[active] : null;

  return (
    <div ref={wrapRef} onPointerLeave={() => setActive(null)} className="border-t border-border">
      {HACKS.map((h, i) => (
        <div
          key={h.name}
          onPointerEnter={() => setActive(i)}
          data-active={active === i}
          className="hack-row group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-2 py-5 md:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_6rem_2rem] md:gap-6 md:py-7"
        >
          <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              {!hoverable && <img src={h.img} alt="" loading="lazy" width={64} height={44} className="h-11 w-16 shrink-0 rounded-sm object-cover" />}
              <div className="min-w-0">
                <div className="truncate font-display text-lg transition-colors group-hover:text-foreground md:text-2xl">{h.name}</div>
                <div className="truncate text-xs text-muted-foreground md:hidden">{h.project}</div>
              </div>
            </div>
          </div>
          <div className="hidden min-w-0 flex-wrap items-center gap-2 md:flex">
            <span className="truncate text-sm text-muted-foreground">{h.project}</span>
            {h.tags.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          <span className="text-right text-[10px] uppercase tracking-[0.25em] text-primary md:text-left">{h.result}<span className="block text-muted-foreground md:hidden">{h.date}</span></span>
          <span className="hidden text-right text-lg text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary md:block">↗</span>
        </div>
      ))}

      {hoverable && (
        <div ref={cardRef} className="hack-preview" data-show={cur !== null} aria-hidden>
          <div className="hack-preview-inner">
            {HACKS.map((h, i) => (
              <img key={h.name} src={h.img} alt="" width={992} height={672} className="absolute inset-0 h-full w-full object-cover transition-all duration-500" style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.12)" }} />
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-4">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{cur?.date}</div>
                  <div className="truncate font-display text-base">{cur?.project}</div>
                </div>
                <span className="shrink-0 rounded-sm bg-primary px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-primary-foreground">{cur?.result}</span>
              </div>
            </div>
            <span className="absolute left-3 top-3 text-[9px] uppercase tracking-[0.3em] text-foreground/80">● view</span>
          </div>
        </div>
      )}
    </div>
  );
}
