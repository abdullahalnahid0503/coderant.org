import React, { useEffect, useState } from "react";
import {
  Linkedin,
  ArrowUpRight,
  UserRound,
  X,
  BookOpen,
  BriefcaseBusiness,
} from "lucide-react";
import { cn } from "@/lib/utils";

function MemberPhoto({ member, className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [member?.image]);

  if (!member?.image || imageFailed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center",
          "bg-gradient-to-br from-blue-100 via-cyan-50 to-violet-100",
          "text-blue-700 dark:from-blue-950 dark:via-slate-900",
          "dark:to-violet-950 dark:text-cyan-300",
          className,
        )}
      >
        <UserRound className="h-16 w-16" strokeWidth={1.2} />
      </div>
    );
  }

  return (
    <img
      src={member.image}
      alt={`${member.name || "Committee member"} profile`}
      loading="lazy"
      onError={() => setImageFailed(true)}
      className={cn(
        "h-full w-full object-cover object-center",
        "transition-transform duration-500 group-hover:scale-105",
        className,
      )}
    />
  );
}

function MemberBioModal({ member, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-modal-title"
        className="relative my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="relative h-64 overflow-hidden bg-muted sm:h-72">
          <MemberPhoto member={member} />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close member details"
            className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/50 p-2 text-white transition hover:bg-black/75"
          >
            <X className="h-5 w-5" />
          </button>

          {member.category && (
            <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              {member.category}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <h2
            id="member-modal-title"
            className="break-words text-xl font-bold text-foreground sm:text-2xl"
          >
            {member.name}
          </h2>

          {member.designation && (
            <p className="mt-1 font-medium text-primary">
              {member.designation}
            </p>
          )}

          <div className="my-5 h-px bg-border" />

          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            About {member.name}
          </h3>

          <p className="whitespace-pre-line break-words text-sm leading-7 text-muted-foreground">
            {member.bio || "No biography is available for this member yet."}
          </p>

          {member.background && (
            <div className="mt-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <BriefcaseBusiness className="h-4 w-4 text-primary" />
                Professional Background
              </h3>

              <p className="whitespace-pre-line break-words text-sm leading-7 text-muted-foreground">
                {member.background}
              </p>
            </div>
          )}

          {member.responsibilities && (
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Responsibilities
              </h3>

              <p className="whitespace-pre-line break-words text-sm leading-7 text-muted-foreground">
                {member.responsibilities}
              </p>
            </div>
          )}

          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#084f96]"
            >
              <Linkedin className="h-4 w-4" />
              View LinkedIn Profile
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

export default function CommitteeCard({ member, className = "" }) {
  const [showBio, setShowBio] = useState(false);

  return (
    <>
      <article
        className={cn(
          "group flex min-w-0 flex-col overflow-hidden rounded-2xl",
          "border border-border bg-card",
          "transition-all duration-300",
          "hover:-translate-y-1 hover:border-primary/40",
          "hover:shadow-xl hover:shadow-primary/10",
          className,
        )}
      >
        {/* Consistent, large photo */}
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
          <MemberPhoto member={member} />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          {member.category && (
            <span className="absolute bottom-3 left-3 max-w-[calc(100%-24px)] truncate rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              {member.category}
            </span>
          )}
        </div>

        {/* Compact information area */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="break-words text-base font-bold leading-snug text-foreground sm:text-lg">
            {member.name}
          </h3>

          {member.designation && (
            <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-primary">
              {member.designation}
            </p>
          )}

          {member.bio && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {member.bio}
            </p>
          )}

          <div className="mt-4 flex gap-2 border-t border-border/70 pt-4">
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-xl border border-border px-1.5 text-xs font-semibold leading-none whitespace-nowrap text-foreground transition hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/5 hover:text-[#0A66C2]"
              >
                <Linkedin className="h-4 w-4 shrink-0" />
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowBio(true)}
              className="inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-1.5 text-xs font-semibold leading-none whitespace-nowrap text-primary-foreground transition hover:opacity-90"
            >
              <span>Read More</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </div>
      </article>

      {showBio && (
        <MemberBioModal member={member} onClose={() => setShowBio(false)} />
      )}
    </>
  );
}
