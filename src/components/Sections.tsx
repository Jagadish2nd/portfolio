import type { ReactNode } from "react";

export function SectionHead({ code, label, title }: { code: string; label: string; title: ReactNode }) {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="text-primary">{code}</span>
        <span className="h-px w-8 bg-border" />
        <span>{label}</span>
      </div>
      <h2 className="mt-4 font-mono text-3xl font-light leading-tight md:text-5xl">{title}</h2>
    </div>
  );
}

export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="relative z-10 mx-auto max-w-6xl scroll-mt-20 px-6 py-28 md:px-16">
      {children}
    </section>
  );
}

export function Cell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`group relative bg-background/70 p-7 backdrop-blur-md transition-colors hover:bg-background ${className}`}>
      {children}
    </div>
  );
}

export function Hl({ children }: { children: ReactNode }) {
  return <span className="text-primary text-glow-red">{children}</span>;
}
