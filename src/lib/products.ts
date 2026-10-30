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
  sku: string;
  description: string;
  benefits: string[];
  ingredients: { name: string; role: string; benefit: string; icon: string }[];
  howToUse: string[];
  images: string[];
  heroImage?: string;
  imageBg: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface SetOption {
  id: string;
  includes: string[];
  qty: number;
  totalPrice: number;
  originalTotal: number;
  label: string;
  perUnitLabel: string;
  badge: string | null;
  highlight: boolean;
  savingsLabel: string;
  sku: string;
  image: string;
}

const image = '/images/daranca-duo.webp';
const rollerImage = '/images/product-placeholder.svg';

export const SET_OPTIONS: SetOption[] = [
  { id: 'set-serum-only', includes: ['stretch-serum'], qty: 1, totalPrice: 199, originalTotal: 249, label: 'سيروم Daranca ببتيدات النحاس 30ml', perUnitLabel: '199 ر.س', badge: null, highlight: false, savingsLabel: 'سيروم واحد', sku: 'SLR-SERUM-1', image },
  { id: 'set-roller-only', includes: ['stretch-cream'], qty: 1, totalPrice: 49, originalTotal: 99, label: 'ديرما رولر تيتانيوم 0.5mm', perUnitLabel: '49 ر.س', badge: null, highlight: false, savingsLabel: 'رولر واحد', sku: 'SLR-ROLLER-1', image: rollerImage },
  { id: 'set-complete', includes: ['stretch-serum', 'stretch-cream'], qty: 2, totalPrice: 249, originalTotal: 279, label: 'طقم Daranca — سيروم 30ml + ديرما رولر 0.5mm', perUnitLabel: 'الدفع عند الاستلام', badge: 'الطقم المتكامل', highlight: true, savingsLabel: 'سيروم + ديرما رولر', sku: 'SLR-SET-COMPLETE', image },
  { id: 'set-double', includes: ['stretch-serum', 'stretch-cream', 'stretch-serum'], qty: 3, totalPrice: 447, originalTotal: 498, label: 'عبوتا سيروم Daranca 30ml + ديرما رولر', perUnitLabel: '447 ر.س', badge: null, highlight: false, savingsLabel: 'عبوتان + ديرما رولر', sku: 'SLR-SET-DOUBLE', image },
];

export const PRODUCTS: Product[] = [
  {
    id: 'stretch-serum', slug: 'stretch-mark-serum',
    name: 'سيروم Daranca ببتيدات النحاس 30ml',
    subtitle: 'GHK-Cu Copper Peptide Serum',
    tagline: 'سيروم ببتيدات النحاس الأزرق · 30 مل',
    price: 199, originalPrice: 249, rating: 0, reviewCount: 0,
    badge: 'السيروم', badgeColor: 'gold', sku: 'SLR-SERUM-1',
    description: 'سيروم Daranca بببتيدات النحاس للعناية بمظهر بشرة الجسم، متوفر من Selora Beauty بعبوة 30 مل.',
    benefits: ['خطوة للعناية بمظهر البشرة وملمسها.', 'عبوة 30 مل تناسب روتين العناية اليومي.'],
    ingredients: [{ name: 'ببتيدات النحاس GHK-Cu', role: 'مكوّن السيروم', benefit: 'للعناية بمظهر البشرة.', icon: '🧪' }],
    howToUse: ['اتبع تعليمات الشركة المصنّعة على العبوة.', 'توقف عن الاستخدام إذا ظهر تهيج واستشر مختصاً عند الحاجة.'],
    images: [image], heroImage: image, imageBg: 'from-blue-900 to-slate-950',
  },
  {
    id: 'stretch-cream', slug: 'stretch-mark-cream',
    name: 'ديرما رولر تيتانيوم 0.5mm',
    subtitle: 'Titanium Derma Roller 0.5mm',
    tagline: 'ديرما رولر تيتانيوم 0.5mm',
    price: 49, originalPrice: 99, rating: 0, reviewCount: 0,
    badge: 'الديرما رولر', badgeColor: 'gold', sku: 'SLR-ROLLER-1',
    description: 'ديرما رولر تيتانيوم 0.5 ملم ضمن طقم العناية المتوفر من Selora Beauty.',
    benefits: ['أداة للعناية بالبشرة.', 'اتبع تعليمات التنظيف والاستخدام على العبوة.'],
    ingredients: [{ name: 'ديرما رولر 0.5mm', role: 'أداة العناية', benefit: 'تستخدم وفق تعليمات الشركة المصنّعة.', icon: '🪡' }],
    howToUse: ['اتبع تعليمات الشركة المصنّعة للتنظيف والاستخدام.', 'لا تستخدم الأداة على الجلد الملتهب أو المصاب واستشر مختصاً عند الحاجة.'],
    images: [rollerImage], heroImage: rollerImage, imageBg: 'from-blue-900 to-slate-950',
  },
];

export function getSetProducts(set: SetOption): Product[] {
  return set.includes.map((id) => PRODUCTS.find((product) => product.id === id)).filter((product): product is Product => Boolean(product));
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getCrossSells(currentSlug: string): Product[] {
  return PRODUCTS.filter((product) => product.slug !== currentSlug);
}

export function itemImages(item: { id?: string; sku?: string; name?: string }): string[] {
  const set = SET_OPTIONS.find((option) => option.id === item.id);
  if (set) return [set.image];
  const key = `${item.id || ''} ${item.sku || ''} ${item.name || ''}`.toLowerCase();
  return [key.includes('roller') || key.includes('رولر') || key.includes('cream') ? rollerImage : image];
}
