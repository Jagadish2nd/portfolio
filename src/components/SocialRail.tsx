import { Github, Linkedin, Twitter, Instagram, Mail } from "lucide-react";
import { Magnetic } from "./Magnetic";

const LINKS = [
  { icon: Github, label: "github", href: "#" },
  { icon: Linkedin, label: "linkedin", href: "#" },
  { icon: Twitter, label: "twitter", href: "#" },
  { icon: Instagram, label: "instagram", href: "#" },
  { icon: Mail, label: "mail", href: "mailto:hello@example.dev" },
];

/** Fixed vertical social rail — circular outlined icon buttons (left edge, desktop). */
export function SocialRail() {
  return (
    <div
      className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      aria-label="Social links"
    >
      {LINKS.map((l) => (
        <Magnetic key={l.label} strength={0.22}>
          <a
            href={l.href}
            aria-label={l.label}
            data-cursor-label={l.label}
            className="social-dot"
          >
            <l.icon size={15} strokeWidth={1.75} />
          </a>
        </Magnetic>
      ))}
      <span className="mx-auto mt-1 h-10 w-px bg-border/70" />
    </div>
  );
}
