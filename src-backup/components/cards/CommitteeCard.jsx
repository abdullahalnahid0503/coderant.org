import React from 'react';
import { Linkedin, Facebook } from 'lucide-react';
import Avatar from '../Avatar';
import { cn } from '@/lib/utils';

export default function CommitteeCard({ member, className = '' }) {
  const socials = [
    member.linkedin_url && { key: 'linkedin', href: member.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    member.facebook_url && { key: 'facebook', href: member.facebook_url, icon: Facebook, label: 'Facebook' },
  ].filter(Boolean);

  return (
    <div
      className={cn(
        'group flex flex-col rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300',
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <Avatar name={member.name} size="md" />
        <h3 className="mt-3 font-heading text-base font-semibold text-foreground truncate max-w-full">
          {member.name}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{member.designation}</p>
        {member.category && (
          <p className="mt-1 text-xs font-mono text-primary/70">{member.category}</p>
        )}
      </div>

      {member.bio && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3 text-center">
          {member.bio}
        </p>
      )}

      <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-center gap-2 min-h-[3.25rem] flex-wrap">
        {socials.map((s) => (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on ${s.label}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}