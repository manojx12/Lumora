import { TextEngine } from 'spring-text-engine';
import { LogoMark } from '../../components/icons';
import { AnimatedLink } from '../../components/ui/AnimatedLink';
import { PillButton } from '../../components/ui/PillButton';
import { Shell } from '../../components/ui/Shell';
import { LINE_CONFIG, LINE_IN, LINE_OUT } from '../../lib/textReveal';
import { useUI } from '../../context/ui-context';
import { FOOTER_LINKS, PERSON } from '../content';

export function Footer() {
  const { openModal } = useUI();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden rounded-t-card bg-ink text-white">
      <Shell className="relative z-10 px-5 pt-20 pb-10 sm:px-8 lg:pt-24">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-16 lg:flex-row lg:items-end lg:justify-between">
          <TextEngine
            as="h2"
            mode="once"
            overflow
            lineStagger={100}
            lineIn={LINE_IN}
            lineOut={LINE_OUT}
            lineConfig={LINE_CONFIG}
            className="max-w-[16ch] text-4xl font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl"
          >
            Have something in mind? Let&apos;s talk.
          </TextEngine>

          <div>
            <PillButton variant="light" withArrow arrow="up-right" onClick={openModal}>
              Get in touch
            </PillButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <LogoMark className="text-xl" />
              {PERSON.name}
            </div>
            <p className="mt-4 max-w-80 text-sm text-white/55">{PERSON.role}</p>
            <a
              href={`mailto:${PERSON.email}`}
              className="mt-4 inline-block text-sm text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              {PERSON.email}
            </a>
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <p className="text-xs tracking-[0.025em] text-white/40 uppercase">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <AnimatedLink href={link.href}>{link.label}</AnimatedLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row">
          <span>
            © {year} {PERSON.name}. All rights reserved.
          </span>
          <span>{PERSON.location}</span>
        </div>
      </Shell>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-6 z-0 text-center text-watermark leading-none font-bold text-white/5 select-none"
      >
        {PERSON.shortName}
      </div>
    </footer>
  );
}
