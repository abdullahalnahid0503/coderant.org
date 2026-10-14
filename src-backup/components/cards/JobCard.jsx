import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react';
import Pill from '../Pill';
import { cn } from '@/lib/utils';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function JobCard({ job, className = '' }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className={cn(
        'group flex flex-col rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground truncate">{job.company}</p>
        </div>
        {job.salary && (
          <span className="text-sm font-mono font-semibold text-accent whitespace-nowrap">
            {job.salary}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {job.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {job.location}
          </span>
        )}
        {job.employment_type && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3 w-3" /> {job.employment_type}
          </span>
        )}
        {job.work_arrangement && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {job.work_arrangement}
          </span>
        )}
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill, i) => (
            <Pill key={i}>{skill}</Pill>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground/70">
          {job.posted_date ? `Posted ${formatDate(job.posted_date)}` : job.category}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
          View Details <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}