# ASTAMALL homepage hero

The homepage opens on a liquid particle sculpture: `components/ui/liquid-sculpture-hero.tsx` (`SculptureHero`), configured in `app/page.tsx` and themed in the "Sculpture hero" section of `app/premium.css`.

## The sculpture

- The image is `public/assets/astamall-sculpture-cutout-v1.webp`, the crimson sculpture with a transparent background. A WebGL2 particle engine samples it, so the cutout is used directly with no backdrop colour.
- Moving the cursor (or a finger) scatters the particles like liquid; they flow back into the sculpture when it stops.
- "ASTAMALL" sits behind it in Cormorant Garamond with a wine gradient. The word is measured and fitted to the width once fonts load.

## Layout

- `contentPlacement="left"`: from 1200px wide the copy sits on the left, vertically centred, and the sculpture takes the full height just right of centre.
- Narrower screens fall back to the stacked layout, with the sculpture above the copy.
- `topInset={84}` keeps the sculpture clear of the fixed site header (the built-in nav is off).

## Fallbacks

- Without WebGL2 the cutout image is shown as a static picture in the same place.
- Rendering pauses offscreen and in background tabs.
- Reduced motion halves the cursor effect, calms the turbulence and turns off the intro and ambient drift.

## Validation

The production build runs TypeScript. Headless browsers render WebGL at a few frames per second; capture with Chrome virtual time (`Emulation.setVirtualTimePolicy`) to see motion at real speed.
