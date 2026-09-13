import { animated, useSpring } from '@react-spring/web';
import { GridIcon, LogoMark } from './icons';
import { Shell } from './ui/Shell';
import { DELAY, SPRING } from '../lib/constants';
import { NAV_ITEMS, type NavItem } from '../data/content';
import { scrollToId } from '../lib/scroll';
import { useClock } from '../hooks/useClock';
import { useHoverState } from '../hooks/useHoverState';
import { useUI } from '../context/ui-context';

function NavButton({ item, onSelect }: { item: NavItem; onSelect: (item: NavItem) => void }) {
  const [hovered, hoverBindings] = useHoverState();
  const style = useSpring({
    y: hovered ? -2 : 0,
    opacity: hovered ? 1 : 0.8,
    config: SPRING.navItem,
  });

  return (
    <button
      onClick={() => onSelect(item)}
      aria-current={item.target === 'home' ? 'page' : undefined}
      {...hoverBindings}
    >
      <animated.span style={style} className="inline-flex items-center gap-1">
        {item.label}
        {item.hasDropdown && (
          <span aria-hidden="true" className="text-xs opacity-60">
            ▾
          </span>
        )}
      </animated.span>
    </button>
  );
}

interface HeaderProps {
  brand?: string;
  navItems?: NavItem[];
}

export function Header({ brand = 'Lumora', navItems = NAV_ITEMS }: HeaderProps = {}) {
  const { ready, openMenu, openModal } = useUI();
  const { time, date } = useClock();
  const [brandHovered, brandBindings] = useHoverState();
  const [menuHovered, menuBindings] = useHoverState();

  const headerStyle = useSpring({
    opacity: ready ? 1 : 0,
    y: ready ? 0 : -14,
    delay: DELAY.header,
    config: SPRING.header,
  });
  const brandStyle = useSpring({ scale: brandHovered ? 1.04 : 1, config: SPRING.hover });
  const menuStyle = useSpring({ scale: menuHovered ? 1.05 : 1, config: SPRING.hover });

  const handleSelect = (item: NavItem) => {
    if (item.target === 'contact') openModal();
    else scrollToId(item.target);
  };

  return (
    <animated.header style={headerStyle} className="absolute inset-x-0 top-0 z-50">
      <Shell className="flex items-center justify-between gap-6 p-5 sm:px-8 sm:py-6">
        <button onClick={() => scrollToId('home')} aria-label={`${brand} — back to top`} {...brandBindings}>
          <animated.span
            style={brandStyle}
            className="flex items-center gap-2 text-lg font-semibold tracking-[-0.01em]"
          >
            <LogoMark className="text-xl text-accent" />
            {brand}
          </animated.span>
        </button>

        <nav aria-label="Primary" className="hidden lg:flex">
          <ul className="flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavButton item={item} onSelect={handleSelect} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-control border border-line/80 bg-white/40 px-3 py-2 text-xs text-foreground/70 backdrop-blur-sm md:flex">
            <span className="text-foreground/45">Local time</span>
            <span data-testid="clock-time" className="tnum min-w-14 font-medium text-foreground">
              {time}
            </span>
            <span aria-hidden="true" className="text-foreground/30">
              •
            </span>
            <span data-testid="clock-date" className="font-medium">
              {date}
            </span>
          </div>

          <button
            onClick={openMenu}
            aria-haspopup="dialog"
            /* The label is hidden below sm, so name the button explicitly —
               otherwise it is an icon-only control with no accessible name. */
            aria-label="Menu"
            className="overflow-hidden rounded-control border border-line/80 bg-white/40 backdrop-blur-sm hover:bg-white/70"
            {...menuBindings}
          >
            <animated.span
              style={menuStyle}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-[0.05em] uppercase"
            >
              <GridIcon className="text-sm" />
              <span className="hidden sm:inline">Menu</span>
            </animated.span>
          </button>
        </div>
      </Shell>
    </animated.header>
  );
}
