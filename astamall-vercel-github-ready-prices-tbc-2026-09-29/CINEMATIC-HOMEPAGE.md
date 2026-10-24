# ASTAMALL homepage hero

The homepage opens on a pinned scroll journey: `components/ui/astamall-liquid-journey.tsx`, with stage copy and images in `lib/hero-journey.ts` and styles in the "Liquid journey hero" section of `app/premium.css`.

## Stages

1. **Origin.** The crimson liquid sculpture, large, beside the hero copy. "ASTAMALL" sits behind it in Cormorant Garamond with a wine gradient.
2. **Skincare & Beauty, Health Foods, Health Supplements, Collection.** Each is a background-free product composition (`public/assets/journey-*-cutout-v1.webp`).

To change a stage's photo, replace its file or point `image.src` in `lib/hero-journey.ts` at a new cutout. Set `aspect` to the new image's width / height.

## Motion

- **Scroll.** One viewport per stage. Each scroll gesture plays one full transition (about a second) to the next or previous stage: a wheel notch, a trackpad swipe, a touch swipe, or the arrow, Page and Space keys.
  - A trackpad's momentum is counted as part of the same gesture, so it never skips a product.
  - Past the first and last stage the page scrolls normally.
  - Dragging the scrollbar snaps to the nearest stage.
  - The stage pills at the bottom jump straight to a stage.
- **Products.** Products travel along a rising helix: the next one arrives low, right and far back, sweeps to the front, and leaves high and left.
- **Sculpture.** The sculpture is the particle engine from `components/ui/liquid-sculpture-hero.tsx`. Between stages, `setStir` draws the whole sculpture into a liquid spiral. It re-forms as each product lands. After the first stage it settles behind the products as a low liquid base.
- **Cursor.** Moving the cursor scatters the sculpture locally and tilts the product orbit slightly.

## Fallbacks and performance

- **Reduced motion.** The same five stages are shown as a static stacked list, with no pinning.
- **No WebGL2.** The sculpture is shown as a still image in the same place; the product helix still runs.
- **Rendering.** The engine sleeps when nothing moves, and pauses offscreen and in background tabs.

## Validation

The production build runs TypeScript. Headless Chromium renders this page with a software GPU, which is far too slow for the particle simulation at full density. To check the motion there, lower the density from the console first (`engine.setOptions({ density: 0.15 })`).
