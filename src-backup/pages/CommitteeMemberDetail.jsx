const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Github, Globe, CheckCircle2, Calendar } from 'lucide-react';

import Avatar from '@/components/Avatar';
import Pill from '@/components/Pill';

export default function CommitteeMemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await db.entities.CommitteeMember.get(id);
        setMember(res);
      } catch {
        setMember(null);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="h-80 rounded-3xl border border-border bg-card animate-pulse" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Member not found</h1>
        <Link to="/committee" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Committee
        </Link>
      </div>
    );
  }

  const socials = [
    { url: member.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: member.github_url, icon: Github, label: 'GitHub' },
    { url: member.website_url, icon: Globe, label: 'Website' },
  ].filter((s) => s.url);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-card/30 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <Link
            to="/committee"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Committee
          </Link>

          <div className="mt-8 flex flex-col sm:flex-row items-start gap-6">
            <Avatar name={member.name} size="xl" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {member.category && <Pill variant="primary">{member.category}</Pill>}
                {member.status === 'current' ? (
                  <Pill variant="accent"><CheckCircle2 className="h-3 w-3 mr-1" /> Current</Pill>
                ) : (
                  <Pill>Former</Pill>
                )}
              </div>
              <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {member.name}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">{member.designation}</p>
              {member.tenure && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground/70">
                  <Calendar className="h-3.5 w-3.5" /> {member.tenure}
                </p>
              )}

              {socials.length > 0 && (
                <div className="mt-5 flex items-center gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="h-10 w-10 grid place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bio & details */}
      <section className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {member.bio && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">Biography</h2>
                  <p className="mt-3 text-base leading-relaxed text-foreground/90">{member.bio}</p>
                </div>
              )}
              {member.responsibilities && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">Responsibilities & Contributions</h2>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{member.responsibilities}</p>
                </div>
              )}
              {member.background && (
                <div>
                  <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">Professional Background</h2>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{member.background}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">Role</h3>
                <p className="mt-2 text-sm font-medium text-foreground">{member.designation}</p>
                {member.category && (
                  <p className="mt-1 text-xs text-muted-foreground">{member.category}</p>
                )}
              </div>
              {member.tenure && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">Tenure</h3>
                  <p className="mt-2 text-sm font-medium text-foreground">{member.tenure}</p>
                </div>
              )}
              {socials.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">Connect</h3>
                  <div className="mt-3 space-y-2">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <s.icon className="h-4 w-4" /> {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}