# ASTAMALL simple commerce revision

## Shop refinement
The Shop page now uses a compact premium editorial gallery while the landing page remains untouched. Shop dials are variance 7, motion 6 and density 3. The oversized two-column composition is replaced by a bounded three-column desktop grid, two columns on tablet and one column on mobile. The page title, product names, product imagery, filters and utility controls use a quieter retail scale.

Shop cards no longer reveal an astaxanthin droplet background or a benefit headline over the product image. Product discovery motion is limited to a one-time masked list reveal, smooth filter reflow, a 2% packaging scale and a restrained reflection pass. Quick Add remains available as functional feedback, with touch and reduced-motion fallbacks.

The latest user request supersedes the cinematic commerce treatment. Design read: a clear beauty storefront for Malaysian shoppers; compact information, predictable layouts, restrained feedback. Taste dials: variance 3, motion 2, density 4. UI UX Pro Max supplied a minimal grid and 200–250ms feedback direction. Its suggested green palette and haptic/AI feedback search results did not fit; retain the established ASTAMALL maroon and blush and use general accessibility rules for selection controls.

## Current decisions
- Preserve the supplied logo, sample product artwork and existing home introduction.
- Regular three-column desktop / two-column mobile product grid, concise names and prices, category selection, search and sorting.
- Product details: brand, name, description, type, sample price, labelled colour/size/variant controls, quantity, Add to Cart and Buy Now. Reviews honestly show no reviews yet.
- All prices and options are illustrative sample data, not official offers. No fabricated customer reviews, ratings or stock claims. Replace sample records when real product information arrives.
- Variant identity persists through cart quantity changes, checkout and the memory-only demo receipt. Prior cart lines without a variant resolve to the default sample option when adding.
- Separate About Us and Brand Story routes with concise copy and existing ingredient/product artwork. No decorative parallax, giant statistics or masked reading sections.
- Checkout and payment share one clear route: customer details, Malaysian delivery address, Visa/Mastercard/Bank Transfer, order summary. Card-entry fields remain disabled; no gateway is connected. Sample totals exclude delivery.
- Product hover scales 2.5%, filtering transitions last 200ms, and page changes use a short crossfade. No product idle loops. Reduced motion removes decorative movement.
- Existing licensed-font placeholders: self-hosted DM Sans for commerce and Cormorant Garamond for the preserved campaign. Established light storefront direction retained.
- The Asta-S serum detail page includes a customer review section directly after recognition. It begins with an honest zero-review state and a Write a Review form. Submissions open a prefilled email for moderation because no review database is connected. Future published reviews use a compact divided list rather than testimonial cards.

## Verification
TypeScript check passes. Browser QA is unavailable due to the previously observed preview URL policy block; do not bypass it. Validate variant persistence and production build before publication.

## Structure revision
The latest request preserves the opening landing film and product section while rebuilding the surrounding site. Home now contains exactly: existing CinematicHero, existing featured product cards, one short brand film and one contact strip. Redundant pillars, awards, journals, category gallery, newsletter and repeated brand introductions have been removed from the homepage.

Primary navigation is Home, Shop, About, Contact. About consolidates the ingredient discovery, Taiwan visit and ASTAMALL introduction into one short narrative. Brand Story and Journal routes redirect to the About journey, preserving old entry points without duplicate story pages. Existing ingredient and support detail routes remain available.

A shared CinematicFrame gives the brand image a reversible scroll-linked 2% translation and gentle scale; text never hides, scrolling is native and mobile/reduced-motion simplify the effect. The established home intro timeline, product catalogue, selections, prices and checkout code remain unchanged. Footer and contact layout use a compact hierarchy and a single light surface.

Validation: TypeScript and source whitespace checks pass. Product/checkout/landing component diffs are empty. Visual preview remains unavailable due to the browser URL policy observed earlier.
