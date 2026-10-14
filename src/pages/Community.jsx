import React, { useState, useEffect } from "react";
import { Calendar, Users } from "lucide-react";

import communityEvents from "@/data/communityevents.json";

import EventCard from "@/components/cards/EventCard";
import EmptyState from "@/components/EmptyState";
import { cn } from "@/lib/utils";

export default function Community() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");

  // Load community events directly from the local JSON file
  useEffect(() => {
    try {
      const eventData = Array.isArray(communityEvents) ? communityEvents : [];

      setEvents(eventData);
    } catch (error) {
      console.error("Failed to load community events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sort upcoming events by nearest date first
  const upcoming = events
    .filter((event) => event.status === "upcoming")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Sort past events by most recent date first
  const past = events
    .filter((event) => event.status === "past")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Events shown in the selected tab
  const display = tab === "upcoming" ? upcoming : past;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">
              Community
            </span>
          </div>

          <h1 className="mt-6 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Community <span className="text-gradient-brand">Activities</span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Networking meetups, knowledge sharing sessions, career development
            programs, and technical workshops.
          </p>
        </div>
      </section>

      {/* Initiative Cards */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Users,
                title: "Networking Meetups",
                desc: "Connect with fellow professionals in person.",
              },
              {
                icon: Calendar,
                title: "Knowledge Sharing",
                desc: "Learn from peers through technical sessions.",
              },
              {
                icon: Users,
                title: "Career Development",
                desc: "Programs to support professional growth.",
              },
              {
                icon: Calendar,
                title: "Technical Workshops",
                desc: "Hands-on sessions on emerging technologies.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-background p-5"
              >
                <div className="h-10 w-10 grid place-items-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-heading text-sm font-semibold text-foreground">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Events */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => setTab("upcoming")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                tab === "upcoming"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              Upcoming ({upcoming.length})
            </button>

            <button
              type="button"
              onClick={() => setTab("past")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                tab === "past"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              Past Events ({past.length})
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl border border-border bg-card animate-pulse"
                />
              ))}
            </div>
          ) : display.length > 0 ? (
            /* Event Cards */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {display.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <EmptyState
              icon={Calendar}
              title={
                tab === "upcoming" ? "No upcoming events" : "No past events"
              }
              description={
                tab === "upcoming"
                  ? "There are no scheduled events at the moment. Check back soon for community meetups and workshops."
                  : "Past community events will be archived here."
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
