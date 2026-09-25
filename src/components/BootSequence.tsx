import { useEffect, useState } from "react";

const LINES = [
  "> Rishik RVR",
  "> CS / 03 — Lendi Institute",
  "> Vizianagaram / India",
  "> Available for work",
  "> Let's build.",
];

export function BootSequence() {
  const [shown, setShown] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setShown((s) => [...s, LINES[i]]);
      i++;
      if (i >= LINES.length) {
        clearInterval(id);
        setTimeout(() => setDone(true), 600);
      }
    }, 280);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="font-mono text-xs leading-relaxed text-muted-foreground">
      {shown.map((line, idx) => (
        <div
          key={idx}
          className={
            idx === shown.length - 1 && !done
              ? "blinking-cursor text-foreground"
              : "text-muted-foreground"
          }
        >
          {line}
        </div>
      ))}
    </div>
  );
}
