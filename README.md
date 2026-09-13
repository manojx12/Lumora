# Lumora

Marketing site for **Lumora — Independent Design & Engineering Studio**.

A single-page, light-palette landing site built on a rem-based adaptive grid: near-white
surfaces punctuated by near-black ink cards and one burnt-orange accent. It opens with a
dark intro loader that counts `000 → 100`; the hero is a full-bleed before/after photograph
with a liquid cursor reveal, and every section below animates in on a spring as it scrolls
into view.

## Tech stack

| Concern | Choice |
| --- | --- |
| Build | [Vite 8](https://vite.dev) |
| UI | [React 19](https://react.dev) + TypeScript 5 (strict) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) — CSS-first `@theme` tokens |
| Motion | [`@react-spring/web`](https://react-spring.dev) |
| Text reveals | [`spring-text-engine`](https://www.npmjs.com/package/spring-text-engine) |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering) |
| Unit tests | [Vitest](https://vitest.dev) + Testing Library (happy-dom) |
| End-to-end tests | [Playwright](https://playwright.dev) |
| Linting | ESLint + typescript-eslint + react-hooks |

## Getting started

```bash
npm install
npm run dev          # dev server
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck all projects, then build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `tsc -b` across app, node and e2e projects |
| `npm test` | Vitest unit suite |
| `npm run test:e2e` | Playwright suite (builds and previews automatically) |
| `npm run lint` | ESLint |

> `npm run test:e2e` expects a production build — its `webServer` runs `npm run preview`,
> so run `npm run build` first. The suite is hermetic: external images and fonts are
> stubbed in `tests/e2e/fixtures.ts`, so it passes with no network access.

## Layout

```
src/
  components/
    ui/            Shared primitives — PillButton, Eyebrow, TagChip, Reveal, LineReveal, Shell
    hero/          Hero, LiquidReveal canvas, HeroCard carousel, Partners
    icons.tsx      Inline SVGs, sized in em and inheriting currentColor
    *.tsx          One file per page section, plus the loader and the two overlays
  context/         UI state: the intro gate, nav overlay and request modal
  hooks/           useHoverState, useInView, useClock, useAdaptiveGrid, useEscapeKey…
  lib/             Pure logic: adaptive grid, easings, formatting, cover geometry, scroll
  data/content.ts  All copy and section content
tests/
  unit/            Vitest — pure logic and component behaviour
  e2e/             Playwright — loader, overlays, carousel, count-up, adaptive grid
standalone/        A dependency-free single-file build of the same page
```

## How it fits together

**The adaptive grid.** Every size in the layout is authored in `rem` against a 16px design
base, so scaling the root font size rescales the whole design. Below 1920px the `max-width`
media queries in `src/index.css` drive it (each is `16 * 100 / <design base> vw`); above the
base, `useAdaptiveGrid` interpolates a larger root size so the layout keeps growing on wide
displays. The formula lives in `src/lib/adaptiveGrid.ts` and is covered by unit tests.

**The intro gate.** `PageLoader` locks scrolling on mount, counts to 100 over 1300ms, then
slides away. Only when that exit settles does it set `ready` on the UI context — every
above-the-fold reveal waits on that flag, so the hero animates for an audience rather than
behind the loader.

**The liquid reveal.** The base photograph is a plain `<img>` so the browser can prioritise
it as the LCP element. A second image is stamped onto a canvas along the pointer trail
through a soft radial mask, and the whole trail decays each frame — faster the longer the
pointer rests, then hard-cleared. It honours `prefers-reduced-motion` by not running at all.

**Scroll locking.** A single flag in `src/lib/scroll.ts` gates everything. The loader and
both overlays call `stopScroll()`/`startScroll()`, which pause Lenis and pin `<html>`.

## Notes

- The request modal's submit is **a stub**. It shows a success state after a short delay and
  sends nothing anywhere — there is no backend in this project.
- Hero photography is loaded from a public asset bucket; see `src/lib/constants.ts`. Note
  the deliberate crossover there: the file named `after.jpg` is the always-visible base
  layer, and `before.jpg` is the one painted under the cursor.
- Hover springs are disabled on touch devices, where there is no hover state to leave.
