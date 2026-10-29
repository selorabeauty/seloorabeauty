import { IMG, realImages } from './images';

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
  image: string | null; // thumbnail for this pack (null until a real photo exists)
}

export const SET_OPTIONS: SetOption[] = [
  {
    id: 'set-serum-only',
    includes: ['stretch-serum'],
    qty: 1,
    totalPrice: 199,
    originalTotal: 249,
    label: 'سيروم ببتيدات النحاس المركز 30ml — عبوة واحدة',
    perUnitLabel: '199 ر.س',
    badge: null,
    highlight: false,
    savingsLabel: 'وفّر ٥٠ ريال',
    sku: 'SLR-SERUM-1',
    image: IMG.serum,
  },
  {
    id: 'set-roller-only',
    includes: ['stretch-cream'],
    qty: 1,
    totalPrice: 49,
    originalTotal: 99,
    label: 'ديرما رولر التيتانيوم الطبية للجسم (0.5mm)',
    perUnitLabel: '49 ر.س',
    badge: null,
    highlight: false,
    savingsLabel: 'وفّر ٥٠ ريال',
    sku: 'SLR-ROLLER-1',
    image: IMG.roller,
  },
  {
    id: 'set-complete',
    includes: ['stretch-serum', 'stretch-cream'],
    qty: 2,
    totalPrice: 249,
    originalTotal: 279,
    label: 'طقم الترميم المجهري — سيروم ببتيدات النحاس 30ml + ديرما رولر التيتانيوم',
    perUnitLabel: 'وفّر ٣٠ ريال عند الطلب الآن',
    badge: '⭐ الأكثر طلباً — كورس الترميم المتكامل',
    highlight: true,
    savingsLabel: 'وفّر ٣٠ ريال',
    sku: 'SLR-SET-COMPLETE',
    image: IMG.duo,
  },
  {
    id: 'set-double',
    includes: ['stretch-serum', 'stretch-cream', 'stretch-serum'],
    qty: 3,
    totalPrice: 447,
    originalTotal: 498,
    label: 'طقم الكورس المكثف — ٢ سيروم 30ml + ديرما رولر التيتانيوم',
    perUnitLabel: 'كورس ٣ أشهر كامل',
    badge: '🔥 باقة التوفير القصوى — كورس ٣ أشهر',
    highlight: false,
    savingsLabel: 'وفّر ٥١ ريال',
    sku: 'SLR-SET-DOUBLE',
    image: IMG.duo,
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
    name: 'سيروم Daranca ببتيدات النحاس GHK-Cu + سيكا لتشققات الجسم (30ml)',
    subtitle: 'GHK-Cu Copper Peptide + Centella (CICA) + Matrixyl 3000',
    tagline: 'ببتيدات النحاس + سيكا · عبوة 30 مل بقطّارة للاستخدام الدقيق',
    price: 199,
    originalPrice: 249,
    rating: 4.9,
    reviewCount: 1876,
    badge: 'الخطوة ١',
    badgeColor: 'gold',
    sku: 'SLR-SERUM-1',
    description:
      'تعرف لحظة المرآة حين تلمح تشققات بطنك أو فخذيك وتفضّل تغطيتها؟ هي أثر حمل أو نمو أو تغيّر وزن، ولا تقلل من قيمتك. سيروم Daranca يجمع ببتيدات النحاس GHK-Cu وخلاصة السيكا (Centella) ومركب ماتريكسيل 3000 وحمض الهيالورونيك في قوام مائي خفيف يمتصه الجلد بسرعة، للعناية بمظهر التشققات الحمراء والبيضاء وتحسين مرونة الجلد وملمسه. عبوة 30 مل بقطّارة تمنحك تحكماً في الكمية، ويُنصح بطلب عبوتين للمساحات الأكبر. النتائج تختلف من بشرة لأخرى وتحتاج التزاماً منتظماً.',
    benefits: [
      '🧬 ببتيدات النحاس GHK-Cu: مكوّن معروف في أبحاث العناية بالبشرة لدعم مظهر الجلد المرن والمتماسك.',
      '🌿 خلاصة السيكا (Centella): تهدّئ البشرة وتمنح راحة بعد الاستخدام.',
      '💧 هيالورونيك + نياسيناميد + B5: ترطيب ومظهر أكثر توحداً للون الجلد.',
      '⚡ قوام مائي خفيف غير لزج: يُمتص بسرعة ويناسب الاستخدام صباحاً ومساءً.',
      '🔬 30 مل بقطّارة: جرعة دقيقة وسهلة الاستخدام.',
    ],
    ingredients: [
      { name: 'ببتيدات النحاس (GHK-Cu)', role: 'ببتيد العناية بالمرونة', benefit: 'مكوّن معروف في أبحاث العناية بالبشرة لدعم مظهر الجلد المتماسك والمرن', icon: '🧬' },
      { name: 'سنتيلا أسياتيكا (CICA)', role: 'مهدّئ نباتي', benefit: 'عشبة تقليدية تُستخدم لتهدئة البشرة والعناية بمظهر المناطق الحساسة', icon: '🌿' },
      { name: 'ماتريكسيل 3000 (Matrixyl)', role: 'ببتيد داعم', benefit: 'يُستخدم في منتجات العناية لتحسين ملمس البشرة ونعومتها', icon: '🔬' },
      { name: 'حمض الهيالورونيك', role: 'ترطيب عميق', benefit: 'يجذب الماء للبشرة لتبدو أكثر امتلاءً ومرونة', icon: '💧' },
      { name: 'النياسيناميد وفيتامين B5', role: 'توحيد اللون', benefit: 'يساعد على مظهر أكثر توحداً للون البشرة ويدعم حاجزها الطبيعي', icon: '🛡️' },
    ],
    howToUse: [
      'نظّف منطقة التشققات (البطن، الفخذين، الأرداف، الظهر، الصدر) وجففيها برفق.',
      'ضعي كمية كافية من السيروم ودلّك بحركات دائرية لطيفة حتى يمتص بالكامل.',
      'في أيام جلسة الديرما رولر (مرة إلى مرتين أسبوعياً): مرّر الرولر أولاً ثم ضعي السيروم مباشرة.',
      'كرري السيروم صباحاً ومساءً بانتظام ٨-١٢ أسبوعاً، وصوّر المنطقة كل أسبوعين لمتابعة التقدم.',
    ],
    images: realImages([IMG.serum, IMG.duo]),
    heroImage: IMG.duo ?? undefined,
    imageBg: 'from-blue-900 to-slate-950',
    isBestseller: true,
  },
  {
    id: 'stretch-cream',
    slug: 'stretch-mark-cream',
    name: 'ديرما رولر 0.5mm بإبر التيتانيوم للجسم (540 إبرة)',
    subtitle: 'Titanium Body Derma Roller 0.5mm',
    tagline: '540 إبرة تيتانيوم · مقاس 0.5mm للاستخدام المنزلي · كبسولة حافظة',
    price: 49,
    originalPrice: 99,
    rating: 4.8,
    reviewCount: 1542,
    badge: 'الخطوة ٢',
    badgeColor: 'gold',
    sku: 'SLR-ROLLER-1',
    description:
      'رولر للجسم بـ 540 إبرة تيتانيوم دقيقة بمقاس 0.5mm، مصمم لجلسة أسبوعية لطيفة على البطن والفخذين والأرداف قبل وضع السيروم. يأتي في كبسولة حافظة. عقّميه بكحول طبي قبل وبعد كل استخدام، ولا يُستخدم على جلد متهيج أو جروح، ولا يُشارك مع أحد. استشر طبيبك إذا كنت حاملاً أو لديك حالة جلدية.',
    benefits: [
      '🔬 جلسة أسبوعية لطيفة: تهيّئ سطح البشرة قبل وضع السيروم.',
      '🛡️ إبر تيتانيوم: خامة متينة ومقاومة للصدأ.',
      '👌 مقاس 0.5mm للمنزل: مصمم للاستخدام المنزلي على البطن والفخذين والأرداف.',
      '🔒 كبسولة حافظة: تحفظ الرولر نظيفاً بين الجلسات.',
    ],
    ingredients: [
      { name: '540 إبرة تيتانيوم', role: 'رأس الرولر', benefit: 'إبر دقيقة موزعة بانتظام لتغطية مساحة الجسم بسرعة', icon: '🪡' },
      { name: 'مقاس 0.5 ملم', role: 'مقاس منزلي', benefit: 'مقاس لطيف مخصص للاستخدام المنزلي', icon: '📏' },
      { name: 'مقبض مريح', role: 'التحكم', benefit: 'تصميم متوازن يوزع الضغط بالتساوي', icon: '✨' },
      { name: 'كبسولة الحفظ', role: 'النظافة', benefit: 'تحفظ الرولر جافاً ونظيفاً بين الجلسات وتسهل تخزينه', icon: '🛡️' },
    ],
    howToUse: [
      'عقمي رأس الديرما رولر بكحول طبي قبل الاستخدام واتركيها تجف ثوانٍ.',
      'مرّر الرولر بلطف على منطقة التشققات (عمودياً وأفقياً وقطرياً ٤-٥ مرات بدون ضغط قوي).',
      'ضعي قطرات سيروم ببتيدات النحاس الأزرق مباشرة بعد الانتهاء ودلّك بلطف.',
      'تُستخدم الديرما رولر مرة إلى مرتين أسبوعياً فقط مساءً.',
      'عقمي الرولر واحفظيها في كبسولتها بعد كل استخدام.',
    ],
    images: realImages([IMG.roller, IMG.duo]),
    heroImage: IMG.duo ?? undefined,
    imageBg: 'from-amber-900 to-stone-950',
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCrossSells(currentSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.slug !== currentSlug);
}

/** Map any product/set/cart item identifier to its real image path(s); empty until real photos exist. */
export function itemImages(item: { id?: string; sku?: string; name?: string }): string[] {
  const k = ((item.id || '') + ' ' + (item.sku || '') + ' ' + (item.name || '')).toLowerCase();
  if (k.includes('double') || k.includes('complete')) return realImages([IMG.duo]);
  if (k.includes('roller') || k.includes('رولر') || k.includes('cream') || k.includes('كريم')) return realImages([IMG.roller]);
  return realImages([IMG.serum]);
}
