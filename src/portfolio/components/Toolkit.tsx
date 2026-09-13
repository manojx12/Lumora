import { animated, useSpring } from '@react-spring/web';
import { CircleDot } from '../../components/icons';
import { SPRING } from '../../lib/constants';
import { useHoverState } from '../../hooks/useHoverState';
import { TOOLKIT } from '../content';

function Tool({ name }: { name: string }) {
  const [hovered, hoverBindings] = useHoverState();
  const style = useSpring({
    y: hovered ? -2 : 0,
    opacity: hovered ? 1 : 0.7,
    config: SPRING.partner,
  });

  return (
    <li {...hoverBindings}>
      <animated.span style={style} className="flex items-center gap-1.5 text-xs text-foreground/70">
        <CircleDot className="shrink-0 text-sm text-foreground/40" />
        {name}
      </animated.span>
    </li>
  );
}

/** The day-to-day stack, mirroring the partner grid on the studio site. */
export function Toolkit() {
  return (
    <div className="w-full max-w-96 lg:w-76 lg:max-w-76">
      <p className="mb-3 text-left text-xs font-medium text-foreground/45 lg:text-right">
        Working with
      </p>
      <ul className="grid grid-cols-3 gap-x-4 gap-y-3">
        {TOOLKIT.map((name) => (
          <Tool key={name} name={name} />
        ))}
      </ul>
    </div>
  );
}
