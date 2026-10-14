import React from 'react';
import { cn } from '@/lib/utils';

export default function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  return (
    <div className={cn(align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl', className)}>
      {eyebrow && (
        <div className={cn('flex items-center gap-2', align === 'center' && 'justify-center')}>
          <span className="h-px w-8 bg-primary/50" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-primary/50" />
        </div>
      )}
      <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}