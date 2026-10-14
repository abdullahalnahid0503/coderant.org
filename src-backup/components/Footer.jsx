import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Github, Globe, Mail, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";

const FOOTER_NAV = [
  {
    title: "Community",
    links: [
      { label: "About Us", path: "/about" },
      { label: "Committee", path: "/committee" },
      { label: "Community Events", path: "/community" },
      { label: "RantGPT", path: "/rantgpt" },
    ],
  },
  {
    title: "Opportunities",
    links: [
      { label: "Tech Jobs", path: "/jobs" },
      { label: "Join CodeRant", path: "/join" },
      { label: "Contact Us", path: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Use", path: "/terms" },
      { label: "Community Guidelines", path: "/guidelines" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-card/50">
      {/* Decorative top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Dot grid texture */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none rounded-t-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground max-w-sm">
              An invite-only community of Bangladeshi IT professionals and
              eligible senior IT students living in Malaysia and beyond.
              Connecting tech talent since 2017.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-10 w-10 grid place-items-center rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-10 w-10 grid place-items-center rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <Link
                to="/contact"
                aria-label="Email"
                className="h-10 w-10 grid place-items-center rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_NAV.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA column */}
          <div className="md:col-span-1 flex md:justify-end">
            <div className="md:text-right">
              <p className="text-xs font-mono text-muted-foreground/60">
                est. 2017
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CodeRant. All rights reserved.
          </p>
          <p className="text-xs font-mono text-muted-foreground/60">
            Made with precision by the CodeRant community
          </p>
        </div>
      </div>
    </footer>
  );
}
