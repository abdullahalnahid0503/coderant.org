import React from 'react';
import { cn } from '@/lib/utils';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-16',
      className
    )}>
      {Icon && (
        <div className="h-14 w-14 grid place-items-center rounded-2xl border border-border bg-card text-muted-foreground/60">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}