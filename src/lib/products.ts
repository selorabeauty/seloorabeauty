export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  badge: string;
  badgeColor: string;
  description: string;
  benefits: string[];
  ingredients: { name: string; role: string; benefit: string; icon: string }[];
  howToUse: string[];
  image: string;
  imageBg: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

// ── Bundle pricing ──
export interface Bundle {
  id: string;
  qty: number;
  totalPrice: number;
  originalTotal: number; // crossed-out price
  label: string;
  perUnitLabel: string;
  badge: string | null;
  highlight: boolean;
  savingsLabel: string;
}

export const BUNDLES: Bundle[] = [
  {
    id: 'bundle-1',
    qty: 1,
    totalPrice: 199,
    originalTotal: 299,
    label: 'قطعة واحدة',
    perUnitLabel: '199 ر.س / قطعة',
    badge: null,
    highlight: false,
    savingsLabel: 'وفري ١٠٠ ريال',
  },
  {
    id: 'bundle-2',
    qty: 2,
    totalPrice: 249,
    originalTotal: 398,
    label: 'قطعتين — كورس شهر',
    perUnitLabel: '124 ر.س / قطعة',
    badge: '🔥 الأكثر طلباً',
    highlight: false,
    savingsLabel: 'وفري ١٤٩ ريال',
  },
  {
    id: 'bundle-3',
    qty: 3,
    totalPrice: 379,
    originalTotal: 597,
    label: '٣ قطع — الكورس الكامل',
    perUnitLabel: '126 ر.س / قطعة',
    badge: '⭐ الأفضل قيمة',
    highlight: true,
    savingsLabel: 'وفري ٢١٨ ريال',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'retinal-serum',
    slug: 'retinal-skin-booster-serum',
    // ── Updated name & tagline to match new pain-point focus ──
    name: 'سيروم الريتينال المُجدِّد',
    subtitle: 'Retinal Skin Booster Serum',
    tagline: 'الريتينال المُغلَّف · ترميم التشققات · ترطيب اليدين · 150 مل',
    price: 199,
    originalPrice: 299,
    rating: 4.9,
    reviewCount: 2431,
    badge: 'الأكثر مبيعاً',
    badgeColor: 'gold',
    // ── Main product description ──
    description:
      'تركيبة ريتينال مركزة تعمل على مستوى الخلايا؛ لتجديد مظهر التشققات، علاج تجاعيد واسمرار اليدين من القيادة اليومية، وإعادة المرونة والشباب لبشرتكِ. نتائج مرئية خلال ٤ أسابيع.',
    // ── Exact bullet points from brief ──
    benefits: [
      '🧬 ترميم عميق للتشققات: يحفز إنتاج الكولاجين لتحسين مظهر الخطوط وتشققات الجسم بشكل ملحوظ.',
      '🚗 حماية وترميم اليدين: يعالج اسمرار السواقة والتجاعيد الناتجة عن التعرض للشمس والجفاف.',
      '✨ تجديد مظهر البشرة والوجه: يمنحكِ بشرة مشدودة، موحدة اللون، وأكثر نضارة بدون وعود فارغة.',
      '💧 ترطيب عميق على ٣ مستويات: يصل للطبقات الداخلية لمنح ليونة دائمة طوال اليوم.',
      '🌿 آمن للبشرة الحساسة: التغليف النانوي يقلل التهيج — ناعم حتى على بشرة ما بعد الحمل.',
    ],
    ingredients: [
      { name: 'الريتينال المُغلَّف', role: 'مجدد الخلايا', benefit: 'يحفز الكولاجين ويجدد الخلايا بعمق دون تهيج — أقوى ١١ مرة من الريتينول', icon: '🔬' },
      { name: 'الببتيد الثلاثي', role: 'مُشد البشرة', benefit: 'يُرسل إشارات لإنتاج الكولاجين والإيلاستين — يُحسّن مرونة التشققات', icon: '⚡' },
      { name: 'النياسيناميد 10%', role: 'موحد البشرة', benefit: 'يقلص المسام، يخفف اسمرار اليدين، ويوحد لون البشرة', icon: '✨' },
      { name: 'حمض الهيالورونيك', role: 'الترطيب العميق', benefit: 'يرطب على ٣ مستويات — من السطح حتى العمق', icon: '💧' },
      { name: 'البانثينول', role: 'المهدئ والمرمم', benefit: 'يهدئ الاحمرار ويرمم الحاجز الجلدي المتضرر من الجفاف', icon: '🌿' },
      { name: 'سينتيلا أسياتيكا', role: 'محفز الكولاجين', benefit: 'يدعم مرونة البشرة ويساهم في إصلاح الأنسجة المتضررة', icon: '🌱' },
    ],
    howToUse: [
      'نظفي البشرة المستهدفة (الوجه، اليدين، أو مناطق التشققات) وجففيها برفق.',
      'ضعي ٣-٤ قطرات وافركيها بحركات دائرية حتى تُمتص بالكامل.',
      'للتشققات: ركزي على المنطقة ودلكيها لمدة دقيقة كاملة.',
      'لليدين: ضعيه على ظهر اليدين قبل النوم واتركيه يتشرب طوال الليل.',
      'أتبعيه بواقٍ من الشمس SPF 50 صباحاً — ضروري مع الريتينال.',
    ],
    image: '/images/retinal-serum.jpg',
    imageBg: 'from-bark-800 to-bark-900',
    isBestseller: true,
  },
  {
    id: 'niacinamide-serum',
    slug: 'niacinamide-pore-refiner-serum',
    name: 'سيروم النياسيناميد المنقّط',
    subtitle: 'Niacinamide Pore Refiner Serum',
    tagline: 'النياسيناميد 10% + زنك · 30 مل',
    price: 189,
    originalPrice: 259,
    rating: 4.8,
    reviewCount: 1847,
    badge: 'جديد',
    badgeColor: 'sage',
    description:
      'سيروم تنقية المسام بتركيز 10% نياسيناميد و1% زنك — يقلص المسام، يوازن الزيوت، ويمنح بشرة ناعمة ومشرقة في أسبوعين.',
    benefits: [
      'يقلص المسام الموسعة بشكل ملحوظ',
      'يوازن إفراز الزيوت ويمنع اللمعة الزائدة',
      'يوحد لون البشرة ويخفف الاحمرار',
      'يقوي الحاجز الجلدي ويحميه',
      'خفيف جداً — مثالي للبشرة الدهنية والمختلطة',
    ],
    ingredients: [
      { name: 'النياسيناميد 10%', role: 'موحد البشرة', benefit: 'يقلص المسام ويوحد اللون', icon: '✨' },
      { name: 'زنك PCA 1%', role: 'منظم الزيوت', benefit: 'يوازن الدهون ويمنع اللمعة', icon: '⚖️' },
      { name: 'حمض الهيالورونيك', role: 'الترطيب', benefit: 'يحافظ على ترطيب البشرة دون ثقل', icon: '💧' },
      { name: 'البانثينول', role: 'المهدئ', benefit: 'يهدئ الالتهابات ويقلل الاحمرار', icon: '🌿' },
    ],
    howToUse: [
      'نظفي وجهك ثم جففيه',
      'ضعي 2-3 قطرات على الوجه كاملاً',
      'انتظري دقيقة ثم ضعي المرطب',
      'يمكن الاستخدام صباحاً ومساءً',
    ],
    image: '/images/niacinamide-serum.jpg',
    imageBg: 'from-emerald-700 to-emerald-900',
    isNew: true,
  },
  {
    id: 'vitamin-c-serum',
    slug: 'vitamin-c-brightening-serum',
    name: 'سيروم فيتامين سي المُضيء',
    subtitle: 'Vitamin C Brightening Serum',
    tagline: 'فيتامين سي المستقر 15% · 30 مل',
    price: 199,
    originalPrice: 289,
    rating: 4.7,
    reviewCount: 1203,
    badge: 'الأكثر طلباً',
    badgeColor: 'gold',
    description:
      'سيروم الإضاءة بفيتامين سي المستقر 15% — يوحد البشرة، يخفف البقع الداكنة، ويمنح توهجاً حقيقياً من الداخل في 3 أسابيع.',
    benefits: [
      'يوحد لون البشرة ويمنح الإشراق',
      'يخفف البقع الداكنة وآثار حب الشباب',
      'يحمي من أضرار الشمس والتلوث',
      'يحفز الكولاجين لبشرة أكثر شباباً',
      'تركيبة مستقرة — لا تتأكسد',
    ],
    ingredients: [
      { name: 'فيتامين سي المستقر 15%', role: 'المُضيء', benefit: 'يوحد البشرة ويمنح الإشراق', icon: '🍊' },
      { name: 'فيتامين إي', role: 'المضاد للأكسدة', benefit: 'يحمي من الجذور الحرة والتلوث', icon: '🛡️' },
      { name: 'حمض الفيروليك', role: 'المثبت', benefit: 'يعزز فعالية فيتامين سي وإي', icon: '⚗️' },
      { name: 'حمض الهيالورونيك', role: 'الترطيب', benefit: 'يحافظ على ترطيب البشرة', icon: '💧' },
    ],
    howToUse: [
      'نظفي وجهك ثم جففيه',
      'ضعي 3-4 قطرات صباحاً قبل المرطب',
      'أتبعيه بواقٍ من الشمس SPF 50',
      'استخدمي مساءً للنتائج المضاعفة',
    ],
    image: '/images/vitamin-c-serum.jpg',
    imageBg: 'from-amber-600 to-orange-800',
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCrossSells(currentSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.slug !== currentSlug).slice(0, 2);
}
