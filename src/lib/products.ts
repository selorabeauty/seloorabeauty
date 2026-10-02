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
}

export const SET_OPTIONS: SetOption[] = [
  {
    id: 'set-serum-only',
    includes: ['stretch-serum'],
    qty: 1,
    totalPrice: 199,
    originalTotal: 249,
    label: 'السيروم فقط — قطعة واحدة',
    perUnitLabel: '199 ر.س',
    badge: null,
    highlight: false,
    savingsLabel: 'وفري ٥٠ ريال',
    sku: 'SLR-SERUM-1',
  },
  {
    id: 'set-cream-only',
    includes: ['stretch-cream'],
    qty: 1,
    totalPrice: 199,
    originalTotal: 249,
    label: 'الكريم فقط — قطعة واحدة',
    perUnitLabel: '199 ر.س',
    badge: null,
    highlight: false,
    savingsLabel: 'وفري ٥٠ ريال',
    sku: 'SLR-CREAM-1',
  },
  {
    id: 'set-complete',
    includes: ['stretch-serum', 'stretch-cream'],
    qty: 2,
    totalPrice: 279,
    originalTotal: 398,
    label: 'الروتين الكامل — علاج منزلي طبي متكامل',
    perUnitLabel: 'وفري ٣٠٪ عند الطلب الآن',
    badge: '⭐ الأفضل قيمة — الروتين المتكامل',
    highlight: true,
    savingsLabel: 'وفري ١١٩ ريال',
    sku: 'SLR-SET-COMPLETE',
  },
  {
    id: 'set-double',
    includes: ['stretch-serum', 'stretch-cream', 'stretch-serum', 'stretch-cream'],
    qty: 4,
    totalPrice: 389,
    originalTotal: 796,
    label: 'الطقم المزدوج — ٢ سيروم + ٢ كريم',
    perUnitLabel: '97 ر.س / قطعة',
    badge: '🔥 الأفضل قيمة — روتين شهرين',
    highlight: false,
    savingsLabel: 'وفري ٤٠٧ ريال',
    sku: 'SLR-SET-DOUBLE',
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
    name: 'سيروم علاج تشققات الجسم',
    subtitle: 'Body Stretch Mark Serum',
    tagline: 'زيت اللوز الحلو + زيت الأرجان · تغلغل سريع · 100 مل',
    price: 199,
    originalPrice: 249,
    rating: 4.9,
    reviewCount: 1876,
    badge: 'الخطوة ١',
    badgeColor: 'gold',
    sku: 'SLR-SERUM-1',
    description:
      'سيروم مكثّف فائق الاختراق مصمم بتقنية تغلغل خلوي عميق. يجمع بين قوة زيت اللوز الحلو وزيت الأرجان المغربي مع حمض الهيالورونيك وفيتامين E لاستهداف التشققات الحمراء والبنفسجية من المصدر. يتغلغل خلال ثوانٍ دون أي لزوجة، ليترك بشرتكِ مستعدة للخطوة الثانية.',
    benefits: [
      '🔬 تغلغل خلوي عميق: يصل إلى طبقات الأدمة حيث يبدأ التمزق النسيجي لعلاجه من الجذور.',
      '🔴 استهداف التشققات الملونة: فعال جداً في تفتيح لون التشققات الحمراء والبنفسجية والداكنة.',
      '⚡ امتصاص فائق السرعة: تركيبة خفيفة جداً تختفي في ثوانٍ دون ترك أي أثر لزج أو دهني.',
      '🤰 أمان تام: تركيبة طبيعية 100% آمنة تماماً للأم والجنين خلال فترة الحمل وبعد الولادة.',
      '🌿 غني بالمواد الفعالة: يحتوي على حمض الهيالورونيك، فيتامين E، وسينتيلا أسياتيكا لتعزيز الكولاجين.',
    ],
    ingredients: [
      { name: 'زيت اللوز الحلو', role: 'المُرطب العميق', benefit: 'يخترق طبقات الجلد ويُلين نسيج التشقق المتصلب استعداداً للتجدد', icon: '🌰' },
      { name: 'زيت الأرجان المغربي', role: 'محفز الكولاجين', benefit: 'غني بفيتامين E ويحفز تجدد الخلايا وإصلاح الأنسجة التالفة', icon: '🌿' },
      { name: 'حمض الهيالورونيك', role: 'الترطيب الخلوي', benefit: 'يحبس الرطوبة في أعماق الخلايا لمنحها المرونة الفائقة', icon: '💧' },
      { name: 'فيتامين E', role: 'المضاد للأكسدة', benefit: 'يحمي الخلايا الجديدة ويسرّع إصلاح الأنسجة التالفة', icon: '🛡️' },
      { name: 'سينتيلا أسياتيكا', role: 'مجدد الأنسجة', benefit: 'المكون الطبيعي الأقوى لدعم إنتاج الكولاجين وطمس الندبات', icon: '🌱' },
    ],
    howToUse: [
      'نظفي منطقة التشققات (البطن، الفخذين، الأرداف، الصدر) وجففيها برفق.',
      'ضعي كمية كافية من السيروم ودلكي بحركات دائرية حتى يتغلغل بالكامل.',
      'ركزي على أطراف التشقق لمدة دقيقة كاملة لتنشيط الدورة الدموية.',
      'اتبعيه مباشرة بكريم علاج التشققات لإغلاق الرطوبة ومضاعفة الفعالية.',
      'استخدميه صباحاً ومساءً للنتائج الأمثل خلال ٤-٨ أسابيع.',
    ],
    images: ['/images/stretch-serum-1.png', '/images/routine-duo.jpg'],
    heroImage: '/images/routine-duo.jpg',
    imageBg: 'from-bark-800 to-bark-900',
    isBestseller: true,
  },
  {
    id: 'stretch-cream',
    slug: 'stretch-mark-cream',
    name: 'كريم علاج تشققات الجسم',
    subtitle: 'Stretch Mark Cream',
    tagline: 'زيت اللوز الحلو + زيت الأرجان · تركيبة كثيفة مغذية · 150 مل',
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviewCount: 1542,
    badge: 'الخطوة ٢',
    badgeColor: 'sage',
    sku: 'SLR-CREAM-1',
    description:
      'كريم غني بقوام زبدي فاخر، يجمع بين زبدة الشيا وزيت اللوز والأرجان. يعمل كمغناطيس للرطوبة، حيث يغلق الفوائد التي قدمها السيروم داخل البشرة ويبني حاجزاً واقياً يمنع ظهور تشققات مستقبلية. الخطوة الثانية والأهم لاستعادة مرونة بشرتكِ.',
    benefits: [
      '🧈 قوام زبدي غني: يغذي البشرة بعمق ويمنحها نعومة فورية تدوم طوال اليوم.',
      '🛡️ حاجز حماية طبيعي: زبدة الشيا تشكل درعاً يحبس الرطوبة ويمنع تمزق الجلد عند التمدد.',
      '✨ وقاية من التشققات المستقبلية: يبني مرونة فائقة في الأنسجة لتتحمل تغيرات الوزن أو الحمل.',
      '🤰 مرونة قصوى للأمهات: مثالي للبطن والأرداف والصدر لضمان بقاء الجلد مشدوداً وناعماً.',
      '🤍 امتصاص مثالي: رغم كثافته، يمتص بفعالية ليسمح لكِ بارتداء ملابسكِ فوراً.',
    ],
    ingredients: [
      { name: 'زبدة الشيا الأفريقية', role: 'الحاجز الواقي الأقوى', benefit: 'تشكّل طبقة حماية تحبس الرطوبة وتمنح البشرة ليونة فائقة', icon: '🧈' },
      { name: 'زيت اللوز الحلو المركز', role: 'المغذي الخلوي', benefit: 'يغذي الطبقات السطحية ويمنح مرونة فورية للأنسجة المتمددة', icon: '�' },
      { name: 'زيت الأرجان المغربي', role: 'مُعيد بناء الكولاجين', benefit: 'يعزز إنتاج الكولاجين الطبيعي ويقلل من ظهور التشققات الجديدة', icon: '🌿' },
      { name: 'فيتامين E', role: 'المضاد للأكسدة', benefit: 'يحمي حاجز البشرة ويدعم التجدد الخلوي الصحي', icon: '🛡️' },
      { name: 'البانثينول (B5)', role: 'المرمم والمهدئ', benefit: 'يهدئ تهيج الجلد الناتج عن التمدد ويسرع عملية الترميم', icon: '💧' },
    ],
    howToUse: [
      'يُستخدم مباشرة بعد سيروم علاج التشققات لإغلاق الرطوبة.',
      'ضعي كمية سخية على منطقة التشققات ودلكي حتى الامتصاص الكامل.',
      'كرري صباحاً ومساءً — وخصوصاً بعد الاستحمام لبشرة أكثر استيعاباً.',
      'للحوامل: ابدئي من الشهر الرابع على البطن والأرداف والصدر يومياً.',
      'نتائج ملحوظة خلال ٤ أسابيع، وتحول كامل خلال ٨-١٢ أسبوعاً.',
    ],
    images: ['/images/stretch-cream-1.png', '/images/routine-duo.jpg'],
    heroImage: '/images/routine-duo.jpg',
    imageBg: 'from-emerald-800 to-bark-900',
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCrossSells(currentSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.slug !== currentSlug);
}

/** Map any product/set/cart item identifier to its image path(s). */
export function itemImages(item: { id?: string; sku?: string; name?: string }): string[] {
  const k = `${item.id || ''} ${item.sku || ''} ${item.name || ''}`.toLowerCase();
  const serum = '/images/stretch-serum-1.png';
  const cream = '/images/stretch-cream-1.png';
  if (k.includes('complete') || k.includes('double')) return [serum, cream];
  if (k.includes('cream') || k.includes('كريم')) return [cream];
  return [serum];
}
