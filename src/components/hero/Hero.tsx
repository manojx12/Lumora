import { HeroCard } from './HeroCard';
import { LiquidReveal } from './LiquidReveal';
import { Partners } from './Partners';
import { Star } from '../icons';
import { Eyebrow } from '../ui/Eyebrow';
import { PillButton } from '../ui/PillButton';
import { LineReveal } from '../ui/LineReveal';
import { Reveal } from '../ui/Reveal';
import { Shell } from '../ui/Shell';
import { DELAY, HERO_AFTER_SRC, HERO_BEFORE_SRC, SPRING } from '../../lib/constants';
import { scrollToId } from '../../lib/scroll';
import { useUI } from '../../context/ui-context';

const TITLE_LINES = ['Bold ideas,', 'shipped with', 'quiet precision'];

export function Hero() {
  const { ready, openModal } = useUI();

  return (
    <section id="home" className="relative isolate overflow-hidden rounded-b-card bg-hero-to">
      <LiquidReveal
        beforeSrc={HERO_BEFORE_SRC}
        afterSrc={HERO_AFTER_SRC}
        className="absolute inset-0 z-0"
      />

      {/* Keeps the headline and status bar legible over any part of the photo. */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/35 via-transparent to-white/35" />

      <Reveal
        y={20}
        toOpacity={0.4}
        delay={DELAY.heroWatermark}
        config={SPRING.watermark}
        gateOnReady
        className="pointer-events-none absolute inset-x-0 bottom-28 z-[1] text-center text-watermark leading-none font-bold whitespace-nowrap text-white/40 select-none"
      >
        LUMORA
      </Reveal>

      <Shell className="relative z-20 flex flex-col gap-8 px-5 pt-28 pb-20 sm:px-8 lg:grid lg:min-h-[100lvh] lg:grid-cols-12 lg:content-center lg:gap-10 lg:px-8 lg:pt-36 lg:pb-28">
        <div className="flex flex-col gap-7 lg:col-span-7 lg:justify-center">
          <Reveal y={10} delay={DELAY.heroEyebrow} config={SPRING.header} gateOnReady>
            <Eyebrow>Independent Studio</Eyebrow>
          </Reveal>

          <LineReveal
            as="h1"
            lines={TITLE_LINES}
            enabled={ready}
            delay={DELAY.heroTitle}
            lineStagger={120}
            className="max-w-[18ch] text-4xl leading-[0.98] font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl"
          />

          <Reveal y={10} delay={DELAY.heroRating} config={SPRING.header} gateOnReady>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="inline-flex items-center gap-0.5 text-base text-accent">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} />
                ))}
              </span>
              <span className="text-sm font-medium text-foreground/70">200+ brands shipped</span>
            </div>
          </Reveal>

          <Reveal y={10} delay={DELAY.heroCtas} config={SPRING.header} gateOnReady>
            <div className="flex flex-wrap gap-3">
              <PillButton variant="dark" withArrow onClick={openModal}>
                Let&apos;s Talk
              </PillButton>
              <PillButton variant="outline" onClick={() => scrollToId('works')}>
                View Work
              </PillButton>
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col items-start gap-8 lg:col-span-5 lg:items-end lg:justify-center">
          <Reveal
            y={16}
            scale={0.96}
            delay={DELAY.heroCard}
            gateOnReady
            className="w-full lg:flex lg:justify-end"
          >
            <HeroCard />
          </Reveal>

          <Reveal
            y={14}
            delay={DELAY.heroPartners}
            gateOnReady
            className="w-full lg:flex lg:justify-end"
          >
            <Partners />
          </Reveal>
        </div>
      </Shell>

      <Reveal delay={DELAY.heroStatus} config={SPRING.header} gateOnReady className="relative z-20">
        <Shell className="flex items-center justify-between gap-3 border-t border-foreground/10 p-5 text-xs font-medium tracking-[0.025em] text-foreground/60 uppercase sm:px-8">
          <span>Working since 2014</span>
          <span className="hidden sm:inline">Remote-first, worldwide</span>
          <span className="inline-flex items-center gap-2">
            Scroll to explore <span aria-hidden="true">↓</span>
          </span>
        </Shell>
      </Reveal>
    </section>
  );
}
