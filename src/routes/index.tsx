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
import { BeyondSoftware } from "@/components/BeyondSoftware";
import portrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Rishik RVR — Computer Science Student & Builder" },
      { name: "description", content: "Third-year Computer Science student at Lendi Institute of Engineering and Technology, building software, systems and experimental projects across backend development, networking, hardware and more." },
      { property: "og:title", content: "Rishik RVR — Computer Science Student & Builder" },
      { property: "og:description", content: "Third-year Computer Science student building software, systems and experimental projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const SECTIONS = [
  ["hero", "Index"], ["about", "About"], ["work", "Work"],
  ["hackathons", "Hacks"], ["beyond", "Beyond"], ["toolkit", "Toolkit"], ["contact", "Contact"],
] as const;

const SKILL_CATEGORIES = [
  { label: "Programming", items: ["C", "C++", "Java", "Python", "JavaScript", "Go", "Unix Shell"] },
  { label: "Web / Backend", items: ["HTML", "JavaScript", "React", "FastAPI", "Vite", "Tailwind CSS"] },
  { label: "Database", items: ["SQL", "PostgreSQL"] },
  { label: "Systems", items: ["Linux", "Windows", "macOS", "Android", "iOS", "iPadOS"] },
  { label: "Tools", items: ["Git", "GitHub", "Linux tools", "Server config", "Hardware config"] },
];

const TOOLKIT_ROWS = [
  ["C", "C++", "Java", "Python", "JavaScript", "Go", "Unix Shell"],
  ["HTML", "React", "FastAPI", "Vite", "Tailwind CSS", "PostgreSQL", "SQL"],
  ["Git", "Linux", "Qiskit", "NumPy", "WebRTC"],
];

const EDUCATION = [
  { period: "2022", title: "Narayana School", body: "10th standard" },
  { period: "2024", title: "Narayana Junior College, Vizianagaram", body: "Intermediate" },
  { period: "2024 — Present", title: "Lendi Institute of Engineering and Technology", body: "B.Tech Computer Science" },
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
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">rishik rvr</span>
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
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">CS / 03 · available for work</span>
              </div>
              <h1 className="font-display text-[clamp(2.6rem,7vw,6.2rem)] font-bold uppercase leading-[0.93] tracking-[-0.03em]">
                I build<br />things that<br /><Hl>interest me</Hl><span className="text-primary">.</span>
              </h1>
              <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Third-year Computer Science student at Lendi Institute of Engineering and Technology, exploring backend systems, software, hardware, networking, and whatever interesting problem comes next.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <Magnetic>
                  <button onClick={() => go(2)} data-cursor-label="work" className="btn-solid">View My Work <span aria-hidden>→</span></button>
                </Magnetic>
                <Magnetic>
                  <a href="https://github.com/RishikRVR" target="_blank" rel="noopener noreferrer" data-cursor-label="github" className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground underline-offset-8 transition-colors hover:text-foreground hover:underline">GitHub →</a>
                </Magnetic>
              </div>
              <div className="mt-10 hidden max-w-sm border-l border-primary/40 pl-4 sm:block"><BootSequence /></div>
            </div>

            {/* Portrait */}
            <div className="lg:col-span-5">
              <div className="photo-frame group relative mx-auto w-full max-w-[300px] md:max-w-[360px]">
                <div className="relative aspect-[4/5] overflow-hidden border border-border bg-card/40">
                  <img src={portrait} alt="Rishik RVR — Computer Science Student" className="absolute inset-0 h-full w-full object-cover" loading="eager" width={360} height={450} />
                  <div className="scan-beam absolute inset-x-0" aria-hidden />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-background/30" />
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-tighter text-foreground/50">Rishik RVR / 2026</div>
                  <div className="absolute right-4 top-4 flex gap-1.5" aria-hidden>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  </div>
                </div>
                <div className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                  CS / 03 · Lendi · 2024 — Present
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* ---------- ABOUT ---------- */}
        <Panel id="about" code="02" label="about" title={<>Hello, I'm <Hl>Rishik</Hl>.</>} active={active === 1}>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                I'm a third-year Computer Science student at Lendi Institute of Engineering and Technology, Vizianagaram.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                I enjoy building things across the software stack, with a particular interest in backend development, databases, systems, networking and infrastructure.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                Outside software, I like understanding how hardware and operating systems work, experimenting with different platforms, modifying devices, and figuring out how things behave underneath the interface.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono">
                {[["06", "projects"], ["05", "hackathons"], ["03", "custom kernels"]].map(([n, l]) => (
                  <div key={l} className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-primary">{n}</span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{l}</span>
                  </div>
                ))}
              </div>

              {/* What I Work With */}
              <div className="mt-8">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-primary">// what I work with</div>
                <div className="space-y-4">
                  {SKILL_CATEGORIES.map((cat) => (
                    <div key={cat.label}>
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{cat.label}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {cat.items.map((item) => <span key={item} className="chip">{item}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.35em] text-primary">// education</div>
              <Timeline items={EDUCATION.map((j) => ({ period: j.period, title: j.title, body: j.body }))} />
            </div>
          </div>
        </Panel>

        {/* ---------- WORK ---------- */}
        <Panel id="work" active={active === 2} bare>
          <WorkShowcase active={active === 2} />
        </Panel>

        {/* ---------- HACKATHONS ---------- */}
        <Panel id="hackathons" code="04" label="hackathons" title={<>Built under <Hl>pressure</Hl>.</>} active={active === 3}>
          <HackList />
        </Panel>

        {/* ---------- BEYOND SOFTWARE ---------- */}
        <Panel id="beyond" code="05" label="beyond software" title={<>Beyond <Hl>software</Hl>.</>} active={active === 4}>
          <BeyondSoftware />
        </Panel>

        {/* ---------- TOOLKIT ---------- */}
        <Panel id="toolkit" code="06" label="toolkit" title={<>The <Hl>toolkit</Hl>.</>} active={active === 5}>
          <Marquee rows={TOOLKIT_ROWS} />
          <div className="mt-10 flex justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            <span>verified technologies // no fake percentages</span>
            <span className="hidden sm:inline">hover to pause</span>
          </div>
        </Panel>

        {/* ---------- CONTACT ---------- */}
        <Panel id="contact" code="07" label="contact" active={active === 6}>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="font-display text-[clamp(3rem,9vw,7rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em]">
                Let's<br /><Hl>talk.</Hl>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Have a project, collaboration, technical idea, or something interesting to build?
              </p>
            </div>
            <div className="flex flex-col justify-end gap-8">
              <Magnetic strength={0.18}>
                <a href="mailto:rishikrvr@gmail.com" data-cursor-label="mail" className="break-all border-b border-border pb-4 font-mono text-xl transition-colors duration-300 hover:border-primary hover:text-primary md:text-3xl">
                  rishikrvr@gmail.com
                </a>
              </Magnetic>
              <div className="flex flex-wrap gap-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <a href="https://github.com/RishikRVR" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">github ↗</a>
                <a href="https://www.linkedin.com/in/venkata-ram-rishik-rali-74233b30b/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">linkedin ↗</a>
              </div>
            </div>
          </div>
          <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>© 2026 — Rishik RVR</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary heartbeat" />available for work</span>
          </footer>
        </Panel>
      </div>
    </div>
  );
}
