import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Video,
  Users,
  X,
  ArrowUpRight,
  Tag,
  Clock,
} from "lucide-react";

import Pill from "../Pill";
import { cn } from "@/lib/utils";

function formatDate(dateStr) {
  if (!dateStr) return "Date to be announced";

  // Avoid timezone-related date changes for YYYY-MM-DD strings.
  const d = /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? new Date(`${dateStr}T12:00:00`)
    : new Date(dateStr);

  if (Number.isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventCard({ event, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const isPast = event?.status === "past";
  const isDemo = event?.is_sample === true;

  const FormatIcon =
    event?.format === "Online"
      ? Video
      : event?.format === "Hybrid"
        ? Users
        : MapPin;

  const description = (
    event?.description || "More details will be announced soon."
  ).replace(/^\[DEMO EVENT\]\s*/i, "");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Event Preview Card */}
      <article
        className={cn(
          "group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg",
          isPast && "opacity-90",
          className,
        )}
      >
        {/* Status and Category */}
        <div className="flex items-center justify-between gap-3">
          <Pill variant={isPast ? "default" : "primary"}>
            {isPast ? "Completed" : "Upcoming"}
          </Pill>

          {event?.category && (
            <span className="text-right text-xs font-mono text-muted-foreground/70">
              {event.category}
            </span>
          )}
        </div>

        {/* Demo Badge */}
        {isDemo && (
          <span className="mt-3 w-fit rounded-md border border-dashed border-amber-500/50 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Demo Event
          </span>
        )}

        {/* Title */}
        <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {event?.title || "Community Event"}
        </h3>

        {/* Date and Location */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {formatDate(event?.date)}
          </span>

          {event?.location && (
            <span className="inline-flex items-center gap-1.5">
              <FormatIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="break-words">{event.location}</span>
            </span>
          )}
        </div>

        {/* Short Description Preview */}
        <p className="mt-3 line-clamp-3 whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={`Read full post: ${event?.title || "Community Event"}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Read Full Post
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </article>

      {/* Floating Full Post Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`event-title-${event?.id || "detail"}`}
            className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:rounded-3xl"
          >
            {/* Modal Header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-7">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Pill variant={isPast ? "default" : "primary"}>
                    {isPast ? "Completed" : "Upcoming"}
                  </Pill>

                  {isDemo && (
                    <span className="rounded-full border border-dashed border-amber-500/50 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Demo Event
                    </span>
                  )}
                </div>

                <h2
                  id={`event-title-${event?.id || "detail"}`}
                  className="text-xl font-bold leading-tight text-foreground sm:text-2xl"
                >
                  {event?.title || "Community Event"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close full post"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {/* Event Details */}
              <div className="grid gap-3 border-b border-border p-5 sm:grid-cols-2 sm:p-7">
                <div className="flex items-start gap-3 rounded-xl bg-card p-4">
                  <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatDate(event?.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-card p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="mt-1 break-words text-sm font-medium text-foreground">
                      {event?.location || "To be announced"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-card p-4">
                  <Video className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-xs text-muted-foreground">Format</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {event?.format || "To be announced"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-card p-4">
                  <Tag className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="mt-1 break-words text-sm font-medium text-foreground">
                      {event?.category || "Community Event"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="px-5 py-6 sm:px-7 sm:py-8">
                <h3 className="mb-4 text-base font-bold text-foreground">
                  About This Event
                </h3>

                <div className="whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {description}
                </div>

                {/* Registration Information */}
                {event?.registration_info && (
                  <div className="mt-7 rounded-xl border border-border bg-card p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />

                      <h3 className="font-semibold text-foreground">
                        Registration Information
                      </h3>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                      {event.registration_info}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-background px-5 py-4 sm:px-7">
              <span className="text-xs text-muted-foreground">
                CodeRant Community
              </span>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Close Post
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
