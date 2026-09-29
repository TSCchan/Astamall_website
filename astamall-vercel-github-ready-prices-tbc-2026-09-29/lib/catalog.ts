export type Product = {
  slug: string; name: string; short: string; category: string; type: string;
  ingredient: string; ingredients: string[]; position: string; benefit: string;
  description: string; routine: string; award?: string; price: number | null;
  sourceUrl?: string; sourceName?: string; options?: { label: string; options: SampleOption[] }; official?: boolean; image?: string; imageAlt?: string; size?: string;
  galleryImages?: Array<{ src: string; alt: string; label: string }>;
  longFormImages?: Array<{ src: string; alt: string; caption: string; width: number; height: number }>;
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
  "longFormImages": [
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
  "ingredient": "Naticol collagen, astaxanthin & vitamin C",
  "ingredients": [
    "collagen",
    "asta-s"
  ],
  "position": "0% 0%",
  "benefit": "3,000 mg of French collagen in each convenient sachet.",
  "description": "A ready-to-drink collagen formula containing 3,000 mg of French Naticol collagen per sachet, with astaxanthin, sodium hyaluronate, brown-rice ceramides, vitamin C and iron. A convenient daily addition to your beauty nutrition routine.",
  "routine": "The manufacturer lists one sachet daily for routine use, or two sachets for enhanced use. Follow the product label.",
  "price": null,
  "image": "/assets/catalog-5-en-v1.webp",
  "imageAlt": "NAFU Collagen PLUS Quick-Charge Collagen Drink — NAFU LIFE product photograph",
  "sourceUrl": "https://www.nafulife.com/products/nafucollagen-2-1",
  "sourceName": "晶瑩PLUS快充膠原飲(20ml/包，20包/盒)",
  "functions": [
    "Provides 3,000 mg collagen per sachet",
    "Combines collagen with vitamin C and iron",
    "Convenient 20 ml ready-to-drink format"
  ],
  "keyIngredients": [
    {
      "name": "Naticol collagen",
      "description": "3,000 mg of French collagen per sachet."
    },
    {
      "name": "Astaxanthin, sodium hyaluronate & brown-rice ceramides",
      "description": "Featured ingredients in the beauty nutrition blend."
    },
    {
      "name": "Vitamin C & iron",
      "description": "Vitamin C supports normal collagen formation and iron absorption."
    }
  ]
},
{
  "slug": "probiotic-drip-coffee-morning-fruit",
  "name": "Probiotic Drip Coffee — Morning Fruit",
  "short": "Drip coffee",
  "category": "Health Foods",
  "type": "Drip coffee",
  "size": "10 drip bags / box",
  "ingredient": "Coffee & three-strain probiotic blend",
  "ingredients": [],
  "position": "0% 0%",
  "benefit": "A fruity medium-light roast with a clean finish.",
  "description": "A NAFU LIFE × Come True Coffee collaboration combining specialty coffee with a three-strain probiotic formula in a patented heat-resistant brewing bag. The Morning Fruit blend is medium-light roasted, with notes of plum, raisin, biscuit and black tea.",
  "routine": "Brew using the drip-bag directions on the packaging; follow the specified water amount and temperature.",
  "price": null,
  "image": "/assets/catalog-6.webp",
  "imageAlt": "Probiotic Drip Coffee — Morning Fruit — NAFU LIFE product photograph",
  "sourceUrl": "https://www.nafulife.com/products/probiotic-dripcoffee-flavor2-box",
  "sourceName": "益予成真 益生菌濾掛咖啡（晨光果露) 10包/盒",
  "functions": [
    "Medium-light roast with fruit-forward aromas",
    "Individually packed drip bags",
    "A convenient coffee and probiotic combination"
  ],
  "keyIngredients": [
    {
      "name": "Medium-light roast coffee",
      "description": "Plum, raisin, biscuit and black-tea aroma notes."
    },
    {
      "name": "Three-strain probiotic formula",
      "description": "Included in the manufacturer’s patented heat-resistant brewing bag."
    }
  ],
  "award": "2022 iTQi Superior Taste Award — 2 stars."
},
{
  "slug": "probiotic-drip-coffee-cocoa-waltz",
  "name": "Probiotic Drip Coffee — Cocoa Waltz",
  "short": "Drip coffee",
  "category": "Health Foods",
  "type": "Drip coffee",
  "size": "10 drip bags / box",
  "ingredient": "Coffee & three-strain probiotic blend",
  "ingredients": [],
  "position": "0% 0%",
  "benefit": "A rounded medium roast with cocoa and walnut notes.",
  "description": "A NAFU LIFE × Come True Coffee collaboration pairing specialty coffee with a three-strain probiotic formula in a patented heat-resistant brewing bag. Cocoa Waltz is medium roasted, with chocolate, walnut and buttery aroma notes and a clean finish.",
  "routine": "Brew using the drip-bag directions on the packaging; follow the specified water amount and temperature.",
  "price": null,
  "image": "/assets/catalog-7.webp",
  "imageAlt": "Probiotic Drip Coffee — Cocoa Waltz — NAFU LIFE product photograph",
  "sourceUrl": "https://www.nafulife.com/products/probiotic-dripcoffee-flavor1-box",
  "sourceName": "益予成真 益生菌濾掛咖啡（可可圓舞曲) 10包/盒",
  "functions": [
    "Medium roast with a rounded flavour",
    "Individually packed drip bags",
    "A convenient coffee and probiotic combination"
  ],
  "keyIngredients": [
    {
      "name": "Medium roast coffee",
      "description": "Chocolate, walnut and buttery aroma notes."
    },
    {
      "name": "Three-strain probiotic formula",
      "description": "Included in the manufacturer’s patented heat-resistant brewing bag."
    }
  ],
  "award": "2022 iTQi Superior Taste Award — 2 stars."
},
{
  "slug": "lean-life-coffee",
  "name": "LEAN LIFE Slimming Coffee",
  "short": "Coffee",
  "category": "Health Foods",
  "type": "Coffee",
  "size": "10 sachets / box",
  "ingredient": "Arabica coffee & five-culture blend",
  "ingredients": [],
  "position": "0% 0%",
  "benefit": "Full-bodied Arabica coffee with five added cultures.",
  "description": "LEAN LIFE Coffee combines 100% Arabica coffee selected under HWC Coffee supervision with five added cultures. High-temperature extraction followed by rapid cooling preserves the coffee’s rich aroma in a convenient sachet format.",
  "routine": "Prepare according to the directions on the product packaging.",
  "price": null,
  "image": "/assets/catalog-8.webp",
  "imageAlt": "LEAN LIFE Slimming Coffee — NAFU LIFE product photograph",
  "sourceUrl": "https://www.nafulife.com/products/leanlifecoffee-slimpro-1box",
  "sourceName": "LEAN LIFE Coffee 孅盈咖啡（10包/盒）",
  "functions": [
    "100% Arabica coffee",
    "Contains five added cultures",
    "Convenient individually packed sachets"
  ],
  "keyIngredients": [
    {
      "name": "100% Arabica coffee",
      "description": "Selected under HWC Coffee supervision."
    },
    {
      "name": "Five-culture blend",
      "description": "Includes Bifidobacterium animalis, butyric-acid bacteria, Kluyveromyces marxianus, Lactobacillus plantarum and spore-forming lactic-acid bacteria."
    }
  ]
},
{
  "slug": "quick-charge-blueberry-night-capsules",
  "name": "Quick-Charge Blueberry Night Capsules",
  "short": "Capsules",
  "category": "Health Supplements",
  "type": "Capsules",
  "size": "30 capsules / pouch",
  "ingredient": "Bilberry, maqui berry & vitamin A",
  "ingredients": [
    "asta-s"
  ],
  "position": "0% 0%",
  "benefit": "Plant-based capsules for everyday eye nutrition.",
  "description": "A vegan capsule formula designed for night owls and frequent screen users. It combines bilberry, grape seed, maqui berry, algal astaxanthin, piperine and vitamin A. Made without preservatives or sweeteners.",
  "routine": "Follow the directions and recommended serving on the product packaging.",
  "price": null,
  "image": "/assets/catalog-9-en-v1.webp",
  "imageAlt": "Quick-Charge Blueberry Night Capsules — NAFU LIFE product photograph",
  "sourceUrl": "https://www.nafulife.com/products/blueberry-capsules-1",
  "sourceName": "快充藍莓夜膠囊(30入/袋)",
  "functions": [
    "Vegan formula and capsule shell",
    "No added preservatives or sweeteners",
    "Combines botanical extracts with vitamin A"
  ],
  "keyIngredients": [
    {
      "name": "Bilberry & grape seed extracts",
      "description": "Bilberry extract provides 25% anthocyanins; grape seed extract provides 80% proanthocyanidins."
    },
    {
      "name": "Maqui berry & algal astaxanthin",
      "description": "Featured ingredients in the eye-nutrition blend."
    },
    {
      "name": "Piperine & vitamin A",
      "description": "Piperine is included to support nutrient absorption; vitamin A supports normal vision."
    }
  ]
},
{
  "slug": "uc-flex-plus-capsules",
  "name": "UC-Flex PLUS Complex Capsules",
  "short": "Capsules",
  "category": "Health Supplements",
  "type": "Capsules",
  "size": "30 capsules / box",
  "ingredient": "UC-II, astaxanthin & OptiMSM",
  "ingredients": [
    "asta-s"
  ],
  "position": "0% 0%",
  "benefit": "Six featured nutrients for everyday mobility support.",
  "description": "A multi-ingredient capsule formula combining UC-II, Astazine astaxanthin, OptiMSM, vitamin K2, algae calcium and magnesium glycinate. Developed for daily joint and bone nutrition in a convenient capsule format.",
  "routine": "Follow the directions and recommended serving on the product packaging.",
  "price": null,
  "image": "/assets/catalog-10-en-v1.webp",
  "imageAlt": "UC-Flex PLUS Complex Capsules — NAFU LIFE product photograph",
  "sourceUrl": "https://www.nafulife.com/products/uc-flex-plus-1",
  "sourceName": "瑩顧力PLUS複方膠囊（30粒/盒）",
  "functions": [
    "Combines six featured nutrients",
    "Designed for joint and bone nutrition",
    "Convenient 30-capsule box"
  ],
  "keyIngredients": [
    {
      "name": "UC-II & OptiMSM",
      "description": "Featured ingredients for joint nutrition and mobility support."
    },
    {
      "name": "Astazine astaxanthin",
      "description": "Included in the multi-ingredient nutrition blend."
    },
    {
      "name": "Vitamin K2 & algae calcium",
      "description": "Nutrients included to support normal bone health."
    },
    {
      "name": "Magnesium glycinate",
      "description": "A source of magnesium in the formula."
    }
  ]
},
{
  "slug": "vegan-algal-astaxanthin-complex-capsules",
  "name": "Vegan Algal Astaxanthin Complex Capsules",
  "short": "Capsules",
  "category": "Health Supplements",
  "type": "Capsules",
  "size": "30 capsules / box",
  "ingredient": "Algal astaxanthin & sesamin",
  "ingredients": [
    "asta-s"
  ],
  "position": "0% 0%",
  "benefit": "A vegan blend of astaxanthin, sesamin and plant oils.",
  "description": "A vegan supplement combining algal astaxanthin, sesamin, phospholipids and flaxseed oil. Both the formula and capsule shell are plant-based. Designed as a convenient addition to a daily wellness routine.",
  "routine": "Follow the directions and recommended serving on the product packaging.",
  "price": null,
  "image": "/assets/catalog-11.webp",
  "imageAlt": "Vegan Algal Astaxanthin Complex Capsules — NAFU LIFE product photograph",
  "sourceUrl": "https://www.nafulife.com/products/astaxanthinsesamin",
  "sourceName": "純素紅藻蝦紅素複方膠囊(30粒/盒)",
  "functions": [
    "Vegan formula and capsule shell",
    "Combines astaxanthin with sesamin",
    "Includes phospholipids and flaxseed oil"
  ],
  "keyIngredients": [
    {
      "name": "Algal astaxanthin & sesamin",
      "description": "The formula’s two featured ingredients."
    },
    {
      "name": "Phospholipids & flaxseed oil",
      "description": "Provide additional nutritional lipids; flaxseed oil is a source of omega-3."
    }
  ]
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
