export type Product = {
  slug: string; name: string; short: string; category: string; type: string;
  ingredient: string; ingredients: string[]; position: string; benefit: string;
  description: string; routine: string; award?: string; price: number | null;
  sourceUrl?: string; sourceName?: string; options?: { label: string; options: SampleOption[] }; official?: boolean; image?: string; imageAlt?: string; size?: string;
  galleryImages?: Array<{ src: string; alt: string; label: string }>;
  longFormImages?: Array<{ src: string; alt: string; caption: string; width: number; height: number; reference?: boolean }>;
  usageGuideImage?: string; usageGuideImageAlt?: string;
  recognitionImage?: string; recognitionImageAlt?: string;
  functions?: string[]; howToUse?: string[];
  keyIngredients?: Array<{ name: string; description: string }>;
  cautions?: string[]; purpose?: string; storage?: string; shelfLife?: string;
  reviews?: ProductReview[];
};

export type ProductReview = {
  name: string;
  initials: string;
  rating: number;
  comment: string;
  verified?: boolean;
};

const catalogue: Product[] = [
{
  "slug": "tibi-yeast-skin-balance-toner",
  "name": "Tibi Yeast Skin Balance Toner",
  "short": "Toner",
  "category": "Skincare",
  "type": "Toner",
  "size": "120 ml bottle",
  "ingredient": "Tibi yeast extract",
  "ingredients": [
    "fermented-yeast"
  ],
  "position": "0% 0%",
  "benefit": "Hydrated, balanced skin with a healthy-looking glow.",
  "description": "A moisturising toner featuring NAFU LIFE's Tibi yeast extract, specially extracted from Tibi fermented milk. Its formula helps maintain skin hydration, balance oil and moisture, refine the appearance of pores, and leave skin feeling soft and smooth with a healthy-looking glow.",
  "routine": "After cleansing, apply an appropriate amount to the face and gently press until absorbed. Continue with the rest of your skincare routine.",
  "price": null,
  "official": true,
  "image": "/assets/catalog-0-en-v1.webp",
  "imageAlt": "Tibi Yeast Skin Balance Toner — NAFU LIFE product photograph",
  "galleryImages": [
    { "src": "/assets/tibi-toner-benefits-en-v1.png", "alt": "English Tibi Yeast toner graphic showing support for the skin barrier, refined-looking pores and nourishment", "label": "Benefits" },
    { "src": "/assets/tibi-toner-formula-en-v1.png", "alt": "English guide to the toner's hydration, pore-refining and radiance ingredients", "label": "Formula" },
    { "src": "/assets/tibi-toner-how-to-use-en-v1.png", "alt": "Illustrated English three-step guide to applying Tibi Yeast Skin Balance Toner", "label": "How to use" },
    { "src": "/assets/tibi-toner-care-en-v1.png", "alt": "English product care sheet with volume, storage, shelf life and six precautions", "label": "Care & storage" }
  ],
  "longFormImages": [
    { "src": "/assets/tibi-toner-story-en-v1.png", "alt": "English Tibi Yeast toner story graphic with product photograph, Tibicos fermented milk background and no-high-heat processing claim", "caption": "The story behind Tibi yeast", "width": 724, "height": 2172 },
    { "src": "/assets/tibi-toner-complete-guide-en-v1.png", "alt": "Complete English visual guide to Tibi Yeast toner benefits, formula, application and care", "caption": "The complete visual guide", "width": 724, "height": 2171 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/tibi-yeast-skin-balance-toner-1-1",
  "sourceName": "緹比酵母肌膚調理露(120ml/瓶)",
  "functions": [
    "Moisturises and supports the skin's protective barrier",
    "Helps balance oil and moisture and refine the look of pores",
    "Nourishes for a softer, smoother skin feel",
    "Promotes a healthy-looking, radiant complexion"
  ],
  "howToUse": [
    "After cleansing, dispense an appropriate amount into your palm or onto a cotton pad.",
    "Apply evenly over the face.",
    "Gently press until fully absorbed, then continue your skincare routine."
  ],
  "keyIngredients": [
    {
      "name": "Tibi yeast extract",
      "description": "Fermentation-derived extract containing amino acids and polysaccharides to nourish the skin."
    },
    {
      "name": "Hyaluronic acid, betaine and trehalose",
      "description": "A moisturising combination featured in NAFU LIFE's toner guide."
    },
    {
      "name": "Olive leaf, Enantia chlorantha bark and meadowsweet",
      "description": "Botanical extracts featured in the toner guide for balancing oil and refining the look of pores."
    },
    {
      "name": "Sake lees and molasses",
      "description": "Featured alongside Tibi yeast extract in the toner's nourishing blend."
    }
  ],
  "purpose": "Moisturises and helps maintain healthy-looking skin.",
  "storage": "Close the cap after use. Store in a cool, dry place away from heat and direct sunlight.",
  "shelfLife": "3 years",
  "cautions": [
    "This toner may be used with your existing skincare products; adjust your routine to your skin type, condition and the season.",
    "Patch test on your inner wrist before use.",
    "Stop use and consult a dermatologist if irritation occurs.",
    "Avoid direct contact with the eyes. If contact occurs, rinse immediately with water.",
    "Keep out of reach of children."
  ],
},
{ slug: 'asta-s-rejuvenating-serum', name: 'Asta-S Rejuvenating Serum', short: 'Serum', category: 'Skincare', type: 'Serum', ingredient: 'Asta-S Astaxanthin', ingredients: ['asta-s', 'hexapeptide', 'sea-fennel'], position: '50% 0%', benefit: 'Firming moisture and a brighter-looking complexion.', description: 'A lightweight, refreshing oil serum featuring Asta-S astaxanthin, hexapeptide and sea fennel extract. Designed to absorb easily without feeling heavy, it helps nourish and moisturise, support firmer-looking skin, brighten the complexion and soften the appearance of fine lines for a revitalised, youthful look.', routine: 'Use after cleansing and toner. Apply an appropriate amount evenly over the face and neck, then press or massage gently until absorbed.', award: '2022 Monde Selection Grand Gold Quality Award; 2022 National Yushan Award, Best Product Category.', price: null, official: true, image: '/assets/astamall-asta-s-serum-v5.webp', imageAlt: 'ASTAMALL Asta-S Rejuvenating Serum promotional image with English benefits on a deep maroon background', galleryImages: [{ src: '/assets/asta-s-ingredients-squalane-en.webp', alt: 'English guide to plant-derived squalane in Asta-S Rejuvenating Serum', label: 'Squalane' }, { src: '/assets/asta-s-ingredients-peptide-sea-fennel-en.webp', alt: 'English guide to the hexapeptide firming complex and sea fennel extract in Asta-S Rejuvenating Serum', label: 'Peptide + sea fennel' }, { src: '/assets/asta-s-serum-massage-routine.webp', alt: 'Illustrated six-step enhanced facial massage routine for applying Asta-S Rejuvenating Serum', label: 'Massage routine' }], usageGuideImage: '/assets/asta-s-serum-use-guide-en.webp', usageGuideImageAlt: 'English Asta-S Rejuvenating Serum application and enhanced massage guide with product details and care notes', recognitionImage: '/assets/asta-s-serum-recognition-grand-gold.webp', recognitionImageAlt: 'Asta-S Rejuvenating Serum beside the 2022 Monde Selection Grand Gold Quality Award medal', size: '30 ml bottle', functions: ['Helps smooth the appearance of fine lines and firm the look of skin', 'Nourishes and moisturises dry-feeling skin', 'Supports a revitalised, youthful-looking complexion', 'Promotes a brighter, more luminous appearance'], howToUse: ['After cleansing, apply toner before using the serum.', 'Dispense an appropriate amount into the palm.', 'Spread evenly over the face and neck.', 'Gently press or massage the skin until the product is fully absorbed.'], keyIngredients: [{ name: 'Asta-S astaxanthin', description: 'The featured astaxanthin ingredient in the ASTAMALL serum formula.' }, { name: 'Plant-derived squalane', description: 'Helps moisturise and soften the skin while relieving dry-feeling skin.' }, { name: 'Hexapeptide and firming complex', description: 'Used to support smoother-looking fine lines and firmer-looking skin.' }, { name: 'Sea fennel extract', description: 'Helps soothe dehydrated skin and maintain a healthy-looking complexion.' }], cautions: ['Patch test on the inner arm before first use.', 'Stop use and consult a dermatologist if irritation occurs.', 'Avoid direct contact with the eyes. Rinse with water if contact occurs.', 'Keep out of reach of children. Store tightly closed in a cool, dry place away from heat and direct sunlight.'], reviews: [] },
{
  "slug": "mission-defense-foundation-cream",
  "name": "Mission Defense Foundation Cream",
  "short": "Protective cream",
  "category": "Skincare",
  "type": "Protective cream",
  "size": "30 ml bottle",
  "ingredient": "TIBI®, ASTA-S®, RenoCidin®, Fulavone™ & LUMINX",
  "ingredients": [
    "asta-s",
    "fermented-yeast"
  ],
  "position": "0% 0%",
  "benefit": "Hydrating care for soft, radiant-looking skin.",
  "description": "A 30 ml facial cream combining five featured ingredients: Tibi yeast extract, Asta-S free-form astaxanthin, RenoCidin water-soluble hesperidin, Fulavone duckweed extract and LUMINX nanodiamond. NAFU LIFE presents the blend as moisturising care that supports the skin barrier, comforts dry-feeling skin and leaves a soft, luminous-looking finish.",
  "routine": "After cleansing and toner, apply an appropriate amount evenly to the face and neck. Massage gently until absorbed. Use morning and night as part of your skincare routine.",
  "price": null,
  "official": true,
  "image": "/assets/catalog-1-en-v1.webp",
  "imageAlt": "Mission Defense Foundation Cream — NAFU LIFE product photograph",
  "galleryImages": [
    { "src": "/assets/mission-defense-benefits-en-v1.png", "alt": "English Mission Defense Foundation Cream image showing hydration, firmer-looking skin and skin-barrier care", "label": "Benefits" },
    { "src": "/assets/mission-defense-ingredients-en-v1.png", "alt": "English guide to the five featured ingredients in Mission Defense Foundation Cream", "label": "Ingredients" },
    { "src": "/assets/mission-defense-how-to-use-en-v1.png", "alt": "English illustrated four-step guide to using Mission Defense Foundation Cream", "label": "How to use" }
  ],
  "longFormImages": [
    { "src": "/assets/mission-defense-ingredients-en-v1.png", "alt": "Full English guide to TIBI, ASTA-S, RenoCidin, Fulavone and LUMINX in Mission Defense Foundation Cream", "caption": "Five featured ingredients", "width": 1034, "height": 1521 },
    { "src": "/assets/mission-defense-how-to-use-en-v1.png", "alt": "Full English four-step application guide for Mission Defense Foundation Cream", "caption": "How to use the cream", "width": 1034, "height": 1521 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/mission-defense-foundation-cream",
  "sourceName": "太空防護霜 (30ml/瓶）",
  "functions": [
    "Hydrates and moisturises",
    "Helps skin appear firmer and smoother",
    "Supports the skin's protective barrier",
    "Promotes a luminous-looking complexion"
  ],
  "howToUse": [
    "After cleansing, apply toner to prepare your skin.",
    "Take an appropriate amount of cream onto your fingertips or palm.",
    "Apply evenly to the face and neck, then massage gently until absorbed.",
    "Use every morning and night as part of your skincare routine."
  ],
  "purpose": "Moisturising facial cream for daily skin-barrier care.",
  "keyIngredients": [
    {
      "name": "TIBI® Tibi yeast extract",
      "description": "Featured for nourishing care and support for the skin barrier."
    },
    {
      "name": "ASTA-S® free-form astaxanthin",
      "description": "Featured for antioxidant care and supple, radiant-looking skin."
    },
    {
      "name": "RenoCidin® water-soluble hesperidin",
      "description": "A featured ingredient for antioxidant and comfort-focused care."
    },
    {
      "name": "Fulavone™ duckweed extract",
      "description": "A botanical extract featured for soothing care."
    },
    {
      "name": "LUMINX nanodiamond",
      "description": "Featured in the cream's radiance and refinement blend."
    }
  ]
},
{
  "slug": "asta-s-glow-lipstick",
  "name": "Asta-S Glow Lipstick",
  "short": "Lipstick",
  "category": "Skincare",
  "type": "Lipstick",
  "ingredient": "Asta-S astaxanthin",
  "ingredients": [
    "asta-s"
  ],
  "position": "0% 0%",
  "benefit": "Nourishing colour for soft, luminous lips.",
  "description": "Asta-S Glow Lipstick combines colour with lip care. Its Asta-S astaxanthin and botanical extracts help moisturise dry-feeling lips, soften the appearance of lip lines and leave a luminous finish. Choose from four shades; the lipstick comes in an easy-closing magnetic case.",
  "routine": "Apply directly to clean lips. Reapply as desired for colour and comfort.",
  "price": null,
  "official": true,
  "image": "/assets/asta-s-glow-lipstick-nlc02-v1.png",
  "imageAlt": "Asta-S Glow Lipstick in NLC02 Saturn Nude beside its packaging",
  "galleryImages": [
    { "src": "/assets/asta-s-glow-lipstick-nlc70-v1.png", "alt": "Asta-S Glow Lipstick in NLC70 Rose Galaxy beside its packaging", "label": "NLC70 Rose Galaxy" },
    { "src": "/assets/asta-s-glow-lipstick-nlc38-v1.png", "alt": "Asta-S Glow Lipstick in NLC38 Twilight Orange beside its packaging", "label": "NLC38 Twilight Orange" },
    { "src": "/assets/asta-s-glow-lipstick-nlc35-v1.png", "alt": "Asta-S Glow Lipstick in NLC35 Starlight Berry beside its packaging", "label": "NLC35 Starlight Berry" },
    { "src": "/assets/asta-s-glow-lipstick-product-v1.webp", "alt": "NAFU LIFE Asta-S Glow Lipstick collection and packaging", "label": "Collection" }
  ],
  "longFormImages": [
    { "src": "/assets/asta-s-glow-lipstick-hero-en-v1.png", "alt": "English Asta-S Glow Lipstick visual showing colour and lip care with Asta-S astaxanthin", "caption": "Colour and lip care in one", "width": 1254, "height": 1254 },
    { "src": "/assets/asta-s-glow-lipstick-benefits-en-v1.png", "alt": "Translated Asta-S Glow Lipstick benefits graphic", "caption": "Colour with nourishing lip care", "width": 940, "height": 1674 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/asta-s-glow-lipstick-1",
  "sourceName": "Asta-S 光采唇膏",
  "functions": [
    "Adds colour with a luminous, moisturised finish",
    "Softens dry-feeling lips",
    "Softens the appearance of lip lines",
    "Magnetic case closes securely"
  ],
  "howToUse": [
    "Apply the lipstick directly to clean lips.",
    "Build colour with additional passes as desired and reapply when needed."
  ],
  "purpose": "Adds lip colour while helping lips feel moisturised and comfortable.",
  "keyIngredients": [
    {
      "name": "Asta-S astaxanthin",
      "description": "The featured ingredient in this lip-care colour formula."
    },
    {
      "name": "Botanical extracts",
      "description": "Help nourish and moisturise the lips."
    }
  ],
  "options": {
    "label": "Shade",
    "options": [
      {
        "label": "NLC02 Saturn Nude"
      },
      {
        "label": "NLC70 Rose Galaxy"
      },
      {
        "label": "NLC38 Twilight Orange"
      },
      {
        "label": "NLC35 Starlight Berry"
      }
    ]
  },
  "award": "2022 Taiwan Top10 Skincare Product."
},
{
  "slug": "asta-s-lipcare-balm-stick",
  "name": "Asta-S Tinted Lip Balm",
  "short": "Lip balm",
  "category": "Skincare",
  "type": "Lip balm",
  "ingredient": "Asta-S & botanical oils",
  "ingredients": ["asta-s"],
  "position": "0% 0%",
  "benefit": "A touch of tint with rich botanical moisture.",
  "description": "Asta-S Tinted Lip Balm adds a subtle wash of colour while caring for dry-feeling lips. Its blend of Asta-S astaxanthin, botanical oils, shea butter, rice bran wax and vitamin E helps soften and moisturise lips for a smooth, comfortable finish.",
  "routine": "Glide over clean lips whenever they need colour or moisture. Reapply as desired.",
  "price": null,
  "official": true,
  "size": "3.7 g stick",
  "image": "/assets/asta-s-tinted-lip-balm-photo-angle-v1.png",
  "imageAlt": "NAFU LIFE Asta-S Tinted Lip Balm and cap photographed at an angle",
  "galleryImages": [
    { "src": "/assets/asta-s-tinted-lip-balm-photo-front-v1.png", "alt": "NAFU LIFE Asta-S Tinted Lip Balm shown from the front on a white background", "label": "Front view" },
    { "src": "/assets/asta-s-tinted-lip-balm-product-v1.webp", "alt": "NAFU LIFE Asta-S Tinted Lip Balm stick and packaging", "label": "Packaging" }
  ],
  "longFormImages": [
    { "src": "/assets/asta-s-tinted-lip-balm-hero-en-v1.png", "alt": "English Asta-S Tinted Lip Balm visual with lip care benefits", "caption": "Tint and care for soft, comfortable lips", "width": 852, "height": 1847 },
    { "src": "/assets/asta-s-tinted-lip-balm-ingredients-en-v1.png", "alt": "Translated ingredient guide for Asta-S Tinted Lip Balm", "caption": "Botanical care for your lips", "width": 724, "height": 2172 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/nafu-life-lipcare-balm-stick-groupbuying-1",
  "sourceName": "Asta-S 潤色護唇膏",
  "functions": [
    "Moisturises and softens lips",
    "Helps relieve dry-feeling lips",
    "Adds a subtle tint"
  ],
  "howToUse": [
    "Glide the balm over clean lips.",
    "Reapply throughout the day as desired for moisture and a subtle tint."
  ],
  "purpose": "Moisturises the lips and adds a subtle tint.",
  "keyIngredients": [
    {
      "name": "Wild mango oil, olive oil & jojoba oil",
      "description": "Nourish and soften dry-feeling lips."
    },
    {
      "name": "Shea butter, castor oil & sunflower seed oil",
      "description": "Help retain moisture and protect the lip surface."
    },
    {
      "name": "Rice bran wax & rice germ extract",
      "description": "Help maintain the condition of the lips."
    },
    {
      "name": "Golden algae, elderberry & vitamin E",
      "description": "Featured ingredients for daily lip care."
    }
  ]
},
{
  "slug": "asta-s-soothing-repair-eye-mask",
  "name": "Asta-S Regenerative Eye Mask",
  "short": "Eye mask",
  "category": "Skincare",
  "type": "Eye mask",
  "size": "2 patches × 3 sachets (3 uses) / box",
  "ingredient": "Asta-S®, TIBI® postbiotics & hyaluronic acid",
  "ingredients": [
    "asta-s"
  ],
  "position": "0% 0%",
  "benefit": "Moisture and care for a smoother, brighter-looking eye area.",
  "description": "Asta-S Regenerative Eye Mask brings targeted care to the delicate under-eye area. Each box contains three pairs of patches, with a formula featuring Asta-S® free-form astaxanthin, TIBI® yeast postbiotics, kava, a water-lily-derived ingredient and low-molecular-weight hyaluronic acid. The patches help hydrate and nourish dry-feeling skin so the eye area looks smoother, brighter and more rested.",
  "routine": "After gently cleansing, place a patch 0.3–0.5 cm below each eye. Remove after the wear time indicated on the packaging, then gently pat in any remaining essence.",
  "price": null,
  "official": true,
  "image": "/assets/asta-s-eye-mask-product-v1.webp",
  "imageAlt": "Official NAFU LIFE Asta-S Regenerative Eye Mask box with three pairs of under-eye patches",
  "galleryImages": [
    { "src": "/assets/asta-s-eye-mask-eye-area-guide-en-v1.png", "alt": "English Asta-S eye-area guide highlighting dryness, fine lines, eye bags and dark circles", "label": "Eye-area guide" }
  ],
  "longFormImages": [
    { "src": "/assets/asta-s-eye-mask-eye-area-guide-en-v1.png", "alt": "English visual guide to common eye-area concerns including dryness, fine lines, eye bags and dark circles", "caption": "Eye-area concerns", "width": 1236, "height": 1273 },
    { "src": "/assets/asta-s-eye-mask-ingredients-en-v1.png", "alt": "English visual guide to the eye mask's five featured ingredients: TIBI postbiotics, Asta-S astaxanthin, kava, a water-lily-derived ingredient and hyaluronic acid", "caption": "Five featured ingredients", "width": 1254, "height": 1254 },
    { "src": "/assets/asta-s-eye-mask-how-to-use-en-v1.png", "alt": "English three-step guide showing how to cleanse, apply the eye patches and pat in remaining essence", "caption": "How to use the eye mask", "width": 1254, "height": 1254 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/asta-s%C2%AE-regenrative-eye-mask",
  "sourceName": "Asta-S®游離型蝦紅素舒緩修護眼膜",
  "functions": [
    "Hydrates the eye area",
    "Nourishes dry-feeling skin around the eyes",
    "Helps the eye area look smoother, brighter and refreshed"
  ],
  "howToUse": [
    "Gently cleanse your face.",
    "Place one patch 0.3–0.5 cm below each eye, following the wear time on the product packaging.",
    "Remove the patches and gently pat any remaining essence into the skin."
  ],
  "purpose": "Under-eye patches for hydrating and nourishing care.",
  "keyIngredients": [
    {
      "name": "Asta-S free-form astaxanthin",
      "description": "Helps care for the delicate eye area."
    },
    {
      "name": "Tibi yeast postbiotics",
      "description": "Nourish and support the skin barrier."
    },
    {
      "name": "Kava & water-lily-derived ingredient",
      "description": "Help soothe and brighten the look of the eye area."
    },
    {
      "name": "Low-molecular-weight hyaluronic acid",
      "description": "Helps hydrate the skin and retain moisture."
    }
  ]
},
{
  "slug": "astamall-collagen",
  "name": "NAFU Collagen PLUS Quick-Charge Collagen Drink",
  "short": "Collagen drink",
  "category": "Health Foods",
  "type": "Collagen drink",
  "size": "20 ml × 20 sachets / box",
  "ingredient": "Naticol fish collagen, astaxanthin & vitamin C",
  "ingredients": [
    "collagen",
    "asta-s"
  ],
  "position": "0% 0%",
  "benefit": "3,000 mg of French collagen in each convenient sachet.",
  "description": "A ready-to-drink beauty nutrition formula with 3,000 mg of French Naticol fish collagen peptides per 20 ml sachet. The blend also features astaxanthin, sodium hyaluronate, brown-rice ceramides, Japanese cherry blossom extract and vitamin C. Each box contains 20 individually portioned sachets.",
  "routine": "The manufacturer lists one sachet daily for routine use, or two sachets for enhanced use. Follow the product label.",
  "price": null,
  "official": true,
  "image": "/assets/catalog-5-en-v1.webp",
  "imageAlt": "NAFU Collagen PLUS Quick-Charge Collagen Drink — NAFU LIFE product photograph",
  "galleryImages": [
    { "src": "/assets/nafu-collagen-lifestyle-en-v1.png", "alt": "English NAFU Collagen PLUS lifestyle image with a model holding the product box", "label": "Lifestyle" }
  ],
  "longFormImages": [
    { "src": "/assets/nafu-collagen-lifestyle-en-v1.png", "alt": "English lifestyle visual for NAFU Collagen PLUS Quick-Charge Collagen Drink", "caption": "Collagen PLUS Quick-Charge Drink", "width": 1254, "height": 1254 },
    { "src": "/assets/nafu-collagen-astaxanthin-en-v1.png", "alt": "English manufacturer infographic about patented astaxanthin, with laboratory antioxidant comparisons that are not clinical product claims", "caption": "Featured astaxanthin", "width": 1254, "height": 1254 },
    { "src": "/assets/nafu-collagen-naticol-en-v1.png", "alt": "English ingredient guide describing the French Naticol fish collagen peptides", "caption": "French fish collagen peptides", "width": 1160, "height": 1355 },
    { "src": "/assets/nafu-collagen-formula-en-v1.png", "alt": "English four-card ingredient guide for sodium hyaluronate, rice ceramides, Japanese cherry blossom extract and PureWay-C vitamin C", "caption": "The quick-charge formula", "width": 1098, "height": 1433 },
    { "src": "/assets/nafu-collagen-faq-en-v1.svg", "alt": "English translation of eight NAFU Collagen PLUS product questions and answers covering use, fish origin and allergies", "caption": "Product questions and answers", "width": 2000, "height": 3595, "reference": true },
    { "src": "/assets/nafu-collagen-nutrition-label-en-v1.svg", "alt": "English translation of NAFU Collagen PLUS ingredients, nutrition facts, serving amounts and allergen information", "caption": "Ingredients and nutrition information", "width": 2000, "height": 3610, "reference": true }
  ],
  "sourceUrl": "https://www.nafulife.com/products/nafucollagen-2-1",
  "sourceName": "晶瑩PLUS快充膠原飲(20ml/包，20包/盒)",
  "functions": [
    "3,000 mg French Naticol fish collagen peptides per sachet",
    "Features astaxanthin, sodium hyaluronate and brown-rice ceramides",
    "20 ml ready-to-drink sachets; 20 per box"
  ],
  "howToUse": [
    "Take one 20 ml sachet daily as described by the manufacturer.",
    "The manufacturer also describes two sachets daily for enhanced use; follow the current product label."
  ],
  "purpose": "Ready-to-drink collagen supplement for a daily beauty nutrition routine.",
  "keyIngredients": [
    {
      "name": "Naticol fish collagen peptides",
      "description": "3,000 mg of French fish-derived collagen peptides per sachet."
    },
    {
      "name": "Astaxanthin",
      "description": "A carotenoid featured in the formula."
    },
    {
      "name": "Sodium hyaluronate & brown-rice ceramides",
      "description": "Moisture-focused ingredients highlighted in NAFU LIFE's formula guide."
    },
    {
      "name": "Japanese cherry blossom extract",
      "description": "A botanical extract listed on the product packaging and formula guide."
    },
    {
      "name": "Vitamin C",
      "description": "The supplied nutrition label lists 75 mg of vitamin C per 20 ml sachet."
    }
  ],
  "cautions": [
    "Contains fish-derived collagen. Check the ingredient label before use if you have a fish allergy.",
    "Refer to the current product packaging for the full ingredient list and directions."
  ]
},
{
  "slug": "probiotic-drip-coffee-morning-fruit",
  "name": "Probiotic Drip Coffee — Morning Fruit",
  "short": "Drip coffee",
  "category": "Health Foods",
  "type": "Drip coffee",
  "size": "10 drip bags / box",
  "ingredient": "Coffee & three probiotic cultures",
  "ingredients": [],
  "position": "0% 0%",
  "benefit": "A fruity medium-light roast with a clean finish.",
  "description": "NAFU LIFE × Come True Coffee's Morning Fruit pairs medium-light-roast specialty coffee with three selected probiotic cultures: Bifidobacterium animalis, Lactobacillus plantarum and Bacillus coagulans. It has aroma notes of plum, raisin, biscuit and black tea. The manufacturer describes a heat-resistant probiotic drink brewing pack protected by Taiwan utility model patent M615537. Each box contains 10 individually packed drip bags.",
  "routine": "Brew using the drip-bag directions on the packaging; follow the specified water amount and temperature.",
  "price": null,
  "official": true,
  "image": "/assets/catalog-6.webp",
  "imageAlt": "Probiotic Drip Coffee — Morning Fruit — NAFU LIFE product photograph",
  "galleryImages": [
    { "src": "/assets/probiotic-coffee-morning-fruit-pack-en-v1.png", "alt": "English Morning Fruit probiotic drip coffee pack photograph showing the box, one drip bag and 2022 taste award emblem", "label": "Morning Fruit pack" }
  ],
  "longFormImages": [
    { "src": "/assets/probiotic-coffee-three-cultures-en-v1.png", "alt": "English guide to Bifidobacterium animalis, Lactobacillus plantarum and Bacillus coagulans in the coffee blend", "caption": "Three selected probiotic cultures", "width": 1254, "height": 1254 },
    { "src": "/assets/probiotic-coffee-b-corp-en-v1.png", "alt": "English translation of the supplied Come True Coffee B Corporation graphic", "caption": "Coffee and community", "width": 1122, "height": 1402 },
    { "src": "/assets/probiotic-coffee-brewing-en-v1.png", "alt": "English three-step guide to brewing the probiotic drip coffee with 180 to 200 milliliters of water at 88 to 92 degrees Celsius", "caption": "How to brew", "width": 1122, "height": 1402 },
    { "src": "/assets/probiotic-coffee-nutrition-en-v1.png", "alt": "English translation of the supplied nutrition facts and product specifications for 10 drip bags", "caption": "Nutrition and product details", "width": 1122, "height": 1402 },
    { "src": "/assets/probiotic-coffee-testing-en-v1.png", "alt": "English summary of the supplied coffee bean and filter material test report graphic", "caption": "Quality testing reference", "width": 976, "height": 1611 },
    { "src": "/assets/probiotic-coffee-morning-fruit-flavor-en-v1.png", "alt": "English translation of the supplied Morning Fruit flavor graphic with medium-light roast and sweet orange, cranberry, dried fruit and black tea tasting notes", "caption": "Supplied flavor graphic; the current NAFU LIFE listing describes plum, raisin, biscuit and black tea notes", "width": 1608, "height": 978 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/probiotic-dripcoffee-flavor2-box",
  "sourceName": "益予成真 益生菌濾掛咖啡（晨光果露) 10包/盒",
  "functions": [
    "Medium-light roast with plum, raisin, biscuit and black-tea notes",
    "Three selected probiotic cultures",
    "10 individually packed drip bags per box"
  ],
  "purpose": "Medium-light-roast specialty drip coffee with a three-culture probiotic blend.",
  "keyIngredients": [
    {
      "name": "Medium-light roast coffee",
      "description": "Plum, raisin, biscuit and black-tea aroma notes."
    },
    {
      "name": "Bifidobacterium animalis",
      "description": "One of the three cultures shown in the manufacturer's blend guide."
    },
    {
      "name": "Lactobacillus plantarum",
      "description": "A selected culture in the probiotic blend."
    },
    {
      "name": "Bacillus coagulans",
      "description": "The third culture shown in the blend guide."
    }
  ],
  "award": "2022 International Taste Institute Superior Taste Award — two stars."
},
{
  "slug": "probiotic-drip-coffee-cocoa-waltz",
  "name": "Probiotic Drip Coffee — Cocoa Waltz",
  "short": "Drip coffee",
  "category": "Health Foods",
  "type": "Drip coffee",
  "size": "10 drip bags / box",
  "ingredient": "Coffee & three probiotic cultures",
  "ingredients": [],
  "position": "0% 0%",
  "benefit": "A medium roast with chocolate, walnut, butter and a clean finish.",
  "description": "NAFU LIFE × Come True Coffee's Cocoa Waltz pairs medium-roast specialty coffee with a three-culture probiotic blend. The manufacturer describes chocolate, walnut and buttery aroma notes with a clean finish, a patented heat-resistant probiotic drip-bag design, and 10 individually packed 10 g bags per box. The supplied ingredient graphic identifies Lactobacillus plantarum, Bacillus coagulans and Bifidobacterium animalis as the three cultures.",
  "routine": "Brew using the drip-bag directions on the packaging; follow the specified water amount and temperature.",
  "price": null,
  "official": true,
  "image": "/assets/catalog-7.webp",
  "imageAlt": "Probiotic Drip Coffee — Cocoa Waltz — NAFU LIFE product photograph",
  "galleryImages": [
    { "src": "/assets/probiotic-coffee-cocoa-waltz-pack-en-v1.png", "alt": "English Cocoa Waltz probiotic drip coffee pack photograph showing its box, individual bag and 2022 two-star taste award emblem", "label": "Cocoa Waltz pack" }
  ],
  "longFormImages": [
    { "src": "/assets/probiotic-coffee-three-cultures-en-v1.png", "alt": "English guide to the three probiotic cultures in the supplied coffee blend graphic", "caption": "Three selected probiotic cultures", "width": 1254, "height": 1254 },
    { "src": "/assets/probiotic-coffee-nutrition-en-v1.png", "alt": "English translation of the supplied nutrition facts and product specifications for 10 drip bags", "caption": "Nutrition and product details", "width": 1122, "height": 1402 },
    { "src": "/assets/probiotic-coffee-testing-en-v1.png", "alt": "English summary of the supplied coffee bean and filter material test report graphic", "caption": "Quality testing reference", "width": 976, "height": 1611 },
    { "src": "/assets/probiotic-coffee-cocoa-waltz-flavor-en-v1.png", "alt": "English Cocoa Waltz flavor graphic showing a medium roast and chocolate, walnut, butter and clean-finish notes", "caption": "Cocoa Waltz flavor profile", "width": 1608, "height": 978 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/probiotic-dripcoffee-flavor1-box",
  "sourceName": "益予成真 益生菌濾掛咖啡（可可圓舞曲) 10包/盒",
  "functions": [
    "Medium roast with chocolate, walnut, butter and clean-finish notes",
    "Three selected probiotic cultures",
    "10 individually packed 10 g drip bags per box"
  ],
  "purpose": "Medium-roast specialty drip coffee with a three-culture probiotic blend.",
  "keyIngredients": [
    {
      "name": "Medium roast coffee",
      "description": "Chocolate, walnut and buttery aroma notes with a clean finish."
    },
    {
      "name": "Lactobacillus plantarum",
      "description": "One of the three cultures named in the supplied ingredient graphic."
    },
    {
      "name": "Bacillus coagulans",
      "description": "A selected culture in the probiotic blend."
    },
    {
      "name": "Bifidobacterium animalis",
      "description": "The third culture named in the supplied ingredient graphic."
    }
  ]
},
{
  "slug": "lean-life-coffee",
  "name": "LEAN LIFE Coffee",
  "short": "Coffee",
  "category": "Health Foods",
  "type": "Coffee",
  "size": "20 mL × 10 sachets / box",
  "ingredient": "Arabica coffee extract & Slimpro five-culture blend",
  "ingredients": [],
  "position": "0% 0%",
  "benefit": "Rich Arabica coffee concentrate with a five-culture probiotic blend.",
  "description": "LEAN LIFE Coffee combines coffee extract made from 100% Arabica beans with the Slimpro five-culture probiotic blend. NAFU LIFE says HWC Coffee oversees the bean selection and that high-temperature extraction followed by rapid cooling retains the coffee aroma. The supplied product label lists Brazilian and Ethiopian coffee origins, manufacture in Taiwan, 20 mL per sachet and 10 sachets per box. Each sachet contains 114.62 mg of caffeine.",
  "routine": "Tear open one sachet and pour the coffee concentrate into a cup. Dilute with water at a concentrate-to-water ratio of 1:4 or 1:5; use less water for a stronger taste. Milk and ice can also be used.",
  "price": null,
  "image": "/assets/catalog-8.webp",
  "imageAlt": "LEAN LIFE Coffee — NAFU LIFE product photograph",
  "galleryImages": [
    { "src": "/assets/lean-life-coffee-pour-en-v1.png", "alt": "English LEAN LIFE Coffee promotional image showing concentrate poured from a sachet into a glass", "label": "Coffee concentrate" },
    { "src": "/assets/lean-life-coffee-how-to-use-en-v1.png", "alt": "English three-step guide for opening, pouring and diluting LEAN LIFE Coffee", "label": "How to prepare" }
  ],
  "longFormImages": [
    { "src": "/assets/lean-life-coffee-story-en-v1.png", "alt": "English LEAN LIFE Coffee reference panel showing the box, ways to mix it and everyday use illustrations", "caption": "The LEAN LIFE Coffee story", "width": 1024, "height": 1536 },
    { "src": "/assets/lean-life-coffee-how-to-use-en-v1.png", "alt": "English three-step guide for opening, pouring and diluting LEAN LIFE Coffee", "caption": "How to prepare", "width": 1254, "height": 1254 },
    { "src": "/assets/lean-life-coffee-specifications-en-v1.png", "alt": "English nutrition facts, ingredients, origins, storage and caffeine information for LEAN LIFE Coffee", "caption": "Product specifications and nutrition", "width": 1024, "height": 1536 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/leanlifecoffee-slimpro-1box",
  "sourceName": "LEAN LIFE Coffee 孅盈咖啡（10包/盒）",
  "functions": [
    "Coffee extract made from 100% Arabica beans",
    "Slimpro five-culture probiotic blend",
    "Ready-to-mix 20 mL sachets; 10 per box"
  ],
  "purpose": "Ready-to-mix coffee concentrate with a five-culture probiotic blend.",
  "shelfLife": "2 years; see the package for the expiry date",
  "storage": "Keep in a cool, dry place away from heat and direct sunlight.",
  "howToUse": [
    "Open the outer sachet and tear the coffee concentrate stick along the dotted line.",
    "Pour the concentrate into a cup.",
    "Add water at a concentrate-to-water ratio of 1:4 or 1:5. Use less water for a stronger taste, or mix with milk and ice."
  ],
  "keyIngredients": [
    {
      "name": "Coffee extract from 100% Arabica beans",
      "description": "Beans from Brazil and Ethiopia are selected under HWC Coffee supervision."
    },
    {
      "name": "Slimpro five-culture blend",
      "description": "The manufacturer lists Bifidobacterium animalis, butyric-acid bacteria, Kluyveromyces marxianus yeast, Lactobacillus plantarum and spore-forming lactic-acid bacteria."
    }
  ],
  "cautions": [
    "Each 20 mL sachet contains 114.62 mg of caffeine. The supplied label recommends no more than two sachets per day.",
    "Children, pregnant people and those breastfeeding should consider their total caffeine intake."
  ]
},
{
  "slug": "quick-charge-blueberry-night-capsules",
  "name": "Quick-Charge Blueberry Night Capsules",
  "short": "Capsules",
  "category": "Health Supplements",
  "type": "Capsules",
  "size": "30 capsules / pouch",
  "ingredient": "Bilberry, maqui berry, grape seed & vitamin A",
  "ingredients": [
    "asta-s"
  ],
  "position": "0% 0%",
  "benefit": "Plant-based daily eye nutrition for screen-filled days and late nights.",
  "description": "Quick-Charge Blueberry Night Capsules are designed for night owls and frequent screen users. The vegan formula combines bilberry extract, grape seed extract, maqui berry, red-algae astaxanthin, piperine and vitamin A. NAFU LIFE highlights bilberry extract standardized to 25% anthocyanins and grape seed extract standardized to 80% proanthocyanidins. The capsules contain no added preservatives or sweeteners, and each pouch holds 30 capsules.",
  "routine": "Take one capsule daily, with or without food. The capsule may be opened and mixed into a cool or room-temperature drink; avoid drinks above 40°C. Swallowing it whole is recommended.",
  "price": null,
  "image": "/assets/catalog-9-en-v1.webp",
  "imageAlt": "Quick-Charge Blueberry Night Capsules — NAFU LIFE product photograph",
  "galleryImages": [
    { "src": "/assets/blueberry-overview-en-v1.png", "alt": "English Quick-Charge Blueberry Night Capsules promotional image with the product pouch and purple capsules", "label": "Product overview" }
  ],
  "longFormImages": [
    { "src": "/assets/blueberry-02-audience-en-v1.png", "alt": "English guide to everyday lifestyles shown for Quick-Charge Blueberry Night Capsules", "caption": "Who it is for", "width": 758, "height": 2075 },
    { "src": "/assets/blueberry-03-everyday-en-v1.png", "alt": "English lifestyle panel for the blueberry capsule daily routine", "caption": "Everyday eye nutrition", "width": 981, "height": 1603 },
    { "src": "/assets/blueberry-04-ingredients-en-v1.png", "alt": "English illustrated guide to bilberry, maqui berry, grape seed, algal astaxanthin, piperine and vitamin A", "caption": "Featured ingredients", "width": 761, "height": 2067 },
    { "src": "/assets/blueberry-05-quality-en-v1.png", "alt": "English quality panel showing the vegan formula and no added preservatives or sweeteners", "caption": "Quality and formula", "width": 1016, "height": 1547 },
    { "src": "/assets/blueberry-06-banner-en-v1.png", "alt": "English Quick-Charge Blueberry Night Capsules lifestyle banner", "caption": "Made for everyday routines", "width": 1544, "height": 1019 },
    { "src": "/assets/blueberry-07-comparison-en-v1.png", "alt": "English comparison chart of anthocyanins and other featured ingredients", "caption": "Ingredient comparison", "width": 1188, "height": 1324 },
    { "src": "/assets/blueberry-08-faq-en-v1.png", "alt": "English frequently asked questions about taking, opening and storing blueberry capsules", "caption": "Frequently asked questions", "width": 784, "height": 2006 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/blueberry-capsules-1",
  "sourceName": "快充藍莓晶亮夜膠囊(30入/袋)",
  "functions": [
    "Vegan formula and plant-based capsule shell",
    "No added preservatives or sweeteners",
    "Bilberry, maqui berry and grape seed extracts with vitamin A"
  ],
  "keyIngredients": [
    {
      "name": "Bilberry extract",
      "description": "Standardized to 25% anthocyanins."
    },
    {
      "name": "Maqui berry & grape seed extract",
      "description": "Maqui berry is a source of anthocyanins and delphinidins; grape seed extract is standardized to 80% proanthocyanidins."
    },
    {
      "name": "Red-algae astaxanthin & piperine",
      "description": "Featured together in the botanical blend; piperine is included to support nutrient absorption."
    },
    {
      "name": "Vitamin A",
      "description": "Helps maintain normal vision, including adaptation to dim light."
    }
  ],
  "howToUse": [
    "Take one capsule each day, with or without food.",
    "Swallow the capsule whole, or open it and mix the contents into a cool or room-temperature drink.",
    "Avoid mixing with drinks hotter than 40°C."
  ],
  "purpose": "Everyday eye nutrition for people with frequent screen use and late-night routines.",
  "cautions": [
    "Pregnant people and children should seek advice from a doctor or dietitian before use.",
    "Follow the directions on the package and seek individualized advice if needed."
  ]
},
{
  "slug": "uc-flex-plus-capsules",
  "name": "UC-Flex PLUS Complex Capsules",
  "short": "Capsules",
  "category": "Health Supplements",
  "type": "Capsules",
  "size": "30 capsules / box",
  "ingredient": "UC-II®, AstaZine®, OptiMSM®, K2, algae calcium & magnesium",
  "ingredients": [
    "asta-s"
  ],
  "position": "0% 0%",
  "benefit": "Six featured nutrients for everyday joint and bone nutrition.",
  "description": "UC-Flex PLUS Complex Capsules combine six featured ingredients in a one-capsule daily serving: UC-II® undenatured type II collagen, AstaZine® astaxanthin, OptiMSM® methylsulfonylmethane, K2 VITAL® vitamin K2, algae calcium and magnesium glycinate. NAFU LIFE presents the formula for everyday mobility, stability and bone nutrition. The 30-capsule box uses opaque Alu-Alu blister packaging and the brand states that no artificial colors or preservatives are added.",
  "routine": "Take one capsule daily, following the directions on the package.",
  "price": null,
  "image": "/assets/catalog-10-en-v1.webp",
  "imageAlt": "UC-Flex PLUS Complex Capsules — NAFU LIFE product photograph",
  "galleryImages": [
    { "src": "/assets/uc-flex-formula-en-v1.png", "alt": "English UC-Flex PLUS six-ingredient diagram around the product box", "label": "Six-ingredient formula" },
    { "src": "/assets/uc-flex-assurance-en-v1.png", "alt": "English UC-Flex PLUS ingredient-brand and quality assurance graphic", "label": "Quality assurance" },
    { "src": "/assets/uc-flex-comparison-en-v1.png", "alt": "English UC-Flex PLUS and UC-Flex EX comparison with packaging and daily serving details", "label": "PLUS comparison" }
  ],
  "longFormImages": [
    { "src": "/assets/uc-flex-reference-01-story-en-v1.png", "alt": "English UC-Flex PLUS product story, audience and six-ingredient overview", "caption": "Product story and formula", "width": 724, "height": 2171 },
    { "src": "/assets/uc-flex-reference-02-ingredients-en-v1.png", "alt": "English reference guide to MSM, vitamin K2, algae calcium and magnesium glycinate", "caption": "Supporting ingredients", "width": 1054, "height": 1493 },
    { "src": "/assets/uc-flex-reference-03-science-en-v1.png", "alt": "English NAFU LIFE visual guide to UC-II, AstaZine astaxanthin and MSM", "caption": "Featured ingredients in detail", "width": 724, "height": 2172 },
    { "src": "/assets/uc-flex-reference-04-comparison-en-v1.png", "alt": "English K2 VITAL reference and side-by-side UC-Flex PLUS comparison", "caption": "Formula and packaging comparison", "width": 724, "height": 2172 },
    { "src": "/assets/uc-flex-reference-05-quality-en-v1.png", "alt": "English UC-Flex PLUS quality, certification and daily-use reference graphic", "caption": "Quality and daily use", "width": 885, "height": 1777 }
  ],
  "sourceUrl": "https://www.nafulife.com/products/uc-flex-plus-1",
  "sourceName": "瑩顧力PLUS複方膠囊（30粒/盒）",
  "functions": [
    "Combines six featured nutrients in one daily capsule",
    "Designed for everyday joint and bone nutrition",
    "Opaque Alu-Alu blister packaging; 30 capsules per box",
    "No added artificial colors or preservatives"
  ],
  "keyIngredients": [
    {
      "name": "UC-II® undenatured type II collagen",
      "description": "40 mg of the branded collagen ingredient shown in NAFU LIFE's formula graphic."
    },
    {
      "name": "AstaZine® astaxanthin",
      "description": "4 mg of branded astaxanthin from red algae in the featured formula."
    },
    {
      "name": "OptiMSM® methylsulfonylmethane",
      "description": "200 mg of MSM, a source of sulfur in the formula."
    },
    {
      "name": "K2 VITAL® vitamin K2 & algae calcium",
      "description": "Vitamin K2 and plant-derived calcium are included for normal bone nutrition."
    },
    {
      "name": "Magnesium glycinate",
      "description": "A magnesium source included alongside the other featured ingredients."
    }
  ],
  "howToUse": [
    "Take one capsule daily, following the directions on the package."
  ],
  "purpose": "Daily joint, bone and movement nutrition in a one-capsule serving."
},
{
  "slug": "vegan-algal-astaxanthin-complex-capsules",
  "name": "Vegan Algal Astaxanthin Complex Capsules",
  "short": "Capsules",
  "category": "Health Supplements",
  "type": "Capsules",
  "size": "30 capsules / box",
  "ingredient": "Algal astaxanthin 12 mg & sesamin 10 mg",
  "ingredients": [
    "astaxanthin"
  ],
  "position": "0% 0%",
  "benefit": "A plant-based daily capsule with 12 mg algal astaxanthin and 10 mg sesamin.",
  "description": "NAFU LIFE Vegan Red Algae Astaxanthin Complex Capsules combine 12 mg of algae-derived astaxanthin and 10 mg of sesame-derived sesamin per capsule. The formula also contains flaxseed oil, providing 27 mg omega-3, and soy-derived phosphatidylserine (1 mg). Both the ingredients and capsule shell are plant-based. Each 30-capsule box uses light-protective Alu-Alu blister packaging, with one capsule as the daily serving.",
  "routine": "Take one capsule once daily after a meal with water. Do not exceed one capsule per day.",
  "price": null,
  "image": "/assets/catalog-11.webp",
  "imageAlt": "Vegan Algal Astaxanthin Complex Capsules — NAFU LIFE product photograph",
  "galleryImages": [
    { "src": "/assets/sesamin-gallery-01-dose-en-v1.png", "alt": "English 12 mg astaxanthin per capsule comparison graphic", "label": "12 mg per capsule" },
    { "src": "/assets/sesamin-gallery-02-source-en-v1.png", "alt": "English comparison of krill and cultivated algae as astaxanthin sources", "label": "Vegan algae source" },
    { "src": "/assets/sesamin-gallery-03-blister-en-v1.png", "alt": "English guide to vegan capsules and protective Alu-Alu blister packaging", "label": "Protective packaging" }
  ],
  "longFormImages": [
    { "src": "/assets/sesamin-reference-01-en-v1.png", "alt": "English NAFU LIFE astaxanthin and sesamin overview", "caption": "Product overview", "width": 1316, "height": 1195, "reference": true },
    { "src": "/assets/sesamin-reference-02-en-v1.png", "alt": "English reference panel on unbalanced dining", "caption": "Everyday dining", "width": 1505, "height": 1045, "reference": true },
    { "src": "/assets/sesamin-reference-03-en-v1.png", "alt": "English reference panel on work and concentration", "caption": "Work and study", "width": 1506, "height": 1045, "reference": true },
    { "src": "/assets/sesamin-reference-04-en-v1.png", "alt": "English reference panel on fatigue during work", "caption": "Busy days", "width": 1505, "height": 1045, "reference": true },
    { "src": "/assets/sesamin-reference-05-en-v1.png", "alt": "English reference panel on settling down for sleep", "caption": "Evening routine", "width": 1505, "height": 1045, "reference": true },
    { "src": "/assets/sesamin-reference-06-en-v1.png", "alt": "English NAFU LIFE astaxanthin product illustration", "caption": "Daily routine", "width": 1166, "height": 1349, "reference": true },
    { "src": "/assets/sesamin-reference-07-en-v1.png", "alt": "English four-ingredient guide showing algal astaxanthin, sesamin, soy phospholipids and flaxseed oil", "caption": "Four featured ingredients", "width": 951, "height": 1654, "reference": true },
    { "src": "/assets/sesamin-reference-08-en-v1.png", "alt": "English introduction to algae-derived astaxanthin", "caption": "About astaxanthin", "width": 751, "height": 2092, "reference": true },
    { "src": "/assets/sesamin-reference-09-en-v1.png", "alt": "English red algae source illustration", "caption": "Red algae source", "width": 1343, "height": 1171, "reference": true },
    { "src": "/assets/sesamin-reference-10-en-v1.png", "alt": "English Algalif Icelandic astaxanthin sourcing and production overview", "caption": "Algalif sourcing", "width": 1047, "height": 1501, "reference": true },
    { "src": "/assets/sesamin-reference-11-en-v1.png", "alt": "English packaging-label explainer with per-capsule ingredient amounts", "caption": "Clearly labeled amounts", "width": 1418, "height": 1109, "reference": true },
    { "src": "/assets/sesamin-reference-12-en-v1.png", "alt": "English Alu-Alu blister and vegan capsule packaging guide", "caption": "Capsule packaging", "width": 1118, "height": 1407, "reference": true },
    { "src": "/assets/sesamin-reference-13-en-v1.png", "alt": "English plant-based formula and capsule-shell reference", "caption": "Plant-based formula", "width": 1086, "height": 1448, "reference": true },
    { "src": "/assets/sesamin-reference-14-en-v1.png", "alt": "English product information, ingredients, allergens and nutrition per capsule", "caption": "Product label and nutrition", "width": 1001, "height": 1571, "reference": true },
    { "src": "/assets/sesamin-reference-15-en-v1.png", "alt": "English reference to third-party reports for heavy metals, microorganisms and pesticide residues", "caption": "Quality-control reports", "width": 1198, "height": 1313, "reference": true }
  ],
  "sourceUrl": "https://www.nafulife.com/products/astaxanthinsesamin",
  "sourceName": "純素紅藻蝦紅素複方膠囊(30粒/盒)",
  "functions": [
    "12 mg algae-derived astaxanthin and 10 mg sesamin per daily capsule",
    "27 mg omega-3 from flaxseed oil and 1 mg soy-derived phosphatidylserine",
    "Plant-based formula and capsule shell with no added colorants",
    "Individually protected in Alu-Alu blister packaging"
  ],
  "keyIngredients": [
    {
      "name": "Algal astaxanthin",
      "description": "12 mg per capsule from Haematococcus pluvialis red algae extract."
    },
    {
      "name": "Sesamin",
      "description": "10 mg per capsule from sesame extract."
    },
    {
      "name": "Flaxseed oil",
      "description": "Provides 27 mg omega-3 per capsule."
    },
    {
      "name": "Soy phosphatidylserine",
      "description": "1 mg per capsule, from soy lecithin."
    }
  ],
  "howToUse": ["Take one capsule once daily after a meal with water. Do not exceed one capsule per day."],
  "purpose": "Plant-based daily nutrition featuring algal astaxanthin and sesamin.",
  "cautions": ["Contains sesame and soy.", "If pregnant, nursing, taking medication or managing a medical condition, consult a healthcare professional before use.", "Keep out of reach of children. Stop use if discomfort occurs."],
  "storage": "Store in a cool, dry place away from heat and direct sunlight.",
  "shelfLife": "3 years; see packaging for batch and expiry date."
}
];

export type SampleOption = { label: string; color?: string };
export const products: Product[] = catalogue;
export const productOptions = (p: Product): { label: string; options: SampleOption[] } => p.options ?? { label: p.size ? 'Size' : 'Product', options: [{ label: p.size?.replace(' bottle', '') ?? p.short }] };
export const productBrand = 'ASTAMALL';
export const categories = ['All', 'Skincare', 'Health Foods', 'Health Supplements'];
export const ingredients = [
  { slug: 'astaxanthin', name: 'Astaxanthin', caption: 'The beginning of our story.', text: 'Astaxanthin is the red ingredient that brought ASTAMALL to the meeting point of beauty, science and wellness.', use: 'Our ingredient education begins here. Understanding an ingredient is the first step, not a substitute for understanding the finished formula.', formula: 'Different product formats serve different routines. An ingredient name alone does not tell you its concentration or the performance of a finished product.' },
  { slug: 'asta-s', name: 'Asta-S Free-Form Astaxanthin', caption: 'Ingredient meets formulation.', text: 'Asta-S is a Taiwan-developed free-form astaxanthin technology featured within selected ASTAMALL formulas.', use: 'The ingredient developer describes this patented, non-esterified technology as designed for improved stability and bioavailability in skincare applications.', formula: 'This is an ingredient-developer description, not an independent ASTAMALL clinical claim. Supporting technical documents are pending review.' },
  { slug: 'fermented-yeast', name: 'Fermented Yeast', caption: 'A different formulation perspective.', text: 'Fermented yeast technology is part of the story behind Tibi Yeast Skin Balance Toner.', use: 'It is a featured ingredient technology in this ASTAMALL toner.', formula: 'The full ingredient list and the role of each component will be published after the final label is confirmed.' },
  { slug: 'collagen', name: 'Collagen', caption: 'The beauty-nutrition chapter.', text: 'Collagen is the featured ingredient in NAFU Collagen PLUS Quick-Charge Collagen Drink, in our Health Foods collection.', use: 'It introduces another format for everyday self-care alongside our topical beauty collection.', formula: 'Each 20 ml sachet provides 3,000 mg of French Naticol collagen. Read the product packaging for the complete ingredients and allergen information.' },
  { slug: 'hexapeptide', name: 'Hexapeptide', caption: 'Part of a considered formula.', text: 'Hexapeptide is one of the featured ingredients in Asta-S Rejuvenating Serum.', use: 'It is presented alongside Asta-S and sea fennel extract in this skincare formula.', formula: 'The precise ingredient identity, concentration and full INCI list are pending the final product documentation.' },
  { slug: 'sea-fennel', name: 'Sea Fennel', caption: 'A botanical formulation detail.', text: 'Sea fennel extract is one of the featured ingredients in Asta-S Rejuvenating Serum.', use: 'It sits alongside Asta-S astaxanthin and hexapeptide in the ASTAMALL serum formula.', formula: 'The final ingredient list and substantiated finished-product benefits will be added when documentation is available.' },
];

export const articles = [
  { slug: 'why-we-started-with-astaxanthin', title: 'Why we started with astaxanthin', category: 'Ingredient understanding', excerpt: 'One ingredient changed the way we looked at everyday beauty.', paragraphs: ['ASTAMALL started from a question: what if taking care of yourself could be simpler, smarter, and more meaningful?', 'The beauty and wellness world is full of ingredients, claims and complicated routines. We wanted to create something different, a place where people can understand what they are using, why it matters, and how it can support them in everyday life.', 'We began with Astaxanthin, an ingredient that opened our eyes to the connection between science, beauty and wellness.', 'Our aim is to make ingredient information easier to understand, while distinguishing confirmed product information from details still awaiting documentation. Better understanding. Better choices. Better care.'] },
  { slug: 'from-taiwan-to-malaysia', title: 'From Taiwan, thoughtfully selected', category: 'Our story', excerpt: 'The journey behind the products we bring home.', paragraphs: ['Our current collection is sourced from Taiwan, where science, biotechnology, and beauty innovation come together through advanced ingredients and carefully developed formulations.', 'We travelled over 3,000 km to understand it ourselves. Learning about the ingredient technology mattered to us before bringing the products home.', 'Today, we bring carefully selected beauty and wellness products from Taiwan to Malaysia, beginning with skincare, health foods, and health supplements.', 'As ASTAMALL grows, we aim to become a trusted beauty and wellness destination, introducing meaningful ingredients, better everyday routines, and products that support people through different stages of life. And this is only the beginning.'] },
  { slug: 'understanding-your-beauty-routine', title: 'A routine with a reason', category: 'Everyday beauty', excerpt: 'Start with understanding, not a longer list of products.', paragraphs: ['ASTAMALL is not simply a place to shop. We want you to understand what you use. We believe better choices begin with better knowledge.', 'A product’s place in your routine is useful context. Our product pages explain whether it belongs to Skincare, Health Foods or Health Supplements, without suggesting that every person needs every product.', 'Read the full label, ingredients and precautions before use. Product-specific directions will be published when our final packaging is confirmed.', 'If you have a question about the collection, contact us. We will distinguish confirmed information from details that are still being finalised.'] },
];

export const faqs = [
  { category: 'Products', q: 'What can I find at ASTAMALL?', a: 'Our collection includes 13 products across Skincare, Health Foods and Health Supplements: skincare and lip essentials, collagen drinks, probiotic coffees and nutritional capsules. Product details are translated from NAFU LIFE. Malaysian prices for all products are to be confirmed.' },
  { category: 'Ingredients', q: 'Where can I read the full ingredient lists?', a: 'Our ingredient library introduces featured ingredients. Full product ingredient lists are awaiting final label confirmation and will appear on each product page before purchase.' },
  { category: 'Astaxanthin', q: 'What is Asta-S?', a: 'Asta-S is a Taiwan-developed free-form astaxanthin technology featured within selected ASTAMALL formulas. Technical performance descriptions are attributed to the ingredient developer and are pending documentation review.' },
  { category: 'Orders', q: 'Can I place an order now?', a: 'Not yet. You can explore the collection and try the cart, but this is a storefront preview. Prices and live ordering are not available.' },
  { category: 'Payments', q: 'Which payment methods will be available?', a: 'The checkout preview shows Visa, Mastercard and bank transfer as planned methods. No gateway is connected and no payment is collected.' },
  { category: 'Delivery', q: 'Where will you deliver, and how long will it take?', a: 'Malaysia is our initial market. Delivery coverage, charges and timeframes are awaiting confirmation. They will be published before live orders open.' },
  { category: 'Returns', q: 'What is the returns policy?', a: 'The returns and refund policy is awaiting approval. We will publish eligibility, timeframes and instructions before accepting orders.' },
  { category: 'Contact', q: 'How can I contact ASTAMALL?', a: 'Email astamall92@gmail.com. You can also find us on Instagram and TikTok at @astamall92.' },
];

export const money = (value: number | null) => value === null ? 'To Be Confirmed' : new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(value);
