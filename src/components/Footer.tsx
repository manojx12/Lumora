import { TextEngine } from 'spring-text-engine';
import { LogoMark } from './icons';
import { AnimatedLink } from './ui/AnimatedLink';
import { LINE_CONFIG, LINE_IN, LINE_OUT } from '../lib/textReveal';
import { PillButton } from './ui/PillButton';
import { Shell } from './ui/Shell';
import { FOOTER_COLUMNS } from '../data/content';
import { useUI } from '../context/ui-context';

export function Footer() {
  const { openModal } = useUI();

  return (
    <footer className="relative overflow-hidden rounded-t-card bg-ink text-white">
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
            Have a project in mind? Let&apos;s get to work.
          </TextEngine>

          <div>
            <PillButton variant="light" withArrow arrow="up-right" onClick={openModal}>
              Start a project
            </PillButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <LogoMark className="text-xl" />
              Lumora
            </div>
            <p className="mt-4 max-w-80 text-sm text-white/55">
              An independent studio crafting brands, products, and the systems that connect them.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
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
          <span>© 2025 Lumora Studio. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <AnimatedLink href="#privacy" subtle>
              Privacy
            </AnimatedLink>
            <AnimatedLink href="#terms" subtle>
              Terms
            </AnimatedLink>
          </div>
        </div>
      </Shell>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-6 z-0 text-center text-watermark leading-none font-bold text-white/5 select-none"
      >
        LUMORA
      </div>
    </footer>
  );
}
