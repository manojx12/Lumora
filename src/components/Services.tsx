import { animated, useSpring } from '@react-spring/web';
import { TextEngine } from 'spring-text-engine';
import { ArrowUpRight } from './icons';
import { Eyebrow } from './ui/Eyebrow';
import { LINE_CONFIG, LINE_IN, LINE_OUT } from '../lib/textReveal';
import { Reveal } from './ui/Reveal';
import { Shell } from './ui/Shell';
import { SPRING, STAGGER } from '../lib/constants';
import { SERVICES, type Service } from '../data/content';
import { useHoverState } from '../hooks/useHoverState';

function ServiceRow({ service }: { service: Service }) {
  const [hovered, hoverBindings] = useHoverState();

  // The row fills and shifts its padding, pulling the content right as the
  // surface arrives behind it.
  const rowStyle = useSpring({
    backgroundColor: hovered ? 'rgba(241,240,238,1)' : 'rgba(241,240,238,0)',
    paddingLeft: hovered ? '2rem' : '1.5rem',
    paddingRight: hovered ? '1.25rem' : '1.5rem',
    config: SPRING.serviceRow,
  });
  const arrowStyle = useSpring({ x: hovered ? 5 : 0, config: SPRING.serviceArrow });

  return (
    <a href="#services" aria-label={service.title} {...hoverBindings}>
      <animated.div
        style={rowStyle}
        className="flex items-center gap-4 rounded-card-sm py-6 sm:gap-6 sm:py-8"
      >
        <span className="w-7 shrink-0 text-sm font-medium text-foreground/40 sm:w-10">
          {service.index}
        </span>
        <h3 className="flex-1 text-2xl font-medium tracking-[-0.01em] sm:text-3xl md:text-4xl">
          {service.title}
        </h3>
        <p className="hidden max-w-80 text-sm text-foreground/55 lg:block">{service.description}</p>
        <animated.span
          style={arrowStyle}
          className="grid size-10 shrink-0 place-items-center rounded-pill bg-ink text-base text-white sm:size-12"
        >
          <ArrowUpRight />
        </animated.span>
      </animated.div>
    </a>
  );
}

export function Services() {
  return (
    <section id="services" className="bg-background">
      <Shell className="px-5 py-20 sm:px-8 lg:py-28">
        <Reveal y={10}>
          <Eyebrow>Services</Eyebrow>
        </Reveal>

        <TextEngine
          as="h2"
          mode="once"
          overflow
          delayIn={120}
          lineIn={LINE_IN}
          lineOut={LINE_OUT}
          lineConfig={LINE_CONFIG}
          className="mt-5 mb-12 max-w-[16ch] text-4xl font-semibold tracking-[-0.02em] sm:mb-14 sm:text-5xl"
        >
          What we do best
        </TextEngine>

        <ul>
          {SERVICES.map((service, index) => (
            <Reveal
              key={service.index}
              as="li"
              y={24}
              delay={index * STAGGER.services}
              className="border-t border-line first:border-t-0"
            >
              <ServiceRow service={service} />
            </Reveal>
          ))}
        </ul>
      </Shell>
    </section>
  );
}
