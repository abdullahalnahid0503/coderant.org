import React from 'react';
import { Calendar, MapPin, Video, Users } from 'lucide-react';
import Pill from '../Pill';
import { cn } from '@/lib/utils';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function EventCard({ event, className = '' }) {
  const isPast = event.status === 'past';
  const FormatIcon = event.format === 'Online' ? Video : event.format === 'Hybrid' ? Users : MapPin;

  return (
    <div className={cn(
      'group flex flex-col rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-300',
      isPast && 'opacity-70',
      className
    )}>
      <div className="flex items-center justify-between">
        <Pill variant={isPast ? 'default' : 'primary'}>
          {isPast ? 'Completed' : 'Upcoming'}
        </Pill>
        {event.category && (
          <span className="text-xs font-mono text-muted-foreground/60">{event.category}</span>
        )}
      </div>

      <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{event.title}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {formatDate(event.date)}
        </span>
        {event.location && (
          <span className="inline-flex items-center gap-1">
            <FormatIcon className="h-3 w-3" /> {event.location}
          </span>
        )}
      </div>

      {event.description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {event.description}
        </p>
      )}

      {event.registration_info && !isPast && (
        <p className="mt-4 pt-4 border-t border-border/60 text-xs font-medium text-primary">
          {event.registration_info}
        </p>
      )}
    </div>
  );
}