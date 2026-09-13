# MAISON VELOR — Phase 0: Reference & Project Audit

**Status:** Complete — awaiting Gate 0 approval
**Date:** 2026-09-13
**Branch:** `claude/compassionate-cannon-nx3443`
**Author:** Claude (Phase 0 audit, no application code written)

---

## 0. Evidence provenance — read this first

This audit separates what is **evidence** from what is **inference**. The distinction
matters because the primary source document is not present in this session.

### 0.1 What I was able to inspect

| Source | Available? | Notes |
| --- | --- | --- |
| Existing repository (`manojx12/Lumora`) | ✅ Yes | Fully inspected — see §1 |
| Reference-analysis PDF ("Reverse-engineering specification · reference analysis") | ❌ **Not present** | No PDF, no attachment, nothing on disk anywhere under `/home`, `/tmp` or `/mnt` |
| Reference screenshot(s) of Obsidian Assembly | ❌ **Not present** | Only files on disk are `public/portrait/{base,reveal}.png`, the project's own placeholders |
| Live Obsidian Assembly website | ❌ **Blocked** | Network egress proxy blocks `theobsidianassembly.com`, `obsidianassembly.com`, `awwwards.com`, `landing.love` |
| `CLAUDE.md` | ❌ Does not exist | Not in this repo or anywhere on the filesystem |
| `DESIGN.md` | ❌ Does not exist | — |
| `awesome-design.md` | ❌ Does not exist | — |
| Project `README.md` | ✅ Yes | Thorough; effectively the current design-system documentation |
| `docs/hero-image-prompts.md` | ✅ Yes | The only pre-existing doc |

### 0.2 What I did confirm about the reference brand

A web search confirms **The Obsidian Assembly** exists and is a recognised
site — it was an Awwwards Site of the Day in April 2026 — but every page
describing it (Awwwards, landing.love) and the site itself are blocked by this
session's egress policy. I could not open a single pixel of it.

Sources (titles/URLs returned by search; pages themselves unreachable from here):
- [The Obsidian Assembly — Awwwards SOTD](https://www.awwwards.com/sites/the-obsidian-assembly)
- [The Obsidian Assembly — landing.love](https://www.landing.love/sites/obsidianassembly/)

### 0.3 Therefore: the brief itself is the reference evidence

Your build prompt quotes measured findings from the PDF directly. Those quotes are
the **only** reference evidence I hold. They are reproduced verbatim in §2 and
labelled **RELAYED** — meaning: stated as measured in your brief, not independently
verified by me.

**I have invented no reference behaviour.** Anything in this document not traceable
to your brief or to the repository is labelled inference and marked as such.

### 0.4 Confidence key

| Label | Meaning |
| --- | --- |
| **RELAYED** | Quoted as measured fact in your build prompt. Trustworthy as a design input, unverified by me. |
| **CONFIRMED** | I verified it myself in this session (repo contents, command output). |
| **INFERRED** | My reasoning from RELAYED/CONFIRMED facts. Reasonable, not evidence. |
| **UNKNOWN** | Genuinely not known. Not guessed. |

---

## 1. Project audit (all CONFIRMED)

### 1.1 What this repository actually is

Not an empty project. It is a **finished, tested, two-page Vite site** called
`manoj-dev`, on its fifth commit.

```
63694c4 Resolve hero portrait paths through BASE_URL
4b62753 Rename the personal site to Manoj Dev and make it the site root
8984907 Add a portrait-led portfolio site on the same design system
83c8821 Build the site as a Vite + React + TypeScript + Tailwind project
2e324e5 Add Lumora single-file landing page
```

Two entries share one design system:

| Entry | Route | Source | What it is |
| --- | --- | --- | --- |
| `index.html` | `/` | `src/portfolio/` | "Manoj Dev" personal site — the current root |
| `lumora.html` | `/lumora.html` | `src/lumora/` | "Lumora" studio landing page |

Plus `standalone/index.html`, a dependency-free single-file build of the studio page.

### 1.2 Current stack — and the conflict with the brief

| Concern | **What exists today** | **What the brief mandates** | Conflict |
| --- | --- | --- | --- |
| Build | **Vite 8** | **Next.js** | ⚠️ **Major** |
| UI | React 19 + TypeScript 5 strict | React + TS strict | ✅ None |
| Styling | Tailwind CSS 4 (CSS-first `@theme`) | Tailwind CSS | ✅ None |
| Motion | `@react-spring/web` + `spring-text-engine` | **Motion (motion.dev)** | ⚠️ **Major** |
| Smooth scroll | **Lenis** | (brief notes the *reference* used none) | ⚠️ Minor |
| 3D | none | Three.js / R3F *only where justified* | ✅ None |
| Unit tests | Vitest + Testing Library (happy-dom) | — | ✅ Asset |
| E2E | Playwright 1.56.1 | Browser QA required | ✅ Asset |
| Lint | ESLint 10 + typescript-eslint + react-hooks | — | ✅ Asset |

`node_modules` is **absent** — nothing has been installed in this container yet.
Node v22.22.2, npm 10.9.7. 16 GB RAM, ~30 GB free disk available here.

### 1.3 Existing design system (a genuine asset)

`src/index.css` already defines a coherent token layer:

- **Palette:** white `#ffffff` background, near-black ink `#0a0a0a`/`#111111`,
  greys `#8d8d8d`/`#b6b6b6`, line `#e6e5e2`, surfaces `#f1f0ee`/`#e3e2df`,
  burnt-orange accent `#b15f2c` (with `from`/`to` variants).
- **Radii:** `pill`, `card` 2rem, `card-sm` 1.25rem, `control` 0.875rem.
- **Type:** Onest (Google Fonts), weights 400–700. One family only.
- **Reduced motion:** a global `prefers-reduced-motion` kill-switch already exists.

### 1.4 The adaptive rem grid — the most interesting thing in the repo

`src/lib/adaptiveGrid.ts` + the media queries in `index.css` implement a genuinely
sophisticated system: every layout value is authored in `rem` against a 16px design
base, so changing the root font-size rescales the entire design.

- Below 1920px, `max-width` media queries set `html { font-size }` in `vw`
  (each is `16 * 100 / <design base width> vw`): 1920→`0.8333vw`, 1440→`1.1111vw`,
  1024→`1.5625vw`, 640→`4.4444vw`.
- Above 1920px, `adaptiveFontSize()` interpolates a larger root size with a
  damping coefficient of `0.6666` so wide displays grow gently.
- Covered by unit tests.

**This is directly reusable for MAISON VELOR and I recommend keeping it.**

### 1.5 Existing motion vocabulary

| File | What it holds |
| --- | --- |
| `src/lib/constants.ts` | ~22 named `SPRING` configs, a `DELAY` ladder (150/200/250/300/400/550/650/750/900 ms after loader), a `STAGGER` map (45–120 ms), `LOADER_FILL_MS` 1300, `LIQUID` canvas params, `COUNT_UP` params |
| `src/lib/textReveal.ts` | Line masks (900 ms, easeOutCubic, `y 100%→0%`) and word rises (700 ms, easeOutQuart, `y 24→0`) |
| `src/lib/easing.ts` | `easeInOutCubic`, loader progress helpers |
| `src/lib/scroll.ts` | Lenis singleton + a single `scrollEnabled` boolean gating the loader and both overlays |
| `src/hooks/useInView.ts` | Fire-once IntersectionObserver, `rootMargin '0px 0px -5% 0px'`, threshold 0.01 |

Note the structural echo: the existing `DELAY` ladder already steps in ~150 ms
increments at the top, and `useInView` is already an IntersectionObserver-driven
reveal system. The repo is closer to the reference's *mechanics* than to its look.

### 1.6 Existing components

24 shared components (`src/components/`) + 10 portfolio-specific ones. The shared
primitives worth keeping: `Reveal`, `LineReveal`, `PillButton`, `Eyebrow`, `TagChip`,
`Shell`, `AnimatedLink`, plus `PageLoader`, `Header`, `NavMenu`, `RequestModal`
(all of which already take their copy as props, so they are genuinely shared rather
than cloned).

**There is no commerce code anywhere.** No product model, no cart, no wishlist,
no catalogue, no filtering. V1 commerce UX is a build-from-zero.

### 1.7 Known honesty markers already in the repo

The README explicitly states the contact modal's submit "is **a stub** … and sends
nothing anywhere — there is no backend in this project." That posture matches the
brief's no-fake-functionality rule and should be carried into MAISON VELOR.

---

## 2. Reference anatomy (as RELAYED by the brief)

### 2.1 Technical architecture — RELAYED

- Nuxt 3 / Vue.
- **Native scroll.** No smooth-scroll library.
- A custom `requestAnimationFrame` + `IntersectionObserver` motion system.
- **Explicitly no** GSAP, ScrollTrigger, Lenis, Locomotive or Framer Motion.
- A WebGL background layer rendering behind the DOM (a "relief" effect).

> The brief is emphatic on one point and I will honour it: **Motion.dev was not used
> by the reference.** Any claim otherwise would be fabricated. Our use of Motion is a
> MAISON VELOR implementation choice, not a reference finding.

### 2.2 Layout / grid — RELAYED

- A **dual-grid 12 / 24-column system**.
- `1rem` gutter, `2rem` page margin, at the measured desktop baseline.
- Measurements were taken at **375 × 812**, **768 × 1024**, **1440 × 900**.

### 2.3 Timing & motion — RELAYED

| Measured value | Description |
| --- | --- |
| **150 ms timing ladder** | A disciplined ladder — durations/delays step in 150 ms units |
| **75 ms split-text stagger** | Per-unit delay across split-text structures |
| **45 px parallax unit** | A base translation distance, applied with different multipliers per depth layer |
| Viewport-multiple pinned stages | Pinned sequences sized as multiples of the viewport height |
| One-scalar scroll architecture | A single normalised scroll progress value drives the motion system |
| Pin-spacer sizing | Spacer elements sized to preserve document flow around pinned sections |
| Wipe-over-fade reveals | Clip-path wipes preferred over opacity fades |

### 2.4 What the brief says is transferable — RELAYED

1. One-scalar scroll architecture
2. Easing vocabulary
3. Timing ladder
4. Text stagger
5. Parallax depth principles
6. Pin-spacer sizing principles
7. Wipe-over-fade reveals

### 2.5 What the brief says must NOT be transferred — RELAYED

1. The original palette
2. The commercial display fonts — named as **OTJubilee-Platinum** and **Voyage-Regular**
3. The copy
4. The imagery
5. The SVG artwork
6. The section names
7. The WebGL relief background

### 2.6 What is genuinely UNKNOWN

Because the PDF, the screenshots and the live site are all unavailable to me, the
following are **not known and I have not guessed them**:

- ❓ The reference's actual section order, count, or content rhythm
- ❓ Its navigation model (overlay? inline? sticky? header state transitions)
- ❓ Its hero composition and what occupies the first viewport
- ❓ Its footer structure
- ❓ Its CTA placement and density
- ❓ Its section heights and whitespace ratios beyond the grid numbers above
- ❓ Its typographic scale (ratios, sizes, line-heights, tracking)
- ❓ Its exact easing curve definitions (the brief says "easing vocabulary" but gives no curves)
- ❓ Its image aspect ratios
- ❓ Its breakpoint-by-breakpoint responsive adaptations
- ❓ Whether it is even an ecommerce site (the search result described it as an
  organisation coordinating distributed spaces and product development — which is
  **not** a boutique retailer)
- ❓ Its colour palette, beyond "do not reuse it"

**This is the single biggest gap in Phase 0 and it drives Decision A in §8.**

---

## 3. Transferable mechanics — the MAISON VELOR motion contract

Proposed translation of §2.4 into our stack. Numbers are **starting points to be
visually validated**, per your brief's instruction, not values to copy mechanically.

### 3.1 One-scalar scroll architecture

One normalised `0 → 1` progress value per scroll-driven section, read by every
animated child. Implemented with Motion's `useScroll` + `useTransform`, which is
natively a one-scalar API. Single source of truth; no component computes its own
scroll maths.

### 3.2 Timing ladder

A 150 ms base unit, expressed as tokens rather than magic numbers:

| Token | Value | Use |
| --- | --- | --- |
| `duration.instant` | 150 ms | State flips, hover |
| `duration.quick` | 300 ms | Small reveals, chips |
| `duration.base` | 450 ms | Standard element entrance |
| `duration.slow` | 600 ms | Image wipes |
| `duration.editorial` | 900 ms | Hero lines, pinned stage transitions |

The existing `DELAY` map in `src/lib/constants.ts` already steps in ~150 ms at the
top and can be reconciled onto this ladder.

### 3.3 Text stagger

75 ms per unit. Line-mask reveals as the default; word- or character-splitting only
where the typography genuinely earns it (hero, one editorial pull-quote). The
existing `LINE_CONFIG` / `WORD_CONFIG` in `src/lib/textReveal.ts` is the same idea
and can be re-tokenised rather than rewritten.

### 3.4 Parallax depth

A base unit of **45 px** with per-layer multipliers, e.g. `0.5× / 1× / 2×` for
background, mid and foreground. Disabled entirely under reduced motion.

### 3.5 Wipe-over-fade reveals

`clip-path: inset()` wipes as the default image-reveal, not `opacity`. Fade
permitted only for non-structural elements. This is also the more performant
choice — `clip-path` is compositable.

### 3.6 Pin-spacer sizing

Pinned sections sized as explicit viewport multiples with a spacer preserving
document flow, so nothing jumps when pinning engages/releases. **Budget: at most
two pinned sequences on the entire site.** The brief warns against long scroll
sections built for imitation's sake, and I agree.

---

## 4. Mechanics we should deliberately change

| # | Reference behaviour (RELAYED) | MAISON VELOR | Why |
| --- | --- | --- | --- |
| 1 | Nuxt 3 / Vue | Next.js or Vite + React (**Decision B**) | Brief mandates React/TS; repo is already React |
| 2 | Custom rAF/IO motion engine | **Motion (motion.dev)** | Brief mandates it. Also: less bespoke code to maintain, and Motion's `useScroll` is a one-scalar API by design |
| 3 | WebGL relief background | Excluded. 3D only if a concept earns it | Explicitly non-transferable + a mobile perf cost |
| 4 | Native scroll (no smooth-scroll lib) | **Recommend native scroll — drop Lenis** | Lenis fights native anchor/`scroll-behavior`, hurts accessibility and adds a rAF loop. The reference's evidence supports going without. Requires removing it from `src/lib/scroll.ts` |
| 5 | Dual-grid 12/24 columns | **12-column desktop, 8 tablet, 4 mobile** | 24 columns is a lot of machinery for a boutique catalogue. Evidence, not a requirement — the brief says so explicitly |
| 6 | OTJubilee-Platinum / Voyage-Regular | Open-licence faces only, served from Google Fonts | Licensing. Also the only reachable font CDN here (§7.2) |
| 7 | Site is (apparently) not retail | Full boutique commerce UX | This is our brief, not theirs |
| 8 | Unknown section names | Original MAISON VELOR section names | Explicitly non-transferable |

---

## 5. MAISON VELOR creative opportunities

Flagged as opportunities for Phase 1. **No brand decisions are being made here** —
Phase 1 is where that happens, after your approval.

1. **Distance from the existing site.** The repo's palette is white + near-black +
   burnt orange, in Onest. A boutique identity needs a different temperature, a
   display/text type pairing rather than one grotesque, and probably a darker or
   warmer ground. The token layer is well-built and can absorb a full re-skin.
2. **Editorial over grid.** The strongest differentiator against "generic luxury
   ecommerce" is treating the catalogue as an *editorial sequence* — asymmetric
   product placement, deliberate empty columns, varied image ratios — rather than a
   uniform 3-up card grid.
3. **The wipe as a brand signature.** If the clip-path wipe is used consistently
   (images, page transitions, cart drawer, product gallery) it becomes recognisable.
   One gesture repeated beats five different ones.
4. **Typography as the hero.** With stock imagery unavailable (§7.2), a
   type-led hero is both the stronger design choice and the lower-risk one.
5. **Product detail as the set-piece.** Most portfolio ecommerce work puts all its
   effort into the homepage. Inverting that — making the PDP the most considered
   page — is both rarer and more convincing to a client.
6. **The 3D question.** No case for it yet. Phase 1 will propose at most three
   concepts with at least one requiring no 3D, per the brief.

---

## 6. Proposed information architecture

Aligned to the brief's suggested structure, trimmed. **Route count is deliberately
minimal** — the brief says not to create unnecessary routes.

```
/                       Home — editorial storytelling + featured pieces
/collection             Catalogue — filter, sort, category facets
/collection/[category]  Category view (same view, pre-filtered)
/product/[slug]         Product detail — the set-piece
/search                 Search results + empty/no-results states
/cart                   Cart — line items, quantity, summary
/wishlist               Saved pieces
/account                Account UI (demo state, clearly labelled)
/checkout               Checkout UI — address → delivery → review (NO payment processing)
```

Deliberately **not** included in V1: order history detail, auth flows, blog/journal,
store locator, size guide as a route (it becomes a PDP drawer instead).

### 6.1 State model

| Store | Scope | Persistence |
| --- | --- | --- |
| Cart | Client only | `localStorage` |
| Wishlist | Client only | `localStorage` |
| Filters / sort | URL search params | Shareable, back-button correct |
| UI overlays (nav, search, cart drawer) | Context | Ephemeral |

**Honesty rule, carried from the existing README:** cart, wishlist, account and
checkout are **frontend demo state**. No payment provider, no auth, no inventory,
no API. Every such surface will say so in the UI, not just in a comment.

### 6.2 Product data model

One source of truth in `src/data/`, typed:

```ts
Product {
  id, slug, name, category, price, currency,
  description, editorial,            // short + long copy
  images: { src, alt, ratio }[],
  colors: { name, hex }[],
  sizes:  { label, available }[],
  materials, care,
  availability: 'in-stock' | 'low-stock' | 'sold-out' | 'made-to-order',
  featured: boolean,
  related: string[]                  // slugs
}
```

### 6.3 Every surface gets five states

Loading · Empty · Error · Success · Disabled. No happy-path-only components.

---

## 7. Technical risks

### 7.1 🔴 HIGH — The reference evidence is secondhand

I hold quoted numbers but no composition, no section order, no screenshots. The
brief's stated goal is a *close recreation of composition and interaction
principles* — and composition is precisely what I cannot see. **Mitigation:
Decision A in §8.**

### 7.2 🔴 HIGH — Image sourcing is blocked in this environment

Measured in this session:

| Host | Result |
| --- | --- |
| `registry.npmjs.org` | ✅ 200 |
| `fonts.googleapis.com` | ✅ 200 |
| `fonts.gstatic.com` | ✅ reachable |
| `images.unsplash.com` | ❌ blocked |
| `images.pexels.com` | ❌ blocked |
| `cdn.pixabay.com` | ❌ blocked |
| `api.fontshare.com` | ❌ blocked |
| `api.getlayers.ai` (the repo's own hero bucket) | ❌ blocked |

Two consequences. First, **the existing site's hero photography does not load in
this environment** — its asset bucket is unreachable. Second, the brief's allowed
stock sources (Unsplash, Pexels, Pixabay) are all unusable from here.

The brief forbids inventing image URLs, using broken URLs, and shipping placeholders
in the final result. So imagery must be **generated and committed to the repo**.
This session has a Higgsfield image-generation MCP server available, which can do
that — but generating a full boutique image set consumes the user's credits, so it
is **Decision D** and needs explicit approval.

### 7.3 🟠 MEDIUM — Next.js vs. the existing Vite project

The brief mandates Next.js; the repo is a working, tested Vite app with a design
system, unit tests and a Playwright suite. Reconciling these is **Decision B**.

### 7.4 🟠 MEDIUM — None of the named skills exist in this session

I checked. Enabled skills are: `llm-council`, `import-memory`, `humanizer`,
`morning`, `skill-creator`, `xlsx`, `pptx`, `pdf`, `docx`. Enabled plugins: **none**.

**gstack, RuFlo, UI/UX Pro Max, taste-skill, Ponytail, Vercel Web Interface
Guidelines and 21st.dev are not available here.** I will apply their *principles* —
the quality bar, the review discipline, the accessibility and performance rules —
but I cannot invoke them as tools, and I will not pretend to have run them.

### 7.5 🟠 MEDIUM — Motion + React 19 + Lenis interaction

Adding Motion alongside the existing `@react-spring/web` and `spring-text-engine`
means two animation runtimes in one bundle. Recommendation: migrate fully to Motion
and remove react-spring, rather than running both. Also relevant: dropping Lenis
(change #4 in §4) removes a rAF loop that would otherwise compete with Motion's.

### 7.6 🟡 LOW — Pinned sections and mobile

Pinned, viewport-multiple sequences are the most common source of mobile scroll jank
and iOS Safari viewport-unit bugs. Budget of two, `dvh` units, and reduced-motion
fallbacks that unpin entirely.

### 7.7 🟡 LOW — Container is ephemeral

Nothing survives except what is committed and pushed. `node_modules` is currently
absent and will need a clean install. Every phase ends with a commit.

---

## 8. Decisions requiring your approval

Five. The rest I will decide myself and log in `docs/DECISIONS.md`, per the ADHD
decision principle in the brief.

---

### 🔴 DECISION A — How do we proceed without the reference?

The PDF and screenshots never reached this session, and the live site is blocked.

| Option | What happens |
| --- | --- |
| **A1. Re-supply the reference** *(recommended)* | You attach the PDF and/or screenshots. I re-run Phase 0's composition analysis properly and produce a genuine section-by-section map. Highest fidelity to your stated goal. |
| **A2. Proceed on the quoted mechanics alone** | I build MAISON VELOR on the §2.3 numbers — timing ladder, stagger, parallax unit, wipes, pinning — and design the composition originally. Honest, deliverable, but "close recreation of composition" becomes "shared motion discipline, original composition." |
| **A3. Allowlist the reference domain** | If the egress policy can be widened to `theobsidianassembly.com`, I can analyse the live site directly. |

**Recommendation: A1**, or A1 + A3. If neither is convenient, **A2 is a perfectly
good project** — but I want you to choose it knowingly rather than discover later
that I was working blind.

---

### 🔴 DECISION B — Next.js, or the existing Vite project?

| Option | What happens |
| --- | --- |
| **B1. New Next.js app in this repo** *(recommended)* | MAISON VELOR gets its own Next.js app (App Router, TS strict, Tailwind 4, Motion). Manoj Dev and Lumora stay untouched and keep working. Port the adaptive-grid maths and motion primitives across. Follows the brief exactly. Cost: two build systems in one repo. |
| **B2. Build MAISON VELOR in the existing Vite app** | A third entry alongside `index.html` and `lumora.html`. Reuses everything immediately, no new build system. **But it contradicts the brief's mandated stack**, and multi-route commerce with filters, search params and SEO is exactly what Vite SPA routing is worst at. |
| **B3. Migrate the whole repo to Next.js** | One stack, cleanest end state. But it means rebuilding two finished, tested sites for no user-facing gain. I do not recommend spending the effort here. |

**Recommendation: B1.** The brief's stack requirement is explicit, and product
catalogues with filtering, per-product metadata and sitemaps genuinely want a
framework with routing and SSR.

---

### 🟠 DECISION C — Where does MAISON VELOR live?

The repo is named `Lumora` and the package is `manoj-dev`. MAISON VELOR is a third,
unrelated brand.

| Option | What happens |
| --- | --- |
| **C1. Subdirectory of this repo** *(recommended)* | `apps/maison-velor/`. Keeps everything in the approved branch. Some naming awkwardness. |
| **C2. Its own repository** | Cleanest conceptually — but I am scoped to `manojx12/lumora` and instructed to push only to `claude/compassionate-cannon-nx3443`. Needs you to create the repo and grant access. |

**Recommendation: C1**, unless you want it as a standalone portfolio piece, in which
case C2 is worth the setup.

---

### 🟠 DECISION D — Imagery

Stock CDNs are blocked (§7.2) and the brief forbids placeholders in the final result.

| Option | What happens |
| --- | --- |
| **D1. Generate original imagery via the Higgsfield MCP** *(recommended)* | Fully original, on-brand, committed to the repo, no licensing question. **Consumes your Higgsfield credits.** Phase 1 would first present the prompt set and an image count for your approval before generating anything. |
| **D2. You supply the images** | You provide the boutique photography; I build to it. Zero credit cost, highest authenticity. |
| **D3. Phase 1 delivers prompts only, build uses committed placeholders** | Cheapest. Final result stays unfinished until images arrive — which the brief explicitly disallows for the polished deliverable. |

**Recommendation: D1**, with an explicit approval step on the prompt set and count
before a single credit is spent.

---

### 🟡 DECISION E — Boutique category

Phase 1 must recommend one. My inclination, stated now so you can redirect early:
**contemporary jewellery and small leather goods**. Small product count suits an
editorial catalogue; small objects photograph well at the scale generative imagery
handles best; material and care copy carries real substance.

Alternatives if you prefer: contemporary womenswear, or multi-brand luxury
accessories. Say the word in your Gate 0 reply and Phase 1 will build to it.

---

## 9. Recommended V1 scope

Assuming B1 + C1 + D1.

| Phase | Deliverable |
| --- | --- |
| 1 | Creative direction — identity, palette, type, category, imagery prompts, section map, 3D proposal |
| 2 | `docs/DESIGN.md` — tokens, grid, motion tokens, responsive tokens |
| 2.5 | IA — routes, data model, state model |
| 3 | `docs/ARCHITECTURE.md` + Next.js scaffold, fonts, tokens, layout, navigation |
| 4 | Homepage hero (desktop then responsive) |
| 5 | Homepage editorial sections |
| 6 | Catalogue — grid, filter, sort, search |
| 7 | Product detail |
| 8 | Cart, wishlist, checkout UI |
| 9 | Account, remaining routes |
| 10 | Motion polish |
| 11 | Accessibility + performance |
| 12 | Browser QA at 375×812, 768×1024, 1440×900 and a large desktop |
| 13 | Final visual polish |

Every phase ends with a commit and a resume block per §26 of the brief.

---

## 10. Resume block

```
CURRENT PHASE:            Phase 0 — Reference & Project Audit
STATUS:                   Complete. Awaiting Gate 0 approval.
COMPLETED:                Repo audit; stack/dependency audit; design-system and
                          motion-primitive inventory; network egress audit; skill
                          availability audit; reference-evidence provenance
                          assessment; transferable-mechanics translation; IA
                          proposal; risk register; five decisions raised.
FILES CHANGED:            docs/reference-audit.md (new). No application code.
COMMANDS RUN:             git status/branch/log; find; cat; node -v; npm -v;
                          curl reachability checks; ListSkills; ListPlugins;
                          WebSearch + WebFetch (reference — blocked).
TESTS PASSED:             None run. node_modules absent; no code changed.
KNOWN ISSUES:             Reference PDF/screenshots absent; live reference blocked
                          by egress proxy; stock-image CDNs blocked; named skills
                          (gstack, RuFlo, taste-skill, Ponytail, 21st.dev,
                          UI/UX Pro Max) not available in this session.
DECISIONS MADE:           None binding. Five raised for approval (A–E).
NEXT ACTION:              Await Gate 0 approval, then Phase 1 — MAISON VELOR
                          creative direction.
WAITING FOR USER APPROVAL: YES — Gate 0, plus Decisions A, B, C, D, E.
```
