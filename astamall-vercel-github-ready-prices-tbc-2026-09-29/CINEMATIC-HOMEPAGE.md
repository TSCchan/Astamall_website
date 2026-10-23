# ASTAMALL cinematic homepage

The homepage hero has two layers driven by one GSAP ScrollTrigger value:

1. **Fluid** (`lib/fluid-sim.ts`): a WebGL2 stable-fluids solver (advection, vorticity, pressure projection) covering the whole hero. The dye is rendered as glossy astaxanthin-red liquid; surface normals come from the dye gradient, so the ink is lit like a three-dimensional material. The cursor (or a finger on touch screens) paints freely anywhere in the hero.
2. **Product spiral** (`components/cinematic/spiral-scene.tsx`): every catalog product with a photograph sits on a 3D helix (React Three Fiber). Scrolling turns the helix so each product swings to the front in turn; a liquid waterline reveals each arriving product.

While scrolling, the fluid follows the helix: two arms of ink orbit the on-screen point between the current and the next product, widest between products and tightening as the next one arrives. When the reader settles on a product the ink drains faster so the product reads clearly.

## Stops

Stop 0 is the introduction, stops 1 to N are the products in catalog order (grouped by category), and the last stop is the collection close. ScrollTrigger snaps to each stop. `lib/cinematic-motion.ts` holds the shared maths (`spiralState`, `spiralPanelWeight`).

## Catalog integration

`lib/cinematic-catalog.ts` builds `spiralProducts` from the catalog. Products may set `active: false`, `featured: false` or a `heroImage` override. Prices, gallery order and product copy are unchanged.

## Motion and accessibility

- Native scroll with pin and snap; no wheel interception.
- Pause control; static collection for reduced motion, unavailable WebGL2, startup failure or context loss.
- Copy panels for inactive stops are inert and hidden from assistive technology; the fluid canvas never receives input.
- Ink decay uses real elapsed time, so the surface clears on time on slow devices. Phones use a finer brush and less ink.
- Offscreen and background-tab rendering is suspended. Both WebGL contexts are released on unmount.

## Validation

Run `node --test tests/cinematic-motion.test.mjs`. The production build runs TypeScript. Headless browsers render WebGL at a few frames per second; to judge the fluid at real speed, capture with Chrome virtual time (`Emulation.setVirtualTimePolicy`).
