# MAISON VELOR — Phase 0: Reference & Project Audit

**Status:** Complete (revision 2 — full reference material received)
**Date:** 2026-09-13
**Branch:** `claude/compassionate-cannon-nx3443`
**Gate:** 0 — awaiting approval

> **Revision note.** Revision 1 was written without the reference material, which had
> not reached the session. Both documents have since been supplied and fully read.
> This revision replaces it. Roughly three-quarters of what revision 1 listed as
> UNKNOWN is now measured fact.

---

## 0. Sources and confidence

### 0.1 What I now hold

| Source | Status |
| --- | --- |
| **`Reverse-engineering specification · reference analysis`** (PDF, 9 pp, 243 KB) | ✅ Read in full. Motion, layout, scroll and state forensics for `obsidianassembly.com` across all five routes. |
| **`The Obsidian Assembly — UI Implementation Guidance`** (MD, v1.0-draft, 31 Aug 2026) | ✅ Read in full. WCAG 2.2 AA component and token specification. |
| Existing repository (`manojx12/Lumora`) | ✅ Audited |
| Live reference site | ❌ Blocked by egress proxy — not needed now; both documents are measured, not inferred |
| Reference screenshots | ❌ None supplied. **This remains the one real gap** — see §0.4 |

The PDF states its own provenance: 5 routes, 996 sha256-pinned artifacts, 73.1 MiB of
evidence, baseline 1440×900, *"Every value here was read from a live browser or an
extracted bundle. Nothing was inferred from appearance."* It also declares itself
specification-only, with no implementation produced.

### 0.2 Confidence key

| Label | Meaning |
| --- | --- |
| **MEASURED** | Read from a live browser or extracted bundle, per the PDF's own evidence boundary (§09), or verified against the live site per the guidance's §1.2. |
| **SPECIFIED** | A rule the guidance asserts as policy rather than a measurement (its **must** / **should** / **PROPOSED** items). |
| **DERIVED** | My arithmetic or reasoning over values the documents state. Re-verifiable; shown, not asserted. |
| **CONFIRMED** | I verified it in this session (repo contents, command output). |
| **UNKNOWN** | Not known. Not guessed. |

### 0.3 The two documents disagree, and the disagreement is informative

They were written from different token exports. The PDF read **102 CSS custom
properties** from the live bundles; the guidance was handed a **5-value colour
export**. Reconciling them resolves all three of the guidance's P0 blockers — see
§4.3. That reconciliation is the most useful thing in this audit and it is not in
either document on its own.

### 0.4 What is still genuinely UNKNOWN

Both documents are forensic, not visual. Neither contains a screenshot, an image, a
crop, or a description of what any section *looks like*.

- ❓ **Visual composition of every section.** I have exact geometry (heights, offsets,
  positions, sticky targets) but no pixels. I know `c-welcome` is 1176 px tall and
  carries `-inview`; I do not know what is in it.
- ❓ Image aspect ratios and art direction
- ❓ What the WebGL relief background actually renders
- ❓ Type colour/weight assignment per section
- ❓ `/places` runtime media and its scroll sweep — the PDF explicitly documents these
  as **not captured** (CDP `Runtime.evaluate` timed out across fresh sessions, both
  viewports, 300/600/900 s budgets) and states *"Neither artifact was fabricated."*
- ❓ The rendered appearance of the three mutually exclusive states (menu overlay, form
  overlay, scrolled-dark header) — the PDF notes their subtrees were captured live and
  stored separately, but those subtrees are not in this document.

**Consequence:** I can reproduce the reference's *pacing, rhythm, geometry, motion and
state logic* with high fidelity. I cannot reproduce its *pictorial composition*,
because no supplied evidence describes it. For MAISON VELOR that is the correct
outcome anyway — composition-as-imagery is explicitly non-transferable. But you should
know the boundary. If you want closer visual kinship, supply screenshots.

---

## 1. Project audit (CONFIRMED)

### 1.1 What this repository is

A finished, tested, two-entry **Vite 8 + React 19 + TypeScript 5 (strict) + Tailwind 4**
site named `manoj-dev`, five commits deep.

| Entry | Route | Source |
| --- | --- | --- |
| `index.html` | `/` | `src/portfolio/` — "Manoj Dev" personal site |
| `lumora.html` | `/lumora.html` | `src/lumora/` — "Lumora" studio landing page |

Plus `standalone/index.html`, a dependency-free single-file build. `node_modules` is
absent. Node v22.22.2, npm 10.9.7, 16 GB RAM, ~30 GB disk free in this container.

Existing deps of note: `@react-spring/web`, `spring-text-engine`, `lenis`.
Testing: Vitest + Testing Library (happy-dom), Playwright 1.56.1, ESLint 10.

**There is no commerce code of any kind.** No product model, catalogue, cart, wishlist
or filtering. That is a build-from-zero.

### 1.2 Existing assets worth keeping

| Asset | File | Verdict |
| --- | --- | --- |
| Semantic token layer in Tailwind `@theme` | `src/index.css` | ✅ Keep the *structure*, replace every value |
| Fire-once IntersectionObserver | `src/hooks/useInView.ts` | ✅ Keep — the reference uses IO the same way (10 uses) |
| Named motion config map | `src/lib/constants.ts` | ⚠️ Keep the *idea* (named tokens, not magic numbers); replace spring configs with the reference's curve + duration vocabulary |
| Line/word reveal curves | `src/lib/textReveal.ts` | ⚠️ Same — re-token against the six measured curves |
| Scroll lock via one boolean | `src/lib/scroll.ts` | ✅ Keep the gate; ❌ drop the Lenis instance (§4.1) |
| Playwright + Vitest harness | `tests/` | ✅ Keep — the guidance's A1–A24 need exactly this |

### 1.3 A conflict the new material exposes: the adaptive rem grid

`src/lib/adaptiveGrid.ts` + `src/index.css` scale `html { font-size }` in `vw` at every
breakpoint (1920→`0.8333vw`, 1440→`1.1111vw`, 1024→`1.5625vw`, 640→`4.4444vw`), then
interpolate a larger root above 1920 px with a `0.6666` damping coefficient.

**The reference does not do this.** MEASURED, PDF §08:

| Viewport | Doc height | Header | **Root font** | Overflow |
| --- | ---: | --- | --- | --- |
| 375×812 | 13 745 | 135 px fixed | **16 px** | none |
| 768×1024 | 14 184 | 135 px fixed | **16 px** | none |
| 1440×900 | 21 300 | 169 px fixed | **16 px** | none |

Root font is 16 px at all three widths. Fluidity is carried by *values*, not by the
root: the sizing sweep classifies **33 fixed-px, 16 vw and 12 calc expressions with 19
breakpoint jumps**, and typography carries mobile variants in the class names
themselves (`.-h5.-m-h6`, `.-h2.-m-h4`).

This matters beyond fidelity. A `vw`-driven root font size overrides the user's browser
font-size preference and distorts zoom behaviour, which puts two of the guidance's
acceptance criteria at risk:

- **A18** — usable at 200 % zoom (WCAG 1.4.4)
- **A19** — survives the text-spacing override, line-height 1.5× (WCAG 1.4.12)

**Recommendation: drop the `vw` root-font technique for MAISON VELOR.** Fixed 16 px
root, fluidity via `clamp()` and explicit breakpoint steps on individual values, exactly
as the reference does it. This is both the evidence-backed choice and the accessible
one. The `adaptiveGrid` module stays in the repo for the two existing sites; MAISON
VELOR does not adopt it.

---

## 2. Reference anatomy — MEASURED

### 2.1 Technical stack (PDF §02)

- **Nuxt 3 / Vue, server-rendered.** `window.__NUXT__` exposes `data`, `state`,
  `config`, `serverRendered`, `path`, `pinia` — state is Pinia.
- Vite chunks under `/_nuxt/`; component-scoped CSS via `data-v-*` (Vue SFC scoped styles).
- **Native scroll.** `html` and `body` are `overflow: visible`, `scroll-behavior: auto`.
  No transform wrapper. No scroll hijacking.
- **WebGL background layer** — a viewport-sized `<canvas>` inside `div.relief-bg`,
  sitting *behind* the DOM. It is not the rendering surface for content.
- **No third-party motion library ships on this site.** Case-insensitive search across
  all mirrored bundles and CSS returns **zero** matches for `gsap`, `ScrollTrigger`,
  `ScrollSmoother`, `Lenis`, `Locomotive` and `Framer Motion`.
- The motion system is `requestAnimationFrame` (**35 uses**), `IntersectionObserver`
  (**10 uses**), and one hand-rolled scroll controller in `entry.6ece3b7b.js` exposing
  `scrollTriggerRules[]`, `addScrollMark`, `triggerScrollRules`,
  `SCROLLING_FORWARD/BACKWARD`. The PDF notes that the `scrollTrigger` substring is
  *"a coincidence of naming, not GSAP."*

> Confirming the brief's instruction: **Motion.dev was not used by the reference.**
> Nothing in either document suggests otherwise, and I will not claim it did.

### 2.2 Design tokens (PDF §03) — from 102 CSS custom properties

**Colour — the full measured palette.** Note there is **no `#000000`**; the darkest
value is `#151415`, which also matches the site's `meta-theme-color`.

| Token | Value |
| --- | --- |
| `--c-black` | `#151415` |
| `--c-stone` | `#242324` |
| `--c-grey` | `#3f383c` |
| `--c-brown` | `#7b5136` |
| `--c-red` | `#ff5113` |
| `--c-stroke` | `#9faf9b` |
| `--c-yellow` | `#f1eade` |
| `--c-white` | `#fff` |

**Easing — the complete vocabulary.** Six named curves, and the PDF is explicit: *"the
site uses nothing else. That restraint is what makes the motion read as one system
rather than per-component improvisation."*

| Token | Curve | Role |
| --- | --- | --- |
| `--f-cubic` | `cubic-bezier(.35,.35,0,1)` | **default** |
| `--f-cubic-in` | `cubic-bezier(.69,0,0,1)` | clip-path wipes |
| `--f-fast` | `cubic-bezier(.2,.75,.35,1)` | **split-text** |
| `--f-smooth` | `cubic-bezier(.5,0,.3,1)` | — |
| `--f-smooth-alt` | `cubic-bezier(.6,0,.05,1)` | — |
| `--f-bounce` | `cubic-bezier(.6,.5,0,3)` | **overshoot** |

**Timing — base unit 150 ms.** Every duration observed across **36 live Web Animations
entries** is a multiple of 150 ms. 1200 ms is the single most common, at **48
occurrences**.

| Multiple | Duration | Role |
| ---: | ---: | --- |
| ½× | 75 ms | split-text stagger step |
| 2× | 300 ms | small state changes |
| 3× | 450 ms | link underline sweep (`background-size`) |
| 4× | 600 ms | — |
| 6× | 900 ms | header transform / background |
| **8×** | **1200 ms** | **dominant — 48 occurrences** |
| 9× | 1350 ms | — |
| 10× | 1500 ms | split-text reveal; overlay close opacity |
| 14× | 2100 ms | overlay close background-colour |
| 20× | 3000 ms | slowest observed |

**Type, grid, depth:**

| Token | Value |
| --- | --- |
| `--p` (base) | `1rem` |
| `--type-step` | `1.25` (modular ratio) |
| scale | `h6…h0`, each ×1.25 → **h0 ≈ 4.77rem** |
| `--body-line-height` | `1.3` |
| `--columns` / `--g-columns` | **12 / 24 (dual grid)** |
| `--g-gap` / `--g-margin` | `1rem` / `2rem` |
| parallax unit | **45 px** |
| `--border-radius` | `.4rem` |

**Typefaces.** All four self-hosted woff/woff2 on the site's own domain — *"which is why
the paid-font CDN scan reports zero findings. That is not licence clearance."*

- `--font-t-1` **OTJubilee-Platinum** — display. Commercial licence.
- `--font-t-2` **Voyage-Regular** — display. Commercial licence.
- `--font-b-regular` / `--font-b-medium` **Switzer** — body, 20 px / 26 px.

### 2.3 The scroll architecture (PDF §04) — *"the finding worth carrying forward"*

JavaScript writes **one scalar per section**; CSS `calc()` derives every transform,
offset and radius from it.

```
--progress        0 → 1, written by rAF
--smart-progress  calc(max(0,(var(--progress) - 1/8)) / (1 - 1/8))
--sc-calc-x       calc(var(--sc-offset-x) * (1 - min(var(--progress)*2, 1)))
--sctl-calc-r     calc(var(--sctl-radius) * var(--progress-ending) + .4rem)
```

`--smart-progress` holds the first **eighth** of a section's travel static before motion
begins, *"so entry never feels twitchy."*

Two direct instructions from the PDF, which I intend to follow:

> *"Because the derivation lives in CSS, the runtime needs no animation library — a
> faithful reimplementation needs a scroll-progress writer, not a per-element animation
> rig."*

> *"Keep the CSS-derives-from-one-scalar contract when porting to React or Nuxt — it
> survives the framework move intact and is what keeps the runtime small."*

This is the single most important architectural finding in the whole audit, and it
drives **Decision F** (§9).

### 2.4 Header state machine (PDF §05)

`-dark` tracks **the background of the section in view** — it is *not* a scroll-depth
threshold.

| Route | At top | Once scrolled | Behaviour |
| --- | --- | --- | --- |
| `/` | `header` | `-scrolled` | `-dark` **on** at 5100 / 10200 / 20400, **off** at 15300 / 18360 |
| `/places` | `-dark` | `-scrolled` | dark drops immediately |
| `/objects` | `-dark` | `-scrolled -dark` | dark drops by 3000 |
| `/about` | `-dark` | `-scrolled -dark` | dark retained throughout |
| `/people` | `-dark` | `-scrolled` | dark drops immediately |

Only the homepage starts bare; every sub-route ships `-dark` as its default.

**DERIVED — the sample stops.** Max scroll on `/` is `21300 − 900 = 20400`. The five
stops are exactly 25 % / 50 % / 75 % / 90 % / 100 % of that: 5100, 10200, 15300, 18360,
20400. So these are sampled probes, not transition points.

**A tension worth flagging.** The PDF's prose says the class *"turns off over the light
middle sections and back on over `c-admission`."* But the 100 % stop (20400) shows
20400–21300, which is entirely `page-footer`; and the 90 % stop (18360) falls inside
`c-admission` (18792–20194) with `-dark` **off**. The table and the sentence do not
quite agree about `c-admission`. I am not resolving this by picking one — it is flagged
for verification, and MAISON VELOR's header will implement the *rule* (section-background
driven) rather than any specific offset ladder.

### 2.5 Homepage section geometry (PDF §06)

**Fourteen top-level sections at 1440×900. Document height 21 300 px.** Three pin
spacers are exact viewport multiples — *"the signature of scroll-pinned stages."*

| # | Tag | Class | Height | Top | Position |
| ---: | --- | --- | ---: | ---: | --- |
| 0 | section | `c-welcome -inview` | 1176 | 0 | relative |
| 1 | header | — | 169 | 0 | **fixed** |
| 2 | div | `title` | 281 | 1176 | relative |
| 3 | div | `places-story` | **3600 (4×vh)** | 1457 | static |
| 4 | section | `c-places-after` | 1081 | 5057 | relative |
| 5 | div | `-gc sequence` | 900 | 6138 | **sticky** |
| 6 | div | `sticky-container-1` | **3600 (4×vh)** | 6588 | static |
| 7 | div | `sticky-container-2 -a-p -s-p-repeat` | **5400 (6×vh)** | 9288 | static |
| 8 | div | `connection-figure` | 900 | 14688 | relative |
| 9 | section | `c-connection` | 1427 | 14688 | relative |
| 10 | section | `c-updates` | 977 | 16115 | relative |
| 11 | section | `c-people` | 1628 | 17164 | relative |
| 12 | section | `c-admission` | 1690 | 18792 | relative |
| 13 | footer | `page-footer -home` | 1106 | 20194 | relative |

The table closes cleanly at the load-bearing boundaries (1457+3600=5057; 5057+1081=6138;
9288+5400=14688; 14688+1427=16115; 17164+1628=18792; 20194+1106=21300 = document height).

**Other routes:**

| Route | Sections | Doc height | Notable |
| --- | ---: | ---: | --- |
| `/places` | 6 | 10 655 | WebGL render type; **heaviest scroll workload** |
| `/objects` | 6 | 5 842 | `c-welcome` 2700 px = **3×vh pin**; `c-principles`, `c-sequence`, `c-origin` |
| `/about` | 6 | — | `div.figure-map` 900 px `absolute`; `c-operates` |
| `/people` | 5 | — | `c-about`, `c-cta` |

**Pacing, DERIVED.** Of the homepage's 21 300 px, **12 600 px (59 %)** is pinned or
sticky spacer (3600 + 3600 + 5400). The reference spends well over half its scroll
budget on three pinned stages and the rest on ten comparatively compact sections
(977–1690 px each, i.e. 1.1–1.9 viewports). That ratio *is* the pacing signature.

### 2.6 Motion families (PDF §07)

**Split-text reveal.** Headlines split into per-character spans inside per-line masks.
**69 `span.-s-char` nodes on the homepage.**

| Property | Value |
| --- | --- |
| structure | `span.-s-line > span.-s-char` |
| duration | **1.5 s** (`--f-fast`) |
| stagger | **75 ms** · observed `.075 / .15 / .225` |
| properties | opacity, scale, translate, transform, filter |

**Parallax — one unit, four multipliers.** Runtime-measured inline transforms. A single
**45 px** depth unit, scaled per element.

| Selector | Measured | Multiplier |
| --- | ---: | ---: |
| `span.caption.-h5.-m-h6` | −45 px | ×−1 |
| `span.title.-lrg.-splitted` | −45 px | ×−1 |
| `span.article.-h2.-m-h4` | −45 px | ×−1 |
| `span.title.-lrg.-splitted` | +22.5 px | ×0.5 |
| `span.subtitle.-h5.-m-h6` | +45 px | ×1 |
| `span.underlay.-inview` | **+180 px** | **×4** |

**Pinned sequence.** Sticky stages inside spacers of 3600 and 5400 px against a 900 px
viewport — 4 and 6 screens of travel. Sticky targets: `.-gc`, `.-gc.sequence`,
`.-gc.sticky`, `.object-holder`, `.title.-lrg`. Frame machinery:
`sequence-container`, `sequence-controller`, `sequence-canvas`,
`figure-sequence.f-s-1…3`, `nav.sequence-nav.-hm`.

**Clip-path reveal.** `figure.-fit.-active` carries `will-change: clip-path` and reveals
by **wipe rather than fade**, on `--f-cubic-in`. *"The crisp edge through the transition
is what distinguishes it from an opacity reveal."*

**Overlays.** Two full-viewport overlays. Both set `-isolate` on `<html>`. Both
**unmount from the DOM** when closed — Vue `v-if`, not a visibility toggle.

- `.full-screen-menu` — opened by `button.menu`, 1440×900, exposes Places / Objects /
  About / People. Close transitions `background-color` **2.1 s** + `opacity` **1.5 s**,
  both `--f-cubic`.
- `.full-screen-form` — opened by `button.request`, 8-child form. Reachable only after
  the cookie overlay is dismissed; `.fdcm--container` silently intercepts the click
  otherwise.

> That last clause is a **live UX defect in the reference**: a consent container
> swallowing the primary conversion click. MAISON VELOR must not reproduce it. Noted in
> §6.

### 2.7 What the guidance verified about the brand (MD §1.2) — MEASURED

Verification was performed against the live site on 31 August 2026, and it **overturned
the brief the guidance was given**:

| Assumed | Verified |
| --- | --- |
| E-commerce storefront | ❌ **No cart, no prices, no SKUs, no add-to-cart, no checkout** on `/` or `/objects` |
| Online shoppers | ❌ Applicants to a private, invitation-controlled organisation |
| — | "Objects" is an **editorial catalogue** of named pieces: Object I, III, V, VI; The Rabbit Keeper, The Guardian, The Fox Spirit, The Elder |
| — | Primary conversion is an **Admission application** (Full Name, Email, Country, City, Context for Admission → Submit Admission) |
| — | The site is a **speculative design exploration** published under the "Imagine Possible" initiative by Fiddle.Digital |
| — | `meta-color-scheme: dark`, `meta-theme-color: #151415` — dark UI confirmed and intentional |

Site copy verified: *"A Private Assembly for Makers"*, *"Commitment Precedes Entry"*,
*"Access is considered, not assumed."*

**This is the most consequential finding for MAISON VELOR.** See §5.

Page density, verified: **15 buttons, 12 links, 6 inputs, 5 navigation regions.** Nav
regions are: primary header nav, sticky brand bar, overlay menu, footer nav (Places /
Objects / About / Contacts / People), and in-page carousel pagination. At least three
carousels exist ("4/7" Silent Room, "1/4" The Fox Spirit, and a 1–5 paginator).

---

## 3. Transferable mechanics → the MAISON VELOR motion contract

The PDF's §10 names exactly seven transferable mechanics. Each is adopted below with
its measured value and its MAISON VELOR translation.

| # | Mechanic | Measured | MAISON VELOR |
| --- | --- | --- | --- |
| 1 | One-scalar scroll architecture | `--progress` written by rAF; CSS `calc()` derives everything | **Adopt verbatim.** One rAF writer, one custom property per section, all derivation in CSS. See Decision F. |
| 2 | Easing vocabulary | Six curves, nothing else | **Adopt all six curves as-is.** Curves are maths, not brand. Keeping exactly six is the discipline that makes it read as one system. |
| 3 | 150 ms timing ladder | 75 / 300 / 450 / 600 / 900 / 1200 / 1350 / 1500 / 2100 / 3000 | **Adopt the ladder**, validate each rung visually. Likely trim the 2100/3000 rungs — a 3 s response is a lot for a boutique. |
| 4 | Split-text stagger | 75 ms, 1.5 s duration, `--f-fast` | **Adopt.** Line masks by default; per-character only where the type earns it. Hard rule in §6 about the DOM text. |
| 5 | Parallax depth | One 45 px unit; multipliers ×−1, ×0.5, ×1, ×4 | **Adopt the unit-and-multiplier model.** Keep ×4 for one underlay element only. Zero under reduced motion. |
| 6 | Pin-spacer sizing | Exact viewport multiples: 3×, 4×, 6× | **Adopt the principle, halve the budget.** Two pinned stages, 3×vh and 4×vh. The reference spends 59 % of scroll pinned; a boutique that needs to sell should spend less. |
| 7 | Wipe-over-fade reveals | `clip-path`, `will-change: clip-path`, `--f-cubic-in` | **Adopt as the house reveal.** Extend it to page transitions and the cart drawer so it becomes a brand signature. |

### 3.1 `--smart-progress` is the detail most people would miss

`calc(max(0,(var(--progress) - 1/8)) / (1 - 1/8))` — an eighth of dead travel before
motion starts. It costs one line of CSS and it is the difference between motion that
feels composed and motion that feels twitchy. Adopted exactly.

---

## 4. Design-system findings

### 4.1 Native scroll — evidence settles the Lenis question

The reference uses native scroll: `html`/`body` `overflow: visible`,
`scroll-behavior: auto`, no transform wrapper, no hijacking. The repo currently ships
Lenis with a manual rAF loop (`src/lib/scroll.ts`).

**Decision (mine, logged): MAISON VELOR drops Lenis.** Reasons, in order: the reference
evidence is unambiguous; a smooth-scroll wrapper fights the one-scalar rAF writer for
the same frame budget; and it degrades keyboard/anchor behaviour, which the guidance's
A5/A6/A9/A10 all test. The two existing sites keep Lenis; MAISON VELOR does not adopt it.

### 4.2 The dual 12/24 grid — I have reversed my revision-1 recommendation

Revision 1 proposed simplifying to 12/8/4. Now that `--columns: 12` / `--g-columns: 24`
with `--g-gap: 1rem` / `--g-margin: 2rem` is confirmed as the reference's actual
compositional engine, I withdraw that. A 24-column track nested inside a 12-column
parent costs almost nothing in CSS Grid and is precisely what enables editorial
asymmetry — half-column offsets, deliberate empty tracks, images that break the text
measure. **Adopt the dual grid.** Mobile collapses to 4/8.

### 4.3 Reconciling the two documents resolves all three P0 blockers

The guidance opens **⚠️ Blocked** on three P0 items. All three assume a 5-value token
export. Against the PDF's measured 8-value palette they look different.

**The canvas is `#151415`, not `#000000`.** The guidance's `color.surface.base` is
`#000000`, but the PDF found no pure black in 102 custom properties, and the live
`meta-theme-color` is `#151415`. So every ratio the guidance computed against the canvas
is slightly off.

**DERIVED — recomputed against `#151415`**, using the guidance's own stated relative
luminances (`#151415` = 0.00714, `#ffffff` = 1.0, `#f1eade` = 0.82820, `#7b5136` =
0.10362) and the standard `(L₁+0.05)/(L₂+0.05)` formula. All re-verifiable:

| Foreground | vs `#151415` | Body ≥4.5 | UI/Large ≥3 | Guidance said (vs `#000000`) |
| --- | ---: | :---: | :---: | --- |
| `#ffffff` | **18.38:1** | ✅ | ✅ | 21.00:1 |
| `#f1eade` | **15.37:1** | ✅ | ✅ | 17.56:1 |
| `#7b5136` (accent) | **2.69:1** | ❌ | ❌ | 3.07:1 ⚠️ |
| `#151415` (self) | **1.00:1** | ❌ | ❌ | 1.14:1 |

And the two colours the guidance was never given:

| Token | Value | vs `#151415` | Verdict |
| --- | --- | ---: | --- |
| `--c-red` | `#ff5113` | **5.63:1** | ✅ passes body text |
| `--c-stroke` | `#9faf9b` | **7.94:1** | ✅ passes everything |

**Therefore:**

| Blocker | Guidance verdict | Reconciled verdict |
| --- | --- | --- |
| **P0-1** — `text.primary` unusable on canvas | 1.14:1 | ✅ **Stands, and strengthens.** Against the real canvas it is 1.00:1 — the same colour on itself. The rule is right; the number was generous. |
| **P0-2** — no error, border or focus colour exists | Blocking | ⚠️ **Largely dissolves.** `--c-red #ff5113` clears body text at 5.63:1 and `--c-stroke #9faf9b` clears every bar at 7.94:1. They exist; they were missing from the export the guidance was handed. A success colour is still genuinely absent. |
| **P0-3** — `space.1` 6.4 px vs `space.2` 6.67 px, Δ 0.27 px | Blocking | ✅ **Stands.** The PDF did not extract a spacing scale, so there is no cross-check, but two tokens 0.27 px apart is a real defect on its face. |
| **Accent `#7b5136`** | "clears 3:1 by 0.072" | 🔴 **Worse than reported.** Against the real canvas it is **2.69:1 and fails outright**, including for large text. The guidance's prohibition #5 should be absolute, not marginal. |

**For MAISON VELOR this is the lesson, not the liability:** the reference's own palette
cannot carry an accent on its dark ground. Our palette must be built surface-paired from
the first token, and every pair verified numerically before it ships — which is exactly
what §6 encodes.

### 4.4 Token defects to design *out of* MAISON VELOR

The guidance documents six structural faults. Each becomes a positive rule for us.

| Reference defect | MAISON VELOR rule |
| --- | --- |
| `font.family.primary: Switzer-Regular` — a *static instance* used as a family name, forcing synthetic bold for every heavier weight | Family token holds the **family**; weight is expressed through weight tokens. No faux bold, ever. |
| Only `font.weight.base: 400` exists; headings have no weight to reach for | Ship `400 / 500 / 600` in the first token pass. |
| Six of eight spacing steps are non-integer (6.4, 6.67, 12.8, 31.25, 42.94…), rounding inconsistently across DPRs | **Integer spacing scale on a 4 px grid.** No sub-pixel steps. |
| Spacing scale is *coupled to the type scale* — changing a type step silently moves layout rhythm | **Decouple spacing from type.** Two independent scales. |
| All three shadows are `rgb(21,20,21)` — invisible on the dark canvas; an elevation system authored for light surfaces | Depth on dark = **border + background shift**, not shadow. Shadows only on light surfaces, or not at all. |
| No feedback, border or focus tokens in the set at all | Error / success / border / focus in the **first** token pass, surface-paired. |

Plus the guidance's three-layer architecture, adopted wholesale:

```
Layer 1  PRIMITIVE   raw values          — never referenced by components
Layer 2  SEMANTIC    role-named, surface-paired — what components consume
Layer 3  COMPONENT   aliases to layer 2 only    — never holds a literal
```

No raw hex in component CSS, Figma overrides, or utility classes. If a component needs a
value with no layer-2 source, that is a layer-2 gap to raise, not a value to inline.

---

## 5. The commerce gap — the structural finding

**The reference is not a shop.** Verified: no cart, no prices, no SKUs, no add-to-cart,
no checkout. Its primary conversion is a membership application. MAISON VELOR is a
boutique with a full commerce UX.

So "close recreation of composition" has a hard boundary, and it is worth stating
plainly rather than discovering it in Phase 5:

| MAISON VELOR surface | Reference precedent? |
| --- | --- |
| Homepage editorial storytelling | ✅ Strong — 14 sections, three pinned stages, full geometry |
| Collection / catalogue index | ✅ Partial — `/objects` is an editorial catalogue (6 sections, 5842 px, 3×vh pin) |
| Makers / atelier narrative | ✅ Strong — `/people`, `/places` |
| About | ✅ Strong — `/about` |
| Navigation, overlays, header states | ✅ Strong — fully measured |
| The single high-stakes form | ✅ Strong — `c-admission`, 8-child form, 1690 px |
| **Product detail page** | ❌ **None.** No per-object route exists on any of the five. |
| **Product grid with filter / sort** | ❌ None |
| **Cart, wishlist, checkout** | ❌ None |
| **Price, availability, quantity, size** | ❌ None |

**Roughly half the V1 surface area has no reference composition to recreate.** That is
not a problem — it is the part of the brief where MAISON VELOR has to be original
anyway. But it does mean Gate 1 and Gate 3 carry more design weight than the brief's
phase plan implies, and the PDP in particular is ours to invent from nothing.

### 5.1 The guidance hands us the commerce spec anyway

Its §3.6 lists precisely what must be specified *if* a transactional storefront is
introduced. I propose adopting it as MAISON VELOR's commerce requirements baseline:

- **Tokens:** price emphasis; stock/availability status (a fourth feedback colour,
  surface-paired); quantity-stepper sizing.
- **Components:** price display, quantity stepper, add-to-cart with post-action
  confirmation, mini-cart, checkout stepper.
- **WCAG obligations beyond the base set:**
  - **3.3.4** Error Prevention (Legal, Financial, Data) — orders reversible, checked, or confirmed
  - **3.3.7** Redundant Entry — shipping address reusable as billing
  - **4.1.3** Status Messages — cart count changes announced **without moving focus**
  - **1.4.13** for any price/size hover card

> The guidance also notes that currency, tax and shipping disclosure carry consumer-law
> obligations that vary by jurisdiction, and are outside its scope. I agree, and I flag
> the same limit: **I am not able to give legal advice.** Since MAISON VELOR's commerce
> is explicitly demo-only frontend state with no payment processing, no real consumer
> obligation attaches — but if it ever became transactional, that review is a real task
> for someone qualified.

### 5.2 Section mapping — reference → MAISON VELOR

| Reference | Height | MAISON VELOR | Retained | Changed |
| --- | ---: | --- | --- | --- |
| `c-welcome` + `title` | 1176 + 281 | Hero + statement | Geometry (~1.3×vh), split-text reveal, `-inview` gate | All copy, imagery, type |
| `places-story` | 3600 (4×vh) | **Atelier story** — pinned | Pin-spacer principle | Reduced to 3×vh |
| `c-places-after` | 1081 | Origin note | Compact section rhythm | Content |
| `-gc sequence` + `sticky-container-1/2` | 900 + 3600 + 5400 | **The piece, examined** — one pinned sequence | Sticky-stage machinery, sequence nav | Merged from two stages into one 4×vh |
| `connection-figure` + `c-connection` | 900 + 1427 | Editorial break | Figure-over-section layering | Content |
| `c-updates` | 977 | **New this season** | Compact rhythm | Becomes product-led |
| `c-people` | 1628 | **The makers** | Structure | Content |
| `c-admission` | 1690 | **Private client enquiry** | Single high-stakes form, 8 fields | Not a gate to the catalogue |
| `page-footer -home` | 1106 | Footer | Scale, nav grouping | Content |
| — | — | **🆕 Featured pieces** | — | Commerce needs a product entry above the fold-ish |
| `/objects` | 5842 | `/collection` | 6-section rhythm, 3×vh pin | Gains filter, sort, grid |
| — | — | **🆕 `/product/[slug]`** | — | **No precedent. Original.** |
| — | — | **🆕 cart / wishlist / checkout** | — | **No precedent. Original.** |
| `/places`, `/people` | — | **Merged** into one `/atelier` | Narrative | Two routes into one |
| `/about` | — | Folded into `/atelier` | — | Route removed |

Net: **14 homepage sections → 10**, five routes → the IA in §7. The reference's 59 %
pinned-scroll budget drops to roughly 35 %.

---

## 6. Accessibility — adopting the guidance wholesale

The guidance is a WCAG 2.2 **Level AA** specification with 24 numbered, testable
acceptance criteria (A1–A24), a 7-state universal component contract, 20 prohibited
implementations and a release QA checklist. It is better than anything I would write
from scratch. **I propose adopting it as MAISON VELOR's accessibility spec**, with
brand-specific examples swapped and §3.6 promoted from conditional to mandatory.

Highlights that will shape the build from day one:

- **Seven states, always:** default · hover · focus-visible · active · disabled ·
  loading · error. Each distinguishable by **at least two signals, one not colour**.
  Focus-visible wins over every other state.
- **`aria-disabled` on submit controls, never native `disabled`** — native removes the
  control from tab order, so a keyboard user reaches the end of a form and finds nothing
  there with no explanation.
- **Focus ring exempt from every transition delay.** It appears immediately at every
  duration setting.
- **Every `<nav>` gets a unique `aria-label`.** The guidance calls this *"the single
  highest-value fix"* in its navigation section.
- **Sticky header + WCAG 2.4.11:** `scroll-margin-top` ≥ the sticky bar's height on
  every focusable element. With a 169 px fixed header this is not optional.
- **Carousels and 2.5.7:** every drag interaction needs a single-pointer alternative.
- **16 px floor on all inputs** (iOS zoom-on-focus), visible labels never replaced by
  placeholders, autocomplete on identity fields, errors that state the problem *and* the
  fix, validation on blur or submit — never per-keystroke.
- **Reduced motion:** the reference's own snippet, plus our own rule that parallax goes
  to zero and pinned stages unpin entirely.
- **`prefers-reduced-motion`, `forced-colors`, 320 px reflow, 200 % zoom, text-spacing
  override** all in the Playwright suite, not in a checklist someone forgets.

### 6.1 Three live defects in the reference we must not reproduce

1. **The consent container swallows the primary CTA.** `.fdcm--container` silently
   intercepts the click on `button.request` until the cookie overlay is dismissed. A
   conversion path blocked by an invisible overlay.
2. **Concatenated display type reaches the DOM as run-together text** —
   `NothingShownFirst`, `CommitmentPrecedesEntry`, `NotEverythingis Visible`,
   `FormedbyPeople`. Screen readers mispronounce these, translation fails, indexing
   degrades. **Our rule:** correctly spaced text in the DOM; the stacked visual effect
   is produced by CSS or per-word spans. This bites directly on our split-text reveal —
   `span.-s-char` must wrap characters of properly spaced text, and the line container
   needs an accessible name that reads as real words.
3. **One action, two names** — "Seek Admission" as the trigger, "Submit Admission" as the
   form button. **Our rule:** one name per action across trigger, control and
   confirmation.

---

## 7. Proposed information architecture

```
/                       Home — editorial, two pinned stages, featured pieces
/collection             Catalogue — filter, sort, category facets (URL params)
/collection/[category]  Same view, pre-filtered
/product/[slug]         Product detail — the set-piece. No reference precedent.
/atelier                Makers + origins + about, merged from /places + /people + /about
/search                 Results, with empty and no-results states
/cart                   Line items, quantity, summary
/wishlist               Saved pieces
/checkout               Address → delivery → review. NO payment processing.
/account                Demo account UI, labelled as such
```

**State model**

| Store | Scope | Persistence |
| --- | --- | --- |
| Cart | Client only | `localStorage` |
| Wishlist | Client only | `localStorage` |
| Filters / sort | **URL search params** | Shareable, back-button correct |
| UI overlays | Context | Ephemeral, unmounted when closed (per the reference's `v-if` semantics) |

**Product model** — one typed source in `src/data/`:

```ts
Product {
  id, slug, name, category, price, currency,
  description, editorial,
  images: { src, alt, ratio }[],
  colors: { name, hex }[],
  sizes:  { label, available }[],
  materials, care,
  availability: 'in-stock' | 'low-stock' | 'sold-out' | 'made-to-order',
  featured: boolean,
  related: string[]
}
```

**Honesty rule, inherited from this repo's existing README posture:** cart, wishlist,
account and checkout are **frontend demo state**. No payment provider, no auth, no
inventory, no API. Every such surface says so in the UI, not only in a code comment.

---

## 8. Risks

| # | Risk | Severity | Mitigation |
| --- | --- | --- | --- |
| 1 | **No screenshots** — geometry without pixels (§0.4) | 🟠 Medium | Build from geometry + motion, design composition originally. Supply screenshots if closer visual kinship is wanted. |
| 2 | **Half the V1 surface has no reference** (§5) | 🟠 Medium | Accept it. PDP/cart/checkout are original work; budget Gate 3 and Gate 5 accordingly. |
| 3 | **Image sourcing blocked** — Unsplash, Pexels, Pixabay, Fontshare and the repo's own asset bucket all unreachable; only npm and Google Fonts pass | 🔴 High | Decision D. Generate and commit originals. |
| 4 | **Fonts** — the reference's two display faces are commercially licensed and self-hosted; the PDF is explicit that *"the paid-features gate passes only because they are self-hosted, so a CDN scan cannot see them"* and that this *"is not licence clearance"* | 🟠 Medium | Open-licence faces only, from Google Fonts (the one reachable CDN). Never OTJubilee-Platinum or Voyage-Regular. Switzer is also out — its licence needs confirming at Fontshare, which is unreachable here. |
| 5 | **Next.js vs. existing Vite** | 🟠 Medium | Decision B. |
| 6 | **Named skills unavailable** — gstack, RuFlo, UI/UX Pro Max, taste-skill, Ponytail, Vercel guidelines, 21st.dev are not in this session (verified: 9 unrelated skills enabled, 0 plugins) | 🟠 Medium | Apply their principles; never claim to have run them. The guidance's A1–A24 substitute well for a formal review gate. |
| 7 | **Two animation runtimes** if Motion is added beside react-spring | 🟡 Low | Migrate fully; remove react-spring and Lenis from MAISON VELOR's dependency surface. |
| 8 | **Pinned sections on mobile** — iOS viewport-unit bugs, scroll jank | 🟡 Low | Two stages max, `dvh`, unpin entirely under reduced motion. The reference itself drops from 21 300 px desktop to 13 745 px mobile, so it clearly sheds scroll on small screens too. |
| 9 | **Ephemeral container** | 🟡 Low | Commit and push at every phase. |

---

## 9. Decisions

**Decision A (reference gap) is now resolved** — both documents supplied and read. The
only residual is screenshots, tracked as Risk 1.

### 🔴 B — Next.js, or the existing Vite project?

| Option | Consequence |
| --- | --- |
| **B1. New Next.js app in this repo** ⭐ | `apps/maison-velor/` — App Router, TS strict, Tailwind 4. Manoj Dev and Lumora untouched and still working. Follows the brief's mandated stack. Cost: two build systems in one repo. |
| B2. Third entry in the existing Vite app | Reuses everything immediately, but contradicts the mandated stack, and SPA routing is worst at exactly what we need — filter params, per-product metadata, sitemaps. |
| B3. Migrate the whole repo to Next.js | Cleanest end state; rebuilds two finished sites for no user-facing gain. |

**Recommend B1.**

### 🟠 C — Where does it live?

**Recommend C1: `apps/maison-velor/` in this repo.** I am scoped to `manojx12/lumora`
and instructed to push only to `claude/compassionate-cannon-nx3443`. A separate repo
(C2) is cleaner conceptually but needs you to create it and grant access.

### 🟠 D — Imagery

**Recommend D1: generate originals via the Higgsfield MCP**, which is available in this
session. Fully original, on-brand, committed to the repo, no licensing question.
**It spends your credits**, so Phase 1 will present the complete prompt set and an
image count for approval, and generate nothing until you say go. D2 — you supply the
photography — costs nothing and is more authentic if you have it.

### 🟡 E — Boutique category

**Recommend: contemporary jewellery and small leather goods.**

The new material strengthens this. The reference's IA is a **Places → People → Objects**
triad — origins, makers, named pieces (The Rabbit Keeper, The Guardian, The Fox Spirit,
The Elder; Object I, III, V, VI). That maps almost one-to-one onto
**ateliers → goldsmiths → numbered pieces**, which is how a jewellery maison actually
talks about itself. Small catalogue, editorial pacing, real substance in the materials
and care copy, and small objects are what generative imagery handles best.

Now-stronger alternative if you prefer: **collectible design objects / objets d'art** —
an even closer fit to the reference's "named sculptural piece" framing.

### 🆕 🟠 F — Motion architecture: Motion.dev vs. the one-scalar CSS contract

This decision did not exist in revision 1. The PDF surfaces a direct tension with the
brief's mandated stack:

> *"a faithful reimplementation needs a scroll-progress writer, not a per-element
> animation rig"* … *"Keep the CSS-derives-from-one-scalar contract when porting to
> React or Nuxt — it survives the framework move intact and is what keeps the runtime
> small."*

The brief mandates Motion. The reference's load-bearing finding says scroll motion
should *not* live in an animation library.

| Option | Consequence |
| --- | --- |
| **F1. Hybrid** ⭐ | **One-scalar CSS for everything scroll-driven** — one rAF writer sets `--progress` per section, CSS `calc()` derives transforms, offsets and radii. **Motion for everything discrete** — overlays, page transitions, split-text orchestration, layout animation, gestures, cart/wishlist feedback. Honours both the brief and the evidence. Smallest runtime. |
| F2. Motion for everything | Simpler mental model; discards the single most valuable transferable finding and puts per-element scroll animation back on the main thread. |
| F3. No Motion at all | Closest to the reference; contradicts the brief's mandated stack for no real gain on the discrete interactions, where Motion is genuinely good. |

**Recommend F1, and I intend to proceed on it unless you say otherwise** — it is
reversible and blocking Phase 1 on it would waste a gate.

---

## 10. Resume block

```
CURRENT PHASE:            Phase 0 — Reference & Project Audit (revision 2)
STATUS:                   Complete. Awaiting Gate 0 approval.
COMPLETED:                Full read of both reference documents (9pp PDF + UI
                          guidance MD). Repo, stack, token, motion and network
                          audit. Reconciliation of the two documents' conflicting
                          token exports, resolving all three P0 blockers and
                          correcting the accent-contrast finding. Section-by-section
                          reference-to-MAISON-VELOR mapping. IA, state and product
                          model proposals. Risk register. Six decisions raised.
FILES CHANGED:            docs/reference-audit.md (rewritten). No application code.
COMMANDS RUN:             git; find; cat; node/npm -v; curl egress probes;
                          ListSkills; ListPlugins; python venv + pypdf extraction.
TESTS PASSED:             None run. node_modules absent; no code changed.
KNOWN ISSUES:             No reference screenshots (geometry known, pixels not).
                          Stock-image CDNs and Fontshare blocked. Named skills
                          (gstack, RuFlo, taste-skill, Ponytail, 21st.dev,
                          UI/UX Pro Max) unavailable in this session.
DECISIONS MADE:           Non-blocking, logged: drop Lenis for MAISON VELOR; drop
                          the vw root-font technique (A18/A19 risk); adopt the dual
                          12/24 grid (reversing revision 1); adopt the guidance's
                          A1-A24 as the accessibility spec.
NEXT ACTION:              Await Gate 0 approval, then Phase 1 — MAISON VELOR
                          creative direction.
WAITING FOR USER APPROVAL: YES — Gate 0, plus Decisions B, C, D, E, F.
```
