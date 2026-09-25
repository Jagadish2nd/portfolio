import { useEffect } from "react";
import type { Project } from "@/data/projects";

/** Full-screen case study overlay with detailed project information. */
export function ProjectCaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="case-study-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${project.title} case study`}>
      <div className="case-study-panel" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="case-study-close" aria-label="Close case study">✕</button>

        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="text-primary">{project.num}</span>
          <span className="rounded-sm border border-primary/40 bg-primary/5 px-2 py-1 text-primary">{project.label}</span>
        </div>

        <h3 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight md:text-5xl">{project.title}</h3>
        {project.fullName && (
          <p className="mt-1 font-mono text-xs text-muted-foreground md:text-sm">{project.fullName}</p>
        )}
        {project.subtitle && (
          <p className="mt-2 text-sm text-muted-foreground md:text-base">{project.subtitle}</p>
        )}

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/80 md:text-base">{project.description}</p>

        {project.img && (
          <div className="mt-6 overflow-hidden border border-border bg-card">
            <img
              src={project.img}
              alt={project.title}
              width={1280}
              height={800}
              className="aspect-[16/10] w-full object-cover opacity-85"
            />
          </div>
        )}

        {project.status && (
          <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="text-primary">●</span> {project.status}
          </div>
        )}

        {project.authors && (
          <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Built with <span className="text-foreground">{project.authors}</span>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {project.sections.map((sec) => (
            <div key={sec.heading}>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-primary">// {sec.heading}</div>
              {sec.body && <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{sec.body}</p>}
              {sec.items && (
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {sec.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
          {project.stack.map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button onClick={onClose} className="btn-solid">Close ✕</button>
        </div>
      </div>
    </div>
  );
}
