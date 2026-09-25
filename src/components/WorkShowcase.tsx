import { useEffect, useRef, useState } from "react";
import imgMesh from "@/assets/work-mesh.jpg";
import imgSched from "@/assets/work-scheduler.jpg";
import imgVision from "@/assets/work-vision.jpg";
import imgZk from "@/assets/work-zk.jpg";

const PROJECTS = [
  { code: "PROJECT_01 // MESH", title: "Realtime Mesh Router", year: "2026", body: "Low-latency packet routing across a peer mesh, written in Rust.", tags: ["rust", "networking", "tokio"], img: imgMesh },
  { code: "PROJECT_02 // RAFT", title: "Distributed Scheduler", year: "2026", body: "Fault-tolerant job scheduler with Raft-backed consensus state.", tags: ["go", "raft", "k8s"], img: imgSched },
  { code: "PROJECT_03 // VISION", title: "Vision Ranker", year: "2025", body: "Image retrieval model served at sub-50ms p99.", tags: ["pytorch", "onnx", "ml"], img: imgVision },
  { code: "PROJECT_04 // ZK", title: "ZK Auth Prototype", year: "2025", body: "Passwordless login using zero-knowledge proofs.", tags: ["crypto", "circom", "ts"], img: imgZk },
];

/**
 * WorkShowcase — igloo-style horizontal showcase.
 * Fine pointers: wheel + drag + arrow keys drive a lerped, buttery transform.
 * At either end the gesture is released back to the vertical snap shell.
 * Touch devices: native scroll-snap strip.
 */
export function WorkShowcase({ active }: { active: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0);
  const [hoverable, setHoverable] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setHoverable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!hoverable) return;
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let current = 0;
    let raf = 0;

    const max = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
    const step = () => {
      const first = track.firstElementChild as HTMLElement | null;
      if (!first) return wrap.clientWidth;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return first.offsetWidth + gap;
    };
    const clamp = () => {
      targetRef.current = Math.max(0, Math.min(max(), targetRef.current));
    };

    const onWheel = (e: WheelEvent) => {
      if (!active) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if ((targetRef.current <= 0 && d < 0) || (targetRef.current >= max() - 1 && d > 0)) return; // release to shell
      e.preventDefault();
      targetRef.current += d;
      clamp();
    };

    let dragging = false;
    let startX = 0;
    let startT = 0;
    const onDown = (e: PointerEvent) => {
      if (!active) return;
      dragging = true;
      startX = e.clientX;
      startT = targetRef.current;
    };
    const onMoveP = (e: PointerEvent) => {
      if (!dragging) return;
      targetRef.current = startT - (e.clientX - startX) * 1.5;
      clamp();
    };
    const onUp = () => {
      dragging = false;
    };

    const onKey = (e: KeyboardEvent) => {
      if (!active) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        targetRef.current += step() * 0.85;
        clamp();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        targetRef.current -= step() * 0.85;
        clamp();
      }
    };

    const jump = (e: Event) => {
      targetRef.current = (e as CustomEvent<number>).detail;
      clamp();
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      current += (targetRef.current - current) * 0.085;
      if (Math.abs(targetRef.current - current) < 0.05) current = targetRef.current;
      track.style.transform = `translate3d(${-current.toFixed(2)}px, 0, 0)`;
      const m = max();
      if (barRef.current) barRef.current.style.transform = `scaleX(${m > 0 ? (current / m).toFixed(4) : 0})`;
      const i = Math.min(PROJECTS.length - 1, Math.round(current / step()));
      setIdx((prev) => (prev === i ? prev : i));
    };

    wrap.addEventListener("wheel", onWheel, { passive: false });
    wrap.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMoveP, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("keydown", onKey);
    wrap.addEventListener("work:jump", jump);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("wheel", onWheel);
      wrap.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMoveP);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
      wrap.removeEventListener("work:jump", jump);
    };
  }, [active, hoverable]);

  const jumpTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    wrapRef.current?.dispatchEvent(
      new CustomEvent("work:jump", { detail: i * (first.offsetWidth + gap) }),
    );
  };

  return (
    <div className="relative flex h-full flex-col justify-center py-20 md:py-16">
      <div className="flex items-end justify-between px-5 sm:px-8 md:px-16">
        <h3 className="font-display text-4xl font-bold uppercase italic leading-[0.9] tracking-tighter md:text-6xl">
          Selected
          <br />
          work<span className="text-primary">.</span>
        </h3>
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:block">
          scroll / drag / <span className="text-primary">→</span>
        </div>
      </div>

      <div
        ref={wrapRef}
        data-cursor-label="drag"
        className={`work-viewport mt-6 md:mt-10 ${hoverable ? "work-viewport-fine" : "no-scrollbar snap-x snap-mandatory overflow-x-auto"}`}
      >
        <div ref={trackRef} className={`work-track ${hoverable ? "" : "w-max"}`}>
          {PROJECTS.map((p, i) => (
            <article key={p.title} className="work-card group" data-active={i === idx}>
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="text-primary">{p.code}</span>
                <span>{p.year}</span>
              </div>
              <div className="mt-4 overflow-hidden border border-border bg-card">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1280}
                  height={800}
                  className="aspect-[16/10] w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100 md:grayscale-[30%] md:group-hover:grayscale-0"
                />
              </div>
              <div className="mt-5 flex items-end justify-between gap-6">
                <div className="min-w-0">
                  <h4 className="font-display text-2xl font-bold uppercase tracking-tight md:text-4xl">
                    {p.title}
                  </h4>
                  <p className="mt-2 max-w-lg text-sm text-muted-foreground">{p.body}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:h-14 md:w-14">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-5 px-5 sm:px-8 md:mt-8 md:px-16">
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
          <span className="text-primary">{String(idx + 1).padStart(2, "0")}</span> / {String(PROJECTS.length).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 bg-border/60">
          <div ref={barRef} className="h-px origin-left bg-primary" style={{ transform: "scaleX(0)" }} />
        </div>
        <div className="flex gap-2">
          {PROJECTS.map((p, i) => (
            <button
              key={p.title}
              onClick={() => jumpTo(i)}
              aria-label={`Go to ${p.title}`}
              data-active={i === idx}
              className="work-dot"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
