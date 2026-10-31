# ASTAMALL keyword-to-page map

Which search intent each published page serves, so pages do not compete with each other and new content has a clear home.

- **The phrases are candidates, not researched keywords.** No search volumes, rankings or difficulty scores are claimed. Validate them with Google Search Console (Performance → Queries) once the site has impressions.
- **Titles and descriptions** live in `lib/seo.ts`; product, ingredient and article metadata is generated from `lib/catalog.ts`.
- **Intent:** *Navigational* (looking for ASTAMALL itself), *Commercial* (looking to buy), *Informational* (looking to learn).

## Commercial pages

| Page | Intent | Primary search intent | Supporting phrases | Structured data |
|---|---|---|---|---|
| `/` | Navigational, commercial | ASTAMALL Malaysia | ASTAMALL, Taiwanese skincare Malaysia, Taiwan beauty products Malaysia | Organization, WebSite |
| `/shop` | Commercial | skincare and beauty products Malaysia | Taiwanese skincare Malaysia, lipstick Malaysia, tinted lip balm Malaysia | — |
| `/shop?category=Skincare` | Commercial | skincare products Malaysia | facial serum Malaysia, facial toner Malaysia, lipstick Malaysia, lip balm Malaysia | — |
| `/shop?category=Health%20Foods` | Commercial | health foods Malaysia | collagen drink Malaysia, probiotic coffee Malaysia | — |
| `/shop?category=Health%20Supplements` | Commercial | health supplements Malaysia | astaxanthin supplement Malaysia | — |
| `/shop/asta-s-rejuvenating-serum` | Commercial | Asta-S Rejuvenating Serum | astaxanthin serum Malaysia, facial serum Malaysia, Asta-S skincare | BreadcrumbList; Product once priced |
| `/shop/asta-s-glow-lipstick` | Commercial | Asta-S Glow Lipstick | Asta-S lipstick, Asta-S NLC02, NLC35, NLC38, NLC70, moisturising lipstick Malaysia | BreadcrumbList; ProductGroup (four shades) once priced |
| `/shop/asta-s-lipcare-balm-stick` | Commercial | Asta-S Tinted Lip Balm | tinted lip balm Malaysia, lip balm Malaysia | BreadcrumbList; Product once priced |
| `/shop/tibi-yeast-skin-balance-toner` | Commercial | Tibi Yeast Skin Balance Toner | facial toner Malaysia | BreadcrumbList; Product once priced |
| `/shop/asta-s-soothing-repair-eye-mask` | Commercial | Asta-S Regenerative Eye Mask | eye mask Malaysia | BreadcrumbList; Product once priced |
| `/shop/mission-defense-foundation-cream` | Commercial | Mission Defense Foundation Cream | face cream Malaysia | BreadcrumbList; Product once priced |
| Other `/shop/…` products (collagen drink, drip coffees, LEAN LIFE Coffee, capsules) | Commercial | the product's own name | its type plus "Malaysia" | BreadcrumbList; Product once priced |

## Informational pages

| Page | Intent | Primary search intent | Supporting phrases | Structured data |
|---|---|---|---|---|
| `/astaxanthin` | Informational | what is astaxanthin | astaxanthin skincare, astaxanthin for skin | — |
| `/ingredients/asta-s` | Informational | Asta-S free-form astaxanthin | free form astaxanthin, Asta-S skincare | BreadcrumbList |
| `/ingredients/astaxanthin` | Informational | astaxanthin ingredient | astaxanthin skincare | BreadcrumbList |
| `/ingredients/fermented-yeast`, `/collagen`, `/hexapeptide`, `/sea-fennel` | Informational | the ingredient's name | the products that feature it | BreadcrumbList |
| `/ingredients` | Informational | skincare ingredient library | — | — |
| `/about` | Navigational | about ASTAMALL | Taiwanese beauty brand Malaysia | — |
| `/journal` and its three articles | Informational | ingredient and routine education | why astaxanthin, Taiwan to Malaysia, beauty routine | BlogPosting, BreadcrumbList |
| `/faq` | Informational | ASTAMALL questions | orders, delivery, returns | FAQPage |
| `/contact` | Navigational | contact ASTAMALL | — | — |
| `/shipping-returns`, `/privacy-policy` (and `/ms/` versions) | Informational | ASTAMALL shipping, returns, privacy | — | — |

## Avoiding overlap

- **Astaxanthin.** `/astaxanthin` owns "what is astaxanthin". The two ingredient pages are narrower: `/ingredients/astaxanthin` covers the ingredient in the library, and `/ingredients/asta-s` covers the Asta-S technology. Product pages target product names, not the ingredient.
- **Lipstick shades** share one page, `/shop/asta-s-glow-lipstick`, which carries all four shade codes. Separate shade pages would split the same content four ways.
- **Category views** target the category; `/shop` targets the whole collection.

## Gaps worth content, not new thin pages

- "lipstick for mature lips" has no page whose content supports it. Only target it if the lipstick's documentation says so.
- A dedicated lip care or serum category would need its own content; until then these phrases belong to the Skincare category and the product pages.
