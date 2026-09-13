import type { ReactNode } from 'react';

/** Outlined chip used for project tags on the dark portfolio cards. */
export function TagChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-pill border border-white/25 px-4 py-2 text-sm text-white">
      {children}
    </span>
  );
}
