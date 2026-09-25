import { useEffect, useState } from "react";
import { PROJECTS, type Project } from "@/data/projects";
import { ProjectCaseStudy } from "./ProjectCaseStudy";

/**
 * WorkShowcase — editorial project layout.
 * Featured project (large), secondary projects (medium grid), experiments (compact list).
 * Click any project to open a case study overlay.
 */
export function WorkShowcase({ active: _active }: { active: boolean }) {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!openProject) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenProject(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openProject]);

  const featured = PROJECTS.filter((p) => p.tier === "featured");
  const secondary = PROJECTS.filter((p) => p.tier === "secondary");
  const experiments = PROJECTS.filter((p) => p.tier === "experiment");

  return (
    <>
      <div className="panel-scroll h-full w-full overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:px-16 md:py-24">
          {/* Header */}
          <div className="mb-10 flex items-end justify-between">
            <div className="reveal is-active">
              <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground md:mb-10">
                <span className="text-primary">03</span><span className="h-px w-10 bg-primary/50" /><span>selected work</span>
              </div>
              <h3 className="font-display text-4xl font-bold uppercase italic leading-[0.9] tracking-tighter md:text-6xl">
                Selected<br />work<span className="text-primary">.</span>
              </h3>
            </div>
          </div>

          {/* Featured project */}
          {featured.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpenProject(p)}
              data-cursor-label="explore"
              className="project-featured group mb-10 block w-full text-left md:mb-14"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="text-primary">{p.num} — featured</span>
                <span className="rounded-sm border border-primary/40 bg-primary/5 px-2 py-1 text-primary">{p.label}</span>
              </div>
              <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-10">
                <div className="overflow-hidden border border-border bg-card">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={1280}
                    height={800}
                    className="aspect-[16/10] w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100 md:grayscale-[20%] md:group-hover:grayscale-0"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <h4 className="font-display text-3xl font-bold uppercase tracking-tight md:text-5xl">{p.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground md:text-base">{p.subtitle}</p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                  <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                    <span className="border-b border-primary pb-0.5 transition-all group-hover:gap-2">Case Study</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* Secondary projects */}
          <div className="mb-10 grid gap-6 md:grid-cols-3 md:gap-6">
            {secondary.map((p) => (
              <button
                key={p.id}
                onClick={() => setOpenProject(p)}
                data-cursor-label="explore"
                className="project-secondary group text-left"
              >
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  <span className="text-primary">{p.num}</span>
                  <span className="rounded-sm border border-border px-2 py-0.5">{p.label}</span>
                </div>
                <div className="mt-3 overflow-hidden border border-border bg-card">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={1280}
                    height={800}
                    className="aspect-[16/10] w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100 md:grayscale-[30%] md:group-hover:grayscale-0"
                  />
                </div>
                <h4 className="mt-3 font-display text-xl font-bold uppercase tracking-tight md:text-2xl">{p.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{p.subtitle}</p>
                <div className="mt-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-primary">
                  <span className="border-b border-primary pb-0.5">Explore</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </button>
            ))}
          </div>

          {/* Experiments */}
          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">// experiments & concepts</div>
            <div className="border-t border-border">
              {experiments.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setOpenProject(p)}
                  data-cursor-label="explore"
                  className="project-experiment group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-2 py-5 text-left md:grid-cols-[3rem_minmax(0,1fr)_auto_2rem] md:gap-6"
                >
                  <span className="font-mono text-xs text-muted-foreground">{p.num}</span>
                  <div className="min-w-0">
                    <div className="truncate font-display text-lg transition-colors group-hover:text-foreground md:text-xl">{p.title}</div>
                    <div className="truncate text-xs text-muted-foreground md:text-sm">{p.subtitle}</div>
                  </div>
                  <span className="text-right text-[9px] uppercase tracking-[0.25em] text-muted-foreground md:text-left">{p.label}</span>
                  <span className="hidden text-right text-lg text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary md:block">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {openProject && <ProjectCaseStudy project={openProject} onClose={() => setOpenProject(null)} />}
    </>
  );
}
