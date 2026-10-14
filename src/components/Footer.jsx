import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

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

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/CodeRantMY",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/code-rant/posts/?feedView=all",
    icon: Linkedin,
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-border bg-card/50 sm:mt-24">
      {/* Decorative top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Dot grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-t-3xl bg-dot-grid opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-12 md:gap-6 lg:gap-10">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center"
              aria-label="CodeRant Home"
            >
              <img
                src="/Logo/coderantlogo.png"
                alt="CodeRant"
                className="h-12 w-auto max-w-[210px] object-contain sm:h-14 sm:max-w-[240px]"
              />
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:mt-4">
              An invite-only community of Bangladeshi IT professionals and
              eligible senior IT students living in Malaysia and beyond.
              Connecting tech talent since 2017.
            </p>

            {/* Social Links: Facebook, Instagram, LinkedIn */}
            <div className="mt-4 flex items-center gap-2.5 sm:mt-5 sm:gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary sm:h-10 sm:w-10"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-8 md:col-span-7 md:grid-cols-3 md:gap-x-4 lg:gap-x-8">
            {FOOTER_NAV.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  {col.title}
                </h3>

                <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <span>{link.label}</span>

                        <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6 lg:mt-14">
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} CodeRant. All rights reserved.
          </p>

          <p className="text-center text-xs font-mono text-muted-foreground/60 sm:text-right">
            Made with precision by{" "}
            <a
              href="https://www.abdullahalnahid.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              <span className="text-gradient-brand">ARBATRON</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
