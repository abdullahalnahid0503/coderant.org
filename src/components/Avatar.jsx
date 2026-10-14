import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Initials-based avatar — used since no member photos are available.
 * Generates a consistent gradient from the name.
 */
export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-16 w-16 text-lg',
    lg: 'h-24 w-24 text-2xl',
    xl: 'h-32 w-32 text-3xl',
  };

  // Deterministic gradient from name
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40) % 360;

  return (
    <div
      className={cn(
        'grid place-items-center rounded-2xl font-heading font-bold text-white shrink-0 ring-1 ring-white/10',
        sizes[size],
        className
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue1} 70% 55%), hsl(${hue2} 70% 45%))`,
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}