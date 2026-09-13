import { animated, useTransition } from '@react-spring/web';
import { useEffect, useState } from 'react';
import { LogoMark, XMark } from './icons';
import { Shell } from './ui/Shell';
import { SPRING, STAGGER } from '../lib/constants';
import { NAV_ITEMS, type NavItem } from '../data/content';
import { scrollToId } from '../lib/scroll';
import { useClock } from '../hooks/useClock';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useUI } from '../context/ui-context';

interface NavMenuProps {
  brand?: string;
  navItems?: NavItem[];
  /** Label on the closing call to action. */
  ctaLabel?: string;
}

export function NavMenu({
  brand = 'Lumora',
  navItems = NAV_ITEMS,
  ctaLabel = 'Start a project →',
}: NavMenuProps = {}) {
  const { menuOpen, closeMenu, openModal } = useUI();
  const { time, live } = useClock();

  useEscapeKey(menuOpen, closeMenu);

  const transitions = useTransition(menuOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: SPRING.navOverlay,
  });

  const handleSelect = (item: NavItem) => {
    closeMenu();
    if (item.target === 'contact') openModal();
    else scrollToId(item.target);
  };

  return transitions((style, open) =>
    open ? (
      <animated.div
        style={style}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-testid="nav-menu"
        className="fixed inset-0 z-[115] flex flex-col bg-ink text-white"
      >
        <Shell className="flex items-center justify-between p-5 sm:px-8 sm:py-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <LogoMark className="text-xl text-accent-from" />
            {brand}
          </div>
          <button
            onClick={closeMenu}
            className="inline-flex items-center gap-2 rounded-control border border-white/15 px-4 py-2 text-xs font-medium tracking-[0.05em] text-white/70 uppercase hover:border-white/40 hover:text-white"
          >
            <XMark className="text-sm" />
            Close
          </button>
        </Shell>

        <Shell as="nav" aria-label="Menu" className="flex flex-1 flex-col justify-center px-5 sm:px-8">
          <ul className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              <li key={item.label}>
                <MenuItem item={item} index={index} onSelect={handleSelect} />
              </li>
            ))}
          </ul>
        </Shell>

        <Shell className="flex flex-col gap-3 border-t border-white/10 p-6 px-5 text-xs tracking-[0.025em] text-white/45 uppercase sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Local time{live ? ` — ${time}` : ''}</span>
          <button
            onClick={() => {
              closeMenu();
              openModal();
            }}
            className="text-white/70 hover:text-white hover:underline"
          >
            {ctaLabel}
          </button>
        </Shell>
      </animated.div>
    ) : null,
  );
}

/** Items stagger in after the overlay itself has faded up. */
function MenuItem({
  item,
  index,
  onSelect,
}: {
  item: NavItem;
  index: number;
  onSelect: (item: NavItem) => void;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <button
      onClick={() => onSelect(item)}
      style={{ transitionDelay: `${index * STAGGER.navMenuItem + 80}ms` }}
      className={`group flex w-full items-baseline gap-4 py-2 text-left text-4xl font-semibold tracking-[-0.02em] transition-all duration-500 ease-out sm:text-6xl ${
        entered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <span className="text-base font-normal text-white/30 transition-colors duration-300 group-hover:text-accent-from">
        0{index + 1}
      </span>
      <span className="text-white/70 transition-colors duration-300 group-hover:text-white">
        {item.label}
      </span>
    </button>
  );
}
