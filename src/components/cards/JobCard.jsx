import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  ExternalLink,
  Building2,
} from "lucide-react";
import Pill from "../Pill";
import { cn } from "@/lib/utils";

function formatDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Only allow valid HTTPS URLs without embedded credentials.
 */
function getSafeApplicationUrl(job) {
  const rawUrl = job?.application_url || job?.apply_url || job?.job_apply_link;

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

  if (!applicationUrl) return "External application";

  const hostname = new URL(applicationUrl).hostname.toLowerCase();

  if (hostname.includes("linkedin.com")) return "LinkedIn";
  if (hostname.includes("jobstreet.com")) return "JobStreet";
  if (hostname === "seek.com" || hostname.endsWith(".seek.com")) {
    return "SEEK";
  }
  if (hostname.includes("indeed.com")) return "Indeed";
  if (hostname.includes("glassdoor.com")) return "Glassdoor";
  if (hostname.includes("jobsdb.com")) return "JobsDB";

  return "Company Website";
}

function getSkills(job) {
  if (Array.isArray(job?.skills)) {
    return job.skills;
  }

  if (typeof job?.skills === "string") {
    try {
      const parsed = JSON.parse(job.skills);

      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Treat non-JSON skills as a comma-separated list.
    }

    return job.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
}

export default function JobCard({ job, className = "" }) {
  const applicationUrl = getSafeApplicationUrl(job);
  const source = getJobSource(job, applicationUrl);
  const skills = getSkills(job);
  const jobId = job?.id || job?.job_id;

  const title = job?.title || job?.job_title || "Untitled position";
  const company = job?.company || job?.employer_name || "Company not specified";

  const location =
    job?.location ||
    [job?.job_city, job?.job_state, job?.job_country]
      .filter(Boolean)
      .join(", ");

  const employmentType =
    job?.employment_type || job?.employmentType || job?.job_employment_type;

  const workArrangement =
    job?.work_arrangement ||
    (job?.isRemote || job?.job_is_remote ? "Remote" : "");

  const postedDate =
    job?.posted_date || job?.postedAt || job?.job_posted_at_datetime_utc;

  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      {/* Job information */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex max-w-full items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-mono font-medium text-primary">
              <span className="truncate">{source}</span>
            </span>

            {job?.experience_level && (
              <span className="text-[10px] font-mono text-muted-foreground">
                {job.experience_level}
              </span>
            )}
          </div>

          {jobId ? (
            <Link
              to={`/jobs/${jobId}`}
              className="block line-clamp-2 min-h-[3rem] font-heading text-base font-semibold text-foreground transition-colors hover:text-primary"
              title={title}
            >
              {title}
            </Link>
          ) : (
            <h3
              className="line-clamp-2 min-h-[3rem] font-heading text-base font-semibold text-foreground"
              title={title}
            >
              {title}
            </h3>
          )}

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate" title={company}>
              {company}
            </span>
          </p>
        </div>

        {job?.salary && (
          <span className="max-w-[120px] shrink-0 break-words text-right text-xs font-mono font-semibold text-accent">
            {job.salary}
          </span>
        )}
      </div>

      {/* Job metadata */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {location && (
          <span className="inline-flex items-start gap-1">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="break-words">{location}</span>
          </span>
        )}

        {employmentType && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span>{employmentType}</span>
          </span>
        )}

        {workArrangement && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{workArrangement}</span>
          </span>
        )}
      </div>

      {/* Skills */}
      <div className="mt-4 min-h-0">
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill, index) => (
              <Pill key={`${skill}-${index}`}>{skill}</Pill>
            ))}
          </div>
        )}
      </div>

      {/* Footer stays at the bottom of every card */}
      <div className="mt-auto pt-5">
        <div className="mb-4 flex min-h-8 items-center justify-between gap-3 border-t border-border/60 pt-4">
          <span className="text-xs font-mono text-muted-foreground/70">
            {postedDate
              ? `Posted ${formatDate(postedDate)}`
              : job?.category || "Technology"}
          </span>

          {jobId ? (
            <Link
              to={`/jobs/${jobId}`}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              View Details
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <span />
          )}
        </div>

        {applicationUrl ? (
          <a
            href={applicationUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            referrerPolicy="no-referrer"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            aria-label={`Apply for ${title} on ${source}`}
          >
            <span className="truncate">Apply on {source}</span>
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="No valid HTTPS application URL is available for this job."
            className="flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground opacity-70"
          >
            Application link unavailable
          </button>
        )}
      </div>
    </article>
  );
}
