/**
 * ============================================================================
 *  EDIT THIS FILE — it holds every word and link on the site.
 *  Nothing else needs touching to make the site yours.
 * ============================================================================
 *
 * `role` and the copy below are a starting point, not a decision — change them
 * to match how you actually describe your work.
 */

import type { NavItem } from '../data/content';

export const PERSON = {
  name: 'Manoj Dev',
  /** The giant hero and footer watermark. Keep it short — it renders at 13rem. */
  shortName: 'MANOJ DEV',
  role: 'Product Designer & Front-End Engineer',
  location: 'Pune, India — working worldwide',
  availability: 'Available for new work',
  email: 'manojbansodeofficial@gmail.com',
  /** Three lines, broken exactly where you want them. */
  headline: ['Design that ships.', 'Code that lasts.', 'Work that earns trust.'],
  loaderTagline: 'Designing and building considered digital products.',
  /** Word-by-word reveal in the About section. The tail renders muted. */
  statement: {
    lead: 'I design and build digital products end to end — ',
    tail: 'interfaces people understand, front-ends that hold up, and the small details that make a product feel considered.',
  },
  note: 'Working remotely, collaborating across time zones.',
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', target: 'home' },
  { label: 'Work', target: 'work' },
  { label: 'About', target: 'about' },
  { label: 'Experience', target: 'experience' },
  { label: 'Contact', target: 'contact' },
];

/** Rotating highlight card in the hero. */
export const HIGHLIGHTS = [
  { caption: 'Product design', title: 'Interfaces that explain themselves.' },
  { caption: 'Front-end', title: 'Built to hold up in production.' },
  { caption: 'Design systems', title: 'Consistent at any scale.' },
];

/** Tools row under the hero card. */
export const TOOLKIT = [
  'TypeScript',
  'React',
  'Next.js',
  'Tailwind',
  'Figma',
  'Node',
  'Postgres',
] as const;

export interface Project {
  name: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  href: string;
}

export const PROJECTS: Project[] = [
  {
    name: 'Atlas Dashboard',
    category: 'Product Design',
    year: '2025',
    description:
      'An analytics workspace rebuilt around one question: what does the user need to decide next?',
    tags: ['Product Design', 'React', 'Design System'],
    href: '#work',
  },
  {
    name: 'Ferry Booking',
    category: 'Front-End',
    year: '2024',
    description:
      'A booking flow cut from nine steps to four, with a checkout that survives poor connections.',
    tags: ['Next.js', 'UX', 'Payments'],
    href: '#work',
  },
  {
    name: 'Meridian Design System',
    category: 'Design Systems',
    year: '2024',
    description:
      'Tokens, components and documentation adopted by four product teams in a single quarter.',
    tags: ['Tokens', 'Storybook', 'Docs'],
    href: '#work',
  },
  {
    name: 'Field Notes',
    category: 'Side Project',
    year: '2023',
    description:
      'An offline-first notes app for site surveys — local-first sync, and no spinner in sight.',
    tags: ['TypeScript', 'IndexedDB', 'PWA'],
    href: '#work',
  },
];

export interface Capability {
  index: string;
  title: string;
  description: string;
}

export const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'Product Design',
    description: 'Flows, wireframes and interfaces grounded in how people actually work.',
  },
  {
    index: '02',
    title: 'Front-End Engineering',
    description: 'React and TypeScript, accessible and fast by default.',
  },
  {
    index: '03',
    title: 'Design Systems',
    description: 'Tokens and components that keep a growing product coherent.',
  },
  {
    index: '04',
    title: 'Prototyping',
    description: 'Working prototypes that answer a question before the build starts.',
  },
];

export interface Role {
  period: string;
  title: string;
  company: string;
  description: string;
}

export const EXPERIENCE: Role[] = [
  {
    period: '2023 — Present',
    title: 'Senior Product Designer',
    company: 'Independent',
    description: 'Design and front-end for startups shipping their first real product.',
  },
  {
    period: '2021 — 2023',
    title: 'Product Designer',
    company: 'Northpeak',
    description: 'Owned the design system and the core analytics experience.',
  },
  {
    period: '2019 — 2021',
    title: 'Front-End Developer',
    company: 'Vellum Studio',
    description: 'Built marketing sites and web apps for agency clients.',
  },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: 40, suffix: '+', label: 'Projects shipped' },
  { value: 6, suffix: '', label: 'Years designing' },
  { value: 18, suffix: '', label: 'Teams supported' },
  { value: 4, suffix: '', label: 'Design systems built' },
];

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/manojx12' },
  { label: 'LinkedIn', href: '#linkedin' },
  { label: 'X / Twitter', href: '#x' },
  { label: 'Dribbble', href: '#dribbble' },
];

export const FOOTER_LINKS = [
  {
    title: 'Site',
    links: [
      { label: 'Work', href: '#work' },
      { label: 'About', href: '#about' },
      { label: 'Experience', href: '#experience' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Elsewhere',
    links: SOCIALS,
  },
];

/**
 * Hero portrait pair. See docs/hero-image-prompts.md before replacing these.
 *
 * Paths go through BASE_URL so the site works when it is served from a
 * sub-path or a relative base, not just from a domain root.
 */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const PORTRAIT = {
  /** Always visible, and the page's LCP image. */
  base: asset('portrait/base.png'),
  /** Painted in under the cursor — must share the base's exact framing. */
  reveal: asset('portrait/reveal.png'),
} as const;
