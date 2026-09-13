export interface NavItem {
  label: string;
  /** Section id, or `contact` which opens the request modal. */
  target: string;
  hasDropdown?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', target: 'home' },
  { label: 'Work', target: 'works' },
  { label: 'Services', target: 'services', hasDropdown: true },
  { label: 'Studio', target: 'about' },
  { label: 'Careers', target: 'careers' },
  { label: 'Contact', target: 'contact' },
];

export const PARTNERS = [
  'Kaido',
  'Northpeak',
  'Vellum',
  'Orbit',
  'Brightline',
  'Cobalt',
  'Mesa',
] as const;

export interface HeroCardItem {
  caption: string;
  title: string;
}

export const HERO_CARD_ITEMS: HeroCardItem[] = [
  { caption: 'Conversion design', title: 'Crafted to convert.' },
  { caption: 'Engineering', title: 'Built to scale.' },
  { caption: 'Brand systems', title: 'Designed to last.' },
];

export interface Project {
  name: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
}

export const PROJECTS: Project[] = [
  {
    name: 'Aster Labs',
    category: 'Branding',
    year: '2025',
    description:
      'A complete identity and go-to-market system for a fast-moving research startup.',
    tags: ['Branding', 'Strategy', 'Design'],
  },
  {
    name: 'Nova Finance',
    category: 'Product',
    year: '2024',
    description:
      'A finance platform reimagined — clear data, calm interfaces, and effortless flows.',
    tags: ['Product Design', 'Web App', 'QA'],
  },
  {
    name: 'Helio Studio',
    category: 'Identity',
    year: '2023',
    description:
      'A bold visual identity and art direction system built to scale across every surface.',
    tags: ['Brand Identity', 'Art Direction'],
  },
  {
    name: 'Pulse Health',
    category: 'Mobile',
    year: '2023',
    description:
      'A wellness app grounded in research, shipped end to end from concept to release.',
    tags: ['Mobile App', 'UX Research', 'Development'],
  },
];

export interface Service {
  index: string;
  title: string;
  description: string;
}

export const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Software Development',
    description: 'Scalable web & mobile products built to last.',
  },
  {
    index: '02',
    title: 'Product Design',
    description: 'Interfaces that feel effortless and look sharp.',
  },
  {
    index: '03',
    title: 'Quality Assurance',
    description: 'Rigorous testing for flawless, confident releases.',
  },
  {
    index: '04',
    title: 'Consulting',
    description: 'Strategy and direction for ambitious teams.',
  },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: 150, suffix: '+', label: 'Projects delivered' },
  { value: 98, suffix: '%', label: 'Client retention' },
  { value: 12, suffix: '', label: 'Years of craft' },
  { value: 40, suffix: '+', label: 'Team members' },
];

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Partners', href: '#partners' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Development', href: '#development' },
      { label: 'Design', href: '#design' },
      { label: 'Quality Assurance', href: '#qa' },
      { label: 'Consulting', href: '#consulting' },
    ],
  },
  {
    title: 'Social',
    links: [
      { label: 'X / Twitter', href: '#x' },
      { label: 'Behance', href: '#behance' },
      { label: 'Dribbble', href: '#dribbble' },
      { label: 'LinkedIn', href: '#linkedin' },
    ],
  },
];
