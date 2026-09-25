import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor — dual-layer magnetic cursor.
 * Core dot tracks instantly, outer ring eases and snaps to interactive
 * elements ([data-cursor] / a / button). Hidden on touch devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let scaleTarget = 1;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      const el = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button, input, textarea, select, [role='button']",
      ) as HTMLElement | null;

      if (el) {
        scaleTarget = 2.1;
        ring.dataset.active = "true";
        const text = el.getAttribute("data-cursor-label");
        if (label) label.textContent = text ?? "";
      } else {
        scaleTarget = 1;
        ring.dataset.active = "false";
        if (label) label.textContent = "";
      }
    };

    const onDown = () => {
      ring.dataset.press = "true";
      const wave = document.createElement("span");
      wave.className = "cursor-shockwave";
      wave.style.left = `${mx}px`;
      wave.style.top = `${my}px`;
      document.body.appendChild(wave);
      window.setTimeout(() => wave.remove(), 650);
    };
    const onUp = () => {
      ring.dataset.press = "false";
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      scale += (scaleTarget - scale) * 0.18;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
    };
    loop();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="cursor-layer" aria-hidden>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" data-active="false" data-press="false">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
