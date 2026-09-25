import { useEffect, useRef, useState, type ReactNode } from "react";

/** Magnetic — pulls its child toward the pointer while hovered (fine pointers only). */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    const node = inner.current;
    if (!el || !node) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      node.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`;
    };
    const onLeave = () => {
      node.style.transform = "translate(0, 0)";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, strength]);

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={`magnetic ${className}`}>
      <div ref={inner} className="magnetic-inner inline-flex will-change-transform">
        {children}
      </div>
    </div>
  );
}
