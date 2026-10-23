# ASTAMALL cinematic homepage

The homepage hero is one React Three Fiber canvas driven by a GSAP ScrollTrigger value with five stops: origin, skincare, health foods, health supplements and the product family.

## The sculpture

`components/cinematic/sculpture-scene.tsx` renders `LiquidMorphSculpture`: one connected crimson surface (a high-resolution sphere mesh deformed entirely in the vertex shader of a `MeshPhysicalMaterial`). It stays mounted and visible at every stage.

- **Poses.** Five deterministic shape states: the origin sculpture (a two-lobed liquid form), a skincare ribbon wrap, a health-food sweep, a structured supplement form and a halo behind the family. Open forms are a flattened tube around a ring whose cross-section twists like a ribbon. The sphere and the ring share one parameterisation, so blending between them is a continuous morph of the same surface.
- **Scroll vs idle.** Scroll progress interpolates pose parameters exactly and reversibly. Between categories the ribbon folds back into itself and sweeps across before unwrapping again. Idle motion (twisting, elongating, folding, rolling) is time-based and only animates within the pose. Deformation is always computed from rest positions, never accumulated.
- **Cursor.** The origin copy sits behind the canvas. Moving the cursor (or a finger) drifts the sculpture away from it and parts the surface locally, revealing the copy. The effect is strongest at the origin and gentler once products are on screen.
- **Material.** Glossy translucent crimson: clearcoat, soft sheen, studio reflections from a procedural `RoomEnvironment`, and a fresnel rim that reads as light passing through thin edges.

## Product reveal

`ProductReveal` places each stage's real catalog photographs (`heroStageProducts` in `lib/cinematic-catalog.ts`) inside the ribbon. Each photograph is clipped by a liquid-edged circular window that opens with the ribbon and closes again on reverse scroll; the ribbon occludes products where it passes in front. Products never pop or scale in.

This is a wrap-and-reveal around 2D photography, not a mesh morph into the product. Morphing the surface into exact bottle, compact or sachet silhouettes would need real product 3D models (GLB) for each lead product.

## Motion and accessibility

- Native scroll with pin and snap; no wheel interception.
- Pause control; static collection with real product photos for reduced motion, unavailable WebGL2, startup failure or context loss.
- Inactive copy is inert and hidden from assistive technology; the canvas never receives input.
- Offscreen and background-tab rendering is suspended. Geometry, materials and the environment map are disposed on unmount.

## Validation

Run `node --test tests/cinematic-motion.test.mjs`. The production build runs TypeScript. Headless browsers render WebGL at a few frames per second; capture with Chrome virtual time (`Emulation.setVirtualTimePolicy`) to see motion at real speed.
