import { Cpu, Smartphone, Wrench, Monitor, Server, CircuitBoard, Watch } from "lucide-react";

const OS_MATRIX = [
  { label: "Desktop", icon: Monitor, items: ["Windows", "macOS", "Deepin Linux"] },
  { label: "Server", icon: Server, items: ["Ubuntu"] },
  { label: "Embedded", icon: CircuitBoard, items: ["Raspberry Pi OS", "Kali Linux"] },
  { label: "Mobile", icon: Smartphone, items: ["Android", "iOS", "iPadOS", "watchOS"] },
];

const OTHER_AREAS = [
  "Server setup", "Linux systems", "Hardware configuration", "Audio systems",
  "OS installation & configuration", "Android / iOS / iPadOS experimentation", "Linux tools",
];

/** Beyond Software — hardware, OS, and device experimentation. */
export function BeyondSoftware() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <div>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Beyond software, I like understanding how hardware and operating systems work. I build PCs, flash custom kernels, modify devices, and experiment with anything that runs code underneath its interface.
        </p>

        <div className="mt-8 space-y-4">
          {/* PC Building */}
          <div className="beyond-card group">
            <div className="flex items-center gap-3">
              <Cpu size={18} className="text-primary" strokeWidth={1.75} />
              <h3 className="font-display text-lg font-semibold md:text-xl">PC Building</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Built his own PC.</p>
          </div>

          {/* Custom Kernels */}
          <div className="beyond-card group">
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-primary" strokeWidth={1.75} />
              <h3 className="font-display text-lg font-semibold md:text-xl">Custom Kernels</h3>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Personal custom overclocked kernels for</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Samsung Galaxy S9+</li>
              <li>Samsung Galaxy Note 10 Lite</li>
              <li>Motorola Razr 40 Ultra</li>
            </ul>
          </div>

          {/* Device Modification */}
          <div className="beyond-card group">
            <div className="flex items-center gap-3">
              <Wrench size={18} className="text-primary" strokeWidth={1.75} />
              <h3 className="font-display text-lg font-semibold md:text-xl">Device Modification</h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[["15+", "Android devices"], ["5", "iOS / iPadOS"], ["10", "Laptops"], ["2", "PCs"]].map(([n, l]) => (
                <div key={l} className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-primary">{n}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">// also explores</div>
          <div className="flex flex-wrap gap-2">
            {OTHER_AREAS.map((a) => <span key={a} className="chip">{a}</span>)}
          </div>
        </div>

        <div className="mt-4 border-l border-primary/40 pl-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Personal technical experimentation — not professional repair.
          </p>
        </div>
      </div>

      {/* OS Matrix */}
      <div>
        <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.35em] text-primary">// operating systems</div>
        <div className="os-matrix">
          {OS_MATRIX.map(({ label, icon: Icon, items }) => (
            <div key={label} className="os-row group">
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-muted-foreground transition-colors group-hover:text-primary" strokeWidth={1.75} />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((os) => (
                  <span key={os} className="os-chip group-hover:border-primary/50 group-hover:text-foreground">{os}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[["Desktop", "3"], ["Server", "1"], ["Embedded", "2"], ["Mobile", "4"]].map(([cat, count]) => (
            <div key={cat} className="border border-border bg-card/30 p-4 text-center">
              <div className="font-display text-2xl font-bold text-primary">{count}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{cat}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
