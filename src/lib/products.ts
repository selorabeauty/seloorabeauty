export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  price: number; // single-piece price
  originalPrice: number;
  rating: number;
  reviewCount: number;
  badge: string;
  badgeColor: string;
  sku: string;
  description: string;
  benefits: string[];
  ingredients: { name: string; role: string; benefit: string; icon: string }[];
  howToUse: string[];
  images: string[]; // product images
  heroImage?: string; // large routine/duo shot shown on product detail page
  imageBg: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

// ── Set / bundle pricing ──
// The store sells ONE thing only: the Copper Peptide Serum + Derma Roller
// duo at 199 SAR (was 279). The derma roller is always framed as a free gift.
export interface SetOption {
  id: string;
  includes: string[]; // product ids included in this set
  qty: number; // total physical pieces
  totalPrice: number;
  originalTotal: number; // crossed-out price
  label: string;
  perUnitLabel: string;
  badge: string | null;
  highlight: boolean;
  savingsLabel: string;
  sku: string;
  image: string; // thumbnail for this pack
}

export const SET_OPTIONS: SetOption[] = [
  {
    id: 'set-duo',
    includes: ['stretch-serum', 'stretch-cream'],
    qty: 2,
    totalPrice: 199,
    originalTotal: 279,
    label: 'باقة البداية — سيروم 30ml + ديرما رولر هدية مجانية',
    perUnitLabel: 'ديرما رولر مجاناً مع كل طلب',
    badge: '🎁 الديرما رولر هدية',
    highlight: false,
    savingsLabel: 'وفّري ٨٠ ريال',
    sku: 'SLR-SET-DUO',
    image: '/images/hero-duo.webp',
  },
  {
    id: 'set-duo-2',
    includes: ['stretch-serum', 'stretch-serum', 'stretch-cream'],
    qty: 3,
    totalPrice: 279,
    originalTotal: 558,
    label: 'باقة الكورس — سيرومان 30ml + ديرما رولر هدية',
    perUnitLabel: 'السيروم الواحد بـ ١٤٠ ر.س فقط + رولر مجاني',
    badge: '🔥 الأكثر طلباً — صفقة مربحة',
    highlight: true,
    savingsLabel: 'وفّري ٢٧٩ ريال',
    sku: 'SLR-SET-DUO2',
    image: '/images/pack-2-serum.webp',
  },
  {
    id: 'set-duo-3',
    includes: ['stretch-serum', 'stretch-serum', 'stretch-serum', 'stretch-cream'],
    qty: 4,
    totalPrice: 349,
    originalTotal: 837,
    label: 'باقة النتيجة الكاملة — ٣ سيرومات 30ml + ديرما رولر هدية',
    perUnitLabel: 'السيروم الواحد بـ ~١١٦ ر.س فقط + رولر مجاني',
    badge: '👑 أعلى توفير',
    highlight: false,
    savingsLabel: 'وفّري ٤٨٨ ريال',
    sku: 'SLR-SET-DUO3',
    image: '/images/pack-3-serum.webp',
  },
];

export function getSetProducts(set: SetOption): Product[] {
  return set.includes
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

/** Human-readable contents of a set, with repeated products collapsed as "×n". */
export function setIncludesLabels(set: SetOption): string[] {
  const counts = new Map<string, number>();
  getSetProducts(set).forEach((p) => counts.set(p.name, (counts.get(p.name) ?? 0) + 1));
  return Array.from(counts).map(([name, n]) => (n > 1 ? `${name} ×${n}` : name));
}

export const PRODUCTS: Product[] = [
  {
    id: 'stretch-serum',
    slug: 'stretch-mark-serum',
    name: 'سيروم ببتيدات النحاس الأزرق لترميم التشققات (30ml)',
    subtitle: 'GHK-Cu Copper Peptide + Centella (CICA) + Matrixyl 3000',
    tagline: 'ببتيدات النحاس الأزرق المركز 10,000ppm + سيكا · حجم 30 مل مركز',
    price: 199,
    originalPrice: 279,
    rating: 4.9,
    reviewCount: 1876,
    badge: 'الخطوة ١',
    badgeColor: 'gold',
    sku: 'SLR-SERUM-1',
    description:
      'سيروم متطور غني بببتيدات النحاس الزرقاء (GHK-Cu) المركزة مع السيكا (Centella) ومركب ماتريكسيل 3000. يخترق لطبقات الأدمة العميقة لردم ألياف التمدد الممزقة، وتفتيح لون التشققات الحمراء والبنفسجية والبيضاء، وإعادة بناء شبكة الإيلاستين المفقودة بتركيبة مركزة 30 مل.',
    benefits: [
      'ترميم ألياف الكولاجين العميقة: ببتيدات النحاس تحفز الفايبروبلاست لردم تمزقات الجلد من الداخل.',
      'استهداف التشققات الملونة والبيضاء: تفتيح ملحوظ في الخطوط الحمراء والبنفسجية وتوحيد لون البشرة.',
      'خلاصة السيكا الكورية (CICA): ترميم فائق للندبات وتهدئة سريعة بدون أي تحسس أو احمرار.',
      'امتصاص مائي خفيف وفوري: تركيبة غير دهنية تمتصها البشرة بثوانٍ دون أي لزوجة.',
      'تركيز عالٍ بحجم 30ml: عبوة عملية تكفي منطقة العلاج طوال الكورس.',
    ],
    ingredients: [
      { name: 'ببتيدات النحاس الزرقاء (GHK-Cu)', role: 'محفز الكولاجين الأقوى', benefit: 'يخترق لطبقة الأدمة لردم ألياف التمدد الممزقة وإعادة بناء شبكة الإيلاستين', icon: '🧬' },
      { name: 'سنتيلا أسياتيكا (CICA)', role: 'مرمم الأنسجة الكوري', benefit: 'مكون لطيف يهدئ البشرة ويرمم الندبات ويفتح الخطوط الملونة', icon: '🌿' },
      { name: 'ماتريكسيل 3000 (Matrixyl)', role: 'الببتيد المضاعف', benefit: 'يعزز كثافة النسيج الخلوي ويقلل من عمق وبروز التشققات البيضاء', icon: '🔬' },
      { name: 'حمض الهيالورونيك المتعدد', role: 'الترطيب الخلوي العميق', benefit: 'يحبس الرطوبة في أعماق الخلايا لمنح الجلد مرونة استثنائية تمنع التمزق', icon: '💧' },
      { name: 'النياسيناميد وفيتامين B5', role: 'مُوحد اللون والمرمم', benefit: 'يفتح التصبغات الحمراء والبنفسجية ويسرع التئام أنسجة الجلد', icon: '🛡️' },
    ],
    howToUse: [
      'نظفي منطقة التشققات (البطن، الفخذين، الأرداف، الظهر، الصدر) وجففيها برفق.',
      'ضعي قطرات كافية من سيروم ببتيدات النحاس الأزرق ودلكي بلطف حتى يتغلغل بالكامل.',
      'في أيام جلسة الديرما رولر (مرة إلى مرتين أسبوعياً): مرري الرولر أولاً ثم ضعي السيروم مباشرة لمضاعفة الامتصاص ٨٠٪.',
      'كرري استخدام السيروم يومياً صباحاً ومساءً للحصول على أقصى نتيجة خلال ٤-٨ أسابيع.',
    ],
    images: [
      '/images/serum-pedestal.webp',
      '/images/texture-drop.webp',
      '/images/roller-in-use.webp',
      '/images/hero-duo.webp',
      '/images/ingredients-infographic.webp',
    ],
    heroImage: '/images/serum-pedestal.webp',
    imageBg: 'from-amber-100 to-stone-200',
    isBestseller: true,
  },
  {
    id: 'stretch-cream',
    slug: 'stretch-mark-cream',
    name: 'ديرما رولر التيتانيوم للجسم (540 إبرة) — هدية مجانية',
    subtitle: 'Titanium Body Derma Roller 0.5mm — Free Gift',
    tagline: 'إبر تيتانيوم مجهرية 0.5mm · كبسولة حفظ معقمة · هدية مع كل طقم',
    price: 0,
    originalPrice: 49,
    rating: 4.8,
    reviewCount: 1542,
    badge: 'هدية مجانية 🎁',
    badgeColor: 'gold',
    sku: 'SLR-ROLLER-GIFT',
    description:
      'أداة ديرما رولر معقمة مخصصة لمساحات الجسم، مزودة بـ 540 إبرة تيتانيوم دقيقة بمقاس 0.5mm الآمن منزلياً. تعمل على فتح قنوات ميكروسكوبية لطيفة في النسيج المتصلب لتحفيز إنتاج الكولاجين الذاتي وزيادة امتصاص سيروم ببتيدات النحاس بنسبة ٨٠٪ — وتأتيكِ هدية مجانية داخل كل طقم.',
    benefits: [
      'تحفيز الكولاجين الذاتي: إبر التيتانيوم الدقيقة تحفز استجابة الشفاء الطبيعية لردم التشققات.',
      'تيتانيوم مقاوم للصدأ: جودة عالية تدوم طويلاً وأكثر أماناً من الإبر العادية.',
      'مضاعفة امتصاص السيروم 80%: يضمن وصول المكونات الفعالة لطبقة الأدمة حيث مكان التمزق.',
      'كبسولة تعقيم: تأتي معقمة ومحفوظة بغلاف محكم لحماية تامة من البكتيريا.',
      'مقاس 0.5mm منزلي آمن: مصمم للاستخدام السلس على البطن والفخذين والأرداف دون ألم حاد.',
    ],
    ingredients: [
      { name: '540 إبرة تيتانيوم', role: 'الإبر المجهرية الدقيقة', benefit: 'تيتانيوم عالي النقاء مقاوم للتآكل والصدأ لسلامة تامة للبشرة', icon: '🪡' },
      { name: 'مقاس 0.5 ملم الدقيق', role: 'المقاس المنزلي الآمن', benefit: 'يصل لعمق الكولاجين دون إحداث جروح أو نزيف لضمان أمان تام', icon: '📏' },
      { name: 'مقبض ذهبي مريح', role: 'التحكم والتوجيه', benefit: 'تصميم هندسي متوازن يوفر ضغطاً متساوياً على كامل منطقة التشققات', icon: '✨' },
      { name: 'كبسولة الحفظ المعقمة', role: 'التعقيم والحماية', benefit: 'تحفظ الرولر جافة ومعقمة بين الجلسات وتسهل تخزينها', icon: '🛡️' },
    ],
    howToUse: [
      'عقمي رأس الديرما رولر بكحول طبي قبل الاستخدام واتركيها تجف ثوانٍ.',
      'مرري الرولر بلطف على منطقة التشققات (عمودياً وأفقياً وقطرياً ٤-٥ مرات بدون ضغط قوي).',
      'ضعي قطرات سيروم ببتيدات النحاس الأزرق مباشرة بعد الانتهاء ودلكي بلطف.',
      'تُستخدم الديرما رولر مرة إلى مرتين أسبوعياً فقط مساءً.',
      'عقمي الرولر واحفظيها في كبسولتها بعد كل استخدام.',
    ],
    images: [
      '/images/gift-roller.webp',
      '/images/needle-macro.webp',
      '/images/roller-in-use.webp',
      '/images/hero-duo.webp',
    ],
    heroImage: '/images/gift-roller.webp',
    imageBg: 'from-amber-100 to-stone-200',
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCrossSells(currentSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.slug !== currentSlug);
}

const SET_IMAGES: Record<string, string> = {
  'set-duo':         '/images/hero-duo.webp',
  'set-duo-2':       '/images/pack-2-serum.webp',
  'set-duo-3':       '/images/pack-3-serum.webp',
  // legacy ids kept so old persisted carts still resolve an image
  'set-serum-only':  '/images/serum-pedestal.webp',
  'set-cream-only':  '/images/gift-roller.webp',
  'set-roller-only': '/images/gift-roller.webp',
  'set-complete':    '/images/hero-duo.webp',
  'set-double':      '/images/hero-duo.webp',
};

/** Map any product/set/cart item identifier to its image path(s). */
export function itemImages(item: { id?: string; sku?: string; name?: string }): string[] {
  if (item.id && SET_IMAGES[item.id]) return [SET_IMAGES[item.id]];
  const k = ((item.id || '') + ' ' + (item.sku || '') + ' ' + (item.name || '')).toLowerCase();
  if (k.includes('double') || k.includes('complete')) return ['/images/hero-duo.webp'];
  if (k.includes('roller') || k.includes('رولر') || k.includes('cream') || k.includes('كريم')) return ['/images/gift-roller.webp'];
  return ['/images/serum-pedestal.webp'];
}
