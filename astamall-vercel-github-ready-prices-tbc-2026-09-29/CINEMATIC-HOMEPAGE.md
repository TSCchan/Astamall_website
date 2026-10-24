# ASTAMALL homepage hero

The homepage opens on a pinned scroll journey: `components/ui/astamall-liquid-journey.tsx`, with stage copy and images in `lib/hero-journey.ts` and styles in the "Liquid journey hero" section of `app/premium.css`.

## Stages

1. **Origin.** The crimson liquid sculpture, large, beside the hero copy. "ASTAMALL" sits behind it in Cormorant Garamond with a wine gradient.
2. **Skincare & Beauty, Health Foods, Health Supplements, Collection.** Each is a background-free product composition (`public/assets/journey-*-cutout-v1.webp`).

To change a stage's photo, replace its file or point `image.src` in `lib/hero-journey.ts` at a new cutout. Set `aspect` to the new image's width / height.

## Motion

- **Scroll pacing.** Each scroll gesture eases the journey on by half a stage, so two scrolls bring in the next product.
  - A gesture is a wheel notch, a trackpad swipe, a touch swipe, or the arrow, Page or Space keys.
  - A trackpad's momentum counts as part of the same swipe.
  - A quick second scroll queues on, up to one product ahead.
  - The last product also takes two scrolls: the first holds on it (it settles back slightly), the second glides the page on until the ingredient marquee sits just under the site header.
  - From the sections below, one scroll up glides the hero back in.
  - Dragging the scrollbar snaps to the nearest half step.
- **Sculpture.** On the first scroll the sculpture (the particle engine from `components/ui/liquid-sculpture-hero.tsx`) is drawn into a liquid spiral and fades away completely. Scrolling back re-forms it.
- **Products.** Every product grows out of the sculpture's centre along a tightening spiral: small, turned and soft-focused, then settling sharp and upright. When the next one arrives, the current product drifts forward and dissolves while the new one grows behind it.
- **Cursor.** Moving the cursor scatters the sculpture and tilts the products slightly.

## Fallbacks and performance

- **Reduced motion.** The same five stages are shown as a static stacked list, with no pinning.
- **No WebGL2.** The sculpture is shown as a still image that fades as the first product grows; the product motion still runs.
- **Rendering.** The engine sleeps when nothing moves, stops once the sculpture has faded, and pauses offscreen and in background tabs.

## Validation

The production build runs TypeScript. Headless Chromium renders this page with a software GPU, which is far too slow for the particle simulation at full density. To check the motion there, lower the density from the console first (`engine.setOptions({ density: 0.15 })`).
