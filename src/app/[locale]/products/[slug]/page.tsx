'use client';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutPopup from '@/components/ui/CheckoutPopup';
import ProductCard from '@/components/ui/ProductCard';
import { getProduct, getCrossSells, SET_OPTIONS, getSetProducts } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { Star, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [activeImg, setActiveImg] = useState(gallery[0]);
  const [selectedSetId, setSelectedSetId] = useState('set-complete');
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howto'>('benefits');
  const [added, setAdded] = useState(false);

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
    openCheckout();
  };

  const handleAddToCart = () => {
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
            <a href="/ar/products" className="hover:text-stone-700 transition-colors">المنتجات</a>
            <span>/</span>
            <span className="text-stone-600 font-medium">{product.name}</span>
          </nav>

          {/* ── Main grid ── */}
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">

            {/* Image gallery — 3 placeholders per product */}
            <div className="md:sticky md:top-24">
              <div className="relative bg-white rounded-3xl shadow-sm border border-stone-100 aspect-[3/4] flex items-center justify-center overflow-hidden">
                <img
                  src={activeImg}
                  alt={product.name}
                  className={`w-full h-full ${activeImg.endsWith('.png') ? 'object-contain p-8' : 'object-cover'}`}
                />

                {/* Badges */}
                <div className="absolute top-4 start-4 flex flex-col gap-1.5">
                  <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow">{product.badge}</span>
                </div>
                <div className="absolute top-4 end-4 bg-red-500 text-white text-sm font-black px-2.5 py-1.5 rounded-xl shadow">
                  -{discount}%
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImg(src)}
                      className={`bg-white rounded-xl border aspect-square flex items-center justify-center p-1.5 overflow-hidden transition-all cursor-pointer ${
                        activeImg === src ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-stone-100 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-bold text-amber-600 mb-2">{product.tagline}</p>
                <h1 className="text-3xl md:text-4xl font-black text-stone-900 leading-tight">{product.name}</h1>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={17} className={i < Math.floor(product.rating) ? 'star fill-amber-400' : 'text-stone-200'} />)}
                </div>
                <span className="font-black text-stone-900">{product.rating}</span>
                <span className="text-sm text-stone-400">({product.reviewCount.toLocaleString('ar-SA')} تقييم)</span>
              </div>

              {/* Description */}
              <p className="text-base text-stone-600 leading-relaxed">{product.description}</p>

              {/* ── Pricing tiers — the 4 set options ── */}
              <div className="flex flex-col gap-2.5">
                <span className="font-bold text-stone-900">اختاري الطقم المناسب لكِ:</span>
                {SET_OPTIONS.map((set) => (
                  <button
                    key={set.id}
                    onClick={() => setSelectedSetId(set.id)}
                    className={cn(
                      'flex items-center gap-4 rounded-2xl p-4 border-2 text-start transition-all relative',
                      selectedSetId === set.id ? 'border-amber-500 bg-amber-50' : 'border-stone-100 bg-white hover:border-amber-200'
                    )}
                  >
                    {set.badge && (
                      <span className="absolute -top-2.5 start-4 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                        {set.badge}
                      </span>
                    )}
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: selectedSetId === set.id ? '#C4943E' : '#D6C6B4' }}
                    >
                      {selectedSetId === set.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C4943E' }} />}
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

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                <p className="text-sm text-stone-500">شامل ضريبة القيمة المضافة ١٥٪</p>
                <p className="text-sm text-stone-500 font-medium mt-1">💳 دفع عند الاستلام · Tabby/Tamara · Apple Pay/مدى</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <button onClick={handleBuyNow} className="btn-gold w-full text-lg py-5 animate-cta-pulse">
                  اطلبي الآن — {selectedSet.totalPrice} ر.س
                </button>
                <button
                  onClick={handleAddToCart}
                  className={cn('btn-outline w-full', added && 'bg-stone-900 text-white border-stone-900')}
                >
                  {added ? '✓ تمت الإضافة للسلة' : 'أضيفي للسلة'}
                </button>
              </div>

              {/* Guarantee */}
              <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                <RotateCcw size={14} />
                ضمان استرداد كامل خلال ٣٠ يوماً إذا لم ترَي نتيجة
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

          {/* ── Product Reviews ── */}
          <div className="mb-16">
            <h2 className="text-2xl font-black text-stone-900 mb-6">آراء العملاء</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {REVIEWS.map((r, i) => (
                <div key={i} className="card">
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
