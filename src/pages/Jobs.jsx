import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Briefcase,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";

import JobCard from "@/components/cards/JobCard";
import EmptyState from "@/components/EmptyState";

const CATEGORIES = [
  "Software Engineering",
  "AI and Data",
  "Cybersecurity",
  "Cloud and DevOps",
  "IT Support",
  "Product",
  "QA",
  "Design",
  "Technology Consulting",
];

const LOCATIONS = ["Kuala Lumpur", "Selangor", "Penang", "Johor", "Remote"];

const WORK_TYPES = ["On-site", "Hybrid", "Remote"];

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const EXPERIENCE_LEVELS = [
  "Entry",
  "Junior",
  "Mid",
  "Senior",
  "Lead",
  "Manager",
];

function inferCategory(job) {
  const text = `${job.title || ""} ${job.description || ""}`.toLowerCase();

  if (/cyber.?security|security engineer|penetration test/.test(text)) {
    return "Cybersecurity";
  }

  if (
    /\b(ai|machine learning|data scientist|data analyst|analytics)\b/.test(text)
  ) {
    return "AI and Data";
  }

  if (/devops|cloud engineer|site reliability|platform engineer/.test(text)) {
    return "Cloud and DevOps";
  }

  if (/help desk|it support|technical support|desktop support/.test(text)) {
    return "IT Support";
  }

  if (
    /quality assurance|\bqa engineer\b|software tester|test engineer/.test(text)
  ) {
    return "QA";
  }

  if (/product manager|product owner/.test(text)) {
    return "Product";
  }

  if (/ui.?ux|graphic designer|web designer|product designer/.test(text)) {
    return "Design";
  }

  if (/technology consultant|it consultant|technical consultant/.test(text)) {
    return "Technology Consulting";
  }

  return "Software Engineering";
}

function inferExperience(job) {
  const text = `${job.title || ""} ${job.description || ""}`.toLowerCase();

  if (
    /\b(intern|internship|graduate|entry.level|fresh graduate)\b/.test(text)
  ) {
    return "Entry";
  }

  if (/\b(director|head of|vice president)\b/.test(text)) {
    return "Manager";
  }

  if (/\b(lead|principal|staff engineer)\b/.test(text)) {
    return "Lead";
  }

  if (/\b(senior|sr\.?)\b/.test(text)) {
    return "Senior";
  }

  if (/\b(mid.level|intermediate)\b/.test(text)) {
    return "Mid";
  }

  if (/\b(junior|jr\.?)\b/.test(text)) {
    return "Junior";
  }

  return "";
}

function formatSalary(job) {
  if (job.salary) return job.salary;

  const min = Number(job.salaryMin);
  const max = Number(job.salaryMax);
  const currency = job.salaryCurrency || "MYR";

  if (Number.isFinite(min) && min > 0 && Number.isFinite(max) && max > 0) {
    return `${currency} ${min.toLocaleString()}–${max.toLocaleString()}`;
  }

  if (Number.isFinite(min) && min > 0) {
    return `From ${currency} ${min.toLocaleString()}`;
  }

  if (Number.isFinite(max) && max > 0) {
    return `Up to ${currency} ${max.toLocaleString()}`;
  }

  return "";
}

function normaliseJobs(response) {
  const items = Array.isArray(response?.jobs)
    ? response.jobs
    : Array.isArray(response?.data?.jobs)
      ? response.data.jobs
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.items)
          ? response.items
          : [];

  return items.map((job, index) => {
    const isRemote = job.isRemote ?? job.job_is_remote ?? false;

    const employmentType =
      job.employmentType ||
      job.employment_type ||
      job.job_employment_type ||
      "";

    const title = job.title || job.job_title || "Untitled position";

    const description = job.description || job.job_description || "";

    const location =
      job.location ||
      [job.job_city, job.job_state, job.job_country]
        .filter(Boolean)
        .join(", ") ||
      (isRemote ? "Remote" : "Location not specified");

    const source =
      job.source ||
      job.source_name ||
      job.job_publisher ||
      "External job board";

    const applicationUrl =
      job.url ||
      job.application_url ||
      job.apply_url ||
      job.job_apply_link ||
      "";

    return {
      ...job,
      id: job.id || job.job_id || `${title}-${index}`,
      title,
      company: job.company || job.employer_name || "Company not specified",
      description,
      location,
      source,
      source_name: source,
      application_url: applicationUrl,
      apply_url: applicationUrl,
      employment_type: employmentType
        ? employmentType.replaceAll("_", " ")
        : "",
      work_arrangement: job.work_arrangement || (isRemote ? "Remote" : ""),
      category: job.category || inferCategory({ title, description }),
      experience_level:
        job.experience_level || inferExperience({ title, description }),
      posted_date:
        job.posted_date || job.postedAt || job.job_posted_at_datetime_utc || "",
      salary: formatSalary(job),
      skills: Array.isArray(job.skills) ? job.skills : [],
    };
  });
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      >
        <option value="">All</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Jobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const query = search.trim() || "software developer";

        const params = new URLSearchParams({
          q: query,
          country: "my",
        });

        const response = await fetch(`/api/jobs?${params.toString()}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Unable to load jobs");
        }

        const jobs = normaliseJobs(result);

        if (!cancelled) {
          setAllJobs(jobs);
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Failed to load job listings:", error);

        if (!cancelled) {
          setAllJobs([]);
          setLoadError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [search]);

  const filtered = useMemo(() => {
    let result = allJobs;

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((job) => {
        const searchableText = [
          job.title,
          job.company,
          job.description,
          job.category,
          job.location,
          job.source,
          ...(job.skills || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    if (category) {
      result = result.filter((job) => job.category === category);
    }

    if (location) {
      result = result.filter((job) =>
        String(job.location || "")
          .toLowerCase()
          .includes(location.toLowerCase()),
      );
    }

    if (workType) {
      result = result.filter((job) => job.work_arrangement === workType);
    }

    if (employmentType) {
      result = result.filter(
        (job) =>
          String(job.employment_type || "").toLowerCase() ===
          employmentType.toLowerCase(),
      );
    }

    if (experienceLevel) {
      result = result.filter((job) => job.experience_level === experienceLevel);
    }

    return result;
  }, [
    allJobs,
    search,
    category,
    location,
    workType,
    employmentType,
    experienceLevel,
  ]);

  const hasFilters = Boolean(
    search.trim() ||
    category ||
    location ||
    workType ||
    employmentType ||
    experienceLevel,
  );

  function resetFilters() {
    setSearch("");
    setCategory("");
    setLocation("");
    setWorkType("");
    setEmploymentType("");
    setExperienceLevel("");
  }

  function FilterPanel() {
    return (
      <div className="space-y-4">
        <FilterSelect
          label="Category"
          value={category}
          onChange={setCategory}
          options={CATEGORIES}
        />

        <FilterSelect
          label="Location"
          value={location}
          onChange={setLocation}
          options={LOCATIONS}
        />

        <FilterSelect
          label="Work Arrangement"
          value={workType}
          onChange={setWorkType}
          options={WORK_TYPES}
        />

        <FilterSelect
          label="Employment Type"
          value={employmentType}
          onChange={setEmploymentType}
          options={EMPLOYMENT_TYPES}
        />

        <FilterSelect
          label="Experience Level"
          value={experienceLevel}
          onChange={setExperienceLevel}
          options={EXPERIENCE_LEVELS}
        />

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />

        <div className="relative mx-auto max-w-4xl px-4 pt-12 pb-12 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">
              Job Board
            </span>
          </div>

          <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Discover Your{" "}
            <span className="text-gradient-brand">Next Opportunity</span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Explore technology roles and career opportunities in Malaysia and
            beyond.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              aria-label="Search jobs"
              placeholder="Search by job title, company, or skill..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="mb-5 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

                  <h2 className="text-sm font-semibold text-foreground">
                    Filters
                  </h2>
                </div>

                <FilterPanel />
              </div>
            </aside>

            <div className="min-w-0 lg:col-span-3">
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {loading
                    ? "Loading jobs..."
                    : `${filtered.length} ${
                        filtered.length === 1 ? "role" : "roles"
                      } found`}
                </p>

                <button
                  type="button"
                  onClick={() => setShowMobileFilters(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground lg:hidden"
                  aria-expanded={showMobileFilters}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                </button>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-60 animate-pulse rounded-2xl border border-border bg-card"
                    />
                  ))}
                </div>
              ) : loadError ? (
                <EmptyState
                  icon={Briefcase}
                  title="Unable to load jobs"
                  description="We couldn't retrieve job listings. Please check that the CodeRant API server is running and try again."
                  action={
                    <button
                      type="button"
                      onClick={() => setSearch((value) => `${value} `)}
                      className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                      Retry
                    </button>
                  }
                />
              ) : filtered.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filtered.map((job, index) => (
                    <JobCard
                      key={job.id || `${job.title}-${job.company}-${index}`}
                      job={job}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Briefcase}
                  title={
                    hasFilters ? "No matching roles" : "No active job listings"
                  }
                  description={
                    hasFilters
                      ? "No jobs match your current filters. Try another search or reset your filters."
                      : "No jobs were returned by the provider. Please check back later."
                  }
                  action={
                    hasFilters ? (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset Filters
                      </button>
                    ) : null
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {showMobileFilters && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Job filters"
        >
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 h-full w-full bg-background/80 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />

          <div className="animate-fade-in absolute right-0 top-0 bottom-0 w-80 max-w-[85%] overflow-y-auto border-l border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
                className="grid h-8 w-8 place-items-center rounded-lg border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <FilterPanel />

            <button
              type="button"
              onClick={() => setShowMobileFilters(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              Show {filtered.length}{" "}
              {filtered.length === 1 ? "result" : "results"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
