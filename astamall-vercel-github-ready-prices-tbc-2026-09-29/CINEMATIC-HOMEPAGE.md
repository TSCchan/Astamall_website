# ASTAMALL cinematic homepage

The homepage now uses one React Three Fiber scene driven by a GSAP ScrollTrigger value: origin, skincare, health foods, supplements, and the full collection. The existing site header and all sections after the hero remain in place.

## Catalog integration

`lib/cinematic-catalog.ts` adapts the existing product catalog. Products may supply `active`, `featured`, `displayPriority`, `heroImage`, and `modelUrl` merchandising fields. No catalog prices, product detail images, first-image order, or product descriptions were changed.

The five homepage stages use the user's supplied compositions as transparent PNGs: red sculpture, beauty products, collagen, supplements, and a mixed collection. `heroStageArt` maps these editorial images to stages. They are separate from the store catalog and do not change product listings or gallery images. The images retain their supplied branding. Each composition is mapped onto a subdivided surface for liquid deformation. Category URLs use the shop's actual category values.

`components/cinematic-hero.tsx` preserves the older hero. No `liquid-sculpture-hero.tsx` existed in the supplied checkout.

## Motion and accessibility

- Continuous, reversible scroll timeline with no wheel interception.
- Desktop scroll distance: 420vh; mobile: 300vh.
- A pointer-responsive red sculpture: local silhouette stretching, travelling ripples, and a soft return when the pointer leaves. Frame-rate-independent input smoothing runs in refs and shader uniforms, without per-frame React state.
- A continuous, reversible waterline joins outgoing and incoming images, with local refraction and folding at the crest. No particle field or grain dissolve. Settled product photography is undistorted and still.
- Optional pause/resume control; static collection for reduced motion, unavailable WebGL, startup failure, or context loss.
- Static server-rendered content remains usable before JavaScript loads.
- Inactive copy is inert and hidden from assistive technology; navigation and category CTAs remain normal links.
- Lazy scene module, next-category loading, capped device pixel ratio, lower mobile mesh subdivision and distortion, and offscreen/background render suspension. No extra lighting pass or external environment texture.
- Synchronous ScrollTrigger cleanup before DOM removal; owned geometries/materials dispose on unmount. The renderer releases the WebGL context on unmount.

## Validation

Run `node --test tests/cinematic-motion.test.mjs` for phase continuity, clamping, reverse chapter stops and conserved scene weights. The Next.js production build also runs TypeScript validation.

Browser QA covers desktop and mobile layouts, chapter navigation in both directions, pointer response, pause/resume, category links, and continuing into the rest of the homepage. Physical-device frame rate and GPU memory profiling have not been measured; performance depends on the device.

October 22 motion refinement: preserve the premium editorial layout (variance 7, density 3), increase focal motion to 8. The sculpture's liquid response and the scroll waterline are the authored sequence; navigation and product details retain their existing behavior.
