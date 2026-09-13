import { TextEngine } from 'spring-text-engine';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Reveal } from '../../components/ui/Reveal';
import { Shell } from '../../components/ui/Shell';
import { STAGGER } from '../../lib/constants';
import { LINE_CONFIG, LINE_IN, LINE_OUT } from '../../lib/textReveal';
import { EXPERIENCE } from '../content';

/** A plain chronological list — the one section that stays quiet by design. */
export function Experience() {
  return (
    <section id="experience" className="bg-background">
      <Shell className="px-5 pb-20 sm:px-8 lg:pb-28">
        <Reveal y={10}>
          <Eyebrow>Experience</Eyebrow>
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
          Where I have worked
        </TextEngine>

        <ul>
          {EXPERIENCE.map((role, index) => (
            <Reveal
              key={`${role.company}-${role.period}`}
              as="li"
              y={24}
              delay={index * STAGGER.services}
              className="border-t border-line first:border-t-0"
            >
              <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:py-8">
                <span className="w-full shrink-0 text-sm font-medium text-foreground/40 sm:w-44">
                  {role.period}
                </span>
                <div className="flex-1">
                  <h3 className="text-2xl font-medium tracking-[-0.01em] sm:text-3xl">
                    {role.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent">{role.company}</p>
                  <p className="mt-3 max-w-xl text-sm text-foreground/55">{role.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Shell>
    </section>
  );
}
