const db = globalThis.__B44_DB__ || {
  auth: {
    isAuthenticated: async () => false,
    me: async () => null,
  },
  entities: new Proxy(
    {},
    {
      get: () => ({
        filter: async () => [],
        get: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      }),
    },
  ),
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: "" }),
    },
  },
};

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  ExternalLink,
  Building2,
  Wallet,
  CheckCircle2,
  ListTodo,
  GraduationCap,
} from "lucide-react";

import Pill from "@/components/Pill";

function formatDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Accept only valid HTTPS application URLs.
 * Supports the existing application_url field and the optional apply_url field.
 */
function getSafeApplicationUrl(job) {
  const rawUrl = job?.application_url || job?.apply_url;

  if (typeof rawUrl !== "string" || !rawUrl.trim()) {
    return null;
  }

  try {
    const url = new URL(rawUrl.trim());

    if (
      url.protocol !== "https:" ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

function getJobSource(job, applicationUrl) {
  const explicitSource = job?.source || job?.source_name || job?.provider;

  if (typeof explicitSource === "string" && explicitSource.trim()) {
    return explicitSource.trim();
  }

  if (!applicationUrl) {
    return "External application";
  }

  const hostname = new URL(applicationUrl).hostname.toLowerCase();

  if (hostname === "linkedin.com" || hostname.endsWith(".linkedin.com")) {
    return "LinkedIn";
  }

  if (hostname === "jobstreet.com" || hostname.endsWith(".jobstreet.com")) {
    return "JobStreet";
  }

  if (hostname === "seek.com" || hostname.endsWith(".seek.com")) {
    return "SEEK";
  }

  if (hostname === "indeed.com" || hostname.endsWith(".indeed.com")) {
    return "Indeed";
  }

  if (hostname === "jobsdb.com" || hostname.endsWith(".jobsdb.com")) {
    return "JobsDB";
  }

  return "Company Website";
}

function parseSkills(rawSkills) {
  if (Array.isArray(rawSkills)) {
    return rawSkills.filter(
      (skill) => typeof skill === "string" && skill.trim(),
    );
  }

  if (typeof rawSkills !== "string" || !rawSkills.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawSkills);

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (skill) => typeof skill === "string" && skill.trim(),
      );
    }
  } catch {
    // Support comma-separated skills as a fallback.
  }

  return rawSkills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export default function JobDetail() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadJob() {
      setLoading(true);
      setLoadError(false);
      setJob(null);

      try {
        const result = await db.entities.Job.get(id);

        if (!cancelled) {
          // Some data providers return { item: ... }.
          const record = result?.item ?? result;
          setJob(record && typeof record === "object" ? record : null);
        }
      } catch (error) {
        console.error("Failed to load job details:", error);

        if (!cancelled) {
          setJob(null);
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadJob();
    } else {
      setLoading(false);
      setJob(null);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="h-96 rounded-3xl border border-border bg-card animate-pulse" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {loadError ? "Unable to load job" : "Job not found"}
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          {loadError
            ? "Something went wrong while loading this job. Please try again later."
            : "This job listing may have been removed or is no longer available."}
        </p>

        <Link
          to="/jobs"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  const applicationUrl = getSafeApplicationUrl(job);
  const jobSource = getJobSource(job, applicationUrl);
  const skills = parseSkills(job.skills);

  const metaItems = [
    { icon: MapPin, label: job.location },
    { icon: Briefcase, label: job.employment_type },
    { icon: Clock, label: job.work_arrangement },
    { icon: GraduationCap, label: job.experience_level },
  ].filter((item) => item.label);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-card/30 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <div className="mt-8">
            {job.category && <Pill variant="primary">{job.category}</Pill>}

            <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {job.title || "Untitled position"}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0" />

              <span className="text-base font-medium">
                {job.company || "Company not specified"}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {metaItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </span>
                );
              })}
            </div>

            {job.salary && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-2">
                <Wallet className="h-4 w-4 text-accent" />

                <span className="text-sm font-mono font-semibold text-accent">
                  {job.salary}
                </span>
              </div>
            )}

            {applicationUrl && (
              <p className="mt-4 text-xs text-muted-foreground">
                Application via {jobSource}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Job content */}
      <section className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {job.description && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">
                    Description
                  </h2>

                  <p className="mt-3 text-base leading-relaxed text-foreground/90 whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              )}

              {job.responsibilities && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                    <ListTodo className="h-3.5 w-3.5" />
                    Responsibilities
                  </h2>

                  <p className="mt-3 text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                    {job.responsibilities}
                  </p>
                </div>
              )}

              {job.requirements && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Requirements
                  </h2>

                  <p className="mt-3 text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                    {job.requirements}
                  </p>
                </div>
              )}

              {skills.length > 0 && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">
                    Skills
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Pill key={`${skill}-${index}`} variant="primary">
                        {skill}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}

              {!job.description &&
                !job.responsibilities &&
                !job.requirements &&
                skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Additional job information is not available yet.
                  </p>
                )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
                  Apply Now
                </h3>

                {applicationUrl ? (
                  <a
                    href={applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    referrerPolicy="no-referrer"
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Apply on {jobSource}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Application link is unavailable or invalid.
                  </p>
                )}

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  You will be redirected to the external application website.
                  Check the job details before submitting your application.
                </p>
              </div>

              {job.deadline && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
                    Application Deadline
                  </h3>

                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {formatDate(job.deadline)}
                  </p>
                </div>
              )}

              {job.posted_date && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
                    Posted
                  </h3>

                  <p className="mt-2 text-sm font-medium text-foreground">
                    {formatDate(job.posted_date)}
                  </p>
                </div>
              )}

              {job.location && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
                    Location
                  </h3>

                  <p className="mt-2 flex items-start gap-2 text-sm text-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    {job.location}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
