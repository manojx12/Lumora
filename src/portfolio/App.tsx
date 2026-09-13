import { useEffect } from 'react';
import { Header } from '../components/Header';
import { NavMenu } from '../components/NavMenu';
import { PageLoader } from '../components/PageLoader';
import { RequestModal } from '../components/RequestModal';
import { UIProvider } from '../context/UIProvider';
import { useAdaptiveGrid } from '../hooks/useAdaptiveGrid';
import type { RequestModalCopy } from '../lib/requestCopy';
import { initScroll } from '../lib/scroll';
import { About } from './components/About';
import { Capabilities } from './components/Capabilities';
import { CraftBand } from './components/CraftBand';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Numbers } from './components/Numbers';
import { PortraitHero } from './components/PortraitHero';
import { Work } from './components/Work';
import { NAV_ITEMS, PERSON } from './content';

const CONTACT_COPY: RequestModalCopy = {
  kicker: 'Get in touch',
  heading: 'Tell me what you have in mind.',
  projectLabel: 'Message',
  projectPlaceholder: 'A few words about the role or project, and your timeline.',
  note: 'I reply within one business day.',
  submitLabel: 'Send message',
  successTitle: 'Message received',
  successBody: "Thanks for reaching out — I'll get back to you within one business day.",
};

export default function App() {
  useAdaptiveGrid();

  useEffect(() => initScroll(), []);

  return (
    <UIProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-control focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <PageLoader brand={PERSON.name} tagline={PERSON.loaderTagline} />
      <Header brand={PERSON.name} navItems={NAV_ITEMS} />

      <main id="main">
        <PortraitHero />
        <About />
        <CraftBand />
        <Work />
        <Capabilities />
        <Experience />
        <Numbers />
      </main>

      <Footer />
      <NavMenu brand={PERSON.name} navItems={NAV_ITEMS} ctaLabel="Get in touch →" />
      <RequestModal copy={CONTACT_COPY} />
    </UIProvider>
  );
}
