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

// ── Set / bundle pricing (exact structure from brief) ──
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
    id: 'set-serum-only',
    includes: ['stretch-serum'],
    qty: 1,
    totalPrice: 199,
    originalTotal: 249,
    label: 'سيروم ببتيدات النحاس المركز 100ml — عبوة واحدة',
    perUnitLabel: '199 ر.س',
    badge: null,
    highlight: false,
    savingsLabel: 'وفري ٥٠ ريال',
    sku: 'SLR-SERUM-1',
    image: '/images/copper-serum.webp',
  },
  {
    id: 'set-cream-only',
    includes: ['stretch-cream'],
    qty: 1,
    totalPrice: 199,
    originalTotal: 249,
    label: 'ديرما رولر التيتانيوم الطبية للجسم (0.5mm)',
    perUnitLabel: '199 ر.س',
    badge: null,
    highlight: false,
    savingsLabel: 'وفري ٥٠ ريال',
    sku: 'SLR-ROLLER-1',
    image: '/images/derma-roller.webp',
  },
  {
    id: 'set-complete',
    includes: ['stretch-serum', 'stretch-cream'],
    qty: 2,
    totalPrice: 279,
    originalTotal: 398,
    label: 'طقم الترميم المجهري — سيروم ببتيدات النحاس 100ml + ديرما رولر التيتانيوم',
    perUnitLabel: 'وفري ٣٠٪ عند الطلب الآن',
    badge: '⭐ الأكثر طلباً — كورس الترميم المتكامل',
    highlight: true,
    savingsLabel: 'وفري ١١٩ ريال',
    sku: 'SLR-SET-COMPLETE',
    image: '/images/copper-roller-duo.webp',
  },
  {
    id: 'set-double',
    includes: ['stretch-serum', 'stretch-cream', 'stretch-serum'],
    qty: 3,
    totalPrice: 389,
    originalTotal: 796,
    label: 'طقم الكورس المكثف — ٢ سيروم 100ml + ديرما رولر التيتانيوم',
    perUnitLabel: 'كورس ٣ أشهر كامل',
    badge: '🔥 باقة التوفير القصوى — كورس ٣ أشهر',
    highlight: false,
    savingsLabel: 'وفري ٤٠٧ ريال',
    sku: 'SLR-SET-DOUBLE',
    image: '/images/copper-roller-duo.webp',
  },
];

export function getSetProducts(set: SetOption): Product[] {
  return set.includes
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

export const PRODUCTS: Product[] = [
  {
    id: 'stretch-serum',
    slug: 'stretch-mark-serum',
    name: 'سيروم ببتيدات النحاس الأزرق لترميم التشققات (100ml)',
    subtitle: 'GHK-Cu Copper Peptide + Centella (CICA) + Matrixyl 3000',
    tagline: 'ببتيدات النحاس الأزرق المركز 10,000ppm + سيكا · حجم 100 مل كبير',
    price: 199,
    originalPrice: 249,
    rating: 4.9,
    reviewCount: 1876,
    badge: 'الخطوة ١',
    badgeColor: 'gold',
    sku: 'SLR-SERUM-1',
    description:
      'سيروم علاجي صيدلاني متقدم معتمد على القوة المعملية لببتيدات النحاس الزرقاء (GHK-Cu) المركزة مع السيكا (Centella) ومركب ماتريكسيل 3000. يخترق لطبقات الأدمة العميقة لردم ألياف التمدد الممزقة، وتفتيح لون التشققات الحمراء والبنفسجية والبيضاء، وإعادة بناء شبكة الإيلاستين المفقودة بحجم كبير 100 مل يكفي الجسم بالكامل.',
    benefits: [
      '🧬 ترميم ألياف الكولاجين العميقة: ببتيدات النحاس تحفز الفايبروبلاست لردم تمزقات الجلد من الداخل.',
      '🔴 استهداف التشققات الملونة والبيضاء: تفتيح ملحوظ في الخطوط الحمراء والبنفسجية وتوحيد لون البشرة.',
      '🌿 خلاصة السيكا الكورية (CICA): ترميم فائق للندبات وتهدئة سريعة بدون أي تحسس أو احمرار.',
      '⚡ امتصاص مائي خفيف وفوري: تركيبة صيدلانية غير دهنية تمتصها البشرة بثوانٍ دون أي لزوجة.',
      '🔬 تركيز معملي عالي بحجم 100ml: عبوة كبيرة تكفي روتيناً علاجياً متكاملاً لمنطقة البطن والأرداف والظهر.',
    ],
    ingredients: [
      { name: 'ببتيدات النحاس الزرقاء (GHK-Cu)', role: 'محفز الكولاجين الأقوى', benefit: 'يخترق لطبقة الأدمة لردم ألياف التمدد الممزقة وإعادة بناء شبكة الإيلاستين', icon: '🧬' },
      { name: 'سنتيلا أسياتيكا (CICA)', role: 'مرمم الأنسجة الكوري', benefit: 'المكون الطبي المعجزة لتهدئة وترميم الندبات وتفتيح الخطوط الملونة', icon: '🌿' },
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
    images: ['/images/copper-serum.webp', '/images/copper-roller-duo.webp'],
    heroImage: '/images/copper-roller-duo.webp',
    imageBg: 'from-blue-900 to-slate-950',
    isBestseller: true,
  },
  {
    id: 'stretch-cream',
    slug: 'stretch-mark-cream',
    name: 'ديرما رولر التيتانيوم الطبية للجسم (540 إبرة)',
    subtitle: 'Medical Titanium Body Derma Roller 0.5mm',
    tagline: 'إبر تيتانيوم مجهرية طبية 0.5mm · كبسولة معقمة طبياً',
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviewCount: 1542,
    badge: 'الخطوة ٢',
    badgeColor: 'gold',
    sku: 'SLR-ROLLER-1',
    description:
      'أداة ديرما رولر صيدلانية معقمة مخصصة لمساحات الجسم، مزودة بـ 540 إبرة تيتانيوم دقيقة بمقاس 0.5mm طبي آمن. تعمل على فتح قنوات ميكروسكوبية لطيفة في النسيج المتصلب لتحفيز إنتاج الكولاجين الذاتي وزيادة امتصاص سيروم ببتيدات النحاس بنسبة ٨٠٪.',
    benefits: [
      '🔬 تحفيز الكولاجين الذاتي: إبر التيتانيوم الدقيقة تحفز استجابة الشفاء الطبيعية لردم التشققات.',
      '🛡️ تيتانيوم طبي مقاوم للصدأ: جودة صيدلانية عالية تدوم طويلاً وأكثر أماناً من الإبر العادية.',
      '✨ مضاعفة امتصاص السيروم 80%: يضمن وصول المكونات الفعالة لطبقة الأدمة حيث مكان التمزق.',
      '🔒 كبسولة تعقيم طبية: تأتي معقمة ومحفوظة بغلاف محكم لحماية تامة من البكتيريا.',
      '👌 مقاس 0.5mm منزلي آمن: مصمم للاستخدام السلس على البطن والفخذين والأرداف دون ألم حاد.',
    ],
    ingredients: [
      { name: '540 إبرة تيتانيوم', role: 'الإبر المجهرية الطبية', benefit: 'تيتانيوم طبي عالي النقاء مقاوم للتآكل والصدأ لسلامة تامة للبشرة', icon: '🪡' },
      { name: 'مقاس 0.5 ملم الدقيق', role: 'المقاس الطبي المنزلي', benefit: 'يصل لعمق الكولاجين دون إحداث جروح أو نزيف لضمان أمان تام', icon: '📏' },
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
    images: ['/images/derma-roller.webp', '/images/copper-roller-duo.webp'],
    heroImage: '/images/copper-roller-duo.webp',
    imageBg: 'from-amber-900 to-stone-950',
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCrossSells(currentSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.slug !== currentSlug);
}

const SET_IMAGES: Record<string, string> = {
  'set-serum-only':  '/images/copper-serum.webp',
  'set-cream-only':  '/images/derma-roller.webp',
  'set-roller-only': '/images/derma-roller.webp',
  'set-complete':    '/images/copper-roller-duo.webp',
  'set-double':      '/images/copper-roller-duo.webp',
};

/** Map any product/set/cart item identifier to its image path(s). */
export function itemImages(item: { id?: string; sku?: string; name?: string }): string[] {
  if (item.id && SET_IMAGES[item.id]) return [SET_IMAGES[item.id]];
  const k = ((item.id || '') + ' ' + (item.sku || '') + ' ' + (item.name || '')).toLowerCase();
  if (k.includes('double') || k.includes('complete')) return ['/images/copper-roller-duo.webp'];
  if (k.includes('roller') || k.includes('رولر') || k.includes('cream') || k.includes('كريم')) return ['/images/derma-roller.webp'];
  return ['/images/copper-serum.webp'];
}
