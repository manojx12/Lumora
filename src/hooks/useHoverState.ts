import { useMemo, useState } from 'react';
import { useCanHover } from './useCanHover';

export interface HoverBindings {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * Pointer hover state plus the props that drive it.
 *
 * Returning the flag rather than a style lets one element trigger springs on
 * its descendants — the portfolio card rotating its badge, a service row
 * nudging its arrow — without prop-drilling a spring API.
 */
export function useHoverState(): [boolean, HoverBindings] {
  const canHover = useCanHover();
  const [hovered, setHovered] = useState(false);

  const bindings = useMemo<HoverBindings>(() => {
    if (!canHover) return {};
    return {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setHovered(true),
      onBlur: () => setHovered(false),
    };
  }, [canHover]);

  return [canHover && hovered, bindings];
}
