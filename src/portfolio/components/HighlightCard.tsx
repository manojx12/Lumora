import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';
import { ArrowRight, LogoMark } from '../../components/icons';
import { SPRING } from '../../lib/constants';

export interface Highlight {
  caption: string;
  title: string;
}

/**
 * Rotating highlight card. Clicking the card or Next advances; the outgoing
 * item slides out in the direction of travel while the incoming one follows it.
 */
export function HighlightCard({ items }: { items: Highlight[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (step: number) => {
    setDirection(step > 0 ? 1 : -1);
    setIndex((current) => (current + step + items.length) % items.length);
  };

  return (
    <div className="w-full max-w-96 rounded-card-sm bg-white/70 p-2 shadow-sm ring-1 ring-line/70 backdrop-blur-md lg:w-76">
      {/* Clicking anywhere on the card advances it — a pointer affordance on
          top of the Prev/Next buttons, which stay the keyboard and assistive
          path. It deliberately exposes no role of its own so it does not
          duplicate the Next button's accessible name. */}
      <div onClick={() => go(1)} className="flex w-full cursor-pointer gap-2 rounded-control text-left">
        <div className="grid aspect-square w-24 shrink-0 place-items-center rounded-control bg-ink text-3xl text-white">
          <LogoMark className="text-accent-from" />
        </div>

        <div className="flex flex-1 flex-col justify-between rounded-control bg-surface/70 p-3">
          <div className="relative min-h-13" aria-live="polite">
            {items.map((item, itemIndex) => (
              <CarouselItem
                key={item.caption}
                item={item}
                active={itemIndex === index}
                direction={direction}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1" aria-hidden="true">
              {items.map((item, dotIndex) => (
                <span
                  key={item.caption}
                  className={`block h-1 rounded-pill transition-all duration-300 ${
                    dotIndex === index ? 'w-4 bg-foreground/70' : 'w-1.5 bg-foreground/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <CarouselButton label="Previous highlight" onClick={() => go(-1)} flip />
              <CarouselButton label="Next highlight" onClick={() => go(1)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselItem({
  item,
  active,
  direction,
}: {
  item: Highlight;
  active: boolean;
  direction: number;
}) {
  const style = useSpring({
    opacity: active ? 1 : 0,
    y: active ? 0 : direction * 14,
    config: SPRING.carousel,
  });

  return (
    <animated.div
      style={{ ...style, visibility: style.opacity.to((o) => (o < 0.01 ? 'hidden' : 'visible')) }}
      className="absolute inset-0"
    >
      <p className="text-[0.65rem] font-medium tracking-[0.05em] text-foreground/45 uppercase">
        {item.caption}
      </p>
      <p className="max-w-40 text-sm leading-[1.35] font-medium">{item.title}</p>
    </animated.div>
  );
}

function CarouselButton({
  label,
  onClick,
  flip = false,
}: {
  label: string;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="grid size-7 place-items-center rounded-pill bg-white text-xs text-foreground/70 ring-1 ring-line hover:text-foreground"
    >
      <ArrowRight className={flip ? 'rotate-180' : undefined} />
    </button>
  );
}
