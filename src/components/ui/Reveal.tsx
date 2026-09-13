import { animated, useSpring, type SpringConfig } from '@react-spring/web';
import type { ElementType, ReactNode } from 'react';
import { SPRING } from '../../lib/constants';
import { useInView } from '../../hooks/useInView';
import { useUI } from '../../context/ui-context';

interface RevealProps {
  children: ReactNode;
  /** Start offset on the Y axis, in px. */
  y?: number;
  /** Start scale. */
  scale?: number;
  /** Opacity to settle on — the brand watermark stops at 0.4. */
  toOpacity?: number;
  delay?: number;
  config?: SpringConfig;
  /** Hold until the intro loader has left. Used for everything above the fold. */
  gateOnReady?: boolean;
  as?: ElementType;
  className?: string;
}

/**
 * Spring entrance that plays once, when the element scrolls into view.
 */
export function Reveal({
  children,
  y = 0,
  scale = 1,
  toOpacity = 1,
  delay = 0,
  config = SPRING.reveal,
  gateOnReady = false,
  as = 'div',
  className,
}: RevealProps) {
  const { ready } = useUI();
  const [ref, inView] = useInView<HTMLDivElement>();
  const show = inView && (!gateOnReady || ready);

  const style = useSpring({
    opacity: show ? toOpacity : 0,
    y: show ? 0 : y,
    scale: show ? 1 : scale,
    delay,
    config,
  });

  const Animated = animated[as as 'div'];

  return (
    <Animated ref={ref} style={style} className={className}>
      {children}
    </Animated>
  );
}
