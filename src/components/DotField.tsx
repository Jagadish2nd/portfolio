import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; t0: number };

/**
 * DotField — subtle red interactive field.
 * Dots breathe and swell red near the pointer; clicking anywhere emits a
 * radial wave that shoves and brightens the dots as it passes, plus a fading
 * ring. No whitish dots.
 */
export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0;
    const GAP = window.innerWidth < 768 ? 28 : 34;
    const m = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const ripples: Ripple[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: PointerEvent) => { m.tx = e.clientX; m.ty = e.clientY; };
    const leave = () => { m.tx = -9999; m.ty = -9999; };
    const down = (e: PointerEvent) => {
      if (reduce) return;
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
      if (ripples.length > 8) ripples.shift();
    };

    const RIPPLE_MS = 1300;
    const RIPPLE_SPEED = 0.55; // px per ms

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      m.x += (m.tx - m.x) * 0.12; m.y += (m.ty - m.y) * 0.12;

      // prune dead ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (t - ripples[i].t0 > RIPPLE_MS) ripples.splice(i, 1);
      }

      ctx.clearRect(0, 0, w, h);

      // expanding rings
      for (const rp of ripples) {
        const age = (t - rp.t0) / RIPPLE_MS;
        const r = age * RIPPLE_SPEED * RIPPLE_MS;
        const a = (1 - age) * 0.35;
        ctx.strokeStyle = `rgba(255, 80, 90, ${a})`;
        ctx.lineWidth = 1.5 * (1 - age) + 0.3;
        ctx.beginPath(); ctx.arc(rp.x, rp.y, r, 0, Math.PI * 2); ctx.stroke();
      }

      const R = 170;
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          let ox = 0, oy = 0, boost = 0;

          // pointer proximity
          const pdx = x - m.x, pdy = y - m.y;
          const pd = Math.sqrt(pdx * pdx + pdy * pdy);
          const f = Math.max(0, 1 - pd / R);
          if (f > 0) {
            ox -= (pdx / (pd || 1)) * f * 12;
            oy -= (pdy / (pd || 1)) * f * 12;
          }

          // wave pushes
          for (const rp of ripples) {
            const age = (t - rp.t0) / RIPPLE_MS;
            const wavefront = age * RIPPLE_SPEED * RIPPLE_MS;
            const rdx = x - rp.x, rdy = y - rp.y;
            const rd = Math.sqrt(rdx * rdx + rdy * rdy);
            const band = Math.exp(-((rd - wavefront) ** 2) / (2 * 46 * 46));
            const amp = band * (1 - age) * 15;
            if (amp > 0.05) {
              ox += (rdx / (rd || 1)) * amp;
              oy += (rdy / (rd || 1)) * amp;
              boost = Math.max(boost, band * (1 - age));
            }
          }

          const breathe = reduce ? 0.5 : Math.sin(x * 0.012 + y * 0.01 + t * 0.0009) * 0.5 + 0.5;
          const px = x + ox, py = y + oy;
          const r = 0.9 + breathe * 0.4 + f * 2.2 + boost * 2;
          if (f > 0.02 || boost > 0.02) {
            ctx.fillStyle = `rgba(255, ${Math.round(72 - f * 30)}, ${Math.round(82 - f * 34)}, ${(0.3 + f * 0.5 + boost * 0.55).toFixed(2)})`;
          } else {
            ctx.fillStyle = `rgba(215, 70, 80, ${(0.09 + breathe * 0.06).toFixed(2)})`;
          }
          ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
        }
      }
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0" aria-hidden />;
}
