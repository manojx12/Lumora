import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'dark' | 'light';
  bordered?: boolean;
  className?: string;
}

/** Small dotted section label. */
export function Eyebrow({ children, tone = 'dark', bordered = false, className = '' }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-medium ${
        tone === 'light' ? 'text-white/70' : 'text-foreground/70'
      } ${bordered ? 'rounded-pill border border-line px-4 py-1.5' : ''} ${className}`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-pill ${
          tone === 'light' ? 'bg-white/60' : 'bg-foreground/50'
        }`}
      />
      {children}
    </span>
  );
}
