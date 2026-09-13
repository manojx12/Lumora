import type { ElementType, ReactNode } from 'react';

/**
 * Page gutter: centres content at the shared max width. `w-full` matters —
 * as a flex child, `mx-auto` alone would shrink it to its content.
 */
export function Shell({
  children,
  as: Tag = 'div' as ElementType,
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return <Tag className={`mx-auto w-full max-w-shell ${className}`}>{children}</Tag>;
}
