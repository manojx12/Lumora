import { animated, useSpring } from '@react-spring/web';
import { TextEngine } from 'spring-text-engine';
import { ArrowUpRight, LogoMark } from './icons';
import { Eyebrow } from './ui/Eyebrow';
import { LINE_CONFIG, LINE_IN, LINE_OUT } from '../lib/textReveal';
import { Reveal } from './ui/Reveal';
import { Shell } from './ui/Shell';
import { TagChip } from './ui/TagChip';
import { SPRING, STAGGER } from '../lib/constants';
import { PROJECTS, type Project } from '../data/content';
import { useHoverState } from '../hooks/useHoverState';

function ProjectCard({ project }: { project: Project }) {
  const [hovered, hoverBindings] = useHoverState();

  const cardStyle = useSpring({
    y: hovered ? -8 : 0,
    scale: hovered ? 1.012 : 1,
    config: SPRING.portfolioCard,
  });
  // Driven by the card, not the badge — the whole surface is the target.
  const badgeStyle = useSpring({
    rotate: hovered ? 45 : 0,
    scale: hovered ? 1.08 : 1,
    config: SPRING.portfolioBadge,
  });

  return (
    <a href="#works" aria-label={project.name} {...hoverBindings}>
      <animated.article
        style={cardStyle}
        className="relative min-h-88 overflow-hidden rounded-card bg-ink p-6 text-white ring-1 ring-white/5 sm:min-h-104 sm:p-8"
      >
        <div className="relative z-[2] flex items-start justify-between gap-4 text-xs tracking-[0.025em] text-white/45 uppercase">
          <span>
            {project.category} — {project.year}
          </span>
          <animated.span
            style={badgeStyle}
            className="grid size-11 shrink-0 place-items-center rounded-pill bg-white/10 text-base text-white ring-1 ring-white/15"
          >
            <ArrowUpRight />
          </animated.span>
        </div>

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="inline-flex items-start gap-1">
            <LogoMark className="text-7xl text-white/90" />
            <sup className="text-xs text-white/60">®</sup>
          </span>
        </div>

        <div className="absolute inset-x-6 bottom-6 z-[2] sm:inset-x-8 sm:bottom-8">
          <h3 className="text-2xl font-medium tracking-[-0.01em] sm:text-3xl">{project.name}</h3>
          <p className="mt-2 max-w-md text-sm text-white/55">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TagChip key={tag}>{tag}</TagChip>
            ))}
          </div>
        </div>
      </animated.article>
    </a>
  );
}

export function Portfolio() {
  return (
    <section id="works" className="bg-background">
      <Shell className="px-5 pt-10 pb-20 sm:px-8 lg:pb-28">
        <div className="flex flex-col items-center gap-5 text-center">
          <Reveal y={10}>
            <Eyebrow bordered>Portfolio</Eyebrow>
          </Reveal>

          <TextEngine
            as="h2"
            mode="once"
            overflow
            delayIn={120}
            lineIn={LINE_IN}
            lineOut={LINE_OUT}
            lineConfig={LINE_CONFIG}
            className="w-fit text-4xl font-semibold tracking-[-0.02em] sm:text-5xl"
          >
            Selected Work
          </TextEngine>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <Reveal
              key={project.name}
              as="li"
              y={48}
              delay={index * STAGGER.portfolio}
              config={SPRING.portfolioReveal}
            >
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>
      </Shell>
    </section>
  );
}
