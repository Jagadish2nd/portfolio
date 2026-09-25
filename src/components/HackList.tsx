import { useRef, useState } from "react";

type Hack = {
  num: string;
  date: string;
  name: string;
  venue: string;
  project: string;
  result: string;
  tags: string[];
  detail?: string;
};

const HACKS: Hack[] = [
  {
    num: "01",
    date: "2025.03",
    name: "Techniverse 2K25",
    venue: "RGUKT IIIT Srikakulam",
    project: "Command-Line Food Delivery Management System in C",
    result: "Finalists",
    tags: ["C", "DSA", "12hr hackathon"],
    detail: "Data Structures screening round — 8 programming problems, all solved. Final project built in C with user registration, admin panel, menu management, and order processing. Code Bidding: team represented NVIDIA, placed 4th.",
  },
  {
    num: "02",
    date: "2025",
    name: "Smart India Hackathon 2025",
    venue: "Problem Statement 25022 · Transportation & Logistics",
    project: "SAARTHI — AI-Assisted Railway Traffic Control",
    result: "College-Level Finalist",
    tags: ["AI", "multi-agent RL", "digital twin"],
    detail: "Team Code Galaxy. Proposed framework using decentralized multi-agent learning and a railway digital twin for real-time traffic optimization.",
  },
  {
    num: "03",
    date: "2026",
    name: "LNIT 2026",
    venue: "Lendi Institute of Engineering & Technology",
    project: "Final 10 Teams",
    result: "Final 10",
    tags: ["hackathon"],
  },
  {
    num: "04",
    date: "2025",
    name: "Adobe Hackathon",
    venue: "Unstop Platform",
    project: "Selected for Final Round",
    result: "Final Round",
    tags: ["adobe", "design"],
  },
  {
    num: "05",
    date: "2025",
    name: "AU Hackathon",
    venue: "Selection: DSA + Problem-Solving + Descriptive",
    project: "Final Round",
    result: "Final Round",
    tags: ["DSA", "problem-solving"],
  },
];

/** Editorial hackathon list — no images, clean metadata, expandable detail. */
export function HackList() {
  const [open, setOpen] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="border-t border-border">
      {HACKS.map((h, i) => (
        <div key={h.name}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            data-active={open === i}
            className="hack-row group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-2 py-5 text-left md:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_6rem] md:gap-6 md:py-6"
          >
            <span className="font-mono text-xs text-muted-foreground">{h.num}</span>
            <div className="min-w-0">
              <div className="truncate font-display text-lg transition-colors group-hover:text-foreground md:text-2xl">{h.name}</div>
              <div className="truncate text-xs text-muted-foreground md:hidden">{h.venue}</div>
            </div>
            <div className="hidden min-w-0 md:block">
              <div className="truncate text-sm text-muted-foreground">{h.project}</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {h.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
            <span className="text-right text-[10px] uppercase tracking-[0.25em] text-primary md:text-left">
              {h.result}
              <span className="block text-muted-foreground md:hidden">{h.date}</span>
            </span>
          </button>
          {open === i && h.detail && (
            <div className="border-b border-border bg-card/30 px-2 pb-5 pt-1 md:px-6">
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{h.detail}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
