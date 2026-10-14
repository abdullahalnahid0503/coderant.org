import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Committee", path: "/committee" },
  { label: "Jobs", path: "/jobs" },
  { label: "Community", path: "/community" },
  { label: "RantGPT", path: "/rantgpt" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
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
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
        <nav
          className={cn(
            "w-full max-w-6xl flex items-center justify-between gap-4 rounded-2xl border px-4 sm:px-5 py-2.5 transition-all duration-300",
            scrolled
              ? "bg-card/80 backdrop-blur-xl border-border shadow-lg shadow-black/5"
              : "bg-card/40 backdrop-blur-md border-border/60",
          )}
        >
          <Link to="/" className="shrink-0" aria-label="CodeRant home">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9 grid place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <Link
              to="/join"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Join CodeRant
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="lg:hidden h-9 w-9 grid place-items-center rounded-lg border border-border text-foreground"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-20 inset-x-4 rounded-2xl border border-border bg-card p-4 shadow-xl animate-fade-up">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive(link.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/join"
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
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
