/** Marquee — infinite skill rows, alternating directions, outlined + solid type. */
export function Marquee({ rows }: { rows: string[][] }) {
  return (
    <div className="space-y-2 md:space-y-4">
      {rows.map((items, r) => (
        <div key={r} className="marquee-mask overflow-hidden py-2 md:py-3">
          <div className={`marquee flex w-max items-center ${r % 2 ? "marquee-reverse" : ""}`}>
            {[...items, ...items].map((s, i) => (
              <span key={i} className="flex items-center whitespace-nowrap">
                <span
                  className={`font-display text-3xl font-bold uppercase tracking-tighter transition-colors duration-300 hover:text-primary sm:text-5xl md:text-6xl ${
                    i % 2 ? "text-outline" : "text-foreground/85"
                  }`}
                >
                  {s}
                </span>
                <span className="mx-8 text-lg text-primary/70 md:mx-12" aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
