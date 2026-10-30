'use client';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import ProductCard from '@/components/ui/ProductCard';
import { getProduct, getCrossSells, SET_OPTIONS, getSetProducts } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';
import { trackAddToCart, trackViewContent } from '@/lib/pixels';
import { Star, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import AssetPlaceholder from '@/components/ui/AssetPlaceholder';

const REVIEWS = [
  { name: 'سارة م. — الرياض', rating: 5, text: 'تشققات الحمل بدأت تخف بشكل واضح بعد أسبوعين من استخدام الطقم الكامل. قوامه الزبدي يمتص بسرعة ويريح البشرة جداً.' },
  { name: 'نورة الغامدي — جدة', rating: 5, text: 'ما أعطى أي تهيج أبداً. البشرة نعمت وصار لون التشققات أفتح بكثير. معتمد من الغذاء والدواء وهذا طمأنني جداً.' },
  { name: 'منى الشمري — الدمام', rating: 5, text: 'جربت منتجات كثير قبل كذا وما أثرت. هذا الروتين فرق حقيقي — التغلغل سريع وملمس البشرة اختلف تماماً.' },
];

export default function ProductPage({ params }: { params: { slug: string; locale: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const crossSells = getCrossSells(params.slug);
  const router = useRouter();
  const { setMainSet, openCheckout } = useCartStore();
  const gallery = Array.from(new Set([...product.images.filter(i => i !== product.heroImage), product.heroImage].filter(Boolean))) as string[];
  const [selectedSetId, setSelectedSetId] = useState('set-duo');
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howto'>('benefits');
  const [added, setAdded] = useState(false);

  // Pixel: ViewContent on product page load
  useEffect(() => {
    trackViewContent({ id: product.id, name: product.name, price: product.price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const selectedSet = SET_OPTIONS.find((s) => s.id === selectedSetId)!;
  const setProducts = getSetProducts(selectedSet);
  const includesLabels = setProducts.map((p) => p.name);

  const buildCartItem = () => ({
    id: selectedSet.id,
    name: selectedSet.label,
    price: selectedSet.totalPrice,
    originalPrice: selectedSet.originalTotal,
    imageBg: product.imageBg,
    includes: includesLabels.length > 1 ? includesLabels : undefined,
    sku: selectedSet.sku,
  });

  const handleBuyNow = () => {
    setMainSet(buildCartItem());
    openCheckout();   // InitiateCheckout fires via the popup's open effect
  };

  const handleAddToCart = () => {
    trackAddToCart({ id: selectedSet.id, sku: selectedSet.sku, name: selectedSet.label, price: selectedSet.totalPrice });
    setMainSet(buildCartItem());
    setAdded(true);
    setTimeout(() => { setAdded(false); router.push(`/${params.locale}/cart`); }, 900);
  };

  const discount = Math.round((1 - selectedSet.totalPrice / selectedSet.originalTotal) * 100);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50 pt-24 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="text-xs text-stone-400 mb-6 flex items-center gap-2">
            <a href="/ar" className="hover:text-stone-700 transition-colors">الرئيسية</a>
            <span>/</span>
            <a href="/ar/products" className="hover:text-stone-700 transition-colors">عناصر الطقم</a>
            <span>/</span>
            <span className="text-stone-600 font-bold">{product.name}</span>
          </nav>

          {/* ── Main grid ── */}
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">

            {/* Image gallery */}
            <div className="md:sticky md:top-24">
              <div className="relative rounded-3xl shadow-md border border-stone-200 aspect-[3/4] overflow-hidden" style={{ background: '#FDFAF6' }}>
                {/* TODO(asset): product hero — replace with the real photo described below */}
                <AssetPlaceholder
                  label="Product Hero Shot"
                  note="صورة المنتج الرئيسية للصفحة: العبوة بزاوية 45° على خلفية بيج فاتحة، إضاءة استوديو ناعمة، ظل أرضي خفيف — عالية الدقة لأنها أكبر صورة في الصفحة. عمودية 3:4."
                  ratio="aspect-[3/4]"
                />

                {/* Badges */}
                <div className="absolute top-4 start-4 flex flex-col gap-1.5">
                  <span className="bg-amber-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow">{product.badge}</span>
                </div>
                <div className="absolute top-4 end-4 bg-red-600 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow">
                  -{discount}%
                </div>
              </div>

              {/* Thumbnails → gallery asset slots */}
              {gallery.length > 1 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {gallery.map((src, i) => {
                    const notes = [
                      'لقطة قريبة للملمس: قطرة سيروم زرقاء على البشرة تُظهر القوام الحريري.',
                      'صورة استخدام: يد تضع الرولر على الذراع/البطن — تبيع «طريقة الاستعمال» بدون شرح.',
                      'صورة الطقم معاً: السيروم + الرولر + العبوة الخارجية — تبني إحساس القيمة.',
                    ];
                    return (
                      <AssetPlaceholder
                        key={i}
                        label={`Gallery Shot ${i + 1}`}
                        note={notes[i] || 'صورة لقطة إضافية للمنتج بنفس الجلسة التصويرية.'}
                        ratio="aspect-square"
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div>
                <span className="badge-clinical mb-2">{product.tagline}</span>
                <h1 className="text-3xl md:text-4xl font-black text-stone-900 leading-tight mt-1">{product.name}</h1>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={17} className={i < Math.floor(product.rating) ? 'star fill-amber-400' : 'text-stone-200'} />)}
                </div>
                <span className="font-black text-stone-900">{product.rating}</span>
                <span className="text-sm text-stone-500">({product.reviewCount.toLocaleString('ar-SA')} تقييم موثق)</span>
              </div>

              {/* Description */}
              <p className="text-base text-stone-600 leading-relaxed">{product.description}</p>

              {/* ── Pricing tiers — the set options ── */}
              <div className="flex flex-col gap-2.5">
                <span className="font-extrabold text-stone-900 text-base">طقمكِ الكامل — عرض واحد واضح:</span>
                {SET_OPTIONS.map((set) => (
                  <button
                    key={set.id}
                    onClick={() => setSelectedSetId(set.id)}
                    className={cn(
                      'flex items-center gap-4 rounded-2xl p-4 border-2 text-start transition-all relative',
                      selectedSetId === set.id ? 'border-amber-600 bg-amber-50/70 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'
                    )}
                  >
                    {set.badge && (
                      <span className="absolute -top-2.5 start-4 bg-amber-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                        {set.badge}
                      </span>
                    )}
                    <div
                      className="w-14 h-14 rounded-xl border border-stone-200 flex-shrink-0 flex items-center justify-center"
                      style={{ background: '#FBF3E4' }}
                      title="TODO(asset): أيقونة مصغرة للطقم — نفس Hero Product Shot مصغّرة"
                    >
                      <span className="text-xl">🎁</span>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: selectedSetId === set.id ? '#A87830' : '#B0998A' }}
                    >
                      {selectedSetId === set.id && <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm text-stone-900">{set.label}</div>
                      <div className="text-xs text-emerald-600 font-bold mt-0.5">{set.savingsLabel} · {set.perUnitLabel}</div>
                    </div>
                    <div className="text-end">
                      <div className="font-black text-lg text-stone-900">{set.totalPrice} <span className="text-xs">ر.س</span></div>
                      <div className="text-xs text-stone-400 line-through">{set.originalTotal}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-4 border border-stone-200 text-stone-700 space-y-1 shadow-sm">
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <span>✓ متاح الدفع عند الاستلام بعد فحص الطلب</span>
                </p>
                <p className="text-xs text-stone-500 font-medium">🚚 شحن سريع لكافة مدن المملكة (١-٣ أيام لباب منزلك)</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <button onClick={handleBuyNow} className="btn-gold w-full text-lg py-5 shadow-xl font-black animate-cta-pulse">
                  اطلبي الآن — {selectedSet.totalPrice} ر.س (دفع عند الاستلام)
                </button>
                <button
                  onClick={handleAddToCart}
                  className={cn('btn-outline w-full py-4 text-base font-bold', added && 'bg-stone-900 text-white border-stone-900')}
                >
                  {added ? '✓ تمت الإضافة للسلة' : 'أضيفي للسلة'}
                </button>
              </div>

              {/* Guarantee */}
              <p className="text-sm text-emerald-700 font-bold flex items-center gap-2">
                <RotateCcw size={16} />
                ضمان ذهبي لاسترداد كامل المبلغ خلال ٣٠ يوماً في حال عدم الرضا
              </p>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { i: <ShieldCheck size={13} />, t: 'دفع آمن' },
                  { i: <Truck size={13} />, t: 'شحن ١-٣ أيام' },
                  { i: <RotateCcw size={13} />, t: 'ضمان ٣٠ يوم' },
                ].map((x, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-white rounded-xl px-2.5 py-2 border border-stone-100 text-xs font-bold text-stone-600">
                    <span className="text-amber-500">{x.i}</span>{x.t}
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="border-t border-stone-100 pt-5">
                <div className="flex gap-1 mb-5 bg-stone-100 rounded-xl p-1">
                  {[
                    { key: 'benefits', label: 'الفوائد' },
                    { key: 'ingredients', label: 'المكونات' },
                    { key: 'howto', label: 'طريقة الاستخدام' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all',
                        activeTab === tab.key
                          ? 'bg-white text-stone-900 shadow-sm'
                          : 'text-stone-500 hover:text-stone-700'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'benefits' && (
                  <ul className="space-y-2.5">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                        <span className="text-amber-500 font-black mt-0.5">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'ingredients' && (
                  <div className="grid gap-3">
                    {product.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-start gap-3 bg-stone-50 rounded-xl p-3 border border-stone-100">
                        <span className="text-xl flex-shrink-0">{ing.icon}</span>
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{ing.name}</div>
                          <div className="text-xs text-stone-400">{ing.benefit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'howto' && (
                  <ol className="space-y-3">
                    {product.howToUse.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-black flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>

          {/* ── Clinical Superiority Comparison Section ── */}
          <div className="mb-20 pt-10 border-t border-stone-200">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="badge-clinical mb-3">لماذا تختارين سيلورا؟</span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                لماذا يتفوق طقم سيلورا على البدائل التقليدية؟
              </h2>
              <p className="text-sm text-stone-600 mt-2">
                مقارنة توضح الفارق بين العناية العميقة بطبقة الأدمة والمنتجات السطحية في السوق
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Comparison 1: Needles */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                  <span className="text-2xl">🪡</span>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-lg">إبر التيتانيوم 540 مقابل الإبر القديمة</h3>
                    <p className="text-xs text-stone-500">أمان الجلد ومنع الندبات والخدوش</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200">
                    <div className="font-bold text-sm text-emerald-900 flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</span>
                      إبر تيتانيوم سيلورا (Titanium 540 مقاس 0.5mm):
                    </div>
                    <ul className="text-xs text-emerald-800 space-y-1 pe-2 leading-relaxed font-medium">
                      <li>• تيتانيوم طبي صلب غير قابل للانثناء أو الصدأ مع الاستخدام المتكرر.</li>
                      <li>• مقاس 0.5mm دقيق يفتح قنوات ميكروسكوبية نظيفة بدون جروح أو نزيف.</li>
                      <li>• تحفيز ذاتي فوري لخلايا الكولاجين دون تمزيق الأنسجة.</li>
                      <li>• معقمة مسبقاً داخل كبسولة حفظ محكمة.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200">
                    <div className="font-bold text-sm text-rose-900 flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">✕</span>
                      الإبر القديمة الرخيصة (Stainless Steel التجارية):
                    </div>
                    <ul className="text-xs text-rose-800 space-y-1 pe-2 leading-relaxed font-medium">
                      <li>• إبر ستانلس ستيل تنثني وتفقد حدتها وتتحول لرؤوس خطافية بعد أسبوعين.</li>
                      <li>• الإبر المنثنية تخدش وتمزق الجلد وتزيد مظهر التشققات سوءاً!</li>
                      <li>• تتأكسد مع الرطوبة وتسبب تهيجاً وعدوى بكتيرية.</li>
                      <li>• غير معقمة وتفتقر لمعايير الجودة الموثوقة.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Comparison 2: Serum */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                  <span className="text-2xl">🧬</span>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-lg">سيروم ببتيدات النحاس مقابل الزيوت التقليدية</h3>
                    <p className="text-xs text-stone-500">الوصول لطبقة الأدمة العميقة مقابل الترطيب السطحي</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200">
                    <div className="font-bold text-sm text-amber-950 flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">✓</span>
                      سيروم سيلورا (Blue Copper Peptide + CICA 100ml):
                    </div>
                    <ul className="text-xs text-amber-900 space-y-1 pe-2 leading-relaxed font-medium">
                      <li>• جزيئات نانو دقيقة تخترق مباشرة لطبقة الأدمة حيث مكان التمزق.</li>
                      <li>• تحفيز مباشر لخلايا الفايبروبلاست لردم الخطوط وإعادة نسج الإيلاستين.</li>
                      <li>• تفتيح مثبت للتشققات الحمراء والبنفسجية بفضل السيكا والنياسيناميد.</li>
                      <li>• حجم 100ml كبير وقوام مائي فائق الامتصاص بدون أي لزوجة أو دهون.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-100/90 border border-stone-200">
                    <div className="font-bold text-sm text-stone-800 flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-stone-400 text-white flex items-center justify-center text-xs">✕</span>
                      زيوت وكريمات السوق العادية (بايو أويل / زبدة عادية):
                    </div>
                    <ul className="text-xs text-stone-600 space-y-1 pe-2 leading-relaxed font-medium">
                      <li>• جزيئات زيتية ضخمة (+500 Dalton) تعجز عن عبور حاجز الجلد الخارجي.</li>
                      <li>• ترطيب سطحي مؤقت يزول بالماء دون علاج التمزق الداخلي.</li>
                      <li>• صفر تحفيز للكولاجين الجديد في النسيج المتصلب.</li>
                      <li>• ملمس زيتي ثقيل يلطخ الملابس ويسبب إزعاجاً مستمراً.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Product Reviews ── */}
          <div className="mb-16">
            <h2 className="text-2xl font-black text-stone-900 mb-6">آراء وتجارب العملاء الموثقة</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} className={j < r.rating ? 'star fill-amber-400' : 'text-stone-200'} />)}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-3">&ldquo;{r.text}&rdquo;</p>
                  <div className="font-bold text-sm text-stone-900">{r.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Cross-sells ── */}
          {crossSells.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-stone-900 mb-2">أكملي روتينكِ</h2>
              <p className="text-stone-400 text-sm mb-8">
                <Check size={14} className="inline text-emerald-600" /> يعمل بشكل مثالي مع {product.name}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-2xl">
                {crossSells.map((p) => (
                  <ProductCard key={p.id} product={p} locale={params.locale} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CheckoutPopup />
    </>
  );
}
