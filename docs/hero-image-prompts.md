# Hero portrait — image prompts

The hero runs a **liquid cursor reveal**: one photograph is always on screen, and a
second is painted in under the pointer through a soft brush. So it needs **two
images, not one**, and they have to line up exactly.

---

## Read this first

A text-to-image model will not produce **your** face. It produces a convincing
stranger. For a personal portfolio that is usually the wrong trade — the page is
selling *you*.

So pick your route:

| Route | When it fits | How |
| --- | --- | --- |
| **Your own photo** *(recommended)* | Always, for a real portfolio | Shoot or pick a photo, then make the second layer by grading it (below). Use the prompt as a **brief for the shoot**. |
| **Photo + AI edit** | You have a photo but a messy background | Use the prompt as an `img2img` / inpaint instruction on your own photo, denoise `0.25–0.4` so your likeness survives. |
| **Fully generated** | Placeholder, or a deliberately stylised site | Use the prompts as written. Expect a stranger. |

---

## The hard requirement: the pair must register

Both files must have **identical dimensions, framing and pose**. The reveal is a
wipe between two layers — if the subject shifts even slightly, it reads as a
glitch rather than one photograph changing.

**The reliable way to get that:** produce **one** image, then create the second by
colour-grading a copy of it. Same pixels, different grade — perfect registration,
every time.

```
base.png    →  duplicate  →  grade  →  reveal.png
```

Grading recipes for `reveal.png` (any editor — Photoshop, Affinity, Lightroom, GIMP, even CSS filters baked in):

- **Warm bloom** *(recommended — matches the site's accent)*: raise saturation ~25%,
  push the white balance warm (+400K), lift the highlights slightly, and add a
  subtle `#b15f2c` colour grade over the shadows at ~15% opacity.
- **Colour drop**: make `base.png` the desaturated one and `reveal.png` the full
  colour original, so colour blooms under the cursor.
- **Light change**: darken `base.png` two-thirds of a stop and keep `reveal.png`
  bright, so the cursor reads like a light moving across the subject.

If you generate both instead: use the **same seed**, the same prompt with only the
lighting/grade clause changed, and `img2img` the second from the first at low
denoise. Then check registration before shipping.

---

## Prompt A — `base.png` (always visible, the LCP image)

```
Editorial environmental portrait of a person in their early thirties, three-quarter
turn toward camera, calm and self-assured, looking just off-lens. Plain charcoal
crew-neck knit, no logos, no pattern. Soft diffused north-window light from camera
left, large source, gentle falloff, one soft shadow under the jaw. Warm off-white
seamless background (#f1f0ee) falling to light warm grey (#c9c9c9) toward the
bottom of frame. Shot on an 85mm lens at f/2.0, subject tack sharp, background
softly out of focus. Muted low-contrast colour grade, warm neutral, restrained
skin tones, fine natural film grain. Subject placed in the RIGHT THIRD of the
frame; the left 55% of the frame is empty background with nothing in it.
Generous headroom above the subject. Calm, quiet, expensive. Wide 16:9 crop.
```

## Prompt B — `reveal.png` (painted under the cursor)

Same prompt, with only this clause swapped in:

```
…Warm golden-hour side light from camera left, richer and more saturated, amber
highlights on the cheekbone and shoulder, deeper contrast, a burnt-orange (#b15f2c)
warmth through the shadows and background. Identical framing, identical pose,
identical crop to the previous image.
```

## Negative prompt (both)

```
text, watermark, logo, signature, caption, border, frame, collage, split screen,
busy background, clutter, props, multiple people, extra hands, deformed hands,
extra fingers, harsh direct flash, heavy vignette, HDR, oversharpened, plastic
skin, heavy retouching, wide-angle face distortion, centred composition,
subject on the left, tight crop, low resolution
```

---

## Technical specs

| Thing | Value | Why |
| --- | --- | --- |
| Aspect ratio | **16:9** (or wider, 2:1) | It sits full-bleed behind the whole hero |
| Resolution | **2400 × 1350** minimum | It renders at full viewport width on large displays |
| Both files | **Exactly the same pixel dimensions** | Required for the reveal to register |
| Format | `.jpg` for photos (quality 80), `.png` only for flat graphics | A full-bleed photo PNG will be several MB |
| Target weight | **under ~400 KB each** | `base` is the LCP image — it gates your load time |
| Subject position | Right third | The headline, rating and buttons occupy the left column |
| Top ~120px | Keep quiet | The header sits over it |
| Bottom ~25% | Keep quiet | The giant name watermark sits over it |

The page tints the photo with a white gradient top and bottom for legibility, so a
slightly darker mid-frame is fine — but keep the left side calm or the headline
will fight it.

---

## Wiring it up

1. Save the pair as `public/portrait/base.png` and `public/portrait/reveal.png`
   (overwriting the placeholders), **or** save them under any name and update the
   paths in `src/portfolio/content.ts`:

   ```ts
   export const PORTRAIT = {
     base: '/portrait/base.jpg',     // always visible
     reveal: '/portrait/reveal.jpg', // painted under the cursor
   } as const;
   ```

2. Run `npm run dev`, open the portfolio page, and move the pointer across the
   hero. You should see the second image bloom along the trail and fade out when
   you stop moving.

### Checklist before you ship

- [ ] Both files are the same pixel size
- [ ] The subject does not move between the two
- [ ] `base` is under ~400 KB
- [ ] The left half of the frame is quiet enough to read the headline over
- [ ] It still looks right at phone width, where the hero is much taller than wide

---

## Alternate directions

Swap the setting clause in Prompt A if the studio look is not you:

- **Workspace** — *"…sitting at a pale oak desk beside a window, a laptop and a
  notebook just out of focus in the foreground, soft daylight, a quiet room."*
- **Architectural** — *"…standing against a plain concrete wall in soft open shade,
  warm grey tones, shallow depth, the wall filling the left of the frame."*
- **Outdoor** — *"…outdoors in soft overcast light, a blurred street far behind,
  muted greens and greys, no recognisable signage."*

Keep the composition clause (subject in the right third, empty left) in all of them —
that is what makes the hero layout work.
