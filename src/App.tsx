import { useEffect } from 'react';
import { About } from './components/About';
import { CreateBand } from './components/CreateBand';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { NavMenu } from './components/NavMenu';
import { PageLoader } from './components/PageLoader';
import { Portfolio } from './components/Portfolio';
import { RequestModal } from './components/RequestModal';
import { Services } from './components/Services';
import { Stats } from './components/Stats';
import { Hero } from './components/hero/Hero';
import { UIProvider } from './context/UIProvider';
import { useAdaptiveGrid } from './hooks/useAdaptiveGrid';
import { initScroll } from './lib/scroll';

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

      <PageLoader />
      <Header />

      <main id="main">
        <Hero />
        <About />
        <CreateBand />
        <Portfolio />
        <Services />
        <Stats />
      </main>

      <Footer />
      <NavMenu />
      <RequestModal />
    </UIProvider>
  );
}
