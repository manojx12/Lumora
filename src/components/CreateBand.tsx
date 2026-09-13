import { animated, useSpring } from '@react-spring/web';
import type { ReactNode } from 'react';
import { ArrowRight } from './icons';
import { Reveal } from './ui/Reveal';
import { Shell } from './ui/Shell';
import { SPRING, STAGGER } from '../lib/constants';
import { useHoverState } from '../hooks/useHoverState';

type TileVariant = 'light' | 'accent' | 'dark' | 'ghost';

const TILE_CLASS: Record<TileVariant, string> = {
  light: 'bg-surface text-foreground',
  accent: 'bg-gradient-to-br from-accent-from to-accent-to text-white',
  dark: 'bg-ink text-white',
  ghost: 'bg-surface/60 text-foreground/35',
};

const TILES: { key: string; variant: TileVariant; content: ReactNode }[] = [
  { key: 'we', variant: 'light', content: 'We' },
  { key: 'build', variant: 'accent', content: 'Build' },
  { key: 'arrow', variant: 'dark', content: <ArrowRight className="text-4xl sm:text-5xl" /> },
  { key: 'better', variant: 'ghost', content: 'Better' },
];

function Tile({ variant, children }: { variant: TileVariant; children: ReactNode }) {
  const [hovered, hoverBindings] = useHoverState();
  const style = useSpring({ scale: hovered ? 1.03 : 1, config: SPRING.createTile });

  return (
    <animated.div
      style={style}
      className={`grid h-24 place-items-center rounded-pill text-3xl font-medium sm:h-40 sm:text-4xl ${TILE_CLASS[variant]}`}
      {...hoverBindings}
    >
      {children}
    </animated.div>
  );
}

export function CreateBand() {
  return (
    <section className="bg-background" aria-label="We build better">
      <Shell
        as="ul"
        className="flex flex-col gap-3 px-5 py-10 sm:flex-row sm:gap-4 sm:px-8"
      >
        {TILES.map((tile, index) => (
          <Reveal
            key={tile.key}
            as="li"
            y={28}
            delay={index * STAGGER.createBand}
            config={SPRING.createReveal}
            className="flex-1"
          >
            <Tile variant={tile.variant}>{tile.content}</Tile>
          </Reveal>
        ))}
      </Shell>
    </section>
  );
}
