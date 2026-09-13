import { useState } from 'react';
import { ProgressTrigger, TextEngine } from 'spring-text-engine';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Reveal } from '../../components/ui/Reveal';
import { Shell } from '../../components/ui/Shell';
import { COUNT_UP, SPRING, STAGGER } from '../../lib/constants';
import { LINE_CONFIG, LINE_IN, LINE_OUT } from '../../lib/textReveal';
import { STATS, type Stat } from '../content';

/**
 * Counts up as the figure scrolls through the viewport: 0 when its top meets
 * the bottom of the screen, the full value once its centre reaches the middle.
 */
function StatValue({ stat }: { stat: Stat }) {
  const [value, setValue] = useState(0);

  return (
    <ProgressTrigger
      tag="p"
      start={COUNT_UP.start}
      end={COUNT_UP.end}
      frameInterval={COUNT_UP.frameInterval}
      onChange={({ progress }) => {
        const next = Math.round(progress * stat.value);
        setValue((current) => (current === next ? current : next));
      }}
      className="tnum text-5xl font-semibold tracking-[-0.02em] sm:text-6xl md:text-7xl"
    >
      <span data-testid="stat-value">{value}</span>
      {stat.suffix}
    </ProgressTrigger>
  );
}

export function Numbers() {
  return (
    <section className="bg-background" aria-label="By the numbers">
      <Shell className="px-5 pb-20 sm:px-8 lg:pb-28">
        <Reveal y={40} scale={0.99} config={SPRING.statsPanel}>
          <div className="rounded-card bg-ink px-6 py-12 text-white sm:p-16 md:px-16">
            <Eyebrow tone="light">By the numbers</Eyebrow>

            <TextEngine
              as="h2"
              mode="once"
              overflow
              delayIn={120}
              lineIn={LINE_IN}
              lineOut={LINE_OUT}
              lineConfig={LINE_CONFIG}
              className="mt-4 max-w-[20ch] text-3xl font-medium tracking-[-0.01em] md:text-4xl"
            >
              A few years of shipping, counted.
            </TextEngine>

            <ul className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
              {STATS.map((stat, index) => (
                <Reveal key={stat.label} as="li" y={20} delay={index * STAGGER.stats}>
                  <StatValue stat={stat} />
                  <p className="mt-3 text-sm text-white/55">{stat.label}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
