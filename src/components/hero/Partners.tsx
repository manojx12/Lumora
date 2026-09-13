import { animated, useSpring } from '@react-spring/web';
import { CircleDot } from '../icons';
import { PARTNERS } from '../../data/content';
import { SPRING } from '../../lib/constants';
import { useHoverState } from '../../hooks/useHoverState';

function Partner({ name }: { name: string }) {
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

export function Partners() {
  return (
    <div className="w-full max-w-96 lg:w-76 lg:max-w-76">
      <p className="mb-3 text-left text-xs font-medium text-foreground/45 lg:text-right">
        Trusted by
      </p>
      <ul className="grid grid-cols-4 gap-x-4 gap-y-3">
        {PARTNERS.map((name) => (
          <Partner key={name} name={name} />
        ))}
      </ul>
    </div>
  );
}
