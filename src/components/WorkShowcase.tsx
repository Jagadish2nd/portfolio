import { useEffect, useState } from "react";
import { PROJECTS, type Project } from "@/data/projects";
import { ProjectCaseStudy } from "./ProjectCaseStudy";

/** Compact project index; full detail remains available in the case-study overlay. */
export function WorkShowcase({ active: _active }: { active: boolean }) {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!openProject) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openProject]);

  const featured = PROJECTS.find((project) => project.tier === "featured");
  const rest = PROJECTS.filter((project) => project !== featured);

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-5 py-16 sm:px-8 md:px-16 md:py-20">
        <div className="mb-5 flex items-end justify-between md:mb-7">
          <div>
            <div className="mb-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              <span className="text-primary">03</span><span className="h-px w-10 bg-primary/50" /><span>selected work</span>
            </div>
            <h2 className="font-display text-3xl font-bold uppercase leading-none sm:text-4xl md:text-5xl">Selected <span className="text-primary">work.</span></h2>
          </div>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground sm:block">Select a project for the case study</span>
        </div>

        {featured && (
          <button onClick={() => setOpenProject(featured)} data-cursor-label="case study" className="group grid w-full overflow-hidden border border-border bg-card/30 text-left md:grid-cols-[0.72fr_1.28fr]">
            <div className="relative hidden overflow-hidden md:block">
              <img src={featured.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
            </div>
            <div className="p-4 md:p-5">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                <span className="text-primary">{featured.num} — featured</span><span>{featured.label}</span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase md:text-3xl">{featured.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">{featured.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-2">{featured.tags.slice(0, 3).map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">Case study →</span>
              </div>
            </div>
          </button>
        )}

        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
          {rest.map((project) => (
            <button key={project.id} onClick={() => setOpenProject(project)} data-cursor-label="explore" className="group flex min-h-24 flex-col justify-between border border-border bg-card/20 p-3 text-left transition-colors hover:border-primary/60 hover:bg-card/60 md:min-h-32">
              <div className="flex w-full items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground"><span className="text-primary">{project.num}</span><span className="truncate pl-2">{project.label.split(" /")[0]}</span></div>
              <div>
                <h3 className="font-display text-base font-semibold uppercase md:text-lg">{project.title}</h3>
                <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">{project.subtitle}</p>
              </div>
              <span className="mt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-primary">Explore →</span>
            </button>
          ))}
        </div>
      </div>
      {openProject && <ProjectCaseStudy project={openProject} onClose={() => setOpenProject(null)} />}
    </>
  );
}