const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

import SectionHeading from '@/components/SectionHeading';
import CommitteeCard from '@/components/cards/CommitteeCard';
import EmptyState from '@/components/EmptyState';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Executive Committee', 'Core Committee', 'Department Heads', 'Committee Member'];

export default function Committee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const res = await db.entities.CommitteeMember.filter(
          { published: true, status: 'current' },
          { sort: 'display_order', limit: 100 }
        );
        setMembers(res.items || []);
      } catch {
        setMembers([]);
      }
      setLoading(false);
    })();
  }, []);

  const availableCategories = CATEGORIES.filter((cat) =>
    members.some((m) => m.category === cat)
  );

  const filtered = activeCategory === 'all'
    ? members
    : members.filter((m) => m.category === activeCategory);

  const tierGroups = CATEGORIES
    .map((cat) => filtered.filter((m) => m.category === cat))
    .filter((g) => g.length > 0);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">Committee</span>
          </div>
          <h1 className="mt-6 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            The People Behind{' '}
            <span className="text-gradient-brand">CodeRant</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Meet the people helping our community connect, collaborate, and grow.
          </p>
        </div>
      </section>

      {/* Intro band */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-heading text-3xl font-bold text-gradient-brand">Dedicated</p>
              <p className="mt-1 text-sm text-muted-foreground">Volunteer leadership</p>
            </div>
            <div className="sm:border-x sm:border-border">
              <p className="font-heading text-3xl font-bold text-gradient-brand">Diverse</p>
              <p className="mt-1 text-sm text-muted-foreground">Roles & expertise</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-gradient-brand">Community</p>
              <p className="mt-1 text-sm text-muted-foreground">Driven by members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Directory — pyramid layout */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          {/* Filter tabs */}
          {availableCategories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              <button
                onClick={() => setActiveCategory('all')}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  activeCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                All Members
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center gap-6">
              <div className="h-56 w-full max-w-sm rounded-2xl border border-border bg-card animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-56 rounded-2xl border border-border bg-card animate-pulse" />
                ))}
              </div>
            </div>
          ) : tierGroups.length > 0 ? (
            <div className="flex flex-col items-center">
              {tierGroups.map((group, gi) => (
                <React.Fragment key={group[0].category}>
                  {gi > 0 && (
                    <div className="flex flex-col items-center py-1">
                      <div className="w-px h-4 bg-border" />
                      <div className="my-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                      <div className="w-px h-4 bg-border" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'grid gap-4 justify-items-center',
                      group.length === 1
                        ? 'grid-cols-1 max-w-sm'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-5xl'
                    )}
                  >
                    {group.map((member) => (
                      <CommitteeCard key={member.id} member={member} className="w-full" />
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Committee profiles coming soon"
              description="Committee member profiles will appear here once published by administrators."
            />
          )}
        </div>
      </section>
    </div>
  );
}