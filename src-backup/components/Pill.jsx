import React from 'react';
import { cn } from '@/lib/utils';

export default function Pill({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'border-border text-muted-foreground bg-muted/50',
    primary: 'border-primary/30 text-primary bg-primary/5',
    accent: 'border-accent/30 text-accent bg-accent/5',
  };
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}