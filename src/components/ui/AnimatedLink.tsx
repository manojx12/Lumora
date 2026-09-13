import { animated, useSpring } from '@react-spring/web';
import type { ReactNode } from 'react';
import { SPRING } from '../../lib/constants';
import { useHoverState } from '../../hooks/useHoverState';

interface AnimatedLinkProps {
  children: ReactNode;
  href: string;
  /** Footer legal links travel slightly less and start a touch brighter. */
  subtle?: boolean;
  className?: string;
}

export function AnimatedLink({ children, href, subtle = false, className = '' }: AnimatedLinkProps) {
  const [hovered, hoverBindings] = useHoverState();
  const restingOpacity = subtle ? 0.7 : 0.65;

  const style = useSpring({
    x: hovered ? (subtle ? 3 : 4) : 0,
    opacity: hovered ? 1 : restingOpacity,
    config: SPRING.navItem,
  });

  return (
    <a href={href} className={`inline-flex ${className}`} {...hoverBindings}>
      <animated.span style={style} className="inline-block">
        {children}
      </animated.span>
    </a>
  );
}
