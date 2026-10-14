const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Briefcase, RotateCcw, SlidersHorizontal, X } from 'lucide-react';

import JobCard from '@/components/cards/JobCard';
import EmptyState from '@/components/EmptyState';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Software Engineering', 'AI and Data', 'Cybersecurity', 'Cloud and DevOps', 'IT Support', 'Product', 'QA', 'Design', 'Technology Consulting'];
const LOCATIONS = ['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Remote'];
const WORK_TYPES = ['On-site', 'Hybrid', 'Remote'];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const EXPERIENCE_LEVELS = ['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Manager'];

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground/70 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function Jobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [workType, setWorkType] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await db.entities.Job.filter(
          { status: 'active' },
          { sort: '-posted_date', limit: 100 }
        );
        setAllJobs(res.items || []);
      } catch {
        setAllJobs([]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = allJobs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((j) =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (category) result = result.filter((j) => j.category === category);
    if (location) result = result.filter((j) => j.location?.includes(location));
    if (workType) result = result.filter((j) => j.work_arrangement === workType);
    if (employmentType) result = result.filter((j) => j.employment_type === employmentType);
    if (experienceLevel) result = result.filter((j) => j.experience_level === experienceLevel);
    return result;
  }, [allJobs, search, category, location, workType, employmentType, experienceLevel]);

  const hasFilters = search || category || location || workType || employmentType || experienceLevel;

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setWorkType('');
    setEmploymentType('');
    setExperienceLevel('');
  };

  const FilterPanel = () => (
    <div className="space-y-4">
      <FilterSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES} />
      <FilterSelect label="Location" value={location} onChange={setLocation} options={LOCATIONS} />
      <FilterSelect label="Work Arrangement" value={workType} onChange={setWorkType} options={WORK_TYPES} />
      <FilterSelect label="Employment Type" value={employmentType} onChange={setEmploymentType} options={EMPLOYMENT_TYPES} />
      <FilterSelect label="Experience Level" value={experienceLevel} onChange={setExperienceLevel} options={EXPERIENCE_LEVELS} />
      {hasFilters && (
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <RotateCcw className="h-3 w-3" /> Reset Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">Job Board</span>
          </div>
          <h1 className="mt-6 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Discover Your{' '}
            <span className="text-gradient-brand">Next Opportunity</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Explore technology roles and career opportunities in Malaysia and beyond.
          </p>
        </div>
      </section>

      {/* Search bar */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by job title, company, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Desktop filters */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-5">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                </div>
                <FilterPanel />
              </div>
            </aside>

            {/* Job list */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'role' : 'roles'} found`}
                </p>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                </button>
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-52 rounded-2xl border border-border bg-card animate-pulse" />
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filtered.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Briefcase}
                  title={hasFilters ? 'No matching roles' : 'No active job listings'}
                  description={hasFilters
                    ? 'No jobs match your current filters. Try adjusting or resetting your search.'
                    : 'There are no approved job openings right now. Check back soon.'}
                  action={hasFilters ? (
                    <button onClick={resetFilters} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                      <RotateCcw className="h-4 w-4" /> Reset Filters
                    </button>
                  ) : null}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-card border-l border-border p-6 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-bold text-foreground">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="h-8 w-8 grid place-items-center rounded-lg border border-border">
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}