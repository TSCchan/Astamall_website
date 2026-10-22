# ASTAMALL storefront direction

Updated 22 October 2026. This specification supersedes earlier experimental layouts.

## Visual identity
Retain warm ivory, burgundy, blush and dark brown, with Cormorant Garamond display typography and DM Sans controls/body text. The storefront should feel editorial, with useful product imagery, generous spacing and restrained surfaces. Current dials: variance 7, motion 6, density 3. The requested ui-ux-pro-max, ui-styling and design-taste-frontend skills inform hierarchy, accessibility and interaction; generic palette suggestions do not replace ASTAMALL branding.

## Homepage and shared pages
- Preserve the interactive liquid sculpture and continuous water-like product reveal, with pause, reduced motion and WebGL fallback.
- Replace the numbered timeline with a compact chapter selector. Remove repeated droplet/powder decorations and duplicate product compositions.
- Organize home around introduction, collection, ingredient story, journal, FAQ and contact. Retain awards and science/beauty/wellness information in expandable sections.
- Keep Home, Shop, Our story, Journal and Contact navigation, with ingredient, support and policy pages linked contextually and in the footer.

## Product discovery and details
- Three columns on desktop, two on mobile. Category counts, product/ingredient search and name sorting.
- Accessible Quick View includes description, size, featured ingredient and full-details link. Touch devices expose the action without hover.
- Preserve the original first product image and gallery order. Animate image selection; provide zoom, previous/next controls and focus restoration.
- Selecting a shade updates its matching gallery photo when available. Browsing the gallery alone does not change the chosen purchase option.
- Preserve attributes, benefits, ingredients, directions, precautions, recognition and reviews. Detailed copy uses disclosures. All translated reference images remain together below reviews, separate from the product gallery.
- Option and quantity selections carry into the contact enquiry. Mobile detail pages provide a persistent enquiry action.

## Commerce status and data integrity
All 13 catalog prices remain unconfirmed. No payment provider, live order fulfilment or review database is connected. Do not invent prices, stock, reviews or delivery promises. The enquiry flow is available; existing demo cart/checkout remains clearly identified. Catalog data and source assets are unchanged by this visual revision.

## Motion and accessibility
Use short image transitions, selection feedback, filter reflow, discreet hover treatment and detail reveals. Keep resting product photography still. Use Radix dialogs for focus management/Escape handling, native radio groups and details/summary, meaningful image alternatives, visible keyboard focus and reduced-motion fallbacks.

## Verification
Desktop/mobile browser checks cover home, collection, filtering, Quick View, gallery/zoom, shade selection, quantity, contact prefill, reference expansion, story and journal. Three cinematic tests verify conserved scene weights, chapter stops and continuous transitions. Run production builds for Sites and the supplied Next.js/Vercel source before publication.
