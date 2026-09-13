import { Star } from '../../components/icons';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { LineReveal } from '../../components/ui/LineReveal';
import { PillButton } from '../../components/ui/PillButton';
import { Reveal } from '../../components/ui/Reveal';
import { Shell } from '../../components/ui/Shell';
import { LiquidReveal } from '../../components/hero/LiquidReveal';
import { DELAY, SPRING } from '../../lib/constants';
import { scrollToId } from '../../lib/scroll';
import { useUI } from '../../context/ui-context';
import { HIGHLIGHTS, PERSON, PORTRAIT } from '../content';
import { HighlightCard } from './HighlightCard';
import { Toolkit } from './Toolkit';

export function PortraitHero() {
  const { ready, openModal } = useUI();

  return (
    <section id="home" className="relative isolate overflow-hidden rounded-b-card bg-hero-to">
      <LiquidReveal
        beforeSrc={PORTRAIT.base}
        afterSrc={PORTRAIT.reveal}
        className="absolute inset-0 z-0"
      />

      {/* Keeps the headline legible over any part of the portrait. */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/35 via-transparent to-white/35" />

      <Reveal
        y={20}
        toOpacity={0.4}
        delay={DELAY.heroWatermark}
        config={SPRING.watermark}
        gateOnReady
        className="pointer-events-none absolute inset-x-0 bottom-28 z-[1] text-center text-watermark leading-none font-bold text-white/40 select-none"
      >
        {PERSON.shortName}
      </Reveal>

      <Shell className="relative z-20 flex flex-col gap-8 px-5 pt-28 pb-20 sm:px-8 lg:grid lg:min-h-[100lvh] lg:grid-cols-12 lg:content-center lg:gap-10 lg:px-8 lg:pt-36 lg:pb-28">
        <div className="flex flex-col gap-7 lg:col-span-7 lg:justify-center">
          <Reveal y={10} delay={DELAY.heroEyebrow} config={SPRING.header} gateOnReady>
            <Eyebrow>{PERSON.role}</Eyebrow>
          </Reveal>

          <LineReveal
            as="h1"
            lines={[...PERSON.headline]}
            enabled={ready}
            delay={DELAY.heroTitle}
            lineStagger={120}
            className="max-w-[18ch] text-4xl leading-[0.98] font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl"
          />

          <Reveal y={10} delay={DELAY.heroRating} config={SPRING.header} gateOnReady>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex items-center gap-0.5 text-base text-accent"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} />
                ))}
              </span>
              <span className="text-sm font-medium text-foreground/70">{PERSON.availability}</span>
            </div>
          </Reveal>

          <Reveal y={10} delay={DELAY.heroCtas} config={SPRING.header} gateOnReady>
            <div className="flex flex-wrap gap-3">
              <PillButton variant="dark" withArrow onClick={openModal}>
                Get in touch
              </PillButton>
              <PillButton variant="outline" onClick={() => scrollToId('work')}>
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
            <HighlightCard items={HIGHLIGHTS} />
          </Reveal>

          <Reveal
            y={14}
            delay={DELAY.heroPartners}
            gateOnReady
            className="w-full lg:flex lg:justify-end"
          >
            <Toolkit />
          </Reveal>
        </div>
      </Shell>

      <Reveal delay={DELAY.heroStatus} config={SPRING.header} gateOnReady className="relative z-20">
        <Shell className="flex items-center justify-between gap-3 border-t border-foreground/10 p-5 text-xs font-medium tracking-[0.025em] text-foreground/60 uppercase sm:px-8">
          <span>{PERSON.location}</span>
          <span className="hidden sm:inline">{PERSON.availability}</span>
          <span className="inline-flex items-center gap-2">
            Scroll to explore <span aria-hidden="true">↓</span>
          </span>
        </Shell>
      </Reveal>
    </section>
  );
}
