import { animated, useSpring } from '@react-spring/web';
import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from '../icons';
import { SPRING } from '../../lib/constants';
import { useHoverState } from '../../hooks/useHoverState';

type Variant = 'dark' | 'light' | 'outline';
type Arrow = 'right' | 'up-right';

interface PillButtonProps {
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  arrow?: Arrow;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  'aria-label'?: string;
}

const VARIANT_CLASS: Record<Variant, string> = {
  dark: 'bg-ink text-white',
  light: 'bg-surface text-foreground',
  outline: 'border border-line bg-transparent text-foreground',
};

const BADGE_CLASS: Record<Variant, string> = {
  dark: 'bg-white text-ink',
  light: 'bg-ink text-white',
  outline: 'bg-ink text-white',
};

export function PillButton({
  children,
  variant = 'dark',
  withArrow = false,
  arrow = 'right',
  href,
  onClick,
  type = 'button',
  className = '',
  ...rest
}: PillButtonProps) {
  const [hovered, hoverBindings] = useHoverState();

  const scaleStyle = useSpring({ scale: hovered ? 1.04 : 1, config: SPRING.hover });
  const arrowStyle = useSpring({
    x: hovered ? (arrow === 'up-right' ? 2 : 3) : 0,
    y: hovered && arrow === 'up-right' ? -2 : 0,
    config: SPRING.hover,
  });

  const Icon = arrow === 'up-right' ? ArrowUpRight : ArrowRight;

  const content = (
    <animated.span style={scaleStyle} className="inline-block">
      <span
        className={`inline-flex items-center gap-3 rounded-pill text-sm font-medium ${
          withArrow ? 'py-1.5 pr-1.5 pl-6' : 'px-7 py-3.5'
        } ${VARIANT_CLASS[variant]}`}
      >
        {children}
        {withArrow && (
          <span
            className={`grid size-9 place-items-center overflow-hidden rounded-pill text-base ${BADGE_CLASS[variant]}`}
          >
            <animated.span style={arrowStyle} className="inline-block">
              <Icon />
            </animated.span>
          </span>
        )}
      </span>
    </animated.span>
  );

  if (href) {
    return (
      <a href={href} className={`inline-block ${className}`} {...hoverBindings} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-block ${className}`}
      {...hoverBindings}
      {...rest}
    >
      {content}
    </button>
  );
}
