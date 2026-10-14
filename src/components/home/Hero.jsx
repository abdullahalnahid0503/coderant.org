import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Layers } from "lucide-react";
import NetworkBackground from "../NetworkBackground";

const FACTS = [
  {
    icon: Calendar,
    label: "Established",
    value: "2017",
  },
  {
    icon: Users,
    label: "Community Members",
    value: "300+",
  },
  {
    icon: Layers,
    label: "Diverse Backgrounds",
    value: "Tech · Product · Leadership",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background layers */}
      <div className="absolute inset-0 bg-dot-grid opacity-50" />

      <div className="absolute inset-0">
        <NetworkBackground className="text-primary" />
      </div>

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-3xl">
          {/* Community badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-sm px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />

            <span className="text-xs font-mono text-muted-foreground">
              Coffee to Code | Stranger to Friend
            </span>
          </div>

          {/* Main heading */}
          <h1 className="mt-6 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-foreground">
            Where Bangladeshi Tech Talent{" "}
            <span className="text-gradient-brand">Connects</span> in{" "}
            <span className="text-foreground">Malaysia </span>
            and {/* Colorful Beyond */}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Beyond
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl">
            A professional community bringing together Bangladeshi technology
            professionals, entrepreneurs, and aspiring tech leaders to connect,
            share knowledge, and grow together.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
            >
              Explore Tech Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/committee"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
            >
              Meet Our Committee
            </Link>
          </div>
        </div>

        {/* Facts bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl border border-border bg-border overflow-hidden">
          {FACTS.map((fact, i) => (
            <div key={i} className="flex items-center gap-4 bg-card p-5">
              <div className="h-11 w-11 grid place-items-center rounded-xl border border-border bg-muted/30 text-primary shrink-0">
                <fact.icon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
                  {fact.label}
                </p>

                <p className="mt-0.5 font-heading text-lg font-bold text-foreground truncate">
                  {fact.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
