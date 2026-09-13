import type { SpringConfig } from '@react-spring/web';

/** Public asset bucket for the hero photography. */
export const ASSET_BASE_URL =
  'https://api.getlayers.ai/storage/v1/object/public/public/assets/lumora-e8b711fc68';

/**
 * Hero image mapping. Note the deliberate crossover: the file named
 * `after.jpg` is the always-visible base layer (and the LCP image), while
 * `before.jpg` is the one painted along the cursor trail.
 */
export const HERO_BEFORE_SRC = `${ASSET_BASE_URL}/hero/after.jpg`;
export const HERO_AFTER_SRC = `${ASSET_BASE_URL}/hero/before.jpg`;

/** Breakpoints, mirrored from the Tailwind defaults the layout is authored against. */
export const BREAKPOINT = { sm: 640, md: 768, lg: 1024 } as const;

/** react-spring configs, grouped by the interaction they drive. */
export const SPRING = {
  header: { tension: 210, friction: 26 },
  hover: { tension: 320, friction: 18 },
  navItem: { tension: 320, friction: 22 },
  socialIcon: { tension: 320, friction: 16 },
  partner: { tension: 320, friction: 20 },
  createTile: { tension: 300, friction: 18 },
  serviceRow: { tension: 240, friction: 26 },
  serviceArrow: { tension: 300, friction: 18 },
  portfolioCard: { tension: 260, friction: 22 },
  portfolioBadge: { tension: 280, friction: 18 },
  portfolioReveal: { tension: 180, friction: 26 },
  reveal: { tension: 200, friction: 24 },
  createReveal: { tension: 200, friction: 22 },
  statsPanel: { tension: 180, friction: 26 },
  carousel: { tension: 300, friction: 28 },
  navOverlay: { tension: 280, friction: 32 },
  modal: { tension: 260, friction: 30 },
  watermark: { tension: 120, friction: 30 },
  loaderSlide: { tension: 220, friction: 30 },
  loaderContent: { tension: 260, friction: 26 },
} satisfies Record<string, SpringConfig>;

/** Entrance delays, in ms after the intro loader has finished. */
export const DELAY = {
  header: 150,
  heroEyebrow: 200,
  heroTitle: 250,
  heroWatermark: 300,
  heroCard: 400,
  heroPartners: 550,
  heroRating: 650,
  heroCtas: 750,
  heroStatus: 900,
} as const;

/** Per-index stagger for the repeated sections. */
export const STAGGER = {
  createBand: 120,
  portfolio: 90,
  services: 80,
  stats: 90,
  navMenuItem: 45,
} as const;

/** Intro loader. */
export const LOADER_FILL_MS = 1300;

/** LiquidReveal canvas parameters. */
export const LIQUID = {
  brushRadius: 143,
  decay: 0.016,
  maxDpr: 2,
  fadeFrames: 120,
  idleFadeRamp: 0.004,
  idleFadeCap: 0.5,
  stepRatio: 0.3,
  maxInterpolatedPoints: 60,
} as const;

/** Stats count-up scroll trigger. */
export const COUNT_UP = {
  start: 'top bottom',
  end: 'center center',
  frameInterval: 30,
} as const;
