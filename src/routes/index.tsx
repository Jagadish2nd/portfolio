import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BootSequence } from "@/components/BootSequence";
import { CustomCursor } from "@/components/CustomCursor";
import { HackList } from "@/components/HackList";
import { Loader } from "@/components/Loader";
import { Magnetic } from "@/components/Magnetic";
import { Marquee } from "@/components/Marquee";
import { DotField } from "@/components/DotField";
import { SocialRail } from "@/components/SocialRail";
import { Timeline } from "@/components/Timeline";
import { WorkShowcase } from "@/components/WorkShowcase";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "System Schema — CS Engineer Portfolio" },
      { name: "description", content: "Full-screen interactive portfolio of a computer-science engineer: systems, algorithms, ML, networks and security." },
      { property: "og:title", content: "System Schema — CS Engineer Portfolio" },
      { property: "og:description", content: "An interactive, full-screen map of projects, hackathons and skills." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const SECTIONS = [
  ["hero", "Index"], ["about", "About"], ["work", "Work"],
  ["hackathons", "Hacks"], ["stack", "Stack"], ["contact", "Contact"],
] as const;

const SKILLS: Record<string, string[]> = {
  languages: ["Rust", "Go", "Python", "TypeScript", "C/C++"],
  systems: ["Linux", "Docker", "Kubernetes", "PostgreSQL", "Redis"],
  ml: ["PyTorch", "JAX", "ONNX", "scikit-learn"],
  web: ["React", "Node", "GraphQL", "Three.js"],
};
const JOURNEY = [
  { year: "2026 — now", title: "Research Intern — Systems Lab", body: "Working on distributed scheduling and consensus under partitions." },
  { year: "2025", title: "SWE Intern — Infra team", body: "Built internal observability tooling used across three teams." },
  { year: "2024", title: "Open-source contributor", body: "Patches to networking and ML libraries." },
  { year: "2023", title: "Started B.Tech, Computer Science", body: "Where the schema began." },
];

function Hl({ children }: { children: ReactNode }) {
  return <span className="text-gradient-red">{children}</span>;
}

function Panel({
  id, code, label, title, active, bare = false, children,
}: {
  id: string; code?: string; label?: string; title?: ReactNode;
  active: boolean; bare?: boolean; children: ReactNode;
}) {
  return (
    <section id={id} data-panel className="snap-panel">
      <div className={bare ? "panel-scroll h-full w-full" : "panel-scroll mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:px-16 md:py-24"}>
        <div className={`reveal ${active ? "is-active" : ""}`}>
          {code && (
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground md:mb-10">
              <span className="text-primary">{code}</span><span className="h-px w-10 bg-primary/50" /><span>{label}</span>
            </div>
          )}
          {title && <h2 className="mb-8 font-display text-3xl font-bold leading-[1.02] tracking-tight sm:text-4xl md:mb-12 md:text-6xl">{title}</h2>}
          {children}
        </div>
      </div>
    </section>
  );
}

function Index() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [bg, setBg] = useState(false);

  useEffect(() => { const t = setTimeout(() => setBg(true), 50); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const panels = Array.from(shell.querySelectorAll<HTMLElement>("[data-panel]"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(panels.indexOf(e.target as HTMLElement)); });
    }, { root: shell, threshold: 0.55 });
    panels.forEach((p) => io.observe(p));
    const onScroll = () => {
      const n = shell.scrollTop / Math.max(1, shell.scrollHeight - shell.clientHeight);
      window.dispatchEvent(new CustomEvent("schema:scroll", { detail: n }));
    };
    shell.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(e.key)) return;
      e.preventDefault();
      const cur = Math.round(shell.scrollTop / shell.clientHeight);
      const next = Math.max(0, Math.min(panels.length - 1, cur + (e.key === "ArrowDown" || e.key === "PageDown" ? 1 : -1)));
      panels[next].scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => { io.disconnect(); shell.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);

  const go = (i: number) => shellRef.current?.querySelectorAll<HTMLElement>("[data-panel]")[i]?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative bg-background text-foreground">
      <Loader />
      <CustomCursor />
      <SocialRail />

      {/* Interactive background — subtle red dot field with click ripples */}
      <div className="fixed inset-0 z-0">
        <div className="aurora absolute inset-0 opacity-80" />
        {bg && <DotField />}
        <div className="absolute inset-0 bg-background/45 md:bg-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_100%)]" />
      </div>

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8 md:px-10">
        <button onClick={() => go(0)} className="flex min-w-0 items-center gap-3">
          <span className="relative h-2.5 w-2.5 shrink-0"><span className="absolute inset-0 rounded-full bg-primary heartbeat" /><span className="absolute inset-0 rounded-full bg-primary blur-sm heartbeat" /></span>
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">schema.online</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-muted-foreground">
            <span className="text-primary">{String(active + 1).padStart(2, "0")}</span> / {String(SECTIONS.length).padStart(2, "0")}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-foreground sm:inline">{SECTIONS[active][1]}</span>
        </div>
      </header>

      {/* Side rail */}
      <nav className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 sm:flex md:right-8" aria-label="Sections">
        {SECTIONS.map(([id, l], i) => (
          <button key={id} onClick={() => go(i)} aria-label={l} data-cursor-label={l} className="group flex items-center justify-end gap-3 py-0.5">
            <span className={`hidden font-mono text-[9px] uppercase tracking-[0.3em] transition-all md:inline ${active === i ? "text-foreground opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`}>{l}</span>
            <span className={`block h-px transition-all duration-500 ${active === i ? "w-8 bg-primary shadow-[var(--glow-red)]" : "w-3 bg-muted-foreground/50 group-hover:w-5"}`} />
          </button>
        ))}
      </nav>

      {/* Progress bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 h-px bg-border/40">
        <div className="h-px bg-primary transition-[width] duration-700" style={{ width: `${((active + 1) / SECTIONS.length) * 100}%` }} />
      </div>

      <div ref={shellRef} className="snap-shell relative z-10">
        {/* ---------- HERO ---------- */}
        <Panel id="hero" active={active === 0}>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary heartbeat" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">system active · available for work</span>
              </div>
              <h1 className="font-display text-[clamp(2.6rem,7vw,6.2rem)] font-bold uppercase leading-[0.93] tracking-[-0.03em]">
                A system of<br /><Hl>moving parts</Hl><span className="text-primary">.</span>
              </h1>
              <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Computer-science engineer building software at the seams — where systems, algorithms and security meet.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <Magnetic>
                  <button onClick={() => go(2)} data-cursor-label="go" className="btn-solid">View projects <span aria-hidden>→</span></button>
                </Magnetic>
                <button onClick={() => go(5)} className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground underline-offset-8 transition-colors hover:text-foreground hover:underline">Open a channel →</button>
              </div>
              <div className="mt-10 hidden max-w-sm border-l border-primary/40 pl-4 sm:block"><BootSequence /></div>
            </div>

            {/* Portrait slot */}
            <div className="lg:col-span-5">
              <div className="photo-frame group relative mx-auto w-full max-w-[300px] md:max-w-[360px]">
                <div className="relative aspect-[4/5] overflow-hidden border border-border bg-card/40">
                  <div className="grid-bg absolute inset-0 opacity-25" aria-hidden />
                  <div className="scan-beam absolute inset-x-0" aria-hidden />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mx-auto h-10 w-10 text-muted-foreground/60">
                        <circle cx="12" cy="8.5" r="3.5" />
                        <path d="M5 19.5c1.6-3.2 4-4.8 7-4.8s5.4 1.6 7 4.8" />
                      </svg>
                      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">portrait_slot / 4:5</div>
                      <div className="mt-1 font-mono text-[9px] tracking-[0.15em] text-muted-foreground/60">0x001 — your photo lands here</div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-background/30" />
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-tighter text-foreground/50">0x001 / PORTRAIT_FILE</div>
                  <div className="absolute right-4 top-4 flex gap-1.5" aria-hidden>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* ---------- ABOUT / TIMELINE ---------- */}
        <Panel id="about" code="02" label="about" title={<>Hello, I build <Hl>systems</Hl>.</>} active={active === 1}>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                I'm obsessed with how things work underneath — from memory layouts to distributed consensus. I like problems between disciplines, and software that's fast, correct and quietly elegant.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono">
                {[["12+", "projects"], ["6", "hackathons"], ["2", "papers"]].map(([n, l]) => (
                  <div key={l} className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-primary">{n}</span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.35em] text-primary">// the journey</div>
              <Timeline items={JOURNEY.map((j) => ({ period: j.year, title: j.title, body: j.body }))} />
            </div>
          </div>
        </Panel>

        {/* ---------- WORK / HORIZONTAL ---------- */}
        <Panel id="work" active={active === 2} bare>
          <WorkShowcase active={active === 2} />
        </Panel>

        {/* ---------- HACKATHONS ---------- */}
        <Panel id="hackathons" code="04" label="hackathons" title={<>48 hours, <Hl>zero sleep</Hl>.</>} active={active === 3}>
          <HackList />
        </Panel>

        {/* ---------- STACK / MARQUEE ---------- */}
        <Panel id="stack" code="05" label="stack" title={<>The <Hl>toolchain</Hl>.</>} active={active === 4}>
          <Marquee rows={[SKILLS.languages, SKILLS.systems, [...SKILLS.ml, ...SKILLS.web]]} />
          <div className="mt-10 flex justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            <span>infinite loop // no buffers</span>
            <span className="hidden sm:inline">hover to pause</span>
          </div>
        </Panel>

        {/* ---------- CONTACT ---------- */}
        <Panel id="contact" code="06" label="contact" active={active === 5}>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="font-display text-[clamp(3rem,9vw,7rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em]">
                Let's<br /><Hl>build.</Hl>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Available for research collaborations, internships and architecturally interesting problems.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-10">
              <Magnetic strength={0.18}>
                <a href="mailto:hello@example.dev" data-cursor-label="mail" className="break-all border-b border-border pb-4 font-mono text-xl transition-colors duration-300 hover:border-primary hover:text-primary md:text-3xl">
                  hello@example.dev
                </a>
              </Magnetic>
              <div className="flex flex-wrap gap-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <a href="#" className="transition-colors hover:text-foreground">github ↗</a>
                <a href="#" className="transition-colors hover:text-foreground">linkedin ↗</a>
                <a href="#" className="transition-colors hover:text-foreground">cv.pdf ↗</a>
              </div>
            </div>
          </div>
          <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>© 2026 — schema.online</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary heartbeat" />system nominal</span>
          </footer>
        </Panel>
      </div>
    </div>
  );
}
