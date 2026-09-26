export type Milestone = { period: string; title: string; body: string };

/** Journey timeline — vertical rail with glowing nodes, red on hover. */
export function Timeline({ items }: { items: Milestone[] }) {
  return (
    <ol className="relative ml-2 border-l border-border/70">
      {items.map((m, i) => (
        <li key={m.title} className="timeline-item group relative pb-5 pl-7 last:pb-0 md:pl-9" data-last={i === items.length - 1}>
          <span
            className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full transition-all duration-500 ${
              i === 0
                ? "bg-primary shadow-[0_0_18px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                : "bg-border group-hover:bg-primary group-hover:shadow-[0_0_14px_color-mix(in_oklab,var(--primary)_50%,transparent)]"
            }`}
          />
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {m.period}
          </div>
          <div className="mt-1 font-display text-base font-semibold transition-colors duration-300 group-hover:text-primary md:text-lg">
            {m.title}
          </div>
          <div className="max-w-xl text-xs leading-relaxed text-muted-foreground">{m.body}</div>
        </li>
      ))}
    </ol>
  );
}
