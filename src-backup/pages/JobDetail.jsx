const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, ExternalLink, Building2, Wallet, CheckCircle2, ListTodo, GraduationCap } from 'lucide-react';

import Pill from '@/components/Pill';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await db.entities.Job.get(id);
        setJob(res);
      } catch {
        setJob(null);
      }
      setLoading(false);
    })();
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
        <h1 className="font-heading text-2xl font-bold text-foreground">Job not found</h1>
        <Link to="/jobs" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
      </div>
    );
  }

  const metaItems = [
    { icon: MapPin, label: job.location },
    { icon: Briefcase, label: job.employment_type },
    { icon: Clock, label: job.work_arrangement },
    { icon: GraduationCap, label: job.experience_level },
  ].filter((m) => m.label);

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
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>

          <div className="mt-8">
            {job.category && <Pill variant="primary">{job.category}</Pill>}
            <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {job.title}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="text-base font-medium">{job.company}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {metaItems.map((m, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <m.icon className="h-3.5 w-3.5" /> {m.label}
                </span>
              ))}
            </div>

            {job.salary && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-2">
                <Wallet className="h-4 w-4 text-accent" />
                <span className="text-sm font-mono font-semibold text-accent">{job.salary}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {job.description && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">Description</h2>
                  <p className="mt-3 text-base leading-relaxed text-foreground/90 whitespace-pre-line">{job.description}</p>
                </div>
              )}
              {job.responsibilities && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                    <ListTodo className="h-3.5 w-3.5" /> Responsibilities
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground whitespace-pre-line">{job.responsibilities}</p>
                </div>
              )}
              {job.requirements && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Requirements
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground whitespace-pre-line">{job.requirements}</p>
                </div>
              )}
              {job.skills && job.skills.length > 0 && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <Pill key={i} variant="primary">{skill}</Pill>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">Apply Now</h3>
                {job.application_url ? (
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Apply Now <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">Application link will be available soon.</p>
                )}
              </div>

              {job.deadline && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">Application Deadline</h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Calendar className="h-4 w-4 text-primary" /> {formatDate(job.deadline)}
                  </p>
                </div>
              )}

              {job.posted_date && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">Posted</h3>
                  <p className="mt-2 text-sm font-medium text-foreground">{formatDate(job.posted_date)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}