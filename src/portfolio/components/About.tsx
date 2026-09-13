import { animated, useSpring } from '@react-spring/web';
import { TextEngine } from 'spring-text-engine';
import { Globe } from '../../components/icons';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { PillButton } from '../../components/ui/PillButton';
import { Reveal } from '../../components/ui/Reveal';
import { Shell } from '../../components/ui/Shell';
import { SPRING } from '../../lib/constants';
import { WORD_CONFIG, WORD_IN, WORD_OUT } from '../../lib/textReveal';
import { useHoverState } from '../../hooks/useHoverState';
import { useUI } from '../../context/ui-context';
import { PERSON, SOCIALS } from '../content';

function SocialChip({ label, href, accent }: { label: string; href: string; accent: boolean }) {
  const [hovered, hoverBindings] = useHoverState();
  const style = useSpring({ scale: hovered ? 1.08 : 1, config: SPRING.socialIcon });

  return (
    <a
      href={href}
      className={`rounded-pill px-4 py-2 text-xs font-medium ${
        accent ? 'bg-accent text-white' : 'bg-surface text-foreground/70'
      }`}
      {...hoverBindings}
    >
      <animated.span style={style} className="inline-block">
        {label}
      </animated.span>
    </a>
  );
}

export function About() {
  const { openModal } = useUI();

  return (
    <section id="about" className="bg-background">
      <Shell className="grid grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <div className="relative min-h-56 lg:min-h-80">
          <Globe
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -left-4 -translate-y-1/2 text-[12rem] text-foreground/10 sm:text-[16rem] lg:-left-6 lg:text-[20rem]"
          />
          <Eyebrow className="relative">About</Eyebrow>

          <Reveal y={12} className="absolute bottom-0 left-0">
            <div className="flex items-center gap-3 text-sm text-foreground/70">
              <Globe aria-hidden="true" className="shrink-0 text-2xl text-foreground" />
              <span className="block max-w-56">{PERSON.note}</span>
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
            {PERSON.statement.lead}
            <span className="text-muted">{PERSON.statement.tail}</span>
          </TextEngine>

          <Reveal y={12} delay={200}>
            <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
              <div>
                <p className="text-sm text-foreground/45">Find me online</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SOCIALS.map((social, index) => (
                    <SocialChip
                      key={social.label}
                      label={social.label}
                      href={social.href}
                      accent={index === 0}
                    />
                  ))}
                </div>
              </div>

              <PillButton variant="outline" withArrow onClick={openModal}>
                Work with me
              </PillButton>
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
