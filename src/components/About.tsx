import { animated, useSpring } from '@react-spring/web';
import { TextEngine } from 'spring-text-engine';
import type { ReactNode } from 'react';
import { CircleDot, Globe, XMark } from './icons';
import { Eyebrow } from './ui/Eyebrow';
import { WORD_CONFIG, WORD_IN, WORD_OUT } from '../lib/textReveal';
import { PillButton } from './ui/PillButton';
import { Reveal } from './ui/Reveal';
import { Shell } from './ui/Shell';
import { SPRING } from '../lib/constants';
import { useHoverState } from '../hooks/useHoverState';

function SocialChip({
  children,
  href,
  label,
  accent = false,
}: {
  children: ReactNode;
  href: string;
  label: string;
  accent?: boolean;
}) {
  const [hovered, hoverBindings] = useHoverState();
  const style = useSpring({ scale: hovered ? 1.18 : 1, config: SPRING.socialIcon });

  return (
    <a
      href={href}
      aria-label={label}
      className={`grid size-9 place-items-center rounded-pill text-sm ${
        accent ? 'bg-accent text-white' : 'bg-surface text-foreground/70'
      }`}
      {...hoverBindings}
    >
      <animated.span style={style} className="inline-block">
        {children}
      </animated.span>
    </a>
  );
}

export function About() {
  return (
    <section id="about" className="bg-background">
      <Shell className="grid grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <div className="relative min-h-56 lg:min-h-80">
          <Globe
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -left-4 -translate-y-1/2 text-[12rem] text-foreground/10 sm:text-[16rem] lg:-left-6 lg:text-[20rem]"
          />
          <Eyebrow className="relative">The Studio</Eyebrow>

          <Reveal y={12} className="absolute bottom-0 left-0">
            <div className="flex items-center gap-3 text-sm text-foreground/70">
              <Globe aria-hidden="true" className="shrink-0 text-2xl text-foreground" />
              <span className="block max-w-56">
                A distributed team building across every time zone.
              </span>
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col gap-10">
          <TextEngine
            as="h2"
            mode="once"
            wordStagger={35}
            wordIn={WORD_IN}
            wordOut={WORD_OUT}
            wordConfig={WORD_CONFIG}
            className="text-2xl leading-[1.35] font-medium tracking-[-0.01em] sm:text-3xl"
          >
            We partner with ambitious teams to ship{' '}
            <span className="text-muted">
              digital products, brand systems, and the strategy that holds them together.
            </span>
          </TextEngine>

          <Reveal y={12} delay={200}>
            <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
              <div>
                <p className="text-sm text-foreground/45">Find us online</p>
                <div className="mt-3 flex gap-2">
                  <SocialChip href="#x" label="X / Twitter" accent>
                    <XMark />
                  </SocialChip>
                  <SocialChip href="#behance" label="Behance">
                    <CircleDot />
                  </SocialChip>
                  <SocialChip href="#dribbble" label="Dribbble">
                    <CircleDot />
                  </SocialChip>
                </div>
              </div>

              <PillButton variant="outline" withArrow href="#about">
                About Us
              </PillButton>
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
