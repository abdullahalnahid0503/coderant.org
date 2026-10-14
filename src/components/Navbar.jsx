import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, ArrowRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Committee", path: "/committee" },
  { label: "Jobs", path: "/jobs" },
  { label: "Community", path: "/community" },
  { label: "RantGPT", path: "/rantgpt", special: true },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
        <nav
          aria-label="Main navigation"
          className={cn(
            "flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-5",
            scrolled
              ? "border-border bg-card/80 shadow-lg shadow-black/5 backdrop-blur-xl"
              : "border-border/60 bg-card/40 backdrop-blur-md",
          )}
        >
          {/* CodeRant Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="CodeRant Home"
          >
            <img
              src="/Logo/coderantlogo.png"
              alt="CodeRant"
              className="h-10 w-auto max-w-[180px] object-contain sm:h-11"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    link.special
                      ? active
                        ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        : "text-violet-600 hover:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/10"
                      : active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}

                  {active && (
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full",
                        link.special ? "bg-violet-500" : "bg-primary",
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Join CodeRant */}
            <Link
              to="/join"
              className="hidden items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
            >
              Join CodeRant
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted/50 lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div id="mobile-navigation" className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 animate-fade-in bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div className="absolute inset-x-4 top-20 animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-xl">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      link.special
                        ? active
                          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                          : "text-violet-600 hover:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/10"
                        : active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile Join Button */}
              <Link
                to="/join"
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Join CodeRant
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
