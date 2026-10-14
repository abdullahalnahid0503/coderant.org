import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

import CommitteeCard from "@/components/cards/CommitteeCard";
import EmptyState from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import committeeData from "@/data/committeeMembers.json";

const CATEGORIES = [
  "Executive Committee",
  "Core Committee",
  "Department Heads",
  "Committee Member",
];

export default function Committee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    try {
      const result = committeeData
        .filter(
          (member) => member.published === true && member.status === "current",
        )
        .sort(
          (a, b) => Number(a.display_order || 0) - Number(b.display_order || 0),
        );

      setMembers(result);
    } catch (error) {
      console.error("Failed to load committee members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const availableCategories = CATEGORIES.filter((category) =>
    members.some((member) => member.category === category),
  );

  const filteredMembers =
    activeCategory === "all"
      ? members
      : members.filter((member) => member.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <span className="inline-flex rounded-full border border-border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground">
            Our Committee
          </span>

          <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The People Behind{" "}
            <span className="text-gradient-brand">CodeRant</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Meet the people helping our community connect, collaborate, and
            grow.
          </p>

          {!loading && (
            <p className="mt-6 text-sm text-muted-foreground">
              {members.length} committee{" "}
              {members.length === 1 ? "member" : "members"}
            </p>
          )}
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-center sm:grid-cols-3 sm:px-6">
          <div>
            <p className="font-heading text-2xl font-bold text-gradient-brand sm:text-3xl">
              Dedicated
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Volunteer leadership
            </p>
          </div>

          <div className="sm:border-x sm:border-border">
            <p className="font-heading text-2xl font-bold text-gradient-brand sm:text-3xl">
              Diverse
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Roles and expertise
            </p>
          </div>

          <div>
            <p className="font-heading text-2xl font-bold text-gradient-brand sm:text-3xl">
              Community
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Driven by members
            </p>
          </div>
        </div>
      </section>

      {/* Committee directory */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {/* Category filters */}
          {!loading && availableCategories.length > 0 && (
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                All Members
              </button>

              {availableCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="aspect-[4/3] animate-pulse bg-muted" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMembers.length > 0 ? (
            /* Equal-sized responsive card grid — no pyramid */
            <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMembers.map((member) => (
                <CommitteeCard
                  key={member.id}
                  member={member}
                  className="w-full"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title={
                members.length === 0
                  ? "Committee profiles coming soon"
                  : "No members in this category"
              }
              description={
                members.length === 0
                  ? "Committee member profiles will appear here once published."
                  : "Choose another category to view committee members."
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
